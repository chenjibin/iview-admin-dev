<template>
    <!--资产分类-->
    <div id="assetsCategory">
        <Card>
            <Form inline :label-width="60">
                <FormItem label="位置名称">
                    <Input type="text" style="width: 173px"
                           @on-change="_inputDebounce"
                           v-model="filterOpt.name"
                           placeholder="位置名称"></Input>
                </FormItem>
                <Button type="ghost" @click="addInfo">
                    <Icon type="plus-circled"></Icon>
                    <span>新增</span>
                </Button>
                <Button type="ghost" icon="edit" @click="changeInfo">修改</Button>
                <Button type="ghost" icon="trash-b" @click="delInfo">删除</Button>
            </Form>
            <div class="" style="width: 100%;overflow: auto;" >
                <el-tree class="fs-tree"
                         :data="dataList"
                         :props="defaultProps"
                         node-key="id"
                         default-expand-all
                         highlight-current
                         :expand-on-click-node="false"
                         :render-content="renderContent"
                         :check-strictly="true"
                         @current-change="checkmea"
                         ref="tree1">
                </el-tree>
            </div>
        </Card>
        <Modal v-model="addInfoModal" width="300">
            <Form style="margin-top: 20px">
                <FormItem label="父级名称">
                    <Input type="text" style="width: 173px"
                           v-model="addForm.fname" :disabled="true"
                           placeholder="父级名称"></Input>
                </FormItem>
                    <Input type="text" style="display: none"
                           v-model="addForm.pid"></Input>
                <FormItem label="新建名称">
                    <Input type="text" style="width: 173px"
                           v-model="addForm.name"
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
                       v-model="modifyInfo.id"
                       placeholder="父级名称"></Input>
                <FormItem label="父级名称">
                    <Input type="text" style="width: 173px"
                           v-model="modifyInfo.fname" :disabled="true"
                           placeholder="父级名称"></Input>
                </FormItem>
                <Input type="text" style="display: none" v-model="modifyInfo.pid"></Input>
                <FormItem label="新建名称">
                    <Input type="text" style="width: 173px"
                           v-model="modifyInfo.name"
                           placeholder="新建名称"></Input>
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
    export default {
        name: 'assetsCategory',
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
                addForm: {
                    name: '',
                    pid: ''
                },
                modifyInfo: {
                    name: '',
                    pid: ''
                },
                changeInfoModal: false,
                addInfoModal: false,
                dataList: []
            };
        },
        mixins: [pageMixin],
        created () {
            this._getPostData();
            // this._setTableHeight();
        },
        methods: {
            changeInfo(data) {
                this.changeInfoModal = true;
            },
            saveInfo() {
                var vm = this;
                vm.$http.post('/assetsCategory/add', vm.addForm).then((res) => {
                    if (res.success) {
                        vm.$Message.success('保存成功');
                        vm.addInfoModal = false;
                        vm._getPostData();
                    }
                });
            },
            updateInfo() {
                var vm = this;
                vm.$http.post('/assetsCategory/add', vm.modifyInfo).then((res) => {
                    if (res.success) {
                        vm.$Message.success('保存成功');
                        vm.changeInfoModal = false;
                        vm._getPostData();
                    }
                });
            },
            addInfo() {
                if (!this.addForm.pid) {
                    this.$Message.info('未选中节点');
                    return false;
                }
                this.addInfoModal = true;
            },
            checkmea(data,node) {
                console.log(data);
                console.log(node);
                this.addForm.fname = data.name;
                this.addForm.pid = data.id;
                this.modifyInfo.pid = data.pid;
                this.modifyInfo.name = data.name;
                this.modifyInfo.id = data.id;
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
                        this.$http.post('/assetsCategory/delete', {id: vm.modifyInfo.id}).then((res) => {
                            if (res.success) {
                                vm._getPostData();
                                vm.$Modal.remove();
                                vm.$Message.success('删除成功');
                            }
                        });
                    }
                });
            },
            renderContent(h, { node, data, store }) {
                return (
                    <span class="custom-tree-node">
                    <span class="title">{data.name}</span>
                    <span class="buttons">
                    </span>
                </span>
            );
            // <i-button type="ghost" class="oneBtn" size="small" icon="edit"></i-button>
            //         <i-button type="ghost" class="oneBtn" size="small" icon="plus"></i-button>
            //         <i-button type="ghost" class="oneBtn" size="small" icon="close"></i-button>
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
                this.tableHeight = dm - 57 - 33 - 16;
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
    #assetsCategory{
        .custom-tree-node {
            position: relative;
            span.title {
                font-size: 14px;
                line-height: 2;
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
-
