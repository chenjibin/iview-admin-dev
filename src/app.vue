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

<style lang="less">
    html,body{
        width: 100%;
        height: 100%;
        background: #f0f0f0;
        overflow: hidden;
    }
    ul {
        list-style: none;
    }
    .ivu-scroll-container {
        overflow-y: auto;
    }
    .ivu-select-dropdown {
        max-height: 300px;
    }
    .ivu-btn-text:focus {
        box-shadow: none;
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
    .no-result-block {
        margin-top: 88px;
        padding-bottom: 88px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        img {
            width: 300px;
        }
        .info {
            font-size: 18px;
            font-weight: 700;
        }
    }
</style>
