<template>
    <div>
        <Card>
            <Form inline :label-width="60" @submit.native.prevent>
                <FormItem label="商品名称">
                    <Input type="text"
                           @on-change="_inputDebounce"
                           v-model="filterOpt.goodsName"
                           placeholder="筛选商品名称"></Input>
                </FormItem>
                <FormItem :label-width="0.1">
                    <ButtonGroup>
                        <Button type="primary" @click="_createGoods">
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
                    <span>{{editorType === 'create' ? '新增商品' : '修改商品'}}</span>
                </p>
                <Form :label-width="80"
                      :rules="formRule"
                      ref="formFo"
                      :model="editorSettingData">
                    <FormItem label="是否下架">
                        <i-switch v-model="editorSettingData.isDown" size="large">
                            <span slot="open">上架</span>
                            <span slot="close">下架</span>
                        </i-switch>
                    </FormItem>
                    <FormItem label="商品名称" prop="goodsName">
                        <Input type="text"
                               v-model="editorSettingData.goodsName"></Input>
                    </FormItem>
                    <FormItem label="所属分类">
                        <Select v-model="editorSettingData.type"
                                style="width: 100px">
                            <Option value="纸品类">纸品类</Option>
                            <Option value="饮品类">饮品类</Option>
                            <Option value="食品类">食品类</Option>
                            <Option value="卡券类">卡券类</Option>
                            <Option value="服饰类">服饰类</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="价格">
                        <InputNumber :precision="0" v-model="editorSettingData.price"></InputNumber>
                    </FormItem>
                    <FormItem label="商品图片" required>
                            <fs-img-upload action="/oa/order/uploadfile"
                                           path="/oa/upload/"
                                           ref="imgUploadFo"
                                           :upload.sync="imgFile"></fs-img-upload>
                    </FormItem>
                </Form>
                <div slot="footer">
                    <Button type="primary"
                            :loading="btnLoading"
                            @click="_confirmAddGoods">
                        {{editorType === 'create' ? '添加商品' : '修改商品'}}
                    </Button>
                    <Button type="ghost" style="margin-left: 8px" @click="editorSettingFlag = false">取消</Button>
                </div>
            </Modal>
        </Card>
    </div>
</template>
<script>
    import pageMixin from '@/mixins/pageMixin';
    import fsImgUpload from '@/baseComponents/fs-img-upload-new';
    import debounce from 'lodash/debounce';
    export default {
        name: 'goodsManage',
        data () {
            return {
                editorSettingFlag: false,
                editorType: 'create',
                btnLoading: false,
                imgFile: [],
                formRule: {
                    goodsName: [
                        { required: true, message: '商品名称不能为空!', trigger: 'blur' }
                    ]
                },
                filterOpt: {
                    goodsName: '',
                    status: ''
                },
                editorSettingData: {
                    goodsName: '',
                    type: '卡券类',
                    price: 0,
                    isDown: true,
                    goodPic: '',
                    id: 0
                },
                postColumns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '商品名称',
                        key: 'name'
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
                        align: 'center'
                    },
                    {
                        title: '商品分类',
                        key: 'classify',
                        align: 'center'
                    },
                    {
                        title: '状态',
                        key: 'states',
                        align: 'center',
                        render: (h, params) => {
                            return h('Tag', {
                                props: {
                                    type: 'border',
                                    color: params.row.statistic === '下架' ? 'red' : 'green'
                                }
                            }, params.row.statistic);
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
                                                vm._updateEditor(params.row);
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
        watch: {
            imgFile: {
                handler(val) {
                    this.editorSettingData.goodPic = val.length ? val[0].name : '';
                },
                deep: true
            }
        },
        mixins: [pageMixin],
        created() {
            this._getPostData();
            this._setTableHeight();
        },
        methods: {
            _confirmAddGoods() {
                let vm = this;
                vm.$refs.formFo.validate((valid) => {
                    if (valid) {
                        let data = {};
                        let settingData = vm.editorSettingData;
                        if (!settingData.goodPic) {
                            vm.$Message.error('商品图片不能为空!');
                            return;
                        }
                        data.content = settingData.goodsName;
                        data.statistic = settingData.isDown ? '上架' : '下架';
                        data.classify = settingData.type;
                        data.price = settingData.price;
                        data.uploadName = settingData.goodPic;
                        data.id = settingData.id;
                        vm.$http.post('/order/addGoods', data).then((res) => {
                            if (res.success) {
                                vm.editorSettingFlag = false;
                                vm.$Message.success('操作成功!');
                                vm._getPostData();
                            }
                        });
                    }
                });
            },
            _updateEditor(data) {
                this.editorType = 'update';
                this._initEditorSettingData();
                let settingData = this.editorSettingData;
                settingData.id = data.id;
                settingData.price = data.price;
                settingData.goodsName = data.name;
                settingData.goodPic = data.image_path;
                settingData.type = data.classify;
                settingData.isDown = data.statistic === '上架';
                this.imgFile = [{url: '/oa/upload/' + data.image_path, name: data.image_path, status: 'finished'}];
                this.editorSettingFlag = true;
            },
            _initEditorSettingData() {
                let settingData = this.editorSettingData;
                settingData.goodsName = '';
                settingData.type = '卡券类';
                settingData.price = 0;
                settingData.isDown = true;
                settingData.goodPic = '';
                settingData.id = 0;
                this.imgFile = [];
                this.$refs.imgUploadFo.removeAllPicFlie();
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
                this.editorType = 'create';
                this.editorSettingFlag = true;
            },
            _getPostData() {
                let data = {};
                data.name = this.filterOpt.goodsName;
                this.getList('/order/goodslist', data);
            }
        },
        components: {
            fsImgUpload
        }
    };
</script>
