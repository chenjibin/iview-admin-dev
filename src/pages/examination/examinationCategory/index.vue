<template>
    <div>
        <Card>
            <Form inline :label-width="60">
                <FormItem label="分类名称">
                    <Input type="text"
                           v-model="filterOpt.cateName.value"
                           placeholder="筛选分类名称"></Input>
                </FormItem>
                <FormItem :label-width="0.1">
                    <ButtonGroup>
                        <Button type="primary" icon="plus-round" @click="_addNewCate">
                           新增
                        </Button>
                    </ButtonGroup>
                </FormItem>
            </Form>
            <fs-table-page :columns="postColumns"
                           :size="null"
                           :height="tableHeight"
                           :params="filterOpt"
                           url="/examtest/getScoreManageList"></fs-table-page>
        </Card>
    </div>
</template>
<script>
    import fsTablePage from '@/baseComponents/fs-table-page';
    export default {
        name: 'examinationCategory',
        data () {
            return {
                editorSettingFlag: false,
                btnLoading: false,
                postFormType: 'update',
                exportLoading: false,
                filterOpt: {
                    cateName: {
                        value: '',
                        type: 'input'
                    }
                },
                postColumns: [
                    {
                        title: '考试名称',
                        key: 'name'
                    },
                    {
                        title: '部门名称',
                        key: 'organizename',
                        align: 'center'
                    },
                    {
                        title: '考试人',
                        key: 'stuname',
                        align: 'center',
                        width: 100
                    },
                    {
                        title: '考试时间',
                        key: 'starttime',
                        align: 'center',
                        width: 160
                    },
                    {
                        title: '考试时长(分钟)',
                        key: 'totletime',
                        align: 'center',
                        width: 120
                    },
                    {
                        title: '总分',
                        key: 'score',
                        align: 'center',
                        width: 100
                    },
                    {
                        title: '排名',
                        key: 'ranking',
                        align: 'center',
                        width: 100
                    }
                ],
                tableHeight: 500
            };
        },
        created() {
            this._setTableHeight();
        },
        methods: {
            _addNewCate() {
            },
            _setTableHeight() {
                let dm = document.body.clientHeight;
                this.tableHeight = dm - 260;
            }
        },
        components: {
            fsTablePage
        }
    };
</script>
