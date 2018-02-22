<template>
    <div>
        <Card>
            <Form inline :label-width="60">
                <FormItem label="商品名称">
                    <Input type="text"
                           @on-change="_inputDebounce"
                           v-model="filterOpt.goodsName"
                           placeholder="筛选姓名"></Input>
                </FormItem>
                <FormItem label="上架状态">
                    <Select v-model="filterOpt.isDown"
                            clearable
                            @on-change="_filterResultHandler"
                            placeholder="筛选状态"
                            style="width: 100px">
                        <Option value="下架">下架</Option>
                        <Option value="下架">上架</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <ButtonGroup>
                        <Button type="primary" @click="_createGoods" >
                            <Icon type="plus-round"></Icon>
                            新增
                        </Button>
                    </ButtonGroup>
                </FormItem>
            </Form>
            <Table :columns="postColumns"
                   :loading="tableLoading"
                   :height="tableHeight"
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
            <Modal v-model="editorSettingFlag"
                   width="600"
                   :mask-closable="false">
                <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                    <span>新增商品</span>
                </p>
                <Form :label-width="80">
                    <FormItem label="是否下架">
                        <i-switch v-model="editorSettingData.isDown" size="large">
                            <span slot="open">上架</span>
                            <span slot="close">下架</span>
                        </i-switch>
                    </FormItem>
                    <FormItem label="商品名称">
                        <Input type="text"
                               v-model="editorSettingData.goodsName"></Input>
                    </FormItem>
                    <FormItem label="所属分类">
                        <Select v-model="editorSettingData.type"
                                placeholder=""
                                style="width: 100px">
                            <Option value="纸品类">纸品类</Option>
                            <Option value="饮品类">饮品类</Option>
                            <Option value="食品类">食品类</Option>
                            <Option value="卡券类">卡券类</Option>
                            <Option value="服饰类">服饰类</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="价格">
                        <Input type="text"
                               v-model="editorSettingData.price"
                               placeholder=""></Input>
                    </FormItem>
                    <FormItem label="商品图片">

                    </FormItem>
                </Form>
                <div slot="footer">
                    <Button type="primary"
                            :loading="btnLoading"
                            @click="">
                        添加商品
                    </Button>
                    <Button type="ghost" style="margin-left: 8px" @click="editorSettingFlag = false">取消</Button>
                </div>
            </Modal>
        </Card>
    </div>
</template>
<script>
    import pageMixin from '@/mixins/pageMixin';
    import moment from 'moment';
    import debounce from 'lodash/debounce';
    export default {
        name: 'goodsManage',
        data () {
            return {
                editorSettingFlag: false,
                btnLoading: false,
                postFormType: 'update',
                filterOpt: {
                    goodsName: '',
                    status: ''
                },
                editorSettingData: {
                    goodsName: '',
                    type: '卡券类',
                    price: '',
                    isDown: true
                },
                postColumns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '商品名称',
                        key: 'organizename',
                        align: 'center'
                    },
                    {
                        title: '图片',
                        key: 'postname',
                        align: 'center',
                        render: (h, params) => {
                            return h('span', moment(params.row['record_month']).format('YYYY-MM'));
                        }
                    },
                    {
                        title: '商品分类',
                        key: 'user_name',
                        align: 'center'
                    },
                    {
                        title: '状态',
                        key: 'states',
                        align: 'center',
                        width: 120,
                        render: (h, params) => {
                            return h('Tag', {
                                props: {
                                    type: 'border',
                                    color: params.row.status === '未审核' ? 'red' : 'green'
                                }
                            }, params.row.status);
                        }
                    },
                    {
                        title: '操作',
                        width: 100,
                        render: (h, params) => {
                            let vm = this;
                            return h('div', [
                                h('Tooltip', {
                                    props: {
                                        content: '考勤设置',
                                        placement: 'top',
                                        transfer: true
                                    }
                                }, [
                                    h('Button', {
                                        props: {
                                            type: 'primary',
                                            icon: 'ios-gear',
                                            shape: 'circle'
                                        },
                                        on: {
                                            click: function () {
                                                vm._editorSetting(params.row);
                                            }
                                        }
                                    })
                                ])
                            ]);
                        }
                    }
                ],
                tableHeight: 500
            };
        },
        mixins: [pageMixin],
        created() {
            this._getPostData();
            this._setTableHeight();
        },
        methods: {
            _initEditorSettingData() {
                let settingData = this.editorSettingData;
                settingData.goodsName = '';
                settingData.type = '卡券类';
                settingData.price = '';
                settingData.isDown = true;
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
            _createGoods() {
                this._initEditorSettingData();
                this.editorSettingFlag = true;
            },
            _editorSetting(data) {
                this._initEditorSettingData();
                this.editorSettingFlag = true;
            },
            _getPostData() {
                let data = {};
                data.goodsName = this.filterOpt.goodsName;
                data.status = this.filterOpt.status;
                this.getList('/order/goodslist', data);
            }
        },
        components: {}
    };
</script>
