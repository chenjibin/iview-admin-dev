<template>
    <div class="fs-exam-paper">
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
                <div class="fs-list-item" v-for="item,index in questionList" :key="index">
                    <div class="">
                        <Badge  :count="index + 1 + ''" class-name="test-badge"></Badge>
                        <span class="exam-type">{{item.type | _returnTypeName}}</span>
                        <span>得{{item.scorenew}}分</span>
                    </div>
                    <p class="exam-name">{{item.name}}</p>
                    <img :src="item.questionpic | _returnPicUrl" v-if="item.questionpic" class="exam-pic"/>
                    <ul class="" v-if="[1, 2].indexOf(item.type) > -1">
                        <li v-for="option in item.optionlist" :key="'option' + option.id">
                            <div>
                                <span>{{option.optionnum}}.</span>
                                <span>{{option.content}}</span>
                            </div>
                            <img :src="option.optionpic | _returnPicUrl"  v-if="option.optionpic"/>
                        </li>
                    </ul>
                    <div class="answer-block my">
                        <span>我的答案:</span>
                        <span>{{ _returnAnswer(item.answernew,item.type)}}</span>
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
