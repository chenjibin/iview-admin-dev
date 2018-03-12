<template>
    <div>
        <Row :gutter="10">
            <Col :span="4">
                <fs-dep-tree url="/organize/organizeTree?fatherId=-1"
                             @node-change="_nodeChangeHandler($event)"
                             :defaultProps="defaultProps"></fs-dep-tree>
            </Col>
            <Col :span="20">
                <Card>
                    <Form inline :label-width="60">
                        <FormItem label="岗位">
                            <Input type="text"
                                   v-model="filterOpt.post_name.value"
                                   placeholder="姓名"></Input>
                        </FormItem>
                        <FormItem label="角色">
                            <Select v-model="filterOpt.role_id.value"
                                    clearable
                                    placeholder="筛选角色"
                                    style="width: 100px">
                                <Option :value="item.id" v-for="item, index in roleData" :key="index">{{item.name}}</Option>
                            </Select>
                        </FormItem>
                        <FormItem :label-width="0.1">
                            <ButtonGroup>
                                <Button type="primary" @click="mubanFlag = true">
                                    <Icon type="plus-round"></Icon>
                                    模板设置
                                </Button>
                            </ButtonGroup>
                        </FormItem>
                    </Form>
                    <fs-table-page :columns="postColumns"
                                   :size="null"
                                   :height="tableHeight"
                                   :params="filterOpt"
                                   url="/train/ever_plan_datalist"></fs-table-page>
                </Card>
            </Col>
        </Row>
        <Modal v-model="mubanFlag" width="900" :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>模板设置</span>
            </p>
            <fs-table-page :columns="mubanColumns"
                           :height="300"
                           url="/train/datalist"></fs-table-page>
            <div slot="footer">
                <Button type="primary" style="margin-left: 8px" @click="">添加模板</Button>
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
        name: 'trainPlanManage',
        data () {
            return {
                modelFlag: false,
                mubanFlag: false,
                tableHeight: 300,
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                roleData: [],
                mubanColumns: [
                    {
                        title: '项目名称',
                        align: 'center',
                        key: 'name'
                    },
                    {
                        title: '英文key_text',
                        align: 'center',
                        key: 'key_text'
                    },
                    {
                        title: '参数类型',
                        align: 'center',
                        key: 'key_type'
                    },
                    {
                        title: '备注',
                        align: 'center',
                        key: 'remark'
                    }
                ],
                postColumns: [
                    {
                        title: '时间',
                        key: 'period',
                        align: 'center',
                        width: 160,
                        render: (h, params) => {
                            return moment(params.row.period).format('YYYY-MM-DD');
                        }
                    },
                    {
                        title: '部门',
                        align: 'center',
                        key: 'organize_name'
                    },
                    {
                        title: '岗位',
                        align: 'center',
                        key: 'post_name'
                    },
                    {
                        title: '角色',
                        align: 'center',
                        key: 'role_id',
                        width: 120,
                        render: (h, params) => {
                            let roleName = '';
                            let filterResult = this.roleData.filter(x => x.id === params.row.role_id);
                            if (filterResult.length) roleName = filterResult[0].name;
                            else roleName = params.row.id;
                            return roleName;
                        }
                    },
                    {
                        title: '状态',
                        align: 'center',
                        key: 'torfscore',
                        width: 120,
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
                        key: 'user_name',
                        width: 120
                    },
                    {
                        title: '培训计划',
                        fixed: 'right',
                        align: 'center',
                        width: 80,
                        render: (h, params) => {
                            let vm = this;
                            return h('div', [
                                h('Tooltip', {
                                    props: {
                                        content: '点击查看',
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
                filterOpt: {
                    post_name: {
                        value: '',
                        type: 'input'
                    },
                    role_id: {
                        value: '',
                        type: 'select'
                    },
                    organizeId: {
                        value: 1,
                        type: 'tree'
                    }
                }
            };
        },
        created() {
            this._setTableHeight();
            this._getRoleData();
        },
        methods: {
            downloadFile(url, name) {
                let downloadDom = document.createElement('a');
                downloadDom.href = url;
                downloadDom.download = name;
                downloadDom.click();
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
            },
            _getRoleData() {
                this.$http.get('/role/getAllRole').then((res) => {
                    if (res.success) {
                        this.roleData = res.data;
                    }
                });
            }
        },
        components: {
            fsTablePage,
            fsDepTree
        }
    };
</script>
