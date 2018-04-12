<template>
    <Form :model="value"
          ref="formInstance"
          :label-width="labelWidth">
        <fs-form-item  v-for="item in itemList"
                       :key="item.key"
                       v-if="value[item.key]!==undefined"
                       :item="item"
                       @input="handleInput($event, item.key)"
                       :value="value[item.key]"></fs-form-item>
    </Form>
</template>
<style>

</style>
<script>
    import fsFormItem from './item';
    export default {
        name: 'fsForm',
        props: {
            itemList: {
                type: Array,
                required: true
            },
            value: {
                type: Object,
                required: true
            },
            labelWidth: {
                type: Number
            }
        },
        watch: {
            itemList(value) {
                this.setDefaultValue();
            }
        },
        data() {
            return {};
        },
        methods: {
            validForm(foo) {
                this.$refs.formInstance.validate((valid) => {
                    if (valid) {
                        foo();
                    }
                });
            },
            resetForm() {
                this.$refs.formInstance.resetFields();
            },
            handleInput(val, key) {
                let obj = Object.assign(JSON.parse(JSON.stringify(this.value)), {[key]: val});
                this.$emit('input', obj);
            },
            setDefaultValue() {
                const formData = JSON.parse(JSON.stringify(this.value));
                // 设置默认值
                this.itemList.forEach(item => {
                    const { key, value } = item;
                    formData[key] = value;
                    if (item.type === 'number') {
                        formData[key] = +value;
                    }
                });
                this.$emit('input', formData);
            }
        },
        components: {
            fsFormItem
        }
    };
</script>
