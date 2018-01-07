<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con">
            <Card :bordered="false">
                <p slot="title">
                    <Icon type="log-in"></Icon>
                    欢迎登录天马人事系统
                </p>
                <div class="form-con">
                    <Form ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="userName">
                            <Input v-model="form.userName" placeholder="请输入用户名" size="large">
                                <span slot="prepend">
                                    <Icon :size="16" type="person"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="passWord">
                            <Input type="password" v-model="form.passWord" placeholder="请输入密码" size="large">
                                <span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="code">
                            <Input v-model="form.code" placeholder="请输入验证码" size="large">
                            <span slot="prepend">
                                    <Icon :size="16" type="android-checkmark-circle"></Icon>
                                </span>
                            </Input>
                            <img src="/oa/login_geneCode" id="validate-code-img"/>
                        </FormItem>
                        <FormItem>
                            <Button @click="handleSubmit" type="primary" long size="large">登录</Button>
                        </FormItem>
                    </Form>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
import Cookies from 'js-cookie';
import {appRouter, page404} from '@/router/router';
export default {
    data () {
        return {
            form: {
                userName: '',
                passWord: '',
                code: ''
            },
            rules: {
                userName: [
                    { required: true, message: '账号不能为空', trigger: 'blur' }
                ],
                passWord: [
                    { required: true, message: '密码不能为空', trigger: 'blur' }
                ],
                code: [
                    {required: true, message: '验证码不能为空', trigger: 'blur'}
                ]
            }
        };
    },
    methods: {
        getPermissionData() {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(appRouter);
                }, 500);
            });
        },
        handleSubmit () {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    Cookies.set('user', this.form.userName);
                    Cookies.set('password', this.form.password);
                    this.$store.commit('setAvator', 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&fm=27&gp=0.jpg');
                    if (this.form.userName === 'iview_admin') {
                        Cookies.set('access', 0);
                    } else {
                        Cookies.set('access', 1);
                    }
                    Cookies.set('token', '1010101010');
                    this.getPermissionData().then((data) => {
                        this.$store.commit('setPremissionMenu', data);
                        let aa = data.concat([page404]);
                        this.$router.addRoutes(aa);
                        let tagsList = [];
                        data.map((item) => {
                            if (item.children) {
                                if (item.children.length <= 1) {
                                    tagsList.push(item.children[0]);
                                } else {
                                    tagsList.push(...item.children);
                                }
                            }
                        });
                        this.$store.commit('setTagsList', tagsList);
                        this.$store.commit('updateMenulist');
                        this.$router.push({
                            name: 'home_index'
                        });
                    });
                }
            });
        }
    }
};
</script>

<style>

</style>
