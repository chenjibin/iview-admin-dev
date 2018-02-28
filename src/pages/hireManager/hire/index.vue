<template>
    <div id="hire">
        <Card>
            <Form inline :label-width="90">
                <FormItem label="姓名">
                    <Input type="text" style="width: 173px"
                           @on-change="_inputDebounce"
                           v-model="filterOpt.name"
                           placeholder="筛选姓名"></Input>
                </FormItem>
                <FormItem label="岗位">
                    <Input type="text" style="width: 173px"
                           @on-change="_inputDebounce"
                           v-model="filterOpt.postids"
                           placeholder="筛选岗位"></Input>
                </FormItem>
                <FormItem label="学历">
                    <Select type="text" style="width: 173px"
                            @on-change="_filterResultHandler"
                            v-model="filterOpt.education"
                            placeholder="筛选学历" clearable>
                        <Option value="本科">本科</Option>
                        <Option value="大专">大专</Option>
                        <Option value="高中">高中</Option>
                        <Option value="初中">初中</Option>
                    </Select>
                </FormItem>
                <FormItem label="性别">
                    <Select type="text" style="width: 173px"
                            @on-change="_filterResultHandler"
                            v-model="filterOpt.sex"
                            placeholder="筛选性别" clearable>
                        <Option value="男">男</Option>
                        <Option value="女">女</Option>
                    </Select>
                </FormItem>
                <FormItem label="电话">
                    <Input type="text" v-model="filterOpt.phone" style="width: 173px" placeholder="筛选号码"
                           @on-change="_inputDebounce"></Input>
                </FormItem>
                <FormItem label="信息来源">
                    <Select type="text" v-model="filterOpt.resumesource" style="width: 173px" placeholder="筛选来源"
                            @on-change="_filterResultHandler" clearable>
                        <Option value="1">58同城</Option>
                        <Option value="2">智联</Option>
                        <Option value="3">前程无忧</Option>
                        <Option value="4">其它</Option>
                        <Option value="5">现场招聘会</Option>
                        <Option value="6">微信公众号</Option>
                        <Option value="7">来电</Option>
                        <Option value="8">介绍</Option>
                        <Option value="9">校招</Option>
                        <Option value="10">人才市场</Option>
                    </Select>
                </FormItem>
                <FormItem label="毕业院校">
                    <Input type="text" style="width: 173px"
                           @on-change="_inputDebounce"
                           v-model="filterOpt.graduatedschool"
                           placeholder="筛选院校"></Input>
                </FormItem>
                <FormItem label="专业">
                    <Input type="text" style="width: 173px"
                           @on-change="_inputDebounce"
                           v-model="filterOpt.profession"
                           placeholder="筛选专业"></Input>
                </FormItem>
                <FormItem label="工作单位">
                    <Input type="text" style="width: 173px"
                           @on-change="_inputDebounce"
                           v-model="filterOpt.companyname"
                           placeholder="筛选单位"></Input>
                </FormItem>
                <FormItem label="婚否">
                    <Select type="text" style="width: 173px"
                            @on-change="_filterResultHandler"
                            v-model="filterOpt.marriage" clearable>
                        <Option value="已婚">已婚</Option>
                        <Option value="未婚">未婚</Option>
                    </Select>
                </FormItem>
                <FormItem label="预约时间">
                    <DatePicker format="yyyy-MM-dd" type="daterange" style="width: 173px"
                                @on-change="_monthDateChange('startdate',$event)"
                                :value="filterOpt.startdate"></DatePicker>
                </FormItem>
                <FormItem label="面试时间">
                    <DatePicker format="yyyy-MM-dd" type="daterange" style="width: 173px"
                                @on-change="_monthDateChange('interviewtime',$event)"
                                :value="filterOpt.interviewtime"></DatePicker>
                </FormItem>
                <FormItem label="试岗时间">
                    <DatePicker format="yyyy-MM-dd" type="daterange" style="width: 173px"
                                @on-change="_monthDateChange('testtime',$event)"
                                :value="filterOpt.testtime"></DatePicker>
                </FormItem>
                <FormItem label="移入时间" style="margin-right: 0;">
                    <DatePicker format="yyyy-MM-dd" type="daterange" style="width: 173px;"
                                @on-change="_monthDateChange('sparetime',$event)"
                                :value="filterOpt.sparetime"></DatePicker>
                </FormItem>
                <Button type="success" @click="showAddNew()" style="padding: 6px 5px;">新增</Button>
            </Form>
            <div style="position: relative">
                <Table :columns="postColumns"
                       ref="attendanceTable"
                       :loading="tableLoading"
                       :height="tableHeight"
                       :data="pageData.list">
                </Table>
                <div id="btn-fix-container">
                    <ButtonGroup class="btn-group-fix" vertical>
                        <Poptip trigger="hover" title="详细过滤" placement="left">
                            <all-status v-on:status="changeStatus" :type1="1" slot="content"></all-status>
                            <Button type="ghost" @click="changeType(1)" title="只看预约">预</Button>
                        </Poptip>
                        <Poptip trigger="hover" title="详细过滤" placement="left">
                            <all-status v-on:status="changeStatus" :type1="2" slot="content"></all-status>
                            <Button type="ghost" @click="changeType(2)" title="只看面试">面</Button>
                        </Poptip>
                        <Poptip trigger="hover" title="详细过滤" placement="left">
                            <all-status v-on:status="changeStatus" :type1="3" slot="content"></all-status>
                            <Button type="ghost" @click="changeType(3)" title="只看试岗">岗</Button>
                        </Poptip>
                        <Poptip trigger="hover" title="详细过滤" placement="left">
                            <all-status v-on:status="changeStatus" :type1="4" slot="content"></all-status>
                            <Button type="ghost" @click="changeType(4)" title="只看备选人才">才</Button>
                        </Poptip>
                        <Poptip trigger="hover" title="详细过滤" placement="left">
                            <all-status v-on:status="changeStatus" :type1="0" slot="content"></all-status>
                            <Button type="ghost" @click="changeType(0)" title="全部">全</Button>
                        </Poptip>
                    </ButtonGroup>
                </div>
            </div>
            <Page :total="pageData.totalCount"
                  :current="pageData.page"
                  @on-change="_setPage"
                  @on-page-size-change="_setPageSize"
                  :page-size="pageData.pageSize"
                  show-sizer
                  show-total
                  show-elevator
                  style="margin-top: 16px;"></Page>
        </Card>
        <Modal v-model="settingModalFlag"
               width="1000"
               :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>新建简历</span>
            </p>
            <Tabs type="card">
                <TabPane label="基本信息" style="overflow: hidden;">
                    <Form ref="talentBean" :label-width="100" style="overflow-y: auto;height: 600px;width: 981px;" inline>
                        <Input type="text" style="display: none" v-model="talentBean.id"></Input>
                        <FormItem label="姓名" style="width:430px">
                            <Input type="text" v-model="talentBean.name"></Input>
                        </FormItem>
                        <FormItem label="性别" style="width:430px">
                            <Select type="text" v-model="talentBean.sex">
                                <Option :value="1">男</Option>
                                <Option :value="2">女</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="岗位" style="width:430px">
                            <Select class="" id="postName" name="postName">
                                <Option :value="1">售前客服</Option>
                                <Option :value="2">专卖店店长</Option>
                                <Option :value="3">对账专员</Option>
                                <Option :value="4">售后</Option>
                                <Option :value="5">渠道专员</Option>
                                <Option :value="6">美工</Option>
                                <Option :value="7">操作工</Option>
                                <Option :value="8">采购专员</Option>
                                <Option :value="9">专卖店导购</Option>
                                <Option :value="10">渠道售后</Option>
                                <Option :value="11">微信客服</Option>
                                <Option :value="12">商品专员</Option>
                                <Option :value="13">仓库储备干部</Option>
                                <Option :value="14">营销专员</Option>
                                <Option :value="15">保姆</Option>
                                <Option :value="16">保安</Option>
                                <Option :value="17">货运司机</Option>
                                <Option :value="18">总账会计</Option>
                                <Option :value="19">微信运营专员</Option>
                                <Option :value="20">设计</Option>
                                <Option :value="21">仓库临时工</Option>
                                <Option :value="22">java</Option>
                                <Option :value="23">PHP</Option>
                                <Option :value="24">开票会计</Option>
                                <Option :value="25">人事专员</Option>
                                <Option :value="26">培训讲师</Option>
                                <Option :value="27">运营助理</Option>
                                <Option :value="28">电商储备干部</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="期望月薪" style="width:430px">
                            <Input type="text" v-model="talentBean.monthlysalary"></Input>
                        </FormItem>
                        <FormItem label="年龄" style="width:430px">
                            <Input type="text" v-model="talentBean.age"></Input>
                        </FormItem>
                        <FormItem label="手机" style="width:430px">
                            <Input type="text" v-model="talentBean.phone"></Input>
                        </FormItem>
                        <FormItem label="信息来源" style="width:430px">
                            <Select type="text" v-model="talentBean.resumesource">
                                <Option value="">请选择</Option>
                                <Option :value="1">58同城</Option>
                                <Option :value="2">智联</Option>
                                <Option :value="3">前程无忧</Option>
                                <Option :value="4">其它</Option>
                                <Option :value="5">现场招聘会</Option>
                                <Option :value="6">微信公众号</Option>
                                <Option :value="7">来电</Option>
                                <Option :value="8">介绍</Option>
                                <Option :value="9">校招</Option>
                                <Option :value="10">人才市场</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="工作经验" style="width:430px">
                            <InputNumber style="width: 100%" :min="0" :max="50" :step="1" :precision='0' v-model="talentBean.yearswork" placeholder="单位：年"></InputNumber>
                        </FormItem>
                        <FormItem label="电子邮箱" style="width:430px">
                            <Input type="text" v-model="talentBean.email"></Input>
                        </FormItem>
                        <FormItem label="预约时间" style="width:430px">
                            <DatePicker format="yyyy-MM-dd" type="daterange" style="width: 100%"
                                        @on-change="_infoDateChange(0,0,'appointment',$event)"
                                        :value="talentBean.appointment"></DatePicker>
                        </FormItem>
                        <FormItem label="身份证号码" style="width:430px">
                            <Input type="text" v-model="talentBean.idnum"></Input>
                        </FormItem>
                        <FormItem label="籍贯" style="width:430px">
                            <Input type="text" v-model="talentBean.account"></Input>
                        </FormItem>
                        <FormItem label="民族" style="width:430px">
                            <Input type="text" v-model="talentBean.nation"></Input>
                        </FormItem>
                        <FormItem label="紧急联系人" style="width:430px">
                            <Input type="text" v-model="talentBean.emperson"></Input>
                        </FormItem>
                        <FormItem label="联系人关系" style="width:430px">
                            <Input type="text" v-model="talentBean.emrelate"></Input>
                        </FormItem>
                        <FormItem label="联系人号码" style="width:430px">
                            <Input type="text" v-model="talentBean.emphone"></Input>
                        </FormItem>
                        <FormItem label="政治面貌" style="width:430px">
                            <Select type="text" v-model="talentBean.politicalstatus">
                                <Option value="党员">党员</Option>
                                <Option value="预备党员">预备党员</Option>
                                <Option value="入党积极分子">入党积极分子</Option>
                                <Option value="团员">团员</Option>
                                <Option value="群众">群众</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="婚姻状况" style="width:430px">
                            <Select type="text" v-model="talentBean.marriage">
                                <Option :value="1">已婚</Option>
                                <Option :value="2">未婚</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="详细住址" style="width:430px">
                            <Input type="textarea" :rows="5" v-model="talentBean.address"></Input>
                        </FormItem>
                        <FormItem label="项目经验" style="width:430px">
                            <Input type="textarea" :autosize="{minRows: 5,maxRows: 16}" v-model="talentBean.projectexperience"></Input>
                        </FormItem>
                        <FormItem label="专长技能" style="width:430px">
                            <Input type="textarea" :autosize="{minRows: 5,maxRows: 16}" v-model="talentBean.expertiseskills"></Input>
                        </FormItem>
                        <FormItem label="语言能力" style="width:430px">
                            <Input type="textarea" :autosize="{minRows: 5,maxRows: 16}" v-model="talentBean.languageskills"></Input>
                        </FormItem>
                        <FormItem label="自我评价" style="width:430px">
                            <Input type="textarea" :autosize="{minRows: 5,maxRows: 16}" v-model="talentBean.selfevaluation"></Input>
                        </FormItem>
                        <FormItem label="培训经历" style="width:430px">
                            <Input type="textarea" :autosize="{minRows: 5,maxRows: 16}" v-model="talentBean.trainingexperience"></Input>
                        </FormItem>
                        <FormItem label="面试意见" style="width:430px">
                            <Input type="textarea" :autosize="{minRows: 5,maxRows: 16}" v-model="talentBean.remarks"></Input>
                        </FormItem>
                    </Form>
                </TabPane>
                <TabPane label="教育状况" style="overflow: hidden;width: 967px;">
                    <Form :gutter="1" ref="educationForm" style="overflow-y: auto;height: 600px;width: 981px;" inline>
                        <div v-for="(item,index) in educationForm">
                            <FormItem label="开始时间" style="width:17%">
                                <DatePicker type="date" @on-change="_infoDateChange(1, index, 'starttime',$event)" :value="item.starttime"></DatePicker>
                            </FormItem>
                            <FormItem label="结束时间" style="width:17%">
                                <DatePicker type="date" @on-change="_infoDateChange(1, index, 'endtime',$event)" :value="item.endtime"></DatePicker>
                            </FormItem>
                            <FormItem label="毕业院校	" style="width:17%">
                                <Input type="text" v-model="item.graduatedschool"></Input>
                            </FormItem>
                            <FormItem label="专业" style="width:17%">
                                <Input type="text" v-model="item.profession"></Input>
                            </FormItem>
                            <FormItem label="学历" style="width:17%">
                                <Select type="text" v-model="item.education">
                                    <Option :value="1">博士研究生</Option>
                                    <Option :value="2">硕士研究生</Option>
                                    <Option :value="3">本科</Option>
                                    <Option :value="4">专科</Option>
                                    <Option :value="5">中专</Option>
                                    <Option :value="6">高中</Option>
                                    <Option :value="7">初中</Option>
                                </Select>
                            </FormItem>
                            <FormItem label="主键" style="display: none">
                                <Input type="text" v-model="item.id"></Input>
                            </FormItem>
                            <FormItem label="类型" style="display: none">
                                <Input type="text" v-model="item.type" value="2"></Input>
                            </FormItem>
                            <FormItem label="关联人" style="display: none">
                                <Input type="text" v-model="item.talentid"></Input>
                            </FormItem>
                            <FormItem label="操作" style="width:5%">
                                <Button style="color:#f46e65;font-size: 16px;padding: 3px 15px;" icon="ios-trash"
                                        @click="delForm(index,'educationForm')"></Button>
                            </FormItem>
                        </div>
                        <FormItem>
                            <Button type="primary" icon="android-add" style="margin-left: 8px"
                                    @click="educationForm.push({})">增加经历
                            </Button>
                        </FormItem>
                    </Form>
                </TabPane>
                <TabPane label="工作经历" style="padding-left: 1px;">
                    <Form ref="workingForm" inline style="overflow-y: auto;height: 600px;width: 981px;">
                        <div v-for="(item,index) in workingForm" style="margin: 10px auto;border-bottom: 1px solid #f3f3f3;">
                            <FormItem label="开始时间" style="width:18%">
                                <DatePicker type="date" @on-change="_infoDateChange(2, index, 'starttime',$event)" :value="item.starttime"></DatePicker>
                            </FormItem>
                            <FormItem label="结束时间" style="width:18%">
                                <DatePicker type="date" @on-change="_infoDateChange(2, index, 'endtime',$event)" :value="item.endtime"></DatePicker>
                            </FormItem>
                            <FormItem label="公司名称" style="width:18%">
                                <Input type="text" v-model="item.companyname"></Input>
                            </FormItem>
                            <FormItem label="职务" style="width:18%">
                                <Input type="text" v-model="item.post"></Input>
                            </FormItem>
                            <FormItem label="月薪" style="width:18%">
                                <Input type="text" v-model="item.monthlysalary"></Input>
                            </FormItem>
                            <FormItem label="工作描述" style="width:37%">
                                <Input type="textarea" :autosize="{minRows: 5,maxRows: 16}" v-model="item.descriptioncontent"></Input>
                            </FormItem>
                            <FormItem label="主键" style="display: none">
                                <Input type="text" v-model="item.id"></Input>
                            </FormItem>
                            <FormItem label="关联人" style="display: none">
                                <Input type="text" v-model="item.talentid"></Input>
                            </FormItem>
                            <FormItem label="类型" style="display: none">
                                <Input type="text" v-model="item.type" value="1"></Input>
                            </FormItem>
                            <FormItem label="操作" style="width:5%">
                                <Button style="color:#f46e65;font-size: 16px;padding: 3px 15px;" icon="ios-trash"
                                        @click="delForm(index,'workingForm')"></Button>
                            </FormItem>
                        </div>
                        <FormItem>
                            <Button type="primary" icon="android-add" style="margin-left: 8px"
                                    @click="workingForm.push({})">增加经历
                            </Button>
                        </FormItem>
                    </Form>
                </TabPane>
            </Tabs>
            <div slot="footer">
                <Button type="ghost" @click="settingModalFlag = false">
                    取消
                </Button>
                <Button type="primary" :loading="saveBtn1Loading"  @click="saveForm(1)">
                    <Icon type="bookmark"></Icon>
                    暂存
                </Button>
                <Button type="success"  :loading="saveBtn2Loading" @click="saveForm(2)">
                    <Icon type="checkmark-round"></Icon>
                    提交
                </Button>
            </div>
        </Modal>
        <Modal id="showUserModel" v-model="modalFlag2" width="550" :mask-closable="false">
            <div slot="header" style="color:#495060;text-align:center;font-size: 18px">面试管理</div>
            <div>
                <span class="showUserInfoItem">人员姓名:</span><span class="showUserInfoItem">{{showUser.name}}</span>
            </div>
            <div style="margin-top: 10px">
                <span class="showUserInfoItem">人员状态:</span><span class="showUserInfoItem">{{success_msg}}</span>
            </div>
            <Form ref="StatuForm" :label-width="100"
                  style="overflow-y: auto; overflow-x: hidden; max-height: 600px;margin-right: -12px;" inline>

            </Form>
            <Steps :current="calcStep" :status="calcStatus" style="margin: 25px auto">
                <Step title="预约" :content="error_msg.t1"></Step>
                <Step title="到达" :content="error_msg.t2"></Step>
                <Step title="面试" :content="error_msg.t3"></Step>
                <Step title="到达" :content="error_msg.t4"></Step>
                <Step title="试岗" :content="error_msg.t5"></Step>
            </Steps>
            <div slot="footer">
                <ButtonGroup>
                    <Button type="primary" @click="forward" :disabled="[-1].indexOf(showUser.status)>-1">
                        <Icon type="chevron-left"></Icon>
                        上一步
                    </Button>
                    <Button type="primary" @click="next" :disabled="[2,4,5,7,8,9].indexOf(showUser.status)>-1">
                        下一步
                        <Icon type="chevron-right"></Icon>
                    </Button>
                </ButtonGroup>
            </div>
        </Modal>
        <Modal v-model="changUserStatusModel">
            <Form ref="statusForm" :model="statusForm" :rules="rules" inline>
                <h3>当前人员{{success_msg}}</h3>
                <!---1.未预约 0.预约 1.已到达 2.未到达 3.合格 4.待定 5.不合格 6.合格到达 7.合格未到达 8.试岗通过 9.试岗未通过'-->
                <FormItem label="主键" style="display: none">
                    <Input type="text" :value="showUser.id"></Input>
                </FormItem>
                <FormItem label="姓名" style="width: 45%">
                    <Input type="text" :value="showUser.name" disabled></Input>
                </FormItem>
                <br />
                <FormItem label="用户名" prop="username" style="width: 45%"
                          v-if="(statusTemp === 6 || statusTemp === 3) && showUser.createaccount!=2 && (statusForm.status ==6 || statusForm.status == 8)">
                    <Input type="text" v-model="statusForm.username"></Input>
                </FormItem>
                <FormItem label="密码" style="width: 45%" v-if="(statusTemp === 6 || statusTemp === 3) && showUser.createaccount!=2 && (statusForm.status ==6 || statusForm.status == 8)">
                    <Input type="password" v-model="statusForm.password" placeholder="123456"></Input>
                </FormItem>
                <FormItem label="面试时间" prop="interviewtime" style="width: 45%" v-if="statusTemp === 1">
                    <DatePicker v-model="statusForm.interviewtime"  style="width: 100%" format="yyyy-MM-dd" type="date" ></DatePicker>
                </FormItem>
                <FormItem label="面试官" style="width: 45%" v-if="statusTemp === 1">
                    <Input type="text" v-model="statusForm.interviewer"></Input>
                </FormItem>
                <FormItem v-if="statusTemp === -1"  label="预约时间" prop="appointment" style="width: 45%">
                    <DatePicker v-model="statusForm.appointment"  style="width: 100%" format="yyyy-MM-dd" type="date"></DatePicker>
                </FormItem>
                <FormItem label="是否到达" prop="status"  style="width: 45%" v-if="statusTemp === 0|| statusTemp === 3">
                    <Select v-model="statusForm.status">
                        <Option value="1"  v-if="statusTemp === 0">到达</Option>
                        <Option value="2"  v-if="statusTemp === 0">未到达</Option>
                        <Option value="6" v-if="statusTemp === 3">到达</Option>
                        <Option value="7" v-if="statusTemp === 3">未到达</Option>
                    </Select>
                </FormItem>
                <FormItem v-if="statusTemp === 3" label="师傅" style="width: 45%">
                    <fsSearchUser v-model="statusForm.master"></fsSearchUser>
                </FormItem>
                <FormItem label="试岗时间" prop="testtime"  style="width: 45%" v-if="statusTemp === 6">
                    <DatePicker v-model="statusForm.testtime"  style="width: 100%" format="yyyy-MM-dd" type="date" ></DatePicker>
                </FormItem>
                <FormItem label="考核成绩" prop="testresults" style="width: 45%" v-if="statusTemp === 6">
                    <Input type="text" v-model="statusForm.testresults"></Input>
                </FormItem>

                <FormItem prop="status" label="是否通过" style="width: 45%" v-if="statusTemp === 1 || statusTemp === 6">
                    <Select v-model="statusForm.status">
                        <Option value="3" v-show="statusTemp === 1">合格</Option>
                        <Option value="4" v-show="statusTemp === 1">待定</Option>
                        <Option value="5" v-show="statusTemp === 1">不合格</Option>
                        <Option value="8" v-show="statusTemp === 6">试岗通过</Option>
                        <Option value="9" v-show="statusTemp === 6">试岗不通过</Option>
                    </Select>
                </FormItem>
                <FormItem label="入职时间" prop="joindate" style="width: 45%" v-if="statusTemp === 6">
                    <DatePicker style="width: 100%" format="yyyy-MM-dd"  type="date" v-model="statusForm.joindate"></DatePicker>
                </FormItem>
                <FormItem label="综合评价" style="width: 60%;">
                    <Input type="textarea" :autosize="{minRows: 2,maxRows: 6}" v-model="statusForm.remarks"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="ghost" @click="changUserStatusModel = false;">
                    取消
                </Button>
                <Button type="primary" @click="saveStatus()">
                    确定
                </Button>
            </div>
        </Modal>
        <Modal  v-model="showAttachModel" width="800" >
            <div style="max-height: 400px;overflow-x: hidden;overflow-y: auto;">
                <Card >
                    <Row :gutter="16">
                        <Col span="12" v-for="(item,index) in fileList" style="margin-bottom: 16px;" :key="index">
                            <Row>
                                <Col span="8">
                                    <h4 style="width: 150px;text-overflow: ellipsis;overflow: hidden;white-space:nowrap;">文件名：{{item.file_name}}</h4>
                                    <h4 style="margin-top: 10px">上传人：{{item.insert_username}}</h4>
                                    <h4 style="margin-top: 10px">下载：<Button style="font-size: 20px;cursor: pointer" icon="ios-cloud-download-outline" @click="download(item.file_path)"></Button>  </h4>
                                </Col>
                                <Col span="15" class="fileImg">
                                    <img style="width: 100%;cursor: pointer;height: 200px;display: block;position: relative" :src="item.file_path" alt="">
                                    <div class="mouse-on-hover">
                                        <Icon type="ios-eye-outline" @click.native="handleView(item.file_path)"></Icon>
                                        <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Card>
            </div>
            <Upload name="ifile" :on-success="handleSuccess" :show-upload-list="false" multiple :data="{'ticketno':ticketNo}" action="/oa/ticket/uploadticketfiles">
                <Button type="ghost" icon="ios-cloud-upload-outline">上传</Button>
            </Upload>
        </Modal>
        <Modal title="查看图片" v-model="visible" width="1000">
            <div style="max-height: 700px;max-width:1100px;overflow:auto;text-align: center;">
                <img :src="imgsrc" style="margin: 0 auto" v-if="visible">
            </div>
            <div slot="footer"></div>
        </Modal>
    </div>
