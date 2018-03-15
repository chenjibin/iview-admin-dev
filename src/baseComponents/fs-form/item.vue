<template>
    <FormItem :label="item.label" :prop="item.key">
        <Input v-if="item.type==='input'"
               v-bind="$attrs"
               v-on="$listeners"></Input>
        <Input v-if="item.type==='textarea'"
               v-bind="$attrs"
               v-on="$listeners"
               type="textarea"
               :autosize="{minRows: 2,maxRows: 4}"></Input>
        <InputNumber v-if="item.type==='number'"
                     v-bind="$attrs"
                     v-on="$listeners"></InputNumber>
    </FormItem>
</template>
<style>

</style>
<script>
    export default {
        name: 'fsFormItem',
        props: {
            item: {
                type: Object,
                required: true
            }
        },
        data () {
            return {};
        },
        components: {}
    };
</script>
