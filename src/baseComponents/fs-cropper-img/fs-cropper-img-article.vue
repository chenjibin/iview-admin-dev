<template>
    <div id="fs-cropper-img-article">
        <Row v-show="!defaultimg">
            <Col :span="24">
            <div class="margin-top-10">
                <input type="file"
                       accept="image/png, image/jpeg, image/gif, image/jpg"
                       @change="handleChangeImg"
                       id="fileinput"
                       class="fileinput" />
                <label class="filelabel"
                       for="fileinput">
                    <Icon type="image"></Icon>
                    <span style="margin-left: 6px;">选择图片</span>
                </label>
            </div>
            </Col>
            <Col :span="24" class="margin-top-8">
            <p style="margin-top: 8px;font-size: 14px;font-weight: 700;">裁剪</p>
            <div class="crop-img-wrapper">
                <img id="crop-img"/>
            </div>
            </Col>
            <Col :span="24" class="margin-top-8">
            <p style="margin-top: 8px;font-size: 14px;font-weight: 700;">预览</p>
            <div class="img-preview-wrapper">
                <div id="preview1" class="preview"></div>
            </div>
            <div class="margin-top-8" style="text-align: center;">
                <Button type="primary" @click="_submitImgChange" :loading="btnLoading">确定</Button>
            </div>
            </Col>
        </Row>
        <div class="" v-show="defaultimg">
            <div class="have-img">
                <img :src="defaultimg"/>
                <div class="tool-box">
                    <Button type="error" @click.native.stop="_removeDefaultImg">删除</Button>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="less">
    @import '../../styles/common.less';
    @import "./article-img.less";
</style>
<script>
    import Cropper from 'cropperjs';
    import './cropper.min.css';
    export default {
        name: 'fsCropperImgArticle',
        props: {
            defaultimg: {
                type: String,
                default: ''
            }
        },
        data () {
            return {
                btnLoading: false,
                cropper: {},
                fileData: {
                    fileType: '',
                    fileName: ''
                },
                fileType: '',
                option1: {
                    cropedImg: ''
                },
                format: ['png', 'jpeg', 'gif', 'jpg']
            };
        },
        methods: {
            _removeDefaultImg() {
                this.$emit('update:defaultimg', '');
            },
            _checkFormat() {
                const fileFormat = this.fileData.fileName.split('.').pop().toLocaleLowerCase();
                return this.format.some(item => item.toLocaleLowerCase() === fileFormat);
            },
            _submitImgChange() {
                const check = this._checkFormat();
                if (!check) {
                    this.$Message.error('图片只支持png, jpeg, gif, jpg');
                    return;
                }
                let vm = this;
                this.btnLoading = true;
                this.cropper.getCroppedCanvas({width: 600, height: 336}).toBlob(function (blob) {
                    let xhr = new XMLHttpRequest();
                    let formData = new FormData();
                    formData.append('imgFile', blob);
                    xhr.onreadystatechange = function() {
                        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                            // xhr.responseText就是返回的数据
                            let respondData = JSON.parse(xhr.responseText);
                            console.log(respondData);
                            if (respondData.success) {
                                vm.$emit('update:defaultimg', respondData.data[0].filename);
                            }
                        }
                        vm.btnLoading = false;
                    };
                    // 开始上传
                    xhr.open('POST', '/oa/share/uploadFile', true);
                    xhr.send(formData);
                }, vm.fileData.fileType || 'image/png');
            },
            handleChangeImg (e) {
                let file = e.target.files[0];
                this.fileData.fileType = file.type;
                this.fileData.fileName = file.name;
                let reader = new FileReader();
                reader.onload = () => {
                    this.cropper.replace(reader.result);
                    reader.onload = null;
                };
                reader.readAsDataURL(file);
            }
        },
        mounted() {
            let img1 = document.getElementById('crop-img');
            this.cropper = new Cropper(img1, {
                dragMode: 'move',
                viewMode: 3,
                preview: '#preview1',
                aspectRatio: 25 / 14
            });
        },
        components: {}
    };
</script>
