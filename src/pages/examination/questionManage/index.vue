<template>
    <div>
        <Card>
            <Form inline :label-width="60"  @submit.native.prevent>
                <FormItem label="试题名称">
                    <Input type="text"
                           @on-change="_inputDebounce"
                           v-model="filterOpt.name"
                           placeholder="筛选试题名称"></Input>
                </FormItem>
                <FormItem label="试题分类">
                    <Select v-model="filterOpt.subject"
                            clearable
                            @on-change="_filterResultHandler"
                            placeholder="筛选分类"
                            style="width: 100px">
                        <Option :value="item.id" v-for="item, index in subjectList" :key="index">{{item.name}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="试题类型">
                    <Select v-model="filterOpt.type"
                            clearable
                            @on-change="_filterResultHandler"
                            placeholder="筛选类型"
                            style="width: 100px">
                        <Option value="1">单选题</Option>
                        <Option value="2">多选题</Option>
                        <Option value="3">判断题</Option>
                        <Option value="4">填空题</Option>
                        <Option value="5">问答题</Option>
                    </Select>
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
                   width="300"
                   :mask-closable="false">
                <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                    <span>导出考勤</span>
                </p>
                <Form>
                    <FormItem label="是否下架">
                        <i-switch v-model="editorSettingData.isDown" size="large">
                            <span slot="open">上架</span>
                            <span slot="close">下架</span>
                        </i-switch>
                    </FormItem>
                    <FormItem label="商品名称">
                        <Input type="text"
                               v-model="editorSettingData.name"
                               placeholder=""></Input>
                    </FormItem>
                    <FormItem label="所属分类">
                        <Select v-model="editorSettingData.type"
                                placeholder=""
                                style="width: 100px">
                            <Option value="纸品类">纸品类</Option>
                            <Option value="饮品类">饮品类</Option>
                            <Option value="纸品类">食品类</Option>
                            <Option value="饮品类">卡券类</Option>
                            <Option value="饮品类">服饰类</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="价格">
                        <Input type="text"
                               v-model="editorSettingData.price"
                               placeholder=""></Input>
                    </FormItem>
                    <FormItem label="考勤月份">
                        <DatePicker type="month"
                                    placeholder="筛选考勤月份"
                                    @on-change=""
                                    :value="editorSettingData.month"></DatePicker>
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
        name: 'questionManage',
        data () {
            return {
                editorSettingFlag: false,
                btnLoading: false,
                postFormType: 'update',
                filterOpt: {
                    name: '',
                    subject: '',
                    type: ''
                },
                editorSettingData: {
                    name: '',
                    type: '',
                    price: '',
                    month: ''
                },
                postColumns: [
                    {
                        title: '试题名称',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '试题分类',
                        key: 'postname',
                        align: 'center'
                    },
                    {
                        title: '试题类型',
                        key: 'user_name',
                        align: 'center'
                    },
                    {
                        title: '试题分数',
                        key: 'user_name',
                        align: 'center'
                    },
                    {
                        title: '创建日期',
                        key: 'user_name',
                        align: 'center'
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
                                            }
                                        }
                                    })
                                ])
                            ]);
                        }
                    }
                ],
                subjectList: [],
                tableHeight: 500
            };
        },
        mixins: [pageMixin],
        created() {
            this._getPostData();
            this._getSubjectList();
            this._setTableHeight();
        },
        methods: {
            _initEditorSettingData() {
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
                this._initEditorSettingData();
                this.editorSettingFlag = true;
            },
            _getPostData() {
                let data = {};
                data.name = this.filterOpt.name;
                data.type = this.filterOpt.type;
                data.subject = this.filterOpt.subject;
                this.getList('/examquestion/getQuestionList', data);
            },
            _getSubjectList() {
                this.$http.get('/examquestion/getSubjectList').then((res) => {
                    if (res.success) {
                        this.subjectList = res.data;
                    }
                });
            }
        },
        components: {}
    };
</script>
