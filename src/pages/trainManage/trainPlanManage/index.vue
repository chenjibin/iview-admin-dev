<template>
    <div class="#dep-grade">
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
                               v-model="filterOpt.postName.value"
                               placeholder="姓名"></Input>
                    </FormItem>
                    <FormItem label="角色">
                        <Select v-model="filterOpt.roleId.value"
                                clearable
                                placeholder="筛选角色"
                                style="width: 100px">
                            <Option value="1">角色1</Option>
                            <Option value="2">角色2</Option>
                        </Select>
                    </FormItem>
                </Form>
                <fs-table-page :columns="postColumns"
                               :size="null"
                               :height="tableHeight"
                               :params="filterOpt"
                               url="/train/ever_plan_datalist"></fs-table-page>
            </Card>
            </Col>
        </Row>
        <Modal v-model="modelFlag" width="900" :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>{{testPeople}}试卷详情</span>
            </p>
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
    import moment from 'moment';
    export default {
        name: 'trainPlanManage',
        data () {
            return {
                modelFlag: false,
                tableHeight: 300,
                exportLoading: false,
                testPeople: '',
                testId: null,
                paperInfo: {
                    name: '',
                    getScore: '',
                    costTime: ''
                },
                questionList: [],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                postColumns: [
                    {
                        title: '时间',
                        key: 'period',
                        align: 'center',
                        width: 160,
                        render: (h, params) => {
                            return moment(params.row.period).format('YYYY-MM-DD');
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
                            return params.row.multiplescore === null ? '-' : params.row.multiplescore;
                        }
                    },
                    {
                        title: '状态',
                        align: 'center',
                        key: 'torfscore',
                        width: 120,
                        render: (h, params) => {
                            return params.row.torfscore === null ? '-' : params.row.torfscore;
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
                        fixed: 'right',
                        align: 'center',
                        width: 80,
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
                    postName: {
                        value: '',
                        type: 'input'
                    },
                    roleId: {
                        value: '',
                        type: 'select'
                    },
                    organizeId: {
                        value: 1,
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
                data.id = this.testId;
                data.pid = 1;
                this.$http.post('/examtest/exportPaperPdf', data).then((res) => {
                    console.log(res)
                    if (res.success) {
                        // this.downloadFile()
                    }
                }).finally(() => {
                    this.exportLoading = false;
                });
            },
            _nodeChangeHandler(data) {
                this.filterOpt.organizeId.value = data.id;
            },
            _checkTest(data) {
                this.modelFlag = true;
            },
            _setTableHeight() {
                let dm = document.body.clientHeight;
                this.tableHeight = dm - 280;
            }
        },
        components: {
            fsTablePage,
            fsDepTree
        }
    };
</script>
