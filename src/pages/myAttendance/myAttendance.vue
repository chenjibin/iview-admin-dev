<template>
    <div>
        <Card>
            <Table :columns="columns1"
                   :data="data1"
                   height="700"
                   @on-row-dblclick="_checkDetail"
                   style="margin-bottom: 10px;"></Table>
            <Page :total="100"></Page>
        </Card>
    </div>
</template>
<style lang="less">

</style>
<script>
    export default {
        name: 'myAttendance',
        data () {
            return {
                columns1: [
                    {
                        title: '记录月份',
                        key: 'date',
                        align: 'center'
                    },
                    {
                        title: '迟到',
                        key: 'age',
                        align: 'center'
                    },
                    {
                        title: '早退',
                        key: 'address',
                        align: 'center'
                    },
                    {
                        title: '漏打卡',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '请假(天)',
                        key: 'age',
                        align: 'center'
                    },
                    {
                        title: '出勤(天)',
                        key: 'address',
                        align: 'center'
                    },
                    {
                        title: '出差(天)',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '旷工(天)',
                        key: 'age',
                        align: 'center'
                    },
                    {
                        title: '审核状态',
                        key: 'address',
                        align: 'center'
                    }
                ],
                data1: [
                    {
                        name: '1',
                        age: 18,
                        address: '1',
                        date: '2016-10-03'
                    },
                    {
                        name: '1',
                        age: 24,
                        address: '1',
                        date: '2016-10-01'
                    },
                    {
                        name: '1',
                        age: 30,
                        address: '1',
                        date: '2016-10-02'
                    },
                    {
                        name: '1',
                        age: 26,
                        address: '1',
                        date: '2016-10-04'
                    },
                    {
                        name: '1',
                        age: 18,
                        address: '1',
                        date: '2016-10-03'
                    },
                    {
                        name: '1',
                        age: 24,
                        address: '1',
                        date: '2016-10-01'
                    },
                    {
                        name: '1',
                        age: 30,
                        address: '1',
                        date: '2016-10-02'
                    },
                    {
                        name: '1',
                        age: 26,
                        address: '1',
                        date: '2016-10-04'
                    },
                    {
                        name: '1',
                        age: 18,
                        address: '1',
                        date: '2016-10-03'
                    },
                    {
                        name: '1',
                        age: 24,
                        address: '1',
                        date: '2016-10-01'
                    },
                    {
                        name: '1',
                        age: 30,
                        address: '1',
                        date: '2016-10-02'
                    },
                    {
                        name: '1',
                        age: 26,
                        address: '1',
                        date: '2016-10-04'
                    }
                ]
            };
        },
        methods: {
            _checkDetail(obj) {
                console.log(obj);
            }
        },
        components: {}
    };
</script>
