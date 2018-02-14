/**
 * Created by 陈继斌 on 2018/1/17.
 */
export default {
    data() {
        return {
            tableLoading: false,
            pageData: {
                list: [],
                page: 1,
                pageSize: 20,
                totalCount: 0
            }
        };
    },
    methods: {
        initPage() {
            this.pageData.page = 1;
        },
        setPage(page) {
            this.pageData.page = page;
        },
        setPageSize(size) {
            this.pageData.pageSize = size;
        },
        getList(url, params) {
            this.tableLoading = true;
            let data = Object.assign({
                page: this.pageData.page,
                pageSize: this.pageData.pageSize
            }, params);
            this.$http.get(url, {params: data}).then((res) => {
                if (res.success) {
                    this.pageData.totalCount = res.count || res.totalCount;
                    this.pageData.list = res.date || res.data;
                }
            }).finally(() => {
                this.tableLoading = false;
            });
        }
    }
};
