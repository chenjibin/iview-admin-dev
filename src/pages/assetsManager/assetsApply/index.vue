<template>
    <!--资产分类-->
    <div id="assetsCategory">
        <Card>
            <Form inline :label-width="60">
                <FormItem label="申请类型">
                    <Select type="text" v-model="filterOpt.appType.value" style="width: 130px">
                        <Option :value="1">采购申请</Option>
                        <Option :value="3">报废申请</Option>
                    </Select>
                </FormItem>
                <FormItem label="资产名称">
                    <Input type="text" v-model="filterOpt.categoryName.value" style="width: 160px" readonly>
                        <Button slot="append" @click="items = true" icon="location" style="width: 30px"></Button>
                    </Input>
                </FormItem>
                <Button type="ghost" @click="addInfo">
                    <Icon type="plus-circled"></Icon>
                    <span>新增采购</span>
                </Button>
                <Button type="ghost" @click="addInfo">
                    <Icon type="plus-circled"></Icon>
                    <span>报废申请</span>
                </Button>
                <Button type="ghost" icon="edit" @click="changeInfo">修改</Button>
                <Button type="ghost" icon="trash-b" @click="delInfo">删除</Button>
            </Form>
            <fs-table-page :columns="postColumns"
                           :size="null"
                           :height="tableHeight"
                           :params="filterOpt"
                           url="/assetsApplication/applicationList"></fs-table-page>

        </Card>
        <Modal v-model="addInfoModal" width="300">
            <Form style="margin-top: 20px">
                <FormItem label="父级名称">
                    <Input type="text" style="width: 173px"
                           v-model="customerForm.addForm.fname" :disabled="true"
                           placeholder="父级名称"></Input>
                </FormItem>
                <Input type="text" style="display: none"
                       v-model="customerForm.addForm.pid"></Input>
                <FormItem label="新建名称">
                    <Input type="text" style="width: 173px"
                           v-model="customerForm.addForm.name"
                           placeholder="新建名称"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary" size="large" @click="saveInfo">
                    <span>确定</span>
                </Button>
            </div>
        </Modal>
        <Modal v-model="changeInfoModal" width="300">
            <Form style="margin-top: 20px">
                <Input type="text" style="display: none"
                       v-model="customerForm.modifyInfo.id"></Input>
                <Input type="text" style="display: none" v-model="customerForm.modifyInfo.pid"></Input>
                <FormItem label="修改名称">
                    <Input type="text" style="width: 173px"
                           v-model="customerForm.modifyInfo.name"
                           placeholder="修改名称"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary" size="large" @click="updateInfo">
                    <span>确定</span>
                </Button>
            </div>
        </Modal>
        <Modal v-model="newApplyModal" width="300">
            <Form style="margin-top: 20px">
                <Input type="text" style="display: none"
                       v-model="customerForm.modifyInfo.id"></Input>
                <Input type="text" style="display: none" v-model="customerForm.modifyInfo.pid"></Input>
                <FormItem label="修改名称">
                    <Input type="text" style="width: 173px"
                           v-model="customerForm.modifyInfo.name"
                           placeholder="修改名称"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary" size="large" @click="updateInfo">
                    <span>确定</span>
                </Button>
            </div>
        </Modal>
        <Modal v-model="items" width="350" @on-ok="ItemChecked">
            <div style="margin: 20px 0"><span>选中：</span><span style="font-weight: bold;font-size: 14px;">{{customerForm.modifyInfo.name||''}}</span></div>
            <div style="height: 390px;overflow: auto;margin-top: 20px">
                <assetsTree width="250px" :expanded="false" v-on:customerForm="getCustomerForm" ref="assetsTree"></assetsTree>
            </div>
        </Modal>
    </div>
</template>

