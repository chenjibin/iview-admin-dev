<template>
    <div id="fs-cropper-img">
        <Row>
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
            <Col :span="12" class="margin-top-8">
                <div class="crop-img-wrapper">
                    <img id="crop-img"/>
                </div>
            </Col>
            <Col :span="12" class="margin-top-8">
                <div class="img-preview-wrapper">
                    <div id="preview1" class="preview"></div>
                </div>
                <p style="margin-top: 8px;font-size: 14px;font-weight: 700;text-align: center;">修改后的头像</p>
                <div class="margin-top-8" style="text-align: center;">
                    <Button type="primary" @click="_submitImgChange" :loading="btnLoading">提交修改</Button>
                </div>
            </Col>
        </Row>
    </div>
</template>
<style lang="less">
    @import '../../styles/common.less';
    @import "./image-editor.less";
</style>
<script>
    import Cropper from 'cropperjs';
    import './cropper.min.css';
    export default {
        name: 'fsCropperImg',
        props: {
        },
        data () {
            return {
                btnLoading: false,
                cropper: {},
                fileType: '',
                option1: {
                    cropedImg: ''
                }
            };
        },
        methods: {
            _submitImgChange() {
                let vm = this;
                this.btnLoading = true;
                this.cropper.getCroppedCanvas().toBlob(function (blob) {
                    let xhr = new XMLHttpRequest();
                    let formData = new FormData();
                    formData.append('imgFile', blob);
                    xhr.onreadystatechange = function() {
                        if (xhr.status === 200) {
                            // xhr.responseText就是返回的数据
                        }
                        this.btnLoading = false;
                    };
                    // 开始上传
                    xhr.open('POST', '/oa/od/uploadfile', true);
                    xhr.send(formData);
                }, vm.fileType || 'image/png');
            },
            handleChangeImg (e) {
                let file = e.target.files[0];
                console.log(file);
                this.fileType = file.type;
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
                preview: '#preview1',
                aspectRatio: 1
            });
        },
        components: {}
    };
</script>
