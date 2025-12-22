<script lang="ts">
	import { onMount, onDestroy } from 'svelte'
	import { changeTimeFormat } from '$lib/utils';
	import { audioState, loadEpisodes, setDefaultEpisode, stopPlayback, togglePlayPause, type AudioState } from './audioStore';
	import { Play, Pause } from '$lib/ui/icons'

	let audioElement: HTMLAudioElement | null = null
	let unsubscribe: (() => void) | null = null
	let pendingPlayRequest = false
	let timeInterval: number | undefined = undefined
	let currentSeconds = $state(0)
	
	let progressPercent = $derived.by(() => {
		const element = audioElement
		const episode = $audioState.currentEpisode
		
		if (!element || !episode || episode.duration <= 0) {
			return 0
		}
		
		return Math.min(100, (currentSeconds / episode.duration) * 100)
	})

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

		unsubscribe = audioState.subscribe((state: AudioState) => {
			handleAudioStateChange(state)
		})
		
		audioElement.addEventListener('play', () => {
			if (!$audioState.isPlaying) { togglePlayPause() }
		})

		audioElement.addEventListener('pause', () => {
			if ($audioState.isPlaying) { togglePlayPause() }
		})

		audioElement.addEventListener('ended', () => {
			stopPlayback()
			stopTimer()
		})

		return cleanup
	})

	onDestroy(() => {
		cleanup()
	})

	$effect(() => {
		const isPlaying = $audioState.isPlaying
		if (isPlaying) {
			startTimer()
		} else {
			stopTimer()
		}
	})

	function cleanup() {
		if (unsubscribe) unsubscribe()
		if (audioElement) {
			audioElement.pause()
			audioElement.removeAttribute('src')
			audioElement.load()
		}
		stopTimer()
	}

	function startTimer() {
		// Clear any existing interval
		stopTimer()
		timeInterval = window.setInterval(() => {
			if (audioElement && $audioState.isPlaying) {
				currentSeconds = audioElement.currentTime
			}
		}, 1000)
	}

	function stopTimer() {
		if (timeInterval !== undefined) {
			window.clearInterval(timeInterval)
			timeInterval = undefined
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

<div id="audioplayer" class="flex flex-col gap-2 p-4 text-emerald-300">
	<div class="flex items-center justify-between gap-4 px-4">
		<!-- Left: Timeline Stack -->
		<div class="flex-1 flex flex-col gap-2">
		<!-- Progress Bar -->
		<div class="relative w-full h-2 bg-slate-800 rounded-full overflow-hidden">
			<div
			class="absolute top-0 left-0 h-full bg-emerald-300"
			style:width="{progressPercent}%"
			></div>
			<div
			class="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-emerald-300 rounded-full border-2 border-slate-950 shadow-lg"
			style:left="{progressPercent}%"
			></div>
		</div>

		<!-- Title | Time Passed / Time Total -->
			<div class="flex items-center justify-between">
				<div class="font-semibold truncate">
						{$audioState.currentEpisode?.name || 'Select an episode'}
					</div>
					<div class="text-sm text-slate-400">
						{#if $audioState.currentEpisode}
							{changeTimeFormat(currentSeconds)} / {changeTimeFormat($audioState.currentEpisode.duration)}
						{:else}
							0:00 / 0:00
						{/if}
				</div>
			</div>
		</div>

		<!-- Right: Play Button -->
		<button
		onclick={togglePlayPause}
		disabled={!$audioState.currentEpisode}
		class="
			flex w-12 h-12 cursor-pointer
			text-emerald-300 
			rounded-full items-center justify-center
		"
		aria-label={
			$audioState.currentEpisode
			? ($audioState.isPlaying ? 'Pause' : 'Play')
			: 'You did not select an episode.'
		}
		>
			{#if $audioState.currentEpisode && $audioState.isPlaying}
				{@html Pause()}
			{:else}
				{@html Play()}
			{/if}
		</button>
	</div>
</div>