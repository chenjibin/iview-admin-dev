<template>
    <FormItem :label="item.label" :prop="item.key">
        <Input v-if="item.type==='input'" v-bind="$attrs" v-on="$listeners" :type="item.subtype"></Input>
        <InputNumber v-if="item.type==='number'" v-bind="$attrs" v-on="$listeners"></InputNumber>
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
