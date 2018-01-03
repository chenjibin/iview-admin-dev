<template>
    <Card class="coin-ranking">
        <p class="coin-ranking-title">{{coinTitle}}</p>
        <Table height="300" :columns="columns" :data="rowData"></Table>
    </Card>
</template>
<style lang="less">
    .coin-ranking {
        &-title {
            margin-bottom: 10px;
            font-size: 18px;
            font-weight: 700;
            text-align: center;
        }
    }
</style>
<script>
    export default {
        props: {
            rowData: Array,
            coinTitle: String,
            tagColor: {
                type: String,
                default: 'green'
            }
        },
        data () {
            return {
                columns: [
                    {
                        title: '排名',
                        key: 'sort',
                        render: (h, params) => {
                            return h('strong', `No.${params.index + 1}`);
                        }
                    },
                    {
                        title: '姓名',
                        key: 'name'
                    },
                    {
                        title: '金币数',
                        key: 'coin',
                        render: (h, params) => {
                            return h('Tag', {
                                props: {
                                    color: this.tagColor
                                }
                            }, params.row.coin);
                        }
                    }
                ]
            };
        }
    };
</script>
