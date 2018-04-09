<template>
    <div id="assetsAllocation">
        <Card v-if="!isCommon">
            <Form inline :label-width="90">
                <FormItem label="资产名称">
                    <Cascader style="width: 180px" :data="cat1" @on-change="changeCataName(1, arguments)" :load-data="loadData"></Cascader>
                </FormItem>
                <FormItem label="移入位置名称">
                    <Select type="text" style="width: 180px"
                            :clearable="true"
                            v-model="filterOpt.inPositionName.value"
                            placeholder="位置名称">
                        <Option v-for="item, index in positionList" :key="index" :value="item.name"><span>{{item.name}}</span><span :title="item.remarks" style="float:right;color:#ccc;width:104px;text-overflow: ellipsis;text-align: right;white-space: nowrap;overflow: hidden">{{item.remarks}}</span></Option>
                    </Select>
                </FormItem>
                <Input style="display: none" v-model="filterOpt.type.value"></Input>
                <FormItem label="移出位置名称">
                    <Select type="text" style="width: 180px"
                            :clearable="true"
                            v-model="filterOpt.outPositionName.value"
                            placeholder="位置名称">
                        <Option v-for="item, index in positionList" :key="index" :value="item.name"><span>{{item.name}}</span><span :title="item.remarks" style="float:right;color:#ccc;width:104px;text-overflow: ellipsis;text-align: right;white-space: nowrap;overflow: hidden">{{item.remarks}}</span></Option>
                    </Select>
                </FormItem>
                <FormItem label="审批状态">
                    <Select type="text" v-model="filterOpt.approvalStatus.value" :clearable="true"  style="width: 160px">
                        <Option :value="0">待审批</Option>
                        <Option :value="1">审批通过</Option>
                        <Option :value="2">审批拒绝</Option>
                    </Select>
                </FormItem>
                <Button type="ghost" @click="addInfo">
                    <Icon type="plus-circled"></Icon>
                    <span>调拨申请</span>
                </Button>
            </Form>
            <fs-table-page ref="fsTable" :columns="postColumns" :size="null" :height="tableHeight" :params="filterOpt" :url="getListUrl"></fs-table-page>
        </Card>
        <div class="" v-else>
            <Form inline :label-width="90">
                <FormItem label="资产名称">
                    <Cascader style="width: 180px" :data="cat1" @on-change="changeCataName(1, arguments)" :load-data="loadData"></Cascader>
                </FormItem>
                <FormItem label="移入位置名称">
                    <Select type="text" style="width: 180px"
                            :clearable="true"
                            v-model="filterOpt.inPositionName.value"
                            placeholder="位置名称">
                        <Option v-for="item, index in positionList" :key="index" :value="item.name"><span>{{item.name}}</span><span :title="item.remarks" style="float:right;color:#ccc;width:104px;text-overflow: ellipsis;text-align: right;white-space: nowrap;overflow: hidden">{{item.remarks}}</span></Option>
                    </Select>
                </FormItem>
                <Input style="display: none" v-model="filterOpt.type.value"></Input>
                <FormItem label="移出位置名称">
                    <Select type="text" style="width: 180px"
                            :clearable="true"
                            v-model="filterOpt.outPositionName.value"
                            placeholder="位置名称">
                        <Option v-for="item, index in positionList" :key="index" :value="item.name"><span>{{item.name}}</span><span :title="item.remarks" style="float:right;color:#ccc;width:104px;text-overflow: ellipsis;text-align: right;white-space: nowrap;overflow: hidden">{{item.remarks}}</span></Option>
                    </Select>
                </FormItem>
                <FormItem label="审批状态">
                    <Select type="text" v-model="filterOpt.approvalStatus.value" :clearable="true"  style="width: 160px">
                        <Option :value="0">待审批</Option>
                        <Option :value="1">审批通过</Option>
                        <Option :value="2">审批拒绝</Option>
                    </Select>
                </FormItem>
                <Button type="ghost" @click="addInfo">
                    <Icon type="plus-circled"></Icon>
                    <span>调拨申请</span>
                </Button>
                <Button type="primary" @click="$emit('to-bf')">
                    <span>进入资产采购/报废申请</span>
                    <Icon type="arrow-right-c"></Icon>
                </Button>
            </Form>
            <fs-table-page ref="fsTable" :columns="postColumns" :size="null" :height="tableHeight" :params="filterOpt" :url="getListUrl"></fs-table-page>
        </div>
        <Modal v-model="addInfoModal" width="400">
            <Form style="margin-top: 20px" :label-width="120" ref="newApplyForm" :model="newApply" :rules="newApplyRules">
                <Input type="text" style="display: none" v-model="newApply.id"></Input>
                <FormItem label="资产名称" v-show="!newApply.id" prop="categoryName" >
                    <Cascader style="width: 180px" v-model="selectArr" :data="cat1" :clearable="true" @on-change="changeCataName(2, arguments)" :load-data="loadData"></Cascader>
                </FormItem>
                <FormItem label="资产名称" v-if="newApply.id">
                    <Input style="width: 180px" v-model="newApply.categoryName" readonly></Input>
                </FormItem>
                <FormItem label="申请数量" prop="num">
                    <InputNumber :min="1" :max="99" style="width: 180px" v-model="newApply.num"></InputNumber>
                </FormItem>
                <FormItem label="移入资产位置" prop="inPositionName">
                    <Select type="text" prop="positionName" style="width: 180px" v-model="newApply.inPositionName" placeholder="位置名称">
                        <Option v-for="item, index in positionList" :key="index" :value="item.name"><span>{{item.name}}</span><span :title="item.remarks" style="float:right;color:#ccc;width:104px;text-overflow: ellipsis;text-align: right;white-space: nowrap;overflow: hidden">{{item.remarks}}</span></Option>
                    </Select>
                </FormItem>
                <FormItem label="移出资产位置" prop="outPositionName">
                    <Select type="text" prop="positionName" style="width: 180px" v-model="newApply.outPositionName" placeholder="位置名称">
                        <Option v-for="item, index in positionList" :key="index" :value="item.name"><span>{{item.name}}</span><span :title="item.remarks" style="float:right;color:#ccc;width:104px;text-overflow: ellipsis;text-align: right;white-space: nowrap;overflow: hidden">{{item.remarks}}</span></Option>
                    </Select>
                </FormItem>
                <FormItem label="申请备注" prop="remarks">
                    <Input type="text" style="width: 180px" v-model="newApply.remarks" prop="remarks" placeholder="规格"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary" size="large" @click="saveInfo">
                    <span>保存</span>
                </Button>
            </div>
        </Modal>
        <Modal v-model="approvalInfoModal">
            <Form style="margin-top: 20px" :label-width="120" ref="approveForm" :model="approvalInfo" :rules="newApplyRules">
                <Input type="text" style="display: none" v-model="approvalInfo.id"></Input>
                <Input type="text" style="display: none" v-model="approvalInfo.approvalStatus"></Input>
                <FormItem label="资产名称">
                    <Input style="width: 180px" v-model="approvalInfo.cname" readonly></Input>
                </FormItem>
                <FormItem label="申请数量" prop="num">
                    <InputNumber type="text" :min="1" :max="99" style="width: 180px" v-model="approvalInfo.num"></InputNumber>
                </FormItem>
                <FormItem label="移入资产位置">
                    <Input style="width: 180px" v-model="approvalInfo.inname" readonly></Input>
                </FormItem>
                <FormItem label="移出资产位置">
                    <Input style="width: 180px" v-model="approvalInfo.outname" readonly></Input>
                </FormItem>
                <FormItem label="审批内容" prop="content">
                    <Input type="textarea" style="width: 180px" v-model="approvalInfo.content" prop="remarks" placeholder="规格"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button size="large" @click="approval(2)">
                    <span>拒绝</span>
                </Button>
                <Button type="success" size="large" @click="approval(1)">
                    <span>通过</span>
                </Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import fsTablePage from '@/baseComponents/fs-table-page';
    export default {
        name: 'assetsAllocation',
        props: {
            isCommon: {
                type: Boolean,
                default: false
            }
        },
        components: {fsTablePage},
        data() {
            return {
                filterOpt: {
                    categoryName: {
                        value: '',
                        type: 'input'
                    },
                    type: {
                        value: 1,
                        type: 'input'
                    },
                    inPositionName: {
                        value: '',
                        type: 'select'
                    },
                    outPositionName: {
                        value: '',
                        type: 'select'
                    },
                    approvalStatus: {
                        value: 0,
                        type: 'select'
                    }
                },
                statusInfo: false,
                cat1: [],
                getListUrl: '/assetsAllocation/dataList',
                itemsType: 0, // 1查询 2采购申请
                newApplyModal: false,
                positionList: [],
                postColumns: [
                    {
                        title: '资产名称',
                        key: 'categoryname',
                        align: 'center'
                    },
                    {
                        title: '调拨数量',
                        key: 'num',
                        align: 'center'
                    },
                    {
                        title: '移入资产位置',
                        key: 'inpositionname',
                        width: 120,
                        align: 'center'
                    },
                    {
                        title: '移出资产位置',
                        key: 'outpositionname',
                        width: 120,
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
                                            vm.newApply.id = row.id;
                                            vm.newApply.categoryName = row.categoryname;
                                            vm.newApply.num = row.num;
                                            vm.newApply.remarks = row.remarks;
                                            vm.newApply.inPositionName = row.inpositionname;
                                            vm.newApply.outPositionName = row.outpositionname;
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
                        title: '调拨状态',
                        key: 'approvalstatus',
                        align: 'left',
                        render: (h, params) => {
                            let color = '';
                            let text = '';
                            let vm = this;
                            let row = params.row;
                            var appBtnStatus = (vm.accessBtn.indexOf(33) > -1) && (row.approvalstatus === 0);
                            switch (row.approvalstatus) {
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
                                            vm.$http.get('assetsAllocation/reviewProcess?id=' + row.id).then((res) => {
                                                if (res.success) {
                                                    let data = res.data;
                                                    let msg = '';
                                                    let ops = ['审核中', '批准了', '拒绝了'];
                                                    if (data.length <= 0) {
                                                        msg = '<p style="font-size: 16px;">资产审批中，耐心等待</p>';
                                                    } else {
                                                        for (let i = 0; i < data.length; i++) {
                                                            let name = data[i].approvalbyname;
                                                            let time = data[i].modifybydate;
                                                            let opt = ops[data[i].approvalstatus];
                                                            msg += `<p style='font-size: 16px;'>${name || ''}<span style="margin: 0 10px 0 10px">${time || ''}</span>${opt} 此资产</p>`;
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
                                    style: {
                                        display: appBtnStatus ? 'inline-block' : 'none'
                                    },
                                    attrs: {
                                        title: '点击开始审批'
                                    },
                                    nativeOn: {
                                        click: function() {
                                            vm.$refs.approveForm.resetFields();
                                            if (appBtnStatus) {
                                                vm.$http.get('assetsAllocation/find?id=' + params.row.id).then((res) => {
                                                    if (res.success) {
                                                        let data = res.data;
                                                        vm.approvalInfo.id = data.id;
                                                        vm.approvalInfo.num = data.num;
                                                        vm.approvalInfo.cname = data.categoryname;
                                                        vm.approvalInfo.inname = data.inpositionname;
                                                        vm.approvalInfo.outname = data.outpositionname;
                                                        vm.approvalInfo.approvalStatus = data.approvalstatus;
                                                        vm.approvalInfoModal = true;
                                                    } else {
                                                        vm.$Message.error('无法审批');
                                                    }
                                                });
                                            }
                                        }
                                    }
                                }, '审批我')
                            ]);
                        }
                    }
                ],
                changeInfoModal: false,
                addInfoModal: false,
                approvalInfoModal: false,
                dataList: [],
                selectArr: [],
                accessBtn: [],
                newApply: {
                    id: '',
                    categoryName: '',
                    num: 1,
                    inPositionName: '',
                    outPositionName: '',
                    remarks: ''
                },
                approvalInfo: {
                    id: '',
                    num: 1,
                    cname: '',
                    inname: '',
                    outname: '',
                    approvalStatus: 0,
                    content: ''
                },
                newApplyRules: {
                    categoryName: [
                        {required: true, message: '资产名称不能为空!', trigger: 'change'}
                    ],
                    num: [
                        {type: 'number', required: true, message: '数量不能为空!', trigger: 'blur'}
                    ],
                    inPositionName: [
                        {required: true, message: '资产位置不能为空!', trigger: 'change'}
                    ],
                    outPositionName: [
                        {required: true, message: '资产位置不能为空!', trigger: 'change'}
                    ],
                    remarks: [
                        {required: true, message: '请填写规格或备注', trigger: 'blur'}
                    ],
                    content: [
                        {required: true, message: '请填写审批内容', trigger: 'blur'}
                    ]
                },
                tableHeight: 500
            };
        },
        created() {
            this._setTableHeight();
            this.getPositionList();
            this.loadData();
            if (!this.isCommon) this.accessBtn = this.$route.meta.btn.map(x => x.id);
            if (this.accessBtn.indexOf(33) > -1) {
                this.filterOpt.type.value = 0;
            }
        },
        methods: {
            getPositionList() {
                this.$http.post('assetsApplication/getPostionlist').then((res) => {
                    if (res.success) {
                        this.positionList = res.data;
                    }
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
            loadData(item, callback) {
                let type;
                if (item) {
                    type = item.value;
                    item.loading = true;
                } else {
                    type = 1;
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
            saveInfo() {
                var vm = this;
                var refT = this.$refs.fsTable;
                var newApplyForm = this.$refs.newApplyForm;
                newApplyForm.validate((vpass) => {
                    if (vpass) {
                        vm.$http.post('/assetsAllocation/add', this.newApply).then((res) => {
                            if (res.success) {
                                vm.$Message.success('保存成功');
                                vm.addInfoModal = false;
                                newApplyForm.resetFields();
                                refT._filterResultHandler();
                            }
                        });
                    }
                });
            },
            approval(type) {
                if (!type) {
                    return;
                }
                this.approvalInfo.approvalStatus = type;
                var vm = this;
                var refT = this.$refs.fsTable;
                this.$http.post('assetsAllocation/approval', vm.approvalInfo).then((res) => {
                    if (res.success) {
                        vm.$Message.success('审批成功');
                        vm.approvalInfoModal = false;
                        refT._filterResultHandler();
                    }
                });
            },
            addInfo() {
                this.newApply.id = '';
                this.newApply.categoryName = '';
                this.newApply.num = 0;
                this.newApply.inPositionName = '';
                this.newApply.outPositionName = '';
                this.newApply.remarks = '';
                this.selectArr = [];
                this.addInfoModal = true;
            },
            delInfo(row) {
                var vm = this;
                var refT = this.$refs.fsTable;
                var d = {};
                d.id = row.id;
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
                        this.$http.post('/assetsAllocation/delete', d).then((res) => {
                            if (res.success) {
                                refT._filterResultHandler();
                                vm.$Modal.remove();
                                vm.$Message.success('删除成功');
                            }
                        });
                    }
                });
            },
            _setTableHeight () {
                let dm = document.body.clientHeight;
                this.tableHeight = dm - 260;
            }
        }
    };
</script>

<style lang="less">
</style>
