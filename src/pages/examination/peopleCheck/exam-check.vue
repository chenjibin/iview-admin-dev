<template>
    <div class="fs-exam-paper-test">
        <Card>
            <div class="fs-list-wrapper">
                <div class="test-paper-info">
                    <h2 class="paper-name">{{testPaperInfo.papername}}</h2>
                    <p>
                        <span>总分:</span>
                        <span>{{testPaperInfo.totlemark}}分</span>
                        <span>得分:</span>
                        <span>{{testInfo.score}}分</span>
                    </p>
                </div>
                <div class="" v-for="item,index in questionList" :key="index">
                    <h3>
                        <span>{{numMap[index]}}、</span>
                        <span>{{typeMap[item.type - 1]}}:</span>
                    </h3>
                    <div class="fs-list-item"
                         v-for="question,qindex in item.questionList"
                         style="margin-bottom:16px;font-weight: 700;"
                         :key="'question-' + index + '-' + qindex">
                        <p class="exam-name">
                            <Badge  :count="qindex + 1 + ''" class-name="test-badge"></Badge>
                            <span>{{question.name}}</span>
                            <span>({{question.questionmark}}分)</span>
                        </p>
                        <img :src="question.questionpic | _returnPicUrl"
                             v-if="question.questionpic"
                             class="exam-pic"
                             style="margin: 8px 0 16px 0;"/>
                        <div class="">
                            <ul class="" v-if="[1, 2].indexOf(question.type) > -1">
                                <li v-for="option in question.optionlist" :key="'option' + option.id" style="margin-bottom: 8px;">
                                    <div>
                                        <span>{{option.optionnum}}.</span>
                                        <span>{{option.content}}</span>
                                    </div>
                                    <img :src="option.optionpic | _returnPicUrl"  v-if="option.optionpic"/>
                                </li>
                            </ul>
                            <div class="answer-block">
                                <span>正确答案:</span>
                                <span>{{question.answer}}</span>
                            </div>
                            <div class="answer-block">
                                <span>我的答案:</span>
                                <span>{{question.answernew}}</span>
                            </div>
                            <div class="answer-block">
                                <span>本题满分:</span>
                                <span>{{question.questionmark}}分</span>
                            </div>
                            <div class="answer-block">
                                <span>得分:</span>
                                <div class="" style="display: inline-block;" v-if="[4,5].indexOf(question.type) > -1">
                                    <InputNumber :min="0" :max="+question.questionmark" size="small" v-model="question.scorenew" @on-blur="_changeMark(question)"></InputNumber>分
                                </div>
                                <span v-else>{{question.scorenew}}分</span>
                            </div>
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
    .fs-exam-paper-test {
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
        name: 'examCheck',
        props: {
            id: {
                type: Number,
                default: 0
            }
        },
        data () {
            return {
                testPaperInfo: {},
                testInfo: {},
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
            _changeMark(data) {
                let sendData = {};
                sendData.newScore = data.scorenew;
                sendData.id = this.id;
                sendData.pid = data.id;
                sendData.type = data.type;
                this.$http.post('/examtestpaper/editQuestionScore', sendData).then((res) => {
                    if (res.success) {
                        this.$Message.success('得分修改成功！');
                        this._getPaperDetail();
                    }
                });
            },
            returnNeedList(data) {
                let allType = [...(new Set(data.map(x => x.type)))].sort((x, y) => { return x - y > 0; });
                let storeArray = [];
                allType.forEach((item) => {
                    let obj = {};
                    let questionList = data.filter(x => x.type === item);
                    questionList.forEach((item, index, array) => {
                        if (item.type === 2) {
                            array[index].answerNew = [];
                        } else {
                            array[index].answerNew = '';
                        }
                    });
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
                        this.testPaperInfo = res.data.testPaper;
                        this.testInfo = res.data.test;
                        this.questionList = this.returnNeedList(res.data.questionList);
                    }
                });
            },
            _returnAnswer(answer, type) {
                if (type === 3) answer = +answer === 1 ? '正确' : '错误';
                return answer;
            }
        }
    };
</script>
