import { MongoDBStore } from "./MongoDBStore"
import { PostHandler, GetHandler } from "./requestsHandlers"

export function POST(request: Request): Promise<Response> {
    const store = new MongoDBStore()
    const handler = new PostHandler({store, request})
    return handler.handle()
}

export function GET() {    
    const store = new MongoDBStore()
    const handler = new GetHandler({store})
    return handler.handle()
}