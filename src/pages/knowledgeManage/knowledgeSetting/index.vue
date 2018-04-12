<template>
    <div>
        <Row :gutter="16">
            <Col :span="4">
                <fs-knowledge-tree></fs-knowledge-tree>
            </Col>
            <Col :span="20">
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
