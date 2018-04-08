<template>
    <div>
        <Collapse>
            <Panel name="1">
                我的计划
                <div slot="content">
                    <fs-table-page :columns="postColumns"
                                   :height="300"
                                   ref="planList"
                                   url="/train/ever_plan_mine_datalist"></fs-table-page>
                </div>
            </Panel>
        </Collapse>
        <Modal v-model="modelFlag" width="600" :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>培训计划</span>
            </p>
            <fs-form :label-width="80"
                     :item-list="itemList"
                     ref="formPlan"
                     v-model="trainData"></fs-form>
            <div slot="footer">
                <Button type="primary" style="margin-left: 8px" @click="_submitPlan">提交计划</Button>
                <Button type="ghost" style="margin-left: 8px" @click="modelFlag = false">取消</Button>
            </div>
        </Modal>
    </div>
</template>
<style>

</style>
<script>
    import fsTablePage from '@/baseComponents/fs-table-page';
    import fsForm from '@/baseComponents/fs-form/form';
    import moment from 'moment';
    export default {
        name: 'myPlan',
        data () {
            return {
                modelFlag: false,
                itemList: [],
                trainData: {},
                postColumns: [
                    {
                        title: '时间',
                        key: 'name',
                        width: 120,
                        render: (h, params) => {
                            return h('span', moment(params.row.period).format('YYYY-MM'));
                        }
                    },
                    {
                        title: '状态',
                        align: 'center',
                        render: (h, params) => {
                            return h('Tag', {
                                props: {
                                    type: 'border',
                                    color: +params.row.status === 1 ? 'green' : 'red'
                                }
                            }, +params.row.status === 1 ? '已设置' : '未设置');
                        }
                    },
                    {
                        title: '负责人',
                        align: 'center',
                        key: 'user_name'
                    },
                    {
                        title: '培训计划',
                        align: 'center',
                        width: 100,
                        render: (h, params) => {
                            let vm = this;
                            return h('div', [
                                h('Tooltip', {
                                    props: {
                                        content: '查看计划',
                                        placement: 'top',
                                        transfer: true
                                    }
                                }, [
                                    h('Button', {
                                        props: {
                                            type: 'primary',
                                            icon: 'eye',
                                            shape: 'circle'
                                        },
                                        on: {
                                            click: function() {
                                                vm._checkTest(params.row);
                                            }
                                        }
                                    })
                                ])
                            ]);
                        }
                    }
                ],
                planId: 0
            };
        },
        created() {
            this._getMyPlan();
        },
        methods: {
            _updatePlanList() {
                this.$refs.planList.getListData();
            },
            _submitPlan() {
                this.$refs.formPlan.validForm(() => {
                    let sendData = JSON.parse(JSON.stringify(this.trainData));
                    sendData.id = this.planId;
                    this.$http.post('/train/ever_plan_para_add', sendData).then((res) => {
                        if (res.success) {
                            this.modelFlag = false;
                            this.$Message.success('计划提交成功!');
                            this._updatePlanList();
                        }
                    });
                });
            },
            _checkTest(data) {
                this.$refs.formPlan.resetForm();
                let sendData = {};
                sendData.id = data.id;
                this.planId = data.id;
                this.$http.post('/train/plan_para_select', sendData).then((res) => {
                    if (res.success) {
                        let formItems = res.data.field;
                        let formList = [];
                        let trainData = {};
                        formItems.forEach(item => {
                            let obj = {};
                            obj.type = 'input';
                            trainData[item.name] = item.value;
                            switch (item.xtype) {
                                case 'numberfield':
                                    obj.type = 'number';
                                    break;
                                case 'textarea':
                                    obj.type = 'textarea';
                                    break;
                            }
                            obj.label = item.fieldLabel;
                            obj.key = item.name;
                            obj.value = item.value || '';
                            obj.required = true;
                            formList.push(obj);
                        });
                        this.itemList = formList;
                        this.trainData = trainData;
                    }
                });
                this.modelFlag = true;
            },
            _getMyPlan() {
                let data = {};
                data.page = 1;
                data.pageSize = 50;
                this.$http.get('/train/ever_plan_mine_datalist', {params: data}).then((res) => {
                });
            }
        },
        components: {
            fsTablePage,
            fsForm
        }
    };
</script>