<script>
    // 简单的axios薄层封装
    import pageMixin from '@/mixins/pageMixin';
    // lodash输入延时
    import debounce from 'lodash/debounce';
    import assetsTree from '@/baseComponents/assets-tree.vue';
    import fsTablePage from '@/baseComponents/fs-table-page';
    export default {
        name: 'assetsApply',
        components: {assetsTree, fsTablePage},
        data() {
            return {
                filterOpt: {
                    categoryName: {
                        value : '',
                        type: 'input'
                    },
                    appType: {
                        value : '',
                        type: 'select'
                    }
                },
                items: false,
                newApplyModal: false,
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                customerForm: {
                    addForm: {
                        fname: '',
                        pid: -1
                    },
                    modifyInfo: {
                        pid: -1,
                        name: '',
                        id: -1
                    }

                },
                itemsCheck: {
                    name: '',
                    id: -1
                },
                postColumns: [
                    {
                        title: '申请类型',
                        key: 'apptype',
                        align: 'center'
                    },
                    {
                        title: '资产名称',
                        key: 'categoryname',
                        align: 'center'
                    },
                    {
                        title: '申请数量',
                        key: 'num',
                        align: 'center'
                    },
                    {
                        title: '申请状态',
                        key: 'status',
                        align: 'center'
                    },
                    {
                        title: '资产位置',
                        key: 'positionname',
                        align: 'center'
                    },
                    {
                        title: '申请规格',
                        key: 'remarks',
                        align: 'center'
                    },
                    {
                        title: '报废方式',
                        key: 'scrappedtype',
                        align: 'center'
                    },
                    {
                        title: '申请规格',
                        key: 'scrappedtype',
                        align: 'center'
                    },
                    {
                        title: '申请部门',
                        key: 'organizename',
                        align: 'center'
                    },
                    {
                        title: '申请人',
                        key: 'createbyname',
                        align: 'center'
                    },
                    {
                        title: '申请日期',
                        key: 'createbydate',
                        align: 'center'
                    },
                    {
                        title: '查看进度',
                        key: 'createbydate',
                        align: 'center'
                    }
                ],
                changeInfoModal: false,
                addInfoModal: false,
                dataList: [],
                tableHeight: 500
            };
        },
        mixins: [pageMixin],
        created() {
            this._setTableHeight();
        },
        methods: {
            changeInfo(data) {
                this.changeInfoModal = true;
            },
            ItemChecked() {
                this.filterOpt.categoryName = this.customerForm.modifyInfo.name;
                this.itemsCheck = this.customerForm.modifyInfo;
            },
            showItmes() {
                this.newApplyModal = true;
            },
            saveInfo() {
                var vm = this;
                vm.$http.post('/assetsCategory/add', vm.customerForm.addForm).then((res) => {
                    if (res.success) {
                        vm.$Message.success('保存成功');
                        vm.addInfoModal = false;
                        vm.$refs.assetsTree._getPostData();
                    }
                });
            },
            updateInfo() {
                var vm = this;
                vm.$http.post('/assetsCategory/add', vm.customerForm.modifyInfo).then((res) => {
                    if (res.success) {
                        vm.$Message.success('保存成功');
                        vm.changeInfoModal = false;
                        vm.$refs.assetsTree._getPostData();
                    }
                });
            },
            addInfo() {
                if (!this.customerForm.addForm.pid) {
                    this.$Message.info('未选中节点');
                    return false;
                }
                this.addInfoModal = true;
            },
            getCustomerForm(customerForm) {
                this.customerForm = customerForm;
            },
            delInfo() {
                var vm = this;
                this.$Modal.confirm({
                    title: '删除提醒',
                    content: '是否确认删除？',
                    okText: '删除',
                    cancelText: '取消',
                    loading: true,
                    onOk () {
                        this.$http.post('/assetsCategory/delete', {id: vm.customerForm.modifyInfo.id}).then((res) => {
                            if (res.success) {
                                vm.$refs.assetsTree._getPostData();
                                vm.$Modal.remove();
                                vm.$Message.success('删除成功');
                            }
                        });
                    }
                });
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },
            _inputDebounce: debounce(function () {
                this._filterResultHandler();
            }, 1600),
            _setTableHeight () {
                let dm = document.body.clientHeight;
                this.tableHeight = dm - 100 - 20 - 2 - 32 - 10 - 32 - 57 - 7;
            },
            _getPostData () {
                this.$http.post('/assetsCategory/categoryList', {pid: -1}).then((res) => {
                    this.dataList = res.data;
                });
            }
        }
    };
</script>

<style lang="less">
</style>
