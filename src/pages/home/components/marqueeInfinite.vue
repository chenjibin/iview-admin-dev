<template>
    <div class="marquee-infinite"
         :style="{height: height + 'px'}"
         @mouseenter="testEnter"
         @mouseleave="testLeave">
        <div class="marquee-infinite-inner" v-if="itemData.length" ref="innerDom">
            <div class="marquee-infinite-inner-item" v-for="item in itemData">{{item}}</div>
        </div>
        <div class="" v-else>暂无数据</div>
    </div>
</template>
<style lang="less">
    .marquee-infinite {
        width: 100%;
        position: relative;
        overflow: hidden;
        &-inner {
            position: absolute;
            width: 100%;
            z-index: 10;
            left: 0;
            top: 0;
            &-item {
                padding:8px 0;
                font-size: 14px;
            }
        }
    }
</style>
<script>
    export default {
        props: {
            itemData: {
                type: Array,
                default() {
                    return [];
                }
            },
            height: String
        },
        data () {
            return {
                innerHeight: null,
                animationY: null,
                animationFram: null,
                firstLoad: true
            };
        },
        watch: {
            itemData() {
                this.$nextTick(() => {
                    this.innerHeight = this.$refs.innerDom.clientHeight;
                    this.animationY = +this.height;
                    this._run();
                });
            }
        },
        activated() {
            if (!this.firstLoad) this.testLeave();
            else this.firstLoad = false;
        },
        deactivated() {
            this.testEnter();
        },
        destroyed() {
            cancelAnimationFrame(this.animationFram);
        },
        methods: {
            testEnter() {
                cancelAnimationFrame(this.animationFram);
            },
            testLeave() {
                this.animationFram = requestAnimationFrame(this._run);
            },
            _run() {
                let innerDom = this.$refs.innerDom;
                this.animationY -= 0.5;
                innerDom.style.transform = `translate3d(0, ${this.animationY}px, 0px)`;
                if (this.animationY < 0 && Math.abs(this.animationY) >= this.innerHeight) this.animationY = +this.height;
                this.animationFram = requestAnimationFrame(this._run);
            }
        }
    };
</script>
