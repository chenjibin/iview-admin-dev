<template>
    <div>
        <Row :gutter="10">
            <Col :span="4">
                <fs-dep-tree url="/organize/organizeTree?fatherId=-1"
                             @node-change="_nodeChangeHandler($event)"
                             :defaultProps="defaultProps"></fs-dep-tree>
            </Col>
            <Col :span="20">
                <Card>
                    <Form inline :label-width="60">
                        <FormItem label="岗位">
                            <Input type="text"
                                   v-model="filterOpt.post_name.value"
                                   placeholder="筛选岗位"></Input>
                        </FormItem>
                        <FormItem label="角色">
                            <Select v-model="filterOpt.role_id.value"
                                    clearable
                                    placeholder="筛选角色"
                                    style="width: 100px">
                                <Option :value="item.id" v-for="item, index in roleData" :key="index">{{item.name}}</Option>
                            </Select>
                        </FormItem>
                        <FormItem :label-width="0.1">
                            <ButtonGroup>
                                <Button type="primary" @click="mubanFlag = true">
                                    <Icon type="gear-b"></Icon>
                                    模板设置
                                </Button>
                                <Button type="primary" @click="_openTrainPlan">
                                    <Icon type="plus-round"></Icon>
                                    创建培训计划
                                </Button>
                                <Button type="error"
                                        :disabled="!planChooseDataArray.length"
                                        @click="_delPlan">
                                    <Icon type="ios-trash-outline"></Icon>
                                    删除计划
                                </Button>
                            </ButtonGroup>
                        </FormItem>
                    </Form>
                    <fs-table-page :columns="postColumns"
                                   :size="null"
                                   :height="tableHeight"
                                   :params="filterOpt"
                                   :choosearray.sync="planChooseDataArray"
                                   ref="planList"
                                   url="/train/ever_plan_datalist"></fs-table-page>
                </Card>
            </Col>
        </Row>
        <Modal v-model="mubanFlag" width="900" :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>模板设置</span>
            </p>
            <fs-table-page :columns="mubanColumns"
                           :height="300"
                           ref="mubanAdd"
                           :choosearray.sync="chooseDataArray"
                           url="/train/ever_para_datalist"></fs-table-page>
            <div slot="footer">
                <Poptip confirm
                        title="您确认删除所选项目吗？"
                        transfer
                        @on-ok="_deleteMuban">
                    <Button style="margin-left: 8px"
                            type="error"
                            :disabled="!chooseDataArray.length">删除</Button>
                </Poptip>

                <Poptip placement="left"
                        width="400">
                    <Button type="primary"
                            :disabled="!(chooseDataArray.length === 1)"
                            style="margin-left: 8px"
                            @click="_updateMubanHandler">修改模板</Button>
                    <Button type="primary"
                            @click="_addMubanHandler"
                            style="margin-left: 8px">添加模板</Button>
                    <div class="banci-add-form" slot="content">
                        <Form :rules="mubanRules"
                              :model="mubanForm"
                              ref="mubanForm"
                              :label-width="100">
                            <FormItem label="项目名称" prop="name">
                                <Input v-model="mubanForm.name"></Input>
                            </FormItem>
                            <FormItem label="英文key_text" prop="keyText">
                                <Input v-model="mubanForm.keyText"></Input>
                            </FormItem>
                            <FormItem label="字段类型" style="text-align: left;">
                                <Select v-model="mubanForm.keyType"
                                        style="width: 100px">
                                    <Option value="textfield" >文本</Option>
                                    <Option value="textarea" >文本域</Option>
                                    <Option value="numberfield" >数字</Option>
                                </Select>
                            </FormItem>
                            <FormItem label="备注" prop="remark">
                                <Input v-model="mubanForm.remark"></Input>
                            </FormItem>
                            <FormItem>
                                <Button type="primary" @click="_addMuban" :loading="mubanBtnLoading">{{mubanAddType === 'add' ? '添加' : '修改'}}模板</Button>
                            </FormItem>
                        </Form>
                    </div>
                </Poptip>
                <Button type="ghost" style="margin-left: 8px" @click="mubanFlag = false">关闭</Button>
            </div>
        </Modal>
        <Modal v-model="modelFlag" width="600" :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>培训计划</span>
            </p>
            <fs-form :label-width="120"
                     :item-list="itemList"
                     ref="formPlan"
                     v-model="trainData"></fs-form>
            <div slot="footer">
                <Button type="primary" style="margin-left: 8px" @click="_submitPlan">提交计划</Button>
                <Button type="ghost" style="margin-left: 8px" @click="modelFlag = false">取消</Button>
            </div>
        </Modal>
        <Modal v-model="createPlanFlag" width="900" :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>创建培训计划</span>
            </p>
            <Form :model="mubanForm"
                  :label-width="100">
                <FormItem label="计划月份:" :label-width="100">
                    <DatePicker :value="planForm.planMonth"
                                :clearable="false"
                                type="month"
                                @on-change="planForm.planMonth = $event"></DatePicker>
                </FormItem>
                <FormItem label="负责人:">
                    <Select v-model="planForm.people" multiple>
                        <Option v-for="item, index in allTeacherOpt"
                                :value="item.user_id"
                                :key="'charge-' + index">{{ item.user_name + '(' + item.organize_name + '·'  + item.postname + '·' + item.post_name + ')'}}</Option>
                    </Select>
                    <Poptip
                            confirm
                            title="您确清空当前选中的负责人么？"
                            @on-ok="planForm.people = []">
                        <Button type="ghost"
                                icon="trash-a"
                                style="margin-top: 8px;">一键清空负责人</Button>
                    </Poptip>

                </FormItem>
                <FormItem label="项目:">
                    <CheckboxGroup v-model="planForm.project">
                        <Checkbox :label="item.id"
                                  :key="'project' + index"
                                  v-for="item,index in allProjectOpt">{{item.name}}</Checkbox>
                    </CheckboxGroup>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary" @click="_addPlan">创建计划</Button>
                <Button type="ghost" style="margin-left: 8px" @click="createPlanFlag = false">取消</Button>
            </div>
        </Modal>
    </div>
