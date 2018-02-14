<template>
    <div>
        <Card>
            <Form inline :label-width="60">
                <FormItem label="姓名">
                    <Input type="text"
                           @on-change="_inputDebounce"
                           v-model="filterOpt.userName"
                           placeholder="筛选姓名"></Input>
                </FormItem>
                <FormItem label="部门">
                    <Input type="text"
                           @on-change="_inputDebounce"
                           v-model="filterOpt.depName"
                           placeholder="筛选部门"></Input>
                </FormItem>
                <FormItem label="申请日期">
                    <DatePicker placeholder="筛选申请日期"
                                @on-change="_dateChange"
                                :value="filterOpt.date"></DatePicker>
                </FormItem>
                <FormItem label="审核状态">
                    <Select v-model="filterOpt.status"
                            @on-change="_filterResultHandler"
                            placeholder="筛选审核状态"
                            clearable
                            style="width: 100px">
                        <Option value="1">未批准</Option>
                        <Option value="2">已批准</Option>
                        <Option value="3">批准中</Option>
                    </Select>
                </FormItem>
                <FormItem label="请假类型">
                    <Select v-model="filterOpt.type"
                            clearable
                            @on-change="_filterResultHandler"
                            placeholder="筛选请假类型"
                            style="width: 100px">
                        <Option value="事假">事假</Option>
                        <Option value="病假">病假</Option>
                        <Option value="婚假">婚假</Option>
                        <Option value="产假">产假</Option>
                        <Option value="年假">年假</Option>
                        <Option value="调休">调休</Option>
                        <Option value="丧假">丧假</Option>
                        <Option value="生日假">生日假</Option>
                        <Option value="出差">出差</Option>
                        <Option value="带薪休假">带薪休假</Option>
                        <Option value="调班">调班</Option>
                        <Option value="陪护假">陪护假</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <ButtonGroup>
                        <Poptip
                                confirm
                                placement="bottom-start"
                                title="您确认删除已选请假记录？"
                                @on-ok="_delLeaveInfo">
                            <Button type="ghost"
                                    :disabled="!chooseDataArr.length"
                                    @click="">
                                <Icon type="ios-trash-outline"></Icon>
                                删除请假信息
                            </Button>
                        </Poptip>

                    </ButtonGroup>
                </FormItem>
            </Form>
            <Table :columns="postColumns"
                   :loading="tableLoading"
                   :height="tableHeight"
                   ref="leaveTableDom"
                   @on-selection-change="_tableSelectChange"
                   :data="pageData.list"></Table>
            <Page :total="pageData.totalCount"
                  @on-change="_setPage"
                  @on-page-size-change="_setPageSize"
                  :page-size="pageData.pageSize"
                  placement="top"
                  show-sizer
                  show-total
                  show-elevator
                  style="margin-top: 16px;"></Page>
            <Modal title="查看图片证明" v-model="visible" width="800">
                <div class="" style="max-height: 500px;overflow-y: auto;overflow-x: hidden;">
                    <img :src="'http://tm.xyyzi.com:9090/oa/upload/' + item.pic"
                         v-for="(item, index) in imgArr"
                         :key="'prewimg-' + index"
                         title="点击图片可以旋转"
                         :style="{transform: `rotateZ(${item.deg}deg)`}"
                         @click="_rotateImg(index)"
                         style="width: 100%; cursor: pointer;">
                </div>
                <div slot="footer">
                    <Button type="ghost" @click="visible = false">关闭</Button>
                </div>
            </Modal>
        </Card>
    </div>
