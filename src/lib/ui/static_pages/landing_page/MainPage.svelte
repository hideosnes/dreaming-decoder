<script lang='ts'>
    import { onMount } from 'svelte';
    import { changeTimeFormat } from '$lib/utils';
	import { fetchEpisodes, type Episode } from '$lib/pocketbase/pb_episodes';
    import { Play, Pause, Download, Bookmark  } from '$lib/ui/icons'

    let episodes = $state<Episode[]>([])
    let isLoading = $state(true)
    let error = $state<string|null>(null)

    async function loadEpisodes() {
        try {
            isLoading = true
            error = null

            episodes = await fetchEpisodes({
                filter: 'isPublished = true',
                sort: '-created'
            })
        } catch (err) {
            error = err instanceof Error ? err.message : 'Error(_unknown): Failed to load episodes'
        } finally {
            isLoading = false
        }
    }

    onMount(() => { loadEpisodes() })

</script>

<div class="w-full h-8/12 bg-linear-to-b from-slate-900 to-slate-950">
    {#if isLoading}
        <div class="p-4 text-white">Loading episodes...</div>
    {:else if error}
        <div class="p-4 text-red-400">Error: {error}</div>
    {:else if episodes.length === 0}
        <div class="p-4 text-white">No episodes found...</div>
    {:else}
        <div class="flex flex-col gap-4 px-5 py-3 antialiased">
            {#each episodes as episode (episode.id) }
                {#if episode.isPublished === true}
                    <div class="relative w-full h-25 py-2 px-4 bg-linear-to-r from-emerald-400 to-emerald-200 text-indigo-500 rounded-xl rounded-br-4xl">
                            <div class="text-[15px] font-black uppercase">
                                {episode.name}
                            </div>
                            <div class="text-xs text-indigo-800 ">
                                {changeTimeFormat(episode.duration, 'seconds')} | {episode.speaker}
                            </div>
                            <button class="
                                absolute bottom-2 right-2 w-12 h-12 
                                bg-transparent focus:bg-indigo-500
                                rounded-full
                                border-0 hover:border-2 border-indigo-500
                                text-indigo-400 hover:text-indigo-500 focus:text-indigo-100
                                flex justify-center items-center
                            ">
                                {@html Play()}
                            </button>
                    </div>
                {/if}
            {/each}
        </div>
    {/if}
</div>
