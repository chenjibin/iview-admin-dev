<template>
    <div id="organization-manage">
        <Input class="fs-filter-tree"
                placeholder="按照部门名称进行筛选"
                v-model="filterTextName">
        </Input>
        <div class="">
            <div class="fs-tree-header">
                <div class="title" style="flex: 0 0 300px;">
                    <span>部门名称</span>
                </div>
                <div class="detail">
                    <span style="width:160px;">分管部门领导岗位</span>
                    <span style="width:160px;">分管部门领导</span>
                    <span style="width:160px;">部门负责人岗位</span>
                    <span style="width:160px;">部门负责人</span>
                    <span style="width:600px;">包含岗位</span>
                </div>
            </div>
            <div class="" style="width: 100%;overflow: auto;" :style="{'height': initHeight + 'px'}">
                <el-tree class="fs-tree"
                         :data="orgData"
                         :props="defaultProps"
                         node-key="id"
                         default-expand-all
                         :expand-on-click-node="false"
                         :filter-node-method="filterNode"
                         :render-content="renderContent"
                         ref="tree1">
                </el-tree>
            </div>
        </div>
        <Modal v-model="depSettingFlag"
               :mask-closable="false"
               width="800">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>{{formType === 'create' ? '新增部门' : '编辑部门'}}</span>
            </p>
            <Form :model="depSettingForm"
                  ref="coinForm"
                  :rules="orgaRules"
                  :label-width="80">
                <Row type="flex">
                    <Col :span="24">
                        <FormItem label="上级部门" prop="fatherId">
                            <el-cascader
                                    :options="orgData"
                                    :props="depProps"
                                    v-model="depSettingForm.fatherId"
                                    change-on-select
                                    size="small"
                                    style="width: 100%"
                            ></el-cascader>
                        </FormItem>
                    </Col>
                    <Col :span="24">
                        <FormItem prop="name" label="当前部门">
                            <Input type="text"
                                   v-model="depSettingForm.name"></Input>
                        </FormItem>
                    </Col>
                    <Col :span="12">
                        <FormItem label="分管部门领导岗位" :label-width="120" required>
                            <fs-search-post v-model="depSettingForm.leaderPostId"
                                            :optionlist.sync="backShow.leaderPostOpt"
                                            :clearable="true"
                                            :label="backShow.leaderPostLabel"></fs-search-post>
                        </FormItem>
                    </Col>
                    <Col :span="12">
                        <FormItem label="分管部门领导姓名" :label-width="120" required>
                            <fs-search-user v-model="depSettingForm.leaderUserId"
                                            :optionlist.sync="backShow.leaderNameOpt"
                                            :clearable="true"
                                            :label="backShow.leaderNameLabel"></fs-search-user>
                        </FormItem>
                    </Col>
                    <Col :span="12">
                        <FormItem label="负责人岗位" :label-width="120" required>
                            <fs-search-post v-model="depSettingForm.chargerPostId"
                                            :optionlist.sync="backShow.chargerPostOpt"
                                            :clearable="true"
                                            :label="backShow.chargerPostLabel"></fs-search-post>
                        </FormItem>
                    </Col>
                    <Col :span="12">
                        <FormItem label="负责人姓名" :label-width="120" required>
                            <fs-search-user v-model="depSettingForm.chargerUserId"
                                            :optionlist.sync="backShow.chargerNameOpt"
                                            :clearable="true"
                                            :label="backShow.chargerNameLabel"></fs-search-user>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
            <div slot="footer">
                <Button type="primary"
                        v-show="formType === 'create'"
                        @click="_createDep">创建部门</Button>
                <Button type="primary"
                        @click="_updateDep"
                        v-show="formType === 'update'">确认修改</Button>
                <Button type="ghost" style="margin-left: 8px" @click="depSettingFlag = false">取消</Button>
            </div>
        </Modal>
    </div>
</template>
<style lang="less">
    #organization-manage {
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
                .title {
                    width: 300px;
                    .head:hover + .tag-group {
                        display: inline-block;
                    }
                    .tag-group:hover {
                        display: inline-block;
                    }
                    .tag-group {
                        display: none;
                    }
                }
                .detail {
                    display: flex;
                    justify-content: flex-end;
                    flex: 1;
                    padding-right: 6px;
                    span {

                    }
                }
            }
        }
        .fs-tree-header {
            display: flex;
            padding: 10px 6px;
            background-color: #f8f8f9;
            color: #1f2d3d;
            font-weight: bold;
            font-size: 14px;
            border: 1px solid #dddee1;
            .title {
                width: 300px;
            }
            .detail {
                display: flex;
                justify-content: flex-end;
                flex: 1;
                span {
                    float: right;
                }
            }
        }
    }
