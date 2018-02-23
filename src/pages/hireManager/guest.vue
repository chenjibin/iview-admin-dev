<template>
    <div id="guest">
        <Card style="height: 99%">
            <Tabs type="card" style="height: 100%;">
                <TabPane label="基本信息" style="height: 100%">
                    <Form ref="talentBean" :model="talentBean" :rules="rules" style="font-size: 0px;overflow-y: auto;overflow-x: hidden;height: 100%;" inline>
                        <Input type="text" style="display: none" v-model="talentBean.id"></Input>
                        <FormItem label="姓名" prop="name" style="width:49%;margin-right: 1%;">
                            <Input type="text" v-model.trim="talentBean.name"></Input>
                        </FormItem>

                        <FormItem label="性别" style="width:49%;margin-right: 0px;">
                            <Select type="text" v-model="talentBean.sex">
                                <Option value="1">男</Option>
                                <Option value="2">女</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="年龄" prop="age" style="width:49%;margin-right: 1%;">
                            <Input type="text" v-model.number="talentBean.age"></Input>
                        </FormItem>
                        <FormItem label="手机" prop="phone" style="width:49%;margin-right: 0px;">
                            <Input type="text" v-model="talentBean.phone"></Input>
                        </FormItem>
                        <FormItem label="期望月薪" style="width:49%;margin-right: 1%;">
                            <Input type="text" v-model="talentBean.monthlysalary"></Input>
                        </FormItem>
                        <FormItem label="信息来源" style="width:49%;margin-right: 0px;">
                            <Select type="text" v-model="talentBean.resumesource">
                                <Option value="">请选择</Option>
                                <Option value="1">58同城</Option>
                                <Option value="2">智联</Option>
                                <Option value="3">前程无忧</Option>
                                <Option value="4">其它</Option>
                                <Option value="5">现场招聘会</Option>
                                <Option value="6">微信公众号</Option>
                                <Option value="7">来电</Option>
                                <Option value="8">介绍</Option>
                                <Option value="9">校招</Option>
                                <Option value="10">人才市场</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="工作经验" style="width:49%;margin-right: 1%;">
                            <Input type="number" v-model="talentBean.yearswork" placeholder="单位：年"></Input>
                        </FormItem>
                        <FormItem label="电子邮箱" style="width:49%;margin-right: 0px;">
                            <Input type="email" v-model="talentBean.email"></Input>
                        </FormItem>
                        <FormItem label="身份证号码" style="width:49%;margin-right: 1%;">
                            <Input type="text" v-model="talentBean.idnum"></Input>
                        </FormItem>
                        <FormItem label="籍贯" style="width:49%;margin-right: 0px;">
                            <Input type="text" v-model="talentBean.account"></Input>
                        </FormItem>
                        <FormItem label="民族" style="width:49%;margin-right: 1%;">
                            <Input type="text" v-model="talentBean.nation"></Input>
                        </FormItem>
                        <FormItem label="紧急联系人" style="width:49%;margin-right: 0px;">
                            <Input type="text" v-model="talentBean.emperson"></Input>
                        </FormItem>
                        <FormItem label="联系人关系" style="width:49%;margin-right: 1%;">
                            <Input type="text" v-model="talentBean.emrelate"></Input>
                        </FormItem>
                        <FormItem label="联系人号码" style="width:49%;margin-right: 0px;">
                            <Input type="text" v-model="talentBean.emphone"></Input>
                        </FormItem>
                        <FormItem label="政治面貌" style="width:49%;margin-right: 1%;">
                            <Select type="text" v-model="talentBean.politicalstatus">
                                <Option value="党员">党员</Option>
                                <Option value="预备党员">预备党员</Option>
                                <Option value="入党积极分子">入党积极分子</Option>
                                <Option value="团员">团员</Option>
                                <Option value="群众">群众</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="婚姻状况" style="width:49%;margin-right: 0px;">
                            <Select type="text" v-model="talentBean.marriage">
                                <Option value="1">已婚</Option>
                                <Option value="2">未婚</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="详细住址" style="width:49%;margin-right: 1%;">
                            <Input type="textarea" :autosize="{minRows: 3,maxRows: 5}" v-model="talentBean.address"></Input>
                        </FormItem>
                        <FormItem label="专长技能" style="width:49%;margin-right: 1%;">
                            <Input type="textarea" :autosize="{minRows: 3,maxRows: 5}" v-model="talentBean.expertiseskills"></Input>
                        </FormItem>
                        <FormItem label="项目经验" style="width:99%;margin-right: 0px;">
                            <Input type="textarea" :autosize="{minRows: 5,maxRows: 15}" v-model="talentBean.projectexperience"></Input>
                        </FormItem>
                        <FormItem label="语言能力" style="width:99%;margin-right: 0px;">
                            <Input type="textarea" :autosize="{minRows: 5,maxRows: 16}" v-model="talentBean.languageskills"></Input>
                        </FormItem>
                        <FormItem label="自我评价" style="width:99%;margin-right: 0px;">
                            <Input type="textarea" :autosize="{minRows: 5,maxRows: 16}" v-model="talentBean.selfevaluation"></Input>
                        </FormItem>
                        <FormItem label="培训经历" style="width:99%;margin-right: 0px;">
                            <Input type="textarea" :autosize="{minRows: 5,maxRows: 16}" v-model="talentBean.trainingexperience"></Input>
                        </FormItem>
                    </Form>
                </TabPane>
                <TabPane id="education" label="教育状况" style="height: 100%">
                    <Form :gutter="1" ref="educationForm" inline style="font-size: 0px;overflow-y: auto; overflow-x: hidden;height: 100%;">
                        <div v-for="(item,index) in educationForm" class="custom-div">
                            <FormItem label="开始时间" style="width:49%;margin-right: 1%;">
                                <DatePicker style="width: 100%"  type="date" @on-change="_monthDateChange(1, index, 'starttime',$event)" :value="item.starttime"></DatePicker>
                            </FormItem>
                            <FormItem label="结束时间" style="width:50%;margin-right: 0px;">
                                <DatePicker style="width: 100%"  type="date" @on-change="_monthDateChange(1, index, 'endtime',$event)" :value="item.endtime"></DatePicker>
                            </FormItem>
                            <FormItem label="毕业院校	" style="width:49%;margin-right: 1%;">
                                <Input type="text" v-model="item.graduatedschool"></Input>
                            </FormItem>
                            <FormItem label="专业" style="width:50%;margin-right: 0px;">
                                <Input type="text" v-model="item.profession"></Input>
                            </FormItem>
                            <FormItem label="学历" style="width:49%;margin-right: 1%;">
                                <Select type="text" v-model="item.education">
                                    <Option value="1">博士研究生</Option>
                                    <Option value="2">硕士研究生</Option>
                                    <Option value="3">本科</Option>
                                    <Option value="4">专科</Option>
                                    <Option value="5">中专</Option>
                                    <Option value="6">高中</Option>
                                    <Option value="7">初中</Option>
                                </Select>
                            </FormItem>
                            <FormItem label="主键" style="display: none">
                                <Input type="text" v-model="item.id"></Input>
                            </FormItem>
                            <FormItem label="类型" style="display: none">
                                <Input type="text" v-model="item.type" value="2"></Input>
                            </FormItem>
                            <FormItem label="关联人" style="display: none">
                                <Input type="text" v-model="item.talentid"></Input>
                            </FormItem>
                            <FormItem label="操作">
                                <Button style="color:#f46e65;font-size: 16px;padding: 3px 15px;" icon="ios-trash"
                                        @click="delForm(index,'educationForm')"></Button>
                            </FormItem>
                        </div>
                        <div>
                            <FormItem style="height: 60px">
                                <Button type="primary" icon="android-add" style="margin-left: 8px" @click="educationForm.push({})">增加经历
                                </Button>
                            </FormItem>
                        </div>
                    </Form>
                </TabPane>
                <TabPane id="working" label="工作经历">
                    <Form ref="workingForm" inline style="font-size: 0px;overflow-y: auto; overflow-x: hidden;height: 100%;">
                        <div v-for="(item,index) in workingForm" class="custom-div">
                            <FormItem label="开始时间" style="width:49%;margin-right: 1%;">
                                <DatePicker style="width: 100%"  type="date" @on-change="_monthDateChange(2, index, 'starttime',$event)" :value="item.starttime"></DatePicker>
                            </FormItem>
                            <FormItem label="结束时间" style="width:50%;margin-right: 0;">
                                <DatePicker style="width: 100%"  type="date" @on-change="_monthDateChange(2, index, 'endtime',$event)" :value="item.endtime"></DatePicker>
                            </FormItem>
                            <FormItem label="公司名称" style="width:49%;margin-right: 1%;">
                                <Input type="text" v-model="item.companyname"></Input>
                            </FormItem>
                            <FormItem label="职务" style="width:50%;margin-right: 0;">
                                <Input type="text" v-model="item.post"></Input>
                            </FormItem>
                            <FormItem label="月薪" style="width:49%;margin-right: 51%;">
                                <Input type="text" v-model="item.monthlysalary"></Input>
                            </FormItem>
                            <FormItem label="工作描述" style="width:49%;margin-right: 1%;">
                                <Input type="textarea" :autosize="{minRows: 5,maxRows: 16}" v-model="item.descriptioncontent"></Input>
                            </FormItem>
                            <FormItem label="主键" style="display: none">
                                <Input type="text" v-model="item.id"></Input>
                            </FormItem>
                            <FormItem label="关联人" style="display: none">
                                <Input type="text" v-model="item.talentid"></Input>
                            </FormItem>
                            <FormItem label="类型" style="display: none">
                                <Input type="text" v-model="item.type" value="1"></Input>
                            </FormItem>
                            <FormItem label="操作">
                                <Button style="color:#f46e65;font-size: 16px;padding: 3px 15px;" icon="ios-trash"
                                        @click="delForm(index,'workingForm')"></Button>
                            </FormItem>
                        </div>
                        <FormItem style="height: 60px">
                            <Button type="primary" icon="android-add" style="margin-left: 8px"
                                    @click="workingForm.push({})">增加经历
                            </Button>
                        </FormItem>
                    </Form>
                </TabPane>
                <ButtonGroup slot="extra">
                    <Button type="primary" icon="document" @click="saveForm" size="small" >保存</Button>
                    <Button type="ghost" icon="edit" @click="searchUserModel = true" size="small">完善简历</Button>
                </ButtonGroup>
            </Tabs>
        </Card>
        <Modal v-model="searchUserModel" inline width="360" :mask-closable="false">
            <p slot="header" style="color:#2b85e4;text-align:center;font-size: 14px">
                <Icon type="information-circled"></Icon>
                <span>简历数据</span>
            </p>
            <Form ref="searchUserForm" :model="searchUserForm" :rules="rules" inline style="font-size: 0px;" :closable="false">
                <FormItem label="姓名" prop="name" style="width: 49%;margin-right: 1%">
                    <Input type="text" v-model="searchUserForm.name"/>
                </FormItem>
                <FormItem label="手机号码" prop="phone" style="width: 49%;margin-right: 1%">
                    <Input type="text" v-model.trim="searchUserForm.phone"/>
                </FormItem>
            </Form>
            <div style="text-align:center;color: #666">
                <p>维护您在本公司良好的简历，更容易被关注哦</p>
            </div>
            <div slot="footer">
                <Button type="primary" size="large" long @click="checkUser()">继续编辑</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    export default {
        name: 'hire',
        data () {
            const validateMobile = (rule, value, callback) => {
                if (!Number.isInteger(+value) || value.length !== 11) {
                    callback(new Error('号码不正确'));
                } else {
                    callback();
                }
            };
            return {
                searchUserModel: true,
                searchUserForm: {
                    name: '',
                    phone: ''
                },
                educationForm: [
                    {
                        graduatedschool: '',
                        starttime: '',
                        endtime: '',
                        profession: '',
                        education: '',
                        type: 2,
                        descriptioncontent: ''
                    }
                ], // 简历教育历史
                workingForm: [
                    {
                        descriptioncontent: '',
                        companyname: '',
                        endtime: '',
                        starttime: '',
                        post: '',
                        type: 1,
                        monthlysalary: 0
                    }
                ], // 简历工作信息
                talentBean: {
                    id: '',
                    postname: '',
                    monthlysalary: '',
                    resumesource: '',
                    name: '',
                    age: '',
                    yearswork: '',
                    sex: '',
                    marriage: '',
                    phone: '',
                    email: '',
                    address: '',
                    account: '',
                    province_id: '',
                    city_id: '',
                    area_id: '',
                    selfevaluation: '',
                    expertiseskills: '',
                    projectexperience: '',
                    languageskills: '',
                    trainingexperience: '',
                    remarks: '',
                    headimg: '',
                    nation: '',
                    idnum: '',
                    politicalstatus: '',
                    emperson: '',
                    emrelate: '',
                    emphone: ''
                }, // 简历基本信息模块
                rules: {
                    name: [
                        {required: true, message: '姓名必填', trigger: 'blur'}
                    ],
                    phone: [
                        {required: true, message: '手机号码必填', trigger: 'blur'},
                        {validator: validateMobile, trigger: 'blur'}
                    ],
                    age: [
                        {required: false, type: 'number', message: '年龄不合法', trigger: 'change'}
                    ],
                    interviewtime: [
                        { required: true, message: '面试时间必填', trigger: 'change', type: 'date' }
                    ],
                    testtime: [
                        { required: true, message: '试岗时间必填', trigger: 'change', type: 'date' }
                    ],
                    testresults: [
                        { required: true, message: '试岗成绩必填', trigger: 'blur' }
                    ],
                    status: [
                        { required: true, message: '是否合格或到达必填', trigger: 'change' }
                    ]
                }
            };
        },
        created () {
            this.hire();
        },
        methods: {
            delForm(index, formName) {
                var row = this[formName][index];
                var vm = this;
                if (row.id) {
                    this.$Modal.confirm({
                        title: '删除提醒',
                        content: '是否确认删除？',
                        okText: '删除',
                        cancelText: '取消',
                        loading: true,
                        onOk() {
                            this.$http.post('/talentLibrary/delRelation', {id: row.id}).then((res) => {
                                if (res.success) {
                                    vm.$Modal.remove();
                                    vm[formName].splice(index, 1);
                                    vm.$Message.success('删除成功');
                                } else {
                                    vm.$Message.error('删除失败');
                                }
                            });
                        }
                    });
                } else {
                    this[formName].splice(index, 1);
                }
            },
            changeStatus (status) {
                this.filterOpt.status = status;
                this._filterResultHandler();
            },
            checkUser() {
                var g = this;
                this.$refs['searchUserForm'].validate((valid) => {
                    if (!valid) {
                        return false;
                    }
                    g.$http.post('/talentLibrary/checkUser', g.searchUserForm).then((res) => {
                        if (res.success) {
                            g._findUser(res.message).then((res) => {
                                g.$Message.success('读取成功');
                                g.searchUserModel = false;
                            });
                        }
                    });
                });
            },
            saveForm() {
                var g = this;
                this.$refs['talentBean'].validate((valid) => {
                    console.log(1);
                    console.log(valid);
                    var d = {};
                    d.bean = JSON.stringify(this.talentBean);
                    d.workingForm = JSON.stringify(this.workingForm);
                    d.educationForm = JSON.stringify(this.educationForm);
                    g.$http.post('/talentLibrary/saveGuest', d).then((res) => {
                        g.saveBtn1Loading = false;
                        g.saveBtn2Loading = false;
                        if (res.success) {
                            g.$Message.success('保存成功');
                            g._findUser(res.message);
                        } else {
                            g.$Message.error('保存失败' + (res.message || ''));
                        }
                    });
                });
            },
            _filterResultHandler () {
                this._getPostData();
            },
            _monthDateChange (type, index, key, value) {
                if (type === 1) {
                    this.educationForm[index][key] = value;
                }
                if (type === 2) {
                    this.workingForm[index][key] = value;
                }
            },
            _findUser(id) {
                var vm = this;
                return new Promise(function (resolve, reject) {
                    vm.$http.post('/talentLibrary/find', {id: id}).then((res) => {
                        if (res.success) {
                            resolve();
                            vm.educationForm = res.educations;
                            vm.workingForm = res.workings;
                            vm.talentBean = res.talentLibrary;
                        } else {
                            reject(new Error('数据不存在'));
                        }
                    });
                });
            },
            hire() {
                console.log(`
                ##     ## #### ########  ########
                ##     ##  ##  ##     ## ##
                ##     ##  ##  ##     ## ##
                #########  ##  ########  ######
                ##     ##  ##  ##   ##   ##
                ##     ##  ##  ##    ##  ##
                ##     ## #### ##     ## ######## `);
                console.log('%c或许是机缘巧合让我们相遇。天马网络科技集团技术部诚邀技术爱好者，欢迎您的加入。', 'color:#666;font-size:14px');
            }
        }
    };
</script>

<style lang="less">
    #guest {
        height: 100%;
        .ivu-card-body{
            height: 100%;
            .ivu-tabs-content{
                @diff : 32px;
                height: calc(~"100% - " @diff);
            }
        }
        .custom-div .ivu-form-item {
             margin-bottom: 0px;
        }

        .custom-div{
            margin: 5px auto;
            padding-bottom: 10px;
            border-bottom: 1px solid #cccccc;
        }
        .ivu-table-body {
            overflow: auto;
            margin-right: -10px;
        }
        #btn-fix-container {
            position: absolute;
            right: 50px;
            top: 0px;
        }
        #btn-fix-container {
            .btn-group-fix {
                position: fixed;
                margin: 10px 0 0 20px;
                z-index: 10;
                background-color: rgba(255, 255, 255, 0.5);
            }
        }
        .showUserInfoItem {
            width: 45%;
            font-size: 18px;
            font-weight: bold;
        }
    }
</style>
