import PocketBase from "pocketbase"

export function createPB() {
    const url = import.meta.env?.POCKETBASE_URL ||
                import.meta.env?.DEV
                    ? 'http://127.0.0.1:8090'
                    : 'http://dreaming-decoder-pocketbase-tedji6:8090'
    return new PocketBase(url)
}

const pb = createPB()
export default pb