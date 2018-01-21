<template>
    <div id="organization-manage">
        <Input class="fs-filter-tree"
                placeholder="按照部门名称进行筛选"
                v-model="filterTextName">
        </Input>
        <div class="">
            <div class="fs-tree-header">
                <div class="title" style="width: 400px">
                    <span>部门名称</span>
                </div>
                <div class="detail">
                    <span style="width:600px;">包含岗位</span>
                    <span style="width:160px;">部门负责人姓名</span>
                    <span style="width:160px;">部门负责人</span>
                    <span style="width:160px;">分管部门领导姓名</span>
                    <span style="width:160px;">分管部门领导</span>
                </div>
            </div>
            <div class="" style="width: 100%;overflow: auto;" :style="{'height': initHeight + 'px'}">
                <el-tree class="fs-tree"
                         :data="orgData"
                         :props="defaultProps"
                         node-key="id"
                         default-expand-all
                         :expand-on-click-node="false"
                         :filter-node-method="filterNode"
                         :render-content="renderContent"
                         ref="tree1">
                </el-tree>
            </div>
        </div>
    </div>
</template>
<style lang="less">
    #organization-manage {
        font-size: 14px;
        .fs-filter-tree {
            margin-bottom: 10px;
        }
        .fs-tree {
            border-top:0;
            min-height: 300px;
        }
        .el-tree-node__content {
            display: flex;
            .fs-node-wrapper {
                display: flex;
                flex: 1;
                .title {
                    width: 300px;
                    .head:hover + .tag-group {
                        display: inline-block;
                    }
                    .tag-group:hover {
                        display: inline-block;
                    }
                    .tag-group {
                        display: none;
                    }
                }
                .detail {
                    flex: 1;
                    padding-right: 6px;
                    span {
                        float: right;
                    }
                }
            }
            .el-tree-node__expand-icon {
                margin-top: 12px;
            }
        }
        .fs-tree-header {
            display: flex;
            padding: 10px 6px;
            background: #eef1f6;
            color: #1f2d3d;
            font-weight: bold;
            font-size: 14px;
            border: 1px solid #ddd;
            .title {
                width: 300px;
            }
            .detail {
                flex: 1;
                span {
                    float: right;
                }
            }
        }
    }
</style>
<script>
    export default {
        name: 'organizationManage',
        data () {
            return {
                orgData: [],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                initHeight: 300,
                filterTextName: ''
            };
        },
        watch: {
            filterTextName(val) {
                this.$refs.tree1.filter(val)
            }
        },
        created() {
          this._getOrgData();
          this._setTreeHeight()
        },
        methods: {
            _setTreeHeight() {
                let dm = document.body.clientHeight;
                this.initHeight = dm - 220;
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1
            },
            _getOrgData() {
                this.$http.get('/organize/organizeList?fatherId=-1').then((res) => {
                    if (res.success) {
                        this.orgData = res.date;
                    }
                })
            },
            append() {

            },
            editInfo() {

            },
            remove() {

            },
            renderContent(h, { node, data, store }) {
                return (
                    <div class="fs-node-wrapper">
                        <div class="title">
                            <span class="head">{data.name}</span>
                            <div class="tag-group">
                                <i-button  on-click={ () => this.append(store, data) }  size="small" style="margin-left:6px;" type="success">新增</i-button>
                                <i-button  on-click={ () => this.editInfo(store, data) } size="small" style="margin-left: 6px;" type="primary">编辑</i-button>
                                <i-button  on-click={ () => this.remove(store, data) } size="small" style="margin-left: 6px;" type="error">删除</i-button>
                            </div>
                        </div>
                    <div class="detail">
                        <span style="width:584px;overflow:hidden;text-overflow">{data.postNames}</span>
                        <span style="width:160px;">{data.chargerName}</span>
                        <span style="width:160px;">{data.chargerName}</span>
                        <span style="width:160px;">{data.leaderName}</span>
                        <span style="width:160px;">{data.leaderName}</span>
                    </div>
                </div>)
            }
        },
        components: {}
    };
</script>
