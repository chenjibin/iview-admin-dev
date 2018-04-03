<style lang="less">
    @import './infoBtn.less';
</style>

<template>
    <Card :padding="8" class="fs-border-radius">
        <div class="infor-card-con" @click="clickHandler">
            <div class="icon-wrapper" :style="{backgroundColor: color, color: 'white'}">
                <Icon :type="iconType" :size="iconSize"></Icon>
            </div>
            <div class="content-wrapper">
                <p class="content" :style="{color: color}">{{btnText}}</p>
            </div>
        </div>
    </Card>
</template>

<script>

export default {
    name: 'infoBtn',
    props: {
        idName: String,
        color: String,
        iconType: String,
        btnText: String,
        countSize: {
            type: String,
            default: '30px'
        },
        countWeight: {
            type: Number,
            default: 700
        },
        iconSize: {
            type: Number,
            default: 28
        }
    },
    methods: {
        clickHandler() {
            this.$emit('card-click');
        }
    }
};
</script>

