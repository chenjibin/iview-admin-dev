<template>
    <div>
        <Card :dis-hover="true">
            <Row :gutter="16">
                <Col :span="12">
                    <Row class="expand-row">
                        <Col span="24">
                        <template v-if="row.type === '调休'">
                            <span class="expand-key" style="font-weight: 700;">{{row.type}}: </span>
                            <span class="expand-value" v-html="row.tiaoxiulog"></span>
                        </template>
                        <template v-else>
                            <span class="expand-key" style="font-weight: 700;">{{row.type}}: </span>
                            <span class="expand-value">从{{row.start}} 到 {{row.end}}</span>
                        </template>
                        </Col>
                        <Col span="24">
                            <span class="expand-key" style="font-weight: 700;">请假原因: </span>
                            <span class="expand-value">{{ row.reason}}</span>
                        </Col>
                        <Col span="24" v-if="row.imageproof">
                            <span class="expand-key" style="font-weight: 700;">图片证明: </span>
                        </Col>
                    </Row>
                </Col>
                <Col :span="12">
                    <div style="color:#19be6b;font-weight: 700;">审批进度:</div>
                    <div class="">
                        <ul>
                            <li v-for="(item, index) in progressData" :key="'progress' + index + '-' + row.id">
                                {{item}}
                            </li>
                        </ul>
                        <div class="" v-if="row.refusereason">
                            <p style="color: #2b85e4">拒绝理由:</p>
                            <span v-html="row.refusereason"></span>
                        </div>
                        <div class="" v-if="row.agreeinformation">
                            <p style="color: #2b85e4">备注留言:</p>
                            <span v-html="row.agreeinformation.replace(/&nbsp/g, '')"></span>
                        </div>
                    </div>
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
        },
        data() {
            return {
                progressData: this.row.operatelog.split(',')
            };
        }
    };
</script>
