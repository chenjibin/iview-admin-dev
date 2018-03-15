<template>
    <Form :model="value"
          ref="formInstance"
          :label-width="labelWidth">
        <fs-form-item  v-for="item in formConfig.formItemList"
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
            formConfig: {
                type: Object,
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
            formConfig: {
                deep: true,
                handler(val) {
                    console.log(val);
                }
            }
        },
        data() {
            return {};
        },
        mounted() {
            this.setDefaultValue();
        },
        methods: {
            handleInput(val, key) {
                let obj = Object.assign(JSON.parse(JSON.stringify(this.value)), {[key]: val});
                this.$emit('input', obj);
            },
            setDefaultValue() {
                const formData = JSON.parse(JSON.stringify(this.value));
                // 设置默认值
                this.formConfig.formItemList.forEach(item => {
                    const { key, value } = item;
                    if (formData[key] === undefined || formData[key] === null) {
                        formData[key] = value;
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
