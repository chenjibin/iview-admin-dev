<template>
    <div id="exam-people-show">
        <h2 class="title">参考加考试人员</h2>
        <ul class="wrapper">
            <li v-for="item, index in peopleList" :key="'people-list-' + index">
                <h3>{{item.organizeName}}</h3>
                <Row>
                    <Col v-for="people, pindex in item.peopleList"
                         :span="3"
                         style="margin-bottom: 8px;"
                         :key="'people-' + index + '-' + pindex">
                        <div class="each-people">
                            <Avatar :src="'/oa/upload/head/' + people.headimagepath" size="large" />
                            <span>{{people.realname}}</span>
                            <span>({{people.postname}})</span>
                        </div>
                    </Col>
                </Row>
            </li>
        </ul>

    </div>
</template>
<style lang="less">
    #exam-people-show {
        .wrapper {
            max-height: 560px;
            overflow: auto;
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
            }
        },
        watch: {
            id() {
                this._getPeopleList();
            }
        },
        data () {
            return {
                peopleList: []
            };
        },
        methods: {
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
                let sendData = {};
                sendData.page = 1;
                sendData.pageSize = 1000;
                sendData.id = this.id;
                this.$http.post('/user/getStuTest', sendData).then((res) => {
                    if (res.success) {
                        this.peopleList = this._returnNeedList(res.data);
                    }
                });
            }
        },
        components: {}
    };
</script>
