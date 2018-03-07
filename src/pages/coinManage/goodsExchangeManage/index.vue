<template>
    <div>
        <Card>
            <Form inline :label-width="60">
                <FormItem label="商品名称">
                    <Input type="text"
                           @on-change="_inputDebounce"
                           v-model="filterOpt.name"
                           placeholder="筛选商品名称"></Input>
                </FormItem>
                <FormItem label="兑换人">
                    <!--<fs-search-user v-model="filterOpt.userId"-->
                                    <!--:optionlist.sync="nameOpt"-->
                                    <!--:clearable="true"-->
                                    <!--:label="filterOpt.userName"></fs-search-user>-->
                    <Input type="text"
                           @on-change="_inputDebounce"
                           v-model="filterOpt.userName"
                           placeholder="筛选兑换人"></Input>
                </FormItem>
                <FormItem label="部门">
                    <Input type="text"
                           @on-change="_inputDebounce"
                           v-model="filterOpt.department"
                           placeholder="筛选部门"></Input>
                </FormItem>
                <FormItem label="状态">
                    <Select v-model="filterOpt.status"
                            clearable
                            @on-change="_filterResultHandler"
                            placeholder="筛选状态"
                            style="width: 100px">
                        <Option value="0">待领取</Option>
                        <Option value="1">已领取</Option>
                        <Option value="2">已取消</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <ButtonGroup>
                        <Button type="primary"
                                :disabled="!chooseDataArr.length"
                                @click="_allHandler(1)">
                            <Icon type="navicon-round"></Icon>
                            批量领取
                        </Button>
                        <Button type="primary"
                                :disabled="!chooseDataArr.length"
                                @click="_allHandler(2)">
                            <Icon type="navicon-round"></Icon>
                            批量取消
                        </Button>
                    </ButtonGroup>
                </FormItem>
            </Form>
            <Table :columns="postColumns"
                   :loading="tableLoading"
                   :height="tableHeight"
                   @on-selection-change="_tableSelectChange"
                   :data="pageData.list"></Table>
            <Page :total="pageData.totalCount"
                  @on-change="_setPage"
                  @on-page-size-change="_setPageSize"
                  :current="pageData.page"
                  :page-size="pageData.pageSize"
                  placement="top"
                  show-sizer
                  show-total
                  show-elevator
                  style="margin-top: 16px;"></Page>
        </Card>
    </div>
