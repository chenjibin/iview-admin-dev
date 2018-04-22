<template>
    <div>
        <Row :gutter="10">
            <Col :span="4">
                <fs-dep-tree url="/organize/organizeTreeByUserForRiZhi"
                             @node-change="_nodeChangeHandler($event)"
                             :defaultProps="defaultProps"></fs-dep-tree>
            </Col>
            <Col :span="20">
                <Card>
                    <Form ref="searchData" :model="searchData" inline :label-width="60">
                        <FormItem prop="name" label="姓名">
                            <Input type="text"
                                   @on-change="_inputDebounce"
                                   v-model="searchData.name"
                                   placeholder="姓名"></Input>
                        </FormItem>
                        <FormItem prop="startDate" label="开始日期">
                            <DatePicker type="date"
                                        @on-change="_setStartDate"
                                        placeholder="开始日期"
                                        :value="searchData.startDate"></DatePicker>
                        </FormItem>
                        <FormItem prop="endDate" label="结束日期">
                            <DatePicker type="date"
                                        @on-change="_setEndDate"
                                        placeholder="结束日期"
                                        :value="searchData.endDate"></DatePicker>
                        </FormItem>
                        <FormItem label="指导状态">
                            <Select v-model="searchData.status"
                                    @on-change="_filterResultHandler"
                                    clearable>
                                <Option value="1">已指导</Option>
                                <Option value="0">未指导</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="日志类型">
                            <Select v-model="searchData.type"
                                    @on-change="_filterResultHandler"
                                    clearable>
                                <Option value="1">休息</Option>
                                <Option value="0">出勤</Option>
                            </Select>
                        </FormItem>
                    </Form>
                    <Table :columns="columns1"
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
                </Card>
            </Col>
        </Row>
        <Modal v-model="checkLogFlag"
               :mask-closable="false"
               width="1000">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>正在查看 {{logModalData.name + ' ' + logModalData.date}}日志</span>
            </p>
            <div id="check-log-modal-content">
                <Row :gutter="24">
                    <Col :span="16">
                        <h3>日志内容</h3>
                        <div style="margin-top: 16px;max-height: 400px;overflow: auto;" v-html="logModalData.content"></div>
                    </Col>
                    <Col :span="8">
                        <h3>上级指导</h3>
                        <div class="log-guider-wrapper">
                            <ul v-if="!!upGuider.length" class="log-guider-list">
                                <li v-for="item in upGuider" class="log-guider-item">
                                    <Row :gutter="1">
                                        <Col :span="12">
                                            <span>{{item.guider}}</span>
                                        </Col>
                                        <Col :span="12">
                                            <span>{{item.guidedate | dateFormatter}}</span>
                                        </Col>
                                        <Col :span="24" style="margin-top: 8px;">
                                            <p>{{item.content}}</p>
                                        </Col>
                                    </Row>
                                </li>
                            </ul>
                            <p v-else>暂无指导</p>
                        </div>
                    </Col>
                </Row>
            </div>
            <div slot="footer">
                <Form :model="commentData"
                      style="text-align: left"
                      :rules="commentRules"
                      ref="commentForm"
                      :label-width="60">
                    <FormItem label="指导" prop="advice">
                        <Input v-model="commentData.advice"
                               type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                               placeholder="指导建议..."></Input>
                    </FormItem>
                    <FormItem label="评价">
                        <Select v-model="commentData.result" style="width: 80px;">
                            <Option value="1">优秀</Option>
                            <Option value="2">合格</Option>
                            <Option value="3">不合格</Option>
                        </Select>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" @click="_submitComment">提交评价</Button>
                    </FormItem>
                </Form>
            </div>
        </Modal>
    </div>
</template>
<style lang="less">
    #check-log-modal-content {
        font-size: 14px;
        .log-guider-wrapper {
            margin-top: 16px;
            .log-guider-list {
                .log-guider-item {
                    padding: 8px 0;
                    border-bottom: 1px solid #ddd;
                }
            }
        }
    }
