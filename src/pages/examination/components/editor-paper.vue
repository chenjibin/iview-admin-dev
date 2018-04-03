<template>
    <div class="fs-exam-paper">
        <Card>
            <div class="fs-list-wrapper">
                <div class="test-paper-info">
                    <h2 class="paper-name">{{paperInfo.name}}</h2>
                    <p>
                        <span>总分:</span>
                        <span>{{paperInfo.totlemark}}分</span>
                    </p>
                </div>
                <div class="" v-for="item,index in questionList" :key="index">
                    <h3>
                        <span>{{numMap[index]}}、</span>
                        <span>{{typeMap[item.type - 1]}}:</span>
                    </h3>
                    <div class="fs-list-item"
                         v-for="question,qindex in item.questionList"
                         style="font-weight: 700"
                         :key="'question-' + index + '-' + qindex">
                        <p class="exam-name">
                            <Badge  :count="qindex + 1 + ''" class-name="test-badge"></Badge>
                            <span>{{question.name}}</span>
                            <span>({{question.questionmark}}分)</span>
                            <Button type="ghost"
                                    icon="ios-trash-outline"
                                    @click="_delQuestion(question)"
                                    v-if="editorabled" size="small"></Button>
                        </p>
                        <img :src="question.questionpic | _returnPicUrl"
                             v-if="question.questionpic" class="exam-pic"
                             style="margin: 8px 0 16px 0;max-width: 100%;"/>
                        <ul class="" v-if="[1, 2].indexOf(question.type) > -1">
                            <li v-for="option in question.optionlist" :key="'option' + option.id" style="margin-bottom: 8px;">
                                <div>
                                    <span>{{option.optionnum}}.</span>
                                    <span>{{option.content}}</span>
                                </div>
                                <img :src="option.optionpic | _returnPicUrl"
                                     style="max-width: 100%;"
                                     v-if="option.optionpic"/>
                            </li>
                        </ul>
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
            max-height: 600px;
            overflow: auto;
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
        name: 'editorPaper',
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
            _delQuestion(data) {
                let sendData = {};
                sendData.paperId = this.id;
                sendData.id = data.id;
                this.$http.post('/exampaper/delQuestion', sendData).then((res) => {
                    if (res.success) {
                        this._getPaperDetail();
                        this.$emit('del-question-success');
                    }
                });
            },
            _getPaperDetail() {
                if (!this.id) return;
                let sendData = {};
                sendData.id = this.id;
                this.$http.post('/exampaper/editPaper', sendData).then((res) => {
                    if (res.success) {
                        this.paperInfo = res.paper;
                        this.questionList = this.returnNeedList(res.questionList);
                    }
                });
            }
        }
    };
</script>
