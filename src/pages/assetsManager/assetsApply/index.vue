<template>
    <!--资产分类-->
    <div id="assetsCategory">
        <Card>
            <Form inline :label-width="60">
                <FormItem label="申请类型">
                    <Select type="text" :clearable="true" v-model="filterOpt.appType.value" style="width: 130px">
                        <Option :value="1">采购申请</Option>
                        <Option :value="3">报废申请</Option>
                    </Select>
                </FormItem>
                <FormItem label="资产名称">
                    <Input type="text" v-model="filterOpt.categoryName.value" :clearable="true" style="width: 160px" readonly>
                        <Button slot="append" @click="showItmes(1)" icon="location" style="width: 30px"></Button>
                    </Input>
                </FormItem>
                <FormItem label="位置名称">
                    <Select type="text" style="width: 180px"
                            @on-change="_inputDebounce"
                            :clearable="true"
                            v-model="filterOpt.positionName.value"
                            placeholder="位置名称">
                        <Option v-for="item, index in positionList" :key="index" :value="item.name"><span>{{item.name}}</span><span :title="item.remarks" style="float:right;color:#ccc;width:104px;text-overflow: ellipsis;text-align: right;white-space: nowrap;overflow: hidden">{{item.remarks}}</span></Option>
                    </Select>
                </FormItem>
                <FormItem label="审批状态">
                    <Select type="text" v-model="filterOpt.approvalStatus.value" :clearable="true"  style="width: 160px">
                        <Option :value="0">待审批</Option>
                        <Option :value="1">审批通过</Option>
                        <Option :value="2">审批拒绝</Option>
                        <Option :value="3">已领取</Option>
                    </Select>
                </FormItem>
                <Button type="ghost" @click="addInfo(1)">
                    <Icon type="plus-circled"></Icon>
                    <span>新增采购</span>
                </Button>
                <Button type="ghost" @click="addInfo(3)">
                    <Icon type="plus-circled"></Icon>
                    <span>报废申请</span>
                </Button>
            </Form>
            <fs-table-page ref="fsTable" :columns="postColumns" :size="null" :height="tableHeight" :params="filterOpt"
                           url="/assetsApplication/applicationList"></fs-table-page>

        </Card>
        <Modal v-model="addInfoModal" width="300">
            <Form style="margin-top: 20px" ref="newApplyForm" :model="newApply" :rules="newApplyRules">
                <Input type="text" style="display: none" v-model="newApply.appType"></Input>
                <FormItem label="资产名称" prop="categoryName">
                    <Input type="text" v-model="newApply.categoryName" style="width: 173px" readonly>
                    <Button slot="append" @click="showItmes(2)" icon="location" style="width: 30px"></Button></Input>
                </FormItem>
                <Input type="text" style="display: none" v-model="newApply.id"></Input>
                <FormItem label="申请数量" prop="num">
                    <InputNumber type="text" :min="1" :max="99" style="width: 173px" v-model="newApply.num"></InputNumber>
                </FormItem>
                <FormItem label="资产位置" prop="positionName">
                    <Input type="text" v-model="newApply.positionName" style="width: 173px"></Input>
                </FormItem>
                <FormItem label="申请规格" prop="remarks">
                    <Input type="text" style="width: 173px" v-model="newApply.remarks" placeholder="规格"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary" size="large" @click="saveInfo">
                    <span>确定</span>
                </Button>
            </div>
        </Modal>

        <Modal v-model="itemsModel" width="350">
            <div style="margin: 20px 0"><span>选中：</span><span style="font-weight: bold;font-size: 14px;">{{customerForm.modifyInfo.name||''}}</span></div>
            <div style="height: 390px;overflow: auto;margin-top: 20px">
                <assetsTree width="250px" :expanded="false" v-on:customerForm="getCustomerForm" ref="assetsTree"></assetsTree>
            </div>
            <div slot="footer">
                <Button type="ghost" @click="itemsModel = false;">取消</Button>
                <Button type="primary" @click="ItemChecked">确认</Button>
            </div>
        </Modal>
        <Modal v-model="statusInfo">

        </Modal>
    </div>
</template>

