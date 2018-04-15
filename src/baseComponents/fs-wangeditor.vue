<template>
    <div>
        <div class="fs-wangeditor-toolbar" ref="tool"></div>
        <div style="padding: 8px 0; color: #ccc"></div>
        <div class="fs-wangeditot-text" ref="content"> <!--可使用 min-height 实现编辑区域自动增加高度-->
        </div>
    </div>
</template>
<style lang="less">
    .fs-wangeditor-toolbar {
        padding: 0;
        font-size: 16px;
        border-top: 1px solid #ddd;
        border-bottom: 1px solid #ddd;
    }
    .fs-wangeditot-text {
        min-height: 500px;
        width: 690px;
        .w-e-text {
            padding: 0;
            overflow-y: auto;
            font-size: 16px;
        }
    }
</style>
<script>
    import E from 'wangeditor';
    export default {
        name: 'FsWangeditor',
        props: {
            imgUrl: String,
            menus: {
                type: Array,
                default() {
                    return [
                        'head', // 标题
                        'bold', // 粗体
                        'fontSize', // 字号
                        'fontName', // 字体
                        'italic', // 斜体
                        'underline', // 下划线
                        'strikeThrough', // 删除线
                        'foreColor', // 文字颜色
                        'backColor', // 背景颜色
                        'link', // 插入链接
                        'list', // 列表
                        'justify', // 对齐方式
                        'quote', // 引用
                        'emoticon', // 表情
                        'image', // 插入图片
                        'table', // 表格
                        'video', // 插入视频
                        'code', // 插入代码
                        'undo', // 撤销
                        'redo' // 重复
                    ];
                }
            }
        },
        data () {
            return {
                editorContent: ''
            };
        },
        methods: {
        },
        mounted() {
            let editor = new E(this.$refs.tool, this.$refs.content);
            editor.customConfig.uploadImgServer = this.imgUrl;
            editor.customConfig.menus = this.menus;
            editor.customConfig.onchange = (html) => {
                this.editorContent = html;
            };
            editor.create();
        },
        components: {}
    };
</script>