</template>
<script>
    import pageMixin from '@/mixins/pageMixin';
    import debounce from 'lodash/debounce';
    import tableExpend from './table-expend';
    export default {
        name: 'leaveManage',
        mixins: [pageMixin],
        data () {
            return {
                visible: false,
                chooseDataArr: [],
                imgArr: [],
                filterOpt: {
                    userName: '',
                    date: '',
                    status: '',
                    type: '',
                    depName: ''
                },
                postColumns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        type: 'expand',
                        width: 20,
                        render: (h, params) => {
                            return h(tableExpend, {
                                props: {
                                    row: params.row
                                }
                            });
                        }
                    },
                    {
                        title: '部门',
                        align: 'center',
                        key: 'organizename'
                    },
                    {
                        title: '员工姓名',
                        align: 'center',
                        key: 'user_name'
                    },
                    {
                        title: '申请时间',
                        align: 'center',
                        key: 'applydate'
                    },
                    {
                        title: '天数',
                        align: 'center',
                        key: 'numberday'
                    },
                    {
                        title: '类型',
                        align: 'center',
                        key: 'type'
                    },
                    {
                        title: '图片证明',
                        align: 'center',
                        render: (h, params) => {
                            let vm = this;
                            let lookBtn = '';
                            if (params.row.imageproof) {
                                lookBtn = h('Tooltip', {
                                    props: {
                                        content: '查看证明',
                                        placement: 'top',
                                        transfer: true
                                    }
                                }, [
                                    h('Button', {
                                        props: {
                                            type: 'ghost',
                                            icon: 'ios-eye',
                                            shape: 'circle',
                                            size: 'small'
                                        },
                                        on: {
                                            click: function () {
                                                vm._prewImg(params.row);
                                            }
                                        }
                                    })
                                ]);
                            } else {
                                lookBtn = '无';
                            }
                            return h('div', [lookBtn]);
                        }
                    },
                    {
                        title: '审核状态',
                        width: 120,
                        render: (h, params) => {
                            let color = '';
                            switch (params.row.status) {
                                case '未批准':
                                    color = 'red';
                                    break;
                                case '已批准':
                                    color = 'green';
                                    break;
                                case '批准中':
                                    color = 'blue';
                                    break;
                            }
                            return h('Tag', {
                                props: {
                                    type: 'border',
                                    color: color
                                }
                            }, params.row.status);
                        }
                    }
                ],
                tableHeight: 500
            };
        },
        created() {
            this._setTableHeight();
            this._getPostData();
        },
        methods: {
            _rotateImg(index) {
                this.imgArr[index].deg += 90;
            },
            _prewImg(data) {
                this.visible = true;
                let storeArr = [];
                if (data.imageproof) {
                    let obj = {};
                    obj.pic = data.imageproof;
                    obj.deg = 0;
                    storeArr.push(obj);
                }
                if (data.imageproof1) {
                    let obj = {};
                    obj.pic = data.imageproof1;
                    obj.deg = 0;
                    storeArr.push(obj);
                }
                if (data.imageproof2) {
                    let obj = {};
                    obj.pic = data.imageproof2;
                    obj.deg = 0;
                    storeArr.push(obj);
                }
                if (data.imageproof3) {
                    let obj = {};
                    obj.pic = data.imageproof3;
                    obj.deg = 0;
                    storeArr.push(obj);
                }
                if (data.imageproof4) {
                    let obj = {};
                    obj.pic = data.imageproof4;
                    obj.deg = 0;
                    storeArr.push(obj);
                }
                this.imgArr = storeArr;
            },
            _delLeaveInfo() {
                let data = {};
                data.ids = this.chooseDataArr.map(x => x.id).join(',');
                this.$http.post('/od/deleteUserOdMsg', data).then((res) => {
                    if (res.success) {
                        this.$Message.success('删除成功!');
                        this._getPostData();
                        this.chooseDataArr = [];
                    }
                });
            },
            _tableSelectChange(data) {
                this.chooseDataArr = data;
            },
            _dateChange(date) {
                this.filterOpt.date = date;
                this._getPostData();
            },
            _setPage(page) {
                this.pageData.page = page;
                this._getPostData();
            },
            _setPageSize(size) {
                this.pageData.pageSize = size;
                this._getPostData();
            },
            _setTableHeight() {
                let dm = document.body.clientHeight;
                this.tableHeight = dm - 260;
            },
            _inputDebounce: debounce(function () {
                this._filterResultHandler();
            }, 600),
            _filterResultHandler() {
                this.initPage();
                this._getPostData();
            },
            _getPostData() {
                let data = {};
                data.username = this.filterOpt.userName;
                data.organizeName = this.filterOpt.depName;
                data.applyDate = this.filterOpt.date;
                data.odstates = this.filterOpt.status;
                data.qjtype = this.filterOpt.type;
                this.getList('/od/getAllManageOdLog', data);
            }
        },
        components: {tableExpend}
    };
</script>
