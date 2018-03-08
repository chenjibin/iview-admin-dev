<template>
    <div id="in-exam-page">
        <Card>
            <div class="fs-list-wrapper">
                <div class="test-paper-info">
                    <h2 class="paper-name">{{paperInfo.name}}</h2>
                    <p>
                        <span>用时:</span>
                        <span>{{paperInfo.costTime}}分钟</span>
                        <span style="margin-left: 20px;">得分:</span>
                        <span>{{paperInfo.getScore}}</span>
                    </p>
                </div>
                <div class="" v-for="item,index in questionList" :key="index">
                    <div class="">
                        <Badge  :count="index + 1 + ''" class-name="test-badge"></Badge>
                        <span class="exam-type">{{item.type | _returnTypeName}}</span>
                        <span>得{{item.scoreNew}}分</span>
                    </div>
                    <p class="exam-name">{{item.name}}</p>
                    <img :src="item.questionPic | _returnPicUrl" v-if="item.questionpic" class="exam-pic"/>
                    <ul class="" v-if="[1, 2].indexOf(item.type) > -1">
                        <li v-for="option in item.optionList" :key="'option' + option.id">
                            <div>
                                <span>{{option.optionNum}}.</span>
                                <span>{{option.content}}</span>
                            </div>
                            <img :src="option.optionPic | _returnPicUrl"  v-if="option.optionPic"/>
                        </li>
                    </ul>
                    <div class="answer-block">
                        <span>我的答案:</span>
                        <span>{{ _returnAnswer(item.answerNew,item.type)}}</span>
                    </div>
                    <div class="answer-block">
                        <span>正确答案:</span>
                        <span>{{_returnAnswer(item.answer,item.type)}}</span>
                    </div>
                </div>
            </div>
        </Card>
    </div>
</template>

<style lang="less">
    .test-badge {
        background: #5cb85c !important;
    }
    #in-exam-page {
        height: 100%;
        width: 100%;
        overflow-x: hidden;
        overflow-y: auto;
        .timer-block {
            position: fixed;
            right: 0;
            top: 75px;
            padding: 10px;
            background-color: rgba(0,0,0,0.5);
            color: #fff;
            font-weight: 700;
            .time {
                font-size: 16px;
            }
            .time-title {
                font-size: 12px;
            }
        }
        .fs-list-wrapper {
            .test-paper-info {
                text-align: center;
                .paper-name {
                    font-size: 18px;
                }
            }
            .submit-btn {
                height: 50px;
                line-height: 50px;
            }
            .fs-list-item {
                width: 95%;
                padding: 8px;
                margin: 10px auto 20px auto;
                font-size: 0;
                .answer-block {
                    margin-top: 10px;
                    font-size: 16px;
                }
                .head {
                    margin-bottom: 10px;
                    font-size: 16px;
                    .exam-type {
                        display: inline-block;
                        line-height: 28px;
                        vertical-align: top;
                    }
                }
                .exam-name {
                    padding: 8px 0;
                    font-size: 16px;
                }
                .fs-radio-group {
                    padding: 10px 0;
                    margin-top: 10px;
                    text-align: center;
                    &.choose {
                        text-align: left;
                        .fs-choose-item {
                            display: flex;
                            flex-direction: column;
                            align-items: left;
                            font-size: 16px;
                        }
                        img {
                            max-width: 100%;
                            height: auto;
                            margin-top: 8px;
                        }
                    }
                }
            }
            .exam-pic {
                max-width: 100%;
            }
        }
    }
</style>

<script>
    export default {
        name: 'testResult',
        props: {
            paperInfo: {
                type: Object,
                default() {
                    return {};
                }
            },
            questionList: {
                type: Array,
                default() {
                    return [];
                }
            }
        },
        data () {
            return {};
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
                return val;
            }
        },
        methods: {
            _returnAnswer(answer, type) {
                if (type === 3) answer = +answer === 1 ? '正确' : '错误';
                return answer;
            }
        }
    };
</script>
