<template>
    <div>
        <Form inline :label-width="60"  @submit.native.prevent>
            <FormItem label="部门">
                <Input type="text"
                       v-model="filterOpt.organizeName.value"
                       placeholder="筛选部门"></Input>
            </FormItem>
            <FormItem label="岗位">
                <Input type="text"
                       v-model="filterOpt.postName.value"
                       placeholder="筛选岗位"></Input>
            </FormItem>
            <FormItem label="姓名">
                <Input type="text"
                       v-model="filterOpt.realName.value"
                       placeholder="筛选姓名"></Input>
            </FormItem>
            <FormItem>
                <ButtonGroup>
                    <Button type="primary"
                            :disabled="!chooseDataArr.length"
                            :loading="btnLoading"
                            @click="_allHandler">
                        <Icon type="plus-round"></Icon>
                        批量加入
                    </Button>
                </ButtonGroup>
            </FormItem>
        </Form>
        <fs-table-page :columns="postColumns"
                       :size="null"
                       :height="500"
                       :params="filterOpt"
                       :pageSizeOpt="[20, 60, 100, 1000]"
                       :choosearray.sync="chooseDataArr"
                       ref="tablePage"
                       url="/user/getAddStuTest"></fs-table-page>
    </div>
</template>
<style>

</style>
<script>
    import fsTablePage from '@/baseComponents/fs-table-page';
    export default {
        name: 'peopleChoose',
        props: {
            id: {
                type: [Number, String]
            }
        },
        watch: {
            id(val) {
                this.filterOpt.id.value = val;
            }
        },
        data () {
            const colBtn = (vm, h, params, {content, icon, foo}) => {
                return h('Tooltip', {
                    props: {
                        content: content,
                        placement: 'top',
                        transfer: true
                    }
                }, [
                    h('Button', {
                        props: {
                            type: 'primary',
                            icon: icon,
                            shape: 'circle',
                            loading: vm.btnLoading
                        },
                        style: {
                            margin: '0 2px'
                        },
                        on: {
                            click: function () {
                                foo(params.row);
                            }
                        }
                    })
                ]);
            };
            return {
                chooseDataArr: [],
                btnLoading: false,
                filterOpt: {
                    organizeName: {
                        value: '',
                        type: 'input'
                    },
                    postName: {
                        value: '',
                        type: 'input'
                    },
                    realName: {
                        value: '',
                        type: 'input'
                    },
                    id: {
                        value: this.id,
                        type: 'select'
                    }
                },
                postColumns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '姓名',
                        key: 'realname',
                        width: 100
                    },
                    {
                        title: '部门',
                        align: 'center',
                        key: 'organizename'
                    },
                    {
                        title: '岗位',
                        key: 'postname',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        key: 'user_name',
                        align: 'center',
                        width: 60,
                        render: (h, params) => {
                            let vm = this;
                            return h('div', [
                                colBtn(vm, h, params, {content: '加入考试', icon: 'arrow-right-c', foo: vm._addToPaper})
                            ]);
                        }
                    }
                ]
            };
        },
        methods: {
            _allHandler() {
                this.btnLoading = true;
                let data = {};
                data.id = this.id;
                data.stuIds = this.chooseDataArr.map(x => x.id).join(',');
                this.$http.post('/examtestpaper/testAddUser', data).then((res) => {
                    if (res.success) {
                        this.$refs.tablePage.getListData();
                        this.$emit('add-success');
                    }
                }).finally(() => {
                    this.btnLoading = false;
                });
            },
            _updateList() {
                this.$refs.tablePage.getListData();
            },
            _addToPaper(row) {
                this.btnLoading = true;
                let data = {};
                data.id = this.id;
                data.stuIds = row.id;
                this.$http.post('/examtestpaper/testAddUser', data).then((res) => {
                    if (res.success) {
                        this.$refs.tablePage.getListData();
                        this.$emit('add-success');
                    }
                }).finally(() => {
                    this.btnLoading = false;
                });
            }
        },
        components: {
            fsTablePage
        }
    };
</script>