</template>
<style>

</style>
<script>
    import fsTablePage from '@/baseComponents/fs-table-page';
    import fsDepTree from '@/baseComponents/fs-dep-tree';
    import fsSearchUser from '@/baseComponents/fs-search-user';
    import fsForm from '@/baseComponents/fs-form/form';
    import moment from 'moment';
    const NOW_MONTH = moment().format('YYYY-MM');
    export default {
        name: 'trainPlanManage',
        data () {
            return {
                modelFlag: false,
                mubanFlag: false,
                mubanBtnLoading: false,
                createPlanFlag: false,
                tableHeight: 300,
                planId: 0,
                mubanAddType: 'add',
                chooseDataArray: [],
                planChooseDataArray: [],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                roleData: [],
                mubanId: 0,
                mubanForm: {
                    name: '',
                    keyText: '',
                    keyType: 'textfield',
                    remark: ''
                },
                mubanRules: {
                    name: [
                        {required: true, message: '项目名称不能为空', trigger: 'blur'}
                    ],
                    keyText: [
                        {required: true, message: '英文key_text不能为空', trigger: 'blur'}
                    ]
                },
                mubanColumns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '项目名称',
                        align: 'center',
                        key: 'name'
                    },
                    {
                        title: '英文key_text',
                        align: 'center',
                        key: 'key_text'
                    },
                    {
                        title: '参数类型',
                        align: 'center',
                        key: 'key_type'
                    },
                    {
                        title: '备注',
                        align: 'center',
                        key: 'remark'
                    }
                ],
                planForm: {
                    people: [],
                    project: [],
                    planMonth: NOW_MONTH
                },
                postColumns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '时间',
                        key: 'period',
                        align: 'center',
                        width: 160,
                        render: (h, params) => {
                            return h('span', moment(params.row.period).format('YYYY-MM'));
                        }
                    },
                    {
                        title: '部门',
                        align: 'center',
                        key: 'organize_name'
                    },
                    {
                        title: '岗位',
                        align: 'center',
                        key: 'post_name'
                    },
                    {
                        title: '角色',
                        align: 'center',
                        key: 'role_id',
                        width: 120,
                        render: (h, params) => {
                            let roleName = '';
                            let filterResult = this.roleData.filter(x => x.id === params.row.role_id);
                            if (filterResult.length) roleName = filterResult[0].name;
                            else roleName = params.row.id;
                            return h('span', roleName);
                        }
                    },
                    {
                        title: '状态',
                        align: 'center',
                        key: 'torfscore',
                        width: 120,
                        render: (h, params) => {
                            return h('Tag', {
                                props: {
                                    type: 'border',
                                    color: +params.row.status === 1 ? 'green' : 'red'
                                }
                            }, +params.row.status === 1 ? '已设置' : '未设置');
                        }
                    },
                    {
                        title: '负责人',
                        align: 'center',
                        key: 'user_name',
                        width: 120
                    },
                    {
                        title: '培训计划',
                        align: 'center',
                        width: 120,
                        render: (h, params) => {
                            let vm = this;
                            return h('div', [
                                h('Tooltip', {
                                    props: {
                                        content: '点击查看',
                                        placement: 'top',
                                        transfer: true
                                    }
                                }, [
                                    h('Button', {
                                        props: {
                                            type: 'primary',
                                            icon: 'eye',
                                            shape: 'circle'
                                        },
                                        on: {
                                            click: function(e) {
                                                e.stopPropagation();
                                                vm._checkTest(params.row);
                                            }
                                        }
                                    })
                                ])
                            ]);
                        }
                    }
                ],
                filterOpt: {
                    post_name: {
                        value: '',
                        type: 'input'
                    },
                    role_id: {
                        value: '',
                        type: 'select'
                    },
                    organizeId: {
                        value: 1,
                        type: 'tree'
                    }
                },
                itemList: [],
                trainData: {},
                allProjectOpt: [],
                allTeacherOpt: [],
                defaultPeople: []
            };
        },
        watch: {
            allProjectOpt(val) {
                this.planForm.project = val.map(x => x.id);
            }
        },
        created() {
            this._setTableHeight();
            this._getRoleData();
            this._getAllProjectOpt();
            this._getAllTeacherOpt();
        },
        methods: {
            formReset (name) {
                this.$refs[name].resetFields();
            },
            downloadFile(url, name) {
                let downloadDom = document.createElement('a');
                downloadDom.href = url;
                downloadDom.download = name;
                downloadDom.click();
            },
            _updateMubanHandler() {
                this.mubanAddType = 'update';
                this.formReset('mubanForm');
                let fillForm = this.chooseDataArray[0];
                this.mubanForm.name = fillForm.name;
                this.mubanForm.keyText = fillForm.key_text;
                this.mubanForm.keyType = fillForm.key_type;
                this.mubanForm.remark = fillForm.remark;
                this.mubanId = fillForm.id;
            },
            _addMubanHandler() {
                this.mubanAddType = 'add';
                this.formReset('mubanForm');
            },
            _submitPlan() {
                this.$refs.formPlan.validForm(() => {
                    let sendData = JSON.parse(JSON.stringify(this.trainData));
                    sendData.id = this.planId;
                    this.$http.post('/train/ever_plan_para_add', sendData).then((res) => {
                        if (res.success) {
                            this.modelFlag = false;
                            this.$Message.success('计划提交成功!');
                            this._updatePlanList();
                        }
                    });
                });
            },
            _openTrainPlan() {
                this.createPlanFlag = true;
                this.planForm.people = this.defaultPeople;
                this.planForm.planMonth = NOW_MONTH;
            },
            _addPlan() {
                if (!this.planForm.people.length) {
                    this.$Message.error('请添加负责人');
                    return;
                }
                let data = {};
                data.ids = this.planForm.people.join(',');
                data.paraIds = this.planForm.project.join(',');
                data.month = this.planForm.planMonth;
                this.$http.post('/train/ever_plan_add', data).then((res) => {
                    if (res.success) {
                        this.createPlanFlag = false;
                        this.$Message.success('创建计划成功!');
                        this._updatePlanList();
                    }
                });
            },
            _delPlan() {
                this.$Modal.confirm({
                    content: '确认删除所选计划么？',
                    okText: '确认删除',
                    cancelText: '取消',
                    onOk: () => {
                        let sendData = {};
                        sendData.ids = this.planChooseDataArray.map(x => x.id).join(',');
                        this.$http.post('/train/ever_plan_delete', sendData).then((res) => {
                            if (res.success) {
                                this.$Message.success('删除成功!');
                                this._updatePlanList();
                            }
                        });
                    }
                });
            },
            _deleteMuban() {
                let data = {};
                data.ids = this.chooseDataArray.map(x => x.id).join(',');
                this.$http.post('/train/ever_para_delete', data).then((res) => {
                    if (res.success) {
                        this.$refs.mubanAdd.getListData();
                        this._getAllProjectOpt();
                        this.chooseDataArray = [];
                        this.$Message.success('删除成功！');
                    }
                });
            },
            _addMuban() {
                this.$refs.mubanForm.validate((valid) => {
                    if (valid) {
                        this.mubanBtnLoading = true;
                        let data = {};
                        if (!(this.mubanAddType === 'add')) data.id = this.mubanId;
                        data.name = this.mubanForm.name;
                        data.key_text = this.mubanForm.keyText;
                        data.key_type = this.mubanForm.keyType;
                        data.remark = this.mubanForm.remark;
                        this.$http.post('/train/ever_para_add', data).then((res) => {
                            if (res.success) {
                                this.formReset('mubanForm');
                                this._getAllProjectOpt();
                                this.$refs.mubanAdd.getListData();
                                this.$Message.success('操作成功！');
                            }
                        }).finally(() => {
                            this.mubanBtnLoading = false;
                        });
                    }
                });
            },
            _nodeChangeHandler(data) {
                this.filterOpt.organizeId.value = data.id;
            },
            _checkTest(data) {
                this.$refs.formPlan.resetForm();
                let sendData = {};
                sendData.id = data.id;
                this.planId = data.id;
                this.$http.post('/train/plan_para_select', sendData).then((res) => {
                    if (res.success) {
                        let formItems = res.data.field;
                        let formList = [];
                        let trainData = {};
                        formItems.forEach(item => {
                            let obj = {};
                            obj.type = 'input';
                            trainData[item.name] = item.value;
                            obj.value = item.value || '';
                            switch (item.xtype) {
                                case 'numberfield':
                                    obj.type = 'number';
                                    obj.value = +item.value;
                                    break;
                                case 'textarea':
                                    obj.type = 'textarea';
                                    break;
                            }
                            obj.label = item.fieldLabel;
                            obj.key = item.name;
                            obj.required = true;
                            formList.push(obj);
                        });
                        this.itemList = formList;
                        this.trainData = trainData;
                    }
                });
                this.modelFlag = true;
            },
            _setTableHeight() {
                let dm = document.body.clientHeight;
                this.tableHeight = dm - 280;
            },
            _getAllProjectOpt() {
                this.$http.get('/train/ever_para_datalist?page=1&pageSize=20').then((res) => {
                    if (res.success) {
                        this.allProjectOpt = res.data;
                    }
                });
            },
            _getRoleData() {
                this.$http.get('/role/getAllRole').then((res) => {
                    if (res.success) {
                        this.roleData = res.data;
                    }
                });
            },
            _updatePlanList() {
                this.$refs.planList.getListData();
            },
            _getAllTeacherOpt() {
                let data = {};
                data.page = 1;
                data.pageSize = 10000;
                this.$http.get('/train/teacher_datalist', {params: data}).then((res) => {
                    if (res.success) {
                        this.allTeacherOpt = res.data;
                        this.defaultPeople = this.allTeacherOpt.filter(x => x.isdefault === 1).map(x => x.user_id);
                    }
                });
            }
        },
        components: {
            fsTablePage,
            fsDepTree,
            fsSearchUser,
            fsForm
        }
    };
</script>
