<template>
    <div id="employee-manage">
        <Row :gutter="10">
            <Col :span="5">
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
            <Col :span="19">
                <Card>
                    <Form ref="searchData" :model="searchData" inline :label-width="60">
                        <FormItem prop="name" label="姓名">
                            <Input type="text"
                                   @on-blur="_getUserData"
                                   v-model="searchData.realName"
                                   placeholder="姓名"></Input>
                        </FormItem>
                        <FormItem prop="name" label="岗位">
                            <Input type="text"
                                   @on-blur="_getUserData"
                                   v-model="searchData.postName"
                                   placeholder="岗位"></Input>
                        </FormItem>

                        <FormItem label="角色">
                            <Select v-model="searchData.roleId" clearable :transfer="true" placeholder="筛选角色" style="width: 120px">
                                <Option :value="item.id" v-for="(item, index) in roleData" :key="'role' + index">{{item.name}}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="状态">
                            <Select v-model="searchData.states" clearable style="width: 100px">
                                <Option value="1">启用</Option>
                                <Option value="0">禁用</Option>
                            </Select>
                        </FormItem>
                    </Form>
                    <Table :columns="columns1"
                           :loading="tableLoading"
                           height="700"
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
                <span>用户设置</span>
            </p>
            <Form :model="userSettingForm" :label-width="80">
                <Row>
                    <Col :span="8">
                        <FormItem label="状态">
                            <i-switch v-model="userSettingForm.status" size="large">
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
                            <DatePicker type="date" placeholder="Select date" v-model="userSettingForm.inJobTime"></DatePicker>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col :span="8">
                        <FormItem label="账号">
                            <Input v-model="userSettingForm.account" disabled></Input>
                        </FormItem>
                    </Col>
                    <Col :span="8">
                        <FormItem label="姓名">
                            <Input v-model="userSettingForm.name" placeholder="Enter something..."></Input>
                        </FormItem>
                    </Col>
                    <Col :span="8">
                        <FormItem label="性别">
                            <RadioGroup v-model="userSettingForm.sex">
                                <Radio label="女">女</Radio>
                                <Radio label="男">男</Radio>
                            </RadioGroup>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col :span="8">
                        <FormItem label="角色">
                            <Select v-model="userSettingForm.role">
                                <Option :value="item.id" v-for="(item, index) in roleData" :key="'role' + index">{{item.name}}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col :span="8">
                        <FormItem label="部门">
                            <Select v-model="userSettingForm.dep">
                                <Option value="beijing">New York</Option>
                                <Option value="shanghai">London</Option>
                                <Option value="shenzhen">Sydney</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col :span="8">
                    <FormItem label="岗位">
                        <Select v-model="userSettingForm.post">
                            <Option value="beijing">New York</Option>
                            <Option value="shanghai">London</Option>
                            <Option value="shenzhen">Sydney</Option>
                        </Select>
                    </FormItem>
                    </Col>
                </Row>
                <FormItem label="岗位操作指南" :label-width="100">
                    <Select v-model="userSettingForm.guider" multiple>
                        <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="班次设置" :label-width="100">
                    <Select v-model="userSettingForm.banci" multiple>
                        <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary">保存</Button>
                <Button type="ghost" style="margin-left: 8px">取消</Button>
            </div>
        </Modal>
    </div>
</template>
<style lang="less">
    @import "../../styles/fsBase";
</style>
<script>
    export default {
        name: 'employeeManage',
        watch: {
            filterText(val) {
                this.$refs.treeDom.filter(val);
            },
            'searchData.page'() {
                this._getUserData();
            },
            'searchData.pageSize'() {
                this._getUserData();
            },
            'searchData.nodeId'() {
                this._getUserData();
            },
            'searchData.states'() {
                this._getUserData();
            },
            'searchData.roleId'() {
                this._getUserData();
            }
        },
        data () {
            return {
                cityList: [
                    {
                        value: 'New York',
                        label: 'New York'
                    },
                    {
                        value: 'London',
                        label: 'London'
                    },
                    {
                        value: 'Sydney',
                        label: 'Sydney'
                    },
                    {
                        value: 'Ottawa',
                        label: 'Ottawa'
                    },
                    {
                        value: 'Paris',
                        label: 'Paris'
                    },
                    {
                        value: 'Canberra',
                        label: 'Canberra'
                    }
                ],
                settingModalFlag: false,
                tableLoading: false,
                userSettingForm: {
                    status: true,
                    account: 'chenjibin',
                    name: '陈继斌',
                    sex: '男',
                    inJobTime: '2017-01-01',
                    role: '',
                    dep: '',
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
                        align: 'center',
                        width: 100
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
                        width: 110,
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
                                        placement: 'top'
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
                                        content: '金币操作',
                                        placement: 'top'
                                    }
                                }, [
                                    h('Button', {
                                        props: {
                                            type: 'primary',
                                            icon: 'cash',
                                            shape: 'circle'
                                        },
                                        style: {
                                            marginRight: '4px'
                                        }
                                    })
                                ]),
                                h('Tooltip', {
                                    props: {
                                        content: '用户设置',
                                        placement: 'top'
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
                                                vm._editorSetting(params.row.userid);
                                            }
                                        }
                                    })
                                ])
                            ]);
                        }
                    }
                ],
                roleData: [],
                userData: [],
                orgTreeData: [],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                filterText: ''
            };
        },
        created() {
            this._getAllMenu();
            this._getRoleData();
            this._getOrgTree().then(() => {
                this._getUserData();
            });
        },
        methods: {
            filterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },
            _getUserData() {
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
            },
            _setPageSize(size) {
                this.searchData.pageSize = size;
            },
            _treeNodeClickHandler(data) {
                this.searchData.nodeId = data.id;
            },
            _editorSetting(id) {
                this.settingModalFlag = true;
                console.log(id);
            },
            _getAllMenu() {
                this.$http.get('/jurisdiction/getAllSystemMenu ').then((res) => {
                    console.log(res);
                });
            },
            _getRoleData() {
                this.$http.get('/role/getAllRole').then((res) => {
                    console.log(res);
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
            }
        },
        components: {}
    };
</script>
