<template>
    <div>
        <Row :gutter="10">
            <Col :span="6">
                <Card>
                    <Input v-model="filterText" size="large" placeholder="快速查找部门"></Input>
                    <el-tree :data="data"
                             ref="treeDom"
                             :filter-node-method="filterNode"
                             style="margin-top: 10px;"
                             :props="defaultProps"></el-tree>
                </Card>
            </Col>
            <Col :span="18">
                <Card>
                    <Form ref="searchData" :model="searchData" inline :label-width="60">
                        <FormItem prop="name" label="姓名">
                            <Input type="text" v-model="searchData.name" placeholder="姓名"></Input>
                        </FormItem>
                        <FormItem prop="startDate" label="开始日期">
                            <DatePicker type="date"
                                        placeholder="开始日期"
                                        :value="searchData.startDate"></DatePicker>
                        </FormItem>
                        <FormItem prop="endDate" label="结束日期">
                            <DatePicker type="date"
                                        placeholder="结束日期"
                                        :value="searchData.endDate"></DatePicker>
                        </FormItem>
                        <FormItem label="指导状态">
                            <Select v-model="searchData.status" clearable>
                                <Option value="1">已指导</Option>
                                <Option value="2">未指导</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="日志类型">
                            <Select v-model="searchData.type" clearable>
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
                searchData: {
                    name: '',
                    startDate: '',
                    endDate: '',
                    status: '',
                    type: ''
                },
                columns1: [
                    {
                        title: '员工姓名',
                        key: 'name',
                        align: 'center',
                        width: 120
                    },
                    {
                        title: '提交日期',
                        key: 'date',
                        width: 120,
                        align: 'center'
                    },
                    {
                        title: '日志内容',
                        key: 'content',
                        ellipsis: true
                    },
                    {
                        title: '指导状态',
                        key: 'status',
                        align: 'center',
                        width: 110
                    },
                    {
                        title: '评级结果',
                        key: 'result',
                        align: 'center',
                        width: 110
                    },
                    {
                        title: '操作',
                        align: 'center',
                        width: 120
                    }
                ],
                data1: [
                    {
                        name: '消炎',
                        date: '2016-10-03',
                        result: '1',
                        status: '1',
                        content: '跟进安通童装活动的微信文案 2:716店铺的日常销售导购工作 3：下午去了风驰体育、步行街耐克、多品店巡店跟进店铺活动，海昌路阿迪券都已发完，还有几个老顾客没来'
                    },
                    {
                        name: '消炎',
                        date: '2016-10-03',
                        result: '1',
                        status: '1',
                        content: '跟进安通童装活动的微信文案 2:716店铺的日常销售导购工作 3：下午去了风驰体育、步行街耐克、多品店巡店跟进店铺活动，海昌路阿迪券都已发完，还有几个老顾客没来'
                    },
                    {
                        name: '消炎',
                        date: '2016-10-03',
                        result: '1',
                        status: '1',
                        content: '跟进安通童装活动的微信文案 2:716店铺的日常销售导购工作 3：下午去了风驰体育、步行街耐克、多品店巡店跟进店铺活动，海昌路阿迪券都已发完，还有几个老顾客没来'
                    },
                    {
                        name: '消炎',
                        date: '2016-10-03',
                        result: '1',
                        status: '1',
                        content: '跟进安通童装活动的微信文案 2:716店铺的日常销售导购工作 3：下午去了风驰体育、步行街耐克、多品店巡店跟进店铺活动，海昌路阿迪券都已发完，还有几个老顾客没来'
                    },
                    {
                        name: '消炎',
                        date: '2016-10-03',
                        result: '1',
                        status: '1',
                        content: '跟进安通童装活动的微信文案 2:716店铺的日常销售导购工作 3：下午去了风驰体育、步行街耐克、多品店巡店跟进店铺活动，海昌路阿迪券都已发完，还有几个老顾客没来'
                    },
                    {
                        name: '消炎',
                        date: '2016-10-03',
                        result: '1',
                        status: '1',
                        content: '跟进安通童装活动的微信文案 2:716店铺的日常销售导购工作 3：下午去了风驰体育、步行街耐克、多品店巡店跟进店铺活动，海昌路阿迪券都已发完，还有几个老顾客没来'
                    },
                    {
                        name: '消炎',
                        date: '2016-10-03',
                        result: '1',
                        status: '1',
                        content: '跟进安通童装活动的微信文案 2:716店铺的日常销售导购工作 3：下午去了风驰体育、步行街耐克、多品店巡店跟进店铺活动，海昌路阿迪券都已发完，还有几个老顾客没来'
                    },
                    {
                        name: '消炎',
                        date: '2016-10-03',
                        result: '1',
                        status: '1',
                        content: '跟进安通童装活动的微信文案 2:716店铺的日常销售导购工作 3：下午去了风驰体育、步行街耐克、多品店巡店跟进店铺活动，海昌路阿迪券都已发完，还有几个老顾客没来'
                    },
                    {
                        name: '消炎',
                        date: '2016-10-03',
                        result: '1',
                        status: '1',
                        content: '跟进安通童装活动的微信文案 2:716店铺的日常销售导购工作 3：下午去了风驰体育、步行街耐克、多品店巡店跟进店铺活动，海昌路阿迪券都已发完，还有几个老顾客没来'
                    },
                    {
                        name: '消炎',
                        date: '2016-10-03',
                        result: '1',
                        status: '1',
                        content: '跟进安通童装活动的微信文案 2:716店铺的日常销售导购工作 3：下午去了风驰体育、步行街耐克、多品店巡店跟进店铺活动，海昌路阿迪券都已发完，还有几个老顾客没来'
                    },
                    {
                        name: '消炎',
                        date: '2016-10-03',
                        result: '1',
                        status: '1',
                        content: '跟进安通童装活动的微信文案 2:716店铺的日常销售导购工作 3：下午去了风驰体育、步行街耐克、多品店巡店跟进店铺活动，海昌路阿迪券都已发完，还有几个老顾客没来'
                    },
                    {
                        name: '消炎',
                        date: '2016-10-03',
                        result: '1',
                        status: '1',
                        content: '跟进安通童装活动的微信文案 2:716店铺的日常销售导购工作 3：下午去了风驰体育、步行街耐克、多品店巡店跟进店铺活动，海昌路阿迪券都已发完，还有几个老顾客没来'
                    },
                    {
                        name: '消炎',
                        date: '2016-10-03',
                        result: '1',
                        status: '1',
                        content: '跟进安通童装活动的微信文案 2:716店铺的日常销售导购工作 3：下午去了风驰体育、步行街耐克、多品店巡店跟进店铺活动，海昌路阿迪券都已发完，还有几个老顾客没来'
                    },
                    {
                        name: '消炎',
                        date: '2016-10-03',
                        result: '1',
                        status: '1',
                        content: '跟进安通童装活动的微信文案 2:716店铺的日常销售导购工作 3：下午去了风驰体育、步行街耐克、多品店巡店跟进店铺活动，海昌路阿迪券都已发完，还有几个老顾客没来'
                    },
                    {
                        name: '消炎',
                        date: '2016-10-03',
                        result: '1',
                        status: '1',
                        content: '跟进安通童装活动的微信文案 2:716店铺的日常销售导购工作 3：下午去了风驰体育、步行街耐克、多品店巡店跟进店铺活动，海昌路阿迪券都已发完，还有几个老顾客没来'
                    },
                    {
                        name: '消炎',
                        date: '2016-10-03',
                        result: '1',
                        status: '1',
                        content: '跟进安通童装活动的微信文案 2:716店铺的日常销售导购工作 3：下午去了风驰体育、步行街耐克、多品店巡店跟进店铺活动，海昌路阿迪券都已发完，还有几个老顾客没来'
                    },
                    {
                        name: '消炎',
                        date: '2016-10-03',
                        result: '1',
                        status: '1',
                        content: '跟进安通童装活动的微信文案 2:716店铺的日常销售导购工作 3：下午去了风驰体育、步行街耐克、多品店巡店跟进店铺活动，海昌路阿迪券都已发完，还有几个老顾客没来'
                    },
                    {
                        name: '消炎',
                        date: '2016-10-03',
                        result: '1',
                        status: '1',
                        content: '跟进安通童装活动的微信文案 2:716店铺的日常销售导购工作 3：下午去了风驰体育、步行街耐克、多品店巡店跟进店铺活动，海昌路阿迪券都已发完，还有几个老顾客没来'
                    },
                    {
                        name: '消炎',
                        date: '2016-10-03',
                        result: '1',
                        status: '1',
                        content: '跟进安通童装活动的微信文案 2:716店铺的日常销售导购工作 3：下午去了风驰体育、步行街耐克、多品店巡店跟进店铺活动，海昌路阿迪券都已发完，还有几个老顾客没来'
                    },
                    {
                        name: '消炎',
                        date: '2016-10-03',
                        result: '1',
                        status: '1',
                        content: '跟进安通童装活动的微信文案 2:716店铺的日常销售导购工作 3：下午去了风驰体育、步行街耐克、多品店巡店跟进店铺活动，海昌路阿迪券都已发完，还有几个老顾客没来'
                    },
                    {
                        name: '消炎',
                        date: '2016-10-03',
                        result: '1',
                        status: '1',
                        content: '跟进安通童装活动的微信文案 2:716店铺的日常销售导购工作 3：下午去了风驰体育、步行街耐克、多品店巡店跟进店铺活动，海昌路阿迪券都已发完，还有几个老顾客没来'
                    },
                    {
                        name: '消炎',
                        date: '2016-10-03',
                        result: '1',
                        status: '1',
                        content: '跟进安通童装活动的微信文案 2:716店铺的日常销售导购工作 3：下午去了风驰体育、步行街耐克、多品店巡店跟进店铺活动，海昌路阿迪券都已发完，还有几个老顾客没来'
                    },
                    {
                        name: '消炎',
                        date: '2016-10-03',
                        result: '1',
                        status: '1',
                        content: '跟进安通童装活动的微信文案 2:716店铺的日常销售导购工作 3：下午去了风驰体育、步行街耐克、多品店巡店跟进店铺活动，海昌路阿迪券都已发完，还有几个老顾客没来'
                    },
                    {
                        name: '消炎',
                        date: '2016-10-03',
                        result: '1',
                        status: '1',
                        content: '跟进安通童装活动的微信文案 2:716店铺的日常销售导购工作 3：下午去了风驰体育、步行街耐克、多品店巡店跟进店铺活动，海昌路阿迪券都已发完，还有几个老顾客没来'
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
            }
        },
        components: {}
    };
</script>
