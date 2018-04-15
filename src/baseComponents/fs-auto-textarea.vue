<template>
    <div>
        <textarea  rows="1"
                   ref="autoTextarea"
                   :value="currentValue"
                   class="fs-article-textarea"
                   @keydown.enter.prevent
                   @input="handleInput"
                   @keyup.delete="calcHeight"
                   placeholder="请输入文章标题"></textarea>
    </div>
</template>
<style lang="less">
    .fs-article-textarea {
        display: block;
        width: 100%;
        border: 0;
        font-size: 24px;
        line-height: 1.4;
        font-weight: 600;
        font-synthesis: style;
        outline: none;
        box-shadow: none;
        resize: none;
        overflow: auto;
        box-sizing: content-box;
    }
</style>
<script>
    export default {
        name: 'FsAutoTextarea',
        props: {
            value: {
                type: [String, Number],
                default: ''
            }
        },
        data () {
            return {
                currentValue: this.value,
                isComposition: false
            };
        },
        methods: {
            calcHeight() {
                let el = this.$refs.autoTextarea;
                el.style.height = 'auto';
                console.log(el.scrollHeight)
                el.style.height = el.scrollTop + el.scrollHeight + 'px';
            },
            handleInput(event) {
                let value = event.target.value;
                this.calcHeight();
                this.$emit('imput', value);
            },
            handlerCompositionstart() {
                this.isComposition = true;
            },
            handlerCompositionend(event) {
                this.calcHeight();
                this.isComposition = false;
            }
        },
        components: {}
    };
</script>
