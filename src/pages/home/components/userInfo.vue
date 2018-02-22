<template>
    <Card>
        <Row type="flex" class="user-infor">
            <Col span="8">
                <Row class-name="made-child-con-middle" type="flex" align="middle">
                    <img class="avator-img" :src="avatorPath" style="border-radius: 50%;"/>
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
                <Poptip placement="right-start" width="600" v-model="coinDescFlag" :transfer="true">
                    <div slot="content" style="white-space: normal;">
                        <h2 style="text-align: center">天马金币说明</h2>
                        <div class="">
                            <h3>金币可以兑换什么？</h3>
                            <ul>
                                <li>1. 各类纸品（价格待定）</li>
                                <li>2. 迟到卡 200 金币</li>
                                <li>3. 带薪休假卡 1000 金币（1天）</li>
                                <li>4. 各类饮料（价格待定）</li>
                                <li>5. 各类样品仓商品（价格待定）</li>
                                <li>6. 公司内购券面值 50-600 金币</li>
                                <li>7. 抽奖机会50金币</li>
                            </ul>
                            <p >注： 金币每年年底不清零，可以累积使用。金币为负时，每月月底按10金币1元上交同等钱款到人事部后金币恢复为0。（因为正常写肯定是不会有负数现象，除非有违反制度现象，现在违反制度不直接扣现金，而是扣金币，每月统一转换为现金）连续三个月金币为负，记过处分。</p>
                        </div>
                        <div class="margin-top-8">
                            <h3>获得金币有哪些途径？</h3>
                            <p>一、写日志</p>
                            <ul>
                                <li>1. 新增一个工作日志 +10 金币</li>
                                <li>2. 工作日志被评为优秀 +10 金币，每月最多 +150 金币</li>
                                <li>3. 工作日志被批评 -5 金币，每月最多 -100 金币 </li>
                                <li>4. 当天工作日志，未在次日8：30前写，每次-5金币（如在24小时内补写，分可补回，每月最多可补写4次）</li>
                                <li>5. 直属上级对下级日志未在48小时内指导，每次扣 2 金币 </li>
                                <li>6. 工作日志被列为范本 +20 金币 </li>
                            </ul>
                            <p>二、人工手工加减分项 </p>
                            <ul>
                                <li>A.提出合理化建议 +100 起金币（制度、文化、业务流程都可以）</li>
                                <li>B.考试成绩优异者 +100 金币</li>
                                <li>C.授课一次 +300 金币</li>
                                <li>D.带新人被录用 +500 金币</li>
                                <li>E.未执行公司制度 -100 起金币（如上班时间吃早饭、上私Q、看网页等）</li>
                                <li>F.好人好事奖励 +50 起</li>
                                <li>G.伯乐奖 +200 起（推荐员工并成功入职，根据被推荐者的岗位可有不同）</li>
                                <li>H.其它奖惩</li>
                            </ul>
                        </div>
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
                <Tooltip placement="top" content="商品订单" :transfer="true">
                    <Button type="ghost" shape="circle" icon="android-list"></Button>
                </Tooltip>
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
                <fs-cropper-img></fs-cropper-img>
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
                },
                userInfo: null
            };
        },
        created() {
            this.userInfo = JSON.parse(Cookies.get('userInfo'));
        },
        methods: {
            _submitAvatorChange() {

            },
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
                        console.log(data);
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
                return localStorage.avatorImgPath;
            }
        },
        components: {
            fsCropperImg
        }
    };
</script>
