<template>
    <Select
            v-model="filterPeopleData"
            :multiple="multiple"
            filterable
            remote
            :label="remoteLabel"
            :remote-method="_filterPeopleRemote"
            :loading="filterPeopleLoading">
        <Option v-for="(option, index) in specAccessData.filterPeopleOpt" :value="option.id" :key="'user' + option.id">{{option.realname + '(' + option.organizename + ')'}}</Option>
    </Select>
</template>
<script>
    export default {
        name: 'fsSearchUser',
        props: {
            multiple: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                filterPeopleData: '',
                filterPeopleLoading: false,
                remoteLabel: '',
                filterPeopleOpt: []
            };
        },
        methods: {
            _filterPeopleRemote(val) {
                let data = {};
                data.name = val;
                this.specAccessData.filterPeopleLoading = true;
                this.$http.get('/user/getCheckUser', {params: data}).then((res) => {
                    if (res.success) {
                        this.filterPeopleOpt = res.date;
                    }
                }).finally(() => {
                    this.specAccessData.filterPeopleLoading = false;
                });
            }
        }
    };
</script>
