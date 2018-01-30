<template>
    <div>
        <Card>
            <Form inline :label-width="60">
                <FormItem label="姓名">
                    <Input type="text"
                           @on-change="_inputDebounce"
                           v-model="filterOpt.userName"
                           placeholder="筛选姓名"></Input>
                </FormItem>
                <FormItem label="月份">
                    <DatePicker type="month"
                                placeholder="筛选月份"
                                @on-change="_monthDateChange"
                                :value="filterOpt.monthDate"></DatePicker>
                </FormItem>
                <FormItem label="部门">
                    <Input type="text"
                           @on-change="_inputDebounce"
                           v-model="filterOpt.organizeName"
                           placeholder="筛选部门"></Input>
                </FormItem>
            </Form>
            <Table :columns="postColumns"
                   :loading="tableLoading"
                   :height="tableHeight"
                   ref="attendanceTable"
                   :data="pageData.list"></Table>
            <Page :total="pageData.totalCount"
                  @on-change="_setPage"
                  @on-page-size-change="_setPageSize"
                  :page-size="pageData.pageSize"
                  placement="top"
                  show-sizer
                  show-total
                  show-elevator
                  style="margin-top: 16px;"></Page>
        </Card>
    </div>
</template>
<style>

</style>
<script>
    import pageMixin from '@/mixins/pageMixin';
    import debounce from 'lodash/debounce';
    export default {
        name: 'logTotal',
        mixins: [pageMixin],
        data () {
            return {
                tableLoading: false,
                tableHeight: 300,
                filterOpt: {
                    userName: '',
                    monthDate: '',
                    organizeName: ''
                },
                postColumns: [
                    {
                        title: '姓名',
                        key: 'organizename',
                        align: 'center'
                    },
                    {
                        title: '所在部门',
                        key: 'postname',
                        align: 'center'
                    },
                    {
                        title: '当月已写日志',
                        key: 'user_name',
                        align: 'center'
                    },
                    {
                        title: '统计月份',
                        key: 'record_month',
                        align: 'center',
                        render: (h, params) => {
                            return h('span', moment(params.row['record_month']).format('YYYY-MM'));
                        }
                    },
                    {
                        title: '最近检索时间',
                        key: 'late_times',
                        align: 'center',
                        width: 180

                    }
                ]
            };
        },
        created() {
            this._setTableHeight();
        },
        methods: {
            _monthDateChange(date) {
                this.filterOpt.monthDate = date;
            },
            initPage() {
                this.pageData.page = 1;
            },
            _filterResultHandler() {
                this.initPage();
                this._getPostData();
            },
            _inputDebounce: debounce(function () {
                this._filterResultHandler();
            }, 600),
            _setTableHeight() {
                let dm = document.body.clientHeight;
                this.tableHeight = dm - 260;
            },
            _setPage(page) {
                this.pageData.page = page;
                this._getPostData();
            },
            _setPageSize(size) {
                this.pageData.pageSize = size;
                this._getPostData();
            },
            _getPostData() {
                let data = {};
                data.name = this.filterOpt.userName;
                data.startDate = this.filterOpt.monthDate;
                data.dpname = this.filterOpt.organizeName;
                this.getList('/statistics/logList ', data);
            }
        },
        components: {}
    };
</script>
