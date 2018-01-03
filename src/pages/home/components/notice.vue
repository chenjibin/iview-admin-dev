<template>
    <Card class="sys-notice">
        <p class="sys-notice-title">天马大小事</p>
        <Table height="300" :columns="columns" :data="rowData" class="sys-notice-table"></Table>
        <Page
            :total="totalCount"
            size="small"
            :page-size="pageSize"
            :current.sync="currentPage"
            @on-change="pageChangeHandler"
            ></Page>
    </Card>
</template>
<style lang="less">
    .sys-notice {
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
                totalCount: 80,
                currentPage: 1,
                pageSize: 10,
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
        watch: {
            // currentPage(n) {
            //     console.log(n);
            // }
        },
        created() {
            // this.getNoticeInfo();
        },
        methods: {
            pageChangeHandler(current) {
                console.log(current);
            },
            getNoticeInfo() {
                let data = {
                    start: 0,
                    limit: 10
                }
                this.$http.post('/notice_noticeUserlist', data).then((res) => {
                    console.log(res);
                });
            }
        },
        components: {}
    };
</script>
