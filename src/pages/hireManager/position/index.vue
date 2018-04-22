<template>
    <!--资产位置-->
    <div id="assetslocation">
        <Card>
            <Form inline :label-width="60">
                <FormItem label="岗位">
                    <Select type="text" style="width: 185px" filterable clearable
                            @on-change="_inputDebounce"
                            v-model="filterOpt.name"
                            placeholder="输入筛选岗位" clearable>
                        <Option v-for="(item,index) in dataComboList"
                                :label="isManger > 1 ?item.name:item.name+' '+item.companyname"
                                :key="'post-' + item.id"
                                :value="item.name">
                            <span>{{item.name}}</span>
                            <span v-if="isManger === 0 || isManger === 1"
                                  :title="item.companyname"
                                  style="float:right;color:#ccc;width:60px;text-overflow: ellipsis;text-align: right;white-space: nowrap;overflow: hidden">{{item.companyname}}</span>
                        </Option>
                    </Select>
                </FormItem>
                <Button type="ghost" @click="addInfo">
                    <Icon type="plus-circled"></Icon>
                    <span>新增</span>
                </Button>
            </Form>
            <Table :columns="postColumns"
                   ref="attendanceTable"
                   :loading="tableLoading"
                   :height="tableHeight"
                   :data="pageData.list">
            </Table>
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
        <Modal v-model="changeInfoModal" width="300">
            <Form style="margin-top: 20px" :label-width="60">
                <input style="display: none" v-model="baseInfo.id"/>
                <FormItem label="岗位名称">
                    <Input type="text" style="width: 173px"
                           v-model="baseInfo.name"
                           placeholder="岗位名称"></Input>
                </FormItem>
                <FormItem label="所属公司" v-if="isManger === 0 || isManger === 1">
                    <Select type="text" style="width: 173px"
                            v-model="baseInfo.companyId" >
                        <Option v-for="(item,index) in companyList"
                                :label="item.name"
                                :key="'com-' + item.id"
                                :value="item.id">{{item.name}}</Option>
                    </Select>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary" size="large" @click="saveInfo">
                    <span>确定</span>
                </Button>
            </div>
        </Modal>

    </div>
</template>

<script>
    // 简单的axios薄层封装
    import pageMixin from '@/mixins/pageMixin';
    // lodash输入延时
    import debounce from 'lodash/debounce';
    export default {
        name: 'position',
        data() {
            return {
                tableHeight: 500,
                filterOpt: {
                    name: ''
                },
                baseInfo: {
                    name: '',
                    companyId: 1,
                    remarks: ''
                },
                changeInfoModal: false,
                dataComboList: [],
                companyList: [],
                postColumns: [
                    {
                        title: '岗位名称',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '创建日期',
                        key: 'createbydate',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        align: 'center',
                        render: (h, params) => {
                            var vm = this;
                            return h('div', {
                            }, [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        icon: 'edit',
                                        shape: 'circle'
                                    },
                                    style: {
                                        marginRight: '20px'
                                    },
                                    on: {
                                        click: function () {
                                            vm.changeInfo(params.row);
                                            vm.changeInfoModal = true;
                                        }
                                    }
                                }),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        icon: 'close',
                                        shape: 'circle'
                                    },
                                    on: {
                                        click: function () {
                                            vm.delInfo(params.row);
                                        }
                                    }
                                })
                            ]);
                        }
                    }
                ]
            };
        },
        mixins: [pageMixin],
        created () {
            this._getPostData();
            this._setTableHeight();
            this.getPositionCombo();
            this.getCompanyList();
        },
        computed: {
            isManger() {
                return this.$store.state.user.userInfo.ismanger;
            }
        },
        methods: {
            changeInfo(data) {
                this.baseInfo.name = data.name;
                this.baseInfo.remarks = data.remarks;
                this.baseInfo.id = data.id;
                this.baseInfo.companyId = data.companyid;
            },
            getPositionCombo() {
                var vm = this;
                vm.$http.post('/talentPosition/dataComboList').then((res) => {
                    if (res.success) {
                        vm.dataComboList = res.data;
                    }
                });
            },
            saveInfo() {
                var vm = this;
                vm.$http.post('/talentPosition/add', vm.baseInfo).then((res) => {
                    if (res.success) {
                        vm.getPositionCombo();
                        vm._filterResultHandler();
                        vm.$Message.success('保存成功');
                        vm.changeInfoModal = false;
                    }
                });
            },
            addInfo() {
                this.baseInfo.name = '';
                this.baseInfo.remarks = '';
                this.baseInfo.companyId = 1;
                this.changeInfoModal = true;
            },
            delInfo(data) {
                var vm = this;
                this.baseInfo = data;
                this.$Modal.confirm({
                    title: '删除提醒',
                    content: '是否确认删除？',
                    okText: '删除',
                    cancelText: '取消',
                    loading: true,
                    onOk () {
                        this.$http.post('/talentPosition/delete', {id: vm.baseInfo.id}).then((res) => {
                            if (res.success) {
                                vm._filterResultHandler();
                                vm.$Modal.remove();
                                vm.$Message.success('删除成功');
                            }
                        });
                    }
                });
            },
            getCompanyList() {
                this.$http.post('/company/lists').then((res) => {
                    this.companyList = res.data;
                });
            },
            _inputDebounce: debounce(function () {
                this._filterResultHandler();
            }, 500),
            _filterResultHandler () {
                this.initPage();
                this._getPostData();
            },
            _setTableHeight () {
                let dm = document.body.clientHeight;
                this.tableHeight = dm - 100 - 20 - 34 - 57 - 49;
            },
            _setPage (page) {
                this.pageData.page = page;
                this._getPostData();
            },
            _setPageSize (size) {
                this.pageData.pageSize = size;
                this._getPostData();
            },
            _getPostData () {
                this.getList('/talentPosition/datalist', this.filterOpt);
            }
        }
    };
</script>

<style scoped>

</style>