</style>
<script>
    import fsDepTree from '@/baseComponents/fs-dep-tree';
    import pageMixin from '@/mixins/pageMixin';
    import debounce from 'lodash/debounce';
    import utils from '@/libs/util';
    import moment from 'moment';
    export default {
        name: 'elogManage',
        watch: {
            'searchData.depId'() {
                this._filterResultHandler();
            },
            'searchData.startDate'() {
                this._filterResultHandler();
            },
            'searchData.endDate'() {
                this._filterResultHandler();
            }
        },
        mixins: [pageMixin],
        data () {
            return {
                tableLoading: false,
                checkLogFlag: false,
                commentData: {
                    advice: 'ok',
                    result: '2'
                },
                commentRules: {
                    advice: [
                        { required: true, message: '评语不能为空！', trigger: 'blur' }
                    ]
                },
                upGuider: [],
                logModalData: {
                    name: '',
                    content: '',
                    date: '',
                    id: ''
                },
                searchData: {
                    name: '',
                    startDate: '',
                    endDate: '',
                    status: '',
                    type: '',
                    depId: ''
                },
                columns1: [
                    {
                        title: '员工姓名',
                        key: 'username',
                        align: 'center',
                        width: 120
                    },
                    {
                        title: '提交日期',
                        key: 'writedate',
                        width: 120,
                        align: 'center'
                    },
                    {
                        title: '日志内容',
                        key: 'content',
                        ellipsis: true,
                        render: (h, params) => {
                            return h('span', utils.delHtmlTag(params.row.content));
                        }
                    },
                    {
                        title: '指导状态',
                        key: 'states',
                        align: 'center',
                        width: 110,
                        render: (h, params) => {
                            return h('Tag', {
                                props: {
                                    type: 'border',
                                    color: +params.row.states === 1 ? 'green' : 'red'
                                }
                            }, +params.row.states === 1 ? '已指导' : '未指导');
                        }
                    },
                    {
                        title: '评级结果',
                        key: 'level',
                        align: 'center',
                        width: 110,
                        render: (h, params) => {
                            let bgColor = '';
                            let content = '';
                            switch (params.row.level) {
                                case 0:
                                    bgColor = 'default';
                                    content = '未评价';
                                    break;
                                case 1:
                                    bgColor = 'green';
                                    content = '优秀';
                                    break;
                                case 2:
                                    bgColor = 'green';
                                    content = '合格';
                                    break;
                                case 3:
                                    bgColor = 'red';
                                    content = '不合格';
                            }
                            return h('Tag', {
                                props: {
                                    type: 'border',
                                    color: bgColor
                                }
                            }, content);
                        }
                    },
                    {
                        title: '操作',
                        width: 120,
                        render: (h, params) => {
                            let vm = this;
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        icon: 'eye',
                                        shape: 'circle'
                                    },
                                    attrs: {
                                        title: '查看'
                                    },
                                    on: {
                                        click: function () {
                                            vm._checkLogOpen(params.row);
                                        }
                                    },
                                    style: {
                                        marginRight: '4px'
                                    }
                                })
                            ]);
                        }
                    }
                ],
                defaultProps: {
                    children: 'children',
                    label: 'text'
                },
                tableHeight: 300
            };
        },
        created() {
            this._setTableHeight();
        },
        filters: {
            dateFormatter(val) {
                return moment(val).format('YYYY-MM-DD');
            }
        },
        methods: {
            _nodeChangeHandler(node) {
                this.searchData.depId = node.id;
            },
            _initCommentData() {
                this.commentData.advice = 'ok';
                this.commentData.result = '2';
            },
            _inputDebounce: debounce(function () {
                this._filterResultHandler();
            }, 600),
            _filterResultHandler() {
                this.initPage();
                this._getLogData();
            },
            _setStartDate(date) {
                this.searchData.startDate = date;
            },
            _setEndDate(date) {
                this.searchData.endDate = date;
            },
            _setPage(page) {
                this.pageData.page = page;
                this._getLogData();
            },
            _setPageSize(size) {
                this.pageData.pageSize = size;
                this._getLogData();
            },
            _setTableHeight() {
                let dm = document.body.clientHeight;
                this.tableHeight = dm - 280;
            },
            _checkLogOpen(data) {
                this.upGuider = [];
                this.logModalData.date = data.writedate;
                this.logModalData.name = data.username;
                this.logModalData.content = data.content;
                this.logModalData.id = data.id;
                this._getUpGuiderData();
                this.$refs.commentForm.resetFields();
                this._initCommentData();
                this.checkLogFlag = true;
            },
            _getUpGuiderData() {
                let data = {
                    id: this.logModalData.id
                };
                this.$http.get('/journal/guideJson', {params: data}).then((res) => {
                    if (res.success) {
                        this.upGuider = res.data;
                    }
                });
            },
            _getLogData() {
                let data = {};
                data.userName = this.searchData.name;
                data.startDate = this.searchData.startDate;
                data.endDate = this.searchData.endDate;
                data.states = this.searchData.status;
                data.type = this.searchData.type;
                data.organizeId = this.searchData.depId;

                this.getList('/journal/maglist', data);
            },
            _submitComment() {
                this.$refs.commentForm.validate((val) => {
                    if (val) {
                        let data = {};
                        data.content = this.commentData.advice;
                        data.type = this.commentData.result;
                        data.id = this.logModalData.id;
                        this.$http.post('/journal/addGuide', data).then((res) => {
                            if (res.success) {
                                this.$Message.success('评价成功!');
                                this._getLogData();
                                this.checkLogFlag = false;
                            }
                        });
                    }
                });
            }
        },
        components: {
            fsDepTree
        }
    };
</script>
