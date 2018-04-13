<template>
    <div>
        <Card>
            <Form inline>
                <FormItem>
                    <ButtonGroup>
                        <Button type="primary" @click="_addPostOpen">
                            <Icon type="plus-round"></Icon>
                            新增角色
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
                  show-sizer
                  show-total
                  show-elevator
                  style="margin-top: 16px;"></Page>
            <Modal v-model="settingModalFlag"
                   width="600"
                   :mask-closable="false">
                <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                    <span>添加角色</span>
                </p>
                <Form :model="postSettingForm"
                      :label-width="80"
                      ref="nameForm"
                      :rules="roleRules">
                    <FormItem label="角色名称" prop="name">
                        <Input v-model="postSettingForm.name"></Input>
                    </FormItem>
                </Form>
                <div slot="footer">
                    <Button type="primary" @click="_addRole">添加</Button>
                    <Button type="ghost" style="margin-left: 8px" @click="settingModalFlag = false">取消</Button>
                </div>
            </Modal>
            <Modal v-model="roleAccessModalFlag"
               width="1000"
               :mask-closable="false">
                <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                    <span>角色授权</span>
                </p>
                <div id="fs-access-control-block">
                    <CheckboxGroup v-model="social">
                        <Row :gutter="10" type="flex">
                            <Col :span="12" style="margin-bottom: 10px;" v-for="(cate, ci) in accseeList" :key="'cate-' + ci">
                                <Card style="height: 100%;">
                                    <h3 class="cate-title">{{cate.title}}</h3>
                                    <div class="each-page-wrapper" v-for="(page, pi) in cate.page" :key="'page-' + pi">
                                        <Checkbox :label="'page' + page.menu.id" size="large">
                                            <Icon type="document" size="18"></Icon>
                                            <span>{{page.menu.title}}</span>
                                        </Checkbox>
                                        <div class="each-btn-wrapper">
                                            <Checkbox :label="'btn' + btn.id" v-for="(btn, bi) in page.btn" :key="'btn-' + bi">
                                                <Icon type="ios-toggle"></Icon>
                                                <span>{{btn.btnname}}</span>
                                            </Checkbox>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                    </CheckboxGroup>
                </div>
                <div slot="footer">
                    <Button type="primary" @click="_confirmAccess">确认授权</Button>
                    <Button type="ghost" @click="roleAccessModalFlag = false">取消</Button>
                </div>
            </Modal>
        </Card>
    </div>
</template>
<style lang="less" scoped>
    #fs-access-control-block {
        padding: 10px;
        height: 600px;
        overflow: auto;
        background-color: #dddee1;
        .cate-title {
            margin-bottom: 16px;
        }
        .each-page-wrapper {
            margin-bottom: 16px;
            .each-btn-wrapper {
                margin-top: 10px;
                padding-left: 20px;
            }
        }
    }
</style>
<script>
    import pageMixin from '@/mixins/pageMixin';
    export default {
        name: 'roleManage',
        data () {
            return {
                roleAccessModalFlag: false,
                settingModalFlag: false,
                social: [],
                accseeList: [],
                postSettingForm: {
                    name: ''
                },
                roleRules: {
                    name: [
                        { required: true, message: '角色姓名不能为空！', trigger: 'blur' }
                    ]
                },
                roleId: '',
                postColumns: [
                    {
                        title: '角色名',
                        key: 'name',
                        align: 'center',
                        width: 100
                    },
                    {
                        title: '添加时间',
                        key: 'date',
                        align: 'center'
                    },
                    {
                        title: '操作人',
                        key: 'user',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        width: 180,
                        align: 'center',
                        render: (h, params) => {
                            let vm = this;
                            return h('div', [
                                h('Tooltip', {
                                    props: {
                                        content: '角色授权',
                                        placement: 'top',
                                        transfer: true
                                    }
                                }, [
                                    h('Button', {
                                        props: {
                                            type: 'primary',
                                            icon: 'key',
                                            shape: 'circle'
                                        },
                                        on: {
                                            click: function() {
                                                vm._postAccessOpen(params.row);
                                            }
                                        },
                                        style: {
                                            marginLeft: '4px'
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
            this._getAccessMenu();
            this._getPostData();
            this._setTableHeight();
        },
        methods: {
            _addRole() {
                this.$refs.nameForm.validate((valid) => {
                    if (valid) {
                        let data = {};
                        data.name = this.postSettingForm.name;
                        this.$http.post('/role/add', data).then((res) => {
                            if (res.success) {
                                this.settingModalFlag = false;
                                this.$Message.success('角色添加才成功!');
                                this._getPostData();
                            }
                        });
                    }
                });
            },
            _initPostForm() {
                this.postSettingForm.name = '';
            },
            _renturnAccessNeedArr(data) {
                let arr = [];
                data.forEach((cateItem) => {
                    let cate = {};
                    cate.title = cateItem.title;
                    cate.pages = [];
                    cateItem.page.forEach((pageItem) => {
                        let obj = pageItem.menu.columns;
                        obj.btns = [];
                        if (pageItem.btn) {
                            let btnArr = [];
                            pageItem.btn.forEach((bitem) => {
                                btnArr.push(bitem.columns);
                            });
                            obj.btns = btnArr;
                        }
                        cate.pages.push(obj);
                    });
                    arr.push(cate);
                });
                return arr;
            },
            _getAccessMenu() {
                this.$http.get('/jurisdiction/getAllMenu').then((res) => {
                    if (res.success) {
                        this.accseeList = res.data;
                    }
                });
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
            _roleAccessOpen(data) {

            },
            _addPostOpen() {
                this._initPostForm();
                this.settingModalFlag = true;
            },
            _getPostData() {
                this.getList('/role/getAllRole');
            },
            _confirmAccess() {
                let pageArr = [];
                let btnArr = [];
                this.social.forEach((item) => {
                    if (item.startsWith('page')) {
                        pageArr.push(item.split('page')[1]);
                    }
                    if (item.startsWith('btn')) {
                        btnArr.push(item.split('btn')[1]);
                    }
                });
                let data = {
                    id: this.roleId,
                    menuid: pageArr.join(','),
                    btnid: btnArr.join(',')
                };
                this.$http.post('/jurisdiction/setRoleMenu', data).then((res) => {
                    if (res.success) {
                        this.$Message.success('授权成功!');
                        this.roleAccessModalFlag = false;
                        this._getPostData();
                    }
                });
            },
            _postAccessOpen(data) {
                let pageArr = data.relate ? data.relate.split(',').map(x => 'page' + x) : [];
                let btnArr = data.btnid ? data.btnid.split(',').map(x => 'btn' + x) : [];
                this.social = pageArr.concat(btnArr);
                this.roleId = data.id;
                this.roleAccessModalFlag = true;
            }
        },
        components: {}
    };
</script>
