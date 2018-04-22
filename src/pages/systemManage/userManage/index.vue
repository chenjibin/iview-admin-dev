<template>
    <div id="employee-manage">
        <Row :gutter="10">
            <Col :span="4">
            <Card style="height: 819px;overflow: auto;" :style="{'height':(tableHeight + 138)+'px'}">
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
                <Form ref="searchData" :model="searchData" inline :label-width="40">
                    <FormItem prop="realName" label="姓名">
                        <Input type="text"
                               v-model="searchData.realName.value"
                               placeholder="筛选姓名"></Input>
                    </FormItem>
                    <FormItem prop="postName" label="岗位">
                        <Input type="text"
                               v-model="searchData.postName.value"
                               placeholder="筛选岗位"></Input>
                    </FormItem>
                    <FormItem label="角色">
                        <Select filterable v-model="searchData.roleId.value"
                                clearable
                                :transfer="true"
                                placeholder="输入查询角色" style="width: 200px">
                            <Option :value="item.id" :label="isManger > 1 ?item.name:item.name+' '+item.companyname" v-for="(item, index) in roleCombo" :key="'role' + index">{{item.name}} <span v-if="isManger == 0 || isManger == 1" :title="item.companyname" style="float:right;color:#ccc;width:65px;text-overflow: ellipsis;text-align: right;white-space: nowrap;overflow: hidden">{{item.companyname}}</span></Option>
                        </Select>
                    </FormItem>
                    <FormItem label="状态">
                        <Select v-model="searchData.states.value"
                                clearable
                                placeholder="筛选状态"
                                style="width: 100px">
                            <Option value="1">启用</Option>
                            <Option value="0">禁用</Option>
                        </Select>
                    </FormItem>
                    <FormItem :label-width="0.1">
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
                            <Button type="error" @click="_openLeaveSettingModal" :disabled="chooseDataArr.length !== 1">
                                <Icon type="minus"></Icon>
                                账号离职
                            </Button>
                        </ButtonGroup>
                    </FormItem>
                </Form>
                <fs-table-page :columns="columns1"
                               :size="null"
                               :height="tableHeight"
                               :params="searchData"
                               :choosearray.sync="chooseDataArr"
                               ref="userTable"
                               url="/user/dataList"></fs-table-page>
            </Card>
            </Col>
        </Row>
        <Modal v-model="settingModalFlag"
               width="800"
               :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>{{userFormType === 'update' ? '用户设置' : '添加用户'}}</span>
            </p>
            <Form :model="userSettingForm"
                  :rules="userSettingValidate"
                  ref="userSettingDom"
                  :label-width="80">
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
                    </Col>
                    <Col :span="8">
                    <FormItem label="入职时间" prop="inJobTime">
                        <DatePicker type="date"
                                    @on-change="_inJobDateChange"
                                    :value="userSettingForm.inJobTime"></DatePicker>
                    </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col :span="8">
                    <FormItem label="账号" prop="account">
                        <Input v-model="userSettingForm.account" :disabled="userFormType === 'update'"></Input>
                    </FormItem>
                    </Col>
                    <Col :span="8">
                    <FormItem label="姓名" prop="name">
                        <Input v-model="userSettingForm.name" placeholder=""></Input>
                    </FormItem>
                    </Col>
                    <Col :span="8">
                    <FormItem label="初始密码" v-if="userFormType === 'add'">
                        <Input v-model="defaultPsd" disabled ></Input>
                    </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col :span="8">
                    <FormItem label="性别" prop="sex">
                        <RadioGroup v-model="userSettingForm.sex">
                            <Radio label="女">女</Radio>
                            <Radio label="男">男</Radio>
                        </RadioGroup>
                    </FormItem>
                    </Col>
                    <Col :span="8">
                    <FormItem label="用户类型" v-show="(isManger == 0 || isManger == 1)">
                        <Select v-model="userSettingForm.isManger">
                            <Option :value="3">普通用户</Option>
                            <Option :value="2">分公司管理员</Option>
                            <Option :value="1">可见所有人的特权人员</Option>
                            <Option :value="0"><span style="color: #ff8766;">超级管理员</span></Option>
                        </Select>
                    </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col :span="8">
                    <FormItem label="角色" prop="role">
                        <Select v-model="userSettingForm.role" ref="roleSelect">
                            <Option :value="item.id" v-for="(item, index) in roleData" :key="'nrole' + item.id">{{item.name}}</Option>
                        </Select>
                    </FormItem>
                    </Col>
                    <Col :span="16">
                    <FormItem label="部门" prop="dep">
                        <el-cascader
                                :options="orgComboList"
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
                    <FormItem label="岗位" prop="post">
                        <Select v-model="userSettingForm.post" :disabled="!userSettingForm.dep.length">
                            <Option v-for="item in postList" :value="item.id" :key="item.id">{{item.name}}</Option>
                        </Select>
                    </FormItem>
                    </Col>
                    <Col :span="8">
                    <FormItem label="职级" prop="level">
                        <Select v-model="userSettingForm.level" :disabled="!userSettingForm.post">
                            <Option :value="levelCodeOpt.code" :key="'level-' + levelCodeOpt.code">{{levelCodeOpt.code}}</Option>
                        </Select>
                    </FormItem>
                    </Col>
                </Row>
                <FormItem label="班次设置" :label-width="100" prop="banci">
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
                  :label-width="90">
                <FormItem prop="target" label="操作对象">
                    <Input type="text"
                           readonly
                           v-model="coinSettingForm.target"></Input>
                </FormItem>
                <FormItem label="属性" prop="coinProperty">
                    <Select v-model="coinSettingForm.coinProperty">
                        <Option :value="item.value" v-for="(item, index) in coinOptSelect" :key="'coin-property' + index">{{item.label}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="金币数量" prop="coinNumber">
                    <Input type="text" v-model="coinSettingForm.coinNumber"></Input>
                </FormItem>
                <FormItem label="说明" prop="content">
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
                            <div class="each-page-wrapper" v-for="(page, pi) in cate.page" :key="'page-' + pi">
                                <Checkbox :label="'page' + page.menu.id" size="large">
                                    <Icon type="document" size="18"></Icon>
                                    <span>{{page.menu.title}}</span>
                                </Checkbox>
                                <div class="each-btn-wrapper">
                                    <Checkbox :label="'btn' + btn.id" v-for="(btn, bi) in page.btn" :key="'btn-' + bi">
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
                <Button type="ghost" @click="userAccessModalFlag = false">取消</Button>
            </div>
        </Modal>
        <Modal v-model="specAccessFlag"
               width="800"
               :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>特殊权限设置</span>
            </p>
            <div id="fs-spec-access-block">
                <Row :gutter="16">
                    <Col :span="14">
                    <h3 class="title">虚拟可查看部门</h3>
                    <div class="">
                        <div class="each-dep-wrapper"
                             v-for="(dep, index) in specAccessData.deps"
                             :key="'dep-' + index">
                            <el-cascader
                                    :options="orgTreeData"
                                    :props="depProps"
                                    v-model="dep.dep"
                                    change-on-select
                                    size="small"
                                    class="dep-choose"
                            ></el-cascader>
                            <Button type="ghost" shape="circle" icon="ios-trash-outline" @click="_removeDep(index)"></Button>
                        </div>
                        <Button
                                type="ghost"
                                shape="circle"
                                @click="_addNewDep"
                                icon="plus-round"></Button>
                    </div>
                    </Col>
                    <Col :span="10">
                    <h3 class="title">虚拟可查看人员</h3>
                    <div class="">
                        <Select v-model="specAccessData.filterPeopleData"
                                multiple
                                filterable
                                remote
                                :label="remoteLabel"
                                :remote-method="_filterPeopleRemote"
                                :loading="specAccessData.filterPeopleLoading">
                            <Option v-for="(option, index) in specAccessData.filterPeopleOpt" :value="option.id" :key="'user' + option.id">{{option.realname + '(' + option.organizename + ')'}}</Option>
                        </Select>
                    </div>
                    </Col>
                    <Col :span="14" style="margin-top: 16px;">
                    <h3 class="title">虚拟可查看排班部门</h3>
                    <div class="">
                        <div class="each-dep-wrapper"
                             v-for="(dep, index) in specAccessData.arrangeDeps"
                             :key="'arrangedep-' + index">
                            <el-cascader
                                    :options="orgTreeData"
                                    :props="depProps"
                                    v-model="dep.dep"
                                    change-on-select
                                    size="small"
                                    class="dep-choose"
                            ></el-cascader>
                            <Button type="ghost" shape="circle" icon="ios-trash-outline" @click="_removeArrangeDep(index)"></Button>
                        </div>
                        <Button
                                type="ghost"
                                shape="circle"
                                @click="_addNewArrangeDep"
                                icon="plus-round"></Button>
                    </div>
                    </Col>
                </Row>
            </div>
            <div slot="footer">
                <Button type="primary" @click="_specAccessConfirm">确认授权</Button>
                <Button type="ghost" @click="specAccessFlag = false">取消</Button>
            </div>
        </Modal>
        <Modal v-model="leaveSettingFlag"
               :mask-closable="false"
               width="600">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>{{leavePeople}}离职设置</span>
            </p>
            <Form :model="leaveSettingForm"
                  ref="leaveForm"
                  :label-width="90">
                <FormItem prop="target" label="离职时间">
                    <DatePicker @on-change="leaveSettingForm.resignationTime = $event"
                                :clearable="false"
                                :value="leaveSettingForm.resignationTime"></DatePicker>
                </FormItem>
                <FormItem label="离职原因" prop="coinProperty">
                    <Select v-model="leaveSettingForm.reasonLeaving">
                        <Option value="个人原因">个人原因</Option>
                        <Option value="公司劝退">公司劝退</Option>
                    </Select>
                </FormItem>
                <FormItem label="离职等级" prop="coinNumber">
                    <Select v-model="leaveSettingForm.gradeLeaving">
                        <Option value="A">A</Option>
                        <Option value="B">B</Option>
                        <Option value="C">C</Option>
                    </Select>
                </FormItem>
                <FormItem label="备注" prop="content">
                    <Input v-model="leaveSettingForm.leaveRemarks" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary" @click="_coinLeaveHandler">确认</Button>
                <Button type="ghost" style="margin-left: 8px" @click="leaveSettingFlag = false">取消</Button>
            </div>
        </Modal>
    </div>
</template>
<style lang="less" scoped>
    #fs-spec-access-block {
        max-height: 400px;
        overflow-x: hidden;
        overflow-y: auto;
        .title {
            margin-bottom: 16px;
        }
        .each-dep-wrapper {
            margin-bottom: 16px;
            display: flex;
            .dep-choose {
                flex: 1;
                margin-right: 16px;
            }
        }
        .add-dep {
            padding: 16px;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            border: 1px dashed #ddd;
            border-radius: 6px;
            cursor: pointer;
        }
    }
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
    import fsTablePage from '@/baseComponents/fs-table-page';
    import moment from 'moment';
    const NOW_DATE = moment().format('YYYY-MM-DD');
    export default {
        name: 'userManage',
        watch: {
            filterText(val) {
                this.$refs.treeDom.filter(val);
            },
            'userSettingForm.post'(val) {
                if (val) {
                    this.$http.get('/organize/getLevel', {params: {id: val}}).then((res) => {
                        if (res.success) {
                            this.levelCodeOpt.code = res.data.level.split(',')[0];
                        }
                    });
                }
            }
        },
        data () {
            return {
                accessButtons: [],
                social: [],
                banciModalFlag: false,
                remoteLabel: [],
                specAccessData: {
                    userId: '',
                    filterPeopleLoading: false,
                    filterPeopleData: [],
                    filterPeopleOpt: [],
                    deps: [],
                    arrangeDeps: []
                },
                coinSettingFlag: false,
                settingModalFlag: false,
                userAccessModalFlag: false,
                specAccessFlag: false,
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
                    isManger: 3,
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
                userSettingValidate: {
                    inJobTime: [
                        { required: true, message: '入职时间不能为空！', trigger: 'change' }
                    ],
                    account: [
                        { required: true, message: '账号不能为空', trigger: 'blur' }
                    ],
                    role: [
                        { type: 'number', required: true, message: '角色不能为空', trigger: 'blur' }
                    ],
                    dep: [
                        { type: 'array', required: true, message: '部门不能为空', trigger: 'blur' }
                    ],
                    name: [
                        { required: true, message: '姓名不能为空', trigger: 'blur' }
                    ],
                    sex: [
                        { required: true, message: '请选择性别', trigger: 'change' }
                    ]
                },
                totalCount: 1,
                roleCombo: [],
                searchData: {
                    realName: {
                        value: '',
                        type: 'input'
                    },
                    postName: {
                        value: '',
                        type: 'input'
                    },
                    states: {
                        value: '1',
                        type: 'select'
                    },
                    roleId: {
                        value: '',
                        type: 'select'
                    },
                    companyId: {
                        value: '',
                        type: 'select'
                    },
                    nodeId: {
                        value: 1,
                        type: 'tree'
                    }
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
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        icon: 'arrow-shrink',
                                        shape: 'circle'
                                    },
                                    attrs: {
                                        title: '特殊权限设置'
                                    },
                                    on: {
                                        click: function(e) {
                                            e.stopPropagation();
                                            vm._specAccessOpen(params.row);
                                        }
                                    },
                                    style: {
                                        marginRight: '4px'
                                    }
                                }),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        icon: 'key',
                                        shape: 'circle'
                                    },
                                    attrs: {
                                        title: '用户授权'
                                    },
                                    on: {
                                        click: function(e) {
                                            e.stopPropagation();
                                            vm._userAccessOpen(params.row);
                                        }
                                    },
                                    style: {
                                        marginRight: '4px'
                                    }
                                }),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        icon: 'ios-gear',
                                        shape: 'circle'
                                    },
                                    attrs: {
                                        title: '用户设置'
                                    },
                                    on: {
                                        click: function (e) {
                                            e.stopPropagation();
                                            vm._editorSetting(params.row);
                                        }
                                    }
                                })
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
                levelData: [],
                orgTreeData: [],
                orgComboList: [],
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
                accseeList: [],
                leaveSettingFlag: false,
                leaveSettingForm: {
                    reasonLeaving: '个人原因',
                    gradeLeaving: 'A',
                    leaveRemarks: '',
                    resignationTime: NOW_DATE,
                    id: 0
                },
                leavePeople: ''
            };
        },
        computed: {
            isManger() {
                return this.$store.state.user.userInfo.ismanger;
            }
        },
        created() {
            this._getBanCiData();
            this._setTableHeight();
            this._getAllMenu();
            this._getGuiderList();
            this._getRoleData();
            this._getAccessMenu();
            this._getOrgTree();
            this._getOrgComboList();
        },
        methods: {
            filterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },
            returnDepsIds(arr) {
                let newArr = [];
                let needArr = arr.filter((item) => {
                    return item.dep.length > 0;
                });
                needArr.forEach((item) => {
                    newArr.push(item.dep.slice(-1)[0]);
                });
                return newArr.join(',');
            },
            _initAccessData() {
                this.specAccessData.userId = '';
                this.specAccessData.filterPeopleData = [];
                this.specAccessData.filterPeopleOpt = [];
                this.specAccessData.deps = [];
            },
            _specAccessConfirm() {
                let depsArr = this.specAccessData.deps;
                let userIds = this.specAccessData.filterPeopleData;
                let sendData = {};
                sendData.id = this.specAccessData.userId;
                sendData.userIds = userIds.join(',');
                sendData.organizeIds = this.returnDepsIds(depsArr);
                this.$http.post('/user/addSuperPro', sendData).then((res) => {
                    if (res.success) {
                        this.$Message.success('授权成功!');
                        this.specAccessFlag = false;
                    }
                });
            },
            _specAccessOpen(data) {
                this._initAccessData();
                this.specAccessData.userId = data.id;
                this._getSpecAccessPro();
                this.specAccessFlag = true;
            },
            _removeDep(index) {
                this.specAccessData.deps.splice(index, 1);
            },
            _removeArrangeDep(index) {
                this.specAccessData.arrangeDeps.splice(index, 1);
            },
            _filterPeopleRemote(val) {
                let data = {};
                data.name = val;
                this.specAccessData.filterPeopleLoading = true;
                this.$http.get('/user/getCheckUser', {params: data}).then((res) => {
                    if (res.success) {
                        this.specAccessData.filterPeopleOpt = res.data;
                    }
                }).finally(() => {
                    this.specAccessData.filterPeopleLoading = false;
                });
            },
            _addNewDep() {
                let obj = {};
                obj.dep = [];
                this.specAccessData.deps.push(obj);
            },
            _addNewArrangeDep() {
                let obj = {};
                obj.dep = [];
                this.specAccessData.arrangeDeps.push(obj);
            },
            _returnAccessDeps(deps) {
                if (!deps) return [];
                let arr = deps.split(',');
                let storeArr = [];
                for (let i = 0, depLength = arr.length; i < depLength; i++) {
                    let obj = {};
                    obj.dep = this._returnOrgIds(+arr[i]);
                    storeArr.push(obj);
                }
                return storeArr;
            },
            _getSpecAccessPro() {
                let data = {};
                data.id = this.specAccessData.userId;
                this.$http.get('/user/getMySuperPro', {params: data}).then((res) => {
                    if (res.success) {
                        this.specAccessData.filterPeopleOpt = res.data;
                        this.specAccessData.filterPeopleData = res.data.length ? res.data.map(x => x.id) : [];
                        this.remoteLabel = res.data.length ? res.data.map(x => x.realname) : [];
                        this.specAccessData.deps = this._returnAccessDeps(res.organizeIds);
                    }
                });
            },
            _inJobDateChange(val) {
                this.userSettingForm.inJobTime = val;
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
                                this._getUserData();
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
                this.storePath = [];
                this._storeFilter(depsStore, path, id);
                return this.storePath;
            },
            _initUserInfo() {
                this.userSettingForm.states = true;
                this.userSettingForm.account = '';
                this.userSettingForm.name = '';
                this.userSettingForm.sex = '';
                this.userSettingForm.inJobTime = '';
                this.userSettingForm.role = '';
                this.userSettingForm.dep = [];
                this.userSettingForm.post = '';
                this.userSettingForm.guider = [];
                this.userSettingForm.banci = [];
                this.userSettingForm.level = '';
                this.userSettingForm.vUp = '';
                this.userSettingForm.isLog = true;
                this.userSettingForm.role = '';
                this.$refs.roleSelect.clearSingleSelect();
            },
            _addUserOpen() {
                this._initUserInfo();
                this.$refs.userSettingDom.resetFields();
                this.userFormType = 'add';
                this.userSettingForm.isManger = 3;
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
            _setTableHeight() {
                let dm = document.body.clientHeight;
                this.tableHeight = dm - 280;
            },
            _getUserData() {
                this.$refs.userTable.getListData();
            },
            _treeNodeClickHandler(data) {
                this.searchData.nodeId.value = data.id;
            },
            _depChange(data) {
                let vm = this;
                console.log(data);
                console.log(data.slice(-1)[0]);
                this._getPostList(data.slice(-1)[0]).then(() => {
                    this.userSettingForm.post = this.postList.length ? this.postList[0].id : '';
                });
                this._getRoleList(data.slice(-1)[0]).then((res) => {
                    if (res) {
                        vm.userSettingForm.role = vm.roleData.length ? vm.roleData[0].id : '';
                    }
                });
            },
            _updateUserInfo() {
                let data = {};
                data.id = this.editUserId;
                data.isUpdate = true;
                data.states = this.userSettingForm.states ? 1 : 0;
                data.joinDate = this.userSettingForm.inJobTime;
                data.realName = this.userSettingForm.name;
                data.sex = this.userSettingForm.sex;
                data.isManger = this.userSettingForm.isManger;
                data.no_write = this.userSettingForm.isLog ? 0 : 1;
                data.banci = this.userSettingForm.banci.join(',');
                data.organizeId = this.userSettingForm.dep.slice(-1)[0];
                data.lv = data.organizeId;
                data.level = this.userSettingForm.level;
                data.levelcode = this.userSettingForm.level;
                data.postId = this.userSettingForm.post;
                data.roleId = this.userSettingForm.role;
                data.kq_type = data.banci;

                this.$http.post('/user/setUserInfo ', data).then((res) => {
                    if (res.success) {
                        this.$Message.success('用户更新成功!');
                        this._getUserData();
                        this.settingModalFlag = false;
                    }
                });
            },
            _addUser() {
                this.$refs.userSettingDom.validate((valid) => {
                    if (valid) {
                        let data = {};
                        data.isUpdate = false;
                        data.userName = this.userSettingForm.account;
                        data.passWord = this.defaultPsd;
                        data.states = this.userSettingForm.states ? 1 : 0;
                        data.joinDate = this.userSettingForm.inJobTime;
                        data.realName = this.userSettingForm.name;
                        data.sex = this.userSettingForm.sex;
                        data.no_write = this.userSettingForm.isLog ? 0 : 1;
                        data.banci = this.userSettingForm.banci.join(',') || '';
                        data.organizeId = this.userSettingForm.dep.slice(-1)[0] || '';
                        data.level = this.userSettingForm.level;
                        data.postId = this.userSettingForm.post;
                        data.isManger = this.userSettingForm.isManger;
                        data.roleId = this.userSettingForm.role;
                        this.$http.post('/user/setUserInfo ', data).then((res) => {
                            if (res.success) {
                                this.$Message.success('用户添加成功!');
                                this._getUserData();
                                this.settingModalFlag = false;
                            }
                        });
                    }
                });
            },
            _editorSetting(data) {
                this._initUserInfo();
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
                this.userSettingForm.companyId = data.companyid;
                this.userSettingForm.isManger = data.ismanger;
                this._getPostList(data.lv);
                this.userFormType = 'update';
                this.settingModalFlag = true;
                this.editUserId = data.id;
            },
            _returnNeedPostList(ids, names) {
                if (!ids || !names) return [];
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
            _getPostList(id) {
                let data = {};
                data.lv = id;
                return new Promise((resolve) => {
                    this.$http.get('/organize/getSetInfo', {params: data}).then((res) => {
                        if (res.success) {
                            this.postList = this._returnNeedPostList(res.data.postids, res.data.postnames);
                            resolve();
                        }
                    });
                });
            },
            _getRoleList(id) {
                let data = {};
                data.lv = id;
                return new Promise((resolve) => {
                    this.$http.get('/role/getAllRoleByLv', {params: data}).then((res) => {
                        if (res.success) {
                            this.roleData = res.data;
                            resolve(true);
                        }
                    });
                });
            },
//            _getRoleComboList() {
//                let data = {};
//                this.$http.get('/role/getRoleCombo').then((res) => {
//                    if (res.success) {
//                        this.roleCombo = res.data;
//                    }
//                });
//            },
            _getGuiderList() {
                this.$http.get('/post/getPdftree?userId=0').then((res) => {
                    if (res.success) {
                        this.guiderList = res.data;
                    }
                });
            },
            _getAllMenu() {
                this.$http.get('/jurisdiction/getAllSystemMenu').then((res) => {
                });
            },
            _getRoleData() {
                this.$http.get('/role/getRoleCombo').then((res) => {
                    if (res.success) {
                        this.roleData = res.data;
                        this.roleCombo = res.data;
                    }
                });
            },
            _getOrgTree() {
                // 同一个接口调用两次是因为左侧的树和下拉输入框是同一个接口，存在不合理的地方
                // 为未来分割独立保留一个方法
                return new Promise((resolve) => {
                    this.$http.get('/organize/userOrganizeTree?fatherId=-1').then((res) => {
                        if (res.success) {
                            this.orgTreeData = res.data;
                            this.searchData.nodeId.value = res.data[0].id;
                            resolve(res.data[0].id);
                        }
                    });
                });
            },
            _getOrgComboList() {
                this.$http.get('/organize/organizeTreeCertainVmC?fatherId=-1').then((res) => {
                    if (res.success) {
                        this.orgComboList = res.data;
                    }
                });
            },
            _getBanCiData() {
                this.tableBanciLoading = true;
                this.$http.get('/user/getBanCi').then((res) => {
                    if (res.success) {
                        this.banCiList = res.data;
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
                        // this.accseeList = this._renturnAccessNeedArr(res.data);
                        this.accseeList = res.data;
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
            },
            _initLeaveSetting() {
                let leaveSetting = this.leaveSettingForm;
                leaveSetting.reasonLeaving = '个人原因';
                leaveSetting.gradeLeaving = 'A';
                leaveSetting.leaveRemarks = '';
                leaveSetting.resignationTime = NOW_DATE;
                leaveSetting.id = 0;
                this.leavePeople = '';
            },
            _openLeaveSettingModal() {
                this._initLeaveSetting();
                this.leaveSettingForm.id = this.chooseDataArr[0].id;
                this.leavePeople = this.chooseDataArr[0].realname;
                this.leaveSettingFlag = true;
            },
            _coinLeaveHandler() {
                this.$http.post('/user/state', this.leaveSettingForm).then((res) => {
                    if (res.success) {
                        this.$Message.success('操作成功!');
                        this.leaveSettingFlag = false;
                        this._getUserData();
                    }
                });
            }
        },
        components: {
            fsTablePage
        }
    };
</script>
