<template>
    <Card>
        <Input v-model="filterText" size="large" placeholder="快速查找部门"></Input>
        <el-tree :data="orgTreeData"
                 ref="treeFo"
                 :filter-node-method="filterNode"
                 :expand-on-click-node="false"
                 :highlight-current="true"
                 @node-click="_treeNodeClickHandler"
                 style="margin-top: 10px;"
                 :props="defaultProps"></el-tree>
    </Card>
</template>
<script>
    export default {
        name: 'fsDepTree',
        props: {
            url: {
                type: String,
                default: '/organize/organizeTree?fatherId=-1'
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
        data () {
            return {
                filterText: '',
                orgTreeData: [],
                chooseNode: null
            };
        },
        watch: {
            filterText(val) {
                this.$refs.treeFo.filter(val);
            },
            chooseNode(val) {
                this.$emit('node-change', val);
            }
        },
        created() {
            this._getOrgTree();
        },
        methods: {
            _treeNodeClickHandler(data) {
                this.chooseNode = data;
            },
            filterNode(value, data) {
                if (!value) return true;
                if (data.hasOwnProperty('name')) {
                    return data.name.indexOf(value) !== -1;
                } else if (data.hasOwnProperty('text')) {
                    return data.text.indexOf(value) !== -1;
                }
            },
            _getOrgTree() {
                this.$http.get(this.url).then((res) => {
                    if (res.success) {
                        this.orgTreeData = res.data;
                        this.chooseNode = res.data[0];
                    }
                });
            }
        }
    };
</script>
