<template>
    <Modal :value="visible"
           width="600"
           @on-visible-change="visibleChange"
           :mask-closable="false">
        <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
            <span>请假申请</span>
        </p>
        <Form :model="leaveSendForm"
              :rules="leaveRules"
              :label-width="80">
            <Row>
                <Col :span="12">
                    <FormItem label="请假类型">
                        <Select v-model="leaveSendForm.type">
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
                        <DatePicker v-model="leaveSendForm.startDate"
                                    :clearable="false"
                                    @on-change="_setDate('startDate', $event)"></DatePicker>
                    </FormItem>
                </Col>
                <Col :span="12">
                    <FormItem label="开始时间">
                        <Select v-model="leaveSendForm.startTime">
                            <Option :value="item"
                                    v-for="(item, index) in startTimeOpt"
                                    :key="'start-time-' + index">{{item}}</Option>
                        </Select>
                    </FormItem>
                </Col>
                <Col :span="12">
                    <FormItem label="结束日期">
                        <DatePicker v-model="leaveSendForm.endDate"
                                    :clearable="false"
                                    @on-change="_setDate('endDate', $event)"
                        ></DatePicker>
                    </FormItem>
                </Col>
                <Col :span="12">
                    <FormItem label="结束时间">
                        <Select v-model="leaveSendForm.endTime">
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
                <FormItem label="图片证明">
                    <fs-upload-img></fs-upload-img>
                </FormItem>
                </Col>
                <Col :span="24">
                    <FormItem label="原因描述" prop="content">
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
    import FsUploadImg from '@/baseComponents/fs-upload-img';
    const NOW_TIME = moment().format('YYYY-MM-DD');
    export default {
        props: {
            visible: Boolean
        },
        watch: {
            'leaveSendForm.startDate'(val) {
                if (moment(val).isAfter(this.leaveSendForm.endDate)) {
                    this.leaveSendForm.endDate = val;
                }
                this.leaveSendForm.numberDay = this._getDayNumber();
            },
            'leaveSendForm.endDate'(val) {
                if (moment(val).isBefore(this.leaveSendForm.startDate)) {
                    this.leaveSendForm.startDate = val;
                }
                this.leaveSendForm.numberDay = this._getDayNumber();
            },
            'leaveSendForm.startTime'() {
                this.leaveSendForm.numberDay = this._getDayNumber();
            },
            'leaveSendForm.endTime'() {
                this.leaveSendForm.numberDay = this._getDayNumber();
            }
        },
        components: {
            FsUploadImg
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
                leaveRules: {
                    content: [
                        {required: true, message: '原因不能为空!', trigger: 'blur'}
                    ]
                },
                leaveSendForm: {
                    type: '1',
                    submitDate: moment().format('YYYY-MM-DD'),
                    startDate: NOW_TIME,
                    endDate: NOW_TIME,
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
            _getDayNumber() {
                let formData = this.leaveSendForm;
                if (formData.startDate && formData.endDate && formData.startTime && formData.endTime) {
                    let dayDur = (moment(formData.endDate).unix() - moment(formData.startDate).unix()) / (60 * 60 * 24);
                    let st = +formData.startTime.substr(0, 2);
                    let et = +formData.endTime.substr(0, 2);
                    let dayminus = 0;
                    let dayNeed = 0;
                    if (st > et) {
                        dayminus = -1;
                        et += 24;
                    }
                    if (et - st <= 6 && et - st > 0) {
                        dayNeed = 0.5;
                    } else if (et - st > 6) {
                        dayNeed = 1;
                    }
                    return (dayDur + dayminus + dayNeed);
                } else {
                    return 0;
                }
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
