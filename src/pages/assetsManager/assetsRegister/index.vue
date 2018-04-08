<template>
    <!--资产管理-->
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
                            <span>{{item.name}}</span><span :title="item.remarks" style="float:right;color:#ccc;width:104px;text-overflow: ellipsis;text-align: right;white-space: nowrap;overflow: hidden">{{item.remarks}}</span>
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="资产状态">
                    <Select :clearable="true" style="width: 180px" v-model="filterOpt.approvalStatus" @on-change="_inputDebounce">
                        <Option :value="0">在途</Option>
                        <Option :value="1">在用</Option>
                        <Option :value="2">备用</Option>
                        <Option :value="3">报废</Option>
                    </Select>
                </FormItem>
                <FormItem :label-width="0.1">
                    <Button type="ghost" v-if="accessBtn.indexOf(29) > -1" @click="addInfo" >新增</Button>
                    <Button type="primary" class="cusBtn" v-if="accessBtn.indexOf(31) > -1" @click="exportExcel" icon="code-download">
                        导出
                    </Button>
                    <Button type="primary" class="cusBtn" v-if="accessBtn.indexOf(32) > -1" icon="upload" @click="attachFilesModal = true">
                        导入
                    </Button>
                </FormItem>
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
        <Modal v-model="addAssetsModal" :width="385">
            <Form style="margin-top: 20px" :label-width="100" ref="addAssetsInfo" :model="addAssetsInfo" :rules="addAssetsInfoRules">
                <Input type="text" style="display: none" v-model="addAssetsInfo.id"></Input>
                <FormItem label="资产名称" v-if="!addAssetsInfo.id" prop="nameId">
                    <Cascader style="width: 180px" :data="cat1" v-model="selectArr2" :load-data="loadData"></Cascader>
                </FormItem>
                <FormItem label="资产名称" v-show="addAssetsInfo.id">
                    <Input style="width: 180px" v-model="addAssetsInfo.name" readonly></Input>
                </FormItem>
                <FormItem label="申请数量" prop="num" v-if="!addAssetsInfo.id">
                    <InputNumber type="text" :min="1" :max="99" style="width: 180px" v-model="addAssetsInfo.num"></InputNumber>
                </FormItem>
                <FormItem label="资产状态">
                    <Select style="width: 180px" v-model="addAssetsInfo.appStatus">
                        <Option :value="0">在途</Option>
                        <Option :value="1">在用</Option>
                        <Option :value="2">备用</Option>
                        <Option :value="3">报废</Option>
                    </Select>
                </FormItem>
                <FormItem label="资产位置" prop="positionName">
                    <Select type="text" style="width: 180px" v-model="addAssetsInfo.positionName" placeholder="位置名称">
                        <Option v-for="item, index in positionList" :label="item.name" :key="index" :value="item.name">
                            <span>{{item.name}}</span><span :title="item.remarks"  style="float:right;color:#ccc;width:104px;text-overflow: ellipsis;text-align: right;white-space: nowrap;overflow: hidden">{{item.remarks}}</span>
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="申请规格" prop="remarks">
                    <Input type="text" style="width: 180px" v-model="addAssetsInfo.remarks" placeholder="规格"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary" size="large" @click="saveInfo">
                    <span>确定</span>
                </Button>
            </div>
        </Modal>
        <Modal v-model="attachFilesModal">
            <Upload accept="application/vnd.ms-excel" :data="{'fileName':'导入资产模版表.xls'}" action="/oa/assetsRegister/importAssetsRecord" name="file" :on-format-error="uploadInfo" :on-success="uploadInfo" type="drag">
                <div style="padding: 20px 0">
                    <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                    <p>点击或者拖拽上传表格</p>
                </div>
            </Upload>
            <div slot="footer">
                <Button type="primary" @click="attachFilesModal = false">关闭</Button>
            </div>
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
                    date: '',
                    approvalStatus: '',
                    positionName: ''
                },
                selectArr2: [],
                addAssetsInfo: {
                    id: 0,
                    name: '',
                    nameId: '',
                    positionName: 0,
                    appStatus: 0,
                    num: 1,
                    remarks: ''
                },
                addAssetsInfoRules: {
                    nameId: [
                        {type: 'number', required: true, message: '资产名称不能为空!', trigger: 'blur'}
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
                accessBtn: [],
                cat1: [],
                selectArr: [],
                positionList: [],
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
                                return h('span', '直接销毁');
                            }
                            if (status === 2) {
                                return h('span', '废品处理');
                            }
                        }
                    },
                    {
                        title: '添加日期',
                        key: 'createbydate',
                        align: 'center'
                    },
                    {
                        title: '修改',
                        align: 'center',
                        render: (h, params) => {
                            let row = params.row;
                            var vm = this;
                            return h('Button', {
                                props: {
                                    type: 'primary',
                                    icon: 'edit',
                                    shape: 'circle'
                                },
                                on: {
                                    click: function() {
                                        vm.addAssetsInfo.appStatus = row.appstatus;
                                        vm.addAssetsInfo.id = row.id;
                                        vm.addAssetsInfo.name = row.name;
                                        vm.addAssetsInfo.num = 1;
                                        vm.addAssetsInfo.remarks = row.remarks;
                                        vm.addAssetsInfo.positionName = row.positionname;
                                        vm.addAssetsModal = true;
                                    }
                                }
                            });
                        }
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
                                        if (this.accessBtn.indexOf(30) > -1) {
                                            this.$http.get('assetsOperateLog/reviewProcess?id=' + params.row.id).then((res) => {
                                                if (res.success) {
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
            this._getPostData();
            this._setTableHeight();
            this.getPositionList();
            this.accessBtn = this.$route.meta.btn.map(x => x.id);
            if (this.accessBtn.indexOf(30) < 0) {
                this.postColumns.splice(7, 1);
            }
            this.loadData(null, null, 1);
        },
        watch: {
            selectArr (arr) {
                [this.filterOpt.category1_id, this.filterOpt.category2_id, this.filterOpt.category3_id] = arr;
                this._inputDebounce();
            },
            selectArr2 (arr) {
                [, , this.addAssetsInfo.nameId] = arr;
            }
        },
        methods: {
            changeInfo(data) {
                this.baseInfo = data;
            },
            exportExcel() {
                var vm = this;
                this.$Modal.confirm({
                    title: '导出资产',
                    okText: '导出',
                    render: (h, params) => {
                        return h('div', {
                            style: {
                                margin: '30px auto',
                                width: '280px'
                            }
                        }, [
                            h('span', {
                                style: {
                                    marginRight: '10px'
                                }
                            }, '选择月份'),
                            h('DatePicker', {
                                props: {
                                    type: 'month',
                                    clearable: true,
                                    value: vm.filterOpt.date
                                },
                                on: {
                                    'on-change': (val) => {
                                        vm.filterOpt.date = val;
                                    }
                                }
                            }),
                            h('p', {
                                style: {
                                    color: '#ccc'
                                }
                            }, '不选月份下载全部')
                        ]);
                    },
                    onOk: () => {
                        let strExport = (vm.filterOpt.category1_id || '') + ',' +
                            (vm.filterOpt.category2_id || '') + ',' +
                            (vm.filterOpt.category3_id || '') + ',' +
                            (vm.filterOpt.approvalStatus || '') + ',' +
                            (vm.filterOpt.positionName || '');
                        var a = document.createElement('a');
                        a.type = 'download';
                        a.href = '/oa/assetsRegister/export?date=' + vm.filterOpt.date + '&strExport=' + strExport;
                        a.style.display = 'none';
                        a.id = 'temp1';
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                    }
                });
            },
            uploadInfo(response, file, fileList) {
                if (response.success) {
                    this._filterResultHandler();
                    this.$Message.success('导入成功');
                    this.attachFilesModal = false;
                } else {
                    this.$Message.error('导入失败' + response.message);
                }
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
                this.$refs.addAssetsInfo.validate((isPass) => {
                    if (isPass) {
                        vm.$http.post('assetsRegister/addAndUpdate', vm.addAssetsInfo).then((res) => {
                            if (res.success) {
                                vm._filterResultHandler();
                                vm.$Message.success('保存成功');
                                vm.addAssetsModal = false;
                                vm.$refs.addAssetsInfo.resetFields();
                            }
                        });
                    }
                });
            },
            addInfo(row) {
                this.addAssetsInfo.appStatus = '';
                this.addAssetsInfo.id = '';
                this.addAssetsInfo.name = '';
                this.addAssetsInfo.num = 1;
                this.addAssetsInfo.remarks = '';
                this.addAssetsInfo.positionName = '';
                this.selectArr2 = [];
                this.addAssetsModal = true;
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

<style lang="less">
    #assetsRegister  {
        .cusBtn {
            span {
                vertical-align: middle;
            }
            i {
                vertical-align: middle;
                font-size: 19px;
            }
        }

    }
</style>
