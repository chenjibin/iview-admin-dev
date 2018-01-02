<style lang="less">
    @import './infoBtn.less';
</style>

<template>
    <Card :padding="0">
        <div class="infor-card-con" @click="clickHandler">
            <Col class="infor-card-icon-con" :style="{backgroundColor: color, color: 'white'}" span="8">
            <Row class="height-100" type="flex" align="middle" justify="center">
                <Icon :type="iconType" :size="iconSize"></Icon>
            </Row>
            </Col>
            <Col span="16" class="height-100">
            <Row type="flex" align="middle" justify="center" class="height-100">
                <p class="infor-card-con-text" :style="{color: color}">{{btnText}}</p>
            </Row>
            </Col>
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
            this.$emit('card-click')
        }
    }
};
</script>

