<template>
    <div>
        <Card>
            <Form inline :label-width="60">
                <FormItem label="商品名称">
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
                        <Option value="加金币记录">加金币记录</Option>
                        <Option value="扣金币记录">扣金币记录</Option>
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
                        key: 'organizename',
                        align: 'center'
                    },
                    {
                        title: '金币数量',
                        key: 'postname',
                        align: 'center'
                    },
                    {
                        title: '属性',
                        key: 'user_name',
                        align: 'center'
                    },
                    {
                        title: '说明',
                        key: 'user_name',
                        align: 'center'
                    },
                    {
                        title: '日期',
                        key: 'user_name',
                        align: 'center'
                    },
                    {
                        title: '操作人',
                        key: 'states',
                        align: 'center',
                        width: 120,
                        render: (h, params) => {
                            return h('Tag', {
                                props: {
                                    type: 'border',
                                    color: params.row.status === '未审核' ? 'red' : 'green'
                                }
                            }, params.row.status);
                        }
                    }
                ],
                tableHeight: 500
            };
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
                data.name = this.filterOpt.name;
                data.plusType = this.filterOpt.plusType;
                data.option = this.filterOpt.option;
                data.startDate = this.filterOpt.startDate;
                data.endDate = this.filterOpt.endDate;
                this.getList('', data);
            }
        },
        components: {}
    };
</script>
