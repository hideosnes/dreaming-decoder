import PocketBase from "pocketbase"

// this should actually run in a server.ts file to cleanly separate c&s
export function createPB() {
    
    // server-side: use Dokploy service 
    if (typeof window === 'undefined') {
        return new PocketBase(import.meta.env?.POCKETBASE_URL)
    }

    // client-side: use public pb-api via HTTPS
    return new PocketBase('https://pb.dreaming-decoder.homahuki.eu')
}

const pb = createPB()
export default pb