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

        }
    }
</style>
<script>
    import moment from 'moment';
    export default {
        name: 'myLog',
        data () {
            return {
                loading: false,
                open: true,
                dateData: null,
                logInfo: [
                    {
                        date: '2018-01-01',
                        type: 1
                    },
                    {
                        date: '2018-01-02',
                        type: 1
                    },
                    {
                        date: '2018-01-03',
                        type: 1
                    },
                    {
                        date: '2018-01-04',
                        type: 2
                    },
                    {
                        date: '2018-01-05',
                        type: 3
                    },
                    {
                        date: '2018-01-06',
                        type: 0
                    }
                ],
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
            let year = moment(this.dateData).year();
            let month = moment(this.dateData).month();
            this.tableData = this.returnDateDetail(year, month);
        },
        methods: {
            returnDateDetail(year, month) {
                let tableData = [];
                let mDays = [31, 28 + this.isLeap(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                let n1str = new Date(year, month, 1);
                let firstday = n1str.getDay();
                let lines = Math.ceil((mDays[month] + firstday) / 7); // 表格所需行数
                for (let i = 0; i < lines; i++) {
                    tableData[i] = {};
                    for (let j = 0; j < 7; j++) {
                        let idx = i * 7 + j;// 单元格自然序列号
                        let dateStr = idx - firstday + 1;// 计算日期
                        if (dateStr <= 0 || dateStr > mDays[month]) {
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
            isLeap(year) {
                return (year % 100 === 0 ? (year % 400 === 0 ? 1 : 0) : (year % 4 === 0 ? 1 : 0));
            },
            _preMonth() {
                this.loading = true;
                setTimeout(() => {
                    this.loading = false
                }, 500);
                this.dateData = moment(this.dateData).subtract(1, 'M').format('YYYY-MM');
                let year = moment(this.dateData).year();
                let month = moment(this.dateData).month();
                this.tableData = this.returnDateDetail(year, month);
            },
            _nextMonth() {
                this.loading = true;
                setTimeout(() => {
                    this.loading = false
                }, 500);
                this.dateData = moment(this.dateData).add(1, 'M').format('YYYY-MM');
                let year = moment(this.dateData).year();
                let month = moment(this.dateData).month();
                this.tableData = this.returnDateDetail(year, month);
            },
            _rowClassName() {
                return 'mylog-table-row';
            },
            _logRowClick(obj) {
                console.log(obj);
            },
            _rowRender(i) {
                return (h, params) => {
                    let typeDom;
                    let type = params.row['day' + i].type
                    if (type === 0) {
                        typeDom = '';
                    } else if (type === 1) {
                        typeDom = h('Tag', {
                            props: {
                                color: 'green'
                            }
                        }, '已写');
                    } else if (type === 2) {
                        typeDom = h('Tag', {
                            props: {
                                color: 'red'
                            }
                        }, '补写');
                    } else if (type === 3) {
                        typeDom = h('Tag', {
                            props: {
                                color: 'yellow'
                            }
                        }, '待写');
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
        components: {}
    };
</script>
