<template>
    <div class="coin-ranking">
        <p class="coin-ranking-title">{{coinTitle}}</p>
        <Table height="300" :loading="loading" :columns="columns" :data="rowData"></Table>
    </div>
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
            url: String,
            coinTitle: String,
            tagColor: {
                type: String,
                default: 'green'
            }
        },
        data () {
            return {
                rowData: [],
                loading: false,
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
                        key: 'realname'
                    },
                    {
                        title: '金币数',
                        key: 'opt_num',
                        render: (h, params) => {
                            return h('Tag', {
                                props: {
                                    color: this.tagColor
                                }
                            }, params.row.tm_coin);
                        }
                    }
                ]
            };
        },
        created() {
            this.getRowData();
        },
        methods: {
            getRowData() {
                this.loading = true;
                this.$http.get(this.url).then((res) => {
                    if (res.success) {
                        this.rowData = res.data;
                    }
                }).finally(() => {
                    this.loading = false;
                });
            }
        }
    };
</script>
