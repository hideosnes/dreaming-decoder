<script lang="ts">
    import { onMount } from 'svelte'
    import { getAudioUrl, type Episode } from '$lib/pocketbase';
    import { Play, Pause } from '@lucide/svelte';
    
    let isPlaying = $state(false)
    let currentEpisode: Episode | null = $state(null)
    let audioElement: HTMLAudioElement | null = null

    const audioUrl = $derived(currentEpisode ? getAudioUrl(currentEpisode) : null)

    onMount(() => {
        audioElement = new Audio()
        audioElement.preload = 'auto'
        
        audioElement.addEventListener('play', () => {
            isPlaying = true
        })

        audioElement.addEventListener('pause', () => {
            isPlaying = false
        })

        audioElement.addEventListener('ended', () => {
            isPlaying = false
        })

        // Cleanup
        return () => {
            if (audioElement) {
                audioElement.pause()
                audioElement.removeAttribute('src')
                audioElement.load()
            }
        }
    })


    $effect(() => {
        if (audioElement && audioUrl) {
            audioElement.src = audioUrl
        }
    })

    function togglePlayPlause() {
        if (!currentEpisode || !audioElement) return

        if (isPlaying) {
            audioElement.pause()
        } else {
            audioElement.play().catch(err => {
                console.error('Playback failed:', err)
            })
        }
    }

    function setEpisode(episode: Episode) {
        currentEpisode = episode
        if (audioElement) {
            audioElement.currentTime = 0
            audioElement.play().catch(err => {
                console.error('Playback failed:', err)
            })
        }
    }

    export { setEpisode, togglePlayPlause, isPlaying, currentEpisode }
</script>

<div id="audioplayer" class="flex items-center gap-4 p-4 bg-slate-900 text-white">
    <div class="flex-1 min-w-0">
        {#if currentEpisode}
            <div class="font-semibold truncate">{currentEpisode.name}</div>
            <div class="text-sm text-slate-400">{currentEpisode.speaker}</div>
        {:else}
            <div class="text-sm text-slate-400">No episode selected.</div>
        {/if}
    </div>
    <button 
        onclick={togglePlayPlause}
        class="
            flex w-12 h-12
            bg-emerald-500 hover:bg-emerald-600 transition-colors
            rounded-full items-center justify-center 
        "
        aria-label={isPlaying ? 'Pause' : 'Play'}
    >
        {#if isPlaying}
            <Play />
        {:else}
            <Pause />
        {/if}
    </button>
</div>