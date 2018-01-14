<template>
    <div>
        <Row :gutter="10">
            <Col :span="5">
            <Card>
                <Input v-model="filterText" size="large" placeholder="快速查找部门"></Input>
                <el-tree :data="data"
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
    </div>
</template>
<style>

</style>
<script>
    export default {
        name: 'logManage',
        watch: {
            filterText(val) {
                this.$refs.treeDom.filter(val);
            }
        },
        data () {
            return {
                tableLoading: false,
                searchData: {
                    name: '',
                    post: '',
                    status: '',
                    role: '',
                    type: ''
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
                        width: 60
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
                    label: 'label'
                },
                filterText: ''
            };
        },
        methods: {
            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },
            _editorSetting(id) {
                console.log(id);
            }
        },
        components: {}
    };
</script>
