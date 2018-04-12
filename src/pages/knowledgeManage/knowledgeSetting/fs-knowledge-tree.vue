<template>
    <div id="organization-manage">
        <Input class="fs-filter-tree"
               placeholder="按照菜单名称进行筛选"
               v-model="filterTextName">
        </Input>
        <div class="">
            <el-tree class="fs-tree"
                     :data="orgData"
                     :props="defaultProps"
                     node-key="id"
                     draggable
                     default-expand-all
                     highlight-current
                     :expand-on-click-node="false"
                     :filter-node-method="filterNode"
                     :render-content="renderContent"
                     ref="tree1">
            </el-tree>
        </div>
        <Modal v-model="depSettingFlag"
               :mask-closable="false"
               width="800">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>{{formType === 'create' ? '新增菜单' : '编辑菜单'}}</span>
            </p>
            <Form :model="depSettingForm"
                  ref="coinForm"
                  :rules="orgaRules"
                  :label-width="80">
                <Row type="flex">
                    <Col :span="24">
                    <FormItem label="上级菜单" prop="fatherId">
                        <el-cascader
                                :options="orgData"
                                :props="depProps"
                                v-model="depSettingForm.fatherId"
                                change-on-select
                                size="small"
                                style="width: 100%"
                        ></el-cascader>
                    </FormItem>
                    </Col>
                    <Col :span="24">
                    <FormItem prop="name" label="当前菜单">
                        <Input type="text"
                               v-model="depSettingForm.name"></Input>
                    </FormItem>
                    </Col>
                </Row>
            </Form>
            <div slot="footer">
                <Button type="primary"
                        v-show="formType === 'create'"
                        @click="_createDep">创建菜单</Button>
                <Button type="primary"
                        @click="_updateDep"
                        v-show="formType === 'update'">确认修改</Button>
                <Button type="ghost" style="margin-left: 8px" @click="depSettingFlag = false">取消</Button>
            </div>
        </Modal>
    </div>
</template>
<style>

</style>
<script>
    export default {
        name: 'FsKnowledgeTree',
        data () {
            return {
                orgData: [],
                formType: '',
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                depSettingFlag: false,
                filterTextName: '',
                orgaRules: {

                },
                depSettingForm: {
                }
            };
        },
        watch: {
            'filterTextName'(val) {
                this.$refs.tree1.filter(val);
            }
        },
        created() {
            this._getOrgData();
        },
        methods: {
            _getOrgData() {
                this.$http.get('/knowledge/getMenu').then((res) => {
                    if (res.success) {
                        this.orgData = res.data;
                    }
                });
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },
            renderContent(h, { node, data, store }) {
                return (
                    <div class="fs-node-wrapper">
                        <div class="title">
                            <span class="head">{data.name}</span>
                        </div>
                        <div class="tag-group">
                            <i-button  on-click={ () => this.append(store, data) }  size="small" style="margin-left:6px;" type="success">新增</i-button>
                            <i-button  on-click={ () => this.editInfo(store, data) } size="small" style="margin-left: 6px;" type="primary">编辑</i-button>
                            <i-button  on-click={ () => this.remove(store, data) } size="small" style="margin-left: 6px;" type="error">删除</i-button>
                        </div>
                    </div>);
            }
        },
        components: {}
    };
</script>
