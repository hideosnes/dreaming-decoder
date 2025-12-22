<script lang='ts'>
    import { onDestroy, onMount } from 'svelte';
    import { changeTimeFormat, changeDateFormat } from '$lib/utils';
	import { type Episode } from '$lib/pocketbase/pb_episodes';
    import { audioState, type AudioState, setEpisode, togglePlayPause } from '$lib/audio/audioStore';
    import { Play, Pause } from '$lib/ui/icons'
    import { slide } from 'svelte/transition'

    let currentAudioState = $state<AudioState | null>(null)
    let unsubscribe: (() => void) | null = null
    let expandedDescriptions = $state<string[]>([])

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

    function handleDescriptionClick(e: Event) {
        const target = e.target as HTMLElement; 
        if (target.closest('.menu-item')) { 
            e.preventDefault(); 
        }
        
        // Find the episode container by looking for the gradient background class
        const episodeContainer = target.closest('.bg-linear-to-r')
        const episodeId = episodeContainer?.getAttribute('data-episode-id')
        
        if (!episodeId) {
            console.error('Could not find episode ID in container:', episodeContainer)
            return
        }
        
        // Toggle expansion for this specific episode
        if (expandedDescriptions.includes(episodeId)) {
            expandedDescriptions = expandedDescriptions.filter(id => id !== episodeId)
        } else {
            expandedDescriptions = [...expandedDescriptions, episodeId]
        }
    }
    
    function handleDescriptionKeydown(e: KeyboardEvent) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            
            // Get the episode ID from the parent container
            const episodeId = (e.currentTarget as HTMLElement).closest('[data-episode-id]')?.getAttribute('data-episode-id')
            if (!episodeId) return
            
            // Toggle expansion for this specific episode
            if (expandedDescriptions.includes(episodeId)) {
                expandedDescriptions = expandedDescriptions.filter(id => id !== episodeId)
            } else {
                expandedDescriptions = [...expandedDescriptions, episodeId]
            }
        }
    }
</script>

<main id="responsive" class="h-screen bg-linear-to-b from-slate-900 to-slate-950 px-0 md:px-[15%] xl:px-[30%]">
    {#if $audioState.isLoading}
        <div class="p-4 text-white">Loading episodes...</div>
    {:else if $audioState.episodes.length === 0}
        <div class="p-4 text-slate-700">Coming soon...</div>
    {:else}
        <div class="flex flex-col gap-4 px-4 py-3 antialiased">
            {#each $audioState.episodes as episode (episode.id) }
                {#if episode.isPublished === true}
                    <div 
                        class="relative w-full h-auto p-4 bg-linear-to-r from-emerald-400 to-emerald-200 text-indigo-800 rounded-xl rounded-br-4xl"
                        data-episode-id={episode.id}
                    >
                            <div class="text-lg font-bold uppercase">
                                {episode.name}
                            </div>
                            <div id="episode-meta" class="text-sm">

                                <!-- EP Title, Length and creation date -->

                                <div class="pb-2">
                                    {changeTimeFormat(episode.duration, 'seconds')}
                                    <span class="px-1.5">|</span>
                                        {episode.speaker}
                                    <span class="px-1.5">|</span>
                                        {changeDateFormat(episode.created)}
                                </div>
                                    <div class="flex items-center text-xs">
                                    <div
                                        role="button"
                                        tabindex="0"
                                        aria-label="Details about selected episode"
                                        onclick={(e) => { handleDescriptionClick(e) }}
                                        onkeydown={(e) => {handleDescriptionKeydown(e) }}
                                        class="
                                        flex rounded-full px-5 py-0.5 w-1/8 mr-4
                                        justify-center items-center border
                                        transition-all duration-500
                                        hover:bg-indigo-800 hover:text-white
                                        {expandedDescriptions.includes(episode.id) 
                                            ? 'bg-indigo-800 border-indigo-800 text-white font-semibold' 
                                            : 'border-indigo-800'}
                                    ">
                                        <div class="uppercase">Details</div>
                                    </div>
                                    
                                        {#each episode.category as category }
                                                <div class="pr-2 flex items-center justify-center">#{category}</div>
                                        {/each}
                                    </div>
                                    {#if expandedDescriptions.includes(episode.id)}
                                        <div 
                                            transition:slide={{ axis: 'y', duration: 500 }}
                                            class="pt-4 w-6/7"
                                        >
                                            {episode.description}
                                        </div>
                                    {/if}
                            </div>

                            <!-- Play Button -->

                            <button 
                                class="
                                    absolute bottom-2 right-1 w-10 h-10 cursor-pointer
                                    text-indigo-500 hover:text-indigo-800
                                    transition-colors duration-500
                                    rounded-full items-center justify-center
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
                                {@html Pause({strokeWidth: 2.5})}
                            {:else}
                                {@html Play({strokeWidth: 3})}
                            {/if}
                        </button>
                    </div>
                {/if}
            {/each}
        </div>
    {/if}
</main>
