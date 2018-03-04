<template>
    <div class="" style="overflow: auto;" :style="{width: domWidth}">
        <el-tree class="fs-tree"
                 :data="dataList"
                 :props="defaultProps"
                 :node-key="nodeKey"
                 :default-expand-all="expanded"
                 highlight-current
                 :expand-on-click-node="false"
                 :render-content="renderContent"
                 :check-strictly="true"
                 :show-checkbox="showCheckBox"
                 @current-change="checkmea">
        </el-tree>
    </div>
</template>

<script>
    export default {
        name: 'assetsTree',
        props: {
            domWidth: {
                type: String,
                default: '100%'
            },
            expanded: {
                type: Boolean,
                default: true
            },
            showCheckBox: {
                type: Boolean,
                default: false
            },
            nodeKey: {
                type: String,
                default: 'id'
            },
            defaultProps: {
                type: Object,
                default() {
                    return {
                        children: 'children',
                        label: 'name'
                    };
                }
            }
        },
        created () {
            this._getPostData();
            // this._setTableHeight();
        },
        data () {
            return {
                customerForm: {
                    addForm: {
                        fname: '',
                        pid: -1
                    },
                    modifyInfo: {
                        pid: -1,
                        name: '',
                        id: -1
                    }

                },
                dataList: []
            };
        },
        methods: {
            renderContent(h, { node, data, store }) {
                return (
                    <span class="custom-tree-node">
                        <span class="title">{data.name}</span>
                        <span class="buttons"></span>
                    </span>);
            },
            _getPostData () {
                this.$http.post('/assetsCategory/categoryList', {pid: -1}).then((res) => {
                    this.dataList = res.data;
                });
            },
            checkmea(data, node) {
                this.customerForm.addForm.fname = data.name;
                this.customerForm.addForm.pid = data.id;
                this.customerForm.modifyInfo.pid = data.pid;
                this.customerForm.modifyInfo.name = data.name;
                this.customerForm.modifyInfo.id = data.id;
                this.$emit('customerForm', this.customerForm);
            }
        }
    };
</script>

<style lang="less">
    .custom-tree-node {
        position: relative;
    span.title {
        font-size: 14px;
        word-spacing: 8px;
        letter-spacing: 6px;
    }
    .buttons{
        position: absolute;
        left: 160px;
        top: 1px;
    .oneBtn{
        margin-left: 10px;
        font-size: 12px;
    }
    }
    .Lv1{
        color: #f7b84f;
    }
    }
</style>
