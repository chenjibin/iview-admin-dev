<template>
    <!--资产位置-->
    <div id="assetsRegister">
        <Card>
            <Form inline :label-width="60">
                <FormItem label="资产名称">
                    <Cascader style="width: 180px" change-on-select :data="cat1" v-model="selectArr"
                              :load-data="loadData"></Cascader>
                </FormItem>
                <FormItem label="资产位置">
                    <Select type="text" style="width: 180px"
                            @on-change="_inputDebounce"
                            :clearable="true"
                            v-model="filterOpt.positionName"
                            placeholder="位置名称">
                        <Option v-for="item, index in positionList" :key="index" :value="item.name">
                            <span>{{item.name}}</span><span :title="item.remarks"
                                                            style="float:right;color:#ccc;width:104px;text-overflow: ellipsis;text-align: right;white-space: nowrap;overflow: hidden">{{item.remarks}}</span>
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="资产状态">
                    <Select :clearable="true" style="width: 180px" v-model="filterOpt.approvalStatus"
                            @on-change="_inputDebounce">
                        <Option :value="0">在途</Option>
                        <Option :value="1">在用</Option>
                        <Option :value="2">备用</Option>
                        <Option :value="3">报废</Option>
                    </Select>
                </FormItem>
                <ButtonGroup>
                    <Button type="ghost" v-if="accessBtn.indexOf(29) > -1">新增</Button>
                    <Button type="ghost" v-if="accessBtn.indexOf(29) > -1">修改</Button>
                </ButtonGroup>
                <ButtonGroup style="margin-left: 15px">
                    <Button type="primary" class="cusBtn" v-if="accessBtn.indexOf(31) > -1" icon="code-download">
                        导出
                    </Button>
                    <Button type="primary" class="cusBtn" v-if="accessBtn.indexOf(32) > -1" icon="upload">
                        导入
                    </Button>
                </ButtonGroup>
            </Form>
            <Table :columns="postColumns"
                   ref="attendanceTable"
                   :loading="tableLoading"
                   :height="tableHeight"
                   :data="pageData.list">
            </Table>
            <Page :total="pageData.totalCount"
                  :current="pageData.page"
                  @on-change="_setPage"
                  @on-page-size-change="_setPageSize"
                  :page-size="pageData.pageSize"
                  placement="top"
                  show-sizer
                  show-total
                  show-elevator
                  style="margin-top: 16px;"></Page>
        </Card>
        <Modal v-model="changeInfoModal" width="300">
            <Form style="margin-top: 20px">
                <input style="display: none" v-model="baseInfo.id"/>
                <FormItem label="位置名称">
                    <Input type="text" style="width: 173px"
                           v-model="baseInfo.name"
                           placeholder="位置名称"></Input>
                </FormItem>
                <FormItem label="位置备注">
                    <Input type="text" style="width: 173px"
                           v-model="baseInfo.remarks"
                           placeholder="位置备注"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary" size="large" @click="saveInfo">
                    <span>确定</span>
                </Button>
            </div>
        </Modal>
        <Modal v-model="addAssetsModal">
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
        <Modal v-model="attachFilesModal">

        </Modal>
    </div>
</template>

