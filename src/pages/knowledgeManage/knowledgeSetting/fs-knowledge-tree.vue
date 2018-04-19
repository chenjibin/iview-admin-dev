<template>
    <Card id="knowledge-manage-tree">
        <Input class="fs-filter-tree"
               placeholder="按照菜单名称进行筛选"
               v-model="filterTextName">
        </Input>
        <div class="">
            <el-tree class="fs-tree"
                     :data="treeData"
                     :props="defaultProps"
                     node-key="id"
                     default-expand-all
                     highlight-current
                     v-if="treeData.length"
                     :expand-on-click-node="false"
                     :filter-node-method="filterNode"
                     @node-click="nodeClickHandler"
                     :render-content="renderContent"
                     ref="tree1">
            </el-tree>
            <div class="" v-else style="margin-top: 20px;text-align: center">
                <Poptip placement="right"
                        width="400">
                    <Button type="primary"
                            style="margin-left: 8px">新增目录</Button>
                    <div class="banci-add-form" slot="content">
                        <Form :rules="rootRules"
                              :model="rootForm"
                              ref="rootForm"
                              :label-width="100">
                            <FormItem label="根菜单名称" prop="name">
                                <Input v-model="rootForm.name"></Input>
                            </FormItem>
                            <FormItem style="text-align: left">
                                <Button type="primary" @click="_addRootCate" :loading="mubanBtnLoading">新增目录</Button>
                            </FormItem>
                        </Form>
                    </div>
                </Poptip>
            </div>
        </div>
        <Modal v-model="depSettingFlag"
               :mask-closable="false"
               width="600">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>{{formType === 'create' ? '新增菜单' : '编辑菜单'}}</span>
            </p>
            <Form :model="depSettingForm"
                  ref="cateForm"
                  :rules="orgaRules"
                  :label-width="100">
                <Row type="flex">
                    <Col :span="24">
                        <FormItem label="上级菜单" prop="fatherId">
                            <el-cascader
                                    :options="treeData"
                                    :props="depProps"
                                    v-model="depSettingForm.fatherId"
                                    change-on-select
                                    size="small"
                                    style="width: 100%"
                            ></el-cascader>
                        </FormItem>
                    </Col>
                    <Col :span="24">
                        <FormItem prop="name" label="当前菜单">
                            <Input type="text"
                                   v-model="depSettingForm.name"></Input>
                        </FormItem>
                    </Col>
                    <Col :span="24">
                        <FormItem prop="isImportant" label="是否重点知识">
                            <i-switch v-model="depSettingForm.important" size="large" :true-value="1" :false-value="0">
                                <span slot="open">是</span>
                                <span slot="close">否</span>
                            </i-switch>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
            <div slot="footer">
                <Button type="primary"
                        v-show="formType === 'create'"
                        @click="_createCate">创建菜单</Button>
                <Button type="primary"
                        @click="_updateCare"
                        v-show="formType === 'update'">确认修改</Button>
                <Button type="ghost" style="margin-left: 8px" @click="depSettingFlag = false">取消</Button>
            </div>
        </Modal>
    </Card>
</template>
<style lang="less">
    #knowledge-manage-tree {
        font-size: 14px;
        .fs-filter-tree {
            margin-bottom: 10px;
        }
        .fs-tree {
            border-top:0;
            min-height: 300px;
        }
        .el-tree-node__content {
            display: flex;
            .fs-node-wrapper {
                display: flex;
                flex: 1;
                justify-content: space-between;
                .tag-group {
                }
                .title {
                    .tag-group:hover {
                        display: inline-block;
                    }

                }
            }
        }
    }
