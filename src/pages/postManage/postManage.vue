<template>
    <div>
        <Card>
            <Form inline :label-width="80">
                <FormItem label="岗位名称">
                    <Input type="text"
                           @on-change="testChange"
                           @on-blur="_filterResultHandler"
                           v-model="filterOpt.name"
                           placeholder="筛选岗位名称"></Input>
                </FormItem>
                <FormItem label="岗位职级">
                    <Input type="text"
                           @on-blur="_filterResultHandler"
                           v-model="filterOpt.level"
                           placeholder="筛选岗位职级"></Input>
                </FormItem>
                <FormItem label="岗位部门">
                    <Input type="text"
                           @on-blur="_filterResultHandler"
                           v-model="filterOpt.organizeName"
                           placeholder="筛选岗位部门"></Input>
                </FormItem>
                <FormItem label="状态">
                    <Select v-model="filterOpt.states"
                            clearable
                            @on-change="_filterResultHandler"
                            placeholder="筛选状态"
                            style="width: 100px">
                        <Option value="1">启用</Option>
                        <Option value="0">禁用</Option>
                    </Select>
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
    export default {
        name: 'postManage',
        data () {
            return {
                filterOpt: {
                    name: '',
                    level: '',
                    states: '',
                    organizeName: ''
                },
                postColumns: [
                    {
                        title: '岗位编号',
                        key: 'number',
                        align: 'center',
                        width: 100
                    },
                    {
                        title: '岗位名称',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '岗位部门',
                        key: 'organizename',
                        align: 'center'
                    },
                    {
                        title: '在岗人员',
                        key: 'username',
                        align: 'center'
                    },
                    {
                        title: '岗位职级',
                        key: 'level',
                        align: 'center'
                    },
                    {
                        title: '状态',
                        key: 'states',
                        width: 120,
                        render: (h, params) => {
                            return h('Tag', {
                                props: {
                                    type: 'border',
                                    color: +params.row.states === 1 ? 'green' : 'red'
                                }
                            }, +params.row.states === 1 ? '启用' : '禁用');
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
            testChange(val) {
                console.log(val);
            },
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
                data.level = this.filterOpt.level;
                data.states = this.filterOpt.states;
                data.organizeName = this.filterOpt.organizeName;
                this.getList('/post/datalist', data);
            }
        },
        components: {}
    };
</script>
