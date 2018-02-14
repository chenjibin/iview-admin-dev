<template>
    <Card>
        <Row type="flex" class="user-infor">
            <Col span="8">
                <Row class-name="made-child-con-middle" type="flex" align="middle">
                    <img class="avator-img" :src="avatorPath" />
                </Row>
            </Col>
            <Col span="16" style="padding-left:6px;">
                <Row class-name="made-child-con-middle" type="flex" align="middle">
                    <div>
                        <b class="card-user-infor-name">{{userInfo.userName}}</b>
                        <p>{{userInfo.organizeName + '（' + userInfo.postName + '）'}}</p>
                    </div>
                </Row>
            </Col>
        </Row>
        <div class="line-gray"></div>
        <Row class="margin-top-8">
            <Col span="8">
                <span style="font-weight: 700;">金币余额:</span>
                <span style="font-size: 24px;">{{userInfo.tmCoin}}</span>
            </Col>
            <Col span="16" class="padding-left-8">
            <Poptip placement="right" width="400">
                <div class="api" slot="content">
                </div>
                <Tooltip placement="top" content="修改头像" :transfer="true">
                    <Button type="ghost" shape="circle" icon="person"></Button>
                </Tooltip>
            </Poptip>
            <Poptip placement="right" width="400" v-model="pwsFlag">
                <div class="api" slot="content">
                    <Form :label-width="80"
                          :model="passWordForm"
                          ref="psdForm"
                          :rules="passWordRule">
                        <FormItem label="原始密码" prop="orpwd">
                            <Input v-model="passWordForm.orpwd" placeholder="请输入原始密码"></Input>
                        </FormItem>
                        <FormItem label="新密码" prop="newpwd">
                            <Input v-model="passWordForm.newpwd" placeholder="请输入新密码"></Input>
                        </FormItem>
                        <FormItem label="重复新密码" prop="repnewpwd">
                            <Input v-model="passWordForm.repnewpwd" placeholder="请输重复新密码"></Input>
                        </FormItem>
                        <FormItem>
                            <Button type="primary" @click="_submitChangePwd">提交修改</Button>
                            <Button type="ghost" style="margin-left: 8px" @click="pwsFlag = false">取消</Button>
                        </FormItem>
                    </Form>
                </div>
                <Tooltip placement="top" content="修改密码" :transfer="true">
                    <Button type="ghost" shape="circle" icon="lock-combination"></Button>
                </Tooltip>
            </Poptip>

                <Tooltip placement="top" content="商品订单" :transfer="true">
                    <Button type="ghost" shape="circle" icon="android-list"></Button>
                </Tooltip>
            </Col>
        </Row>
    </Card>
</template>
<style lang="less">
    @import "../home.less";
    @import "../../../styles/common.less";
</style>
<script>
    import Cookies from 'js-cookie';
    export default {
        data () {
            return {
                pwsFlag: false,
                passWordForm: {
                    orpwd: '',
                    newpwd: '',
                    repnewpwd: ''
                },
                passWordRule: {
                    orpwd: [
                        {required: true, message: '原始密码不能为空!', trigger: 'blur'}
                    ],
                    newpwd: [
                        {required: true, message: '新密码不能为空!', trigger: 'blur'}
                    ],
                    repnewpwd: [
                        {required: true, message: '重复新密码不能为空!', trigger: 'blur'}
                    ]
                },
                userInfo: null
            };
        },
        created() {
            this.userInfo = JSON.parse(Cookies.get('userInfo'));
        },
        methods: {
            _submitChangePwd() {
                this.$refs.psdForm.validate((valid) => {
                    if (valid) {
                    }
                });
            }
        },
        computed: {
            avatorPath () {
                return localStorage.avatorImgPath;
            }
        },
        components: {}
    };
</script>
