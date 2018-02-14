<template>
    <div id="fs-cropper-img">
        <Row>
            <Col :span="24" style="margin-bottom: 8px;">
                <div class="image-editor-con1-btn-con margin-top-10">
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
            <Col :span="12">
                <div class="crop-img-wrapper">
                    <img id="crop-img"/>
                </div>
            </Col>
            <Col :span="12">
                <div class="img-preview-wrapper">
                    <div id="preview1" class="preview"></div>
                </div>
                <p style="margin-top: 8px;font-size: 14px;font-weight: 700;text-align: center;">修改后的头像</p>
                <Button></Button>
            </Col>
        </Row>
        <Modal v-model="option1.showCropedImage">
            <p slot="header">预览裁剪之后的图片</p>
            <img :src="option1.cropedImg" alt="" v-if="option1.showCropedImage" style="width: 100%;">
        </Modal>
    </div>
</template>
<style lang="less">
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
                cropper: {},
                option1: {
                    showCropedImage: false,
                    cropedImg: ''
                }
            };
        },
        methods: {
            handlecrop () {
                let file = this.cropper.getCroppedCanvas().toDataURL();
                this.option1.cropedImg = file;
                this.option1.showCropedImage = true;
            },
            handleChangeImg (e) {
                let file = e.target.files[0];
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
