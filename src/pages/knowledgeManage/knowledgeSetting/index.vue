<template>
    <div>
        <Row :gutter="16">
            <Col :span="6">
                <fs-knowledge-tree></fs-knowledge-tree>
            </Col>
            <Col :span="18">
                <article-setting></article-setting>
            </Col>
        </Row>
    </div>
</template>
<style lang="less">

</style>
<script>
    import fsKnowledgeTree from './fs-knowledge-tree';
    import articleSetting from './article-setting';
    export default {
        name: 'knowledgeSetting',
        data () {
            return {};
        },
        components: {
            fsKnowledgeTree,
            articleSetting
        }
    };
</script>
