<template>
    <div>
        <Card>
            <Form inline :label-width="60">
                <FormItem label="试卷名称">
                    <Input type="text"
                           v-model="filterOpt.name.value"
                           placeholder="筛选试卷"></Input>
                </FormItem>
                <FormItem label="试卷状态">
                    <Select v-model="filterOpt.status.value"
                            clearable
                            placeholder="筛选状态"
                            style="width: 100px">
                        <Option :value="item.status" v-for="item, index in statusList" :key="index">{{item.name}}</Option>
                    </Select>
                </FormItem>
                <FormItem :label-width="0.1">
                    <ButtonGroup>
                        <Button type="primary" @click="editorSettingFlag = true">
                            <Icon type="plus-round"></Icon>
                            添加试卷
                        </Button>
                    </ButtonGroup>
                    <ButtonGroup>
                        <Button type="primary">
                            <Icon type="plus-round"></Icon>
                            添加试卷(随机)
                        </Button>
                    </ButtonGroup>
                </FormItem>
            </Form>
            <fs-table-page :columns="postColumns"
                           :size="null"
                           :height="tableHeight"
                           :params="filterOpt"
                           url="/exampaper/getPaperList"></fs-table-page>
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
        name: 'paperManage',
        data () {
            return {
                editorSettingFlag: false,
                btnLoading: false,
                postFormType: 'update',
                statusList: [
                    {
                        status: 1,
                        name: '待发布'
                    },
                    {
                        status: 2,
                        name: '已发布'
                    },
                    {
                        status: 3,
                        name: '已关闭'
                    }
                ],
                filterOpt: {
                    name: {
                        value: '',
                        type: 'input'
                    },
                    status: {
                        value: '',
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
                        title: '试卷名称',
                        key: 'name'
                    },
                    {
                        title: '总分',
                        key: 'totlemark',
                        align: 'center',
                        width: 100
                    },
                    {
                        title: '状态',
                        key: 'user_name',
                        align: 'center',
                        width: 100,
                        render: (h, params) => {
                            return this.statusList[params.row.status - 1].name;
                        }
                    },
                    {
                        title: '创建人',
                        key: 'createbyname',
                        align: 'center',
                        width: 100
                    },
                    {
                        title: '创建时间',
                        key: 'createbydate',
                        align: 'center',
                        width: 200
                    },
                    {
                        title: '操作',
                        key: 'user_name',
                        align: 'center',
                        width: 400
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