</template>

<script>
    // 简单的axios薄层封装
    import pageMixin from '@/mixins/pageMixin';
    import allStatus from './allStatus';
    // lodash输入延时
    import debounce from 'lodash/debounce';
    import fsSearchUser from '@/baseComponents/fs-search-user';
    export default {
        name: 'hire',
        components: {
            allStatus,
            fsSearchUser
        },
        data () {
            const validateUsername = (rule, value, callback) => {
                if (value) {
                    this.$http.post('/user/getUserInfo', {username: value}).then((res) => {
                        if (res.success && res.data) {
                            var d = res.data;
                            callback(new Error(`用户名被 ${d.organizename}部，${d.realname}占用`));
                        } else {
                            callback();
                        }
                    });
                } else {
                    callback();
                }
            };
            return {
                changUserStatusModel: false, // 点击上下一步弹出
                showAttachModel: false, // 附件上传按钮
                visible: false, // 用户图片放大
                ticketNo: 0,
                modalFlag2: false, // 员工考核周期弹出
                settingModalFlag: false, // 简历模块弹出
                saveBtn2Loading: false, // 提交按钮加载
                saveBtn1Loading: false, // 暂存按钮加载
                filterOpt: {
                    name: '', // 员工姓名
                    startdate: [], // 预约日期左区间
                    status: [], // 面试状态
                    education: '', // 学历
                    phone: '', // 号码
                    sex: '',
                    marriage: '', //  婚否
                    companyname: '', // 工作单位
                    postids: '', // 工作岗位
                    graduatedschool: '', // 毕业院校
                    profession: '', // 专业
                    account: '', // 户籍
                    testtime: [], // 试岗时间
                    interviewtime: [], // 面试时间
                    sparetime: [] // 移入人才库时间
                }, // 查询
                educationForm: [
                    {
                        graduatedschool: '',
                        starttime: '',
                        endtime: '',
                        profession: '',
                        education: '',
                        type: 2,
                        descriptioncontent: ''
                    }
                ], // 简历教育历史
                workingForm: [
                    {
                        descriptioncontent: '',
                        companyname: '',
                        endtime: '',
                        starttime: '',
                        post: '',
                        type: 1,
                        monthlysalary: 0
                    }
                ], // 简历工作信息
                talentBean: {
                    id: '',
                    postname: '',
                    monthlysalary: '',
                    resumesource: '',
                    appointment: '',
                    name: '',
                    age: '',
                    yearswork: 0,
                    sex: '',
                    marriage: '',
                    phone: '',
                    email: '',
                    address: '',
                    account: '',
                    province_id: '',
                    city_id: '',
                    area_id: '',
                    selfevaluation: '',
                    expertiseskills: '',
                    projectexperience: '',
                    languageskills: '',
                    trainingexperience: '',
                    remarks: '',
                    headimg: '',
                    nation: '',
                    idnum: '',
                    politicalstatus: '',
                    emperson: '',
                    emrelate: '',
                    emphone: ''
                }, // 简历基本信息模块
                statusInfo: {}, // 每回合考核数据
                tableLoading: true, // 表格加载
                tableHeight: 400,
                error_msg: {}, // 员工考核周期中失败的信息
                success_msg: '', // 员工考核周期成功的信息
                showUser: {}, // 员工表格临时保存的单行数据
                calcStatus: 'process', // 员工考核周期中的状态样式
                calcStep: -1, // 员工考核周期中的第几周期
                statusForm: {
                    id: '',
                    status: '',
                    remarks: '',
                    joindate: '', // 入职时间
                    appointment: '', // 预约时间
                    interviewtime: '', // 面试时间
                    username: '', // 用户名
                    password: '', // 密码
                    testtime: '', // 试岗时间
                    testresults: 0, // 考核成绩
                    interviewer: '' // 面试官
                },
                statusTemp: -2,
                usersList: [],
                rules: {
                    joindate: [
                        { required: true, message: '入职时间必填', trigger: 'change', type: 'date' }
                    ],
                    appointment: [
                        { required: true, message: '预约时间必填', trigger: 'change', type: 'date' }
                    ],
                    interviewtime: [
                        { required: true, message: '面试时间必填', trigger: 'change', type: 'date' }
                    ],
                    testtime: [
                        { required: true, message: '试岗时间必填', trigger: 'change', type: 'date' }
                    ],
                    testresults: [
                        { required: true, message: '试岗成绩必填', trigger: 'blur' }
                    ],
                    status: [
                        { required: true, message: '是否合格或到达必填', trigger: 'change' }
                    ],
                    username: [
                        { validator: validateUsername, trigger: 'blur' }
                    ]
                },
                fileList: [],
                educationMapping: ['', '博士研究生', '硕士研究生', '本科', '专科', '中专', '高中', '初中'],
                resumeSourceMapping: ['', '58同城', '智联', '前程无忧', '其他网络渠道', '现场招聘会', '微信公众号', '来电', '介绍'],
                postColumns: [
                    {
                        title: '姓名',
                        key: 'name',
                        align: 'center',
                        fixed: 'left',
                        width: 90
                    },
                    {
                        title: '岗位',
                        key: 'poststring',
                        align: 'center',
                        fixed: 'left',
                        width: 160
                    },
                    {
                        title: '性别',
                        key: 'sex',
                        align: 'center',
                        width: 60,
                        render: (h, params) => {
                            if (params.row.sex === 1) {
                                return '男';
                            }
                            if (params.row.sex === 2) {
                                return '女';
                            }
                            return '';
                        }
                    },
                    {
                        title: '年龄',
                        key: 'age',
                        align: 'center',
                        width: 80
                    },
                    {
                        title: '学历',
                        key: 'education',
                        align: 'center',
                        width: 80,
                        render: (h, params) => {
                            return this.educationMapping[params.row.education];
                        }
                    },
                    {
                        title: '毕业院校',
                        key: 'graduatedschool',
                        width: 200
                    },
                    {
                        title: '专业',
                        key: 'profession',
                        width: 200
                    },
                    {
                        title: '电话',
                        key: 'phone',
                        align: 'center',
                        width: 120
                    },
                    {
                        title: '信息来源',
                        key: 'resumeSource',
                        align: 'center',
                        width: 150,
                        render: (h, params) => {
                            return this.resumeSourceMapping[+params.row.resumesource];
                        }
                    },
                    {
                        title: '预约时间',
                        key: 'appointment',
                        align: 'center',
                        width: 120
                    },
                    {
                        title: '面试时间',
                        key: 'interviewtime',
                        align: 'center',
                        width: 120
                    },
                    {
                        title: '试岗时间',
                        key: 'testtime',
                        align: 'center',
                        width: 120
                    },
                    {
                        title: '所在周期',
                        key: 'status',
                        width: 120,
                        align: 'center',
                        render: (h, params) => {
                            let vm = this;
                            let text = vm.getStatusText(params.row.status);
                            return text;
                        }
                    },
                    {
                        title: '面试官',
                        key: 'interviewer',
                        align: 'center',
                        width: 90
                    },
                    {
                        title: '面试意见',
                        key: 'remarks',
                        width: 400,
                        render: (h, params) => {
                            return h('span', {
                                style: {
                                    lineHeight: '2',
                                    fontSize: '14px'
                                }
                            }, params.row.remarks);
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        fixed: 'right',
                        width: 110,
                        render: (h, params) => {
                            var vm = this;
                            return h('div', {
                                style: {
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-around'
                                }
                            }, [
                                h('Tooltip', {
                                    props: {
                                        content: '进度设置',
                                        placement: 'top',
                                        transfer: true
                                    }
                                }, [
                                    h('Button', {
                                        props: {
                                            type: 'primary',
                                            icon: 'flash',
                                            shape: 'circle'
                                        },
                                        on: {
                                            click: function () {
                                                vm.changeUsersInfo(params.row);
                                                vm.modalFlag2 = true;
                                            }
                                        }
                                    }
                                    )
                                ]),
                                h('Tooltip', {
                                    props: {
                                        content: '修改简历',
                                        placement: 'top',
                                        transfer: true
                                    }
                                }, [
                                    h('Button', {
                                        props: {
                                            type: 'ghost',
                                            icon: 'edit',
                                            shape: 'circle'
                                        },
                                        on: {
                                            click: function () {
                                                vm.editUser(params.row);
                                            }
                                        }
                                    }
                                    )
                                ]),
                                h('Tooltip', {
                                    props: {
                                        content: '查看附件',
                                        placement: 'top',
                                        transfer: true
                                    }
                                }, [
                                    h('Button', {
                                        props: {
                                            type: 'ghost',
                                            icon: 'arrow-expand',
                                            shape: 'circle'
                                        },
                                        on: {
                                            click: function () {
                                                vm.showAttach(params.row);
                                            }
                                        }
                                    }
                                    )
                                ])
                            ]);
                        }
                    }
                ]
            };
        },
        mixins: [pageMixin],
        created () {
            this._getPostData();
            this._setTableHeight();
        },
        methods: {
            editUser(row) {
                this._findUser(row.id).then((res) => {
                    this.settingModalFlag = true;
                });
            },
            handleSuccess(res, file) {
                if (res.success) {
                    this.getTicketList(res.message);
                    this.$Message.success('上传成功');
                }
            },
            handleView(filePath) {
                this.imgsrc = filePath;
                this.visible = true;
            },
            // 删除附件
            handleRemove(item) {
                var vm = this;
                this.$Modal.confirm({
                    title: '删除提醒',
                    content: '是否确认删除？',
                    okText: '删除',
                    cancelText: '取消',
                    loading: true,
                    onOk () {
                        this.$http.post('/ticket/deleteTicketFile', item).then((res) => {
                            if (res.success) {
                                vm.getTicketList(item.ticket_no);
                                vm.$Modal.remove();
                                vm.$Message.success('删除成功');
                            }
                        });
                    }
                });
            },
            // 下载图片
            download(path) {
                window.open('http://' + window.location.host + path);
            },
            showAttach(user) {
                this.ticketNo = user.id + 666587;
                this.getTicketList(this.ticketNo);
                this.showAttachModel = true;
            },
            getTicketList(id) {
                var that = this;
                this.$http.post('/ticket/ticketFileslist', { 'ticketno': id }).then((res) => {
                    if (res.success) {
                        var d = res.data;
                        for (let i = 0; i < d.length; i++) {
                            d[i].file_path = d[i].file_path.replace('\\..', '\\oa');
                            if (d[i].file_path.indexOf('/oa') < 0) {
                                d[i].file_path = '/oa' + d[i].file_path;
                            }
                        }
                        that.fileList = res.data;
                    }
                });
            },
            delForm(index, formName) {
                var row = this[formName][index];
                var vm = this;
                if (row.id) {
                    this.$Modal.confirm({
                        title: '删除提醒',
                        content: '是否确认删除？',
                        okText: '删除',
                        cancelText: '取消',
                        loading: true,
                        onOk() {
                            this.$http.post('/talentLibrary/delRelation', {id: row.id}).then((res) => {
                                if (res.success) {
                                    vm.$Modal.remove();
                                    vm[formName].splice(index, 1);
                                    vm.$Message.success('删除成功');
                                } else {
                                    vm.$Message.error('删除失败');
                                }
                            });
                        }
                    });
                } else {
                    this[formName].splice(index, 1);
                }
            },
            changeStatus (status) {
                this.filterOpt.status = status;
                this._filterResultHandler();
            },
            saveForm(type) {
                if (type === 1) {
                    this.saveBtn1Loading = true;
                } else {
                    this.saveBtn2Loading = true;
                }
                var d = {};
                d.bean = JSON.stringify(this.talentBean);
                d.workingForm = JSON.stringify(this.workingForm);
                d.educationForm = JSON.stringify(this.educationForm);
                this.$http.post('/talentLibrary/save', d).then((res) => {
                    this.saveBtn1Loading = false;
                    this.saveBtn2Loading = false;
                    if (res.success) {
                        this.$Message.success('保存成功');
                        this._filterResultHandler();
                        if (type === 2) {
                            this.settingModalFlag = false;
                            return;
                        }
                        this._findUser(res.message);
                    }
                });
            },
            next () {
                this.changUserStatusModel = true;
                this.statusTemp = this.showUser.status;
                this.statusForm = {};
                this.statusForm.id = this.showUser.id;
                this.statusForm.remarks = this.showUser.remarks;
            },
            forward () {
                var statusPrev = [-1, 0, 0, 1, 1, 1, 3, 3, 6, 6];
                var vm = this;
                this.statusTemp = statusPrev[this.showUser.status];
                this.statusForm = {};
                this.statusForm.id = this.showUser.id;
                this.statusForm.remarks = this.showUser.remarks;
                if (this.showUser.createaccount === 2) {
                    this.$Modal.confirm({
                        title: '回退提醒',
                        content: '用户已经创建账号，是否回退？',
                        okText: '回退',
                        cancelText: '取消',
                        onOk () {
                            vm.$Modal.remove();
                            vm.changUserStatusModel = true;
                        },
                        onCancel () {
                            vm.$Message.info('取消回退');
                        }
                    });
                } else {
                    this.changUserStatusModel = true;
                }
            },
            changeUsersInfo (row) {
                this.showUser = row;
                this.success_msg = this.getStatusText(row.status);
                this.error_msg = {};
                if ([-1, 0].indexOf(row.status) > -1) {
                    this.calcStep = 0;
                    if (row.status === -1) {
                        this.calcStatus = 'error';
                        this.error_msg.t1 = '未预约';
                    } else {
                        this.calcStatus = 'finish';
                    }
                }
                if ([1, 2].indexOf(row.status) > -1) {
                    this.calcStep = 1;
                    if (row.status === 2) {
                        this.calcStatus = 'error';
                        this.error_msg.t2 = '未到达';
                    } else {
                        this.calcStatus = 'finish';
                    }
                }
                if ([3, 4, 5].indexOf(row.status) > -1) {
                    this.calcStep = 2;
                    if (row.status === 5) {
                        this.calcStatus = 'error';
                        this.error_msg.t3 = '面试不合格';
                    } else {
                        this.calcStatus = 'finish';
                    }
                }
                if ([6, 7].indexOf(row.status) > -1) {
                    this.calcStep = 3;
                    if (row.status === 7) {
                        this.calcStatus = 'error';
                        this.error_msg.t4 = '合格未到达';
                    } else {
                        this.calcStatus = 'finish';
                    }
                }
                if ([8, 9].indexOf(row.status) > -1) {
                    this.calcStep = 4;
                    if (row.status === 9) {
                        this.calcStatus = 'error';
                        this.error_msg.t5 = '试岗不通过';
                    } else {
                        this.calcStatus = 'finish';
                    }
                }
            },
            getStatusText (num) {
                var text = ['未预约', '已预约', '已到达', '未到达', '面试合格', '待定', '面试不合格', '合格到达', '合格未到达', '试岗通过', '试岗未通过'];
                return text[num + 1];
            },
            saveStatus() {
                var vm = this;
                this.$refs['statusForm'].validate((valid) => {
                    if (!valid) {
                        return false;
                    }
                    var d = vm.statusForm;
                    // debugger;
                    for (var key in d) {
                        if (Date === d[key].constructor) {
                            d[key] = d[key].toLocaleDateString().replace(/\//g, '-');
                        }
                    }
                    if (vm.showUser.status === -1) {
                        d.status = 0;
                    }
                    vm.$http.post('/talentLibrary/changeStatus', d).then((res) => {
                        if (res.success) {
                            vm.$Message.success('用户' + vm.showUser.name + ' 变更成功');
                            vm.changUserStatusModel = false;
                            vm.modalFlag2 = false;
                            vm._filterResultHandler();
                        }
                    });
                });
            },
            changeType (type) {
                // -1.未预约 0.预约 1.已到达 2.未到达 3.合格 4.待定 5.不合格 6.合格到达 7.合格未到达 8.试岗通过 9.试岗未通过'
                if (type === 1) {
                    this.filterOpt.status = [-1, 0, 1, 2];
                }
                if (type === 2) {
                    this.filterOpt.status = [3, 4, 5, 6, 7];
                }
                if (type === 3) {
                    this.filterOpt.status = [8, 9];
                }
                if (type === 4) {
                    this.filterOpt.status = [4];
                }
                if (type === 0) {
                    this.filterOpt.status = undefined;
                }
                this._filterResultHandler();
            },
            showAddNew () {
                this.settingModalFlag = true;
                this.educationForm = [];
                this.workingForm = [];
                this.talentBean = {};
            },
            _inputDebounce: debounce(function () {
                this._filterResultHandler();
            }, 1600),
            _filterResultHandler () {
                this.initPage();
                this._getPostData();
            },
            _setTableHeight () {
                let dm = document.body.clientHeight;
                this.tableHeight = dm - 375;
            },
            _setPage (page) {
                this.pageData.page = page;
                this._getPostData();
            },
            _setPageSize (size) {
                this.pageData.pageSize = size;
                this._getPostData();
            },
            _monthDateChange (key, value) {
                this.filterOpt[key] = value;
                this._filterResultHandler();
            },
            _birthdayChange (val) {
                this.filterOpt.birthday = val;
                this._filterResultHandler();
            },
            _infoDateChange (type, index, key, value) {
                if (type === 0) {
                    this.talentBean[key] = value;
                }
                if (type === 1) {
                    this.educationForm[index][key] = value;
                }
                if (type === 2) {
                    this.workingForm[index][key] = value;
                }
            },
            initPage () {
                this.pageData.page = 1;
            },
            _findUser(id) {
                var vm = this;
                return new Promise(function (resolve, reject) {
                    vm.$http.post('/talentLibrary/find', {id: id}).then((res) => {
                        if (res.success) {
                            resolve();
                            vm.educationForm = res.educations;
                            vm.workingForm = res.workings;
                            vm.talentBean = res.talentLibrary;
                        } else {
                            reject(new Error('数据不存在'));
                        }
                    });
                });
            },
            _getPostData () {
                this.getList('/talentLibrary/dataList', this.filterOpt);
            }
        }
    };
</script>

<style lang="less">
    #hire {
        .ivu-table-body {
            /*overflow: auto;*/
            /*margin-right: -10px;*/
        }
        #btn-fix-container {
            position: absolute;
            right: 50px;
            top: 0px;
        }
        #btn-fix-container {
            .btn-group-fix {
                position: fixed;
                margin: 10px 0 0 20px;
                z-index: 10;
                background-color: rgba(255, 255, 255, 0.5);
            }
        }
        .ivu-table-wrapper{
        }
    }
    .showUserInfoItem {
        width: 45%;
        font-size: 18px;
        font-weight: bold;
    }
    .mouse-on-hover{
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
        display: none;
    }
    .mouse-on-hover i{
        color: #fff;
        font-size: 60px;
        cursor: pointer;
        margin: 30px;
    }
    .fileImg:hover .mouse-on-hover{
        display: inline-flex;
        justify-content: center;
        align-items: center;
    }
</style>
