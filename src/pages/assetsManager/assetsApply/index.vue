<template>
    <!--资产采购/报废申请-->
    <div id="assetsCategory">
        <Card>
            <div class="center-button-wrapper" v-show="zichanType === 'chooseType'" :style="{minHeight: minHeight}" >
                <div class="btn" @click="zichanType = 'cbType'">
                    进入资产采购/报废申请
                </div>
                <div class="btn" @click="zichanType = 'dbType'">
                    进入资产调拨
                </div>
            </div>
            <div class="" v-show="zichanType !== 'dbType'" >
                <Form inline :label-width="60">
                    <FormItem label="申请类型">
                        <Select type="text" :clearable="true" v-model="filterOpt.appType.value" style="width: 130px">
                            <Option :value="1">采购申请</Option>
                            <Option :value="3">报废申请</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="资产名称">
                        <Cascader style="width: 200px" :data="cat1" @on-change="changeCataName(1, arguments)" :load-data="loadData"></Cascader>
                    </FormItem>
                    <FormItem label="位置名称">
                        <Select type="text" style="width: 180px"
                                @on-change="_inputDebounce"
                                :clearable="true"
                                v-model="filterOpt.positionName.value"
                                placeholder="位置名称">
                            <Option v-for="item, index in positionList" :key="index" :label="item.name" :value="item.name"><span>{{item.name}}</span><span :title="item.remarks" style="float:right;color:#ccc;width:104px;text-overflow: ellipsis;text-align: right;white-space: nowrap;overflow: hidden">{{item.remarks}}</span></Option>
                        </Select>
                    </FormItem>
                    <FormItem label="审批状态">
                        <Select type="text" v-model="filterOpt.approvalStatus.value" :clearable="true" style="width: 160px">
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
                    <Button type="primary"  @click="zichanType = 'dbType'">
                        <span>进入资产调拨</span>
                        <Icon type="arrow-right-c"></Icon>
                    </Button>
                </Form>
                <fs-table-page ref="fsTable" :columns="postColumns" :size="null" :height="tableHeight" :params="filterOpt"
                               url="/assetsApplication/applicationList"></fs-table-page>
            </div>
            <div class="" v-show="zichanType === 'dbType'">
                <assets-allocation :is-common="true" @to-bf="zichanType = 'cbType'"></assets-allocation>
            </div>
        </Card>
        <Modal v-model="addInfoModal" width="320">
            <Form style="margin-top: 25px" :label-width="90" ref="newApplyForm" :model="newApply" :rules="newApplyRules">
                <Input type="text" style="display: none" v-model="newApply.appType"></Input>
                <FormItem label="资产名称" prop="categoryName" v-if="!newApply.id">
                    <Cascader style="width: 180px" v-model="selectArr" :data="cat1" :clearable="true" @on-change="changeCataName(2, arguments)" :load-data="loadData"></Cascader>
                </FormItem>
                <FormItem label="资产名称" v-if="newApply.id">
                    <Input type="text" style="width: 180px" v-model="newApply.categoryName"></Input>
                </FormItem>
                <Input type="text" style="display: none" v-model="newApply.id"></Input>
                <FormItem label="申请数量" prop="num">
                    <InputNumber type="text" :min="1" :max="99" style="width: 180px" v-model="newApply.num"></InputNumber>
                </FormItem>
                <FormItem label="资产位置" prop="positionName">
                    <Select type="text" style="width: 180px"
                            v-model="newApply.positionName"
                            placeholder="资产位置">
                        <Option v-for="item, index in positionList" :key="index" :label="item.name" :value="item.name"><span>{{item.name}}</span><span :title="item.remarks" style="float:right;color:#ccc;width:104px;text-overflow: ellipsis;text-align: right;white-space: nowrap;overflow: hidden">{{item.remarks}}</span></Option>
                    </Select>
                </FormItem>
                <FormItem label="申请规格" prop="remarks">
                    <Input type="text" style="width: 180px" v-model="newApply.remarks" placeholder="规格"></Input>
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
        <Modal v-model="reciveModal">
            <Table :loading="reciveLoading" :height="300"
                   :columns="reciveColumns"
                   :data="reciveList"></Table>
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
    import assetsAllocation from '@/pages/assetsManager/assetsAllocation/index';
    export default {
        name: 'assetsApply',
        components: {
            assetsTree,
            fsTablePage,
            assetsAllocation
        },
        data() {
            return {
                minHeight: '',
                zichanType: 'chooseType',
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
                cat1: [],
                selectArr: [],
                itemsModel: false,
                statusInfo: false,
                reciveModal: false,
                reciveLoading: false,
                reciveAppid: 0,
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
                reciveList: [],
                reciveColumns: [
                    {
                        title: '资产名称',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '资产位置',
                        key: 'positionname',
                        align: 'center'
                    },
                    {
                        title: '资产状态',
                        key: 'appstatus',
                        align: 'center',
                        render: (h, params) => {
                            let text = ['在途', '在用', '备用', '报废'];
                            return text[params.row.appstatus];
                        }
                    },
                    {
                        title: '申请日期',
                        key: 'createbydate',
                        align: 'center',
                        render: (h, params) => {
                            if (!params.row.createbydate) {
                                return '';
                            } else {
                                return params.row.createbydate.substring(0, 10);
                            }
                        }
                    },
                    {
                        title: '操作',
                        align: 'center',
                        render: (h, params) => {
                            var vm = this;
                            return h('Button', {
                                props: {
                                    type: 'success'
                                },
                                on: {
                                    click() {
                                        var d = {};
                                        d.id = params.row.id;
                                        vm.$http.post('assetsManage/getReceive', d).then((r) => {
                                            if (r.success) {
                                                vm.$Message.success('领取成功');
                                                vm.getReciveList(vm.reciveAppid).then((res) => {
                                                    vm.$refs.fsTable._filterResultHandler();
                                                    if (res.data.length === 0) {
                                                        vm.reciveAppid = 0;
                                                        vm.reciveModal = false;
                                                    }
                                                });
                                            }
                                        });
                                    }
                                }
                            }, '领取');
                        }
                    }
                ],
                postColumns: [
                    {
                        title: '申请类型',
                        key: 'apptype',
                        align: 'center',
                        width: 90,
                        render: (h, params) => {
                            if (params.row.apptype === 1) {
                                return h('span', '采购申请');
                            } else if (params.row.apptype === 3) {
                                return h('span', '报废申请');
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
                        align: 'center',
                        width: 90
                    },
                    {
                        title: '资产位置',
                        key: 'positionname',
                        align: 'center',
                        width: 100
                    },
                    {
                        title: '申请规格',
                        key: 'remarks',
                        align: 'center'
                    },
                    {
                        title: '报废方式',
                        key: 'scrappedtype',
                        align: 'center',
                        width: 90,
                        render: (h, params) => {
                            var status = params.row.scrappedtype;
                            if (status === 1) {
                                return h('span', '直接销毁');
                            }
                            if (status === 2) {
                                return h('span', '废品处理');
                            }
                        }
                    },
                    {
                        title: '申请部门',
                        key: 'organizename',
                        align: 'center'
                    },
                    {
                        title: '申请人',
                        key: 'createbyname',
                        align: 'center',
                        width: 90
                    },
                    {
                        title: '申请日期',
                        key: 'createbydate',
                        align: 'center',
                        width: 100,
                        render: (h, params) => {
                            if (!params.row.createbydate) {
                                return '';
                            } else {
                                return h('span', params.row.createbydate.substring(0, 10));
                            }
                        }
                    },
                    {
                        title: '操作',
                        align: 'center',
                        width: 130,
                        render: (h, params) => {
                            var vm = this;
                            var row = params.row;
                            var disable = row.approvalstatus > 0;
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
                        align: 'left',
                        render: (h, params) => {
                            let color = '';
                            let text = '';
                            let vm = this;
                            let disable2 = ((params.row.approvalstatus === 1) && (params.row.apptype === 1));
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
                                case 3:
                                    color = 'green';
                                    text = '已领取';
                                    break;
                            }
                            return h('div', [
                                h('Tag', {
                                    props: {
                                        type: 'border',
                                        color: color
                                    },
                                    attrs: {
                                        title: '点击查看审批流程'
                                    },
                                    nativeOn: {
                                        click: function() {
                                            vm.$http.get('assetsManage/reviewProcess?id=' + params.row.id).then((res) => {
                                                if (res.success) {
                                                    let data = res.data;
                                                    let msg = '';
                                                    let ops = ['审核中', '批准了', '拒绝了'];
                                                    for (let i = 0; i < data.length; i++) {
                                                        let obj = data[i];
                                                        let name = obj.approvalbyname;
                                                        let time = obj.modifybydate;
                                                        let opt = ops[obj.approvalstatus];
                                                        let content = obj.content;
                                                        if (obj.approvalstatus === 0) {
                                                            msg += `<p style='font-size: 16px;'>递交 ${name || ''} 审批中</p>`;
                                                        } else {
                                                            msg += `<div style="border-bottom: 1px solid #cccccc;margin-bottom: 15px"><p style='font-size: 16px;margin-bottom: 5px'>${name || ''}<span style="margin: 0 10px 0 10px">${time || ''}</span>${opt} 此资产 <p><span style="font-size: 14px">备注：${content || ''}</span></p></p></div>`;
                                                        }
                                                    }
                                                    vm.$Modal.info({
                                                        title: '操作记录',
                                                        content: msg
                                                    });
                                                }
                                            });
                                        }
                                    }
                                }, text),
                                h('Tag', {
                                    props: {
                                        type: 'dot',
                                        color: color
                                    },
                                    attrs: {
                                        title: '点击领取'
                                    },
                                    style: {
                                        display: disable2 === true ? 'inline-block' : 'none'
                                    },
                                    nativeOn: {
                                        click: function() {
                                            vm.reciveAppid = params.row.id;
                                            vm.getReciveList(params.row.id).then(() => {
                                                vm.reciveModal = true;
                                            });
                                        }
                                    }
                                }, '领取我')
                            ]);
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
            let dm = document.body.clientHeight - 180;
            this.minHeight = dm + 'px';
            this._setTableHeight();
            this.getPositionList();
            this.loadData(null, null, 1);
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
            loadData(item, callback, type) {
                if (item) {
                    item.loading = true;
                }
                if (!type) {
                    type = item.value;
                }
                let vm = this;
                let d = [];
                this.$http.post('assetsCategory/queryCategoryFather?pid=' + type).then((res) => {
                    var data = res.data;
                    if (res.success) {
                        for (let i = 0; i < data.length; i++) {
                            let tmp = data[i];
                            let obj = {'label': tmp.name, 'value': tmp.id};
                            if (tmp.leaf > 0) {
                                obj.children = [];
                                obj.loading = false;
                            }
                            d.push(obj);
                        }
                        if (item) {
                            item.children = d;
                        } else {
                            vm.cat1 = d;
                        }
                    }
                }).finally((res) => {
                    if (item) {
                        item.loading = false;
                        callback();
                    }
                });
            },
            getReciveList(id) {
                var vm = this;
                vm.reciveLoading = true;
                return new Promise((resolve, reject) => {
                    this.$http.get('assetsManage/receive?id=' + id).then((res) => {
                        if (res.success) {
                            vm.reciveList = res.data;
                            resolve(res);
                        }
                    }).finally(() => {
                        vm.reciveLoading = false;
                    });
                });
            },
            changeCataName(type, arg) {
                var [value, selectedData] = arg;
                if (selectedData.length === 0) {
                    this.filterOpt.categoryName.value = undefined;
                    this.newApply.categoryName = undefined;
                    return;
                }
                if (type === 1) {
                    this.filterOpt.categoryName.value = selectedData[2].label;
                } else {
                    this.newApply.categoryName = selectedData[2].label;
                }
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
                var newApplyForm = this.$refs.newApplyForm;
                newApplyForm.validate((vpass) => {
                    if (vpass) {
                        vm.$http.post('/assetsApplication/add', this.newApply).then((res) => {
                            if (res.success) {
                                vm.$Message.success('保存成功');
                                vm.addInfoModal = false;
                                vm.$refs.fsTable._filterResultHandler();
                                newApplyForm.resetFields();
                            }
                        });
                    }
                });
            },
            addInfo(type) {
                this.selectArr = [];
                this.newApply.id = undefined;
                this.newApply.categoryName = '';
                this.newApply.num = 1;
                this.newApply.remarks = '';
                this.newApply.positionName = '';
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
    .center-button-wrapper{
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        z-index: 2;
        right: 0;
        background-color: rgba(255,255,255,0.7);
        .btn {
            margin-bottom: 40px;
            padding: 32px 0;
            font-size: 30px;
            font-weight: 700;
            color: #fff;
            background-color: #f58875;
            width: 400px;
            text-align: center;
            border-radius: 40px;
            cursor: pointer;
            transition: all 0.35s;
        }
        .btn:hover{
            background-color: rgb(242, 94, 67);
            padding-right: 25px;
        }
    }
</style>
