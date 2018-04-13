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
               width="1000">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>{{formType === 'create' ? '新增文章' : '编辑文章'}}</span>
            </p>
            <Form :model="depSettingForm"
                  ref="articleForm"
                  :rules="articleRules"
                  :label-width="100">
                <Row type="flex">
                    <Col :span="24">
                    <FormItem label="上级菜单" prop="fatherId">
                        <el-cascader
                                :options="orgData"
                                :props="depProps"
                                v-model="depSettingForm.fatherId"
                                change-on-select
                                size="small"
                                style="width: 100%"
                        ></el-cascader>
                    </FormItem>
                    </Col>
                    <Col :span="24">
                    <FormItem prop="shareItem" label="文章标题">
                        <Input type="text"
                               v-model="depSettingForm.name"></Input>
                    </FormItem>
                    </Col>
                    <Col :span="24">
                    <FormItem prop="isImportant" label="是否重点知识">
                        <i-switch v-model="depSettingForm.important" size="large" :true-value="1" :false-value="0">
                            <span slot="open">是</span>
                            <span slot="close">否</span>
                        </i-switch>
                    </FormItem>
                    </Col>
                </Row>
            </Form>
            <div slot="footer">
                <Button type="primary"
                        v-show="formType === 'create'"
                        @click="_createCate">创建菜单</Button>
                <Button type="primary"
                        @click="_updateCare"
                        v-show="formType === 'update'">确认修改</Button>
                <Button type="ghost" style="margin-left: 8px" @click="depSettingFlag = false">取消</Button>
            </div>
        </Modal>
    </Card>
</template>
<style lang="less">

</style>
<script>
    import fsTablePage from '@/baseComponents/fs-table-page';
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
                depSettingFlag: false,
                formType: '',
                chooseDataArr: [],
                tableHeight: 500,
                depSettingForm: {

                },
                articleRules: {
                    knowledgeId: 0,
                    shareItem: '',
                    showpic: '',
                    fileNames: '',
                    shareDetail: ''
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
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '文章标题',
                        key: 'organizename'
                    },
                    {
                        title: '文章主图',
                        key: 'states',
                        align: 'center',
                        width: 240,
                        render: (h, params) => {

                        }
                    },
                    {
                        title: '评论次数',
                        key: 'organizename',
                        width: 100
                    },
                    {
                        title: '点赞次数',
                        key: 'organizename',
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
                                colBtn(vm, h, params, {content: '查看评论', icon: 'compose', foo: vm._checkArticleCommon})
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
            _addArticleOpen() {
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
            fsTablePage
        }
    };
</script>
