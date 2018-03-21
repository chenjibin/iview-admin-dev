<template>
    <div id="fs-upload-list">
        <Upload
                ref="uploadDom"
                :show-upload-list="false"
                :on-success="handleSuccess"
                :format="['jpg','jpeg','png']"
                :max-size="2048"
                :on-error="handleError"
                :on-format-error="handleFormatError"
                :on-exceeded-size="handleMaxSize"
                :before-upload="handleBeforeUpload"
                :multiple="multiple"
                type="drag"
                :action="action"
                v-show="multiple === true || upload.length === 0"
                style="display: inline-block;width:58px;">
            <div style="width: 58px;height:58px;line-height: 58px;">
                <Icon type="camera" size="20"></Icon>
            </div>
        </Upload>
        <ul style="display: inline-block">
            <li class="demo-upload-list" v-for="item in upload">
                <template v-if="item.status === 'finished'">
                    <img :src="item.url">
                    <div class="demo-upload-list-cover">
                        <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                        <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                    </div>
                </template>
                <template v-else>
                    <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                </template>
            </li>
        </ul>
        <Modal title="预览图片"
               width="800"
               :styles="{zIndex: 1000}"
               :mask-closable="false"
               class-name="fs-img-pre"
               v-model="visible">
            <div style="max-height: 500px;overflow-y: auto;">
                <img :src="imgName" v-if="visible" style="max-width: 100%">
            </div>
            <div slot="footer">
                <Button type="ghost" @click="visible = false">关闭</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    export default {
        name: 'fsImgUpload',
        props: {
            path: {
                type: String,
                default: ''
            },
            action: String,
            multiple: {
                type: Boolean,
                default: false
            },
            upload: {
                type: Array,
                default() {
                    return [];
                }
            }
        },
        data () {
            return {
                imgName: '',
                visible: false
            };
        },
        methods: {
            updateUploadList() {
                let fileList = this.$refs.uploadDom.fileList;
                this.$emit('update:upload', fileList);
                this.$emit('update', fileList);
            },
            handleView (url) {
                this.imgName = url;
                this.visible = true;
            },
            handleError() {
                this.$Message.error('系统错误，请重新上传!');
            },
            handleRemove (file) {
                const fileList = this.$refs.uploadDom.fileList;
                this.$refs.uploadDom.fileList.splice(fileList.indexOf(file), 1);
                this.updateUploadList();
            },
            removeAllPicFlie() {
                this.$refs.uploadDom.fileList = [];
            },
            handleSuccess (res, file) {
                file.url = this.path + res.data.filename;
                file.name = res.data.filename;
                this.updateUploadList();
            },
            handleFormatError () {
                this.$Message.error('图片格式只能为.jpg 或者 .png!');
            },
            handleMaxSize () {
                this.$Message.error('图片大小不能超过2M!');
            },
            handleBeforeUpload () {
                const check = this.upload.length < 5;
                if (!check) {
                    this.$Message.error('最多只能上传5张图片!');
                }
                return check;
            }
        },
        mounted () {
            this.$refs.uploadDom.fileList = this.upload;
        }
    };
</script>
<style lang="less">
    .ivu-modal-wrap.fs-img-pre {
        z-index: 1001;
    }
    #fs-upload-list {
        display: flex;
        .demo-upload-list {
            display: inline-block;
            width: 60px;
            height: 60px;
            text-align: center;
            line-height: 60px;
            border: 1px solid transparent;
            border-radius: 4px;
            overflow: hidden;
            background: #fff;
            position: relative;
            box-shadow: 0 1px 1px rgba(0,0,0,.2);
            margin-right: 4px;
            img {
                width: 100%;
                height: 100%;
            }
            &-cover {
                display: none;
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                background: rgba(0,0,0,.6);
                i {
                    color: #fff;
                    font-size: 20px;
                    cursor: pointer;
                    margin: 0 2px;
                }
            }
            &:hover .demo-upload-list-cover{
                display: block;
            }
        }

    }
</style>
