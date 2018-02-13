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
                <Tooltip placement="top" content="修改头像" :transfer="true">
                    <Button type="ghost" shape="circle" icon="person"></Button>
                </Tooltip>
                <Tooltip placement="top" content="修改密码" :transfer="true">
                    <Button type="ghost" shape="circle" icon="lock-combination"></Button>
                </Tooltip>
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
                userInfo: null
            };
        },
        created() {
            this.userInfo = JSON.parse(Cookies.get('userInfo'));
        },
        computed: {
            avatorPath () {
                return localStorage.avatorImgPath;
            }
        },
        components: {}
    };
</script>
