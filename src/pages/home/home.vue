<style lang="less">
    @import "./home.less";
    @import "../../styles/common.less";
</style>
<template>
    <div class="home-main">
        <Row :gutter="10">
            <Col :md="24" :lg="10">
                <Row class-name="home-page-row1" :gutter="10">
                    <Col :md="24" :lg="24" :style="{marginBottom: '10px'}">
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
                                        <b class="card-user-infor-name">陈继斌</b>
                                        <p>技术部（web前端工程师）</p>
                                    </div>
                                </Row>
                                </Col>
                            </Row>
                            <div class="line-gray"></div>
                            <Row class="margin-top-8">
                                <Col span="8"><p class="notwrap">上次登录时间:</p></Col>
                                <Col span="16" class="padding-left-8">2017.09.12-13:32:20</Col>
                            </Row>
                            <Row class="margin-top-8">
                                <Col span="8"><p class="notwrap">上次登录地点:</p></Col>
                                <Col span="16" class="padding-left-8">江苏省 连云港市</Col>
                            </Row>
                        </Card>
                    </Col>
                    <Col :md="24" :lg="24" :style="{marginBottom: '10px'}">
                        <Row :gutter="5">
                            <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
                                <info-btn
                                        iconType="edit"
                                        color="#2d8cf0"
                                        btn-text="日志"
                                        @card-click="$router.push('myLog')"></info-btn>
                            </Col>
                            <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
                                <info-btn
                                        iconType="clipboard"
                                        color="#64d572"
                                        btn-text="考勤"
                                        @card-click=""></info-btn>
                            </Col>
                            <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
                                <info-btn
                                        iconType="ios-grid-view"
                                        color="#ffd572"
                                        btn-text="抽奖"
                                        @card-click=""></info-btn>
                            </Col>
                            <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
                                <info-btn
                                        iconType="cash"
                                        color="#f25e43"
                                        btn-text="金币商城"
                                        @card-click=""></info-btn>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Col>
            <Col :md="24" :lg="14">
                <Row :gutter="5">
                    <Col :md="12" :lg="12">
                        <Card>
                            <p>金币月排行红榜</p>
                            <Table height="300" :columns="columns1" :data="data2"></Table>
                        </Card>
                    </Col>
                    <Col :md="12" :lg="12">
                        <Card>
                            <p>金币月排行黑榜</p>
                            <Table height="300" :columns="columns1" :data="data2"></Table>
                        </Card>
                    </Col>
                </Row>
            </Col>
        </Row>
    </div>
</template>

<script>
import infoBtn from './components/infoBtn'


export default {
    name: 'home',
    components: {
        infoBtn
    },
    data () {
        return {
             columns1: [
                {
                    title: '排名',
                    key: 'sort',
                    render: (h, params) => {
                        return h('strong', `No.${params.index + 1}`)
                    }
                },
                {
                    title: '姓名',
                    key: 'name'
                },
                {
                    title: '金币数',
                    key: 'coin',
                    render: (h, params) => {
                        return h('Tag', {
                            props: {
                                color: 'green'
                            }
                        }, params.row.coin)

                    }
                }
            ],
             data2: [
                    {
                        sort: 'No.1',
                        name: 'Jon Snow',
                        address: 'New York No. 1 Lake Park',
                        coin: '35'
                    },
                    {
                        sort: 'No.1',
                        name: 'Jon Snow',
                        address: 'London No. 1 Lake Park',
                        coin: '35'
                    },
                    {
                        sort: 'No.1',
                        name: 'Jon Snow',
                        address: 'Sydney No. 1 Lake Park',
                        coin: '35'
                    },
                    {
                        sort: 'No.1',
                        name: 'Jon Snow',
                        address: 'Ottawa No. 2 Lake Park',
                        coin: '35'
                    },
                    {
                        sort: 'No.1',
                        name: 'Jon Snow',
                        address: 'New York No. 1 Lake Park',
                        coin: '35'
                    },
                    {
                        sort: 'No.1',
                        name: 'Jon Snow',
                        address: 'London No. 1 Lake Park',
                        coin: '35'
                    },
                    {
                        sort: 'No.1',
                        name: 'Jon Snow',
                        address: 'Sydney No. 1 Lake Park',
                        coin: '35'
                    },
                    {
                        sort: 'No.1',
                        name: 'Jon Snow',
                        address: 'Ottawa No. 2 Lake Park',
                        coin: '35'
                    }
                ]
        };
    },
    computed: {
        avatorPath () {
            return localStorage.avatorImgPath;
        }
    },
    methods: {

    }
};
</script>
