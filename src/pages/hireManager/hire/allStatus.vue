<template>
    <div>
        <Checkbox :indeterminate="indeterminate" :value="checkAll" @click.prevent.native="handleCheckAll">全选</Checkbox>
        <CheckboxGroup v-model="status" @on-change="changeValue">
            <Checkbox v-if="type1===0||type1===1" label=-1><span style="width:50px;display:inline-block">未预约</span></Checkbox>
            <Checkbox v-if="type1===0||type1===1" label=0><span style="width:50px;display:inline-block">已预约</span></Checkbox>
            <Checkbox v-if="type1===0||type1===1" label=1><span style="width:50px;display:inline-block">已到达</span></Checkbox>
            <Checkbox v-if="type1===0||type1===1" label=2><span style="width:50px;display:inline-block">未到达</span></Checkbox>
            <Checkbox v-if="type1===0||type1===2" label=3><span style="width:50px;display:inline-block">合格</span></Checkbox>
            <br />
            <Checkbox v-if="type1===0||type1===2||type1===4" label=4><span style="width:50px;display:inline-block">待定</span></Checkbox>
            <Checkbox v-if="type1===0||type1===2" label=5><span style="width:50px;display:inline-block">不合格</span></Checkbox>
            <Checkbox v-if="type1===0||type1===2" label=6><span style="width:50px;display:inline-block">合格到达</span></Checkbox>
            <Checkbox v-if="type1===0||type1===2" label=7><span style="width:50px;display:inline-block">合格未到达</span></Checkbox>
            <Checkbox v-if="type1===0||type1===3" label=8><span style="width:50px;display:inline-block">试岗通过</span></Checkbox>
            <Checkbox v-if="type1===0||type1===3" label=9><span style="width:50px;display:inline-block">试岗未通过</span></Checkbox>
        </CheckboxGroup>
    </div>
</template>

<script>
    export default {
        name: 'allStatus',
        props: {
            width: {
                type: Number,
                default: 120
            },
            type1: {
                type: Number,
                default: 0
            }
        },
        data() {
            return {
                status: [],
                n: [],
                indeterminate: true,
                checkAll: true
            };
        },
        methods: {
            handleCheckAll () {
                if (this.indeterminate) {
                    this.checkAll = false;
                } else {
                    this.checkAll = !this.checkAll;
                }
                this.indeterminate = false;
                if (this.checkAll) {
                    if (this.type1 === 1) {
                        this.status = ['-1', '0', '1', '2'];
                        this.$emit('status', this.status);
                        return;
                    }
                    if (this.type1 === 2) {
                        this.status = ['3', '4', '5', '6', '7'];
                        this.$emit('status', this.status);
                        return;
                    }
                    if (this.type1 === 3) {
                        this.status = ['8', '9'];
                        this.$emit('status', this.status);
                        return;
                    }
                    if (this.type1 === 4) {
                        this.status = ['4'];
                        this.$emit('status', this.status);
                        return;
                    }
                    this.status = ['-1', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
                    this.$emit('status', this.status);
                } else {
                    this.status = undefined;
                    this.$emit('status', this.status);
                }
            },
            changeValue(v) {
                var max = 11;
                if (this.type === 1) {
                    max = 4;
                }
                if (this.type === 2) {
                    max = 4;
                }
                if (this.type === 3) {
                    max = 2;
                }
                if (this.type === 4) {
                    max = 1;
                }
                if (v.length === max) {
                    this.indeterminate = false;
                    this.checkAll = true;
                } else if (v.length > 0) {
                    this.indeterminate = true;
                    this.checkAll = false;
                } else {
                    this.indeterminate = false;
                    this.checkAll = false;
                }
                this.$emit('status', v);
            }
        }
    };
</script>

<style scoped>

</style>
