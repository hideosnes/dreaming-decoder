import pb from "./pocketbaseClient"
import type { Episode } from './pb_episodes'

export type Link = {
    link: string,
    description: string,
    relation: string,
    target: string
}

export type Metadata = {
    id: string,
    isActive: boolean,
    blogName: string,
    subtitle: string,
    about: string,
    creator: string,
    impressum: JSON, // todo!
    links: Record<string, Link>,
    relation_: string | Episode,
    imgLogo: string,
    created: string,
    updated: string
}

let localMetadata: Metadata | null = null

export async function fetchMetadata(): Promise<void> {
    if (localMetadata) { return } // already loaded

    try {
        localMetadata = await pb.collection<Metadata>("_METADATA").getFirstListItem("isActive = true")
    } catch {
        localMetadata = null
    }

/*     const onlyOneRecordForMetadata = await pb.collection<Metadata>('_METADATA').getFullList()
    localMetadata = onlyOneRecordForMetadata[0] || null */
}

export function getLocalMetadata(): Metadata | null {
    return localMetadata
}

export function getLogoUrl(metadata: Metadata): string {
    return pb.files.getURL(metadata, metadata.imgLogo)
}

// --- LINKS --- //
// get all links as an array
export function getLinks(): Link[] {
    const links = localMetadata?.links
    if (!links) return []

    return Object.values(links) // convert object to an array of links
}
// get the number of links
export function getLinksCount(): number {
    const links = localMetadata?.links
    if(!links) return 0

    return Object.keys(links).length
}