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
            </Form>
            <Table :columns="postColumns"
                   :loading="tableLoading"
                   :height="tableHeight"
                   ref="leaveTableDom"
                   @on-row-click="onRowClickHandler"
                   :data="pageData.list"></Table>
            <Page :total="pageData.totalCount"
                  :current="pageData.page"
                  @on-change="_setPage"
                  @on-page-size-change="_setPageSize"
                  :page-size="pageData.pageSize"
                  placement="top"
                  show-sizer
                  show-total
                  show-elevator
                  style="margin-top: 16px;"></Page>
            <Modal title="查看图片证明" v-model="visible" width="800">
                <div style="max-height: 500px;overflow-y: auto;overflow-x: hidden;">
                    <img :src="'/oa/upload/' + item.pic"
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
        name: 'leaveApproval',
        mixins: [pageMixin],
        data () {
            return {
                visible: false,
                imgArr: [],
                filterOpt: {
                    userName: '',
                    date: '',
                    status: ''
                },
                postColumns: [
                    {
                        type: 'expand',
                        width: 50,
                        render: (h, params) => {
                            let vm = this;
                            return h(tableExpend, {
                                props: {
                                    row: params.row
                                },
                                on: {
                                    'op-success': function () {
                                        vm._getPostData();
                                    }
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
                                            click: function (e) {
                                                e.stopPropagation();
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
                        width: 180,
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
                            let renderDom = '';
                            if (this.userName === params.row.waitoperatorname) {
                                renderDom = h('Tag', {
                                    props: {
                                        color: 'green'
                                    }
                                }, '可审批');
                            }
                            return h('div', [
                                h('Tag', {
                                    props: {
                                        type: 'border',
                                        color: color
                                    }
                                }, params.row.status), renderDom
                            ]);
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
        computed: {
            userName() {
                return this.$store.state.user.userInfo.realname
            }
        },
        methods: {
            onRowClickHandler(data, index) {
                this.pageData.list[index]._expanded = !this.pageData.list[index]._expanded;
            },
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
                data.user_name = this.filterOpt.userName;
                data.applyDate = this.filterOpt.date;
                data.odstates = this.filterOpt.status;
                this.getList('/od/getManageOdLog', data);
            }
        },
        components: {tableExpend}
    };
</script>
