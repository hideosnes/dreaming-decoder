<script lang="ts">
    import { changeTimeFormat } from "$lib/utils";
    import { pb, fetchEpisodes, getAudioUrl, type Episode } from "$lib/pocketbase/index"
    import { Play, Pause } from '$lib/ui/icons'

    interface AudioProps { episode?: Episode }
    let { episode } = $props()

    let audioElement = $state<HTMLAudioElement | null>(null)
    let audioContext = $state<AudioContext | null>(null)
    let isPlaying = $state(false)
    let currentTime = $state(0)
    let isDragging = $state(false)

    let duration = $derived(episode ? changeTimeFormat(episode.duration) : '0:00')
    let currenTime = $derived(episode ? changeTimeFormat(episode.duration) : '0:00')
    let progress = $derived(episode ? (currentTime / (episode.duration || 1) * 100) : 0)
    let audioUrl = $derived(episode ? getAudioUrl(episode) : '')

    function intitAudio() {
        if ( !audioElement || audioContext ) return

        try {
            audioContext = new (window.AudioContext || (window as any).webkitAudioContetxt)()
        } catch (err) {
            console.error('Audio contextualisation failed:', err)
        }
    }

    async function togglePlay() {
        if (!audioElement) return

        intitAudio()

        try {
            if (!audioContext) {
                // fallback to html5 audio
                if (audioElement.paused) {
                    audioElement.play()
                    isPlaying = true
                } else {
                    audioElement.pause()
                    isPlaying = false
                }
                return
            }
            // resume audio if suspended
            if (audioContext.state === 'suspended') {
                await audioContext.resume()
            }

            if (audioElement.paused) {
                audioElement.play()
                isPlaying = true
            } else {
                audioElement.pause()
                isPlaying = false
            }
        } catch (err) {
            console.error('Playback error:', err)
        }
    }

    function seek(time: number) {
        if (audioElement) {
            audioElement.currentTime = time
        }
    }

    function handleProgressClick(event: MouseEvent) {
        if (!audioElement || !episode) return
        const currentTarget = event.currentTarget as HTMLElement
        if (!currentTarget) return

        const rect = currentTarget.getBoundingClientRect()
        const clickX = event.clientX - rect.left
        const width = rect.width
        const newTime = (clickX / width) * episode.duration
        
        seek(newTime)
    }

    function handleProgressTouch(event: TouchEvent) {
        if (!audioElement || !episode) return
        const currentTarget = event.currentTarget as HTMLElement
        if (!currentTarget) return
        
        const rect = currentTarget.getBoundingClientRect()
        const touchX = event.touches[0].clientX - rect.left
        const width = rect.width
        const newTime = (touchX / width) * episode.duration

        seek(newTime)
    }

    function handleProgressKeydown(event: KeyboardEvent) {
        if (!audioElement || !episode) return

        const key = event.key
    }

    $effect(() => {
        if (!audioElement) return
        
        const updateProgress = () => {
            currentTime = audioElement!.currentTime
        }

        audioElement.addEventListener('timeupdate', updateProgress)

        return () => { 
            audioElement?.removeEventListener('timeupdate', updateProgress)
        }
    })

    $effect(() => {
        if (!audioElement) return

        const handleEnded = () => {
            isPlaying = false
        }

        audioElement.addEventListener('ended', handleEnded)

        return () => {
            audioElement?.removeEventListener('ended', handleEnded)
        }
    })

    $effect(() => {
        return () => {
            audioElement?.pause()
            audioContext?.close()
        }
    })
</script>

<div id="audioplayer" class="">
    <audio 
        bind:this={audioElement} 
        src={audioUrl} 
        crossorigin="anonymous">
            moops?
        </audio>

        <button 
            class="
                px-4 py-2 
                bg-indigo-500 hover:bg-indigo-600 
                text-white font-semibold 
                rounded-full transition-all duration-200
                shdow-sm hover:shadow-md transform hover:-translate-y-0.5
                focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-500
                group
            "
            onclick={togglePlay}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            disabled={!audioElement}
        >
        {#if isPlaying}
            {@html Pause()}
        {:else}
            {@html Play()}
        {/if}
    </button>
    <div class="flex-1 min-w-0">
        <div class="flex items-center gap-3">
            <span class="text-sm text-indigo-600 whitespace-nowrap">
                {currentTime}
            </span>
            <div 
                class="flex-1 relative group cursor-pointer"
                onclick={handleProgressClick}
                onkeydown={handleProgressKeydown}
                ontouchstart={handleProgressTouch}
                role="slider"
                tabindex="0"
                aria-label="Progress"
                aria-valuemin="0"
                aria-valuemax={episode.duration}
                aria-valuenow={currentTime}
                aria-valuetext={`Progress: ${currentTime} of ${duration}`}
            >
                <div class="w-full h-2 bg-indigo-100 rounded-full overflow-hidden">
                    <div 
                        class="h-full bg-linear-to-r from-amber-400 to-rose-500 rounded-full transition-all duration-100"
                        style="width: {progress}%"
                    ></div>
                </div>

                <div 
                    class="
                        absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2
                        w-4 h-4 bg-white border-2 border-indigo-300 rounded-full shdow-md
                        opacity-0 group-hover:opacity-100 transition-opacity duration-200
                        pointer-events-none
                    "
                    style="left: {progress}%"
                ></div>
            </div>

        </div>
    </div>
</div>