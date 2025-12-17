import pb from "./pocketbaseClient"

export type Episode = {
    id: string,
    isPublished: boolean,
    audio_file: string,
    name: string,
    description: string,
    duration: number,
    category: string,
    speaker: string,
    created: string,
    updated: string
}

export async function fetchEpisodes(
    options: {
        filter?: string
        sort?: string
        expand?: string
        page?: number
        perPage?: number
        $cancelKey?: string
}): Promise<Episode[]> {
    const result = await pb.collection<Episode>("_EPISODES").getList(
        options.page ?? 1,
        options.perPage ?? 100,
        {
            filter: options.filter,
            sort: options.sort,
            expand: options.expand,
            $cancelKey: options.$cancelKey
        }

    )

    return result.items
}

export function getAudioUrl(episode: Episode) {
    return pb.files.getURL(episode, episode.audio_file)
}