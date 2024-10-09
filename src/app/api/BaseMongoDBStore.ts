import {Collection, Db, Document, MongoClient} from "mongodb"
require('dotenv').config()

type MongoDBDataSourceProps = {
    db: DBProps,
    client: ClientProps,
    collection: CollectionProps,
}
type DBProps = {
    name?: string
}
type ClientProps = {
    uri?: string
}
type CollectionProps = {
    name: string
}

export default class BaseMongoDBStore<TDocument extends Document> {

    private readonly client : MongoClient
    protected readonly collection : Collection<TDocument>

    constructor(props: MongoDBDataSourceProps) {
        const uri = props.client.uri || process.env.MONGO_MONITORING_URI
        if (uri === undefined) throw new Error("In enviroment does not have uri for MongoClient")
        this.client = new MongoClient(uri)
        const db: Db = this.client.db(props.db.name || "networkMonitoring")
        this.collection = db.collection<TDocument>(props.collection.name)
    }

    protected async connect() {
        return this.client.connect()
    }

    protected async close() {
        return this.client.close()
    }
}