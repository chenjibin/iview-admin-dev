<template>
    <div>
        <Card>
            <Form inline :label-width="80">
                <FormItem label="职级代码">
                    <Input type="text"
                           @on-change="_inputDebounce"
                           v-model="filterOpt.name"
                           placeholder="职级代码"></Input>
                </FormItem>
                 <FormItem label="职级序列">
                    <Select v-model="filterOpt.states"
                            clearable
                            @on-change="_filterResultHandler"
                            placeholder="筛选状态"
                            style="width: 100px">
                        <Option value="1">管理序列</Option>
                        <Option value="2">普通序列</Option>
                    </Select>
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
                   width="400"
                   :mask-closable="false">
                <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                    <span>{{postFormType === 'update' ? '职级设置' : '添加职级'}}</span>
                </p>
                <Form :model="postSettingForm" :label-width="80">
                    <FormItem label="状态">
                        <i-switch v-model="postSettingForm.states" size="large">
                            <span slot="open">启用</span>
                            <span slot="close">禁用</span>
                        </i-switch>
                    </FormItem>
                    <FormItem label="职级序列">
                        <Select v-model="postSettingForm.level">
                            <!--<Option v-for="item in banCiList" :value="item.id" :key="item.id">{{item.name + '(' + item.time + ')'}}</Option>-->
                        </Select>
                    </FormItem>
                    <FormItem label="职级代码">
                        <Input v-model="postSettingForm.number" :disabled="postFormType === 'update'"></Input>
                    </FormItem>
                    <FormItem label="薪资范围">
                        <Row>
                            <Col :span="11">
                                <Input v-model="postSettingForm.number"></Input>
                            </Col>
                            <Col :span="2">
                                <span style="display:block;text-align: center;">--</span>
                            </Col>
                            <Col :span="11">
                                <Input v-model="postSettingForm.number"></Input>
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem label="积分范围">
                        <Row>
                            <Col :span="11">
                                <Input v-model="postSettingForm.number"></Input>
                            </Col>
                            <Col :span="2" style="test-align: center;">
                                <span style="display:block;text-align: center;">--</span>
                            </Col>
                            <Col :span="11">
                                <Input v-model="postSettingForm.number"></Input>
                            </Col>
                        </Row>
                    </FormItem>
                </Form>
                <div slot="footer">
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
        name: 'roleManage',
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
                        title: '角色名',
                        key: 'number',
                        align: 'center',
                        width: 100
                    },
                    {
                        title: '添加时间',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '操作人',
                        key: 'organizename',
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
                                        content: '职级设置',
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
                                ]),
                                h('Tooltip', {
                                    props: {
                                        content: '用户授权',
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
                                                vm._userAccessOpen(params.row);
                                            }
                                        },
                                        style: {
                                            marginRight: '4px'
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
