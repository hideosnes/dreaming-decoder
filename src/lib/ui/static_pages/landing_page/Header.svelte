<!-- src/lib/Header.svelte -->
<script lang="ts">
    import { onMount } from "svelte";
    import { 
        fetchMetadata, 
        getLocalMetadata, 
        getLinks, 
        getLogoUrl, 
        type Metadata, 
        type Link 
    } from "$lib/pocketbase/pb_metadata";

    let metadata: Metadata | null = $state(null)
    let logoUrl: string = $state('')
    let links: Link[] = $state([])
    let isLoading = $state(false)

    onMount(async () => {
        await fetchMetadata()
        metadata = getLocalMetadata()
        links = getLinks()
        if (metadata) { logoUrl = getLogoUrl(metadata) }
        isLoading = false
    })

    let expanded = $state(false)
    let responsiveExpansion = $derived(expanded 
        ? 'w-auto overflow-hidden'
        : 'w-0 h-0 overflow'
    )

    let expandAbout = $derived(expanded
        ? 'max-h-[500px] mt-[1rem] opacity-100'
        : 'max-h-0 mt-0 opacity-0'
    )
</script>

<button
    onclick={() => expanded = !expanded}
    class="w-full h-auto text-left transition-all duration-300 ease-in-out bg-slate-900"
    aria-expanded={expanded}
>
    <div class="w-full px-4 py-4 md:px-[15%] xl:px-[30%]">
        {#if isLoading}
            <small id="loadingMetadata" class="text-slate-500 italic">Loading...</small>
        {:else if metadata}
            <div class="flex items-start">
                <!-- Profile Image (only shown when expanded) -->
                <div class="">
                    <div class="shrink-0 {responsiveExpansion} overflow-hidden">
                        <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-lg rounded-tl-3xl overflow-hidden shadow-md">
                            <img 
                                src={logoUrl}
                                alt="Profile"
                                class="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
                
                <!-- Content Area -->
                <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between gap-2">
                        <!-- Title and Subtitle -->
                        <div class="min-w-0 flex-1 {expanded ? 'ml-4' : 'ml-0'}">
                            <h1 class="text-xl sm:text-2xl font-bold text-emerald-300 truncate">
                                {metadata.blogName}
                            </h1>
                            <p class="text-xl font-light text-slate-400 truncate">
                                {metadata.subtitle}
                            </p>
                        </div>

                        <!-- Expand/Collapse Indicator -->
                        <div class="shrink-0 ml-4">
                            <div class="w-10 h-10 rounded-full border-2 border-emerald-300 flex items-center justify-center transition-transform duration-300 ease-in-out"
                                class:rotate-45={expanded}>
                                <svg class="w-10 h-10 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 1v48 M1 12h22"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- About Section (expands/collapses) -->
            <div class="overflow-hidden text-slate-400  transition-all duration-300 ease-in-out {expandAbout}">
                <p class="leading-relaxed">
                    {metadata.about}
                </p>
                <!-- Link Menu Bar -->
                <div class="py-3 flex items-center justify-between font-bold">
                    <!-- Left -->
                    <div id="menu left">
                        {#each links as link}
                            <a 
                                class="pr-4 hover:text-emerald-300" 
                                href={link.link} 
                                rel={link.relation} 
                                target={link.target}
                            >
                                {link.description}
                            </a>
                        {/each}
                    </div>
                    <!-- Right -->
                    <div id="menu right" class="shrink-0 text-slate-700 hover:text-emerald-300">
                        <a href="#">Impressum</a>
                    </div>
                </div>
            </div>
        {:else}
            <small>Something went wrong... Try again later!</small>
        {/if}
    </div>
</button>