</style>
<script>
    export default {
        name: 'FsKnowledgeTree',
        data () {
            return {
                mubanBtnLoading: false,
                formType: '',
                rootRules: {
                    name: [
                        {required: true, message: '菜单名称不能为空'}
                    ]
                },
                rootForm: {
                    name: ''
                },
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                depProps: {
                    value: 'id',
                    label: 'name'
                },
                depSettingFlag: false,
                filterTextName: '',
                orgaRules: {
                    name: [
                        {required: true, message: '菜单名称不能为空!', trigger: 'blur'}
                    ]
                },
                depSettingForm: {
                    name: '',
                    important: 0,
                    fatherId: []
                },
                chooseCateId: 0
            };
        },
        watch: {
            'filterTextName'(val) {
                if (!this.treeData.length) return;
                this.$refs.tree1.filter(val);
            }
        },
        computed: {
            treeData() {
                return this.$store.state.knowledge.treeData;
            }
        },
        created() {
            this.$store.commit('getTreeData');
        },
        methods: {
            nodeClickHandler(data) {
                this.$emit('node-click', data.id);
            },
            _initFormData() {
                this.chooseCateId = 0;
                this.depSettingForm.name = '';
                this.depSettingForm.important = 0;
                this.depSettingForm.fatherId = [];
            },
            _storeFilter(root, path, id) {
                root.forEach((item) => {
                    if (item.id === id) this.storePath = [...path, id];
                    if (item.children) this._storeFilter(item.children, [...path, item.id], id);
                });
            },
            _returnOrgIds(id) {
                let depsStore = this.treeData;
                let path = [];
                this._storeFilter(depsStore, path, id);
                return this.storePath;
            },
            append(store, data, e) {
                e.stopPropagation();
                this._initFormData();
                this.formType = 'create';
                this.depSettingForm.fatherId = this._returnOrgIds(data.id);
                this.chooseCateId = data.id;
                this.depSettingFlag = true;
            },
            appendItem(store, data, e) {
                e.stopPropagation();
            },
            _createCate() {
                this.$refs.cateForm.validate((valid) => {
                    if (valid) {
                        let data = {};
                        data.parentId = this.depSettingForm.fatherId.slice(-1)[0];
                        data.name = this.depSettingForm.name;
                        data.important = this.depSettingForm.important;
                        this.$http.post('/knowledge/addMenu', data).then((res) => {
                            if (res.success) {
                                this.$Message.success('菜单创建成功!');
                                this.depSettingFlag = false;
                                this.$store.commit('getTreeData');
                            }
                        });
                    }
                });
            },
            editInfo(store, data, e) {
                e.stopPropagation();
                this.formType = 'update';
                this.depSettingForm.name = data.name;
                this.depSettingForm.fatherId = this._returnOrgIds(data.parentId);
                this.depSettingForm.important = data.important || 0;
                this.chooseCateId = data.id;
                this.depSettingFlag = true;
            },
            _updateCare() {
                this.$refs.cateForm.validate((valid) => {
                    if (valid) {
                        let data = {};
                        data.id = this.chooseCateId;
                        data.parentId = this.depSettingForm.fatherId.slice(-1)[0];
                        data.name = this.depSettingForm.name;
                        data.important = this.depSettingForm.important;
                        this.$http.post('/knowledge/updateMenu', data).then((res) => {
                            if (res.success) {
                                this.$Message.success('菜单更新成功!');
                                this.depSettingFlag = false;
                                this.$store.commit('getTreeData');
                            }
                        });
                    }
                });
            },
            removeCate(store, data, e) {
                e.stopPropagation();
                this.chooseCateId = data.id;
                this.$Modal.confirm({
                    content: `确认删除【${data.name}】么？`,
                    okText: '确认删除',
                    cancelText: '取消',
                    onOk: () => {
                        let sendData = {};
                        sendData.id = data.id;
                        this.$http.post('/knowledge/deleteMenu', sendData).then((res) => {
                            if (res.success) {
                                this.$Message.success('删除成功!');
                                this.$store.commit('getTreeData');
                            }
                        });
                    }
                });
            },
            _addRootCate() {
                this.$refs.rootForm.validate((valid) => {
                    if (valid) {
                        this.mubanBtnLoading = true;
                        let data = {};
                        data.parentId = 0;
                        data.name = this.rootForm.name;
                        this.$http.post('/knowledge/addMenu', data).then((res) => {
                            if (res.success) {
                                this.$Message.success('添加成功!');
                                this.$store.commit('getTreeData');
                            }
                        }).finally(() => {
                            this.mubanBtnLoading = false;
                        });
                    }
                });
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },
            renderContent(h, { node, data, store }) {
                return (
                    <div class="fs-node-wrapper">
                        <div class="title">
                            <span class="head">{data.name}</span>
                            {data.important === 1 ? <i class="ivu-icon ivu-icon-star" style="margin-left: 6px;color:#ff0036;"></i> : ''}
                        </div>
                        <div class="tag-group">
                            {data.important === 1 ? <i-button  on-click={ (e) => this.appendItem(store, data, e) }  size="small" style="margin-left:6px;" type="text" icon="android-apps"></i-button> : ''}
                            {data.important === 1 ? '' : <i-button  on-click={ (e) => this.append(store, data, e) }  size="small" style="margin-left:6px;" type="text" icon="plus-round"></i-button>}
                            <i-button  on-click={ (e) => this.editInfo(store, data, e) } size="small" style="margin-left: 6px;" type="text" icon="edit"></i-button>
                            <i-button  on-click={ (e) => this.removeCate(store, data, e) } size="small" style="margin-left: 6px;" type="text" icon="ios-trash"></i-button>
                        </div>
                    </div>);
            }
        },
        components: {}
    };
</script>
