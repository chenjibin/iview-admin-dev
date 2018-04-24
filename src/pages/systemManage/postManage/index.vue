<template>
    <div>
        <Card>
            <Form inline :label-width="80">
                <FormItem label="岗位名称">
                    <Input type="text"
                           @on-change="_inputDebounce"
                           v-model="filterOpt.name"
                           placeholder="筛选岗位名称"></Input>
                </FormItem>
                <FormItem label="岗位职级">
                    <Input type="text"
                           @on-change="_inputDebounce"
                           v-model="filterOpt.level"
                           placeholder="筛选岗位职级"></Input>
                </FormItem>
                <FormItem label="岗位部门">
                    <Input type="text"
                           @on-change="_inputDebounce"
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
                <FormItem>
                    <ButtonGroup>
                        <Button type="primary" @click="_addPostOpen">
                            <Icon type="plus-round"></Icon>
                            新增岗位
                        </Button>
                    </ButtonGroup>
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
            <Modal v-model="settingModalFlag"
                   width="600"
                   :mask-closable="false">
                <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                    <span>{{postFormType === 'update' ? '岗位设置' : '添加岗位'}}</span>
                </p>
                <Form :model="postSettingForm"
                      :rules="postRules"
                      ref="postForm"
                      :label-width="80">
                    <Row>
                        <Col :span="8">
                        <FormItem label="状态">
                            <i-switch v-model="postSettingForm.states" size="large">
                                <span slot="open">启用</span>
                                <span slot="close">禁用</span>
                            </i-switch>
                        </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col :span="12">
                            <FormItem label="岗位名称" prop="name">
                                <Input v-model="postSettingForm.name" :disabled="postFormType === 'update'"></Input>
                            </FormItem>
                        </Col>
                        <Col :span="8">
                        <FormItem label="岗位职级">
                            <Input v-model="postSettingForm.level"></Input>
                        </FormItem>
                        </Col>
                        <Col :span="24">
                            <FormItem label="岗位部门">
                                <el-cascader
                                        :options="orgTreeData"
                                        :props="depProps"
                                        v-model="postSettingForm.organizeId"
                                        change-on-select
                                        size="small"
                                        style="width: 100%"
                                ></el-cascader>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                <div slot="footer">
                    <!--<Poptip-->
                            <!--confirm-->
                            <!--:transfer="true"-->
                            <!--@on-ok="_delPost"-->
                            <!--title="是否确认删除此岗位？">-->
                        <!--<Button type="error" v-show="postFormType === 'update'">删除岗位</Button>-->
                    <!--</Poptip>-->
                    <Button type="primary"
                            @click="_addPost"
                            :disabled="btnDisabled"
                            v-show="postFormType === 'add'">添加</Button>
                    <Button type="primary"
                            @click="_updatePost"
                            :disabled="btnDisabled"
                            v-show="postFormType === 'update'">更新</Button>
                    <Button type="ghost" style="margin-left: 8px" @click="settingModalFlag = false">取消</Button>
                </div>
            </Modal>
        </Card>
    </div>
</template>
<style>

