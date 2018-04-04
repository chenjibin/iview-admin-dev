<template>
    <div>
        <Collapse>
            <Panel name="1">
                我的课程
                <div slot="content">
                    <ul class="my-class-wrapper">
                        <li v-for="item,index in myClassList" :key="'my-class-' + index" class="item">
                            <h4 class="title">{{item.title}}</h4>
                            <p style="text-align: right" class="teacher">讲师: {{item.teacher_name}}</p>
                            <div class="">
                                <span class="item-title">时间:</span><span>{{item.class_date | returnDate}}  {{item.period}}</span>
                            </div>
                            <div class="">
                                <span class="item-title">课程学分:</span><span>{{item.class_credit}}</span>
                                <span class="item-title">已得学分:</span><span>{{item.credit}}</span>
                            </div>
                            <div class="btn-group">
                                <Button type="primary"
                                        :loading="item.loading"
                                        @click="_downloadGrade(item)"
                                        shape="circle">下载成绩</Button>
                            </div>
                        </li>
                    </ul>
                </div>
            </Panel>
        </Collapse>
    </div>
</template>
<style lang="less">
    .my-class-wrapper {
        .item {
            margin-bottom: 8px;
            padding-bottom: 8px;
            border-bottom: 1px solid #ddd;
            .item-title {
                font-weight: 700;
            }
            .btn-group {
                text-align: right;
            }
            &:last-child {
                border-bottom: 0;
            }
        }

    }
</style>
<script>
    import moment from 'moment';
    import utils from '@/libs/util.js'
    export default {
        name: 'myClassList',
        data () {
            return {
                myClassList: []
            };
        },
        created() {
            this._getMyClass();
        },
        filters: {
            returnDate(val) {
                return moment(val).format('YYYY-MM-DD');
            }
        },
        methods: {
            _downloadGrade(data) {
                let sendData = {};
                sendData.id = data.id;
                sendData.title = data.title;
                data.loading = true;
                this.$http.post('/train/trainee_class_crdit_excel', sendData).then((res) => {
                    if (res.success) {
                        utils.downloadFile('/oa/download/' + res.data, res.data);
                    }
                }).finally(() => {
                    data.loading = false;
                });
            },
            _getMyClass() {
                let data = {};
                data.page = 1;
                data.pageSize = 100;
                this.$http.get('/train/class_datalist_mine', {params: data}).then((res) => {
                    if (res.success) {
                        res.data.forEach(item => {
                            item.loading = false;
                        });
                        this.myClassList = res.data;
                    }
                });
            }
        },
        components: {}
    };
</script>
