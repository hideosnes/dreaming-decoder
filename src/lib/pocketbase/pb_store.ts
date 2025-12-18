import { writable } from 'svelte/store'
import { type Episode } from './pb_episodes'

export const episodesStore = writable<Episode[]>([])
export const loadingStore = writable(true)
export const errorStore = writable<string|null>(null)