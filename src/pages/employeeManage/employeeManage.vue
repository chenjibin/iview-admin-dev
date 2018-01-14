<template>
    <div id="employee-manage">
        <Row :gutter="10">
            <Col :span="5">
                <Card>
                    <Input v-model="filterText" size="large" placeholder="快速查找部门"></Input>
                    <el-tree :data="orgTreeData"
                             ref="treeDom"
                             :filter-node-method="filterNode"
                             style="margin-top: 10px;"
                             :props="defaultProps"></el-tree>
                </Card>
            </Col>
            <Col :span="19">
                <Card>
                    <Form ref="searchData" :model="searchData" inline :label-width="60">
                        <FormItem prop="name" label="姓名">
                            <Input type="text" v-model="searchData.name" placeholder="姓名"></Input>
                        </FormItem>
                        <FormItem prop="name" label="岗位">
                            <Input type="text" v-model="searchData.post" placeholder="岗位"></Input>
                        </FormItem>

                        <FormItem label="角色">
                            <Select v-model="searchData.role" clearable>
                                <Option value="1">已指导</Option>
                                <Option value="2">未指导</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="状态">
                            <Select v-model="searchData.status" clearable>
                                <Option value="1">休息</Option>
                                <Option value="0">出勤</Option>
                            </Select>
                        </FormItem>
                    </Form>
                    <Table :columns="columns1"
                           :loading="tableLoading"
                           height="700"
                           :data="data1"></Table>
                    <Page :total="100" show-sizer show-elevator style="margin-top: 16px;"></Page>
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
                <FormItem label="状态">
                    <i-switch v-model="userSettingForm.status" size="large">
                        <span slot="open">启用</span>
                        <span slot="close">禁用</span>
                    </i-switch>
                </FormItem>
                <FormItem label="是否写日志">
                    <i-switch v-model="userSettingForm.isLog" size="large">
                        <span slot="open">写</span>
                        <span slot="close">不写</span>
                    </i-switch>
                </FormItem>
                <Row>
                    <Col :span="12">
                        <FormItem label="账号">
                            <Input v-model="userSettingForm.account" disabled></Input>
                        </FormItem>
                    </Col>
                    <Col :span="12">
                        <FormItem label="姓名">
                            <Input v-model="userSettingForm.name" placeholder="Enter something..."></Input>
                        </FormItem>
                    </Col>
                </Row>
                <FormItem label="性别">
                    <RadioGroup v-model="userSettingForm.sex">
                        <Radio label="女">女</Radio>
                        <Radio label="男">男</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="入职时间">
                    <DatePicker type="date" placeholder="Select date" v-model="userSettingForm.inJobTime"></DatePicker>
                </FormItem>
                <Row>
                    <Col :span="8">
                        <FormItem label="角色">
                            <Select v-model="userSettingForm.role">
                                <Option value="beijing">New York</Option>
                                <Option value="shanghai">London</Option>
                                <Option value="shenzhen">Sydney</Option>
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
    #employee-manage {
    }
