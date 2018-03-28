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
                    <div class="fs-list-item" v-for="question,qindex in item.questionList" :key="'question-' + index + '-' + qindex">
                        <p class="exam-name">
                            <Badge  :count="qindex + 1 + ''" class-name="test-badge"></Badge>
                            <span>{{question.name}}</span>
                            <span>({{question.questionmark}}分)</span>
                        </p>
                        <img :src="question.questionpic | _returnPicUrl" v-if="question.questionpic" class="exam-pic"/>
                        <RadioGroup v-model="question.answerNew"
                                    vertical
                                    v-if="question.type === 1" >
                            <Radio :label="option.optionnum"
                                   v-for="option in question.optionlist"
                                   :key="'option' + option.id">
                                <span>{{option.optionnum}}.</span>
                                <img :src="option.optionpic | _returnPicUrl"  v-if="option.optionpic"/>
                                <span>{{option.content}}</span>
                            </Radio>
                        </RadioGroup>
                        <CheckboxGroup v-model="question.answerNew"
                                       vertical
                                       v-if="question.type === 2">
                            <Checkbox label="Eat"></Checkbox>
                            <Checkbox label="Sleep"></Checkbox>
                            <Checkbox label="Run"></Checkbox>
                            <Checkbox label="Movie"></Checkbox>
                        </CheckboxGroup>
                        <RadioGroup v-model="question.answerNew" v-if="question.type === 3">
                            <Radio label="male">Male</Radio>
                            <Radio label="female">Female</Radio>
                        </RadioGroup>
                        <Input v-model="question.answerNew"
                               type="textarea"
                               :autosize="{minRows: 2,maxRows: 5}"
                               v-if="question.type === 4 || question.type === 5"
                               placeholder="Enter something..."></Input>
                    </div>
                </div>
                <div class="">
                    <Button @click="_submitExam">答题完成！交卷</Button>
                </div>
            </div>
        </Card>
    </div>
</template>

<style lang="less">
    .test-badge {
        background: #5cb85c !important;
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
        name: 'inExam',
        props: {
            id: {
                type: Number,
                default: 0
            },
            paperId: {
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
            _submitExam() {
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
                console.log(storeArray);
                return storeArray;
            },
            _getPaperDetail() {
                if (!this.id) return;
                let sendData = {};
                sendData.id = this.id;
                sendData.paperId = this.paperId;
                this.$http.post('/exampaper/editPaper', sendData).then((res) => {
                    if (res.success) {
                        this.paperInfo = res.paper;
                        this.questionList = this.returnNeedList(res.questionList);
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
