<template>
    <div>
        <Form inline :label-width="60"  @submit.native.prevent>
            <FormItem label="试题名称">
                <Input type="text"
                       v-model="filterOpt.name.value"
                       placeholder="筛选试题名称"></Input>
            </FormItem>
            <FormItem label="试题分类">
                <Select v-model="filterOpt.subject.value"
                        clearable
                        placeholder="筛选分类"
                        style="width: 160px">
                    <Option :value="item.id" v-for="item, index in subjectList" :key="index">{{item.name}}</Option>
                </Select>
            </FormItem>
            <FormItem label="试题类型">
                <Select v-model="filterOpt.type.value"
                        clearable
                        placeholder="筛选类型"
                        style="width: 160px">
                    <Option :value="item.value" v-for="item, index in typeOptMap" :key="index">{{item.label}}</Option>
                </Select>
            </FormItem>
        </Form>
        <fs-table-page :columns="postColumns"
                       :size="null"
                       :height="500"
                       :params="filterOpt"
                       ref="tablePage"
                       url="/examquestion/findQuestionList"></fs-table-page>
    </div>
</template>
<style>

</style>
<script>
    import fsTablePage from '@/baseComponents/fs-table-page';
    export default {
        name: 'paperQuestionList',
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
                            shape: 'circle'
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
                subjectList: [],
                filterOpt: {
                    name: {
                        value: '',
                        type: 'input'
                    },
                    subject: {
                        value: '',
                        type: 'select'
                    },
                    type: {
                        value: '',
                        type: 'select'
                    },
                    id: {
                        value: this.id,
                        type: 'select'
                    }
                },
                postColumns: [
                    {
                        title: '试题名称',
                        key: 'name'
                    },
                    {
                        title: '试题分类',
                        align: 'center',
                        width: 100,
                        render: (h, params) => {
                            return h('span', (this.subjectList.filter(x => x.id === params.row.subject))[0].name);
                        }
                    },
                    {
                        title: '试题类型',
                        key: 'user_name',
                        align: 'center',
                        width: 100,
                        render: (h, params) => {
                            return h('span', this.typeOptMap[params.row.type - 1].label);
                        }
                    },
                    {
                        title: '试题分数',
                        key: 'questionmark',
                        align: 'center',
                        width: 100
                    },
                    {
                        title: '操作',
                        key: 'user_name',
                        fixed: 'right',
                        align: 'center',
                        width: 60,
                        render: (h, params) => {
                            let vm = this;
                            return h('div', [
                                colBtn(vm, h, params, {content: '加入试卷', icon: 'arrow-right-c', foo: vm._addToPaper})
                            ]);
                        }
                    }
                ],
                typeOptMap: [
                    {
                        value: '1',
                        label: '单选题'
                    },
                    {
                        value: '2',
                        label: '多选题'
                    },
                    {
                        value: '3',
                        label: '判断题'
                    },
                    {
                        value: '4',
                        label: '填空题'
                    },
                    {
                        value: '5',
                        label: '问答题'
                    }
                ]
            };
        },
        created() {
            this._getSubjectList();
        },
        methods: {
            _updateList() {
                this.$refs.tablePage.getListData();
            },
            _addToPaper(row) {
                let data = {};
                data.id = this.id;
                data.questionIds = row.id;
                this.$http.post('/exampaper/paperAddQuestion', data).then((res) => {
                    if (res.success) {
                        this.$refs.tablePage.getListData();
                        this.$emit('add-success');
                    }
                });
            },
            _getSubjectList() {
                this.$http.get('/examquestion/getSubjectList').then((res) => {
                    if (res.success) {
                        this.subjectList = res.data;
                    }
                });
            }
        },
        components: {
            fsTablePage
        }
    };
</script>