</style>
<script>
    export default {
        name: 'employeeManage',
        watch: {
            filterText(val) {
                this.$refs.treeDom.filter(val);
            }
        },
        data () {
            return {
                settingModalFlag: true,
                tableLoading: false,
                userSettingForm: {
                    status: true,
                    account: 'chenjibin',
                    name: '',
                    sex: '女',
                    inJobTime: '2017-01-01',
                    role: '',
                    dep: '',
                    post: '',
                    guider: [],
                    level: '',
                    vUp: '',
                    money: '',
                    coin: '',
                    isLog: true
                },
                searchData: {
                    name: '',
                    post: '',
                    status: '',
                    role: ''
                },
                columns1: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '姓名',
                        key: 'name',
                        align: 'center',
                        width: 100
                    },
                    {
                        title: '部门',
                        key: 'dep',
                        align: 'center'
                    },
                    {
                        title: '岗位',
                        key: 'post',
                        align: 'center'
                    },
                    {
                        title: '角色',
                        key: 'role',
                        align: 'center',
                        width: 120
                    },
                    {
                        title: '天马金币',
                        key: 'coin',
                        align: 'center',
                        width: 100
                    },
                    {
                        title: '入职时间',
                        key: 'date',
                        width: 120,
                        align: 'center'
                    },
                    {
                        title: '状态',
                        key: 'status',
                        align: 'center',
                        width: 100,
                        render: (h, params) => {
                            return h('Tag', {
                                props: {
                                    type: 'border',
                                    color: +params.row.status === 1 ? 'green' : 'red'
                                }
                            }, +params.row.status === 1 ? '启用' : '禁用');
                        }
                    },
                    {
                        title: '班次',
                        key: 'banci',
                        width: 100,
                        ellipsis: true
                    },
                    {
                        title: '是否写日志',
                        key: 'isLog',
                        align: 'center',
                        width: 110
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
                                                vm._editorSetting(params.row.status);
                                            }
                                        }
                                    })
                                ])
                            ]);
                        }
                    }
                ],
                data1: [
                    {
                        name: '消炎',
                        date: '2016-10-03',
                        result: '1',
                        status: '0',
                        dep: '淘宝分销部',
                        post: '淘宝分销主管',
                        role: '中层干部',
                        coin: '60',
                        banci: '1,2,3',
                        isLog: '是'
                    },
                    {
                        name: '消炎',
                        date: '2016-10-03',
                        result: '1',
                        status: '1',
                        dep: '淘宝分销部',
                        post: '京东平台运营总监',
                        role: '中层干部',
                        coin: '60',
                        banci: '1,2,3',
                        isLog: '是'
                    },
                    {
                        name: '消炎',
                        date: '2016-10-03',
                        result: '1',
                        status: '1',
                        dep: '淘宝分销部',
                        post: '淘宝分销主管',
                        role: '中层干部',
                        coin: '60',
                        banci: '1,2,3',
                        isLog: '是'
                    },
                    {
                        name: '消炎',
                        date: '2016-10-03',
                        result: '1',
                        status: '1',
                        dep: '淘宝分销部',
                        post: '淘宝分销主管',
                        role: '中层干部',
                        coin: '60',
                        banci: '1,2,3',
                        isLog: '是'
                    },
                    {
                        name: '消炎',
                        date: '2016-10-03',
                        result: '1',
                        status: '1',
                        dep: '淘宝分销部',
                        post: '淘宝分销主管',
                        role: '中层干部',
                        coin: '60',
                        banci: '1,2,3',
                        isLog: '是'
                    },
                    {
                        name: '消炎',
                        date: '2016-10-03',
                        result: '1',
                        status: '1',
                        dep: '淘宝分销部',
                        post: '淘宝分销主管',
                        role: '中层干部',
                        coin: '60',
                        banci: '1,2,3',
                        isLog: '是'
                    },
                    {
                        name: '消炎',
                        date: '2016-10-03',
                        result: '1',
                        status: '1',
                        dep: '淘宝分销部',
                        post: '淘宝分销主管',
                        role: '中层干部',
                        coin: '60',
                        banci: '1,2,3',
                        isLog: '是'
                    },
                    {
                        name: '消炎',
                        date: '2016-10-03',
                        result: '1',
                        status: '1',
                        dep: '淘宝分销部',
                        post: '淘宝分销主管',
                        role: '中层干部',
                        coin: '60',
                        banci: '1,2,3',
                        isLog: '是'
                    },
                    {
                        name: '消炎',
                        date: '2016-10-03',
                        result: '1',
                        status: '1',
                        dep: '淘宝分销部',
                        post: '淘宝分销主管',
                        role: '中层干部',
                        coin: '60',
                        banci: '1,2,3',
                        isLog: '是'
                    },
                    {
                        name: '消炎',
                        date: '2016-10-03',
                        result: '1',
                        status: '1',
                        dep: '淘宝分销部',
                        post: '淘宝分销主管',
                        role: '中层干部',
                        coin: '60',
                        banci: '1,2,3',
                        isLog: '是'
                    },
                    {
                        name: '消炎',
                        date: '2016-10-03',
                        result: '1',
                        status: '1',
                        dep: '淘宝分销部',
                        post: '淘宝分销主管',
                        role: '中层干部',
                        coin: '60',
                        banci: '1,2,3',
                        isLog: '是'
                    },
                    {
                        name: '消炎',
                        date: '2016-10-03',
                        result: '1',
                        status: '1',
                        dep: '淘宝分销部',
                        post: '淘宝分销主管',
                        role: '中层干部',
                        coin: '60',
                        banci: '1,2,3',
                        isLog: '是'
                    },
                    {
                        name: '消炎',
                        date: '2016-10-03',
                        result: '1',
                        status: '1',
                        dep: '淘宝分销部',
                        post: '淘宝分销主管',
                        role: '中层干部',
                        coin: '60',
                        banci: '1,2,3',
                        isLog: '是'
                    },
                    {
                        name: '消炎',
                        date: '2016-10-03',
                        result: '1',
                        status: '1',
                        dep: '淘宝分销部',
                        post: '淘宝分销主管',
                        role: '中层干部',
                        coin: '60',
                        banci: '1,2,3',
                        isLog: '是'
                    },
                    {
                        name: '消炎',
                        date: '2016-10-03',
                        result: '1',
                        status: '1',
                        dep: '淘宝分销部',
                        post: '淘宝分销主管',
                        role: '中层干部',
                        coin: '60',
                        banci: '1,2,3',
                        isLog: '是'
                    },
                    {
                        name: '消炎',
                        date: '2016-10-03',
                        result: '1',
                        status: '1',
                        dep: '淘宝分销部',
                        post: '淘宝分销主管',
                        role: '中层干部',
                        coin: '60',
                        banci: '1,2,3',
                        isLog: '是'
                    },
                    {
                        name: '消炎',
                        date: '2016-10-03',
                        result: '1',
                        status: '1',
                        dep: '淘宝分销部',
                        post: '淘宝分销主管',
                        role: '中层干部',
                        coin: '60',
                        banci: '1,2,3',
                        isLog: '是'
                    },
                    {
                        name: '消炎',
                        date: '2016-10-03',
                        result: '1',
                        status: '1',
                        dep: '淘宝分销部',
                        post: '淘宝分销主管',
                        role: '中层干部',
                        coin: '60',
                        banci: '1,2,3',
                        isLog: '是'
                    },
                    {
                        name: '消炎',
                        date: '2016-10-03',
                        result: '1',
                        status: '1',
                        dep: '淘宝分销部',
                        post: '淘宝分销主管',
                        role: '中层干部',
                        coin: '60',
                        banci: '1,2,3',
                        isLog: '是'
                    },
                    {
                        name: '消炎',
                        date: '2016-10-03',
                        result: '1',
                        status: '1',
                        dep: '淘宝分销部',
                        post: '淘宝分销主管',
                        role: '中层干部',
                        coin: '60',
                        banci: '1,2,3',
                        isLog: '是'
                    },
                    {
                        name: '消炎',
                        date: '2016-10-03',
                        result: '1',
                        status: '1',
                        dep: '淘宝分销部',
                        post: '淘宝分销主管',
                        role: '中层干部',
                        coin: '60',
                        banci: '1,2,3',
                        isLog: '是'
                    },
                    {
                        name: '消炎',
                        date: '2016-10-03',
                        result: '1',
                        status: '1',
                        dep: '淘宝分销部',
                        post: '淘宝分销主管',
                        role: '中层干部',
                        coin: '60',
                        banci: '1,2,3',
                        isLog: '是'
                    },
                    {
                        name: '消炎',
                        date: '2016-10-03',
                        result: '1',
                        status: '1',
                        dep: '淘宝分销部',
                        post: '淘宝分销主管',
                        role: '中层干部',
                        coin: '60',
                        banci: '1,2,3',
                        isLog: '是'
                    },
                    {
                        name: '消炎',
                        date: '2016-10-03',
                        result: '1',
                        status: '1',
                        dep: '淘宝分销部',
                        post: '淘宝分销主管',
                        role: '中层干部',
                        coin: '60',
                        banci: '1,2,3',
                        isLog: '是'
                    },
                    {
                        name: '消炎',
                        date: '2016-10-03',
                        result: '1',
                        status: '1',
                        dep: '淘宝分销部',
                        post: '淘宝分销主管',
                        role: '中层干部',
                        coin: '60',
                        banci: '1,2,3',
                        isLog: '是'
                    }
                ],
                orgTreeData: [],
                data: [{
                    label: '一级 1',
                    children: [{
                        label: '二级 1-1',
                        children: [{
                            label: '三级 1-1-1'
                        }]
                    }]
                }, {
                    label: '一级 2',
                    children: [{
                        label: '二级 2-1',
                        children: [{
                            label: '三级 2-1-1'
                        }]
                    }, {
                        label: '二级 2-2',
                        children: [{
                            label: '三级 2-2-1'
                        }]
                    }]
                }, {
                    label: '一级 3',
                    children: [{
                        label: '二级 3-1',
                        children: [{
                            label: '三级 3-1-1'
                        }]
                    }, {
                        label: '二级 3-2',
                        children: [{
                            label: '三级 3-2-1'
                        }]
                    }]
                }],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                filterText: ''
            };
        },
        created() {
            this._getAllMenu();
            this._getOrgTree();
        },
        methods: {
            filterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
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
            _getOrgTree() {
                this.$http.get('/organize/organizeTree?fatherId=-1').then((res) => {
                    if (res.success) {
                        this.orgTreeData = res.date
                    }
                });
            }
        },
        components: {}
    };
</script>
