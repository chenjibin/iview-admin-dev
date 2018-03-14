<template>
    <div>
        <Row :gutter="8">
            <Col :span="14">
                <Card :dis-hover="true">
                    <h3>培训课程列表</h3>
                    <class-list @trainee-success="traineeSuccessHandler"></class-list>
                </Card>
            </Col>
            <Col :span="10">
                <Row>
                    <Col :span="24" style="margin-bottom: 8px;">
                        <Card :dis-hover="true">
                            <!--<h3>我的课程</h3>-->
                            <my-class-list ref="myClass"></my-class-list>
                        </Card>
                    </Col>
                    <Col :span="24">
                        <Card :dis-hover="true">
                            <!--<h3>我的计划</h3>-->
                            <my-plan></my-plan>
                        </Card>
                    </Col>
                </Row>
            </Col>
        </Row>
    </div>
</template>
<style>

</style>
<script>
    import classList from './classList';
    import myClassList from './myClassList';
    import myPlan from './myPlan';
    export default {
        name: 'myTrain',
        data () {
            return {};
        },
        methods: {
            traineeSuccessHandler() {
                this.$refs.myClass._getMyClass();
            }
        },
        components: {
            classList,
            myClassList,
            myPlan
        }
    };
</script>
