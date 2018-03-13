<template>
    <div>
        <Collapse>
            <Panel name="1">
                我的计划
                <p slot="content">史蒂夫·乔布斯（Steve Jobs），1955年2月24日生于美国加利福尼亚州旧金山，美国发明家、企业家、美国苹果公司联合创办人。</p>
            </Panel>
        </Collapse>
    </div>
</template>
<style>

</style>
<script>
    export default {
        name: 'myPlan',
        data () {
            return {};
        },
        created() {
            this._getMyPlan();
        },
        methods: {
            _getMyPlan() {
                let data = {};
                data.page = 1;
                data.pageSize = 50;
                this.$http.get('/train/ever_plan_mine_datalist', {params: data}).then((res) => {
                    console.log(res);
                });
            }
        },
        components: {}
    };
</script>
