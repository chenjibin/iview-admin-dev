<template>
    <div>
        <Card style="overflow: hidden;">
            <transition name="fade">
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
                                   url="/examtestpaper/getTestPaperList"></fs-table-page>
                </div>
            </transition>
            <transition name="fade">
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
                                   url="/examtest/getScoreManageList"></fs-table-page>
                </div>
            </transition>
        </Card>
    </div>
</template>
<style scoped>
    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        opacity: 0;
    }
</style>
<script>
    import fsTablePage from '@/baseComponents/fs-table-page';
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
                isTestList: true,
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
            _completePaper() {

            },
            _checkPeoplePaper() {
            },
            _setTableHeight() {
                let dm = document.body.clientHeight;
                this.tableHeight = dm - 260;
            }
        },
        components: {
            fsTablePage
        }
    };
</script>
