<template>
    <div id="my-arrange">
        <Card :dis-hover="true">
            <template v-for="list in dateList">
                <h2 class="year-title">{{list.year}}</h2>
                <Row :gutter="10" style="margin-bottom: 24px;">
                    <Col :lg="4" :md="6" :sm="8" :xs="12" v-for="(date, dateIndex) in list.date" :key="'date-' + dateIndex">
                        <Card class="my-arrange-card" @click.native="_cardClick(date.date)">
                            <p class="month">{{date.date}}</p>
                            <Tag color="green" @click.native="_cardClick(date.date)">{{date.type}}</Tag>
                        </Card>
                    </Col>
                </Row>
            </template>
            <Modal v-model="modelFlag" width="900" :mask-closable="false">
                <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                    <span>{{arrangeDate}} 排班表</span>
                </p>

                <div slot="footer">
                </div>
            </Modal>
        </Card>
    </div>
</template>
<style lang="less">
    #my-arrange {
        .year-title {
            margin-bottom: 16px;
        }
        .my-arrange-card {
            cursor: pointer;
            user-select: none;
            margin-bottom: 10px;
            text-align: center;
            .month {
                font-size: 18px;
                font-weight: 700;
            }
        }

    }
</style>
<script>
    export default {
        data () {
            return {
                modelFlag: false,
                arrangeDate: null,
                dateList: [
                    {
                        year: '2018',
                        date: [
                            {
                                date: '2018-01',
                                type: '已设置'
                            },
                            {
                                date: '2018-02',
                                type: '已设置'
                            },
                            {
                                date: '2018-03',
                                type: '已设置'
                            },
                            {
                                date: '2018-04',
                                type: '已设置'
                            },
                            {
                                date: '2018-05',
                                type: '已设置'
                            },
                            {
                                date: '2018-06',
                                type: '已设置'
                            },
                            {
                                date: '2018-07',
                                type: '已设置'
                            },
                            {
                                date: '2018-08',
                                type: '已设置'
                            },
                            {
                                date: '2018-09',
                                type: '已设置'
                            },
                            {
                                date: '2018-10',
                                type: '已设置'
                            }
                        ]
                    },
                    {
                        year: '2017',
                        date: [
                            {
                                date: '2018-01-01',
                                type: '已设置'
                            },
                            {
                                date: '2018-01-02',
                                type: '已设置'
                            },
                            {
                                date: '2018-01-03',
                                type: '已设置'
                            },
                            {
                                date: '2018-01-04',
                                type: '已设置'
                            },
                            {
                                date: '2018-01-05',
                                type: '已设置'
                            },
                            {
                                date: '2018-01-06',
                                type: '已设置'
                            },
                            {
                                date: '2018-01-07',
                                type: '已设置'
                            },
                            {
                                date: '2018-01-08',
                                type: '已设置'
                            },
                            {
                                date: '2018-01-09',
                                type: '已设置'
                            },
                            {
                                date: '2018-01-10',
                                type: '已设置'
                            }
                        ]
                    }
                ]
            };
        },
        methods: {
            _cardClick(date) {
                this.arrangeDate = date;
                this.modelFlag = true;
                console.log(date);
            }
        },
        components: {}
    };
</script>
