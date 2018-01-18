<template>
    <div>
        <Card>
            <Form inline :label-width="80">
                <FormItem label="岗位名称">
                    <Input type="text"
                           @on-change="_inputDebounce"
                           v-model="filterOpt.name"
                           placeholder="筛选岗位名称"></Input>
                </FormItem>
                <FormItem label="岗位职级">
                    <Input type="text"
                           @on-change="_inputDebounce"
                           v-model="filterOpt.level"
                           placeholder="筛选岗位职级"></Input>
                </FormItem>
                <FormItem label="岗位部门">
                    <Input type="text"
                           @on-change="_inputDebounce"
                           v-model="filterOpt.organizeName"
                           placeholder="筛选岗位部门"></Input>
                </FormItem>
                <FormItem label="状态">
                    <Select v-model="filterOpt.states"
                            clearable
                            @on-change="_filterResultHandler"
                            placeholder="筛选状态"
                            style="width: 100px">
                        <Option value="1">启用</Option>
                        <Option value="0">禁用</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <ButtonGroup>
                        <Button type="primary" @click="_addPostOpen">
                            <Icon type="plus-round"></Icon>
                            新增岗位
                        </Button>
                    </ButtonGroup>
                </FormItem>
            </Form>
            <Table :columns="postColumns"
                   :loading="tableLoading"
                   :height="tableHeight"
                   :data="pageData.list"></Table>
            <Page :total="pageData.totalCount"
                  @on-change="_setPage"
                  @on-page-size-change="_setPageSize"
                  :page-size="pageData.pageSize"
                  show-sizer
                  show-total
                  show-elevator
                  style="margin-top: 16px;"></Page>
            <Modal v-model="settingModalFlag"
                   width="800"
                   :mask-closable="false">
                <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                    <span>{{postFormType === 'update' ? '岗位设置' : '添加用户岗位'}}</span>
                </p>
                <Form :model="postSettingForm" :label-width="80">
                    <Row>
                        <Col :span="8">
                        <FormItem label="状态">
                            <i-switch v-model="postSettingForm.states" size="large">
                                <span slot="open">启用</span>
                                <span slot="close">禁用</span>
                            </i-switch>
                        </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col :span="8">
                            <FormItem label="岗位名称">
                                <Input v-model="postSettingForm.name" :disabled="postFormType === 'update'"></Input>
                            </FormItem>
                        </Col>
                        <Col :span="8">
                            <FormItem label="岗位编号">
                                <Input v-model="postSettingForm.number"></Input>
                            </FormItem>
                        </Col>
                        <Col :span="8">
                            <FormItem label="岗位部门">
                                <Input v-model="postSettingForm.organizename"></Input>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col :span="8">
                            <FormItem label="在岗人员">
                                <Input v-model="postSettingForm.username"></Input>
                            </FormItem>
                        </Col>
                        <Col :span="8">
                            <FormItem label="岗位职级">
                                <Select v-model="postSettingForm.level">
                                    <!--<Option v-for="item in banCiList" :value="item.id" :key="item.id">{{item.name + '(' + item.time + ')'}}</Option>-->
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>

                </Form>
                <div slot="footer">
                    <Poptip
                            confirm
                            :transfer="true"
                            @on-ok="_delPost"
                            title="是否确认删除此岗位？">
                        <Button type="error" v-show="postFormType === 'update'">删除岗位</Button>
                    </Poptip>
                    <Button type="primary" v-show="postFormType === 'add'">添加</Button>
                    <Button type="primary" v-show="postFormType === 'update'">更新</Button>
                    <Button type="ghost" style="margin-left: 8px" @click="settingModalFlag = false">取消</Button>
                </div>
            </Modal>
        </Card>
    </div>
</template>
<style>

</style>
<script>
    import pageMixin from '@/mixins/pageMixin';
    import debounce from 'lodash/debounce';
    export default {
        name: 'postManage',
        data () {
            return {
                settingModalFlag: false,
                postFormType: 'update',
                postSettingForm: {
                    states: '',
                    name: '',
                    number: '',
                    organizename: '',
                    username: ''
                },
                filterOpt: {
                    name: '',
                    level: '',
                    states: '1',
                    organizeName: ''
                },
                postColumns: [
                    {
                        title: '岗位编号',
                        key: 'number',
                        align: 'center',
                        width: 100
                    },
                    {
                        title: '岗位名称',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '岗位部门',
                        key: 'organizename',
                        align: 'center'
                    },
                    {
                        title: '在岗人员',
                        key: 'username',
                        align: 'center'
                    },
                    {
                        title: '岗位职级',
                        key: 'level',
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
                                    color: +params.row.states === 1 ? 'green' : 'red'
                                }
                            }, +params.row.states === 1 ? '启用' : '禁用');
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
                                        content: '岗位设置',
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
            _initPostForm() {
                this.postSettingForm.states = true;
                this.postSettingForm.name = '';
                this.postSettingForm.organizename = '';
                this.postSettingForm.number = '';
                this.postSettingForm.username = '';
                this.postSettingForm.level = '';
            },
            _inputDebounce: debounce(function () {
                this._filterResultHandler();
            }, 600),
            _filterResultHandler() {
                this.initPage();
                this._getPostData();
            },
            _delPost() {
                console.log('aa');
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
            _addPostOpen() {
                this.postFormType = 'add';
                this._initPostForm();
                this.settingModalFlag = true;
            },
            _editorSetting(data) {
                this.postFormType = 'update';
                this.postSettingForm.states = !!data.states;
                this.postSettingForm.name = data.name;
                this.postSettingForm.organizename = data.organizename;
                this.postSettingForm.number = data.number;
                this.postSettingForm.username = data.username;
                this.postSettingForm.level = data.level;

                this.settingModalFlag = true;
                console.log(data);
            },
            _getPostData() {
                let data = {};
                data.name = this.filterOpt.name;
                data.level = this.filterOpt.level;
                data.states = this.filterOpt.states;
                data.organizeName = this.filterOpt.organizeName;
                this.getList('/post/datalist', data);
            }
        },
        components: {}
    };
</script>
