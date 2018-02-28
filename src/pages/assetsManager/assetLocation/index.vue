<template>
    <!--资产位置-->
    <div id="assetslocation">
        <Form inline :label-width="60">
            <FormItem label="位置名称">
                <Input type="text" style="width: 173px"
                       @on-change="_inputDebounce"
                       v-model="filterOpt.name"
                       placeholder="位置名称"></Input>
            </FormItem>
            <FormItem label="位置名称">
                <Button type="text" style="width: 173px"
                       @on-change="_inputDebounce"
                       v-model="filterOpt.name"
                       placeholder="位置名称"></Button>
            </FormItem>
            <FormItem label="位置名称">
                <Input type="text" style="width: 173px"
                       @on-change="_inputDebounce"
                       v-model="filterOpt.name"
                       placeholder="位置名称"></Input>
            </FormItem>
        </Form>


    </div>
</template>

<script>
    // 简单的axios薄层封装
    import pageMixin from '@/mixins/pageMixin';
    // lodash输入延时
    import debounce from 'lodash/debounce';
    export default {
        name: 'assets-register',
        data() {
            return {
                filterOpt: {
                    name: ''
                }
            };
        },
        mixins: [pageMixin],
        methods: {
            _inputDebounce: debounce(function () {
                this._filterResultHandler();
            }, 1600),
            _filterResultHandler () {
                this.initPage();
                this._getPostData();
            },
            _setTableHeight () {
                let dm = document.body.clientHeight;
                this.tableHeight = dm - 375;
            },
            _setPage (page) {
                this.pageData.page = page;
                this._getPostData();
            },
            _setPageSize (size) {
                this.pageData.pageSize = size;
                this._getPostData();
            },
        }
    };
</script>

<style scoped>

</style>
