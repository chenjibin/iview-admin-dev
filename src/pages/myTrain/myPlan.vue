<template>
    <div>
        <Collapse>
            <Panel name="1">
                我的计划
                <div slot="content">
                    <fs-table-page :columns="postColumns"
                                   :height="300"
                                   url="/train/ever_plan_mine_datalist"></fs-table-page>
                </div>
            </Panel>
        </Collapse>
    </div>
</template>
<style>

</style>
<script>
    import fsTablePage from '@/baseComponents/fs-table-page';
    export default {
        name: 'myPlan',
        data () {
            return {
                postColumns: [
                    {
                        title: '时间',
                        key: 'name',
                        width: 120
                    },
                    {
                        title: '部门',
                        key: 'stuname',
                        align: 'center'
                    },
                    {
                        title: '岗位',
                        align: 'center',
                        key: 'score',
                    },
                    {
                        title: '角色',
                        align: 'center',
                        key: 'totletime',
                    },
                    {
                        title: '状态',
                        align: 'center',
                        key: 'ranking',
                    },
                    {
                        title: '负责人',
                        align: 'center',
                        key: 'sumstu',
                    },
                    {
                        title: '操作',
                        align: 'center',
                        width: 80,
                        render: (h, params) => {
                            let vm = this;
                            return h('div', [
                                h('Tooltip', {
                                    props: {
                                        content: '查看试卷',
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
                ]
            };
        },
        created() {
            this._getMyPlan();
        },
        methods: {
            _getMyPlan() {
                let data = {};
                data.page = 1;
                data.pageSize = 50;
                this.$http.get('/train/ever_plan_mine_datalist', {params: data}).then((res) => {
                    console.log(res);
                });
            }
        },
        components: {
            fsTablePage
        }
    };
</script>
