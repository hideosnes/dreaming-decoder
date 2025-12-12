import { writable } from 'svelte/store'

export const episodesStore = writable<Episode[]>([])
export const loadingStore = writable(true)
export const errorStore = writable<string|null>(null)