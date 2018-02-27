<template>
    <div>
        <Table :height="height"
               :columns="columns"
               :data="pageData.list"
               :loading="tableLoading"></Table>
        <Page :total="pageData.totalCount"
              :current.sync="pageData.page"
              :page-size="pageData.pageSize"
              :size="size"
              :placement="placement"
              @on-change="pageChangeHandler"
              @on-page-size-change="pageSizeChangeHandler"
              show-elevator
              style="margin-top: 16px;"
              show-sizer></Page>
    </div>
</template>
<style>

</style>
<script>
    import pageMixin from '@/mixins/pageMixin';
    export default {
        name: 'fsTablePage',
        props: {
            columns: Array,
            height: {
                type: Number,
                default: 400
            },
            url: String,
            params: {
                type: Object,
                default() {
                    return {};
                }
            },
            size: {
                type: String,
                default: 'small'
            },
            placement: {
                type: String,
                default: 'top'
            }
        },
        mixins: [pageMixin],
        data () {
            return {
            };
        },
        created() {
            this.getListData();
        },
        methods: {
            pageChangeHandler() {
                this.getListData();
            },
            pageSizeChangeHandler(size) {
                this.initPage();
                this.pageData.pageSize = size;
                this.getListData();
            },
            getListData() {
                this.getList(this.url, this.params);
            }
        }
    };
</script>
