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
                <span>{{formType === 'create' ? '新增文章' : '修改文章'}}</span>
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
                                    :options="treeData"
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
                                <Upload action="/oa/share/uploadFile"
                                        :format="['jpg','jpeg','png']"
                                        accept="image/jpeg,image/jpg,image/png"
                                        :default-file-list="imgDefault"
                                        :on-success="_imgUpSuccessHandler"
                                        :on-remove="_imgRemoveSuccessHandler">
                                    <Button type="ghost" icon="ios-cloud-upload-outline" size="small">点击上传</Button>
                                </Upload>
                            </div>
                        </div>
                        <div class="" style="margin-bottom: 16px;">
                            <span>文章附件</span>
                            <div class="" style="margin-top: 8px;">
                                <Upload :on-success="_fileUpSuccessHandler"
                                        :default-file-list="fileDefault"
                                        :on-remove="_fileRemoveSuccessHandler"
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
        props: {
            nodeId: Number
        },
        watch: {
            nodeId(val) {
                this.filterOpt.knowledgeId.value = val;
            }
        },
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
                imgDefault: [],
                fileDefault: [],
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
                                },
                                style: {
                                    'maxWidth': '100%'
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
                ],
                articleId: null
            };
        },
        computed: {
            treeData() {
                return this.$store.state.knowledge.treeData;
            }
        },
        created() {
            this._setTableHeight();
        },
        methods: {
            _storeFilter(root, path, id) {
                root.forEach((item) => {
                    if (item.id === id) this.storePath = [...path, id];
                    if (item.children) this._storeFilter(item.children, [...path, item.id], id);
                });
            },
            _returnOrgIds(id) {
                let depsStore = this.treeData;
                let path = [];
                this._storeFilter(depsStore, path, id);
                return this.storePath;
            },
            _imgUpSuccessHandler(res, file, fileList) {
                file.url = fileList[0].response.data[0].filename;
                this.depSettingForm.showpic = fileList[0].response.data[0].filename;
            },
            _imgRemoveSuccessHandler(file, fileList) {
                this.depSettingForm.showpic = '';
            },
            _fileUpSuccessHandler(res, file, fileList) {
                console.log(fileList)
                this.depSettingForm.fileNames = fileList.map(item => {
                    return item.url;
                }).join(',');
            },
            _fileRemoveSuccessHandler(file, fileList) {
                this.depSettingForm.fileNames = fileList.map(item => {
                    return item.url;
                }).join(',');
            },
            _initSendForm() {
                this.articleId = null;
                this.imgDefault = [];
                this.fileDefault = [];
                this.shareDetail = '';
                this.depSettingForm.knowledgeId = [];
                this.depSettingForm.shareItem = '';
                this.depSettingForm.showpic = '';
                this.depSettingForm.fileNames = '';
            },
            _createArticle() {
                let data = {};
                data.shareItem = this.depSettingForm.shareItem;
                data.shareDetail = this.shareDetail;
                data.knowledgeId = this.depSettingForm.knowledgeId.slice(-1)[0];
                if (this.depSettingForm.showpic) data.showpic = this.depSettingForm.showpic;
                if (this.depSettingForm.fileNames) data.fileNames = this.depSettingForm.fileNames;
                this.$http.post('/share/addShare', data).then((res) => {
                    if (res.success) {
                        this.depSettingFlag = false;
                        this.$refs.attendanceTable.getListData();
                        this.$Message.success('文章创建成功!');
                    }
                });
            },
            _updateArticle() {
                let data = {};
                data.id = this.articleId;
                data.shareItem = this.depSettingForm.shareItem;
                data.shareDetail = this.shareDetail;
                data.knowledgeId = this.depSettingForm.knowledgeId.slice(-1)[0];
                data.showpic = this.depSettingForm.showpic;
                data.fileNames = this.depSettingForm.fileNames;
                this.$http.post('/share/updateShare', data).then((res) => {
                    if (res.success) {
                        this.depSettingFlag = false;
                        this.$refs.attendanceTable.getListData();
                        this.$Message.success('文章修改成功!');
                    }
                });
            },
            _addArticleOpen() {
                this._initSendForm();
                this.formType = 'create';
                this.depSettingFlag = true;
            },
            _checkArticleCommon() {
            },
            _articleEditor(data) {
                this._initSendForm();
                this.articleId = data.id;
                this.formType = 'update';
                this.shareDetail = data.share_detail;
                this.depSettingForm.knowledgeId = this._returnOrgIds(data.knowledge_id);
                this.depSettingForm.shareItem = data.share_item;
                if (data.file_path) {
                    this.depSettingForm.showpic = data.file_path;
                    this.imgDefault = [
                        {
                            name: data.file_name,
                            url: data.file_path
                        }
                    ];
                }
                if (data.sharefiles.length) {
                    let storeArr = [];
                    data.sharefiles.forEach(item => {
                        let obj = {};
                        obj.name = item.file_name;
                        obj.url = item.file_path;
                        storeArr.push(obj);
                    });
                    this.fileDefault = storeArr;
                }
                this.depSettingForm.fileNames = data.sharefiles.map(x => x.file_path).join(',');
                this.depSettingFlag = true;
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
