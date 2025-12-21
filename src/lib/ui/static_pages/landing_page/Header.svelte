<!-- src/lib/Header.svelte -->
<script lang="ts">
    import { onMount } from "svelte";
    import { 
        fetchMetadata, 
        getLocalMetadata, 
        getLinks,
        getLogoUrl, 
        type Metadata,
        type Links
    } from "$lib/pocketbase/pb_metadata";
	import { slide } from "svelte/transition";
    import { Motion } from 'svelte-motion'

    let metadata: Metadata | null = $state(null)
    let logoUrl: string = $state('')
    let links: Links[] = $state([])
    let isLoading = $state(false)
    let expandAbout = $state(false)
    
    let rotation = $derived(expandAbout ? 45 : 0)

    onMount(async () => {
        await fetchMetadata()
        metadata = getLocalMetadata()
        if (metadata) { 
            logoUrl = getLogoUrl(metadata)
            links = getLinks()
        }
        
        isLoading = false
    })

    // closes the menu if user clicks anywhere else
    function handleClickOutside(node: HTMLElement) {
        function handleEvent(event: Event) {
            if (node && !node.contains(event.target as Node) && expandAbout) {
                expandAbout = false
            }
        }

        document.addEventListener('click', handleEvent, true)
        document.addEventListener('touchstart', handleEvent, true)

        return {
            destroy() {
                document.removeEventListener('click', handleEvent, true)
                document.removeEventListener('touchstart', handleEvent, true)
            }
        }
    }
    
    function handleHeaderClick(e: Event) {
        const target = e.target as HTMLElement;
        if (target.closest('.menu-item')) { 
            e.preventDefault(); 
        }
        expandAbout = !expandAbout;
    }
    
    function handleHeaderKeydown(e: KeyboardEvent) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            expandAbout = !expandAbout;
        }
    }
</script>

<header 
    use:handleClickOutside
    class="bg-slate-900 w-full p-0 md:px-[15%] xl:px-[30%]"
>
    <div 
        class="p-4 list-none overflow-hidden"
        
    >
        {#if isLoading}
            <small id="loadingMetadata" class="text-slate-500 italic">Loading...</small>
        {:else if metadata}
                <div id="image" class="flex items-center h-16">
                    <div class="w-16 rounded-xl mr-4">
                        <img
                            src={logoUrl}
                            alt="Profileimage"
                            class="w-16 h-16 object-cover mr-4"
                        />
                    </div>

                    <div id="title" class="flex-1">
                        <h1 class="text-xl sm:text-2xl font-bold text-emerald-300 truncate">
                            {metadata.blogName}
                        </h1>
                        <p class="text-xl font-light text-slate-400 truncate">
                            {metadata.subtitle}
                        </p>
                    </div>
                    
                    <div id="toggle" 
                        role="button"
                        tabindex="0"
                        aria-label="Toggle submenu with links and the about section"
                        class="ml-auto cursor-pointer"
                        onclick={handleHeaderClick}
                        onkeydown={handleHeaderKeydown}
                    >
                        <Motion animate={{ rotate: rotation }} transition={{ duration: .5 }} let:motion>
                            <div use:motion class="w-10 h-10 rounded-full border-2 border-emerald-300 flex items-center justify-center">
                                <svg class="w-10 h-10 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 1v48 M1 12h22"></path>
                                </svg>
                            </div>
                        </Motion>
                    </div>
                </div>
        {:else}
            <small>Something went wrong... Try again later!</small>
        {/if}
    </div>
    
    {#if expandAbout}
        <div id="menu" 
            in:slide={{ axis: 'y', duration: 500 }} 
            out:slide={{ axis: 'y', duration: 500, delay: 500 }} 
            class="h-auto flex items-center py-2">
            <div class="px-4 justify-between font-normal text-slate-400 flex-1">
                {#each links as l}
                    <a 
                        class="pr-2 hover:text-emerald-300 transition-colors duration-300 ease-in-out"
                        href="{l.link}"
                        rel="{l.relation}"
                        target="{l.target}"
                    >
                        {l.description}
                    </a>
                {/each}
            </div>
            <div id="menu right" class="shrink-0 text-xs px-4">
                <a 
                    class="cursor-pointer text-slate-600 focus:outline-none hover:text-emerald-300 transition-colors duration-300 ease-in-out" 
                    href="#"
                >
                    Impressum
                </a>
            </div> 
        </div>
        <div id="about" 
                in:slide={{ axis: 'y', duration: 500, delay: 500 }}
                out:slide={{ axis: 'y', duration: 500 }} 
                class="p-5 overflow-x-auto">
            <h2 class="text-emerald-300 text-lg font-semibold pb-4">About</h2>
            <p class="leading-relaxed text-slate-400 h-auto">{metadata?.about}</p>
        </div>
    {/if}
</header>

<style>
    /* Smooth scrollbar styling */
    ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }
    
    ::-webkit-scrollbar-track {
        background: transparent;
    }
    
    ::-webkit-scrollbar-thumb {
        background: #334155;
        border-radius: 4px;
        transition: background 0.3s ease;
    }
    
    ::-webkit-scrollbar-thumb:hover {
        background: #475569;
    }
</style>