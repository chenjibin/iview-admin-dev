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
                chooseNodeId: ''
            };
        },
        watch: {
            filterText(val) {
                this.$refs.treeFo.filter(val);
            },
            chooseNodeId(val) {
                this.$emit('nodeid-change', val);
            }
        },
        methods: {
            _treeNodeClickHandler(data) {
                this.chooseNodeId = data.id;
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },
            _getOrgTree() {
                this.$http.get(this.url).then((res) => {
                    if (res.success) {
                        this.orgTreeData = res.date;
                        this.chooseNodeId = res.date[0].id;
                        this.$emit('tree-load');
                    }
                });
            }
        }
    };
</script>
