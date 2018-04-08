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
                                   :height="tableHeight2"
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
        <Modal v-model="editorSettingFlag"
               width="400"
               :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>设置应得学分</span>
            </p>
            <Form :label-width="90"
                  :model="editorSettingData"
                  ref="editorForm">
                <FormItem label="岗位" prop="name">
                    <Input type="text"
                           readonly
                           v-model="editorSettingData.name"></Input>
                </FormItem>
                <FormItem label="岗位部门" prop="name">
                    <Input type="text"
                           readonly
                           v-model="editorSettingData.organizeName"></Input>
                </FormItem>
                <FormItem label="应得学分" prop="name">
                    <InputNumber type="text"
                                 :min="0"
                                 v-model="editorSettingData.post_credit"></InputNumber>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary"
                        :loading="btnLoading"
                        @click="_confirmChange">
                    应用设置
                </Button>
                <Button type="ghost" style="margin-left: 8px" @click="editorSettingFlag = false">取消</Button>
            </div>
        </Modal>
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
                tableHeight2: 300,
                exportLoading: false,
                editorSettingFlag: false,
                btnLoading: false,
                editorSettingData: {
                    name: '',
                    organizeName: '',
                    post_credit: 0,
                    id: ''
                },
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
                    },
                    {
                        title: '操作',
                        width: 80,
                        align: 'center',
                        render: (h, params) => {
                            let vm = this;
                            return h('div', [
                                h('Tooltip', {
                                    props: {
                                        content: '设置学分',
                                        placement: 'top',
                                        transfer: true
                                    }
                                }, [
                                    h('Button', {
                                        props: {
                                            type: 'primary',
                                            icon: 'edit',
                                            shape: 'circle'
                                        },
                                        on: {
                                            click: function() {
                                                vm._changeCredit(params.row);
                                            }
                                        }
                                    })
                                ])
                            ]);
                        }
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
                            return h('span', moment(params.row.class_date).format('YYYY-MM'));
                        }
                    }
                ]
            };
        },
        created() {
            this._setTableHeight();
        },
        methods: {
            initFormData() {
                this.editorSettingData = {
                    name: '',
                    organizeName: '',
                    post_credit: 0,
                    id: ''
                };
            },
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
            _changeCredit(data) {
                this.initFormData();
                this.editorSettingFlag = true;
                let formData = this.editorSettingData;
                formData.id = data.id;
                formData.name = data.name;
                formData.organizeName = data.organizename;
                formData.post_credit = data.post_credit;
            },
            _confirmChange() {
                this.btnLoading = true;
                let formData = this.editorSettingData;
                let data = {};
                data.id = formData.id;
                data.name = formData.name;
                data.organizeName = formData.organizeName;
                data.post_credit = formData.post_credit;
                let storeArr = [];
                storeArr.push(data);
                let sendData = {};
                sendData.jsonArray = JSON.stringify(storeArr);
                this.$http.post('/train/credit_post_update', sendData).then((res) => {
                    if (res.success) {
                        this.editorSettingFlag = false;
                        this.$refs.postTable.getListData();
                        this.$refs.creditTable.getListData();
                        this.$Message.success('学分修改成功!');
                    }
                }).finally(() => {
                    this.btnLoading = false;
                });
            },
            _setTableHeight() {
                let dm = document.body.clientHeight;
                this.tableHeight = dm - 300;
                this.tableHeight2 = dm - 300;
            }
        },
        components: {
            fsTablePage
        }
    };
</script>
