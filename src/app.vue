<template>
    <div id="main" class="app-main">
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                theme: this.$store.state.app.themeColor
            };
        },
        mounted () {

        },
        beforeDestroy () {

        },
        created() {

        },
        methods: {

        }
    };
</script>

<style>
    html,body{
        width: 100%;
        height: 100%;
        background: #f0f0f0;
        overflow: hidden;
    }
    .fs-square-img {
        position: relative;
        padding-top: 100%;
        width: 100%;
    }
    .fs-square-img img {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
    }
    .flex-center {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .app-main{
        width: 100%;
        height: 100%;
    }
</style>
