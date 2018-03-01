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
              show-total
              style="margin-top: 16px;"
              show-sizer></Page>
    </div>
</template>
<script>
    import pageMixin from '@/mixins/pageMixin';
    import debounce from 'lodash/debounce';
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
        watch: {
            params: {
                handler(newVal, oldVal) {
                    let type = this.returnDiffType(newVal, oldVal);
                    console.log(type);
                    if (type === 'select') {
                        this._inputDebounce();
                    } else {
                        this._filterResultHandler();
                    }
                },
                deep: true
            }
        },
        created() {
            this.getListData();
        },
        methods: {
            returnDiffType(newVal, oldVal) {
                let type = '';
                for (let key in newVal) {
                    if (newVal.hasOwnProperty(key)) {
                        if (newVal[key].value !== oldVal[key].value) {
                            type = newVal[key]['type'];
                            break;
                        }
                    }
                }
                return type;
            },
            returnNeedParams() {
                let params = {};
                for (let key in this.params) {
                    if (this.params.hasOwnProperty(key)) {
                        params[key] = this.params[key].value;
                    }
                }
                return params;
            },
            _inputDebounce: debounce(function () {
                this._filterResultHandler();
            }, 600),
            _filterResultHandler() {
                this.initPage();
                this.getListData();
            },
            pageChangeHandler() {
                this.getListData();
            },
            pageSizeChangeHandler(size) {
                this.initPage();
                this.pageData.pageSize = size;
                this.getListData();
            },
            getListData() {
                let params = this.returnNeedParams();
                this.getList(this.url, params);
            }
        }
    };
</script>
