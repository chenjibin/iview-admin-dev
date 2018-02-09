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
                                    width="400" :transfer="true">
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
                                                  v-show="row.numberday >= 3">
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
                userName: '',
                visible: false,
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
            this.userName = this.$store.state.user.userInfo.userName;
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
                if (value === '' && this.row.numberday >= 3) {
                    callback(new Error('备注留言不能为空!'));
                } else {
                    callback();
                }
            },
            _submitOdResult() {
                this.$refs.odFormFo.validate((valid) => {
                    if (valid) {
                        console.log('aaa');
                    }
                });
            }
        }
    };
</script>
