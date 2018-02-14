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
            this.$http.get(url, {params: data}).then((res) => {
                if (res.success) {
                    if (res.hasOwnProperty('count')) {
                        this.pageData.totalCount = res.count;
                    } else if (res.hasOwnProperty('totalCount')) {
                        this.pageData.totalCount = res.totalCount;
                    }
                    if (res.hasOwnProperty('date')) {
                        this.pageData.list = res.date;
                    } else if (res.hasOwnProperty('data')) {
                        this.pageData.list = res.data;
                    }
                }
            }).finally(() => {
                this.tableLoading = false;
            });
        }
    }
};
