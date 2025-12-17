<script lang="ts">
    import { onMount, onDestroy } from 'svelte'
    import { audioState, loadEpisodes, setDefaultEpisode, stopPlayback, togglePlayPause, type AudioState } from './audioStore';
    import { Play, Pause } from '$lib/ui/icons'

    let audioElement: HTMLAudioElement | null = null
    let unsubscribe: (() => void) | null = null
    let pendingPlayRequest = false

    // fetch default episode to hydrate AudioPlayer
    onMount(async () => {
        try {
            await loadEpisodes()
        } catch (err) {
            console.log('Failed to load episodes:', err)
        }
    })

    // finish mounting the AudioPlayer
    onMount(() => {

        audioElement = new Audio()
        audioElement.preload = 'auto'

        // listen to state changes
        unsubscribe = audioState.subscribe((state: AudioState) => {
            handleAudioStateChange(state)
        })
        
        audioElement.addEventListener('play', () => {
            if (!$audioState.isPlaying) {
                togglePlayPause()
            }
        })

        audioElement.addEventListener('pause', () => {
            if ($audioState.isPlaying) {
                togglePlayPause()
            }
        })

        audioElement.addEventListener('ended', () => {
            stopPlayback()
        })

        return cleanup
    })

    onDestroy(() => {
        cleanup()
    })

    function cleanup() {
        if (unsubscribe) unsubscribe()
        if (audioElement) {
            audioElement.pause()
            audioElement.removeAttribute('src')
            audioElement.load()
        }
    }

    function handleAudioStateChange(state: AudioState) {
        if (!audioElement) { return }
        const audio = audioElement

        // Update audio source if episode changed
        if (state.audioUrl && audioElement.src !== state.audioUrl) {
            audio.src = state.audioUrl
            audio.load()
            pendingPlayRequest = state.isPlaying

            audio.addEventListener('canplay', () => {
                if (pendingPlayRequest) { audio.play() }
            }, { once: true })
            return
        }

        // Handle play/pause
        if (state.isPlaying) {
            if (audio.readyState >= 2) { 
                audio.play()
            } else {
                audioElement.addEventListener('canplay', () => {
                    audio.play()
                }, { once: true })
            }
        } else {
            audioElement.pause()
        }
    }
</script>

<div id="audioplayer" class="flex items-center gap-4 p-4 bg-slate-950 text-emerald-300">
    <div class="flex-1 min-w-0">
        {#if $audioState.currentEpisode}
            <div class="font-semibold truncate">{$audioState.currentEpisode.name}</div>
            <div class="text-sm text-slate-400">{$audioState.currentEpisode.speaker}</div>
        {:else}
            <div class="">Loading episodes...</div> <!--Instead of text should be default the latest episode --> 
        {/if}
    </div>
    <button 
        onclick={togglePlayPause}
        disabled={!$audioState.currentEpisode}
        class="
            flex w-12 h-12 cursor-pointer
            border-0 text-emerald-300
            hover:border-2 hover:border-emerald-300 
            transition-colors 
            rounded-full items-center justify-center 
        "
        aria-label={
            $audioState.currentEpisode
                ? ($audioState.isPlaying ? 'Pause' : 'Play')
                : 'Moopsie, you did not select an episode. <3'
            }
    >
        {#if $audioState.currentEpisode && $audioState.isPlaying}
            {@html Pause()}
        {:else}
            {@html Play()}
        {/if}
    </button>
</div>