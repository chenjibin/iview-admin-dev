<template>
    <div class="fs-wangeditor-vue">
        <div class="placeholder" v-show="holderShow">{{defaulText}}</div>
        <div class="editor">
            <div class="fs-wangeditor-toolbar" ref="tool"></div>
            <div style="padding: 4px 0; color: #ccc"></div>
            <div class="fs-wangeditot-text"
                 :style="{minHeight: minHeight + 'px'}"
                 ref="content"></div>

        </div>
    </div>
</template>
<style lang="less">
    .fs-wangeditor-vue {
        font-size: 16px;
        position: relative;
        .placeholder {
            position: absolute;
            left: 10px;
            top: 54px;
            z-index: 0;
            color: #666;
        }
        .editor {
            .fs-wangeditor-toolbar {
                padding: 0;
                border-top: 1px solid #ddd;
                border-bottom: 1px solid #ddd;
            }
            .fs-wangeditot-text {
                padding-left: 8px;
                width: 698px;
                .w-e-text {
                    padding: 0;
                    min-height: inherit;
                    overflow-y: auto;
                }
            }
        }
    }
</style>
<script>
    import E from 'wangeditor';
    import utils from '@/libs/util';
    export default {
        name: 'FsWangeditor',
        props: {
            imgUrl: String,
            minHeight: {
                type: Number,
                default: 500
            },
            defaulText: {
                type: '',
                default: '正文...'
            },
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
            },
            editorcontent: String
        },
        data () {
            return {
                holderShow: !this.editorcontent
            };
        },
        mounted() {
            let editor = new E(this.$refs.tool, this.$refs.content);
            editor.customConfig.uploadImgServer = this.imgUrl;
            editor.customConfig.menus = this.menus;
            editor.customConfig.onchange = (html) => {
                console.log(html)
                let realContent = utils.delHtmlTag(html);
                this.holderShow = !realContent;
                this.$emit('update:editorcontent', html);
            };
            editor.create();
            // if (this.editorcontent) {
            //     editor.txt.html(this.editorcontent);
            // } else {
            //     editor.txt.html(`<p>${this.defaulText}</p>`);
            // }
        },
        components: {}
    };
</script>
