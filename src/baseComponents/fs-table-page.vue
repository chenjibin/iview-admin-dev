<template>
    <div>
        <Table :height="height"
               :columns="columns"
               :data="pageData.list"
               @on-selection-change="selectionChange"
               @on-row-click="rowClickHandler"
               :loading="tableLoading"></Table>
        <Page :total="pageData.totalCount"
              :current.sync="pageData.page"
              :page-size="pageData.pageSize"
              :size="size"
              :placement="placement"
              :page-size-opts="pageSizeOpt"
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
            pageSizeOpt: {
                type: Array,
                default() {
                    return [10, 20, 30, 40];
                }
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
            },
            choosearray: {
                type: Array,
                default() {
                    return [];
                }
            },
            idFlag: {
                type: String,
                default: 'id'
            }
        },
        mixins: [pageMixin],
        data () {
            return {
                isExpend: false,
                isSelection: false
            };
        },
        created() {
            this.getListData();
            this.initWatch();
            this.isExpend = this.columns.some(x => x.type === 'expand');
            this.isSelection = this.columns.some(x => x.type === 'selection');
        },
        methods: {
            initWatch() {
                for (let key in this.params) {
                    this.$watch(`params.${key}.value`, function (val) {
                        if (this.params[key].type === 'input') {
                            this._inputDebounce();
                        } else {
                            this._filterResultHandler();
                        }
                    });
                }
            },
            rowClickHandler(data, index) {
                if (this.isExpend) {
                    this.pageData.list[index]._expanded = !this.pageData.list[index]._expanded;
                }
                if (this.isSelection) {
                    this.pageData.list[index]._checked = !this.pageData.list[index]._checked;
                    let chooseData = this.pageData.list.filter(x => x._checked);
                    this.$emit('update:choosearray', chooseData);
                }
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
            selectionChange(data) {
                data.forEach(item => {
                    item._checked = true;
                });
                let chooseIdArr = data.map(x => x[this.idFlag]);
                this.pageData.list.forEach(item => {
                    item._checked = chooseIdArr.indexOf(item[this.idFlag]) > -1;
                });
                this.$emit('update:choosearray', data);
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
                this.$emit('update:choosearray', []);
                let params = this.returnNeedParams();
                this.getList(this.url, params);
            }
        }
    };
</script>
