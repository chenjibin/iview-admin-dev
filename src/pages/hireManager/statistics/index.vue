<template>
    <div id="statistics">
        <Row :gutter="0">
            <Col :span="24">
                <Card>
                    <Form inline :label-width="60" style="height: 30px">
                        <FormItem label="统计时间" style="margin-bottom: 0px">
                            <DatePicker format="yyyy-MM-dd" type="daterange" style="width: 173px"
                                        @on-change="_monthDateChange('startdate',$event)"
                                        :value="startdate"
                                        placeholder="预约时间"></DatePicker>
                        </FormItem>
                        <FormItem style="margin-bottom: 0px;float: right;">
                            <Button type="primary" @click="exportData">
                                <Icon type="ios-download-outline" style="font-size: 18px"></Icon>
                                <span>岗位</span>
                            </Button>
                        </FormItem>
                    </Form>
                </Card>
            </Col>
        </Row>
        <Row :gutter="16" style="margin-top: 5px">
            <Col :span="12">
                <Card>
                    <div style="width:100%;height:300px;" id="data_source1"></div>
                </Card>
            </Col>
            <Col :span="12">
                <Card>
                    <div style="width:100%;height:300px;" id="data_source2"></div>
                </Card>
            </Col>
        </Row>
        <Card style="margin-top: 5px">
            <fs-table-page ref="tpage" :columns="postColumns"
                           :size="null"
                           :height="tableHeight"
                           :params="filterOpt"
                           url="/talentLibrary/statisticsPost"></fs-table-page>
        </Card>
    </div>
</template>

