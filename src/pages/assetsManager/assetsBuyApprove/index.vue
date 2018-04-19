<template>
    <!--资产采购报废审批-->
    <div id="assetsBuyApprove">
        <Card>
            <Form inline :label-width="60">
                <FormItem label="申请类型" v-if="canSeeDestroy">
                    <Select type="text" :clearable="true" v-model="filterOpt.appType.value" style="width: 130px">
                        <Option :value="1">采购申请</Option>
                        <Option :value="3">报废申请</Option>
                    </Select>
                </FormItem>
                <FormItem label="资产名称">
                    <Cascader style="width: 180px" :data="cat1" @on-change="changeCataName" :clearable="true" :load-data="loadData"></Cascader>
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
                    </Select>
                </FormItem>
            </Form>
            <fs-table-page ref="fsTable" :columns="postColumns" :size="null" :height="tableHeight" :params="filterOpt" url="assetsManage/dataList"></fs-table-page>

        </Card>
        <Modal v-model="approvalInfoModal">
            <Form style="margin-top: 20px" :label-width="120" ref="approveForm" :model="approvalInfo" :rules="newApplyRules">
                <Input type="text" style="display: none" v-model="approvalInfo.id"></Input>
                <Input type="text" style="display: none" v-model="approvalInfo.approvalStatus"></Input>
                <FormItem label="资产名称">
                    <Input style="width: 180px" v-model="approvalInfo.cname" readonly></Input>
                </FormItem>
                <FormItem label="资产位置">
                    <Input style="width: 180px" v-model="approvalInfo.positionName" readonly></Input>
                </FormItem>
                <FormItem label="资产规格">
                    <Input style="width: 180px" v-model="approvalInfo.rmark" readonly></Input>
                </FormItem>
                <Input v-model="approvalInfo.apptype" style="display: none"></Input>
                <FormItem label="申请数量" prop="num">
                    <InputNumber type="text" :min="1" :max="99" style="width: 180px" v-model="approvalInfo.num"></InputNumber>
                </FormItem>
                <FormItem label="报废方式" v-if="approvalInfo.apptype === 3" prop="scrappedType">
                    <Select v-model="approvalInfo.scrappedType" style="width: 180px">
                        <Option :value="1">直接销毁</Option>
                        <Option :value="2">废品处理</Option>
                    </Select>
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
    // 简单的axios薄层封装
    import pageMixin from '@/mixins/pageMixin';
    // lodash输入延时
    import debounce from 'lodash/debounce';
    import assetsTree from '@/baseComponents/assets-tree.vue';
    import fsTablePage from '@/baseComponents/fs-table-page';
    export default {
        name: 'assetsBuyApprove',
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
                        value: 1,
                        type: 'select'
                    },
                    approvalStatus: {
                        value: '',
                        type: 'select'
                    }
                },
                itemsType: 0, // 1查询 2采购申请
                cat1: [],
                selectArr: [],
                positionList: [],
                canSeeDestroy: false,
                postColumns: [
                    {
                        title: '申请类型',
                        key: 'apptype',
                        align: 'center',
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
                        width: 90
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
                        align: 'center',
                        width: 120
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
                        title: '审批进度',
                        key: 'see_flag',
                        align: 'left',
                        sortType: 'asc',
                        render: (h, params) => {
                            let color = '';
                            let text = '';
                            let vm = this;
                            let appBtnStatus = params.row.see_flag === 0;
                            switch (params.row.see_flag) {
                                case 0:
                                    color = 'blue';
                                    text = '审核中';
                                    break;
                                case 3:
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
                                            vm.$http.get('assetsManage/reviewProcess?id=' + params.row.id).then((res) => {
                                                if (res.success) {
                                                    let data = res.data;
                                                    let msg = '';
                                                    let ops = ['审核中', '批准了', '拒绝了'];
                                                    let colors = ['blue', 'green', 'red', 'blue'];
                                                    for (let i = 0; i < data.length; i++) {
                                                        let obj = data[i];
                                                        let name = obj.approvalbyname;
                                                        let time = obj.modifybydate;
                                                        let opt = ops[obj.approvalstatus];
                                                        let content = obj.content;
                                                        let remarks = obj.remarks;
                                                        let colorMe = colors[obj.approvalstatus];
                                                        console.log(content, remarks);
                                                        if (obj.approvalstatus === 0) {
                                                            msg += `<p style='font-size: 16px;'>递交 ${name || ''} 审批中</p>`;
                                                        } else {
                                                            msg += `<div style="border-bottom: 1px solid #cccccc;margin-bottom: 15px"><p style='font-size: 16px;margin-bottom: 5px'>${name || ''}<span style="margin: 0 10px 0 10px">${time || ''}</span><span style="color: ${colorMe}">${opt}</span> 此资产<p><span style="font-size: 14px;display: ${content ? 'block' : 'none'}">备注：${content || ''}</span></p><p><span style="font-size: 14px;line-height: 2;display: ${remarks ? 'block' : 'none'}">变动：${remarks || ''}</span></p></p></div>`;
                                                        }
                                                    }
                                                    vm.$Modal.info({
                                                        title: '操作记录',
                                                        width: 400,
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
                                                vm.$http.get('assetsApplication/find?id=' + params.row.id).then((res) => {
                                                    if (res.success) {
                                                        let data = res.data;
                                                        vm.approvalInfo.id = data.id;
                                                        vm.approvalInfo.num = data.num;
                                                        vm.approvalInfo.cname = data.categoryname;
                                                        vm.approvalInfo.positionName = data.positionname;
                                                        vm.approvalInfo.approvalStatus = data.approvalstatus;
                                                        vm.approvalInfo.rmark = data.remarks;
                                                        vm.approvalInfo.apptype = data.apptype;
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
                dataList: [],
                approvalInfoModal: false,
                approvalInfo: {
                    id: '',
                    num: 1,
                    approvalStatus: 0,
                    content: '',
                    rmark: '',
                    cname: '',
                    scrappedType: '',
                    positionName: '',
                    apptype: 1
                },
                newApplyRules: {
                    num: [
                        {type: 'number', required: true, message: '请填写数量!', trigger: 'blur'}
                    ],
                    scrappedType: [
                        {type: 'number', required: true, message: '请填写报废方式!', trigger: 'change'}
                    ],
                    content: [
                        {required: true, message: '请填写审批意见', trigger: 'blur'}
                    ]
                },
                tableHeight: 500
            };
        },
        mixins: [pageMixin],
        created() {
            this._setTableHeight();
            this.getPositionList();
            this.loadData(null, null, 1);
            this.accessBtn = this.$route.meta.btn.map(x => x.id);
            if (this.accessBtn.indexOf(34) > -1) {
                this.canSeeDestroy = true;
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
            changeCataName(value, selectedData) {
                if (selectedData.length === 0) {
                    this.filterOpt.categoryName.value = undefined;
                    return;
                }
                this.filterOpt.categoryName.value = selectedData[2].label;
            },
            approval(type) {
                if (!type) {
                    return;
                }
                this.approvalInfo.approvalStatus = type;
                var vm = this;
                var refT = this.$refs.fsTable;
                this.$http.post('assetsManage/approval', vm.approvalInfo).then((res) => {
                    if (res.success) {
                        vm.$Message.success('审批成功');
                        vm.approvalInfoModal = false;
                        refT._filterResultHandler();
                    }
                });
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
