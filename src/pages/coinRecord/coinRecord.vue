<template>
    <div>
        <Card>
            <Form inline :label-width="60">
                <FormItem label="员工姓名">
                    <Input type="text"
                           @on-change="_inputDebounce"
                           v-model="filterOpt.name"
                           placeholder="筛选姓名"></Input>
                </FormItem>
                <FormItem label="加减类型">
                    <Select v-model="filterOpt.plusType"
                            clearable
                            @on-change="_filterResultHandler"
                            placeholder="筛选类型"
                            style="width: 100px">
                        <Option value="0">加金币记录</Option>
                        <Option value="1">扣金币记录</Option>
                    </Select>
                </FormItem>
                <FormItem label="属性">
                    <Select v-model="filterOpt.option"
                            clearable
                            @on-change="_filterResultHandler"
                            placeholder="筛选属性"
                            style="width: 100px">
                        <Option value="财富点">财富点</Option>
                        <Option value="技能点">技能点</Option>
                        <Option value="伯乐点">伯乐点</Option>
                        <Option value="智慧点">智慧点</Option>
                    </Select>
                </FormItem>
                <FormItem label="开始日期">
                    <DatePicker @on-change="filterOpt.startDate = $event"
                                clearable
                                :value="filterOpt.startDate"></DatePicker>
                </FormItem>
                <FormItem label="结束日期">
                    <DatePicker @on-change="filterOpt.endDate = $event"
                                clearable
                                :value="filterOpt.endDate"></DatePicker>
                </FormItem>
            </Form>
            <Table :columns="postColumns"
                   :loading="tableLoading"
                   :height="tableHeight"
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
    import debounce from 'lodash/debounce';
    export default {
        name: 'coinRecord',
        data () {
            return {
                postFormType: 'update',
                filterOpt: {
                    name: '',
                    plusType: '',
                    option: '',
                    startDate: '',
                    endDate: ''
                },
                postColumns: [
                    {
                        title: '姓名',
                        key: 'user_name',
                        align: 'center',
                        width: 120
                    },
                    {
                        title: '金币数量',
                        align: 'center',
                        width: 120,
                        render: (h, params) => {
                            return h('span', {
                                style: {
                                    color: params.row.flag ? '#ed3f14' : '#19be6b'
                                }
                            }, params.row.opt_num);
                        }
                    },
                    {
                        title: '属性',
                        key: 'property',
                        align: 'center',
                        width: 120
                    },
                    {
                        title: '说明',
                        key: 'reason'
                    },
                    {
                        title: '日期',
                        key: 'opt_time',
                        align: 'center'
                    },
                    {
                        title: '操作人',
                        key: 'opter',
                        width: 120
                    }
                ],
                tableHeight: 500
            };
        },
        watch: {
            'filterOpt.startDate'() {
                this._filterResultHandler();
            },
            'filterOpt.endDate'() {
                this._filterResultHandler();
            }
        },
        mixins: [pageMixin],
        created() {
            this._getPostData();
            this._setTableHeight();
        },
        methods: {
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
                data.userName = this.filterOpt.name;
                data.exampleFlag = this.filterOpt.plusType;
                data.proper = this.filterOpt.option;
                data.startDate = this.filterOpt.startDate;
                data.endDate = this.filterOpt.endDate;
                this.getList('/coin/coinlist', data);
            }
        },
        components: {}
    };
</script>
