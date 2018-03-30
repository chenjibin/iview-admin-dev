<template>
    <div>
        <Card style="overflow: hidden;">
            <div class="" v-show="isTestList">
                <Form inline :label-width="60">
                    <FormItem label="考试名称">
                        <Input type="text"
                               v-model="filterOpt.name.value"
                               placeholder="筛选考试名称"></Input>
                    </FormItem>
                </Form>
                <fs-table-page :columns="postColumns"
                               :size="null"
                               :height="tableHeight"
                               :params="filterOpt"
                               ref="peopleCheck"
                               url="/examtestpaper/getTestPaperList"></fs-table-page>
            </div>
            <div class="" v-show="!isTestList">
                <Form inline :label-width="0.1">
                    <FormItem>
                        <Button @click="isTestList = true" icon="arrow-left-a" type="primary">返回考试列表</Button>
                    </FormItem>
                </Form>
                <fs-table-page :columns="paperColumns"
                               :size="null"
                               :height="tableHeight"
                               :params="paperFilter"
                               ref="testPaperTable"
                               url="/examtest/getScoreManageList"></fs-table-page>
            </div>
        </Card>
        <Modal v-model="inExamFlag" width="1200" :mask-closable="false" :closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>手工阅卷</span>
            </p>
            <exam-check :id="testId"></exam-check>
            <div slot="footer">
                <Button type="ghost" style="margin-left: 8px" @click="_completeCheck">完成阅卷</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import fsTablePage from '@/baseComponents/fs-table-page';
    import examCheck from './exam-check';
    export default {
        name: 'peopleCheck',
        data () {
            const colBtn = (vm, h, params, {content, icon, foo}) => {
                return h('Tooltip', {
                    props: {
                        content: content,
                        placement: 'top',
                        transfer: true
                    }
                }, [
                    h('Button', {
                        props: {
                            type: 'primary',
                            icon: icon,
                            shape: 'circle'
                        },
                        style: {
                            margin: '0 2px'
                        },
                        on: {
                            click: function () {
                                foo(params.row);
                            }
                        }
                    })
                ]);
            };
            return {
                inExamFlag: false,
                isTestList: true,
                testId: 0,
                filterOpt: {
                    name: {
                        value: '',
                        type: 'input'
                    },
                    status: {
                        value: 3,
                        type: 'select'
                    }
                },
                paperFilter: {
                    pid: {
                        value: 0,
                        type: 'select'
                    }
                },
                editorSettingData: {
                    name: '',
                    type: '',
                    price: '',
                    isDown: '',
                    month: ''
                },
                postColumns: [
                    {
                        title: '考试名称',
                        key: 'name'
                    },
                    {
                        title: '试卷名称',
                        key: 'papername'
                    },
                    {
                        title: '考试时间',
                        key: 'starttime',
                        align: 'center',
                        width: 160
                    },
                    {
                        title: '考试时长',
                        key: 'totletime',
                        align: 'center',
                        width: 160
                    },
                    {
                        title: '总分',
                        key: 'totlemark',
                        align: 'center',
                        width: 120
                    },
                    {
                        title: '结束时间',
                        key: 'modifybydate',
                        align: 'center',
                        width: 200
                    },
                    {
                        title: '操作',
                        key: 'user_name',
                        align: 'center',
                        width: 160,
                        render: (h, params) => {
                            let vm = this;
                            let status = params.row.manualpaper;
                            if (status === 1) {
                                return h('div', [
                                    colBtn(vm, h, params, {content: '批改试卷', icon: 'compose', foo: vm._checkPaper}),
                                    colBtn(vm, h, params, {content: '完成批改', icon: 'checkmark-round', foo: vm._completePaper})
                                ]);
                            }
                        }
                    }
                ],
                paperColumns: [
                    {
                        title: '考试名称',
                        key: 'name'
                    },
                    {
                        title: '部门名称',
                        key: 'organizename'
                    },
                    {
                        title: '考生',
                        key: 'stuname',
                        align: 'center',
                        width: 160
                    },
                    {
                        title: '考试时间',
                        key: 'starttime',
                        align: 'center',
                        width: 160
                    },
                    {
                        title: '考试时长',
                        key: 'totletime',
                        align: 'center',
                        width: 160
                    },
                    {
                        title: '总分',
                        key: 'score',
                        align: 'center',
                        width: 160
                    },
                    {
                        title: '操作',
                        key: 'user_name',
                        align: 'center',
                        width: 160,
                        render: (h, params) => {
                            let vm = this;
                            return h('div', [
                                colBtn(vm, h, params, {content: '手工阅卷', icon: 'compose', foo: vm._checkPeoplePaper})
                            ]);
                        }
                    }
                ],
                tableHeight: 500
            };
        },
        created() {
            this._setTableHeight();
        },
        methods: {
            _checkPaper(data) {
                this.paperFilter.pid.value = data.id;
                this.isTestList = false;
            },
            _completePaper(data) {
                this.$Modal.confirm({
                    content: `确认完成【${data.name}】考试的手工阅卷么？`,
                    okText: '确认完成',
                    cancelText: '取消',
                    onOk: () => {
                        let sendData = {};
                        sendData.id = data.id;
                        this.$http.post('/examtestpaper/closeTestPaper', sendData).then((res) => {
                            if (res.success) {
                                this.$Message.success('操作成功!');
                                this._updatePelpleCheck();
                            }
                        });
                    }
                });
            },
            _completeCheck() {
                this.inExamFlag = false;
                this._updateTestPaperList();
            },
            _checkPeoplePaper(data) {
                this.testId = data.id;
                this.inExamFlag = true;
            },
            _setTableHeight() {
                let dm = document.body.clientHeight;
                this.tableHeight = dm - 260;
            },
            _updatePelpleCheck() {
                this.$refs.peopleCheck.getListData();
            },
            _updateTestPaperList() {
                this.$refs.testPaperTable.getListData();
            }
        },
        components: {
            fsTablePage,
            examCheck
        }
    };
</script>
