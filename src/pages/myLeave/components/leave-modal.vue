<template>
    <Modal :value="visible"
           width="600"
           @on-visible-change="visibleChange"
           :mask-closable="false">
        <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
            <span>请假申请</span>
        </p>
        <Form :model="leaveSendForm" :label-width="80">
            <Row>
                <Col :span="12">
                    <FormItem label="请假类型">
                        <Select v-model="leaveSendForm.type" clearable>
                            <Option :value="item.value"
                                    :key="'od-type-' + index"
                                    v-for="(item, index) in odTypeOpt">{{item.label}}</Option>
                        </Select>
                    </FormItem>
                </Col>
                <Col :span="12">
                    <FormItem label="提交日期">
                        <DatePicker :value="leaveSendForm.submitDate"
                                    readonly></DatePicker>
                    </FormItem>
                </Col>
                <Col :span="12">
                    <FormItem label="开始日期">
                        <DatePicker :value="leaveSendForm.startDate"
                                    @on-change="_setDate('startDate', $event)"></DatePicker>
                    </FormItem>
                </Col>
                <Col :span="12">
                    <FormItem label="开始时间">
                        <Select v-model="leaveSendForm.startTime" clearable>
                            <Option :value="item"
                                    v-for="(item, index) in startTimeOpt"
                                    :key="'start-time-' + index">{{item}}</Option>
                        </Select>
                    </FormItem>
                </Col>
                <Col :span="12">
                    <FormItem label="结束日期">
                        <DatePicker :value="leaveSendForm.endDate"
                                    @on-change="_setDate('endDate', $event)"
                        ></DatePicker>
                    </FormItem>
                </Col>
                <Col :span="12">
                    <FormItem label="结束时间">
                        <Select v-model="leaveSendForm.endTime" clearable>
                            <Option :value="item"
                                    v-for="(item, index) in endTimeOpt"
                                    :key="'end-time-' + index">{{item}}</Option>
                        </Select>
                    </FormItem>
                </Col>
                <Col :span="12">
                    <FormItem label="请假天数">
                        <InputNumber :min="0"
                                     :step="0.5"
                                     v-model="leaveSendForm.numberDay"></InputNumber>
                    </FormItem>
                </Col>
                <Col :span="24">
                    <FormItem label="原因描述">
                        <Input v-model="leaveSendForm.content" type="textarea"
                               :autosize="{minRows: 2,maxRows: 5}"
                               placeholder="原因..."></Input>
                    </FormItem>
                </Col>
            </Row>
        </Form>
        <div slot="footer">
            <Button type="primary" @click="">提交申请</Button>
            <Button type="ghost" style="margin-left: 8px" @click="hideModel">取消</Button>
        </div>
    </Modal>
</template>
<style>

</style>
<script>
    import moment from 'moment';
    export default {
        props: {
            visible: Boolean
        },
        data () {
            return {
                odTypeOpt: [
                    {
                        value: '1',
                        label: '事假'
                    },
                    {
                        value: '2',
                        label: '病假'
                    },
                    {
                        value: '3',
                        label: '婚假'
                    },
                    {
                        value: '4',
                        label: '产假'
                    },
                    {
                        value: '5',
                        label: '年假'
                    },
                    {
                        value: '6',
                        label: '调休'
                    },
                    {
                        value: '7',
                        label: '丧假'
                    },
                    {
                        value: '8',
                        label: '生日假'
                    },
                    {
                        value: '9',
                        label: '出差'
                    },
                    {
                        value: '10',
                        label: '带薪休假'
                    },
                    {
                        value: '11',
                        label: '调班'
                    },
                    {
                        value: '12',
                        label: '陪护假'
                    }
                ],
                startTimeOpt: [
                    '07时30分',
                    '08时00分',
                    '08时20分',
                    '08时30分',
                    '09时00分',
                    '09时30分',
                    '12时00分',
                    '12时10分',
                    '12时30分',
                    '13时00分',
                    '14时30分',
                    '15时00分',
                    '15时30分',
                    '18时00分',
                    '18时30分',
                    '20时00分',
                    '20时30分'
                ],
                endTimeOpt: [
                    '00时30分',
                    '01时30分',
                    '04时00分',
                    '08时00分',
                    '12时00分',
                    '13时00分',
                    '14时30分',
                    '17时00分',
                    '17时10分',
                    '17时30分',
                    '18时00分',
                    '18时30分',
                    '19时00分',
                    '19时30分',
                    '20时40分',
                    '21时00分',
                    '22时30分'
                ],
                leaveSendForm: {
                    type: '',
                    submitDate: moment().format('YYYY-MM-DD'),
                    startDate: '',
                    endDate: '',
                    startTime: '',
                    endTime: '',
                    numberDay: 0,
                    content: ''
                }
            };
        },
        methods: {
            _setDate(key, value) {
                this.leaveSendForm[key] = value;
            },
            visibleChange(val) {
                if (!val) this.$emit('update:visible', false);
            },
            hideModel() {
                this.$emit('update:visible', false);
            }
        }
    };
</script>
