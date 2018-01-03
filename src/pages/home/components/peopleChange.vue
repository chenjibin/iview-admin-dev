<template>
    <Card class="people-change">
        <p class="people-change-title">人事调动</p>
    </Card>
</template>
<style lang="less">
    .people-change {
        margin-bottom: 10px;
        &-title {
            margin-bottom: 10px;
            font-size: 18px;
            font-weight: 700;
        }
        &-table {
            margin-bottom: 10px;
        }
    }

</style>
<script>
    export default {
        data () {
            return {
                columns: [
                    {
                        title: '公告',
                        key: 'title'
                    },
                    {
                        title: '时间',
                        key: 'time',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '发布人',
                        key: 'people',
                        width: 120
                    }
                ],
                rowData: [
                    {
                        title: '今天开始写日志拉',
                        time: '2017-12-30',
                        people: '管理员'
                    },
                    {
                        title: '今天开始写日志拉',
                        time: '2017-12-30',
                        people: '管理员'
                    },
                    {
                        title: '今天开始写日志拉',
                        time: '2017-12-30',
                        people: '管理员'
                    },
                    {
                        title: '今天开始写日志拉',
                        time: '2017-12-30',
                        people: '管理员'
                    },
                    {
                        title: '今天开始写日志拉',
                        time: '2017-12-30',
                        people: '管理员'
                    },
                    {
                        title: '今天开始写日志拉',
                        time: '2017-12-30',
                        people: '管理员'
                    }
                ]
            };
        },
        created() {
            // this.getNoticeInfo();
        },
        methods: {
            pageChangeHandler(current) {
                console.log(current);
            },
            getChangeInfo() {
                let data = {
                    start: 0,
                    limit: 10
                }
                this.$http.post('', data).then((res) => {
                    console.log(res);
                });
            }
        },
        components: {}
    };
</script>
