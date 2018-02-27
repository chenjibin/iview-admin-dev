<template>
    <div>
        <Card>
            <Form inline :label-width="80">
                <FormItem label="职级代码">
                    <Input type="text"
                           @on-change="_inputDebounce"
                           v-model="filterOpt.code"
                           placeholder="职级代码"></Input>
                </FormItem>
                <FormItem label="职级序列">
                    <Select v-model="filterOpt.levelType"
                            clearable
                            @on-change="_filterResultHandler"
                            placeholder="筛选状态"
                            style="width: 100px">
                        <Option value="0">管理序列</Option>
                        <Option value="1">普通序列</Option>
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
                            新增职级
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
                        <Select v-model="postSettingForm.levelType">
                            <Option value="0">管理序列</Option>
                            <Option value="1">普通序列</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="职级代码">
                        <Input v-model="postSettingForm.code" :disabled="postFormType === 'update'"></Input>
                    </FormItem>
                    <FormItem label="薪资范围">
                        <Row>
                            <Col :span="11">
                                <Input v-model="postSettingForm.minMoney"></Input>
                            </Col>
                            <Col :span="2">
                                <span style="display:block;text-align: center;">--</span>
                            </Col>
                            <Col :span="11">
                                <Input v-model="postSettingForm.maxMoney"></Input>
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem label="积分范围">
                        <Row>
                            <Col :span="11">
                                <Input v-model="postSettingForm.minCoin"></Input>
                            </Col>
                            <Col :span="2" style="test-align: center;">
                                <span style="display:block;text-align: center;">--</span>
                            </Col>
                            <Col :span="11">
                                <Input v-model="postSettingForm.maxCoin"></Input>
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
<style lang="less">

</style>
<script>
    import pageMixin from '@/mixins/pageMixin';
    import debounce from 'lodash/debounce';
    export default {
        name: 'levelManage',
        data () {
            return {
                settingModalFlag: false,
                postFormType: 'update',
                postSettingForm: {
                    code: '',
                    downMoney: '',
                    upMoney: '',
                    downCoin: '',
                    upCoin: '',
                    states: true
                },
                filterOpt: {
                    code: '',
                    levelType: '',
                    states: '1'
                },
                postColumns: [
                    {
                        title: '职级序列',
                        key: 'type',
                        align: 'center',
                        width: 100,
                        render: (h, params) => {
                            return h('span', params.row.type === 0 ? '管理序列' : '普通序列');
                        }
                    },
                    {
                        title: '职级代码',
                        key: 'code',
                        align: 'center'
                    },
                    {
                        title: '薪资范围',
                        align: 'center',
                        render: (h, params) => {
                            return h('span', params.row.minsalary + ' - ' + params.row.maxsalary);
                        }
                    },
                    {
                        title: '积分范围',
                        align: 'center',
                        render: (h, params) => {
                            return h('span', params.row.minpoints + ' - ' + params.row.maxpoints);
                        }
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
                this.postSettingForm.code = '';
                this.postSettingForm.minMoney = '';
                this.postSettingForm.maxMoney = '';
                this.postSettingForm.minCoin = '';
                this.postSettingForm.maxCoin = '';
                this.postSettingForm.levelType = '';
            },
            _inputDebounce: debounce(function () {
                this._filterResultHandler();
            }, 600),
            _filterResultHandler() {
                this.initPage();
                this._getPostData();
            },
            _delPost() {
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
                this.postSettingForm.code = data.code;
                this.postSettingForm.minMoney = data.minsalary;
                this.postSettingForm.maxMoney = data.maxsalary;
                this.postSettingForm.minCoin = data.minpoints;
                this.postSettingForm.maxCoin = data.maxpoints;
                this.postSettingForm.levelType = data.type + '';
                this.settingModalFlag = true;
            },
            _getPostData() {
                let data = {};
                data.code = this.filterOpt.code;
                data.levelType = this.filterOpt.levelType;
                data.states = this.filterOpt.states;
                this.getList('/rank/datalist', data);
            }
        },
        components: {}
    };
</script>
