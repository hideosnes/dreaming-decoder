<!-- src/lib/Header.svelte -->
<script lang="ts">
    let expanded = $state(false)

    const title = "Dreaming Decoder"
    const subtitle = "moopsie poopsie"
    const profileImage = "https://cataas.com/cat"
    const aboutText = "We talk about AI and policies. Among other things, in the context of the decision making process of the development of Homahuki."
</script>

<button
    onclick={() => expanded = !expanded}
    class="w-full h-auto text-left transition-all duration-300 ease-in-out bg-slate-900"
    aria-expanded={expanded}
>
    <div class="w-full px-4 py-4">
        <div class="flex items-start gap-4">
            <!-- Profile Image (only shown when expanded) -->
            <div class="shrink-0 transition-all duration-300 ease-in-out"
                 style={`width: ${expanded ? '64px' : '0'}; height: ${expanded ? '64px' : '0'}; overflow: hidden;`}>
                <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden shadow-md">
                    <img 
                        src={profileImage}
                        alt="Profile"
                        class="w-full h-full object-cover"
                    />
                </div>
            </div>
            
            <!-- Content Area -->
            <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between gap-2">
                    <!-- Title and Subtitle -->
                    <div class="min-w-0 flex-1">
                        <h1 class="text-xl sm:text-2xl font-bold text-emerald-300 truncate">
                            {title}
                        </h1>
                        <p class="text-sm sm:text-base text-slate-500 truncate">
                            {subtitle}
                        </p>
                    </div>

                    <!-- Expand/Collapse Indicator -->
                    <div class="shrink-0 ml-2">
                        <div class="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center transition-transform duration-300 ease-in-out"
                             class:rotate-90={expanded}>
                            <svg class="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- About Section (expands/collapses) -->
        <div class="overflow-hidden transition-all duration-300 ease-in-out"
             style={`max-height: ${expanded ? '500px' : '0'}; opacity: ${expanded ? '1' : '0'}; margin-top: ${expanded ? '1rem' : '0'};`}>
            <p class="text-slate-500 leading-relaxed">
                {aboutText}
            </p>
                    <!-- Link-Leiste -->
            <div class="py-2 text-slate-700 font-bold">
                <a href="#" class="px-2 hover:text-emerald-300">Link 1</a>
                <a href="#" class="px-2 hover:text-emerald-300">Link 2</a>
                <a href="#" class="px-2 hover:text-emerald-300">Link 3</a>
            </div>
        </div>
    </div>
</button>