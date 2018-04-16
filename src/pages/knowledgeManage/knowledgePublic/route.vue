<template>
    <div class="knowledge-page">
        <router-view></router-view>
    </div>
</template>
<style>
    .knowledge-page {
        width: 100%;
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
    }
</style>
<script>
    export default {
        name: 'knowledgePublic',
        data () {
            return {};
        },
        components: {}
    };
</script>
