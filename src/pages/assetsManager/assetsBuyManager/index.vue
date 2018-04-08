<template>
    <!--资产采购清单-->
    <div id="assetsBuyManager">
        <Card>
            <Form inline :label-width="60">
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
            </Form>
            <fs-table-page ref="fsTable" :columns="postColumns" :size="null" :height="tableHeight" :params="filterOpt" url="assetsApplication/purchaseList"></fs-table-page>
        </Card>
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
        name: 'assetsBuyManager',
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
                    }
                },
                remarks: '',
                cat1: [],
                selectArr: [],
                positionList: [],
                postColumns: [
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
                        title: '审批日期',
                        key: 'modifyByDate',
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
                        title: '申请状态',
                        key: 'approvalStatus',
                        align: 'center',
                        render: (h, params) => {
                            let color = '';
                            let text = '';
                            let vm = this;
                            switch (params.row.approvalstatus) {
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
                                    }
                                }, text)
                            ]);
                        }
                    },
                    {
                        title: '修改规格',
                        width: 100,
                        render: (h, params) => {
                            let vm = this;
                            let row = params.row;
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        icon: 'edit',
                                        shape: 'circle'
                                    },
                                    on: {
                                        click: function() {
                                            let d = {};
                                            d.id = row.id;
                                            d.remarks = row.remarks;
                                            vm.$Modal.confirm({
                                                render: (h) => {
                                                    return h('Input', {
                                                        props: {
                                                            type: 'textarea',
                                                            value: d.remarks,
                                                            autofocus: true,
                                                            placeholder: '输入新规格'
                                                        },
                                                        on: {
                                                            input: (val) => {
                                                                d.remarks = val;
                                                            }
                                                        }
                                                    });
                                                },
                                                onOk() {
                                                    if (d.remarks && d.id) {
                                                        vm.$http.post('assetsApplication/editRemarks', d).then((res) =>{
                                                            if (res.success) {
                                                                vm.$refs.fsTable._filterResultHandler();
                                                                vm.$Message.success('修改成功');
                                                            }
                                                        }).finally(function () {
                                                            vm.$Modal.remove();
                                                        });
                                                    }
                                                }
                                            });
                                        }
                                    }
                                })
                            ]);
                        }
                    }
                ],
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