</style>
<script>
    import fsSearchUser from '@/baseComponents/fs-search-user';
    import fsSearchPost from '@/baseComponents/fs-search-post';
    export default {
        name: 'organizationManage',
        data () {
            return {
                depSettingFlag: false,
                storePath: [],
                orgaRules: {
                    name: [
                        {required: true, message: '部门名称不能为空!', trigger: 'blur'}
                    ]
                },
                backShow: {
                    leaderPostOpt: [],
                    leaderPostLabel: '',
                    leaderNameOpt: [],
                    leaderNameLabel: '',
                    chargerPostOpt: [],
                    chargerPostLabel: '',
                    chargerNameOpt: [],
                    chargerNameLabel: ''
                },
                depSettingForm: {
                    name: '',
                    fatherId: [],
                    chargerPostId: '', //  负责人岗位id
                    chargerUserId: '', //  负责人用户id
                    leaderPostId: '', //  分管领导岗位id
                    leaderUserId: ''//  分管领导用户id
                },
                orgData: [],
                depProps: {
                    value: 'id',
                    label: 'name'
                },
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                formType: 'create',
                initHeight: 300,
                filterTextName: '',
                depId: ''
            };
        },
        watch: {
            'filterTextName'(val) {
                this.$refs.tree1.filter(val);
            }
        },
        created() {
            this._getOrgData();
            this._setTreeHeight();
        },
        methods: {
            _validEmpty() {
                let nowForm = this.depSettingForm;
                let flag = nowForm.chargerPostId && nowForm.chargerUserId && nowForm.leaderPostId &&nowForm.leaderUserId;
                if (!flag) {
                    this.$Message.error('星号项不能为空!');
                }
                return flag;
            },
            _initFormData() {
                this.depId = '';
                this.depSettingForm.name = '';
                this.depSettingForm.fatherId = [];
                this.depSettingForm.leaderUserId = '';
                this.depSettingForm.leaderPostId = '';
                this.depSettingForm.chargerUserId = '';
                this.depSettingForm.chargerPostId = '';
                this.backShow.leaderPostOpt = [];
                this.backShow.leaderPostLabel = '';
                this.backShow.leaderNameOpt = [];
                this.backShow.leaderNameLabel = '';
                this.backShow.chargerPostOpt = [];
                this.backShow.chargerPostLabel = '';
                this.backShow.chargerNameOpt = [];
                this.backShow.chargerNameLabel = '';
            },
            _updateDep() {
                this.$refs.coinForm.validate((valid) => {
                    valid = this._validEmpty();
                    if (valid) {
                        let data = {};
                        data.id = this.depId;
                        data.fatherId = this.depSettingForm.fatherId.slice(-1)[0];
                        data.name = this.depSettingForm.name;
                        data.chargerPostId = this.depSettingForm.chargerPostId;
                        data.chargerUserId = this.depSettingForm.chargerUserId;
                        data.leaderPostId = this.depSettingForm.leaderPostId;
                        data.leaderUserId = this.depSettingForm.leaderUserId;
                        this.$http.post('/organize/add', data).then((res) => {
                            if (res.success) {
                                this.$Message.success('更新部门成功!');
                                this.depSettingFlag = false;
                                this._getOrgData();
                            }
                        });
                    }
                });
            },
            _createDep() {
                this.$refs.coinForm.validate((valid) => {
                    valid = this._validEmpty() && valid;
                    if (valid) {
                        let data = {};
                        data.id = 0;
                        data.fatherId = this.depSettingForm.fatherId.slice(-1)[0];
                        data.name = this.depSettingForm.name;
                        data.chargerPostId = this.depSettingForm.chargerPostId;
                        data.chargerUserId = this.depSettingForm.chargerUserId;
                        data.leaderPostId = this.depSettingForm.leaderPostId;
                        data.leaderUserId = this.depSettingForm.leaderUserId;
                        this.$http.post('/organize/add', data).then((res) => {
                            if (res.success) {
                                this.$Message.success('新增部门成功!');
                                this.depSettingFlag = false;
                                this._getOrgData();
                            }
                        });
                    }
                });
            },
            _storeFilter(root, path, id) {
                root.forEach((item) => {
                    if (item.id === id) this.storePath = [...path, id];
                    if (item.children) this._storeFilter(item.children, [...path, item.id], id);
                });
            },
            _returnOrgIds(id) {
                let depsStore = this.orgData;
                let path = [];
                this._storeFilter(depsStore, path, id);
                return this.storePath;
            },
            _setTreeHeight() {
                let dm = document.body.clientHeight;
                this.initHeight = dm - 220;
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },
            _getOrgData() {
                this.$http.get('/organize/organizeList?fatherId=-1').then((res) => {
                    if (res.success) {
                        this.orgData = res.data;
                    }
                });
            },
            _returnNeedPostList(ids, names) {
                let idsArr = ids.split(',').filter(x => !!x);
                let namesArr = names.split(',').filter(x => !!x);
                let storeArr = [];
                for (let i = 0, length = idsArr.length; i < length; i++) {
                    storeArr[i] = {};
                }
                storeArr.forEach((item, index, arr) => {
                    item.id = +idsArr[index];
                    item.name = namesArr[index];
                });
                return storeArr;
            },
            append(store, data) {
                this._initFormData();
                this.formType = 'create';
                this.depSettingForm.name = '';
                this.depSettingForm.fatherId = this._returnOrgIds(data.id);
                this.depSettingFlag = true;
            },
            editInfo(store, data) {
                this._initFormData();
                this.depId = data.id;
                this.formType = 'update';
                this.depSettingForm.name = data.name;
                this.depSettingForm.fatherId = this._returnOrgIds(data.fatherId);
                this.backShow.leaderPostOpt = [
                    {
                        id: data.leaderPostId,
                        name: data.leaderName,
                        organizename: data.leaderPostOrganize
                    }
                ];
                this.backShow.leaderPostLabel = data.leaderName;
                this.depSettingForm.leaderPostId = data.leaderPostId;
                this.backShow.leaderNameOpt = [
                    {
                        id: data.leaderUserId,
                        realname: data.leaderUserName,
                        organizename: data.leaderUserOrganize
                    }
                ];
                this.backShow.leaderNameLabel = data.leaderUserName;
                this.depSettingForm.leaderUserId = data.leaderUserId;
                this.backShow.chargerPostOpt = [
                    {
                        id: data.chargerPostId,
                        name: data.chargerName,
                        organizename: data.chargerPostOrganize
                    }
                ];
                this.backShow.chargerPostLabel = data.chargerName;
                this.depSettingForm.chargerPostId = data.chargerPostId;
                this.backShow.chargerNameOpt = [
                    {
                        id: data.chargerUserId,
                        realname: data.chargerUserName,
                        organizename: data.chargerUserOrganize
                    }
                ];
                this.backShow.chargerNameLabel = data.chargerUserName;
                this.depSettingForm.chargerUserId = data.chargerUserId;
                this.depSettingFlag = true;
            },
            remove(store, data) {
                if (data.children && data.children.length !== 0) {
                    this.$Message.error('下级有部门,不可以删除！');
                    return;
                }
                let sendData = {};
                sendData.id = data.id;
                this.$http.post('/organize/delete', sendData).then((res) => {
                    if (res.success) {
                        this.$Message.success('删除部门成功!');
                        this._getOrgData();
                    }
                });
            },
            renderContent(h, { node, data, store }) {
                return (
                    <div class="fs-node-wrapper">
                        <div class="title">
                            <span class="head">{data.name}</span>
                            <div class="tag-group">
                                <i-button  on-click={ () => this.append(store, data) }  size="small" style="margin-left:6px;" type="success">新增</i-button>
                                <i-button  on-click={ () => this.editInfo(store, data) } size="small" style="margin-left: 6px;" type="primary">编辑</i-button>
                                <i-button  on-click={ () => this.remove(store, data) } size="small" style="margin-left: 6px;" type="error">删除</i-button>
                            </div>
                        </div>
                    <div class="detail">
                        <span style="width:160px;">{data.leaderName}</span>
                        <span style="width:160px;">{data.leaderUserName}</span>
                        <span style="width:160px;">{data.chargerName}</span>
                        <span style="width:160px;">{data.chargerUserName}</span>
                        <span style="width:584px;overflow:hidden;text-overflow" title={data.postNames}>{data.postNames}</span>
                </div>
                </div>)
            }
        },
        components: {
            fsSearchUser,
            fsSearchPost
        }
    };
</script>
