<template>
    <div>
        <Row :gutter="8">
            <Col :span="10">
                <Card>
                    <h3>应得学分设置</h3>
                    <Form inline :label-width="60" style="margin-top: 8px">
                        <FormItem label="岗位名称">
                            <Input type="text"
                                   v-model="filterOpt1.name.value"
                                   placeholder="筛选岗位"></Input>
                        </FormItem>
                        <FormItem label="部门">
                            <Input type="text"
                                   v-model="filterOpt1.organizeName.value"
                                   placeholder="筛选部门"></Input>
                        </FormItem>
                    </Form>
                    <fs-table-page :columns="postColumns"
                                   :size="null"
                                   :height="tableHeight"
                                   :params="filterOpt1"
                                   ref="postTable"
                                   url="/post/datalist"></fs-table-page>
                </Card>
            </Col>
            <Col :span="14">
                <Card>
                    <h3>已得学分汇总</h3>
                    <Form inline :label-width="40" style="margin-top: 8px">
                        <FormItem label="姓名">
                            <Input type="text"
                                   v-model="filterOpt2.user_name.value"
                                   placeholder="筛选姓名"></Input>
                        </FormItem>
                        <FormItem label="月份">
                            <DatePicker placeholder="筛选月份"
                                        type="month"
                                        @on-change="filterOpt2.insert_time.value = $event"
                                        :value="filterOpt2.insert_time.value"></DatePicker>
                        </FormItem>
                        <FormItem :label-width="0.1">
                            <ButtonGroup>
                                <Button type="primary"
                                        :loading="exportLoading"
                                        icon="ios-cloud-download-outline"
                                        @click="_exportGrade">
                                    <span v-if="!exportLoading">下载</span>
                                    <span v-else>下载中...</span>
                                </Button>
                            </ButtonGroup>
                        </FormItem>
                    </Form>
                    <fs-table-page :columns="creditColumns"
                                   :size="null"
                                   :height="tableHeight"
                                   :params="filterOpt2"
                                   ref="creditTable"
                                   url="/train/credit_list_datalist"></fs-table-page>
                </Card>
            </Col>
        </Row>
    </div>
</template>
<style>

</style>
<script>
    import fsTablePage from '@/baseComponents/fs-table-page';
    import moment from 'moment';
    export default {
        name: 'creditManage',
        data () {
            return {
                tableHeight: 300,
                exportLoading: false,
                filterOpt1: {
                    name: {
                        type: 'input',
                        value: ''
                    },
                    organizeName: {
                        type: 'input',
                        value: ''
                    }
                },
                filterOpt2: {
                    user_name: {
                        type: 'input',
                        value: ''
                    },
                    insert_time: {
                        type: 'type',
                        value: ''
                    }
                },
                postColumns: [
                    {
                        title: '岗位名称',
                        align: 'center',
                        key: 'name'
                    },
                    {
                        title: '岗位部门',
                        key: 'organizename'
                    },
                    {
                        title: '应得学分',
                        align: 'center',
                        key: 'post_credit'
                    }
                ],
                creditColumns: [
                    {
                        title: '姓名',
                        align: 'center',
                        key: 'user_name'
                    },
                    {
                        title: '应得学分',
                        align: 'center',
                        key: 'post_credit'
                    },
                    {
                        title: '已得学分',
                        align: 'center',
                        key: 'sum(c.credit)'
                    },
                    {
                        title: '月份',
                        key: 'class_date',
                        render: (h, params) => {
                            return moment(params.row.class_date).format('YYYY-MM');
                        }
                    }
                ]
            };
        },
        created() {
            this._setTableHeight();
        },
        methods: {
            downloadFile(url, name) {
                let downloadDom = document.createElement('a');
                downloadDom.href = url;
                downloadDom.download = name;
                downloadDom.click();
            },
            _exportGrade() {
                let data = {};
                data.insert_time = this.filterOpt2.insert_time.value;
                if (!data.insert_time) {
                    this.$Message.error('请选择下载月份');
                    return;
                }
                this.exportLoading = true;
                this.$http.post('/train/trainee_credit_list_excel', data).then((res) => {
                    console.log(res);
                    if (res.success) {
                        this.downloadFile('/oa/download/' + res.data, res.data);
                    }
                }).finally(() => {
                    this.exportLoading = false;
                });
            },
            _setTableHeight() {
                let dm = document.body.clientHeight;
                this.tableHeight = dm - 300;
            }
        },
        components: {
            fsTablePage
        }
    };
</script>
