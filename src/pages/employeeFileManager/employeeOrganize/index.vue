<template>
    <div>
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
                <Form inline :label-width="90">
                    <FormItem label="姓名">
                        <Input type="text" style="width: 120px"
                               @on-change="_inputDebounce"
                               v-model="filterOpt.name"
                               placeholder="筛选姓名"></Input>
                    </FormItem>
                    <!--<FormItem label="状态">-->
                        <!--<Select v-model="filterOpt.kqstates" style="width: 120px" placeholder="筛选状态"-->
                                <!--@on-change="_inputDebounce">-->
                            <!--<Option value="-1">全部</Option>-->
                            <!--<Option value="0">离职</Option>-->
                            <!--<Option value="1">在职</Option>-->
                        <!--</Select>-->
                    <!--</FormItem>-->
                    <FormItem label="岗位">
                        <Input type="text" style="width: 120px"
                               @on-change="_inputDebounce"
                               v-model="filterOpt.postName"
                               placeholder="筛选岗位"></Input>
                    </FormItem>
                    <FormItem label="学历">
                        <Select type="text" style="width: 120px"
                                @on-change="_inputDebounce"
                                v-model="filterOpt.xueli"
                                placeholder="筛选学历">
                            <Option value="本科">本科</Option>
                            <Option value="大专">大专</Option>
                            <Option value="高中">高中</Option>
                            <Option value="初中">初中</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="入职日期">
                        <DatePicker type="date" style="width: 120px"
                                    @on-change="_monthDateChange"
                                    :value="filterOpt.monthDate"></DatePicker>
                    </FormItem>
                    <FormItem label="到">
                        <DatePicker type="date" style="width: 120px"
                                    @on-change="_monthEndDateChange"
                                    :value="filterOpt.endmonthDate"></DatePicker>
                    </FormItem>
                    <FormItem label="出生日期">
                        <DatePicker type="date" style="width: 120px"
                                    placeholder="筛选出生日期"
                                    @on-change="_birthdayChange"
                                    :value="filterOpt.birthday"></DatePicker>
                    </FormItem>
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
                      show-sizer
                      show-total
                      show-elevator
                      style="margin-top: 16px;"></Page>
            </Card>
            </Col>
        </Row>
        <Modal v-model="settingModalFlag"
               width="1000"
               :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>详细信息</span>
            </p>
            <div class="">
                <Tabs type="card">
                    <TabPane label="基本信息">
                        <Form ref="baseForm" :label-width="100" inline>
                            <FormItem label="姓名" style="width:45%">
                                <Input type="text" v-model="baseForm.name"></Input>
                            </FormItem>
                            <FormItem label="性别" style="width:45%">
                                <Input type="text" v-model="baseForm.sex" disabled></Input>
                            </FormItem>
                            <FormItem label="手机" style="width:45%">
                                <Input type="text" v-model="baseForm.cellphone" ></Input>
                            </FormItem>
                            <!--<FormItem label="QQ" style="width:45%">-->
                                <!--<Input type="text" v-model="baseForm.inphone" ></Input>-->
                            <!--</FormItem>-->
                            <FormItem label="电子邮箱" style="width:45%">
                                <Input type="text" v-model="baseForm.email" ></Input>
                            </FormItem>
                            <FormItem label="身份证号码" style="width:45%">
                                <Input type="text" v-model="baseForm.idcard" ></Input>
                            </FormItem>
                            <FormItem label="出生日期" style="width:45%">
                                <DatePicker style="width: 100%" type="date" v-model="baseForm.birthday" disabled></DatePicker>
                            </FormItem>
                            <FormItem label="籍贯" style="width:45%">
                                <Input type="text" v-model="baseForm.origin"></Input>
                            </FormItem>
                            <FormItem label="民族" style="width:45%">
                                <Input type="text" v-model="baseForm.account"></Input>
                            </FormItem>
                            <FormItem label="年龄" style="width:45%">
                                <Input type="text" v-model="baseForm.nation"></Input>
                            </FormItem>
                            <FormItem label="政治面貌" style="width:45%;margin-right:1%;">
                                <Select style="width: 100%" v-model="baseForm.party" >
                                    <Option value="党员">党员</Option>
                                    <Option value="预备党员">预备党员</Option>
                                    <Option value="入党积极分子">入党积极分子</Option>
                                    <Option value="团员">团员</Option>
                                    <Option value="群众">群众</Option>
                                </Select>
                            </FormItem>

                            <FormItem label="婚姻状况" style="width:45%;margin-right:1%;">
                                <Select type="text" style="width: 100%" v-model="baseForm.marryage">
                                    <Option value="已婚">已婚</Option>
                                    <Option value="未婚">未婚</Option>
                                </Select>
                            </FormItem>
                            <FormItem label="档案编号" style="width:45%;">
                                <Input type="text" v-model="baseForm.filenum" disabled></Input>
                            </FormItem>
                            <FormItem label="详细住址" style="width:45%">
                                <Input type="textarea" :rows="6" v-model="baseForm.address"></Input>
                            </FormItem>
                            <FormItem label="部门经历" style="width:45%">
                                <Input type="textarea" :rows="6" v-model="baseForm.organizehistory"></Input>
                            </FormItem>
                            <FormItem label="岗位经历" style="width:45%">
                                <Input type="textarea" :rows="6" v-model="baseForm.posthistory"></Input>
                            </FormItem>
                            <!--<FormItem>-->
                                <!--<Button type="primary" :loading="btnLoading" @click="saveBase()">提交</Button>-->
                                <!--<Button type="ghost" @click="cancel()" style="margin-left: 8px">取消</Button>-->
                            <!--</FormItem>-->
                        </Form>
                    </TabPane>
                    <TabPane label="教育状况">
                        <Form ref="educationForm" inline>
                            <div v-for="(item,index) in educationForm">
                                <FormItem label="时间" style="width:22%">
                                    <Input type="text" v-model="item.workingtime" ></Input>
                                </FormItem>
                                <FormItem label="毕业院校	" style="width:22%">
                                    <Input type="text" v-model="item.graduationschool" ></Input>
                                </FormItem>
                                <FormItem label="专业" style="width:22%">
                                    <Input type="text" v-model="item.profession" ></Input>
                                </FormItem>
                                <FormItem label="学历" style="width:22%">
                                    <Input type="text" v-model="item.education" ></Input>
                                </FormItem>
                                <FormItem label="用户id" style="display: none">
                                    <Input type="text" v-model="item.userid" ></Input>
                                </FormItem>
                                <FormItem label="主键" style="display: none">
                                    <Input type="text" v-model="item.id" ></Input>
                                </FormItem>
                                <!--<FormItem label="操作" style="width:5%">-->
                                    <!--<Button style="color:#f46e65;font-size: 16px;padding: 3px 15px;" icon="ios-trash"  @click="delForm(index,'educationForm')"></Button>-->
                                <!--</FormItem>-->
                            </div>
                            <!--<FormItem>-->
                                <!--<Button type="primary" icon="checkmark-round" :loading="btnLoading" @click="saveRelation(2,educationForm)">提交</Button>-->
                                <!--<Button type="success" icon="android-add"  style="margin-left: 8px" @click="educationForm.push({})">增加经历</Button>-->
                                <!--<Button type="ghost" @click="cancel()">取消修改</Button>-->
                            <!--</FormItem>-->
                        </Form>
                    </TabPane>
                    <TabPane label="工作经历">
                        <Form ref="workingForm" inline>
                            <div v-for="(item,index) in workingForm">
                                <FormItem label="时间" style="width:12%">
                                    <Input type="text" v-model="item.workingtime" ></Input>
                                </FormItem>
                                <FormItem label="单位" style="width:12%">
                                    <Input type="text" v-model="item.employer" ></Input>
                                </FormItem>
                                <FormItem label="职务" style="width:12%">
                                    <Input type="text" v-model="item.duties" ></Input>
                                </FormItem>
                                <FormItem label="月薪" style="width:12%">
                                    <Input type="text" v-model="item.monthlysalary" ></Input>
                                </FormItem>
                                <FormItem label="离职原因" style="width:12%">
                                    <Input type="text" v-model="item.reasonleaving"></Input>
                                </FormItem>
                                <FormItem label="证明人" style="width:12%">
                                    <Input type="text" v-model="item.witness"></Input>
                                </FormItem>
                                <FormItem label="公司电话" style="width:12%">
                                    <Input type="text" v-model="item.phone"></Input>
                                </FormItem>
                                <FormItem label="用户id" style="display: none">
                                    <Input type="text" v-model="item.userid" ></Input>
                                </FormItem>
                                <FormItem label="主键" style="display: none">
                                    <Input type="text" v-model="item.id" ></Input>
                                </FormItem>
                                <!--<FormItem label="操作" style="width:5%">-->
                                    <!--<Button style="color:#f46e65;font-size: 16px;padding: 3px 15px;" icon="ios-trash"  @click="delForm(index,'workingForm')"></Button>-->
                                <!--</FormItem>-->
                            </div>
                            <!--<FormItem>-->
                                <!--<Button type="primary" icon="checkmark-round" :loading="btnLoading" @click="saveRelation(3,workingForm)">提交</Button>-->
                                <!--<Button type="success" icon="android-add"  style="margin-left: 8px" @click="workingForm.push({})">增加经历</Button>-->
                                <!--<Button type="ghost" @click="cancel()">取消修改</Button>-->
                            <!--</FormItem>-->
                        </Form>
                    </TabPane>
                    <TabPane label="社会关系">
                        <Form ref="socailShipForm"  inline>
                            <div v-for="(item,index) in socailShipForm" :key="item.name">
                                <FormItem label="关系" style="width:13%">
                                    <Input type="text"  v-model="item.relationship" ></Input>
                                </FormItem>
                                <FormItem label="姓名" style="width:13%">
                                    <Input type="text" name="name" v-model="item.name" ></Input>
                                </FormItem>
                                <FormItem label="年龄" style="width:13%">
                                    <Input type="text" v-model="item.age" ></Input>
                                </FormItem>
                                <FormItem label="工作单位	" style="width:13%">
                                    <Input type="text" v-model="item.employer" ></Input>
                                </FormItem>
                                <FormItem label="职务" style="width:13%">
                                    <Input type="text" v-model="item.duties"></Input>
                                </FormItem>
                                <FormItem label="电话" style="width:13%">
                                    <Input type="text" v-model="item.phone"></Input>
                                </FormItem>
                                <FormItem label="用户id" style="display: none">
                                    <Input type="text" v-model="item.userid" ></Input>
                                </FormItem>
                                <FormItem label="主键" style="display: none">
                                    <Input type="text" v-model="item.id" ></Input>
                                </FormItem>
                                <!--<FormItem label="操作" style="width:5%">-->
                                    <!--<Button style="color:#f46e65;font-size: 16px;padding: 3px 15px;" icon="ios-trash"  @click="delForm(index,'socailShipForm')"></Button>-->
                                <!--</FormItem>-->
                            </div>
                            <FormItem label="紧急联系人" style="width:30%">
                                <Input type="text" v-model="emergency.emergencycontact" ></Input>
                            </FormItem>
                            <FormItem label="联系人关系" style="width:30%">
                                <Input type="text" v-model="emergency.contactrelationship" ></Input>
                            </FormItem>
                            <FormItem label="联系人电话" style="width:30%">
                                <Input type="text" v-model="emergency.contactnumber" ></Input>
                            </FormItem>
                            <!--<FormItem style="width:100%">-->
                                <!--<Button type="primary" icon="checkmark-round" :loading="btnLoading" @click="saveRelation(1,socailShipForm)">提交</Button>-->
                                <!--<Button type="success" icon="android-add"  style="margin-left: 8px" @click="socailShipForm.push({})">增加关系</Button>-->
                                <!--<Button type="ghost" @click="cancel()">取消修改</Button>-->
                            <!--</FormItem>-->
                        </Form>
                    </TabPane>
                    <TabPane label="附件管理">
                        <div style="max-height: 400px;overflow-x: hidden;overflow-y: auto;">
                            <Card >
                                <Row :gutter="16">
                                    <Col span="12" v-for="(item,index) in fileList" :key="index" style="margin-bottom: 16px;">
                                    <Row>
                                        <Col span="8">
                                        <h4 style="width: 150px;text-overflow: ellipsis;overflow: hidden;white-space:nowrap;">文件名：{{item.file_name}}</h4>
                                        <h4 style="margin-top: 10px">上传人：{{item.insert_username}}</h4>
                                        <h4 style="margin-top: 10px">下载：<Button style="font-size: 20px;cursor: pointer" icon="ios-cloud-download-outline" @click="download(item.file_path)"></Button>  </h4>
                                        </Col>
                                        <Col span="15" class="fileImg">
                                        <img style="width: 100%;cursor: pointer;height: 200px;display: block;position: relative" :src="item.file_path" alt="">
                                        <div class="mouse-on-hover">
                                            <Icon type="ios-eye-outline" @click.native="handleView(item.file_path)"></Icon>
                                            <!--<Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>-->
                                        </div>
                                        </Col>
                                    </Row>
                                    </Col>
                                </Row>
                            </Card>
                        </div>
                        <!--<Upload name="ifile" multiple :data="{'ticketno':baseForm.userid}" action="/oa/ticket/uploadticketfiles">-->
                            <!--<Button type="ghost" icon="ios-cloud-upload-outline">上传</Button>-->
                        <!--</Upload>-->
                    </TabPane>
                </Tabs>
            </div>
            <div slot="footer">

            </div>
        </Modal>
        <Modal title="查看图片" v-model="visible" width="800px" >
            <img :src="imgsrc" v-if="visible" style="width: 100%;height: 100%">
        </Modal>
    </div>
