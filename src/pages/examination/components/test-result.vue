<template>
    <div class="fs-exam-paper">
        <Card>
            <div class="fs-list-wrapper">
                <div class="test-paper-info">
                    <h2 class="paper-name">{{paperInfo.name}}</h2>
                    <p>
                        <span>用时:</span>
                        <span>{{paperInfo.totletime}}分钟</span>
                        <span style="margin-left: 20px;">得分:</span>
                        <span>{{paperInfo.score}}</span>
                    </p>
                </div>
                <div class="" v-for="item,index in questionList" :key="index">
                    <h3>
                        <span>{{numMap[index]}}、</span>
                        <span>{{typeMap[item.type - 1]}}:</span>
                    </h3>
                    <div class="fs-list-item" v-for="question,qindex in item.questionList" :key="'question-' + index + '-' + qindex">
                        <p class="exam-name">
                            <Badge  :count="qindex + 1 + ''" class-name="test-badge"></Badge>
                            <span>{{question.name}}</span>
                            <span>({{question.questionmark}}分)</span>
                        </p>
                        <img :src="question.questionpic | _returnPicUrl"
                             v-if="question.questionpic"
                             style="margin: 8px 0 16px 0;max-width: 100%;"/>
                        <ul class="" v-if="[1, 2].indexOf(question.type) > -1">
                            <li v-for="option in question.optionlist" :key="'option' + option.id">
                                <div>
                                    <span>{{option.optionnum}}.</span>
                                    <span>{{option.content}}</span>
                                </div>
                                <img :src="option.optionpic | _returnPicUrl"
                                     style="max-width: 100%;"
                                     v-if="option.optionpic"/>
                            </li>
                        </ul>
                        <div class="answer-block my">
                            <span>本题得分:</span>
                            <span>{{question.scorenew || 0}}</span>
                        </div>
                        <div class="answer-block">
                            <span>我的答案:</span>
                            <span>{{ question.answernew}}</span>
                        </div>
                        <div class="answer-block">
                            <span>正确答案:</span>
                            <span>{{question.answer}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    </div>
</template>

<style lang="less">
    .test-badge {
        background: #333 !important;
    }
    .fs-exam-paper {
        height: 100%;
        width: 100%;
        overflow-x: hidden;
        overflow-y: auto;
        .fs-list-wrapper {
            .test-paper-info {
                text-align: center;
                .paper-name {
                    font-size: 18px;
                }
            }
            .fs-list-item {
                padding: 8px;
                margin: 10px auto 20px auto;
                font-size: 0;
                .exam-name {
                    margin: 8px 0;
                }
                .answer-block.my {
                    margin-top: 8px;
                }
                & > * {
                    font-size: 14px;
                }
            }
        }
    }
</style>

<script>
    export default {
        name: 'testResult',
        props: {
            id: {
                type: Number,
                default: 0
            }
        },
        data () {
            return {
                paperInfo: {},
                questionList: [],
                numMap: ['一', '二', '三', '四', '五'],
                typeMap: ['单选题', '多选题', '判断题', '填空题', '问答题']
            };
        },
        watch: {
            id() {
                this._getPaperDetail();
            }
        },
        filters: {
            _returnTypeName(val) {
                let name = '';
                switch (val) {
                    case 1: name = '单选题';
                        break;
                    case 2: name = '多选题';
                        break;
                    case 3: name = '判断题';
                        break;
                    case 4: name = '填空题';
                        break;
                    case 5: name = '问答题';
                        break;
                }
                return name;
            },
            _returnPicUrl(val) {
                return '/oa' + val;
            }
        },
        methods: {
            returnNeedList(data) {
                let allType = [...(new Set(data.map(x => x.type)))].sort((x, y) => { return x - y > 0; });
                let storeArray = [];
                allType.forEach((item) => {
                    let obj = {};
                    let questionList = data.filter(x => x.type === item);
                    obj.type = questionList[0].type;
                    obj.questionList = questionList;
                    storeArray.push(obj);
                });
                return storeArray;
            },
            _getPaperDetail() {
                if (!this.id) return;
                let sendData = {};
                sendData.id = this.id;
                sendData.pid = 1;
                this.$http.post('/examtest/queryLookTest', sendData).then((res) => {
                    if (res.success) {
                        this.paperInfo = res.data.test;
                        this.questionList = this.returnNeedList(res.data.questionList);
                    }
                });
            }
            // _returnAnswer(answer, type) {
            //     if (type === 3) answer = +answer === 1 ? '正确' : '错误';
            //     return answer;
            // }
        }
    };
</script>
