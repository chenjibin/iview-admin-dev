<template>
    <Card>
        <Form inline :label-width="60">
            <FormItem label="文章标题">
                <Input type="text"
                       v-model="filterOpt.shareItem.value"
                       placeholder="筛选文章"></Input>
            </FormItem>
            <FormItem :label-width="0.1">
                <ButtonGroup>
                    <Button type="ghost" @click="_addArticleOpen">
                        <Icon type="plus-round"></Icon>
                        新建文章
                    </Button>
                </ButtonGroup>
            </FormItem>
        </Form>
        <fs-table-page :columns="postColumns"
                       :size="null"
                       :height="tableHeight"
                       :params="filterOpt"
                       :choosearray.sync="chooseDataArr"
                       ref="attendanceTable"
                       url="/share/getShareList"></fs-table-page>
        <Modal v-model="depSettingFlag"
               :mask-closable="false"
               width="1200">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>{{formType === 'create' ? '新增文章' : '编辑文章'}}</span>
            </p>
            <Form :model="depSettingForm"
                  ref="articleForm"
                  @submit.native.prevent
                  v-if="depSettingFlag"
                  :rules="articleRules">
                <Row :gutter="16">
                    <Col :span="6">
                        <FormItem label="所属菜单" prop="fatherId">
                            <el-cascader
                                    :options="orgData"
                                    :props="depProps"
                                    v-model="depSettingForm.knowledgeId"
                                    change-on-select
                                    size="small"
                                    style="width: 100%"
                            ></el-cascader>
                        </FormItem>
                        <div class="" style="margin-bottom: 16px;">
                            <span>文章主图</span>
                            <div class="" style="margin-top: 8px;">
                                <Upload action="/oa/share/uploadFile">
                                    <Button type="ghost" icon="ios-cloud-upload-outline" size="small">点击上传</Button>
                                </Upload>
                            </div>
                        </div>
                        <div class="" style="margin-bottom: 16px;">
                            <span>文章附件</span>
                            <div class="" style="margin-top: 8px;">
                                <Upload
                                        multiple
                                        action="/oa/share/uploadFile">
                                    <Button type="ghost" icon="ios-cloud-upload-outline" size="small">点击上传</Button>
                                </Upload>
                            </div>
                        </div>
                    </Col>
                    <Col :span="18">
                        <div class="" style="padding-left:8px;width: 698px">
                            <fs-auto-textarea v-model="depSettingForm.shareItem"></fs-auto-textarea>
                        </div>
                        <div class="" style="margin-top: 20px">
                            <wang-editor
                                    :menus="editorMeun"
                                    :editorcontent.sync="shareDetail"
                                    img-url="/oa/share/uploadFile"></wang-editor>
                        </div>
                    </Col>
                </Row>
            </Form>
            <div slot="footer">
                <Button type="primary"
                        v-show="formType === 'create'"
                        @click="_createArticle">新增文章</Button>
                <Button type="primary"
                        @click="_updateArticle"
                        v-show="formType === 'update'">修改文章</Button>
                <Button type="ghost" style="margin-left: 8px" @click="depSettingFlag = false">取消</Button>
            </div>
        </Modal>
    </Card>
</template>
<style lang="less">
    .ivu-upload-list-file {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

</style>
<script>
    import fsTablePage from '@/baseComponents/fs-table-page';
    import WangEditor from '@/baseComponents/fs-wangeditor';
    import fsAutoTextarea from '@/baseComponents/fs-auto-textarea';
    export default {
        name: 'ArticleSetting',
        data () {
            const colBtn = (vm, h, params, {content, icon, foo}) => {
                return h('Tooltip', {
                    props: {
                        content: content,
                        placement: 'top',
                        transfer: true
                    }
                }, [
                    h('Button', {
                        props: {
                            type: 'primary',
                            icon: icon,
                            shape: 'circle'
                        },
                        style: {
                            margin: '0 2px'
                        },
                        on: {
                            click: function () {
                                foo(params.row);
                            }
                        }
                    })
                ]);
            };
            return {
                shareDetail: '',
                depSettingFlag: false,
                formType: '',
                chooseDataArr: [],
                orgData: [],
                editorMeun: [
                    'bold',
                    'italic',
                    'link',
                    'list',
                    'quote',
                    'image',
                    'undo',
                    'redo'
                ],
                depProps: {
                    value: 'id',
                    label: 'name'
                },
                tableHeight: 500,
                depSettingForm: {
                    knowledgeId: [],
                    shareItem: '',
                    showpic: '',
                    fileNames: ''
                },
                articleRules: {
                },
                filterOpt: {
                    shareItem: {
                        value: '',
                        type: 'input'
                    },
                    knowledgeId: {
                        value: 1,
                        type: 'tree'
                    }
                },
                postColumns: [
                    {
                        title: '文章标题',
                        key: 'share_item'
                    },
                    {
                        title: '作者',
                        key: 'insert_username',
                        align: 'center',
                        width: 100
                    },
                    {
                        title: '文章主图',
                        key: 'states',
                        align: 'center',
                        width: 240,
                        render: (h, params) => {
                            return h('img', {
                                attrs: {
                                    src: params.row.file_path
                                }
                            });
                        }
                    },
                    {
                        title: '评论次数',
                        key: 'share_comment_times',
                        align: 'center',
                        width: 100
                    },
                    {
                        title: '点赞次数',
                        key: 'thumb_up_times',
                        align: 'center',
                        width: 100
                    },
                    {
                        title: '操作',
                        align: 'center',
                        width: 120,
                        render: (h, params) => {
                            let vm = this;
                            return h('div', [
                                colBtn(vm, h, params, {content: '修改文章', icon: 'compose', foo: vm._articleEditor}),
                                colBtn(vm, h, params, {content: '查看评论', icon: 'eye', foo: vm._checkArticleCommon})
                            ]);
                        }
                    }
                ]
            };
        },
        created() {
            this._setTableHeight();
        },
        methods: {
            _createArticle() {
                console.log(this.shareDetail);
            },
            _updateArticle() {
            },
            _addArticleOpen() {
                this.formType = 'create';
                this.depSettingFlag = true;
            },
            _checkArticleCommon() {
            },
            _articleEditor() {
            },
            _setTableHeight() {
                let dm = document.body.clientHeight;
                this.tableHeight = dm - 260;
            }
        },
        components: {
            fsTablePage,
            WangEditor,
            fsAutoTextarea
        }
    };
</script>
