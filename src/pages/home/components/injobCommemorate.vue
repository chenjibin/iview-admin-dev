<template>
    <Card class="injob-commemorate">
        <p class="injob-commemorate-title">入职纪念</p>
        <Row :gutter="5">
            <Col :lg="6" :md="6" :sm="12" :xs="12">
                <Card class="injob-commemorate-card">
                    <Avatar src="https://i.loli.net/2017/08/21/599a521472424.jpg" size="large"></Avatar>
                    <p class="injob-commemorate-name">admin</p>
                    <time class="injob-commemorate-time">2017-10-25</time>
                    <p>(入职时间)</p>
                </Card>
            </Col>
            <Col :lg="6" :md="6" :sm="12" :xs="12">
            <Card class="injob-commemorate-card">
                <Avatar src="https://i.loli.net/2017/08/21/599a521472424.jpg" size="large"></Avatar>
                <p class="injob-commemorate-name">admin</p>
                <time class="injob-commemorate-time">2017-10-25</time>
                <p>(入职时间)</p>
            </Card>
            </Col>
            <Col :lg="6" :md="6" :sm="12" :xs="12">
            <Card class="injob-commemorate-card">
                <Avatar src="https://i.loli.net/2017/08/21/599a521472424.jpg" size="large"></Avatar>
                <p class="injob-commemorate-name">admin</p>
                <time class="injob-commemorate-time">2017-10-25</time>
                <p>(入职时间)</p>
            </Card>
            </Col>
            <Col :lg="6" :md="6" :sm="12" :xs="12">
            <Card class="injob-commemorate-card">
                <Avatar src="https://i.loli.net/2017/08/21/599a521472424.jpg" size="large"></Avatar>
                <p class="injob-commemorate-name">admin</p>
                <time class="injob-commemorate-time">2017-10-25</time>
                <p>(入职时间)</p>
            </Card>
            </Col>
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
    import Avatar from 'iview/src/components/avatar/avatar';

    export default {
        data () {
            return {};
        },
        components: {Avatar}
    };
</script>
