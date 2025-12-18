import { writable } from "svelte/store";
import { getAudioUrl, type Episode, fetchEpisodes } from "$lib/pocketbase";

export interface AudioState {
    isPublished: boolean
    isPlaying: boolean
    currentEpisode: Episode | null
    audioUrl: string | null
    episodes: Episode[]
    isLoading: boolean
}

export const audioState = writable<AudioState>({
    isPublished: false,
    isPlaying: false,
    currentEpisode: null,
    audioUrl: null,
    episodes: [],
    isLoading: false
})

export async function loadEpisodes() {
    audioState.update(state => ({ ...state, isLoading: true}))

    try {
        const episodes = await fetchEpisodes({
            filter: 'isPublished = true',
            sort: '-created'
        })

        audioState.update(state => ({
            ...state,
            episodes,
            isLoading: false
        }))

        setDefaultEpisode(episodes)
    } catch (err) {
        console.error('Failed to load episodes:', err)
        audioState.update(state => ({ ...state, isLoading: false }))
    }
}

export function setEpisode(episode: Episode) {
    audioState.update(state => ({
        ...state,
        currentEpisode: episode,
        audioUrl: getAudioUrl(episode),
        isPlaying: true // start playing immediately
    }))
}

export function togglePlayPause() {
    audioState.update(state => ({ ...state, isPlaying: !state.isPlaying }))
}

export function stopPlayback() {
    audioState.update(state => ({ ...state, isPlaying: false }))
}

export function clearEpisode() {
    audioState.update(state => ({
        ...state,
        currentEpisode: null,
        audioUrl: null,
        isPlaying: false
    }))
}

export function setDefaultEpisode(episodes: Episode[]) {
    if (!episodes.length) return

    const sorted = [...episodes].sort((a,b) => {
        const aTime = new Date(a.updated ?? a.created).getTime()
        const bTime = new Date(b.updated ?? b.created).getTime()
        return bTime - aTime
    })
    const latestEpisode = sorted[0]
    audioState.update(state => {
        if (!state.currentEpisode) {
            return {
                ...state,
                currentEpisode: latestEpisode,
                audioUrl: getAudioUrl(latestEpisode),
                isPlaying: false // paused until user clicks pay
            }
        }
        return state
    })
}