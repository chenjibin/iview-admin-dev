<template>
    <Card class="todo">
        <p class="todo-title">待办事项</p>
        <ul class="todo-list">
            <li v-if="odmsgNumber" class="todo-list-item">
                <div class="todo-list-item-left">
                    <span>【请假】</span><span>您有{{odmsgNumber}}条请假申请待处理</span>
                </div>
                <div class="todo-list-item-right">
                    <Button type="ghost" icon="arrow-right-c" @click="toPage('leaveApproval')">立即处理</Button>
                </div>
            </li>
            <li v-if="compactMsgNumber" class="todo-list-item">
                <div class="todo-list-item-left">
                    <span>【合同】</span><span>您有{{compactMsgNumber}}条请合同待处理</span>
                </div>
                <div class="todo-list-item-right">
                    <Button type="ghost" icon="arrow-right-c">立即处理</Button>
                </div>
            </li>
            <li v-if="purchaseMsgNumber" class="todo-list-item">
                <div class="todo-list-item-left">
                    <span>【资产】</span><span>您有{{purchaseMsgNumber}}条资产申请待处理</span>
                </div>
                <div class="todo-list-item-right">
                    <Button type="ghost" icon="arrow-right-c" @click="toPage('assetsBuyApprove')">立即处理</Button>
                </div>
            </li>
            <li v-if="!purchaseMsgNumber && !compactMsgNumber && !odmsgNumber">
                暂无待办事项
            </li>
        </ul>
    </Card>
</template>
<style lang="less">
    .todo {
        user-select: none;
        &-title {
            margin-bottom: 10px;
            font-size: 18px;
            font-weight: 700;
        }
        &-list {
            &-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
                &-left {

                }
                &-right {

                }
            }

        }
    }
</style>
<script>
    export default {
        data () {
            return {
                compactMsgNumber: 0,
                odmsgNumber: 0,
                purchaseMsgNumber: 0
            };
        },
        created () {
            this._toDoData();
        },
        methods: {
            toPage(page) {
                this.$router.push({
                    name: page
                });
            },
            _toDoData () {
                this.$http.get('/od/notifyMsgWindow').then((res) => {
                    if (res.success) {
                        let resData = res.data;
                        this.compactMsgNumber = resData.compactMsgNumber;
                        this.odmsgNumber = resData.odmsgNumber;
                        this.purchaseMsgNumber = resData.purchaseMsgNumber;
                    }
                });
            }
        }
    };
</script>
