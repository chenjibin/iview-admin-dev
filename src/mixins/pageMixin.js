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
            }, params || {});
            this.$http.post(url, data).then((res) => {
                if (res.success) {
                    this.pageData.totalCount = res.totalCount;
                    this.pageData.list = res.data.map(x => {
                        if (this.isExpend) {
                            x._expanded = false;
                        }
                        if (this.isSelection) {
                            x._checked = false;
                        }
                        return x;
                    });
                }
            }).finally(() => {
                this.tableLoading = false;
            });
        }
    }
};
