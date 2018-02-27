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
                   @on-sort-change="_tableSortChange"
                   ref="attendanceTable"
                   :data="pageData.list"></Table>
            <Page :total="pageData.totalCount"
                  :current="pageData.page"
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
                tableHeight: 300,
                filterOpt: {
                    userName: '',
                    monthDate: '',
                    organizeName: '',
                    sort: {}
                },
                postColumns: [
                    {
                        title: '姓名',
                        key: 'realname',
                        align: 'center'
                    },
                    {
                        title: '所在部门',
                        key: 'department',
                        align: 'center'
                    },
                    {
                        title: '当月已写日志',
                        key: 'number',
                        align: 'center',
                        sortable: true
                    },
                    {
                        title: '统计月份',
                        key: 'date',
                        align: 'center'
                    },
                    {
                        title: '最近检索时间',
                        key: 'updatebydate',
                        align: 'center',
                        width: 180
                    }
                ]
            };
        },
        created() {
            this._getPostData();
            this._setTableHeight();
        },
        methods: {
            _tableSortChange(data) {
                this.filterOpt.sort.key = data.key;
                this.filterOpt.sort.order = data.order;
                this._filterResultHandler();
            },
            _monthDateChange(date) {
                this.filterOpt.monthDate = date;
                this._getPostData();
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
                data.sort = this.filterOpt.sort;
                this.getList('/statistics/logList', data);
            }
        },
        components: {}
    };
</script>
