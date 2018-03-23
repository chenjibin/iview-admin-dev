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
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '试题名称',
                        key: 'name'
                    },
                    {
                        title: '试题分类',
                        align: 'center',
                        width: 100,
                        render: (h, params) => {
                            return (this.subjectList.filter(x => x.id === params.row.subject))[0].name;
                        }
                    },
                    {
                        title: '试题类型',
                        key: 'user_name',
                        align: 'center',
                        width: 100,
                        render: (h, params) => {
                            return this.typeOptMap[params.row.type - 1].label;
                        }
                    },
                    {
                        title: '试题分数',
                        key: 'questionmark',
                        align: 'center',
                        width: 100
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
