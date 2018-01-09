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
    import marqueeInfinite from './marqueeInfinite';
    export default {
        data () {
            return {
                itemData: []
            };
        },
        created() {
            this.getChangeInfo();
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
                    page: 1,
                    pageSize: 20,
                    type: 5
                };
                this.$http.get('/notice/diaodongInfo', {params: data}).then((res) => {
                    if (res.Success) {
                        let storeArr = [];
                        res.date.forEach((item) => {
                            storeArr.push(item.content);
                        });
                        this.itemData = storeArr;
                    }
                });
            }
        },
        components: {
            marqueeInfinite
        }
    };
</script>