<script>
    import echarts from 'echarts/lib/echarts';
    import funnel from 'echarts/lib/chart/funnel';
    import tooltip from 'echarts/lib/component/tooltip';
    import legendScroll from 'echarts/lib/component/legendScroll';
    import title from 'echarts/lib/component/title';
    import pie from 'echarts/lib/chart/pie';
    import fsTablePage from '@/baseComponents/fs-table-page';
    export default {
        name: 'statistics',
        components: {fsTablePage},
        data() {
            return {
                tableHeight: 500,
                startdate: [],
                filterOpt: {
                    startTimes: {
                        value : ''
                    },
                    endTimes: {
                        value : ''
                    }
                },
                postColumns: [
                    {
                        title: '岗位名称',
                        key: 'postname',
                        align: 'center'
                    },
                    {
                        title: '面试人数',
                        key: 'interview_num',
                        align: 'center'
                    },
                    {
                        title: '面试合格人数',
                        key: 'interview_pass_num',
                        align: 'center'
                    },
                    {
                        title: '合格率',
                        key: 'interview_pass_account',
                        align: 'center'
                    },
                    {
                        title: '试用人数',
                        key: 'test_num',
                        align: 'center'
                    },
                    {
                        title: '参与试用率',
                        key: 'test_account',
                        align: 'center'
                    },
                    {
                        title: '试用通过数',
                        key: 'test_pass_num',
                        align: 'center'
                    },
                    {
                        title: '试用通过率',
                        key: 'test_pass_account',
                        align: 'center'
                    }
                ],
                dataSourcePie: '',
                dataSourcePie2: '',
                dataSourcePieData: {
                    legendData: [],
                    seriesData: [],
                    selected: {}
                },
                dataSourcePie2Data: {
                    legendData: [],
                    seriesData: [],
                    selected: {}
                },
                option: {
                    title: {
                        text: '各状态统计占比',
                        subtext: '',
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c}人 ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        right: 'right',
                        data: ['状态1', '状态2'],
                        selected: {}
                    },
                    series: [
                        {
                            name: '状态',
                            type: 'pie',
                            radius : '55%',
                            center: ['40%', '50%'],
                            data: [
                                {name: '状态1', value: 40},
                                {name: '状态2', value: 60}
                            ],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                },
                option2: {
                    title: {
                        text: '简历来源占比',
                        subtext: '',
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c}份 ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        right: 'right',
                        data: ['来源1', '来源2', '来源3'],
                        selected: {}
                    },
                    series: [
                        {
                            name: '来源',
                            type: 'pie',
                            radius : '55%',
                            center: ['40%', '50%'],
                            data: [
                                {name: '来源1', value: Math.round(Math.random() * 100000)},
                                {name: '来源2', value: Math.round(Math.random() * 100000)},
                                {name: '来源3', value: Math.round(Math.random() * 100000)},
                            ],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                },
                nameMapping: {
                    invite_num: '预约',
                    notcome_num: '预约未到达',
                    interview_num: '面试',
                    interview_pass_num: '面试通过',
                    interview_no_passnum: '面试不通过',
                    interview_wait_num: '面试待选',
                    test_num: '试岗',
                    test_pass_num: '试岗通过',
                    test_no_passnum: '试岗不通过'
                }
            };
        },
        created() {
            this._setTableHeight();
        },
        methods: {
            getData() {
                var vm = this;
                vm.dataSourcePieData.legendData = [];
                vm.dataSourcePie2Data.legendData = [];
                vm.dataSourcePieData.seriesData = [];
                vm.dataSourcePie2Data.seriesData = [];
                var d = {};
                d.startTimes = this.filterOpt.startTimes.value;
                d.endTimes = this.filterOpt.endTimes.value;
                this.$http.post('/talentLibrary/statisticsDate', d).then((res) => {
                    if (res.success) {
                        var d = res.data;
                        vm.dataSourcePieData.selected['interview_wait_num'] = true;
                        vm.dataSourcePieData.selected['interview_no_passnum'] = true;
                        vm.dataSourcePieData.selected['interview_pass_num'] = true;
                        for (let key in d) {
                            var nameStr = vm.nameMapping[key];
                            vm.dataSourcePieData.legendData.push(nameStr);
                            vm.dataSourcePieData.selected[nameStr] = ['interview_wait_num', 'interview_no_passnum', 'interview_pass_num'].some((item) => item === key);
                            vm.dataSourcePieData.seriesData.push({
                                name: nameStr,
                                value: d[key]
                            });
                        }
                        vm.option.legend.data = vm.dataSourcePieData.legendData;
                        vm.option.legend.selected = vm.dataSourcePieData.selected;
                        vm.option.series[0].data = vm.dataSourcePieData.seriesData;
                        vm.dataSourcePie.setOption(vm.option);
                    }
                });
                this.$http.post('/talentLibrary/sourceData', d).then((res) =>{
                    if (res.success) {
                        var d = res.data;
                        for (let key in d) {
                            vm.dataSourcePie2Data.legendData.push(key);
                            vm.dataSourcePie2Data.selected[key] = true;
                            vm.dataSourcePie2Data.seriesData.push({
                                name: key,
                                value: d[key]
                            });
                        }
                        vm.option2.legend.data = vm.dataSourcePie2Data.legendData;
                        vm.option2.legend.selected = vm.dataSourcePie2Data.selected;
                        vm.option2.series[0].data = vm.dataSourcePie2Data.seriesData;
                        vm.dataSourcePie2.setOption(vm.option2);
                    }
                });
            },
            _monthDateChange (key, value) {
                this[key] = value;
                this.filterOpt.startTimes.value = value[0];
                this.filterOpt.endTimes.value = value[1];
                this.getData();
            },
            exportData() {
                var d = {};
                d.startTimes = this.filterOpt.startTimes.value;
                d.endTimes = this.filterOpt.endTimes.value;
                this.$http.post('/talentLibrary/exportTalent', d).then((res) => {
                    if (res.success) {
                        let downloadDom = document.createElement('a');
                        downloadDom.href = '/oa' + res.path;
                        downloadDom.download = res.filename;
                        downloadDom.click();
                    }
                });
            },
            _setTableHeight () {
                let dm = document.body.clientHeight;
                let headH = 100;
                let CardAllMargin = 20;
                let searchForm = 64;
                let pieHeight = 354;
                let tablePadding = 32;
                let pageHeight = 49;
                this.tableHeight = dm - headH - CardAllMargin - searchForm - pieHeight - tablePadding - pageHeight;
            }
        },
        mounted () {
            this.$nextTick(() => {
                var dataSourcePie = echarts.init(document.getElementById('data_source1'));
                var dataSourcePie2 = echarts.init(document.getElementById('data_source2'));
                this.dataSourcePie = dataSourcePie;
                this.dataSourcePie2 = dataSourcePie2;
                dataSourcePie.setOption(this.option);
                dataSourcePie2.setOption(this.option2);
                window.addEventListener('resize', function () {
                    dataSourcePie.resize();
                    dataSourcePie2.resize();
                });
            });
        }
    };
</script>

<style scoped>

</style>
