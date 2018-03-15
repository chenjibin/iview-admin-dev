<template>
    <div>
        <Card>
            <Form inline :label-width="60">
                <FormItem label="试卷名称">
                    <Input type="text"
                           v-model="filterOpt.paperName.value"
                           placeholder="筛选试卷"></Input>
                </FormItem>
                <FormItem label="部门名称">
                    <Input type="text"
                           v-model="filterOpt.orgName.value"
                           placeholder="筛选部门"></Input>
                </FormItem>
                <FormItem label="参考人">
                    <Input type="text"
                           v-model="filterOpt.name.value"
                           placeholder="筛选参考人"></Input>
                </FormItem>
                <FormItem :label-width="0.1">
                    <ButtonGroup>
                        <Button type="primary" :loading="exportLoading" icon="ios-cloud-download-outline" @click="_exportGrade">
                            <span v-if="!exportLoading">导出</span>
                            <span v-else>导出中...</span>
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
        name: 'gradeManage',
        data () {
            return {
                editorSettingFlag: false,
                btnLoading: false,
                postFormType: 'update',
                exportLoading: false,
                filterOpt: {
                    paperName: {
                        value: '',
                        type: 'input'
                    },
                    orgName: {
                        value: '',
                        type: 'input'
                    },
                    name: {
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
            downloadFile(url, name) {
                let downloadDom = document.createElement('a');
                downloadDom.href = url;
                downloadDom.download = name;
                downloadDom.click();
            },
            _exportGrade() {
                this.exportLoading = true;
                let data = {};
                let filterOpt = this.filterOpt;
                data.paperName = filterOpt.paperName.value;
                data.orgName = filterOpt.orgName.value;
                data.name = filterOpt.name.value;
                this.$http.post('/examtest/export', data).then((res) => {
                    if (res.success) {
                        this.downloadFile('/oa/upload/' + res.data, res.data);
                    }
                }).finally(() => {
                    this.exportLoading = false;
                });
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
