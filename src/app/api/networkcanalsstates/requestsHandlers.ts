import { NetworkName, FetchItem } from "@/app/page"

export interface Item {
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

export interface NetworkMeasuring {
    network: NetworkName
    ping: string
}

export interface Store {
    insert: (items: Item[]) => Promise<void>
    findNew: (filter: FilterForFindNew) => Promise<Item[]>
}
export interface FilterForFindNew {
    time: number
}

type PostHandlerProps = {
    store: Store
    request: Request
}

type GetHandlerProps = {
    store: Store
}

export class PostHandler {

    private readonly store: Store
    private readonly request: Request

    constructor({store, request}: PostHandlerProps) {
        this.store = store
        this.request = request
    }

    private async parseRequestDataToItems(): Promise<Item[]> {
        const measurings: NetworkMeasuring[] = await this.request.json()
        return measurings.map<Item>((measuring) => ({
            timestamp: new Date(),
            metadata: {network: measuring.network},
            measurements: {ping: {time: measuring.ping === "" ? -1 : Number(measuring.ping.slice(6, 8) + measuring.ping.slice(9, 12))}}
        }))
    }

    private async insertRequestDataToStore(): Promise<void> {
        const items = await this.parseRequestDataToItems()
        await this.store.insert(items)
    }

    public async handle(): Promise<Response> {
        await this.insertRequestDataToStore()
        const RESPONSE_OPTIONS = {status: 200, statusText: "Data received"}
        return new Response(null, RESPONSE_OPTIONS)
    }
}

export class GetHandler {

    private readonly store: Store

    constructor({store}: GetHandlerProps) {
        this.store = store
    }

    private getNewItemsFromStore(): Promise<(Item)[]> {
        return this.store.findNew({time: 5})
    }

    private async parseItemsToResponseData(): Promise<FetchItem[]> {
        const items = await this.getNewItemsFromStore()
        return items.map<FetchItem>(item => ({network: item.metadata.network, ping: item.measurements.ping.time}))
    }

    public async handle(): Promise<Response> {

        const data: FetchItem[] = await this.parseItemsToResponseData()

        const bodyJSON = JSON.stringify(data)        
        const RESPONSE_OPTIONS = {status: 200}
        return new Response(bodyJSON, RESPONSE_OPTIONS)
    }
}