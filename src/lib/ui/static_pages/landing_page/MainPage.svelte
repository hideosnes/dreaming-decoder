<script lang='ts'>
    import { onDestroy, onMount } from 'svelte';
    import { changeTimeFormat, changeDateFormat } from '$lib/utils';
	import { type Episode } from '$lib/pocketbase/pb_episodes';
    import { audioState, type AudioState, setEpisode, togglePlayPause } from '$lib/audio/audioStore';
    import { Play, Pause, Download, Bookmark  } from '$lib/ui/icons'

    let currentAudioState = $state<AudioState | null>(null)
    let unsubscribe: (() => void) | null = null

    onMount(() => {
        unsubscribe = audioState.subscribe((state) => {
            currentAudioState = state
        }) 
    })

    function handlePlayEpisode(episode: Episode) {
        if (currentAudioState?.currentEpisode?.id === episode.id ) {
            togglePlayPause()
        } else {
            setEpisode(episode)
        }
    }

    // cleanup subscription
    onDestroy(() => {
        if (unsubscribe) unsubscribe()
    })
</script>

<main id="responsive" class="h-full bg-linear-to-b from-slate-900 to-slate-950 px-0 md:px-[15%] xl:px-[30%]">
    {#if $audioState.isLoading}
        <div class="p-4 text-white">Loading episodes...</div>
    {:else if $audioState.episodes.length === 0}
        <div class="p-4 text-slate-700">Coming soon...</div>
    {:else}
        <div class="flex flex-col gap-4 px-4 py-3 antialiased">
            {#each $audioState.episodes as episode (episode.id) }
                {#if episode.isPublished === true}
                    <div class="relative w-full h-auto p-4 bg-linear-to-r from-emerald-400 to-emerald-200 text-indigo-800 rounded-xl rounded-br-4xl">
                            <div class="text-lg font-bold uppercase">
                                {episode.name}
                            </div>
                            <div id="episode-meta" class="text-sm">
                                <div class="pb-2">
                                    {changeTimeFormat(episode.duration, 'seconds')}
                                    <span class="px-1.5">|</span>
                                        {episode.speaker}
                                    <span class="px-1.5">|</span>
                                        {changeDateFormat(episode.created)}
                                    <div>
                                        {#each episode.category as category} 
                                            <span class="pr-1 italic">{category},</span>
                                        {/each}
                                    </div>
                                </div>
                                <div class="w-5/6 truncate">
                                    {episode.description}
                                </div>
                            </div>
                            <button 
                                class="
                                    absolute bottom-2 right-2 w-12 h-12 cursor-pointer
                                    flex justify-center items-center
                                    bg-transparent rounded-full 
                                    transition-color duration-500 hover:bg-indigo-500 hover:text-indigo-100
                                    "
                                onclick={() => handlePlayEpisode(episode)}

                                aria-label={
                                    currentAudioState?.currentEpisode?.id 
                                    === episode.id && currentAudioState.isPlaying
                                    ? `Pause ${episode.name}`
                                    : `Play ${episode.name}`
                                }

                                aria-pressed={
                                    currentAudioState?.currentEpisode?.id
                                    === episode.id && currentAudioState.isPlaying
                                }
                            >
                                {#if 
                                    currentAudioState?.currentEpisode?.id
                                    === episode.id && currentAudioState.isPlaying
                                }
                                    {@html Pause()}
                                {:else}
                                    {@html Play()}
                                {/if}
                            </button>
                    </div>
                {/if}
            {/each}
        </div>
    {/if}
    </main>
