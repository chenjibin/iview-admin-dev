<template>
    <div>
        <Card>
            <ButtonGroup>
                <Button style="margin-bottom: 16px;"
                        icon="plus-round"
                        @click="leaveModalFlag = true"
                        type="primary">申请请假</Button>
            </ButtonGroup>
            <fs-table-page :columns="postColumns"
                           :height="tableHeight"
                           ref="leaveTableDom"
                           url="/od/getOdLog"></fs-table-page>
            <Modal title="查看图片证明" v-model="visible" width="800">
                <div class="" style="max-height: 500px;overflow-y: auto;overflow-x: hidden;">
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
            <leave-modal :visible.sync="leaveModalFlag" @submit-success="_getPostData"></leave-modal>
        </Card>
    </div>
</template>
<script>
    import fsTablePage from '@/baseComponents/fs-table-page';
    import tableExpend from './table-expend';
    import leaveModal from './components/leave-modal';
    export default {
        name: 'myLeave',
        data () {
            return {
                leaveModalFlag: false,
                visible: false,
                chooseDataArr: [],
                imgArr: [],
                postColumns: [
                    {
                        type: 'expand',
                        width: 50,
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
                    },
                    {
                        title: '操作',
                        width: 100,
                        render: (h, params) => {
                            let vm = this;
                            let btnDom = '';
                            if (params.row.status === '未批准') {
                                btnDom = h('Tooltip', {
                                    props: {
                                        content: '撤销申请',
                                        placement: 'top',
                                        transfer: true
                                    }
                                }, [
                                    h('Button', {
                                        props: {
                                            type: 'warning',
                                            icon: 'ios-trash-outline',
                                            shape: 'circle'
                                        },
                                        on: {
                                            click: function () {
                                                vm._delOd(params.row);
                                            }
                                        }
                                    })
                                ]);
                            }
                            return h('div', [
                                btnDom
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
            _tableSelectChange(data) {
                this.chooseDataArr = data;
            },
            _delOd(data) {
                let vm = this;
                this.$Modal.confirm({
                    title: '',
                    content: '确认撤销当前申请么?',
                    okText: '确认撤销',
                    cancelText: '取消',
                    onOk: function () {
                        let sendData = {};
                        sendData.ids = data.id;
                        vm.$http.post('/od/deleteUserOdMsg', sendData).then((res) => {
                            if (res.success) {
                                vm.$Message.success('撤销申请成功!');
                                vm._getPostData();
                            }
                        });
                    }
                });
            },
            _setTableHeight() {
                let dm = document.body.clientHeight;
                this.tableHeight = dm - 260;
            },
            _getPostData() {
                this.$refs.leaveTableDom.getListData();
            }
        },
        components: {
            tableExpend,
            leaveModal,
            fsTablePage
        }
    };
</script>
