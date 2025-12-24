import PocketBase from "pocketbase"

export function createPB() {
    
    // server-side: use Dokploy service 
    if (typeof window === 'undefined') {
        return new PocketBase(import.meta.env?.POCKETBASE_URL)
    }

    // client-side: use public pb-api via HTTPS
    return new PocketBase('https://pb.app.homahuki.eu')
}

const pb = createPB()
export default pb