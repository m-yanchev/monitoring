import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoDBStore } from '@/app/api/networkcanalsstates/MongoDBStore'
import { Item } from '@/app/api/networkcanalsstates/requestsHandlers'
import MTime from '@/lib/MTime'
require('dotenv').config()

describe("networkCanalsStates.MongoDBStore without use MongoDB", () => {

    const mockItems: Item[] = [{
        metadata: {network: "local"},
        measurements: {ping: {time: 67}},
        timestamp: new Date(2024, 8, 8, 16, 35)
    }, {
        metadata: {network: "starlink"},
        measurements: {ping: {time: 367}},
        timestamp: new Date(2024, 8, 8, 16, 35, 0, 20)
    }, {
        metadata: {network: "local"},
        measurements: {ping: {time: 70}},
        timestamp: MTime.earlier(9)
    }, {
        metadata: {network: "starlink"},
        measurements: {ping: {time: 1598}},
        timestamp: MTime.earlier(8)
    }, {
        metadata: {network: "local"},
        measurements: {ping: {time: 170}},
        timestamp: MTime.earlier(7)
    }, {
        metadata: {network: "starlink"},
        measurements: {ping: {time: 598}},
        timestamp: MTime.earlier(6)
    }]
   
    let mongod: MongoMemoryServer | null = null
    let store: MongoDBStore | null = null

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create()
        const uri = mongod.getUri()
        store = new MongoDBStore({client: {uri}})
        await store.drop()
        await store.insert(mockItems)
    })

    afterAll(() => {
        return mongod?.stop() 
    })

    test('insert(items), findNew(filter) filter={time: 10}', async () => {
        expect(await store?.findNew({time: 10})).toEqual([mockItems[4], mockItems[5]])
    })

    test('insert(items), findNew(filter) filter={time: 5}, no new documents', async () => {
        expect(await store?.findNew({time: 5})).toEqual([])
    })
})

describe("networkCanalsStates.MongoDBStore with use MongoDB", () => {

    const mockItems: Item[] = [{
        metadata: {network: "kyivstar"},
        measurements: {ping: {time: 67}},
        timestamp: MTime.earlier(1)
    }, {
        metadata: {network: "tooway"},
        measurements: {ping: {time: 367}},
        timestamp: MTime.cur()
    }]


    let store: MongoDBStore | null = null

    beforeAll(async () => {
        store = new MongoDBStore({client: {uri: process.env.MONGO_TESTER_URI}, db: {name: "testNetworkMonitoring"}})
        await store.insert(mockItems)
    })

    test(`insert(items), findNew(filter) filter={time: 5}`, async () => {
        expect(await store?.findNew({time: 5})).toEqual(mockItems)
    })
})