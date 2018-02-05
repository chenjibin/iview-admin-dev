<template>
    <div>
        <Card :shadow="true" :bordered="false">
            <Row :gutter="16">
                <Col :span="12">
                    <Row class="expand-row">
                        <Col span="24">
                        <template v-if="row.type === '调休'">
                            <span class="expand-key">{{row.type}}: </span>
                            <span class="expand-value" v-html="row.tiaoxiulog"></span>
                        </template>
                        <template v-else>
                            <span class="expand-key">{{row.type}}: </span>
                            <span class="expand-value">从{{row.start}} 到 {{row.end}}</span>
                        </template>
                        </Col>
                        <Col span="24">
                            <span class="expand-key">请假原因: </span>
                            <span class="expand-value">{{ row.reason}}</span>
                        </Col>
                        <Col span="24">
                            <span class="expand-key">图片证明: </span>
                        </Col>
                    </Row>
                </Col>
                <Col :span="12">
                    <div>审批进度</div>
                </Col>
            </Row>
        </Card>
    </div>
</template>
<style>

</style>
<script>
    export default {
        props: {
            row: Object
        }
    };
</script>
