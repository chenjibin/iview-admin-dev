<template>
    <Select
            v-model="filterPeopleData"
            :multiple="multiple"
            filterable
            remote
            :clearable="clearable"
            :label="remoteLabel"
            :remote-method="_filterPeopleRemote"
            :loading="filterPeopleLoading">
        <Option v-for="(option, index) in filterPeopleOpt"
                :value="option.id"
                :key="'user' + option.id">{{option.realname + '(' + option.organizename + ')'}}</Option>
    </Select>
</template>
<script>
    export default {
        name: 'fsSearchUser',
        model: {
            prop: 'value',
            event: 'change'
        },
        props: {
            multiple: {
                type: Boolean,
                default: false
            },
            clearable: {
                type: Boolean,
                default: false
            },
            option: Array,
            label: [String, Number, Array],
            value: {
                type: [String, Number, Array],
                default: ''
            }
        },
        watch: {
            filterPeopleData(val) {
                this.$emit('change', val);
            }
        },
        data () {
            return {
                filterPeopleData: this.value,
                filterPeopleLoading: false,
                remoteLabel: this.label,
                filterPeopleOpt: this.option
            };
        },
        methods: {
            _filterPeopleRemote(val) {
                let data = {};
                data.name = val;
                this.filterPeopleLoading = true;
                this.$http.get('/user/getCheckUser', {params: data}).then((res) => {
                    if (res.success) {
                        this.filterPeopleOpt = res.date;
                    }
                }).finally(() => {
                    this.filterPeopleLoading = false;
                });
            }
        }
    };
</script>
