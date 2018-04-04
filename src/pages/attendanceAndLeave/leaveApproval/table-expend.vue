<template>
    <div>
        <Card :dis-hover="true">
            <Row :gutter="16">
                <Col :span="12">
                    <Row class="expand-row">
                        <Col span="24">
                        <template v-if="row.type === '调休'">
                            <span class="expand-key" style="font-weight: 700;">{{row.type}}: </span>
                            <span class="expand-value" v-html="row.tiaoxiulog"></span>
                        </template>
                        <template v-else>
                            <span class="expand-key" style="font-weight: 700;">{{row.type}}: </span>
                            <span class="expand-value">从{{row.start}} 到 {{row.end}}</span>
                        </template>
                        </Col>
                        <Col span="24">
                            <span class="expand-key" style="font-weight: 700;">请假原因: </span>
                            <span class="expand-value">{{ row.reason}}</span>
                        </Col>
                    </Row>
                </Col>
                <Col :span="12">
                    <div style="color:#19be6b;font-weight: 700;">审批进度:</div>
                    <div class="">
                        <ul>
                            <li v-for="(item, index) in progressData" :key="'progress' + index + '-' + row.id">
                                {{item}}
                            </li>
                        </ul>
                        <div class="" v-if="row.refusereason">
                            <p style="color: #2b85e4">拒绝理由:</p>
                            <span v-html="row.refusereason"></span>
                        </div>
                        <div class="" v-if="row.agreeinformation">
                            <p style="color: #2b85e4">备注留言:</p>
                            <span v-html="row.agreeinformation.replace(/&nbsp/g, '')"></span>
                        </div>
                        <div class="" style="margin-top: 8px;">
                            <Poptip placement="left"
                                    v-model="visible"
                                    v-if="userName === row.waitoperatorname"
                                    width="400">
                                <Button type="primary" size="small">立即审核</Button>
                                <div class="" slot="content">
                                    <Form :label-width="100"
                                          :model="odForm"
                                          ref="odFormFo"
                                          :rules="odFormRules">
                                        <FormItem label="是否同意">
                                            <RadioGroup v-model="odForm.agree">
                                                <Radio label="同意">同意</Radio>
                                                <Radio label="拒绝">拒绝</Radio>
                                            </RadioGroup>
                                        </FormItem>
                                        <FormItem label="备注留言" prop="content">
                                            <Input v-model="odForm.content"
                                                   type="textarea"
                                                   :autosize="{minRows: 2,maxRows: 5}"
                                                   placeholder="备注..."></Input>
                                        </FormItem>
                                        <FormItem label="工作安排"
                                                  prop="workDesc"
                                                  v-show="row.numberday >= 3 && odForm.agree ==='同意'">
                                            <Input v-model="odForm.workDesc"
                                                   type="textarea"
                                                   :autosize="{minRows: 2,maxRows: 5}"
                                                   placeholder="工作安排说明..."></Input>
                                        </FormItem>
                                        <FormItem>
                                            <Button type="primary" @click="_submitOdResult">提交审核</Button>
                                            <Button type="ghost" @click="visible = false" style="margin-left: 8px">取消</Button>
                                        </FormItem>
                                    </Form>
                                </div>
                            </Poptip>
                            <Poptip placement="left"
                                    v-model="visible2"
                                    v-if="userName === row.currentoperator && row.status === '批准中'"
                                    width="400" :transfer="true">
                                <Button type="primary" size="small">修改</Button>
                                <div class="" slot="content">
                                    <Form :label-width="100"
                                          :model="odChangeForm"
                                          ref="odFormFoC"
                                          :rules="odFormRules">
                                        <FormItem label="备注留言" prop="content">
                                            <Input v-model="odChangeForm.content"
                                                   type="textarea"
                                                   :autosize="{minRows: 2,maxRows: 5}"
                                                   placeholder="备注..."></Input>
                                        </FormItem>
                                        <FormItem label="工作安排"
                                                  prop="workDesc">
                                            <Input v-model="odChangeForm.workDesc"
                                                   type="textarea"
                                                   :autosize="{minRows: 2,maxRows: 5}"
                                                   placeholder="工作安排说明..."></Input>
                                        </FormItem>
                                        <FormItem>
                                            <Button type="primary"
                                                    :loading="btnLoading"
                                                    @click="_submitOdChange">提交修改</Button>
                                            <Button type="ghost" @click="visible2 = false" style="margin-left: 8px">取消</Button>
                                        </FormItem>
                                    </Form>
                                </div>
                            </Poptip>
                        </div>
                    </div>
                </Col>
            </Row>
        </Card>
    </div>
</template>
<style>

</style>
<script>
    export default {
        props: {
            row: Object
        },
        data() {
            return {
                progressData: this.row.operatelog.split(','),
                visible: false,
                visible2: false,
                btnLoading: false,
                odChangeForm: {
                    content: this.row.content,
                    workDesc: this.row.workcontent
                },
                odForm: {
                    agree: '同意',
                    content: '',
                    workDesc: ''
                },
                odFormRules: {
                    content: [
                        {validator: this.validaContent, required: true, trigger: 'blur'}
                    ],
                    workDesc: [
                        {validator: this.validaWorkDesc, required: true, trigger: 'blur'}
                    ]
                }
            };
        },
        created() {
        },
        computed: {
            userName() {
                return this.$store.state.user.userInfo.realname;
            }
        },
        methods: {
            validaContent(rule, value, callback) {
                if (value === '') {
                    callback(new Error('备注留言不能为空!'));
                } else {
                    callback();
                }
            },
            validaWorkDesc(rule, value, callback) {
                if (value === '' && this.row.numberday >= 3 && this.odForm.agree === '同意') {
                    callback(new Error('排班说明不能为空!'));
                } else {
                    callback();
                }
            },
            _submitOdChange() {
                this.$refs.odFormFoC.validate((valid) => {
                    if (valid) {
                        let data = {};
                        data.id = this.row.id;
                        data.content = this.odChangeForm.content;
                        data.workcontent = this.odChangeForm.workDesc;
                        this.btnLoading = true;
                        this.$http.post('/od/editContent', data).then((res) => {
                            if (res.success) {
                                this.$Message.success('操作成功!');
                                this.$emit('op-success');
                            }
                        }).finally(() => {
                            this.btnLoading = false;
                        });
                    }
                });
            },
            _submitOdResult() {
                this.$refs.odFormFo.validate((valid) => {
                    if (valid) {
                        let data = {};
                        data.id = this.row.id;
                        data.agree = this.odForm.agree === '同意' ? 1 : 2;
                        data.content = this.odForm.content;
                        if (this.row.numberday >= 3) {
                            data.workDesc = this.odForm.workDesc;
                        }
                        this.btnLoading = true;
                        this.$http.post('/od/updateStatus', data).then((res) => {
                            if (res.success) {
                                this.$Message.success('操作成功!');
                                this.$emit('op-success');
                            }
                        }).finally(() => {
                            this.btnLoading = false;
                        });
                    }
                });
            }
        }
    };
</script>