</template>
<script>
    import pageMixin from '@/mixins/pageMixin';
    import debounce from 'lodash/debounce';
    // import fsSearchUser from '@/baseComponents/fs-search-user';
    export default {
        name: 'goodsExchangeManage',
        data () {
            return {
                nameOpt: [],
                nameLabel: '',
                filterOpt: {
                    name: '',
                    userName: '',
                    department: '',
                    status: '',
                    userId: ''
                },
                postColumns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '商品名称',
                        key: 'goods_name'
                    },
                    {
                        title: '商品图片',
                        key: 'postname',
                        align: 'center',
                        width: 160,
                        render: (h, params) => {
                            return h('img', {
                                attrs: {
                                    src: '/oa/upload/' + params.row.image_path
                                },
                                style: {
                                    maxWidth: '100%'
                                },
                                on: {
                                    error: function (e) {
                                        e.target.setAttribute('src', '/oa/upload/initListImage.png');
                                    }
                                }
                            });
                        }
                    },
                    {
                        title: '价格',
                        key: 'price',
                        align: 'center',
                        width: 80
                    },
                    {
                        title: '所在部门',
                        key: 'dpname',
                        align: 'center'
                    },
                    {
                        title: '数量',
                        key: 'quality',
                        align: 'center',
                        width: 80
                    },
                    {
                        title: '兑换人',
                        key: 'user_name',
                        align: 'center',
                        width: 90
                    },
                    {
                        title: '状态',
                        key: 'states',
                        align: 'center',
                        width: 120,
                        render: (h, params) => {
                            let statusContent = '';
                            let color = '';
                            switch (params.row.status) {
                                case 0:
                                    statusContent = '待领取';
                                    color = 'red';
                                    break;
                                case 1:
                                    statusContent = '已领取';
                                    color = 'green';
                                    break;
                                case 2:
                                    statusContent = '已取消';
                                    color = 'default';
                            }
                            return h('Tag', {
                                props: {
                                    type: 'border',
                                    color: color
                                }
                            }, statusContent);
                        }
                    },
                    {
                        title: '兑换时间',
                        key: 'created',
                        align: 'center',
                        width: 170
                    },
                    {
                        title: '操作人',
                        key: 'opt_user',
                        align: 'center',
                        width: 120
                    },
                    {
                        title: '操作',
                        width: 140,
                        align: 'center',
                        render: (h, params) => {
                            let vm = this;
                            if (params.row.status !== 0) return '';
                            return h('div', [
                                h('Tooltip', {
                                    props: {
                                        content: '已领取',
                                        placement: 'top',
                                        transfer: true
                                    }
                                }, [
                                    h('Button', {
                                        props: {
                                            type: 'success',
                                            icon: 'checkmark-round',
                                            shape: 'circle'
                                        },
                                        on: {
                                            click: function () {
                                                vm._confirmExchangeGoods(params.row);
                                            }
                                        }
                                    })
                                ]),
                                h('Tooltip', {
                                    props: {
                                        content: '取消',
                                        placement: 'top',
                                        transfer: true
                                    },
                                    style: {
                                        marginLeft: '8px'
                                    }
                                }, [
                                    h('Button', {
                                        props: {
                                            type: 'warning',
                                            icon: 'close-round',
                                            shape: 'circle'
                                        },
                                        on: {
                                            click: function () {
                                                vm._confirmCancelGoods(params.row);
                                            }
                                        }
                                    })
                                ])
                            ]);
                        }
                    }
                ],
                tableHeight: 500,
                chooseDataArr: []
            };
        },
        watch: {
            // 'filterOpt.userId'(val) {
            //     if (!val) {
            //         this.filterOpt.userName = '';
            //         return;
            //     }
            //     this.filterOpt.userName = this.nameOpt.filter(x => x.id === val)[0].realname;
            // },
            // 'filterOpt.userName'() {
            //     this._filterResultHandler();
            // }
        },
        mixins: [pageMixin],
        created() {
            this._getPostData();
            this._setTableHeight();
        },
        methods: {
            _checkChooseStatus(arr) {
                let flag = true;
                arr.forEach(item => {
                    if (item.status !== 0) flag = false;
                });
                return flag;
            },
            _allHandler(status) {
                let vm = this;
                let flag = vm._checkChooseStatus(this.chooseDataArr);
                if (!flag) {
                    this.$Message.error('只有待领取状态下的兑换订单才可以操作！');
                    return;
                }
                let content = status === 1 ? '领取' : '取消';
                vm.$Modal.confirm({
                    content: '确认批量' + content + '选中的订单么?',
                    okText: '确认' + content,
                    cancelText: '关闭',
                    onOk: function () {
                        let data = {};
                        data.ids = vm.chooseDataArr.map(x => x.id).join(',');
                        data.status = status;
                        vm.$http.post('/order/operation', data).then((res) => {
                            if (res.success) {
                                vm.$Message.success('操作成功!');
                                vm._getPostData();
                            }
                        });
                    }
                });
            },
            _tableSelectChange(data) {
                this.chooseDataArr = data;
            },
            _confirmExchangeGoods(data) {
                let vm = this;
                this.$Modal.confirm({
                    content: '确认' + data.user_name + ' 兑换【' + data.goods_name + '】么?',
                    okText: '确认兑换',
                    cancelText: '关闭',
                    onOk: function () {
                        let sendData = {};
                        sendData.id = data.id;
                        sendData.status = 1;
                        vm.$http.post('/order/updateStatus', sendData).then((res) => {
                            if (res.success) {
                                vm.$Message.success('操作成功!');
                                vm._getPostData();
                            }
                        });
                    }
                });
            },
            _confirmCancelGoods(data) {
                let vm = this;
                this.$Modal.confirm({
                    content: '确认取消 ' + data.user_name + ' 兑换【' + data.goods_name + '】么?',
                    okText: '确认取消',
                    cancelText: '关闭',
                    onOk: function () {
                        let sendData = {};
                        sendData.id = data.id;
                        sendData.status = 2;
                        vm.$http.post('/order/updateStatus', sendData).then((res) => {
                            if (res.success) {
                                vm.$Message.success('操作成功!');
                                vm._getPostData();
                            }
                        });
                    }
                });
            },
            _inputDebounce: debounce(function () {
                this._filterResultHandler();
            }, 600),
            _filterResultHandler() {
                this.initPage();
                this._getPostData();
            },
            _setTableHeight() {
                let dm = document.body.clientHeight;
                this.tableHeight = dm - 260;
            },
            _setPage(page) {
                this.pageData.page = page;
                this._getPostData();
            },
            _setPageSize(size) {
                this.pageData.pageSize = size;
                this._getPostData();
            },
            _editorSetting(data) {
                this.editorSettingFlag = true;
            },
            _getPostData() {
                this.chooseDataArr = [];
                let data = {};
                data.name = this.filterOpt.name;
                data.status = this.filterOpt.status;
                data.department = this.filterOpt.department;
                data.userName = this.filterOpt.userName;
                this.getList('/order/orderlist', data);
            }
        },
        components: {
            // fsSearchUser
        }
    };
</script>
