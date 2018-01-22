<template>
    <div id="employee-manage">
        <Row :gutter="10">
            <Col :span="4">
                <Card>
                    <Input v-model="filterText" size="large" placeholder="快速查找部门"></Input>
                    <el-tree :data="orgTreeData"
                             ref="treeDom"
                             :filter-node-method="filterNode"
                             :expand-on-click-node="false"
                             :highlight-current="true"
                             @node-click="_treeNodeClickHandler"
                             style="margin-top: 10px;"
                             :props="defaultProps"></el-tree>
                </Card>
            </Col>
            <Col :span="20">
                <Card>
                    <Form ref="searchData" :model="searchData" inline :label-width="50">
                        <FormItem prop="realName" label="姓名">
                            <Input type="text"
                                   @on-change="_inputDebounce"
                                   v-model="searchData.realName"
                                   placeholder="筛选姓名"></Input>
                        </FormItem>
                        <FormItem prop="postName" label="岗位">
                            <Input type="text"
                                   @on-change="_inputDebounce"
                                   v-model="searchData.postName"
                                   placeholder="筛选岗位"></Input>
                        </FormItem>
                        <FormItem label="角色">
                            <Select v-model="searchData.roleId" clearable :transfer="true" placeholder="筛选角色" style="width: 120px">
                                <Option :value="item.id" v-for="(item, index) in roleData" :key="'role' + index">{{item.name}}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="状态">
                            <Select v-model="searchData.states"
                                    clearable
                                    placeholder="筛选状态"
                                    style="width: 100px">
                                <Option value="1">启用</Option>
                                <Option value="0">禁用</Option>
                            </Select>
                        </FormItem>
                        <FormItem>
                            <ButtonGroup>
                                <Button type="primary" @click="_addUserOpen">
                                    <Icon type="plus-round"></Icon>
                                    新增人员
                                </Button>
                                <Button type="primary" @click="_openCoinSettingHandler">
                                    <Icon type="cash"></Icon>
                                    金币操作
                                </Button>
                                <Button type="primary" @click="banciModalFlag = true">
                                    <Icon type="ios-book-outline"></Icon>
                                    班次管理
                                </Button>
                            </ButtonGroup>
                        </FormItem>
                    </Form>
                    <Table :columns="columns1"
                           :loading="tableLoading"
                           @on-sort-change="_tableSortChange"
                           @on-selection-change="_tableSelectChange"
                           :height="tableHeight"
                           :data="userData"></Table>
                    <Page :total="totalCount"
                          @on-change="_setPage"
                          @on-page-size-change="_setPageSize"
                          :page-size="searchData.pageSize"
                          show-sizer
                          show-total
                          show-elevator
                          style="margin-top: 16px;"></Page>
                </Card>
            </Col>
        </Row>
        <Modal v-model="settingModalFlag"
               width="800"
               :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>{{userFormType === 'update' ? '用户设置' : '添加用户'}}</span>
            </p>
            <Form :model="userSettingForm" :label-width="80">
                <Row>
                    <Col :span="8">
                        <FormItem label="状态">
                            <i-switch v-model="userSettingForm.states" size="large">
                                <span slot="open">启用</span>
                                <span slot="close">禁用</span>
                            </i-switch>
                        </FormItem>
                    </Col>
                    <Col :span="8">
                        <FormItem label="是否写日志">
                            <i-switch v-model="userSettingForm.isLog" size="large">
                                <span slot="open">写</span>
                                <span slot="close">不写</span>
                            </i-switch>
                        </FormItem>
                    </Col>
                    <Col :span="8">
                        <FormItem label="入职时间">
                            <DatePicker type="date" v-model="userSettingForm.inJobTime"></DatePicker>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col :span="8">
                        <FormItem label="账号">
                            <Input v-model="userSettingForm.account" :disabled="userFormType === 'update'"></Input>
                        </FormItem>
                    </Col>
                    <Col :span="8">
                        <FormItem label="姓名">
                            <Input v-model="userSettingForm.name" placeholder=""></Input>
                        </FormItem>
                    </Col>
                    <Col :span="8">
                    <FormItem label="初始密码" v-if="userFormType === 'add'">
                        <Input v-model="defaultPsd" disabled ></Input>
                    </FormItem>
                    </Col>
                </Row>
                <FormItem label="性别">
                    <RadioGroup v-model="userSettingForm.sex">
                        <Radio label="女">女</Radio>
                        <Radio label="男">男</Radio>
                    </RadioGroup>
                </FormItem>
                <Row>
                    <Col :span="8">
                        <FormItem label="角色">
                            <Select v-model="userSettingForm.role">
                                <Option :value="item.id" v-for="(item, index) in roleData" :key="'role' + index">{{item.name}}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col :span="16">
                        <FormItem label="部门">
                            <el-cascader
                                    :options="orgTreeData[0] ? orgTreeData[0].children : []"
                                    :props="depProps"
                                    v-model="userSettingForm.dep"
                                    change-on-select
                                    size="small"
                                    style="width: 100%"
                                    @change="_depChange"
                            ></el-cascader>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col :span="8">
                        <FormItem label="岗位">
                            <Select v-model="userSettingForm.post" :disabled="!userSettingForm.dep.length">
                                <Option v-for="item in postList" :value="item.id" :key="item.id">{{item.name}}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col :span="8">
                        <FormItem label="职级">
                            <Select v-model="userSettingForm.level" :disabled="!userSettingForm.post">
                                <Option :value="levelCodeOpt.code" :key="'level-' + levelCodeOpt.code">{{levelCodeOpt.code}}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col :span="8">
                        <FormItem label="虚拟上级">
                            <Input v-model="userSettingForm.vUp"></Input>
                        </FormItem>
                    </Col>
                </Row>
                <!--<FormItem label="岗位操作指南" :label-width="100">-->
                    <!--<Select v-model="userSettingForm.guider" multiple>-->
                        <!--<Option v-for="item in guiderList" :value="item.id" :key="item.id">{{ item.name }}</Option>-->
                    <!--</Select>-->
                <!--</FormItem>-->
                <FormItem label="班次设置" :label-width="100">
                    <Select v-model="userSettingForm.banci" multiple>
                        <Option v-for="item in banCiList" :value="item.id" :key="item.id">{{item.name + '(' + item.time + ')'}}</Option>
                    </Select>
                </FormItem>
            </Form>
            <div slot="footer">
                <Poptip
                        confirm
                        :transfer="true"
                        @on-ok="_resetPassWord"
                        title="是否确认重置此用户密码？">
                    <Button type="warning" v-show="userFormType === 'update'">重置密码</Button>
                </Poptip>
                <Button type="primary" v-show="userFormType === 'add'" @click="_addUser">添加</Button>
                <Button type="primary" v-show="userFormType === 'update'" @click="_updateUserInfo">更新</Button>
                <Button type="ghost" style="margin-left: 8px" @click="settingModalFlag = false">取消</Button>
            </div>
        </Modal>
        <Modal v-model="coinSettingFlag"
               :mask-closable="false"
               width="600">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>金币操作</span>
            </p>
            <Form :model="coinSettingForm"
                  :rules="coinRules"
                  ref="coinForm"
                  :label-width="80">
                <FormItem prop="target" label="操作对象" :label-width="80">
                    <Input type="text"
                           disabled
                           v-model="coinSettingForm.target"></Input>
                </FormItem>
                <FormItem label="类型">
                    <Select @on-change="_coinTypeChangeHandler">
                        <Option :value="item.value" v-for="item in coinTypeSelect" :key="'coin-type-' + item.value">{{item.label}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="属性" prop="coinProperty">
                    <Select v-model="coinSettingForm.coinProperty">
                        <Option :value="item.value" v-for="(item, index) in coinOptSelect" :key="'coin-property' + index">{{item.label}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="金币数量" :label-width="80" prop="coinNumber">
                    <Input type="text" v-model="coinSettingForm.coinNumber"></Input>
                </FormItem>
                <FormItem label="说明" :label-width="80" prop="content">
                    <Input v-model="coinSettingForm.content" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary" @click="_coinConfirmHandler">确认</Button>
                <Button type="ghost" style="margin-left: 8px" @click="coinSettingFlag = false">取消</Button>
            </div>
        </Modal>
        <Modal v-model="banciModalFlag"
               width="800"
               :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>班次管理</span>
            </p>
            <Table :columns="columnsBanci"
                   :loading="tableBanciLoading"
                   height="400"
                   :data="banCiList"></Table>
            <div slot="footer">
                <Poptip placement="left" width="400">
                    <Button type="ghost">添加班次</Button>
                    <div class="banci-add-form" slot="content">
                        <Form :rules="banciRules"
                              :model="banciForm"
                              ref="banciForm"
                              :label-width="100">
                            <FormItem label="班次名称" prop="name">
                                <Input v-model="banciForm.name" placeholder=""></Input>
                            </FormItem>
                            <FormItem label="班次时间" prop="time">
                                <Input v-model="banciForm.time" placeholder=""></Input>
                            </FormItem>
                            <FormItem>
                                <Button type="primary" @click="_addBanci" :loading="banciBtnLoading">添加班次</Button>
                            </FormItem>
                        </Form>
                    </div>
                </Poptip>
            </div>
        </Modal>
        <Modal v-model="userAccessModalFlag"
               width="800"
               :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>用户授权</span>
            </p>
            <div id="fs-access-control-block">
                <CheckboxGroup v-model="social">
                    <Row :gutter="10" type="flex">
                        <Col :span="12" style="margin-bottom: 10px;" v-for="(cate, ci) in accseeList" :key="'cate-' + ci">
                            <Card style="height: 100%;">
                                <h3 class="cate-title">{{cate.title}}</h3>
                                <div class="each-page-wrapper" v-for="(page, pi) in cate.pages" :key="'page-' + pi">
                                    <Checkbox :label="'page' + page.id" size="large">
                                        <Icon type="document" size="18"></Icon>
                                        <span>{{page.title}}</span>
                                    </Checkbox>
                                    <div class="each-btn-wrapper">
                                        <Checkbox :label="'btn' + btn.id" v-for="(btn, bi) in page.btns" :key="'btn-' + bi">
                                            <Icon type="ios-toggle"></Icon>
                                            <span>{{btn.btnname}}</span>
                                        </Checkbox>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </CheckboxGroup>
            </div>
            <div slot="footer">
                <Button type="primary" @click="_confirmAccess">确认授权</Button>
                <Button type="ghost">取消</Button>
            </div>
        </Modal>
    </div>
</template>
<style lang="less">
    #fs-access-control-block {
        padding: 10px;
        height: 400px;
        overflow: auto;
        background-color: #dddee1;
        .cate-title {
            margin-bottom: 16px;
        }
        .each-page-wrapper {
            margin-bottom: 16px;
            .each-btn-wrapper {
                margin-top: 10px;
                padding-left: 20px;
            }
        }
    }
</style>
<script>
    import moment from 'moment';
    import debounce from 'lodash/debounce';
    export default {
        name: 'employeeManage',
        watch: {
            filterText(val) {
                this.$refs.treeDom.filter(val);
            },
            'searchData.pageSize'() {
                this._filterResultHandler();
            },
            'searchData.nodeId'() {
                this._filterResultHandler();
            },
            'searchData.states'() {
                this._filterResultHandler();
            },
            'searchData.roleId'() {
                this._filterResultHandler();
            },
            'userSettingForm.post'(val) {
                if (val) {
                    this.$http.get('/organize/getLevel', {params: {id: val}}).then((res) => {
                        if (res.success) {
                            this.levelCodeOpt.code = res.date.level.split(',')[0];
                            console.log(this.levelCodeOpt);
                        }
                    })
                }
                console.log(val)
            },
            social(val) {
                console.log(val);
            }
        },
        data () {
            return {
                accessButtons: [],
                social: [],
                banciModalFlag: false,
                coinSettingFlag: false,
                settingModalFlag: false,
                userAccessModalFlag: false,
                banciBtnLoading: false,
                tableBanciLoading: false,
                tableLoading: false,
                userFormType: 'update',
                defaultPsd: '123456',
                editUserId: '',
                coinRules: {
                    coinNumber: [
                        { required: true, message: '金币不能为空', trigger: 'blur' }
                    ],
                    content: [
                        { required: true, message: '说明不能为空', trigger: 'blur' }
                    ]
                },
                coinSettingForm: {
                    target: '',
                    coinProperty: '无属性',
                    coinNumber: '',
                    content: ''
                },
                coinOptSelect: [
                    {
                        value: '无属性',
                        label: '无属性'
                    },
                    {
                        value: '财富点',
                        label: '财富点'
                    },
                    {
                        value: '技能点',
                        label: '技能点'
                    },
                    {
                        value: '伯乐点',
                        label: '伯乐点'
                    },
                    {
                        value: '智慧点',
                        label: '智慧点'
                    }
                ],
                coinTypeSelect: [
                    {
                        value: '1',
                        coin: '100',
                        label: '提出合理化建议'
                    },
                    {
                        value: '2',
                        coin: '100',
                        label: '考试成绩优异者'
                    },
                    {
                        value: '3',
                        coin: '300',
                        label: '授课一次'
                    },
                    {
                        value: '4',
                        coin: '500',
                        label: '带新人被录用'
                    },
                    {
                        value: '5',
                        coin: '-100',
                        label: '未执行公司制度'
                    },
                    {
                        value: '6',
                        coin: '50',
                        label: '好人好事奖励'
                    },
                    {
                        value: '7',
                        coin: '200',
                        label: '伯乐奖'
                    },
                    {
                        value: '8',
                        coin: '',
                        label: '其他'
                    }
                ],
                userSettingForm: {
                    states: true,
                    account: '',
                    name: '',
                    sex: '',
                    inJobTime: '',
                    role: '',
                    dep: [],
                    post: '',
                    guider: [],
                    banci: [],
                    level: '',
                    vUp: '',
                    isLog: true
                },
                totalCount: 1,
                searchData: {
                    realName: '',
                    postName: '',
                    states: '1',
                    roleId: '',
                    nodeId: 1,
                    page: 1,
                    pageSize: 20
                },
                columns1: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '用户id',
                        key: 'id',
                        align: 'center',
                        width: 80
                    },
                    {
                        title: '姓名',
                        key: 'realname',
                        align: 'center',
                        width: 100
                    },
                    {
                        title: '部门',
                        key: 'organizename',
                        align: 'center'
                    },
                    {
                        title: '岗位',
                        key: 'postname',
                        align: 'center'
                    },
                    {
                        title: '角色',
                        key: 'rolename',
                        align: 'center',
                        width: 120
                    },
                    {
                        title: '天马金币',
                        key: 'tm_coin',
                        sortable: true,
                        align: 'center',
                        width: 110
                    },
                    {
                        title: '入职时间',
                        key: 'joindate',
                        width: 120,
                        align: 'center'
                    },
                    {
                        title: '状态',
                        key: 'states',
                        align: 'center',
                        width: 100,
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
                        title: '班次',
                        key: 'kq_type',
                        width: 100,
                        align: 'center',
                        ellipsis: true
                    },
                    {
                        title: '是否写日志',
                        align: 'center',
                        width: 100,
                        render: (h, params) => {
                            return h('Tag', {
                                props: {
                                    type: 'border',
                                    color: +params.row['no_write'] === 1 ? 'red' : 'green'
                                }
                            }, +params.row['no_write'] === 1 ? '不写' : '写');
                        }
                    },
                    {
                        title: '操作',
                        align: 'center',
                        width: 180,
                        render: (h, params) => {
                            let vm = this;
                            return h('div', [
                                h('Tooltip', {
                                    props: {
                                        content: '完善信息',
                                        placement: 'top',
                                        transfer: true
                                    }
                                }, [
                                    h('Button', {
                                        props: {
                                            type: 'primary',
                                            icon: 'edit',
                                            shape: 'circle'
                                        },
                                        style: {
                                            marginRight: '4px'
                                        }
                                    })
                                ]),
                                h('Tooltip', {
                                    props: {
                                        content: '用户授权',
                                        placement: 'top',
                                        transfer: true
                                    }
                                }, [
                                    h('Button', {
                                        props: {
                                            type: 'primary',
                                            icon: 'key',
                                            shape: 'circle'
                                        },
                                        on: {
                                            click: function() {
                                                vm._userAccessOpen(params.row);
                                            }
                                        },
                                        style: {
                                            marginRight: '4px'
                                        }
                                    })
                                ]),
                                h('Tooltip', {
                                    props: {
                                        content: '用户设置',
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
                accessMenu: [
                    {
                        title: '系统管理',
                        pages: [

                        ]
                    }

                ],
                roleData: [],
                userData: [],
                levelData: [],
                orgTreeData: [],
                levelCodeOpt: {
                    code: ''
                },
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                depProps: {
                    value: 'id',
                    label: 'name'
                },
                postList: [],
                guiderList: [],
                chooseDataArr: [],
                filterText: '',
                tableHeight: 700,
                storePath: [],
                columnsBanci: [
                    {
                        title: '班次id',
                        key: 'id',
                        align: 'center',
                        width: 100
                    },
                    {
                        title: '班次名称',
                        key: 'name'
                    },
                    {
                        title: '班次时间',
                        key: 'time',
                        align: 'center'
                    }
                ],
                banCiList: [],
                banciForm: {
                    name: '',
                    time: ''
                },
                banciRules: {
                    name: [
                        { required: true, message: '班次名称不能为空', trigger: 'blur' }
                    ],
                    time: [
                        { required: true, message: '班次时间不能为空', trigger: 'blur' }
                    ]
                },
                accessCheckArr: [1, 2],
                accseeList: []
            };
        },
        created() {
            this._getAccessButtons();
            this._getBanCiData();
            this._setTableHeight();
            this._getAllMenu();
            this._getGuiderList();
            this._getRoleData();
            this._getAccessMenu();
            this._getOrgTree().then(() => {
                this._getUserData();
            });
        },
        methods: {
            filterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },
            _getAccessButtons() {
                let data = {
                    name: this.$route.name
                };
                this.$http.get('/jurisdiction/getMyoneBtns', {params: data}).then((res) => {
                    console.log(res);
                });
            },
            _coinConfirmHandler() {
                this.$refs.coinForm.validate((valid) => {
                    if (valid) {
                        let data = {};
                        data.userId = this.chooseDataArr.map((item) => item.id).join(',');
                        data.Property = this.coinSettingForm.coinProperty;
                        data.coin = this.coinSettingForm.coinNumber;
                        data.content = this.coinSettingForm.content;
                        this.$http.post('/user/coinOpt', data).then((res) => {
                            if (res.success) {
                                this.$Message.success('金币操作成功!');
                                this.coinSettingFlag = false;
                            }
                        });
                    }
                });
            },
            _openCoinSettingHandler() {
                this.coinSettingFlag = true;
                if (this.chooseDataArr.length === 0) {
                    this.coinSettingForm.target = '公司全体员工';
                } else if (this.chooseDataArr.length === 1) {
                    this.coinSettingForm.target = this.chooseDataArr[0].realname;
                } else {
                    this.coinSettingForm.target = '选中的员工';
                }
            },
            _initPage() {
                this.searchData.page = 1;
            },
            _inputDebounce: debounce(function () {
                this._filterResultHandler();
            }, 600),
            _filterResultHandler() {
                this._initPage();
                this._getUserData();
            },
            _coinTypeChangeHandler(val) {
                let storeArr = this.coinTypeSelect.filter((item) => {
                    return +item.value === +val;
                });
                this.coinSettingForm.coinNumber = storeArr[0].coin;
                this.coinSettingForm.content = storeArr[0].label;
            },
            _storeFilter(root, path, id) {
                root.forEach((item) => {
                    if (item.id === id) this.storePath = [...path, id];
                    if (item.children) this._storeFilter(item.children, [...path, item.id], id);
                });
            },
            _returnOrgIds(id) {
                if (!this.orgTreeData[0]) return [];
                let depsStore = this.orgTreeData[0].children;
                let path = [];
                this._storeFilter(depsStore, path, id);
                return this.storePath;
            },
            _initUserInfo() {
                this.userSettingForm = {
                    states: true,
                    account: '',
                    name: '',
                    sex: '',
                    inJobTime: moment().format('YYYY-MM-DD'),
                    role: '',
                    dep: [],
                    post: '',
                    guider: [],
                    banci: [],
                    level: '',
                    vUp: '',
                    isLog: true
                };
            },
            _addUserOpen() {
                this._initUserInfo();
                this.userFormType = 'add';
                this.settingModalFlag = true;
            },
            _resetPassWord() {
                let data = {};
                data.id = this.editUserId;
                this.$http.post('/user/resetPassword', data).then((res) => {
                    if (res.success) {
                        this.$Message.success('密码重置成功！重置后的默认密码为123456！');
                    }
                });
            },
            _tableSortChange(data) {
                console.log(data);
            },
            _setTableHeight() {
                let dm = document.body.clientHeight;
                this.tableHeight = dm - 280;
            },
            _tableSelectChange(data) {
                this.chooseDataArr = data;
            },
            _getUserData() {
                this.chooseDataArr = [];
                this.tableLoading = true;
                this.$http.get('/user/dataList', {params: this.searchData}).then((res) => {
                    if (res.success) {
                        this.totalCount = res.count;
                        this.userData = res.date;
                    }
                }).finally(() => {
                    this.tableLoading = false;
                });
            },
            _setPage(page) {
                this.searchData.page = page;
                this._getUserData();
            },
            _setPageSize(size) {
                this.searchData.pageSize = size;
            },
            _treeNodeClickHandler(data) {
                this.searchData.nodeId = data.id;
            },
            _depChange(data) {
                this._getPostList(data.slice(-1)[0]).then(() => {
                    this.userSettingForm.post = this.postList[0].id;
                });
            },
            _updateUserInfo() {
                let data = {};
                data.id = this.editUserId;
                data.isUpdate = true;
                data.states = this.userSettingForm.states ? 1 : 0;
                data.joinDate = moment(this.userSettingForm.inJobTime).format('YYYY-MM-DD');
                data.realName = this.userSettingForm.name;
                data.sex = this.userSettingForm.sex;
                data.no_write = this.userSettingForm.isLog ? 0 : 1;
                data.banci = this.userSettingForm.banci.join(',');
                data.organizeId = this.userSettingForm.dep.slice(-1)[0];
                data.level = this.userSettingForm.level;
                data.postId = this.userSettingForm.post;
                data.leaderName = this.userSettingForm.vUp;
                data.roleId = this.userSettingForm.role;
                console.log(data);
                this.$http.post('/user/setUserInfo ', data).then((res) => {
                    console.log(res)
                })
            },
            _addUser() {
                let data = {};
                data.isUpdate = false;
                data.userName = this.userSettingForm.account;
                data.passWord = this.defaultPsd;
                data.states = this.userSettingForm.states ? 1 : 0;
                data.joinDate = moment(this.userSettingForm.inJobTime).format('YYYY-MM-DD');
                data.realName = this.userSettingForm.name;
                data.sex = this.userSettingForm.sex;
                data.no_write = this.userSettingForm.isLog ? 0 : 1;
                data.banci = this.userSettingForm.banci.join(',');
                data.organizeId = this.userSettingForm.dep.slice(-1)[0];
                data.level = this.userSettingForm.level;
                data.postId = this.userSettingForm.post;
                data.leaderName = this.userSettingForm.vUp;
                data.roleName = this.userSettingForm.role;

                console.log(data);
            },
            _editorSetting(data) {
                this.userSettingForm.states = !!data.states;
                this.userSettingForm.account = data.username;
                this.userSettingForm.name = data.realname;
                this.userSettingForm.sex = data.sex;
                this.userSettingForm.inJobTime = moment(data.joindate).format('YYYY-MM-DD');
                this.userSettingForm.role = data.roleid;
                this.userSettingForm.dep = this._returnOrgIds(data.lv);
                this.userSettingForm.post = data.postid;
                this.userSettingForm.banci = data.kq_type.split(',').map(Number);
                this.userSettingForm.vUp = data.p_name;
                this.userSettingForm.level = data.levelcode;
                this.userSettingForm.isLog = !data.no_write;
                this._getPostList(data.lv);
                this.userFormType = 'update';
                this.settingModalFlag = true;
                this.editUserId = data.id;
            },
            _returnNeedPostList(ids, names) {
                let idsArr = ids.split(',').filter(x => !!x);
                let namesArr = names.split(',').filter(x => !!x);
                let storeArr = [];
                for (let i = 0, length = idsArr.length; i < length; i++) {
                    storeArr[i] = {}
                }
                storeArr.forEach((item, index, arr) => {
                    item.id = +idsArr[index];
                    item.name = namesArr[index]
                });
                return storeArr;
            },
            _getPostList(id) {
                let data = {};
                data.lv = id;
                return new Promise((resolve) => {
                    this.$http.get('/organize/getSetInfo', {params: data}).then((res) => {
                        if (res.success) {
                            this.postList = this._returnNeedPostList(res.date.postids, res.date.postnames);
                            resolve()
                        }
                    })
                })
            },
            _getLevelList() {
                this.$http.get('/rank/datalist?page=1&pageSize=20').then((res) => {
                    if (res.success) {
                        this.levelData = res.date
                    }
                })
            },
            _getGuiderList() {
                this.$http.get('/post/getPdftree?userId=0').then((res) => {
                    if (res.success) {
                        this.guiderList = res.date;
                    }
                });
            },
            _getAllMenu() {
                this.$http.get('/jurisdiction/getAllSystemMenu ').then((res) => {
                });
            },
            _getRoleData() {
                this.$http.get('/role/getAllRole').then((res) => {
                    if (res.success) {
                        this.roleData = res.date;
                    }
                });
            },
            _getOrgTree() {
                return new Promise((resolve) => {
                    this.$http.get('/organize/organizeTree?fatherId=-1').then((res) => {
                        if (res.success) {
                            this.orgTreeData = res.date;
                            this.searchData.nodeId = res.date[0].id;
                            resolve(res.date[0].id);
                        }
                    });
                });
            },
            _getBanCiData() {
                this.tableBanciLoading = true;
                this.$http.get('/user/getBanCi').then((res) => {
                    if (res.success) {
                        this.banCiList = res.date;
                    }
                }).finally(() => {
                    this.tableBanciLoading = false;
                });
            },
            _addBanci() {
                this.$refs.banciForm.validate((valid) => {
                    if (valid) {
                        this.banciBtnLoading = true;
                        let data = {};
                        data.name = this.banciForm.name;
                        data.time = this.banciForm.time;
                        this.$http.post('/user/addBanCi', data).then((res) => {
                            if (res.success) {
                                this.banciForm = {
                                    name: '',
                                    time: ''
                                };
                                this._getBanCiData();
                                this.$Message.success('班次添加成功');
                            }
                        }).finally(() => {
                            this.banciBtnLoading = false;
                        });
                    }
                });
            },
            _renturnAccessNeedArr(data) {
                let arr = [];
                data.forEach((cateItem) => {
                    let cate = {};
                    cate.title = cateItem.title;
                    cate.pages = [];
                    cateItem.page.forEach((pageItem) => {
                        let obj = pageItem.menu.columns;
                        obj.btns = [];
                        if (pageItem.btn) {
                            let btnArr = [];
                            pageItem.btn.forEach((bitem) => {
                                btnArr.push(bitem.columns);
                            });
                            obj.btns = btnArr;
                        }
                        cate.pages.push(obj);
                    });
                    arr.push(cate);
                });
                return arr;
            },
            _getAccessMenu() {
                this.$http.get('/jurisdiction/getAllMenu').then((res) => {
                    if (res.success) {
                        this.accseeList = this._renturnAccessNeedArr(res.date);
                    }
                });
            },
            _confirmAccess() {
                let pageArr = [];
                let btnArr = [];
                this.social.forEach((item) => {
                    if (item.startsWith('page')) {
                        pageArr.push(item.split('page')[1]);
                    }
                    if (item.startsWith('btn')) {
                        btnArr.push(item.split('btn')[1]);
                    }
                });
                let data = {
                    id: this.editUserId,
                    menuid: pageArr.join(','),
                    btnid: btnArr.join(',')
                };
                this.$http.post('/jurisdiction/setMySystemMenu', data).then((res) => {
                    if (res.success) {
                        this.$Message.success('权限设置成功!');
                        this.userAccessModalFlag = false;
                    }
                });
            },
            _userAccessOpen(data) {
                let pageArr = data.role ? data.role.split(',').map(x => 'page' + x) : [];
                let btnArr = data.btnid ? data.btnid.split(',').map(x => 'btn' + x) : [];
                this.social = pageArr.concat(btnArr);
                this.editUserId = data.id;
                this.userAccessModalFlag = true;
            }
        },
        components: {}
    };
</script>
