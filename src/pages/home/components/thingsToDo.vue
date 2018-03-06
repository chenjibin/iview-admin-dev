<template>
    <Card class="todo">
        <p class="todo-title">待办事项</p>
        <div style="width:100%;height:300px;" id="data_source_con"></div>
    </Card>
</template>
<style lang="less">
    .todo {
        user-select: none;
        &-title {
            margin-bottom: 10px;
            font-size: 18px;
            font-weight: 700;
        }
    }

</style>
<script>
    import echarts from 'echarts';
    export default {
        data () {
            return {
                inJobData: []
            };
        },
        created () {
            this._toDoData();
        },
        mounted () {
            this.$nextTick(() => {
                var dataSourcePie = echarts.init(document.getElementById('data_source_con'));
                const option = {
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b} : {c} ({d}%)'
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'right',
                        data: ['ios', 'android', 'pc', 'web', 'others']
                    },
                    series: [
                        {
                            name: '访问来源',
                            type: 'pie',
                            radius: '66%',
                            center: ['50%', '60%'],
                            data: [
                                {value: 2103456, name: 'ios', itemStyle: {normal: {color: '#9bd598'}}},
                                {value: 1305923, name: 'android', itemStyle: {normal: {color: '#ffd58f'}}},
                                {value: 543250, name: 'pc', itemStyle: {normal: {color: '#abd5f2'}}},
                                {value: 798403, name: 'web', itemStyle: {normal: {color: '#ab8df2'}}},
                                {value: 302340, name: 'others', itemStyle: {normal: {color: '#e14f60'}}}
                            ],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                };
                dataSourcePie.setOption(option);
                window.addEventListener('resize', function () {
                    dataSourcePie.resize();
                });
            });
        },
        methods: {
            _toDoData () {
                this.$http.get('/od/notifyMsgWindow').then((res) => {
                    if (res.success) {
                        this.inJobData = res.data;
                    }
                });
            }
        }
    };
</script>
