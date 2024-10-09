import { Document } from "mongodb"
import MTime from "@/lib/MTime"
import BaseMongoDBStore from "../BaseMongoDBStore"
import type { FilterForFindNew, Item, Store } from "./requestsHandlers"
import { NetworkName } from "@/app/page"

interface NCSDocument{
    metadata: Metadata
    measurements: Measurements
    timestamp: Date
}
interface Metadata {
    network: NetworkName
}
interface Measurements {
    ping: NetworkPing
}
interface NetworkPing {
    time: number
}

type Options = {
    db?: DBOptions,
    client?: ClientOptions
}
type DBOptions = {
    name?: string
}
type ClientOptions = {
    uri?: string
}

export class MongoDBStore extends BaseMongoDBStore<NCSDocument> implements Store {

    constructor(options: Options = {}) {
        const {db = {}, client = {}} = options
        super({db, client, collection: {name: "networkCanalsStates"}})
    }

    public async insert(items: Item[]): Promise<void> {
        const documents = items.map<NCSDocument>(item => MongoDBAdapter.toMongoDBDocument(item))
        await this.connect()
        await this.collection.insertMany(documents)
        await this.close()
    }

    public async findNew(filter: FilterForFindNew): Promise<Item[]> {
        const earlierTime = {$gt: MTime.earlier(filter.time)}
        await this.connect()
        const pipeline: Document[] = []
        pipeline.push({$match: {timestamp: earlierTime}})
        pipeline.push({$sort: {timestamp: 1}})
        pipeline.push({
            $group: {
                _id: "$metadata.network", 
                timestamp: {$last: "$timestamp"}, 
                metadata: {$last: "$metadata"}, 
                measurements: {$last: "$measurements"}
            }
        })
        pipeline.push({$sort: {timestamp: 1}})
        pipeline.push({$unset: ["_id"]})
        const cursor = this.collection.aggregate<NCSDocument>(pipeline)
        const docs: NCSDocument[] = await cursor.toArray()
        await this.close()
        return docs.map<Item>(doc => MongoDBAdapter.toPOSTHandlerItem(doc))
    }

    public async drop(): Promise<void> {
        await this.connect()
        await this.collection.drop() 
        await this.close()
    }
}

class MongoDBAdapter {
    static toPOSTHandlerItem(document: NCSDocument): Item {
        return {
            metadata: document.metadata,
            measurements: document.measurements,
            timestamp: new Date(document.timestamp)
        }
    }

    static toMongoDBDocument(item: Item): NCSDocument {
        return {
            timestamp: item.timestamp,
            metadata: item.metadata,
            measurements: item.measurements,
        }
    }
}