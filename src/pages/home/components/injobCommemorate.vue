<template>
    <Card class="injob-commemorate">
        <p class="injob-commemorate-title">入职纪念</p>
        <Row :gutter="5">
            <template v-for="(item, index) in inJobData">
                <Col :lg="6" :md="6" :sm="12" :xs="12">
                    <Card class="injob-commemorate-card" style="margin-bottom: 10px;">
                        <Avatar :src="'/oa/upload/head/' + item.headimagepath" size="large"></Avatar>
                        <p class="injob-commemorate-name">{{item.realname}}</p>
                        <time class="injob-commemorate-time">{{item.joindate}}</time>
                        <p>(入职时间)</p>
                    </Card>
                </Col>
            </template>
        </Row>
    </Card>
</template>
<style lang="less">
    .injob-commemorate {
        user-select: none;
        &-title {
            margin-bottom: 10px;
            font-size: 18px;
            font-weight: 700;
        }
        &-card {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
        }
    }

</style>
<script>
    export default {
        data () {
            return {
                inJobData: []
            };
        },
        created () {
            this._getInJobData();
        },
        methods: {
            _getInJobData () {
                this.$http.get('/main/getRuZhi').then((res) => {
                    if (res.success) {
                        this.inJobData = res.data;
                    }
                });
            }
        }
    };
</script>
