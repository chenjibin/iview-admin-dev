<template>
    <div>
        <Row :gutter="10">
            <Col :lg="16" :md="16">
                <Card>
                    <Row type="flex" justify="center" align="middle" style="margin-bottom: 10px">
                        <span style="font-size: 18px;cursor: pointer;" @click.stop="_preMonth">
                            <Button type="primary" shape="circle" icon="chevron-left"></Button>
                        </span>
                        <span style="padding:0 16px;font-size: 18px">{{dateData}}</span>
                        <span style="font-size: 18px;cursor: pointer;" @click.stop="_nextMonth">
                             <Button type="primary" shape="circle" icon="chevron-right"></Button>
                        </span>
                    </Row>
                    <Table :columns="columnsData"
                           :data="tableData"
                           :loading="loading"
                           :row-class-name="_rowClassName"
                           :disabled-hover="true"></Table>
                    <Modal v-model="modelFlag" width="900" :mask-closable="false">
                        <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                            <span>{{logDetail.date}} 日志</span>
                        </p>
                        <div class="" v-html="logDetail.content" v-if="logDetail.type === 5"></div>
                        <template v-if="logDetail.type === 2 || logDetail.type === 3">
                            <span style="display: inline-block;margin-right: 10px;height: 30px;line-height: 30px;vertical-align: top;">日志类型</span>
                            <Select v-model="logDetail.logType"
                                    placeholder="日志类型"
                                    style="margin-bottom: 10px;width:200px">
                                <Option v-for="item in logTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                            <text-editor
                                    :menubar="editorOpt.menubar"
                                    :plugins="editorOpt.plugins"
                                    :toolbar1="editorOpt.toolbar1"
                                    @content-change="_setContent"></text-editor>
                        </template>
                        <div slot="footer">
                            <Button type="primary" :loading="submitLoading" @click="_submitLog">
                                <span v-if="!submitLoading">提交日志</span>
                                <span v-else>提交中...</span>
                            </Button>
                        </div>
                    </Modal>
                </Card>
            </Col>
            <Col :lg="8" :md="8">
                <Card>
                    <p style="font-size: 18px;font-weight: 700;text-align: center;">日志范本</p>
                </Card>
            </Col>
        </Row>
    </div>
</template>
<style lang="less">
    .ivu-table .mylog-table-row {
        td {
            .ivu-table-cell {
                position: relative;
                padding: 0;
                padding-top: 80%;
                .inner {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    font-size: 16px;
                    font-weight: 700;
                    transition: all 0.2s ease-in-out;
                    &:hover {
                        cursor: pointer;
                        background-color: rgba(92, 173, 255, 0.6);
                        color: #fff
                    }
                }
            }
            .fs-tag {
                display: inline-block;
                height: 22px;
                line-height: 22px;
                margin: 2px 4px 2px 0;
                padding: 0 8px;
                border-radius: 3px;
                font-size: 12px;
                vertical-align: middle;
                opacity: 1;
                overflow: hidden;
            }
        }
    }
