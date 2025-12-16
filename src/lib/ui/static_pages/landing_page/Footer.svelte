<script lang="ts">
    import AudioPlayer from "$lib/audio/AudioPlayer.svelte";
    import type { Episode } from "$lib/pocketbase/index";

    let episode: Episode | undefined = undefined
</script>
<AudioPlayer {episode} />