<script>
    // 简单的axios薄层封装
    import pageMixin from '@/mixins/pageMixin';
    // lodash输入延时
    import debounce from 'lodash/debounce';
    export default {
        name: 'assetsRegister',
        data() {
            return {
                tableHeight: 500,
                addAssetsModal: false,
                attachFilesModal: false,
                filterOpt: {
                    category1_id: '',
                    category2_id: '',
                    category3_id: '',
                    approvalStatus: '',
                    positionName: ''
                },
                addAssetsInfo: {
                    id: 0,
                    name: '',
                    nameId: 0,
                    positionName: 0,
                    appStatus: 0,
                    num: 1,
                    remarks: ''
                },
                accessBtn: [],
                cat1: [],
                selectArr: [],
                positionList: [],
                baseInfo: {
                    name: '',
                    remarks: ''
                },
                changeInfoModal: false,
                postColumns: [
                    {
                        title: '资产大类',
                        key: 'name1',
                        align: 'center',
                        width: 170
                    },
                    {
                        title: '资产小类',
                        key: 'name2',
                        align: 'center',
                        width: 170
                    },
                    {
                        title: '资产名称',
                        key: 'name',
                        align: 'center',
                        width: 170
                    },
                    {
                        title: '资产位置',
                        key: 'positionname',
                        align: 'center',
                        width: 120
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
                        render: (h, params) => {
                            var status = params.row.scrappedtype;
                            if (status === 1) {
                                return '直接销毁';
                            }
                            if (status === 2) {
                                return '废品处理';
                            }
                        }
                    },
                    {
                        title: '添加日期',
                        key: 'createbydate',
                        align: 'center'
                    },
                    {
                        title: '资产状态',
                        key: 'appstatus',
                        width: 120,
                        align: 'center',
                        render: (h, params) => {
                            // 0 在途 1 在用 2备用 3报废
                            let status = params.row.appstatus;
                            let color = ['blue', 'green', 'blue', 'red'];
                            let text = ['在途', '在用', '备用', '报废'];
                            let vm = this;
                            return h('Tag', {
                                props: {
                                    type: 'border',
                                    color: color[status]
                                },
                                nativeOn: {
                                    click: () => {
                                        console.log(1);
                                        if (this.accessBtn.indexOf(30) > -1) {
                                            this.$http.get('assetsOperateLog/reviewProcess?id=' + params.row.id).then((res) => {
                                                if (res.success) {
                                                    console.log(res);
                                                    let data = res.data;
                                                    let msg = '';

                                                    if (data.length <= 0) {
                                                        vm.$Message.info('不存在操作记录哦');
                                                        return;
                                                    }
                                                    for (let i = 0; i < data.length; i++) {
                                                        let name = data[i].operater_name;
                                                        let time = data[i].opt_time;
                                                        let opt = data[i].assets_type;
                                                        msg += `<p style='font-size: 16px;'>${name}<span style="margin: 0 10px 0 10px">${time}</span>${opt}此资产</p>`;
                                                    }
                                                    vm.$Modal.info({
                                                        title: '操作记录',
                                                        content: msg
                                                    });
                                                }
                                            });
                                        }
                                    }
                                }
                            }, text[status]);
                        }
                    }
                ]
            };
        },
        mixins: [pageMixin],
        created () {
            this.accessBtn = this.$route.meta.btn.map(x => x.id);
            this._getPostData();
            this._setTableHeight();
            this.getPositionList();
            this.loadData(null, null, 1);
        },
        watch: {
            selectArr (arr) {
                console.log(arr);
                [this.filterOpt.category1_id, this.filterOpt.category2_id, this.filterOpt.category3_id] = arr;
                // let j = 0;
                // while (arr[j] !== undefined) {
                // this.filterOpt['category' + (j + 1) + '_id'] = arr[j];
                // j++;
                // }
                this._inputDebounce();
            }
        },
        methods: {
            changeInfo(data) {
                this.baseInfo = data;
            },
            getPositionList() {
                this.$http.post('assetsApplication/getPostionlist').then((res) => {
                    if (res.success) {
                        this.positionList = res.data;
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
            saveInfo() {
                var vm = this;
                vm.$http.post('/assets/add', vm.baseInfo).then((res) => {
                    if (res.success) {
                        vm.$Message.success('保存成功');
                        vm.changeInfoModal = false;
                        vm._filterResultHandler();
                    }
                });
            },
            addInfo() {
                this.baseInfo = {};
                this.changeInfoModal = true;
            },
            delInfo(data) {
                var vm = this;
                this.baseInfo = data;
                this.$Modal.confirm({
                    title: '删除提醒',
                    content: '是否确认删除？',
                    okText: '删除',
                    cancelText: '取消',
                    loading: true,
                    onOk () {
                        this.$http.post('/assets/delete', {id: vm.baseInfo.id}).then((res) => {
                            if (res.success) {
                                vm._filterResultHandler();
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
            _filterResultHandler () {
                this.initPage();
                this._getPostData();
            },
            _setTableHeight () {
                let dm = document.body.clientHeight;
                this.tableHeight = dm - 100 - 20 - 34 - 57 - 49;
            },
            _setPage (page) {
                this.pageData.page = page;
                this._getPostData();
            },
            _setPageSize (size) {
                this.pageData.pageSize = size;
                this._getPostData();
            },
            _getPostData () {
                this.getList('/assetsRegister/appDateList', this.filterOpt);
            }
        }
    };
</script>

<style>
    #assetsRegister .cusBtn {
        display: flex;
        font-size: 18px;
        justify-content: center;
        align-items: center;
    }

    #assetsRegister .cusBtn span {
        font-size: 14px;
        line-height: 14px;
    }
</style>
