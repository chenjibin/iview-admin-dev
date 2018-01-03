<template>
    <Card class="people-change">
        <p class="people-change-title">人事调动</p>
        <marquee-infinite
            :item-data="itemData"
            height="300"></marquee-infinite>
    </Card>
</template>
<style lang="less">
    .people-change {
        margin-bottom: 10px;
        &-title {
            margin-bottom: 10px;
            font-size: 18px;
            font-weight: 700;
        }
        &-table {
            margin-bottom: 10px;
        }
    }

</style>
<script>
    import marqueeInfinite from './marqueeInfinite'
    export default {
        data () {
            return {
                itemData: ['骆龙丽 岗位从 【储备店长】 变更为 【导购】 从 【耐克阿迪折扣店】 部门调配到 【716多品店】 部门    【2018-01-02】', '骆龙丽 岗位从 【储备店长】 变更为 【导购】 从 【耐克阿迪折扣店】 部门调配到 【716多品店】 部门    【2018-01-02】', 'fawfafafawfaf', '骆龙丽 岗位从 【储备店长】 变更为 【导购】 从 【耐克阿迪折扣店】 部门调配到 【716多品店】 部门    【2018-01-02】', '骆龙丽 岗位从 【储备店长】 变更为 【导购】 从 【耐克阿迪折扣店】 部门调配到 【716多品店】 部门    【2018-01-02】', 'fawfafafawfaf骆龙丽 岗位从 【储备店长】 变更为 【导购】 从 【耐克阿迪折扣店】 部门调配到 【716多品店】 部门    【2018-01-02】', 'fafafafafafafaf', '骆龙丽 岗位从 【储备店长】 变更为 【导购】 从 【耐克阿迪折扣店】 部门调配到 【716多品店】 部门    【2018-01-02】', '骆龙丽 岗位从 【储备店长】 变更为 【导购】 从 【耐克阿迪折扣店】 部门调配到 【716多品店】 部门    【2018-01-02】', 'fafafafafafafaf', '骆龙丽 岗位从 【储备店长】 变更为 【导购】 从 【耐克阿迪折扣店】 部门调配到 【716多品店】 部门    【2018-01-02】', '骆龙丽 岗位从 【储备店长】 变更为 【导购】 从 【耐克阿迪折扣店】 部门调配到 【716多品店】 部门    【2018-01-02】']
            };
        },
        created() {
            // this.getNoticeInfo();
        },
        methods: {
            _testClick() {
                console.log('aa');
            },
            pageChangeHandler(current) {
                console.log(current);
            },
            getChangeInfo() {
                let data = {
                    start: 0,
                    limit: 10
                }
                this.$http.post('', data).then((res) => {
                    console.log(res);
                });
            }
        },
        components: {
            marqueeInfinite
        }
    };
</script>
