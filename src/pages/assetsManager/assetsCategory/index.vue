<template>
    <!--资产分类-->
    <div id="assetsCategory">
        <Card>
            <Form inline>
                <Button type="ghost" @click="addInfo">
                    <Icon type="plus-circled"></Icon>
                    <span>新增</span>
                </Button>
                <Button type="ghost" icon="edit" @click="changeInfo">修改</Button>
                <Button type="ghost" icon="trash-b" @click="delInfo">删除</Button>
            </Form>
            <div style="overflow: auto;margin-top: 10px" :style="{height: tableHeight+'px'}">
                <assetsTree v-on:customerForm="getCustomerForm" ref="assetsTree"></assetsTree>
            </div>
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
    </div>
</template>

<script>
    // 简单的axios薄层封装
    import pageMixin from '@/mixins/pageMixin';
    // lodash输入延时
    import debounce from 'lodash/debounce';
    import assetsTree from '@/baseComponents/assets-tree.vue';
    export default {
        name: 'assetsCategory',
        components: {assetsTree},
        data() {
            return {
                tableHeight: 500,
                filterOpt: {
                    name: ''
                },
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
                changeInfoModal: false,
                addInfoModal: false,
                dataList: []
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
                this.tableHeight = dm - 100 - 20 - 2 - 32 - 10 - 32;
            }
        }
    };
</script>

<style lang="less">
    #assetsCategory{
        .custom-tree-node {
            position: relative;
            span.title {
                font-size: 14px;
                word-spacing: 8px;
                letter-spacing: 6px;
            }
            .buttons{
                position: absolute;
                left: 160px;
                top: 1px;
                .oneBtn{
                    margin-left: 10px;
                    font-size: 12px;
                }
            }
            .Lv1{
                color: #f7b84f;
            }
        }
    }
</style>
