<template>
    <div>
        <Card>
            <Form inline :label-width="60">
                <FormItem :label-width="0.1">
                    <ButtonGroup>
                        <Button type="primary" @click="mubanFlag = true">
                            <Icon type="plus-round"></Icon>
                            岗位架构
                        </Button>
                    </ButtonGroup>
                </FormItem>
            </Form>
            <fs-table-page :columns="postColumns"
                           :size="null"
                           :height="tableHeight"
                           url="/train/teacher_datalist"></fs-table-page>
        </Card>
        <Modal v-model="mubanFlag" width="900" :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>岗位架构</span>
            </p>
            <fs-table-page :columns="mubanColumns"
                           :height="300"
                           ref="postAdd"
                           :choosearray.sync="chooseDataArray"
                           url="/train/postDataList"></fs-table-page>
            <div slot="footer">
                <Poptip confirm
                        title="您确认删除所选岗位吗？"
                        transfer
                        @on-ok="_deletePost">
                    <Button style="margin-left: 8px"
                            type="error"
                            :disabled="!chooseDataArray.length">删除</Button>
                </Poptip>
                <Button type="primary"
                        :disabled="!(chooseDataArray.length === 1)"
                        style="margin-left: 8px"
                        @click="">修改</Button>
                <Poptip placement="left" width="400">
                    <Button type="primary"
                            style="margin-left: 8px">添加岗位</Button>
                    <div class="banci-add-form" slot="content">
                        <Form :rules="banciRules"
                              :model="banciForm"
                              ref="banciForm"
                              :label-width="100">
                            <FormItem label="岗位名称" prop="postName">
                                <Input v-model="banciForm.postName"></Input>
                            </FormItem>
                            <FormItem label="备注" prop="remark">
                                <Input v-model="banciForm.remark"></Input>
                            </FormItem>
                            <FormItem>
                                <Button type="primary" @click="_addPost" :loading="banciBtnLoading">添加岗位</Button>
                            </FormItem>
                        </Form>
                    </div>
                </Poptip>
                <Button type="ghost" style="margin-left: 8px" @click="mubanFlag = false">关闭</Button>
            </div>
        </Modal>
        <Modal v-model="modelFlag" width="900" :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>试卷详情</span>
            </p>
            <div slot="footer">
                <Button type="ghost" style="margin-left: 8px" @click="modelFlag = false">取消</Button>
            </div>
        </Modal>
    </div>
</template>
<style>

</style>
<script>
    import fsTablePage from '@/baseComponents/fs-table-page';
    import fsDepTree from '@/baseComponents/fs-dep-tree';
    import moment from 'moment';
    export default {
        name: 'internalTrainerManage',
        data () {
            return {
                modelFlag: false,
                mubanFlag: false,
                banciBtnLoading: false,
                tableHeight: 300,
                chooseDataArray: [],
                banciRules: {
                    postName: [
                        { required: true, message: '岗位名称不能为空', trigger: 'blur' }
                    ]
                },
                banciForm: {
                    postName: '',
                    remark: ''
                },
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                roleData: [],
                mubanColumns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '名称',
                        align: 'center',
                        key: 'name'
                    },
                    {
                        title: '备注',
                        key: 'remark'
                    }
                ],
                postColumns: [
                    {
                        title: '姓名',
                        key: 'user_name',
                        align: 'center',
                        width: 160
                    },
                    {
                        title: '部门',
                        align: 'center',
                        key: 'organize_name'
                    },
                    {
                        title: '岗位',
                        align: 'center',
                        key: 'post_name',
                        width: 100
                    },
                    {
                        title: '编制等级',
                        align: 'center',
                        key: 'level',
                        width: 100
                    },
                    {
                        title: '授课类型',
                        align: 'center',
                        key: 'class_type',
                        width: 200
                    },
                    {
                        title: '授课课题',
                        key: 'class_name'
                    },
                    {
                        title: '授课年限',
                        align: 'center',
                        key: 'class_years',
                        width: 100
                    },
                    {
                        title: '已授课时',
                        align: 'center',
                        key: 'class_times',
                        width: 200
                    },
                    {
                        title: '授课评价',
                        key: 'comment',
                        width: 200
                    },
                    {
                        title: '操作',
                        fixed: 'right',
                        align: 'center',
                        width: 80,
                        render: (h, params) => {
                            let vm = this;
                            return h('div', [
                                h('Tooltip', {
                                    props: {
                                        content: '修改',
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
                                                vm._checkTest(params.row);
                                            }
                                        }
                                    })
                                ])
                            ]);
                        }
                    }
                ],
                filterOpt: {
                    post_name: {
                        value: '',
                        type: 'input'
                    }
                }
            };
        },
        watch: {
            chooseDataArray(val) {
            }
        },
        created() {
            this._setTableHeight();
        },
        methods: {
            formReset (name) {
                this.$refs[name].resetFields();
            },
            _deletePost() {
                let data = {};
                data.ids = this.chooseDataArray.map(x => x.id).join(',');
                this.$http.post('/train/deletePost', data).then((res) => {
                    if (res.success) {
                        this.$refs.postAdd.getListData();
                        this.chooseDataArray = [];
                        this.$Message.success('删除成功！');
                    }
                });
            },
            _addPost() {
                this.$refs.banciForm.validate((valid) => {
                    if (valid) {
                        this.banciBtnLoading = true;
                        let data = {};
                        data.name = this.banciForm.postName;
                        data.remark = this.banciForm.remark;
                        this.$http.post('/train/addPost', data).then((res) => {
                            if (res.success) {
                                this.formReset('banciForm');
                                this.$refs.postAdd.getListData();
                                this.$Message.success('岗位添加成功！');
                            }
                        }).finally(() => {
                            this.banciBtnLoading = false;
                        });
                    }
                });
            },
            _nodeChangeHandler(data) {
                this.filterOpt.organizeId.value = data.id;
            },
            _checkTest(data) {
                this.modelFlag = true;
            },
            _setTableHeight() {
                let dm = document.body.clientHeight;
                this.tableHeight = dm - 280;
            }
        },
        components: {
            fsTablePage,
            fsDepTree
        }
    };
</script>