</template>

<script>
    // 简单的axios薄层封装
    import pageMixin from '@/mixins/pageMixin';
    // 时间控件
    import moment from 'moment';
    // lodash输入延时
    import debounce from 'lodash/debounce';
    export default {
        name: 'employeeOrganize',
        data () {
            return {
                filterText: '',
                settingModalFlag: false,
                btnLoading: false,
                postColumns: [
                    {
                        title: '姓名',
                        key: 'name',
                        align: 'center',
                        width: 90
                    },
                    {
                        title: '部门',
                        key: 'deptement',
                        align: 'center'
                    },
                    {
                        title: '职务',
                        key: 'postName',
                        align: 'center'
                    },
                    {
                        title: '入职日期',
                        key: 'indate',
                        align: 'center'
                    },
                    {
                        title: '工龄',
                        key: 'workingAge',
                        align: 'center'
                    },
                    {
                        title: '转正时间',
                        key: 'contract_zhuanzheng_date',
                        align: 'center'
                    },
                    {
                        title: '联系方式',
                        key: 'contact',
                        align: 'center'
                    },
                    {
                        title: '性别',
                        key: 'sex',
                        align: 'center'
                    },
                    {
                        title: '学历',
                        key: 'xueli',
                        align: 'center'
                    },
                    {
                        title: '生日',
                        key: 'birthday',
                        align: 'center',
                        render: (h, params) => {
                            if (params.row.birthday) {
                                return h('span', moment(params.row.birthday).format('YYYY-MM-DD'));
                            }
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        render: (h, params) => {
                            var vm = this;
                            return h('div', [
                                h('Tooltip', {
                                    props: {
                                        content: '简历查看',
                                        placement: 'top',
                                        transfer: true
                                    }
                                }, [
                                    h('Button', {
                                        props: {
                                            type: 'primary',
                                            icon: 'android-expand',
                                            shape: 'circle'
                                        },
                                        on: {
                                            click: function () {
                                                vm.getUsersInfo(params.row.userId);
                                                vm.settingModalFlag = true;
                                            }
                                        }
                                    }
                                    )
                                ])
                            ]);
                        }
                    }
                ],
                baseForm: {},
                visible: false,
                imgsrc: '',
                defaultProps: {
                    children: 'children',
                    label: 'text'
                },
                orgTreeData: [],
                fileList: [
                ],
                educationForm: [
                    {
                        graduationtime: '2014-2017',
                        graduationschool: '南信院',
                        profession: '软江工程',
                        education: '专科'
                    },
                    {
                        graduationtime: '2018-2019',
                        graduationschool: '南信院2',
                        profession: '软江工程2',
                        education: '专科2'
                    }
                ],
                workingForm: [
                    {
                        workingtime: '2014-2017',
                        employer: '南信院',
                        duties: 'zhiwu',
                        monthlysalary: 'yuexing',
                        reasonleaving: '不高兴',
                        witness: 'ssss'
                    },
                    {
                        workingtime: '2014-2017',
                        employer: '南信院',
                        duties: 'zhiwu',
                        monthlysalary: 'yuexing',
                        reasonleaving: '不高兴',
                        witness: 'ssss',
                        companyphone: '123123'
                    }
                ],
                socailShipForm: [],
                emergency: {
                    emergencycontact: '父亲',
                    contactrelationship: 'aaaaaaa',
                    contactnumber: 15996118723
                },
                tableLoading: true,
                filterOpt: {
                    name: '', // 员工姓名
                    monthDate: '', // 入职日期左区间
                    endmonthDate: '', // 入职日期右区间
                    kqstates: 1, // 在职状态
                    organizeName: '', // 部门名称
                    organizeId: 1,
                    postName: '', // 岗位
                    xueli: '', // 学历
                    birthday: '', // 出生日期
                    sex: '',
                    marryage: '', //  婚否
                    party: '', // 政治面貌
                    company: '', // 工作单位
                    job: '', // 工作岗位
                    school: '', // 毕业院校
                    profession: '', // 专业
                    address: '', // 住址
                    reasonLeaving: '', // 离职原因
                    gradeLeaving: '' // 离职级别
                },
                tableHeight: 500
            };
        },
        mixins: [pageMixin],
        watch: {
            filterText(val) {
                this.$refs.treeDom.filter(val);
            }
        },
        created () {
            this._getOrgTree().then((res) => {
                this.filterOpt.organizeId = res;
                this._getPostData();
                this._setTableHeight();
            });
        },
        methods: {
            // 过滤节点
            filterNode(value, data) {
                if (!value) return true;
                return data.text.indexOf(value) !== -1;
            },
            // 树点击事件
            _treeNodeClickHandler(data) {
                this.filterOpt.organizeId = data.id;
                this._filterResultHandler();
            },
            // 获取部门树形结构
            _getOrgTree() {
                return new Promise((resolve) => {
                    this.$http.get('/organize/organizeTreeByUserForEmployee').then((res) => {
                        if (res.success) {
                            this.orgTreeData = res.data;
                            this.filterOpt.organizeId = res.data[0].id;
                            resolve(res.data[0].id);
                        }
                    });
                });
            },
            download(path) {
                var p = 'http://' + window.location.host + path;
                let downloadDom = document.createElement('a');
                downloadDom.id = 'ddom';
                downloadDom.href = p;
                downloadDom.download = '';
                document.body.appendChild(downloadDom);
                downloadDom.click();
                downloadDom.remove();
            },
            // 删除关系
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
                            this.$http.post('/employees/delRelation', {id: row.id}).then((res) => {
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
            // 视图渲染
            handleView(filePath) {
                this.imgsrc = filePath;
                this.visible = true;
            },
            // 基本信息保存
            // saveBase() {
            //     this.btnLoading = true;
            //     this.$http.post('/user/addInfo', this.baseForm).then((res) => {
            //         if (res.success) {
            //             this.btnLoading = false;
            //             this.$Message.success('保存基本数据成功！');
            //         }
            //     });
            // },
            // 社会关系 教育程度 工作资历保存
            // saveRelation(typerelationship,data) {
            //     var d = {};
            //     this.btnLoading = true;
            //     d.typerelationship = typerelationship;
            //     for (let i = 0; i < data.length; i++) {
            //         d['data' + i] = JSON.stringify(data[i]);
            //     }
            //     if (typerelationship === 1) {
            //         for (let key in this.emergency) {
            //             d[key] = this.emergency[key];
            //         }
            //     }
            //     this.$http.post('/employees/addUserRelationship', d).then((res) => {
            //         this.btnLoading = false;
            //         this.$Message.success('保存附加数据成功！');
            //     });
            // },
            // cancel() {
            //     this.settingModalFlag = false;
            //     var d = this.educationForm;
            //     var d2 = this.workingForm;
            //     // 删除自己新增的空数据
            //     for (let i = d.length - 1; i > 0; i--) {
            //         if (!d[i].education) {
            //             d.splice(i, 1);
            //         }
            //     }
            //     for (let i = d2.length - 1; i > 0; i--) {
            //         if (!d2[i].education) {
            //             d2.splice(i, 1);
            //         }
            //     }
            //     // this.educationForm = d;
            // },
            getUsersInfo(id) {
                var that = this;
                if (id === 0) {
                    return false;
                }
                var d = {};
                d.userId = id;
                this.$http.post('/employees/findEmployee', d).then((res) => {
                    if (res) {
                        this.baseForm = res;
                    }
                });
                // 社会关系
                this.$http.post('/employees/findUserRelationship', {'id': id, 'typeRelationship': 1}).then((res) => {
                    if (res.success) {
                        that.socailShipForm = res.data;
                        that.emergency.contactrelationship = res.emRelate;
                        that.emergency.emergencycontact = res.emPerson;
                        that.emergency.contactnumber = res.emPhone;
                    }
                });
                // 教育情况
                this.$http.post('/employees/findUserRelationship', {'id': id, 'typeRelationship': 2}).then((res) => {
                    if (res.success) {
                        that.educationForm = res.data;
                    }
                });
                // 工作经历
                this.$http.post('/employees/findUserRelationship', {'id': id, 'typeRelationship': 3}).then((res) => {
                    if (res.success) {
                        that.workingForm = res.data;
                    }
                });
                // 附件列表
                this.$http.post('/ticket/ticketFileslist', {'ticketno': id}).then((res) => {
                    if (res.success) {
                        var d = res.data;
                        for (let i = 0; i < d.length; i++) {
                            d[i].file_path = d[i].file_path.replace('\\..', '\\oa');
                            if (d[i].file_path.indexOf('/oa')) {
                                d[i].file_path = '/oa' + d[i].file_path;
                            }
                        }
                        that.fileList = res.data;
                    }
                });
            },
            _inputDebounce: debounce(function () {
                this._filterResultHandler();
            }, 1500),
            _filterResultHandler() {
                this.initPage();
                this._getPostData();
            },
            _monthEndDateChange(val) {
                this.filterOpt.endmonthDate = val;
                this._filterResultHandler();
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
            _monthDateChange(val) {
                this.filterOpt.monthDate = val;
                this._filterResultHandler();
            },
            _birthdayChange(val) {
                this.filterOpt.birthday = val;
                this._filterResultHandler();
            },
            initPage() {
                this.pageData.page = 1;
            },
            _getPostData() {
                this.getList('/employees/getEmployeeList', this.filterOpt);
            }
        }
    };
</script>

<style scoped>
    .mouse-on-hover{
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
        display: none;
    }
    .mouse-on-hover i{
        color: #fff;
        font-size: 60px;
        cursor: pointer;
        margin: 30px;
    }
    .fileImg:hover .mouse-on-hover{
        display: inline-flex;
        justify-content: center;
        align-items: center;
    }
</style>
