<script lang="ts">
    import { Header, Footer, MainPage } from '$lib/index'
</script>
<div id="container" class="h-screen w-screen flex flex-col">
    <div id="header" class="shrink">
        <Header />
    </div>
    <div id="mainPage" class="grow overflow-auto">
        <MainPage />
    </div>
    <div id="footer" class="shrink">
        <Footer />
    </div>
</div>