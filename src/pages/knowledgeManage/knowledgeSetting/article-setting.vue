<template>
    <div>
        <Form inline :label-width="60">
            <FormItem label="文章标题">
                <Input type="text"
                       v-model="filterOpt.userName.value"
                       placeholder="筛选文章"></Input>
            </FormItem>
            <FormItem :label-width="0.1">
                <ButtonGroup>
                    <Button type="ghost">
                        <Icon type="ios-cloud-upload-outline"></Icon>
                        新建文章
                    </Button>
                </ButtonGroup>
            </FormItem>
        </Form>
        <fs-table-page :columns="postColumns"
                       :size="null"
                       :height="tableHeight"
                       :params="filterOpt"
                       :choosearray.sync="chooseDataArr"
                       ref="attendanceTable"
                       url="/kq/getStatisticList"></fs-table-page>
    </div>
</template>
<style lang="less">

</style>
<script>
    import fsTablePage from '@/baseComponents/fs-table-page';
    export default {
        name: 'ArticleSetting',
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
                chooseDataArr: [],
                tableHeight: 500,
                filterOpt: {

                },
                postColumns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '文章标题',
                        key: 'organizename',
                        align: 'center'
                    },
                    {
                        title: '文章主图',
                        key: 'states',
                        align: 'center',
                        width: 120,
                        render: (h, params) => {

                        }
                    },
                    {
                        title: '操作',
                        width: 100,
                        render: (h, params) => {
                            let vm = this;
                            return h('div', [
                                colBtn(vm, h, params, {content: '修改文章', icon: 'compose', foo: vm._articleEditor}),
                                colBtn(vm, h, params, {content: '查看评论', icon: 'compose', foo: vm._checkArticleCommon})
                            ]);
                        }
                    }
                ]
            };
        },
        methods: {
            _checkArticleCommon() {
            },
            _articleEditor() {
            }
        },
        components: {
            fsTablePage
        }
    };
</script>