</style>
<script>
    import pageMixin from '@/mixins/pageMixin';
    import debounce from 'lodash/debounce';
    export default {
        name: 'postManage',
        data () {
            return {
                settingModalFlag: false,
                postFormType: 'update',
                orgTreeData: [],
                btnDisabled: false,
                postId: '',
                postRules: {
                    name: [
                        { required: true, message: '岗位名称不能为空！', trigger: 'blur' }
                    ]
                },
                depProps: {
                    value: 'id',
                    label: 'name'
                },
                postSettingForm: {
                    states: '',
                    name: '',
                    organizeId: [],
                    level: ''
                },
                filterOpt: {
                    name: '',
                    level: '',
                    states: '1',
                    organizeName: ''
                },
                postColumns: [
                    {
                        title: '岗位ID',
                        key: 'id',
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
                        align: 'center',
                        width: 120,
                        render: (h, params) => {
                            return h('Tag', {
                                props: {
                                    type: 'border',
                                    color: +params.row.states === 1 ? 'green' : 'red'
                                }
                            }, +params.row.states === 1 ? '启用' : '禁用');
                        }
                    },
                    {
                        title: '操作',
                        width: 100,
                        render: (h, params) => {
                            let vm = this;
                            return h('div', [
                                h('Tooltip', {
                                    props: {
                                        content: '岗位设置',
                                        placement: 'top',
                                        transfer: true
                                    }
                                }, [
                                    h('Button', {
                                        props: {
                                            type: 'primary',
                                            icon: 'ios-gear',
                                            shape: 'circle'
                                        },
                                        on: {
                                            click: function () {
                                                vm._editorSetting(params.row);
                                            }
                                        }
                                    })
                                ])
                            ]);
                        }
                    }
                ],
                tableHeight: 500,
                storePath: []
            };
        },
        mixins: [pageMixin],
        created() {
            this._getPostData();
            this._setTableHeight();
            this._getOrgTree();
        },
        methods: {
            _initPostForm() {
                this.postSettingForm.states = true;
                this.postSettingForm.name = '';
                this.postSettingForm.organizeId = [];
                this.postSettingForm.level = '';
                this.storePath = [];
                this.$refs.postForm.resetFields();
            },
            _inputDebounce: debounce(function () {
                this._filterResultHandler();
            }, 600),
            _filterResultHandler() {
                this.initPage();
                this._getPostData();
            },
            _delPost() {
                let data = {};
                data.id = this.postId;
                this.$http.post('/post/delete', data).then((res) => {
                    if (res.success) {
                        this.$Message.success('岗位删除成功!');
                        this.postSettingForm = false;
                        this._getPostData();
                    }
                });
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
            _addPostOpen() {
                this.postFormType = 'add';
                this._initPostForm();
                this.settingModalFlag = true;
            },
            _editorSetting(data) {
                this.postFormType = 'update';
                this._initPostForm();
                this.postSettingForm.states = !!data.states;
                this.postSettingForm.name = data.name;
                this.postSettingForm.organizeId = this._returnOrgIds(data.organizeid);
                this.postSettingForm.level = data.level;
                this.postId = data.id;

                this.settingModalFlag = true;
            },
            _addPost() {
                this.$refs.postForm.validate((valid) => {
                    if (valid) {
                        this.btnDisabled = true;
                        let data = {};
                        data.id = 0;
                        data.states = this.postSettingForm.states ? 1 : 0;
                        data.name = this.postSettingForm.name;
                        data.organizeId = this.postSettingForm.organizeId.slice(-1)[0] || '';
                        data.level = this.postSettingForm.level;
                        this.$http.post('/post/add', data).then((res) => {
                            if (res.success) {
                                this.$Message.success('新增岗位成功!');
                                this._getPostData();
                                this.settingModalFlag = false;
                            }
                        }).finally(() => {
                            this.btnDisabled = false;
                        });
                    }
                });
            },
            _updatePost() {
                this.$refs.postForm.validate((valid) => {
                    if (valid) {
                        this.btnDisabled = true;
                        let data = {};
                        data.id = this.postId;
                        data.states = this.postSettingForm.states ? 1 : 0;
                        data.name = this.postSettingForm.name;
                        data.organizeId = this.postSettingForm.organizeId.slice(-1)[0] || '';
                        data.level = this.postSettingForm.level;

                        this.$http.post('/post/add', data).then((res) => {
                            if (res.success) {
                                this.$Message.success('更新岗位成功!');
                                this._getPostData();
                                this.settingModalFlag = false;
                            }
                        }).finally(() => {
                            this.btnDisabled = false;
                        });
                    }
                });
            },
            _getPostData() {
                let data = {};
                data.name = this.filterOpt.name;
                data.level = this.filterOpt.level;
                data.states = this.filterOpt.states;
                data.organizeName = this.filterOpt.organizeName;
                this.getList('/post/datalist', data);
            },
            _storeFilter(root, path, id) {
                root.forEach((item) => {
                    if (item.id === id) this.storePath = [...path, id];
                    if (item.children) this._storeFilter(item.children, [...path, item.id], id);
                });
            },
            _returnOrgIds(id) {
                if (!this.orgTreeData[0]) return [];
                let depsStore = this.orgTreeData;
                let path = [];
                this._storeFilter(depsStore, path, id);
                return this.storePath;
            },
            _getOrgTree() {
                this.$http.get('/organize/organizeTreeCertainVmC?fatherId=-1').then((res) => {
                    if (res.success) {
                        this.orgTreeData = res.data;
                    }
                });
            }
        },
        components: {}
    };
</script>
