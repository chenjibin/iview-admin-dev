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
                        <Button type="ghost">
                            <Icon type="ios-cloud-download-outline"></Icon>
                            导出
                        </Button>
                    </ButtonGroup>
                </FormItem>
            </Form>
            <fs-table-page :columns="postColumns"
                           :size="null"
                           :height="tableHeight"
                           :params="filterOpt"
                           url="/examtest/getScoreManageList"></fs-table-page>
            <Modal v-model="editorSettingFlag"
                   width="300"
                   :mask-closable="false">
                <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                    <span>导出考勤</span>
                </p>
                <Form>
                    <FormItem label="是否下架">
                        <i-switch v-model="editorSettingData.isDown" size="large">
                            <span slot="open">上架</span>
                            <span slot="close">下架</span>
                        </i-switch>
                    </FormItem>
                    <FormItem label="商品名称">
                        <Input type="text"
                               v-model="editorSettingData.name"
                               placeholder=""></Input>
                    </FormItem>
                    <FormItem label="所属分类">
                        <Select v-model="editorSettingData.type"
                                placeholder=""
                                style="width: 100px">
                            <Option value="纸品类">纸品类</Option>
                            <Option value="饮品类">饮品类</Option>
                            <Option value="纸品类">食品类</Option>
                            <Option value="饮品类">卡券类</Option>
                            <Option value="饮品类">服饰类</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="价格">
                        <Input type="text"
                               v-model="editorSettingData.price"
                               placeholder=""></Input>
                    </FormItem>
                    <FormItem label="考勤月份">
                        <DatePicker type="month"
                                    placeholder="筛选考勤月份"
                                    @on-change=""
                                    :value="editorSettingData.month"></DatePicker>
                    </FormItem>
                </Form>
                <div slot="footer">
                    <Button type="primary"
                            :loading="btnLoading"
                            @click="">
                        添加商品
                    </Button>
                    <Button type="ghost" style="margin-left: 8px" @click="editorSettingFlag = false">取消</Button>
                </div>
            </Modal>
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
                editorSettingData: {
                    name: '',
                    type: '',
                    price: '',
                    isDown: '',
                    month: ''
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
            _initEditorSettingData() {
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
