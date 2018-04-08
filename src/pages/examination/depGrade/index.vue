<template>
    <div class="#dep-grade">
        <Row :gutter="10">
            <Col :span="4">
                <fs-dep-tree url="/organize/organizeTreeByUserForRiZhi"
                             @node-change="_nodeChangeHandler($event)"
                             :defaultProps="defaultProps"></fs-dep-tree>
            </Col>
            <Col :span="20">
                <Card>
                    <Form inline :label-width="60">
                        <FormItem label="试卷名称">
                            <Input type="text"
                                   v-model="filterOpt.name.value"
                                   placeholder="姓名"></Input>
                        </FormItem>
                        <FormItem label="考生名称">
                            <Input type="text"
                                   v-model="filterOpt.userName.value"
                                   placeholder="姓名"></Input>
                        </FormItem>
                    </Form>
                    <fs-table-page :columns="postColumns"
                                   :size="null"
                                   :height="tableHeight"
                                   :params="filterOpt"
                                   url="/examtest/depDataScore"></fs-table-page>
                </Card>
            </Col>
        </Row>
        <Modal v-model="modelFlag" width="900" :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>{{testPeople}}试卷详情</span>
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
    </div>
</template>
<style>

</style>
<script>
    import fsTablePage from '@/baseComponents/fs-table-page';
    import fsDepTree from '@/baseComponents/fs-dep-tree';
    import testResult from '../components/test-result';
    import utils from '@/libs/util.js';
    export default {
        name: 'depGrade',
        data () {
            return {
                modelFlag: false,
                tableHeight: 300,
                exportLoading: false,
                testPeople: '',
                testId: null,
                testCheckId: 0,
                defaultProps: {
                    children: 'children',
                    label: 'text'
                },
                postColumns: [
                    {
                        title: '试卷名称',
                        fixed: 'left',
                        key: 'name',
                        width: 200
                    },
                    {
                        title: '考生名称',
                        key: 'stuname',
                        fixed: 'left',
                        align: 'center',
                        width: 100
                    },
                    {
                        title: '总成绩',
                        align: 'center',
                        fixed: 'left',
                        key: 'score',
                        width: 80
                    },
                    {
                        title: '单选成绩',
                        align: 'center',
                        key: 'singlescore',
                        width: 120,
                        render: (h, params) => {
                            return h('span', params.row.singlescore === null ? 0 : params.row.singlescore);
                        }
                    },
                    {
                        title: '多选成绩',
                        align: 'center',
                        key: 'multiplescore',
                        width: 120,
                        render: (h, params) => {
                            return h('span', params.row.multiplescore === null ? 0 : params.row.multiplescore);
                        }
                    },
                    {
                        title: '判断成绩',
                        align: 'center',
                        key: 'torfscore',
                        width: 120,
                        render: (h, params) => {
                            return h('span', params.row.torfscore === null ? 0 : params.row.torfscore);
                        }
                    },
                    {
                        title: '填空成绩',
                        align: 'center',
                        key: 'fillscore',
                        width: 120,
                        render: (h, params) => {
                            return h('span', params.row.fillscore === null ? 0 : params.row.fillscore);
                        }
                    },
                    {
                        title: '问答成绩',
                        align: 'center',
                        key: 'qandascore',
                        width: 120,
                        render: (h, params) => {
                            return h('span', params.row.qandascore === null ? 0 : params.row.qandascore);
                        }
                    },
                    {
                        title: '用时(分钟)',
                        align: 'center',
                        key: 'totletime',
                        width: 120
                    },
                    {
                        title: '排名',
                        align: 'center',
                        key: 'ranking',
                        width: 120
                    },
                    {
                        title: '总人数',
                        align: 'center',
                        key: 'sumstu',
                        width: 120
                    },
                    {
                        title: '考试日期',
                        align: 'center',
                        key: 'createbydate',
                        width: 200
                    },
                    {
                        title: '操作',
                        fixed: 'right',
                        align: 'center',
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
                filterOpt: {
                    userName: {
                        value: '',
                        type: 'input'
                    },
                    name: {
                        value: '',
                        type: 'input'
                    },
                    organizeId: {
                        value: '',
                        type: 'tree'
                    }
                }
            };
        },
        created() {
            this._setTableHeight();
        },
        methods: {
            downloadFile(url, name) {
                let downloadDom = document.createElement('a');
                downloadDom.href = url;
                downloadDom.download = name;
                downloadDom.click();
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
            _nodeChangeHandler(data) {
                this.filterOpt.organizeId.value = data.id;
            },
            _checkTest(data) {
                this.testCheckId = data.id;
                this.modelFlag = true;
            },
            _setTableHeight() {
                let dm = document.body.clientHeight;
                this.tableHeight = dm - 280;
            }
        },
        components: {
            fsTablePage,
            fsDepTree,
            testResult
        }
    };
</script>
