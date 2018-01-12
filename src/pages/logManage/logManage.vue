<template>
    <div>
        <Row :gutter="10">
            <Col :span="6">
                <Card>
                    <Input v-model="filterText" size="large" placeholder="快速查找部门"></Input>
                    <el-tree :data="data"
                             ref="treeDom"
                             :filter-node-method="filterNode"
                             style="margin-top: 10px;"
                             :props="defaultProps"></el-tree>
                </Card>
            </Col>
            <Col :span="18">
                <Card>

                </Card>
            </Col>
        </Row>
    </div>
</template>
<style>

</style>
<script>
    export default {
        name: 'logManage',
        watch: {
            filterText(val) {
                this.$refs.treeDom.filter(val);
            }
        },
        data () {
            return {
                data: [{
                    label: '一级 1',
                    children: [{
                        label: '二级 1-1',
                        children: [{
                            label: '三级 1-1-1'
                        }]
                    }]
                }, {
                    label: '一级 2',
                    children: [{
                        label: '二级 2-1',
                        children: [{
                            label: '三级 2-1-1'
                        }]
                    }, {
                        label: '二级 2-2',
                        children: [{
                            label: '三级 2-2-1'
                        }]
                    }]
                }, {
                    label: '一级 3',
                    children: [{
                        label: '二级 3-1',
                        children: [{
                            label: '三级 3-1-1'
                        }]
                    }, {
                        label: '二级 3-2',
                        children: [{
                            label: '三级 3-2-1'
                        }]
                    }]
                }],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                filterText: ''
            };
        },
        methods: {
            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            }
        },
        components: {}
    };
</script>