<script>
    // 简单的axios薄层封装
    import pageMixin from '@/mixins/pageMixin';
    // lodash输入延时
    import debounce from 'lodash/debounce';
    import assetsTree from '@/baseComponents/assets-tree.vue';
    import fsTablePage from '@/baseComponents/fs-table-page';
    export default {
        name: 'assetsApply',
        components: {assetsTree, fsTablePage},
        data() {
            return {
                filterOpt: {
                    categoryName: {
                        value: '',
                        type: 'input'
                    },
                    positionName: {
                        value: '',
                        type: 'input'
                    },
                    appType: {
                        value: '',
                        type: 'select'
                    },
                    approvalStatus: {
                        value: '',
                        type: 'select'
                    }
                },
                itemsModel: false,
                statusInfo: false,
                itemsType: 0, // 1查询 2采购申请
                newApplyModal: false,
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                positionList: [],
                customerForm: {
                    addForm: {
                        fname: '',
                        pid: -1,
                        leaf: false
                    },
                    modifyInfo: {
                        pid: -1,
                        name: '',
                        id: -1,
                        leaf: false
                    }

                },
                itemsCheck: {
                    name: '',
                    id: -1
                },
                postColumns: [
                    {
                        title: '申请类型',
                        key: 'apptype',
                        align: 'center',
                        render: (h, params) => {
                            if (params.row.apptype === 1) {
                                return '采购申请';
                            } else if (params.row.apptype === 3) {
                                return '报废申请';
                            }
                        }
                    },
                    {
                        title: '资产名称',
                        key: 'categoryname',
                        align: 'center'
                    },
                    {
                        title: '申请数量',
                        key: 'num',
                        align: 'center'
                    },
                    {
                        title: '资产位置',
                        key: 'positionname',
                        align: 'center'
                    },
                    {
                        title: '申请规格',
                        key: 'remarks',
                        align: 'center'
                    },
                    {
                        title: '报废方式',
                        key: 'scrappedtype',
                        align: 'center'
                    },
                    {
                        title: '申请部门',
                        key: 'organizename',
                        align: 'center'
                    },
                    {
                        title: '申请人',
                        key: 'createbyname',
                        align: 'center'
                    },
                    {
                        title: '申请日期',
                        key: 'createbydate',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        align: 'center',
                        render: (h, params) => {
                            var vm = this;
                            var row = params.row;
                            var disable = row.approvalstatus > 0;
                            console.log(row);
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        icon: 'edit',
                                        shape: 'circle',
                                        disabled: disable
                                    },
                                    on: {
                                        click: function() {
                                            vm.newApply.appType = row.apptype;
                                            vm.newApply.id = row.id;
                                            vm.newApply.categoryName = row.categoryname;
                                            vm.newApply.num = row.num;
                                            vm.newApply.remarks = row.remarks;
                                            vm.newApply.positionName = row.positionname;
                                            vm.addInfoModal = true;
                                        }
                                    }
                                }),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        icon: 'close',
                                        shape: 'circle',
                                        disabled: disable
                                    },
                                    style: {
                                        marginLeft: '10px'
                                    },
                                    on: {
                                        click: function() {
                                            vm.delInfo(row);
                                        }
                                    }
                                })
                            ]);
                        }
                    },
                    {
                        title: '审批进度',
                        key: 'approvalstatus',
                        align: 'center',
                        render: (h, params) => {
                            let color = '';
                            let text = '';
                            switch (params.row.approvalstatus) {
                                case 0:
                                    color = 'blue';
                                    text = '审核中';
                                    break;
                                case 1:
                                    color = 'green';
                                    text = '已批准';
                                    break;
                                case 2:
                                    color = 'red';
                                    text = '已拒绝';
                                    break;
                            }
                            return h('Tag', {
                                props: {
                                    type: 'border',
                                    color: color
                                },
                                on: {
                                    click: function() {

                                    }
                                }
                            }, text);
                        }
                    }
                ],
                changeInfoModal: false,
                addInfoModal: false,
                dataList: [],
                newApply: {
                    id: '',
                    appType: 1,
                    categoryName: '',
                    categoryId: '',
                    num: 1,
                    positionName: '',
                    remarks: ''
                },
                newApplyRules: {
                    categoryName: [
                        {required: true, message: '资产名称不能为空!', trigger: 'blur'}
                    ],
                    num: [
                        {type: 'number', required: true, message: '数量不能为空!', trigger: 'blur'}
                    ],
                    positionName: [
                        {required: true, message: '资产位置不能为空!', trigger: 'blur'}
                    ],
                    remarks: [
                        {required: true, message: '请填写规格或备注', trigger: 'blur'}
                    ]
                },
                tableHeight: 500
            };
        },
        mixins: [pageMixin],
        created() {
            this._setTableHeight();
            this.getPositionList();
        },
        methods: {
            ItemChecked() {
                if (!this.customerForm.modifyInfo.leaf) {
                    this.$Message.warning('请选择子节点哦');
                    return;
                }
                this.itemsCheck = this.customerForm.modifyInfo;
                if (this.itemsType === 1) {
                    this.filterOpt.categoryName.value = this.customerForm.modifyInfo.name;
                } else if (this.itemsType === 2) {
                    this.newApply.categoryName = this.customerForm.modifyInfo.name;
                    this.newApply.categoryId = this.customerForm.modifyInfo.id;
                }
                this.itemsModel = false;
                this.itemsType = 0;
            },
            showItmes(type) {
                this.itemsType = type;
                this.itemsModel = true;
            },
            getPositionList() {
                this.$http.post('assetsApplication/getPostionlist').then((res) => {
                    if (res.success) {
                        this.positionList = res.data;
                    }
                });
            },
            saveInfo() {
                var vm = this;
                var refT = this.$refs.fsTable;
                var newApplyForm = this.$refs.newApplyForm;
                newApplyForm.validate((vpass) => {
                    if (vpass) {
                        vm.$http.post('/assetsApplication/add', this.newApply).then((res) => {
                            if (res.success) {
                                vm.$Message.success('保存成功');
                                vm.addInfoModal = false;
                                refT._filterResultHandler();
                            }
                        });
                    }
                });
            },
            addInfo(type) {
                this.newApply.appType = type;
                this.addInfoModal = true;
            },
            getCustomerForm(customerForm) {
                this.customerForm = customerForm;
            },
            delInfo(row) {
                var vm = this;
                var refT = this.$refs.fsTable;
                var d = {};
                d.id = row.id;
                d.appType = row.apptype;
                if (row.approvalstatus > 0) {
                    this.$Message.info('审批中的资产不能删除');
                    return;
                }
                this.$Modal.confirm({
                    title: '删除提醒',
                    content: '是否确认删除？',
                    okText: '删除',
                    cancelText: '取消',
                    loading: true,
                    onOk () {
                        this.$http.post('/assetsApplication/delete', d).then((res) => {
                            if (res.success) {
                                refT._filterResultHandler();
                                vm.$Modal.remove();
                                vm.$Message.success('删除成功');
                            }
                        });
                    }
                });
            },
            _inputDebounce: debounce(function () {
                this._filterResultHandler();
            }, 1600),
            _setTableHeight () {
                let dm = document.body.clientHeight;
                this.tableHeight = dm - 100 - 20 - 2 - 32 - 10 - 32 - 57 - 7;
            }
        }
    };
</script>

<style lang="less">
</style>