</style>
<script>
    import moment from 'moment';
    import textEditor from '@/baseComponents/text-editor';
    export default {
        name: 'myLog',
        data () {
            return {
                submitLoading: false,
                modelFlag: false,
                loading: false,
                open: true,
                dateData: null,
                editorOpt: {
                    menubar: '',
                    plugins: [
                        'advlist autolink lists charmap print preview hr anchor pagebreak imagetools',
                        'searchreplace visualblocks visualchars code fullpage',
                        'insertdatetime media nonbreaking save table contextmenu directionality',
                        'emoticons paste textcolor colorpicker textpattern imagetools codesample'
                    ],
                    toolbar1: 'preview | undo redo | styleselect | forecolor backcolor bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent'
                },
                logDetail: {
                    logType: '0',
                    date: '2018-01-01',
                    type: 0,
                    editorContent: '',
                    content: '<table style="padding:20px 10px 10px 10px;background-color: #c7edcc;width:100%"><tbody><tr><td valign="top"><p class="MsoNormal"><span style="mso-spacerun:\'yes\';font-family:仿宋;font-size:14.0000pt;mso-font-kerning:1.0000pt;">各部门同事：</span><span style="mso-spacerun:\'yes\';font-family:仿宋;font-size:14.0000pt;mso-font-kerning:1.0000pt;"><o:p></o:p></span></p><p class="MsoNormal" style="text-indent:28.0000pt;"><span style="mso-spacerun:\'yes\';font-family:仿宋;font-size:14.0000pt;mso-font-kerning:1.0000pt;">为进一步完善集团金币制度，提高金币衡量人才的标准，体现金币的价值，现对公司现行金币制度进行调整。新的金币制度将通过四个维度来衡量一个员工的综合能力值，分为财富点、伯乐点、智慧点及技能点四个方面，具体规则近日会另行公示。</span><span style="mso-spacerun:\'yes\';font-family:仿宋;font-size:14.0000pt;mso-font-kerning:1.0000pt;"><o:p></o:p></span></p><p class="MsoNormal" style="text-indent:28.0000pt;"><span style="mso-spacerun:\'yes\';font-family:仿宋;font-size:14.0000pt;mso-font-kerning:1.0000pt;"><font face="仿宋">新金币制度将于</font>2018年1月1日0时正式实施，为了保证新金币合理规范，现有金币将于12月31日24时进行清零，所有正值金币将以现金的方式给大家折现（比例：1元=10金币），负值的同事同样需要以现金的方式补足上缴人事部。</span><span style="mso-spacerun:\'yes\';font-family:仿宋;font-size:14.0000pt;mso-font-kerning:1.0000pt;"><o:p></o:p></span></p><p class="MsoNormal" style="text-indent: 28pt;"><span style="mso-spacerun:\'yes\';font-family:仿宋;font-size:14.0000pt;mso-font-kerning:1.0000pt;"><font face="仿宋">请需要兑换实物或迟到券等同事于</font>2017年12月31日下午五点半前操作。</span><span style="mso-spacerun:\'yes\';font-family:仿宋;font-size:14.0000pt;mso-font-kerning:1.0000pt;"><o:p></o:p></span></p><p class="MsoNormal" align="right" style="text-indent:28.0000pt;text-align:right;"><span style="mso-spacerun:\'yes\';font-family:仿宋;font-size:14.0000pt;mso-font-kerning:1.0000pt;">江苏天马网络科技集团有限公司</span><span style="mso-spacerun:\'yes\';font-family:仿宋;font-size:14.0000pt;mso-font-kerning:1.0000pt;"><o:p></o:p></span></p><p class="MsoNormal" align="right" style="text-indent:28.0000pt;text-align:right;"><span style="mso-spacerun:\'yes\';font-family:仿宋;font-size:14.0000pt;mso-font-kerning:1.0000pt;">人力资源部</span><span style="mso-spacerun:\'yes\';font-family:仿宋;font-size:14.0000pt;mso-font-kerning:1.0000pt;"><o:p></o:p></span></p><p class="MsoNormal" align="right" style="text-align:right;"><span style="mso-spacerun:\'yes\';font-family:仿宋;font-size:14.0000pt;mso-font-kerning:1.0000pt;">2017年12月26日</span><span style="mso-spacerun:\'yes\';font-family:Calibri;mso-fareast-font-family:宋体;mso-bidi-font-family:\'Times New Roman\';font-size:10.5000pt;mso-font-kerning:1.0000pt;"><o:p></o:p></span></p></td></tr></tbody></table>'
                },
                logTypeList: [
                    {
                        value: '0',
                        label: '出勤'
                    },
                    {
                        value: '1',
                        label: '休息'
                    }
                ],
                logInfo: [],
                columnsData: [
                    {
                        title: '周日',
                        render: this._rowRender(0),
                        align: 'center'
                    },
                    {
                        title: '周一',
                        render: this._rowRender(1),
                        align: 'center'
                    },
                    {
                        title: '周二',
                        render: this._rowRender(2),
                        align: 'center'
                    },
                    {
                        title: '周三',
                        render: this._rowRender(3),
                        align: 'center'
                    },
                    {
                        title: '周四',
                        render: this._rowRender(4),
                        align: 'center'
                    },
                    {
                        title: '周五',
                        render: this._rowRender(5),
                        align: 'center'
                    },
                    {
                        title: '周六',
                        render: this._rowRender(6),
                        align: 'center'
                    }
                ],
                tableData: []
            };
        },
        created() {
            this.dateData = moment().format('YYYY-MM');
            this._getLogInfo(this.dateData);
        },
        methods: {
            returnDateDetail(year, month) {
                let tableData = [];
                let allDats = (new Date(year, month + 1, 0)).getDate();
                let n1str = new Date(year, month, 1);
                let firstday = n1str.getDay();
                let lines = Math.ceil((allDats + firstday) / 7); // 表格所需行数
                for (let i = 0; i < lines; i++) {
                    tableData[i] = {};
                    for (let j = 0; j < 7; j++) {
                        let idx = i * 7 + j;// 单元格自然序列号
                        let dateStr = idx - firstday + 1;// 计算日期
                        if (dateStr <= 0 || dateStr > allDats) {
                            tableData[i]['day' + j] = {};
                            tableData[i]['day' + j]['day'] = '';
                        } else {
                            tableData[i]['day' + j] = {};
                            tableData[i]['day' + j]['day'] = dateStr;
                            tableData[i]['day' + j] = Object.assign({}, this.logInfo[dateStr - 1] || {}, tableData[i]['day' + j]);
                        }
                    }
                }
                return tableData;
            },
            _getLogInfo(ym) {
                this.loading = true;
                this.$http.get('/journal/typeList', {params: {time: ym}}).then((res) => {
                    if (res.Success) {
                        this.logInfo = res.date;
                        let year = moment(ym).year();
                        let month = moment(ym).month();
                        this.tableData = this.returnDateDetail(year, month);
                    }
                }).finally(() => {
                    this.loading = false;
                });
            },
            _preMonth() {
                setTimeout(() => {
                    this.loading = false;
                }, 500);
                this.dateData = moment(this.dateData).subtract(1, 'M').format('YYYY-MM');
                this._getLogInfo(this.dateData);
            },
            _nextMonth() {
                this.dateData = moment(this.dateData).add(1, 'M').format('YYYY-MM');
                this._getLogInfo(this.dateData);
            },
            _rowClassName() {
                return 'mylog-table-row';
            },
            _setContent(content) {
                this.logDetail.editorContent = content;
            },
            _logRowClick(obj) {
                console.log(obj);
                if (obj.type === 0) return;
                this.logDetail.type = obj.type;
                if (obj.type === 4) {
                    this.$Message.error('超过48小时不可再补写日志！');
                } else if (obj.type === 2 || obj.type === 3 || obj.type === 5) {
                    this.modelFlag = true;
                    this.logDetail.date = obj.date;
                } else if (obj.type === 1 || obj.type === 6) {
                    this.modelFlag = true;
                    this.logDetail.date = obj.date;
                }
            },
            _submitLog() {
                this.submitLoading = true;
                let data = {
                    type: this.logDetail.logType,
                    date: this.logDetail.date,
                    content: this.logDetail.editorContent
                };
                this.$http.post('', data).then((res) => {
                    if (res.Success) {
                        this.$Message.success('日志提交成功！');
                    }
                }).finally(() => {
                    this.submitLoading = false;
                });
            },
            _rowRender(i) {
                return (h, params) => {
                    let typeDom;
                    let type = params.row['day' + i].type;
                    if (type === 0) {
                        typeDom = '';
                    } else if (type === 1 || type === 5) {
                        typeDom = h('span', {
                            style: {
                                backgroundColor: '#19be6b',
                                color: '#fff'
                            },
                            class: ['fs-tag']
                        }, '已写');
                    } else if (type === 2) {
                        typeDom = h('span', {
                            style: {
                                backgroundColor: '#ed3f14',
                                color: '#fff'
                            },
                            class: ['fs-tag']
                        }, '补写');
                    } else if (type === 3) {
                        typeDom = h('span', {
                            style: {
                                backgroundColor: '#f90',
                                color: '#fff'
                            },
                            class: ['fs-tag']
                        }, '待写');
                    } else if (type === 4) {
                        typeDom = h('span', {
                            style: {
                                backgroundColor: '#80848f',
                                color: '#fff'
                            },
                            class: ['fs-tag']
                        }, '未写');
                    } else if (type === 6) {
                        typeDom = h('span', {
                            style: {
                                backgroundColor: '#2b85e4',
                                color: '#fff'
                            },
                            class: ['fs-tag']
                        }, '休息');
                    }
                    return h('div', {
                        class: [params.row['day' + i].day ? 'inner' : ''],
                        on: {
                            click: () => {
                                this._logRowClick(params.row['day' + i]);
                            }
                        }
                    }, [
                        h('span', params.row['day' + i].day),
                        typeDom
                    ]);
                };
            }
        },
        components: {
            textEditor
        }
    };
</script>
