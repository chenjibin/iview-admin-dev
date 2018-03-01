<template>
    <!--资产位置-->
    <div id="assetslocation">
        <Card>
            <Form inline :label-width="60">
                <FormItem label="位置名称">
                    <Input type="text" style="width: 173px"
                           @on-change="_inputDebounce"
                           v-model="filterOpt.name"
                           placeholder="位置名称"></Input>
                </FormItem>
                <Button type="ghost" @click="addInfo">
                    <Icon type="plus-circled"></Icon>
                    <span>新增</span>
                </Button>
                <!--<Button type="ghost" icon="edit">修改</Button>-->
                <!--<Button type="ghost" icon="trash-b">删除</Button>-->
            </Form>
            <Table :columns="postColumns"
                   ref="attendanceTable"
                   :loading="tableLoading"
                   :height="tableHeight"
                   :data="pageData.list">
            </Table>
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
        </Card>
        <Modal v-model="changeInfoModal" width="300">
            <Form style="margin-top: 20px">
                <input style="display: none" v-model="baseInfo.id"/>
                <FormItem label="位置名称">
                    <Input type="text" style="width: 173px"
                           v-model="baseInfo.name"
                           placeholder="位置名称"></Input>
                </FormItem>
                <FormItem label="位置备注">
                    <Input type="text" style="width: 173px"
                           v-model="baseInfo.remarks"
                           placeholder="位置备注"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary" size="large" @click="saveInfo">
                    <span>确定</span>
                </Button>
            </div>
        </Modal>

    </div>
</template>

<script>
    // 简单的axios薄层封装
    import pageMixin from '@/mixins/pageMixin';
    // lodash输入延时
    import debounce from 'lodash/debounce';
    export default {
        name: 'assetslocation',
        data() {
            return {
                tableHeight: 500,
                filterOpt: {
                    name: ''
                },
                baseInfo: {
                    name: '',
                    remarks: ''
                },
                changeInfoModal: false,
                postColumns: [
                    {
                        title: '位置名称',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '位置备注',
                        key: 'remarks',
                        align: 'center'
                    },
                    {
                        title: '创建日期',
                        key: 'createbydate',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        align: 'center',
                        render: (h, params) => {
                            var vm = this;
                            return h('div', {
                            }, [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        icon: 'edit',
                                        shape: 'circle'
                                    },
                                    style: {
                                        marginRight: '20px'
                                    },
                                    on: {
                                        click: function () {
                                            vm.changeInfo(params.row);
                                            vm.changeInfoModal = true;
                                        }
                                    }
                                }),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        icon: 'close',
                                        shape: 'circle'
                                    },
                                    on: {
                                        click: function () {
                                            vm.delInfo(params.row);
                                        }
                                    }
                                })
                            ]);
                        }
                    }
                ]
            };
        },
        mixins: [pageMixin],
        created () {
            this._getPostData();
            this._setTableHeight();
        },
        methods: {
            changeInfo(data) {
                this.baseInfo = data;
                console.log(data);
            },
            saveInfo() {
                var vm = this;
                vm.$http.post('/assets/add', vm.baseInfo).then((res) => {
                    if (res.success) {
                        vm.$Message.success('保存成功');
                        vm.changeInfoModal = false;
                        vm._filterResultHandler();
                    }
                });
            },
            addInfo() {
                this.baseInfo = {};
                this.changeInfoModal = true;
            },
            delInfo(data) {
                var vm = this;
                this.baseInfo = data;
                this.$Modal.confirm({
                    title: '删除提醒',
                    content: '是否确认删除？',
                    okText: '删除',
                    cancelText: '取消',
                    loading: true,
                    onOk () {
                        this.$http.post('/assets/delete', {id: vm.baseInfo.id}).then((res) => {
                            if (res.success) {
                                vm._filterResultHandler();
                                vm.$Modal.remove();
                                vm.$Message.success('删除成功');
                            }
                        });
                    }
                });
            },
            _inputDebounce: debounce(function () {
                this._filterResultHandler();
            }, 1600),
            _filterResultHandler () {
                this.initPage();
                this._getPostData();
            },
            _setTableHeight () {
                let dm = document.body.clientHeight;
                this.tableHeight = dm - 57 - 33 - 16;
            },
            _setPage (page) {
                this.pageData.page = page;
                this._getPostData();
            },
            _setPageSize (size) {
                this.pageData.pageSize = size;
                this._getPostData();
            },
            _getPostData () {
                this.getList('/assets/datalist', this.filterOpt);
            }
        }
    };
</script>

<style scoped>

</style>
