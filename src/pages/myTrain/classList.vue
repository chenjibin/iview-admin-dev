<template>
    <div style="margin-top: 16px;">
        <Form inline :label-width="60">
            <FormItem label="培训类型">
                <Select v-model="filterOpt.type"
                        clearable
                        @on-change="_filterResultHandler"
                        placeholder="筛选类型"
                        style="width: 100px">
                    <Option :value="item.id"
                            v-for="item,index in trainTypeOpt"
                            :key="'trainTypeOpt' + index">{{item.name}}</Option>
                </Select>
            </FormItem>
        </Form>
        <div class="class-list-wrapper" style="height: 600px;">
            <Row :gutter="8">
                <Col :span="12"
                     style="margin-bottom: 8px"
                     v-for="item,index in classListData"
                     :key="'class-list' + item.id">
                    <Card class="item-card">
                        <h4 class="title" :title="item.title">{{item.title}}</h4>
                        <div style="text-align: right">讲师: {{item.teacher_name}}</div>
                        <div style="text-align: right">培训类型: {{item.type_name}}</div>
                        <div style="height: 21px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
                            <span class="item-label">时间:</span><span class="item-content" :title="returnDate(item.class_date) + ' ' + item.period">{{item.class_date | returnDate}}  {{item.period}}</span>
                        </div>
                        <div class="">
                            <span class="item-label">地点:</span><span class="item-content">{{item.position}}</span>
                        </div>
                        <div>
                            <span class="item-label">学分:</span><span class="item-content">{{item.credit}}</span>
                            <span class="item-label">人数限制:</span><span class="item-content">{{item.trainee_max_num}}</span>
                            <span class="item-label">报名人数:</span><span class="item-content">{{item.has_baoming || 0 }}</span>
                        </div>
                        <div class="btn-group">
                            <Button type="primary"
                                    @click="_traineeAdd(item)"
                                    shape="circle">报名</Button>
                        </div>
                    </Card>
                </Col>
            </Row>
            <Spin size="large" fix v-if="spinShow"></Spin>
        </div>
        <Page :total="pageData.totalCount"
              :current.sync="pageData.page"
              :page-size="pageData.pageSize"
              :size="size"
              placement="top"
              @on-change="pageChangeHandler"
              @on-page-size-change="pageSizeChangeHandler"
              show-elevator
              show-total
              style="margin-top: 16px;"></Page>
    </div>
</template>
<style lang="less">
    .class-list-wrapper {
        .item-card {
            user-select: none;
            .title {
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
            .btn-group {
                text-align: right;
            }
            .item-label {
                font-weight: 700;
            }
            .item-content {
                margin-right: 8px;
            }
        }
    }
</style>
<script>
    import moment from 'moment';
    export default {
        name: 'classList',
        data () {
            return {
                classListData: [],
                size: 'small',
                spinShow: false,
                trainTypeOpt: [],
                filterOpt: {
                    type: ''
                },
                pageData: {
                    totalCount: 0,
                    page: 1,
                    pageSize: 8
                }
            };
        },
        created() {
            this._getClassListData();
            this._getTrainTypeOpt();
        },
        filters: {
            returnDate(val) {
                return moment(val).format('YYYY-MM-DD');
            }
        },
        methods: {
            returnDate(val) {
                return moment(val).format('YYYY-MM-DD');
            },
            _traineeAdd(data) {
                this.$Modal.confirm({
                    content: '确认报名' + data.title + '课程么?',
                    okText: '确认报名',
                    cancelText: '取消',
                    onOk: () => {
                        let sendData = {};
                        sendData.ids = data.id;
                        this.$http.post('/train/trainee_add', sendData).then((res) => {
                            if (res.success) {
                                this.$Message.success('报名成功!');
                                this.$emit('trainee-success');
                                this._getClassListData();
                            }
                        });
                    }
                });
            },
            _filterResultHandler() {
                this.pageData.page = 1;
                this._getClassListData();
            },
            _getTrainTypeOpt() {
                this.$http.get('/train/class_type_comboxData').then((res) => {
                    if (res.success) {
                        this.trainTypeOpt = res.data;
                    }
                });
            },
            pageChangeHandler(page) {
                this.pageData.page = page;
                this._getClassListData();
            },
            pageSizeChangeHandler(size) {
                this.pageData.pageSize = size;
                this.pageData.page = 1;
                this._getClassListData();
            },
            _getClassListData() {
                this.spinShow = true;
                let data = {};
                data.page = this.pageData.page;
                data.pageSize = this.pageData.pageSize;
                data.class_type = this.filterOpt.type;
                this.$http.get('/train/class_datalist', {params: data}).then((res) => {
                    if (res.success) {
                        this.classListData = res.data;
                        this.pageData.totalCount = res.totalCount;
                    }
                }).finally(() => {
                    this.spinShow = false;
                });
            }
        }
    };
</script>
