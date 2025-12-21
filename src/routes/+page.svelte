<script lang="ts">
    import { Header, Footer, MainPage } from '$lib/index'
</script>
<div class="flex flex-col">
    <div id="header" class="shrink">
        <Header />
    </div>
    <div id="mainPage" class="grow">
        <MainPage />
    </div>
    <div id="footer" class="shrink">
        <Footer />
    </div>
</div>