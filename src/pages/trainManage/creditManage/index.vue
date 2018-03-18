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
                    <fs-table-page :columns="postColumns"
                                   :size="null"
                                   :height="tableHeight"
                                   :params="filterOpt1"
                                   ref="postTable"
                                   url="/train/postDataList"></fs-table-page>
                </Card>
            </Col>
            <Col :span="14">
                <Card>
                    <h3>已得学分汇总</h3>
                    <Form inline :label-width="60" style="margin-top: 8px">
                        <FormItem label="姓名">
                            <Input type="text"
                                   v-model="filterOpt2.user_name.value"
                                   placeholder="筛选姓名"></Input>
                        </FormItem>
                        <FormItem label="月份">
                            <DatePicker placeholder="筛选月份"
                                        @on-change="filterOpt2.insert_time.value = $event"
                                        :value="filterOpt2.insert_time.value"></DatePicker>
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
        mame: 'creditManage',
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
                        key: 'period'
                    },
                    {
                        title: '岗位部门',
                        key: 'title'
                    },
                    {
                        title: '学分',
                        key: 'type_name'
                    }
                ],
                creditColumns: [
                    {
                        title: '姓名',
                        align: 'center',
                        key: 'period'
                    },
                    {
                        title: '应得学分',
                        key: 'title'
                    },
                    {
                        title: '已得学分',
                        key: 'type_name'
                    },
                    {
                        title: '月份',
                        key: 'type_name'
                    }
                ]
            };
        },
        created() {
            this._setTableHeight();
        },
        methods: {
            _exportGrade() {
                this.exportLoading = true;
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
