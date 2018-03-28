<template>
    <div id="exam-people-show">
        <h2 class="title">参加考试人员</h2>
        <div class="wrapper">
            <div v-for="item, index in peopleList" :key="'people-list-' + index" style="margin-bottom: 16px">
                <h3 style="margin-bottom: 8px;">{{item.organizeName}}</h3>
                <Row type="flex">
                    <Col v-for="people, pindex in item.peopleList"
                         :span="3"
                         class="fs-row"
                         :key="'people-' + index + '-' + pindex">
                        <div class="each-people">
                            <Avatar :src="'/oa/upload/head/' + people.headimagepath" size="large" />
                            <span>{{people.realname}}</span>
                            <span>({{people.postname}})</span>
                        </div>
                        <div class="btn-panel" v-if="editorabled">
                            <Button type="error"
                                    shape="circle"
                                    @click="_delPeople(people)"
                                    icon="trash-a"></Button>
                        </div>
                    </Col>
                </Row>
            </div>
            <Spin size="large" fix v-if="loading"></Spin>
        </div>
    </div>
</template>
<style lang="less">
    #exam-people-show {
        .wrapper {
            max-height: 590px;
            overflow: auto;
            .fs-row {
                position: relative;
                margin-bottom: 8px;
                &:hover .btn-panel{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .btn-panel {
                    position: absolute;
                    display: none;
                    left: 0;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    z-index: 100;
                    background-color: rgba(0,0,0,0.5);
                    border-radius: 6px;
                }
            }
            .each-people {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }
        }
        & > .title {
            text-align: center;
        }
    }

</style>
<script>
    export default {
        name: 'peopleShow',
        props: {
            id: {
                type: Number,
                default: 0
            },
            editorabled: {
                type: Boolean,
                default: false
            }
        },
        watch: {
            id() {
                this._getPeopleList();
            }
        },
        data () {
            return {
                loading: false,
                peopleList: []
            };
        },
        methods: {
            _delPeople(data) {
                let sendData = {};
                sendData.id = this.id;
                sendData.stuIds = data.id;
                this.$http.post('/examtestpaper/testDelUser', sendData).then((res) => {
                    if (res.success) {
                        this._getPeopleList();
                        this.$emit('del-people-success');
                    }
                });
            },
            _returnNeedList(data) {
                let allOId = [...(new Set(data.map(x => x.lv)))];
                let storeArray = [];
                allOId.forEach((item) => {
                    let obj = {};
                    let peopleList = data.filter(x => x.lv === item);
                    obj.organizeName = peopleList[0].organizename;
                    obj.peopleList = peopleList;
                    obj.orgId = item;
                    storeArray.push(obj);
                });
                return storeArray;
            },
            _getPeopleList() {
                if (!this.id) return;
                this.loading = true;
                let sendData = {};
                sendData.page = 1;
                sendData.pageSize = 10000;
                sendData.id = this.id;
                this.$http.post('/user/getStuTest', sendData).then((res) => {
                    if (res.success) {
                        this.peopleList = this._returnNeedList(res.data);
                    }
                }).finally(() => {
                    this.loading = false;
                });
            }
        },
        components: {}
    };
</script>
