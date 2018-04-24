<template>
    <Card>
        <Row type="flex" class="user-infor">
            <Col span="8">
                <Row class-name="made-child-con-middle" type="flex" align="middle">
                    <img class="avator-img"
                         :src="avatorPath"
                         style="border-radius: 50%;"/>
                </Row>
            </Col>
            <Col span="16" style="padding-left:6px;">
                <Row class-name="made-child-con-middle" type="flex" align="middle">
                    <div>
                        <b class="card-user-infor-name">{{userName}}</b>
                        <p style="font-size: 1.3em;color: #666">{{organizeName + '（' + postName + '）'}}</p>
                        <p style="font-size: 1.1em;line-height: 1;color: #999;letter-spacing: 2px;">{{companyName}}</p>
                    </div>
                </Row>
            </Col>
        </Row>
        <div class="line-gray"></div>
        <Row class="margin-top-8">
            <Col span="8">
                <span style="font-weight: 700;">金币余额:</span>
                <span style="font-size: 24px;">{{tmCoin}}</span>
                <Poptip placement="right-start" width="1200" v-model="coinDescFlag" :transfer="true">
                    <div slot="content" style="white-space: normal;max-height: 600px;overflow: auto;">
                        <img src="../../../images/coin_rule_01.jpg"  style="max-width: 100%;"/>
                        <img src="../../../images/coin_rule_02.jpg"  style="max-width: 100%;"/>
                        <img src="../../../images/coin_rule_03.jpg"  style="max-width: 100%;"/>
                        <img src="../../../images/coin_rule_04.jpg"  style="max-width: 100%;"/>
                        <img src="../../../images/coin_rule_05.jpg"  style="max-width: 100%;"/>
                        <img src="../../../images/coin_rule_06.jpg"  style="max-width: 100%;"/>
                        <img src="../../../images/coin_rule_07.jpg"  style="max-width: 100%;"/>
                        <img src="../../../images/coin_rule_08.jpg"  style="max-width: 100%;"/>
                    </div>
                    <span style="cursor: pointer;" @click="coinDescFlag = true">
                        <Icon type="help-circled"></Icon>
                    </span>
                </Poptip>

            </Col>
            <Col span="16" class="padding-left-8">
                <Tooltip placement="top" content="修改头像" :transfer="true">
                    <Button type="ghost"
                            @click="changeAvatorFlag = true"
                            shape="circle" icon="person"></Button>
                </Tooltip>
                <Poptip placement="right" width="400" v-model="pwsFlag">
                    <div slot="content">
                        <Form :label-width="80"
                              :model="passWordForm"
                              ref="psdForm"
                              :rules="passWordRule">
                            <FormItem label="原始密码" prop="oldPwd">
                                <Input v-model="passWordForm.oldPwd"
                                       type="password"
                                       placeholder="请输入原始密码"></Input>
                            </FormItem>
                            <FormItem label="新密码" prop="newPwd">
                                <Input v-model="passWordForm.newPwd"
                                       type="password"
                                       placeholder="请输入新密码"></Input>
                            </FormItem>
                            <FormItem label="重复新密码" prop="newPwdCheck">
                                <Input v-model="passWordForm.newPwdCheck"
                                       type="password"
                                       placeholder="请输重复新密码"></Input>
                            </FormItem>
                            <FormItem>
                                <Button type="primary" @click="_submitChangePwd">提交修改</Button>
                                <Button type="ghost" style="margin-left: 8px" @click="_cancelResetPwd">取消</Button>
                            </FormItem>
                        </Form>
                    </div>
                    <Tooltip placement="top" content="修改密码" :transfer="true">
                        <Button type="ghost" shape="circle" icon="lock-combination"></Button>
                    </Tooltip>
                </Poptip>
                <!--<Tooltip placement="top" content="进入知识库" :transfer="true">-->
                    <!--<Button type="ghost"-->
                            <!--shape="circle"-->
                            <!--@click.stop="$router.replace({name: 'articleHome'})"-->
                            <!--icon="ios-book"></Button>-->
                <!--</Tooltip>-->
            </Col>
        </Row>
        <Modal title="修改头像" v-model="changeAvatorFlag" width="800">
            <div id="change-avator-block">
                <div class="img-wrapper">
                    <div class="fs-square-img">
                        <img :src="avatorPath" style="border-radius: 50%;"/>
                    </div>
                </div>
                <p style="margin-top: 8px;font-weight: 700;">当前头像</p>
                <fs-cropper-img @change-success="changeAvatorFlag = false"></fs-cropper-img>
            </div>
            <div slot="footer">
                <Button type="ghost" @click="changeAvatorFlag = false">取消</Button>
            </div>
        </Modal>
    </Card>
</template>
<style lang="less">
    @import "../home.less";
    @import "../../../styles/common.less";
    #change-avator-block {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .img-wrapper {
            width: 100px;
        }
    }
</style>
<script>
    import Cookies from 'js-cookie';
    import fsCropperImg from '@/baseComponents/fs-cropper-img/fs-cropper-img';
    export default {
        data () {
            const validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入新的密码!'));
                } else {
                    if (this.passWordForm.newPwdCheck !== '') {
                        // 对第二个密码框单独验证
                        this.$refs.psdForm.validateField('newPwdCheck');
                    }
                    callback();
                }
            };
            const validatePassCheck = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入新的密码!'));
                } else if (value !== this.passWordForm.newPwd) {
                    callback(new Error('两次输入的密码不匹配!'));
                } else {
                    callback();
                }
            };
            return {
                changeAvatorFlag: false,
                pwsFlag: false,
                coinDescFlag: false,
                passWordForm: {
                    oldPwd: '',
                    newPwd: '',
                    newPwdCheck: ''
                },
                passWordRule: {
                    oldPwd: [
                        {required: true, message: '原始密码不能为空!', trigger: 'blur'}
                    ],
                    newPwd: [
                        {required: true, validator: validatePass, trigger: 'blur'}
                    ],
                    newPwdCheck: [
                        {required: true, validator: validatePassCheck, trigger: 'blur'}
                    ]
                }
            };
        },
        created() {
        },
        methods: {
            _cancelResetPwd() {
                this.$refs.psdForm.resetFields();
                this.pwsFlag = false;
            },
            _submitChangePwd() {
                let vm = this;
                this.$refs.psdForm.validate((valid) => {
                    if (valid) {
                        let data = {};
                        data.oldPwd = this.passWordForm.oldPwd;
                        data.newPwd = this.passWordForm.newPwd;
                        data.newPwdCheck = this.passWordForm.newPwdCheck;
                        this.$http.post('/main/updatePwd', data).then((res) => {
                            if (res.success) {
                                this.$Modal.success({
                                    content: '密码重置成功,请重新登录!',
                                    okText: '重新登录',
                                    onOk: function () {
                                        vm.$store.commit('logout');
                                    }
                                });
                            }
                        });
                    }
                });
            }
        },
        computed: {
            avatorPath () {
                return this.$store.state.user.userInfo.headimagepath;
            },
            userName() {
                return this.$store.state.user.userInfo.realname;
            },
            organizeName() {
                return this.$store.state.user.userInfo.organizename;
            },
            companyName() {
                return this.$store.state.user.userInfo.companyname;
            },
            postName() {
                return this.$store.state.user.userInfo.postname;
            },
            tmCoin() {
                return this.$store.state.user.userInfo.tm_coin;
            }
        },
        components: {
            fsCropperImg
        }
    };
</script>
