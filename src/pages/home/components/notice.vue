<template>
    <Card class="sys-notice">
        <p class="sys-notice-title">天马大小事</p>
        <Table height="300"
               :columns="columns"
               :data="rowData"
               :loading="loading"
               :row-class-name="_rowClassName"
               @on-row-click="_checkDetails"
               class="sys-notice-table"></Table>
        <Page
            :total="totalCount"
            size="small"
            :page-size="pageSize"
            :current.sync="currentPage"
            @on-change="pageChangeHandler"
            ></Page>
        <Modal v-model="modelFlag" width="800" :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>{{noticeData.title}}</span>
            </p>
            <div class="" v-html="noticeData.content"></div>
            <div slot="footer">
            </div>
        </Modal>
    </Card>
</template>
<style lang="less">
    .ivu-table .row-cursor {
        cursor: pointer;
    }
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
    import moment from 'moment';
    export default {
        data () {
            return {
                loading: false,
                modelFlag: false,
                totalCount: 80,
                currentPage: 1,
                pageSize: 10,
                noticeData: {
                    title: '',
                    content: ''
                },
                columns: [
                    {
                        title: '公告',
                        key: 'title'
                    },
                    {
                        title: '时间',
                        key: 'nottime',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '发布人',
                        key: 'operater',
                        width: 120
                    }
                ],
                rowData: []
            };
        },
        created() {
            this.getNoticeInfo();
        },
        methods: {
            pageChangeHandler(current) {
                this.currentPage = current;
            },
            getNoticeInfo() {
                this.loading = true;
                let data = {
                    page: this.currentPage,
                    pageSize: 10,
                    type: 1
                };
                this.$http.get('/notice/diaodongInfo', {params: data}).then((res) => {
                    if (res.Success) {
                        this.totalCount = res.count;
                        res.date.forEach((item) => {
                            item.nottime = moment(item.nottime).format('YYYY-MM-DD');
                        });
                        this.rowData = res.date;
                    }
                    console.log(res);
                }).finally(() => {
                    this.loading = false;
                });
            },
            _checkDetails(rowData) {
                this.noticeData.content = rowData.content;
                this.noticeData.title = rowData.title;
                this.modelFlag = true;
                console.log(rowData);
            },
            _rowClassName() {
                return 'row-cursor';
            }
        },
        components: {}
    };
</script>
