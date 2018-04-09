<template>
    <div>
        <Row :gutter="16">
            <Col :xs="24" :sm="24" :md="14" :lg="16">
                <Card :dis-hover="true">
                    <h3 style="margin-bottom: 16px">我的成绩</h3>
                    <fs-table-page :columns="postColumns"
                                   :height="tableHeight"
                                   ref="myGradeList"
                                   url="/examtest/queryScoreList"></fs-table-page>
                </Card>
            </Col>
            <Col :xs="24" :sm="24" :md="10" :lg="8">
                <Card :dis-hover="true">
                    <h3 style="margin-bottom: 16px;">我的考试</h3>
                    <div>
                        <Card v-for="item, index in myTestList" :key="'my-test-' + index">
                            <div class="">
                                <strong style="font-size: 16px;">{{item.name}}</strong>
                                <div class="">
                                    <span>考试时间：</span><span>{{item.starttime}}</span>
                                    <span style="margin-left: 8px;">考试时长：</span><span>{{item.totletime}}分钟</span>
                                </div>
                                <Button type="primary" style="margin-top: 8px;" @click="_startTest(item)">开始考试</Button>
                            </div>
                        </Card>
                    </div>

                </Card>
            </Col>
        </Row>
        <Modal v-model="modelFlag" width="1200" :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>试卷详情</span>
            </p>
            <test-result :id="testCheckId"></test-result>
            <div slot="footer">
                <Button type="primary" :loading="exportLoading" icon="ios-cloud-download-outline" @click="_exportGrade">
                    <span v-if="!exportLoading">导出试卷</span>
                    <span v-else>导出中...</span>
                </Button>
                <Button type="ghost" style="margin-left: 8px" @click="modelFlag = false">取消</Button>
            </div>
        </Modal>
        <Modal v-model="inExamFlag" width="1200" :mask-closable="false" :closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>考试中</span>
            </p>
            <in-exam :id="testPaperId"
                     :paper-id="testId"
                     @submit-paper-success="_submitSuccessHandler"></in-exam>
            <div slot="footer">
            </div>
        </Modal>
    </div>
</template>
<style>

</style>
<script>
    import fsTablePage from '@/baseComponents/fs-table-page';
    import testResult from '../examination/components/test-result';
    import inExam from './in-exam';
    import utils from '@/libs/util.js';
    export default {
        name: 'myExam',
        data () {
            return {
                modelFlag: false,
                exportLoading: false,
                inExamFlag: false,
                tableHeight: 300,
                testCheckId: 0,
                testId: 0,
                testPaperId: 0,
                postColumns: [
                    {
                        title: '考试名称',
                        key: 'name'
                    },
                    {
                        title: '总成绩',
                        align: 'center',
                        key: 'score',
                        width: 80
                    },
                    {
                        title: '单选',
                        align: 'center',
                        key: 'singlescore',
                        width: 80,
                        render: (h, params) => {
                            return h('span', params.row.singlescore || 0);
                        }
                    },
                    {
                        title: '多选',
                        align: 'center',
                        key: 'multiplescore',
                        width: 80,
                        render: (h, params) => {
                            return h('span', params.row.multiplescore || 0);
                        }
                    },
                    {
                        title: '判断',
                        align: 'center',
                        key: 'torfscore',
                        width: 80,
                        render: (h, params) => {
                            return h('span', params.row.torfscore || 0);
                        }
                    },
                    {
                        title: '填空',
                        align: 'center',
                        key: 'fillscore',
                        width: 80,
                        render: (h, params) => {
                            return h('span', params.row.fillscore || 0);
                        }
                    },
                    {
                        title: '问答',
                        align: 'center',
                        key: 'qandascore',
                        width: 80,
                        render: (h, params) => {
                            return h('span', params.row.qandascore || 0);
                        }
                    },
                    {
                        title: '用时',
                        align: 'center',
                        width: 80,
                        key: 'totletime'
                    },
                    {
                        title: '排名',
                        align: 'center',
                        width: 80,
                        key: 'ranking'
                    },
                    {
                        title: '总人数',
                        align: 'center',
                        width: 80,
                        key: 'sumstu'
                    },
                    {
                        title: '操作',
                        width: 80,
                        render: (h, params) => {
                            let vm = this;
                            return h('div', [
                                h('Tooltip', {
                                    props: {
                                        content: '查看试卷',
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
                                            click: function() {
                                                vm._checkTest(params.row);
                                            }
                                        }
                                    })
                                ])
                            ]);
                        }
                    }
                ],
                myTestList: []
            };
        },
        created() {
            this._setTableHeight();
            this._getMyTestList();
        },
        methods: {
            _submitSuccessHandler() {
                this.$refs.myGradeList.getListData();
                this._getMyTestList();
                this.inExamFlag = false;
            },
            _startTest(data) {
                let sendData = {};
                sendData.id = data.id;
                console.log(data);
                this.$http.post('/examtest/startTime', sendData).then((res) => {
                    if (res.success) {
                        this.testPaperId = data.paperid;
                        this.testId = data.id;
                        this.inExamFlag = true;
                    }
                });
            },
            _setTableHeight() {
                let dm = document.body.clientHeight;
                this.tableHeight = dm - 250;
            },
            _checkTest(data) {
                this.testCheckId = data.id;
                this.modelFlag = true;
            },
            _exportGrade() {
                this.exportLoading = true;
                let data = {};
                data.id = this.testCheckId;
                data.pid = 1;
                this.$http.post('/examtest/exportPaperPdf', data).then((res) => {
                    if (res.success) {
                        utils.downloadFile('/oa/download/' + res.data, res.data);
                    }
                }).finally(() => {
                    this.exportLoading = false;
                });
            },
            _getMyTestList() {
                let data = {};
                data.page = 1;
                data.pageSize = 1000;
                this.$http.get('/examtest/getTestList', {params: data}).then((res) => {
                    if (res.success) {
                        this.myTestList = res.data;
                    }
                });
            }
        },
        components: {
            fsTablePage,
            testResult,
            inExam
        }
    };
</script>
