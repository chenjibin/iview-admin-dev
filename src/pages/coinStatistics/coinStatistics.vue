<template>
    <div>
        <Card>
            <Form inline :label-width="60">
                <FormItem label="姓名">
                    <Input type="text"
                           @on-change="_inputDebounce"
                           v-model="filterOpt.name"
                           placeholder="筛选姓名"></Input>
                </FormItem>
                <FormItem label="部门">
                    <Input type="text"
                           @on-change="_inputDebounce"
                           v-model="filterOpt.dep"
                           placeholder="筛选部门"></Input>
                </FormItem>
                <FormItem label="日期">
                    <DatePicker type="year"
                                @on-change="filterOpt.year = $event"
                                clearable
                                :value="filterOpt.year"></DatePicker>
                </FormItem>
            </Form>
            <Table :columns="postColumns"
                   :loading="tableLoading"
                   :height="tableHeight"
                   @on-sort-change="_sortChange"
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
<script>
    import pageMixin from '@/mixins/pageMixin';
    import moment from 'moment';
    import debounce from 'lodash/debounce';
    export default {
        name: 'coinStatistics',
        data () {
            return {
                filterOpt: {
                    name: '',
                    dep: '',
                    year: '',
                    sort: {
                        key: '',
                        order: ''
                    }
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
                        title: '财富点',
                        key: 'treasure',
                        align: 'center',
                        sortable: true
                    },
                    {
                        title: '技能点',
                        key: 'skill',
                        align: 'center',
                        sortable: true
                    },
                    {
                        title: '伯乐点',
                        key: 'talentscout',
                        align: 'center',
                        sortable: true
                    },
                    {
                        title: '智慧点',
                        key: 'wisdom',
                        align: 'center',
                        sortable: true
                    },
                    {
                        title: '综合能力值',
                        key: 'total',
                        align: 'center',
                        sortable: true
                    },
                    {
                        title: '统计日期',
                        key: 'date',
                        align: 'center',
                        width: 120
                    }
                ],
                tableHeight: 500
            };
        },
        watch: {
            'filterOpt.year'() {
                this._filterResultHandler();
            }
        },
        mixins: [pageMixin],
        created() {
            this._getPostData();
            this._setTableHeight();
        },
        methods: {
            _sortChange(sort) {
                this.filterOpt.sort.key = sort.key;
                this.filterOpt.sort.order = sort.order === 'normal' ? '' : sort.order;
                this._filterResultHandler();
            },
            _inputDebounce: debounce(function () {
                this._filterResultHandler();
            }, 600),
            _filterResultHandler() {
                this.initPage();
                this._getPostData();
            },
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
                data.name = this.filterOpt.name;
                data.dpname = this.filterOpt.dep;
                data.year = this.filterOpt.year;
                data.sort = JSON.stringify(this.filterOpt.sort);
                this.getList('/coin/propertyList', data);
            }
        },
        components: {}
    };
</script>
