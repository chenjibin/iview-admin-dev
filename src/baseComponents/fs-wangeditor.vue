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
            color: #999;
        }
        .editor {
            .fs-wangeditor-toolbar {
                padding: 0;
                width: 698px;
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
    import biaoqing from './biaoqing';
    const biaoqingcontent = biaoqing.map(x => {
        let obj = {};
        obj.alt = x.phrase;
        obj.src = x.url;
        return obj;
    });
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
                holderShow: !this.editorcontent,
                editor: null
            };
        },
        mounted() {
            let vm = this;
            this.editor = new E(this.$refs.tool, this.$refs.content);
            this.editor.customConfig.onfocus = function () {
                vm.holderShow = false;
            };
            this.editor.customConfig.onblur = function (html) {
                if (/img/g.test(html)) {
                    vm.holderShow = false;
                } else {
                    let realContent = utils.delHtmlTag(html);
                    vm.holderShow = !realContent;
                }
            };
            this.editor.customConfig.customUploadImg = function (files, insert) {
                const xhr = new XMLHttpRequest();
                const formData = new FormData();
                formData.append(files[0].name, files[0]);
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                        let respondData = JSON.parse(xhr.responseText);
                        if (respondData.success) {
                            insert(respondData.data[0].filename);
                        }
                    }
                };
                xhr.open('post', vm.imgUrl, true);
                xhr.send(formData);
            };
            this.editor.customConfig.menus = this.menus;
            this.editor.customConfig.emotions = [
                {
                    title: '默认',
                    type: 'image',
                    content: biaoqingcontent
                }
            ];
            this.editor.customConfig.onchange = (html) => {
                if (/img/g.test(html)) {
                    this.holderShow = false;
                } else {
                    let realContent = utils.delHtmlTag(html);
                    this.holderShow = !realContent;
                }
                this.$emit('update:editorcontent', html);
            };
            this.editor.create();
            if (this.editorcontent) this.editor.txt.html(this.editorcontent);
        },
        methods: {
            clearContent() {
                if (this.editor) {
                    this.editor.txt.html('');
                    this.$emit('update:editorcontent', '');
                }
            }
        }
    };
</script>
