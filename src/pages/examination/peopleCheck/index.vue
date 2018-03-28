<template>
    <div>
        <Card>
            <Form inline :label-width="60">
                <FormItem label="考试名称">
                    <Input type="text"
                           v-model="filterOpt.name.value"
                           placeholder="筛选试卷"></Input>
                </FormItem>
            </Form>
            <fs-table-page :columns="postColumns"
                           :size="null"
                           :height="tableHeight"
                           :params="filterOpt"
                           url="/examtestpaper/getTestPaperList"></fs-table-page>
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
        name: 'peopleCheck',
        data () {
            return {
                editorSettingFlag: false,
                btnLoading: false,
                postFormType: 'update',
                filterOpt: {
                    name: {
                        value: '',
                        type: 'input'
                    },
                    status: {
                        value: 3,
                        type: 'select'
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
                        title: '试卷名称',
                        key: 'papername'
                    },
                    {
                        title: '考试时间',
                        key: 'starttime',
                        align: 'center',
                        width: 160
                    },
                    {
                        title: '考试时长',
                        key: 'totletime',
                        align: 'center',
                        width: 160
                    },
                    {
                        title: '总分',
                        key: 'totlemark',
                        align: 'center',
                        width: 120
                    },
                    {
                        title: '结束时间',
                        key: 'modifybydate',
                        align: 'center',
                        width: 200
                    },
                    {
                        title: '操作',
                        key: 'user_name',
                        align: 'center',
                        width: 160
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
