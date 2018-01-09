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
                    <Col :md="24" :lg="24">
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
                                        color="#19be6b"
                                        btn-text="考勤"
                                        @card-click="$router.push('myAttendance')"></info-btn>
                            </Col>
                            <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
                                <info-btn
                                        iconType="ios-grid-view"
                                        color="#ff9900"
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
                            <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
                                <info-btn
                                        iconType="compose"
                                        color="#2d8cf0"
                                        btn-text="请假"
                                        @card-click="$router.push('myLeave')"></info-btn>
                            </Col>
                            <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
                                <info-btn
                                        iconType="navicon"
                                        color="#19be6b"
                                        btn-text="排班"
                                        @card-click="$router.push('myArrange')"></info-btn>
                            </Col>
                        </Row>
                    </Col>
                    <Col :md="24" :lg="24" :style="{marginBottom: '10px'}">
                        <coin-change></coin-change>
                    </Col>
                    <Col :md="24" :lg="24" :style="{marginBottom: '10px'}">
                        <injob-commemorate></injob-commemorate>
                    </Col>
                </Row>
            </Col>
            <Col :md="24" :lg="14">
                <Row>
                    <Notice></Notice>
                </Row>
                <Row :gutter="5" style="margin-bottom: 10px;">
                    <Col :md="12" :lg="12">
                        <coin-ranking
                                :loading="coinLoadingFlag"
                                tag-color="#19be6b"
                                coin-title="金币排行红榜"
                                :row-data="rankDataRed">
                        </coin-ranking>
                    </Col>
                    <Col :md="12" :lg="12">
                        <coin-ranking
                                :loading="coinLoadingFlag"
                                tag-color="#ed3f14"
                                coin-title="金币排行黑榜"
                                :row-data="rankDataBlack">
                        </coin-ranking>
                    </Col>
                </Row>
                <Row>
                    <people-change></people-change>
                </Row>
            </Col>
        </Row>
    </div>
</template>

<script>
import infoBtn from './components/infoBtn';
import coinRanking from './components/coinRanking';
import Notice from './components/notice';
import peopleChange from './components/peopleChange';
import injobCommemorate from './components/injobCommemorate';
import coinChange from './components/coinChange';

export default {
    name: 'home',
    components: {
        infoBtn,
        coinRanking,
        Notice,
        peopleChange,
        injobCommemorate,
        coinChange
    },
    data () {
        return {
            coinLoadingFlag: false,
            rankDataRed: [],
            rankDataBlack: [],
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
    created() {
        this._getRankData();
    },
    methods: {
        _getRankData() {
            this.coinLoadingFlag = true;
            this.$http
                .all([this.$http.get('/main/Ranking?page=1&pageSize=10000&type=1'), this.$http.get('/main/Ranking?page=1&pageSize=10000&type=2')])
                .then(this.$http.spread((res1, res2) => {
                    if (res1.Success) {
                        this.rankDataBlack = res1.date;
                    }
                    if (res2.Success) {
                        this.rankDataRed = res2.date;
                    }
                })).finally(() => {
                    this.coinLoadingFlag = false;
            });
        }
    }
};
</script>
