<template>
    <Card class="sys-notice">
        <p class="sys-notice-title">天马大小事</p>
        <Table height="300"
               :columns="columns"
               :data="rowData"
               :row-class-name="_rowClassName"
               @on-row-click="_checkDetails"
               class="sys-notice-table"></Table>
        <Page
            :total="totalCount"
            size="small"
            :page-size="pageSize"
            :current.sync="currentPage"
            @on-change="pageChangeHandler"
            ></Page>
        <Modal v-model="modelFlag" width="800" :mask-closable="false">
            <p slot="header" style="color:#495060;text-align:center;font-size: 18px">
                <span>{{noticeData.title}}</span>
            </p>
            <div class="" v-html="noticeData.content"></div>
            <div slot="footer">
            </div>
        </Modal>
    </Card>
</template>
<style lang="less">
    .ivu-table .row-cursor {
        cursor: pointer;
    }
    .sys-notice {
        margin-bottom: 10px;
        &-title {
            margin-bottom: 10px;
            font-size: 18px;
            font-weight: 700;
        }
        &-table {
            margin-bottom: 10px;
        }
    }

</style>
<script>
    export default {
        data () {
            return {
                modelFlag: false,
                totalCount: 80,
                currentPage: 1,
                pageSize: 10,
                noticeData: {
                    title: '关于集团金币制度调整的通知',
                    content: '<table style="padding:20px 10px 10px 10px;background-color: #c7edcc;width:100%"><tbody><tr><td valign="top"><p class="MsoNormal"><span style="mso-spacerun:\'yes\';font-family:仿宋;font-size:14.0000pt;mso-font-kerning:1.0000pt;">各部门同事：</span><span style="mso-spacerun:\'yes\';font-family:仿宋;font-size:14.0000pt;mso-font-kerning:1.0000pt;"><o:p></o:p></span></p><p class="MsoNormal" style="text-indent:28.0000pt;"><span style="mso-spacerun:\'yes\';font-family:仿宋;font-size:14.0000pt;mso-font-kerning:1.0000pt;">为进一步完善集团金币制度，提高金币衡量人才的标准，体现金币的价值，现对公司现行金币制度进行调整。新的金币制度将通过四个维度来衡量一个员工的综合能力值，分为财富点、伯乐点、智慧点及技能点四个方面，具体规则近日会另行公示。</span><span style="mso-spacerun:\'yes\';font-family:仿宋;font-size:14.0000pt;mso-font-kerning:1.0000pt;"><o:p></o:p></span></p><p class="MsoNormal" style="text-indent:28.0000pt;"><span style="mso-spacerun:\'yes\';font-family:仿宋;font-size:14.0000pt;mso-font-kerning:1.0000pt;"><font face="仿宋">新金币制度将于</font>2018年1月1日0时正式实施，为了保证新金币合理规范，现有金币将于12月31日24时进行清零，所有正值金币将以现金的方式给大家折现（比例：1元=10金币），负值的同事同样需要以现金的方式补足上缴人事部。</span><span style="mso-spacerun:\'yes\';font-family:仿宋;font-size:14.0000pt;mso-font-kerning:1.0000pt;"><o:p></o:p></span></p><p class="MsoNormal" style="text-indent: 28pt;"><span style="mso-spacerun:\'yes\';font-family:仿宋;font-size:14.0000pt;mso-font-kerning:1.0000pt;"><font face="仿宋">请需要兑换实物或迟到券等同事于</font>2017年12月31日下午五点半前操作。</span><span style="mso-spacerun:\'yes\';font-family:仿宋;font-size:14.0000pt;mso-font-kerning:1.0000pt;"><o:p></o:p></span></p><p class="MsoNormal" align="right" style="text-indent:28.0000pt;text-align:right;"><span style="mso-spacerun:\'yes\';font-family:仿宋;font-size:14.0000pt;mso-font-kerning:1.0000pt;">江苏天马网络科技集团有限公司</span><span style="mso-spacerun:\'yes\';font-family:仿宋;font-size:14.0000pt;mso-font-kerning:1.0000pt;"><o:p></o:p></span></p><p class="MsoNormal" align="right" style="text-indent:28.0000pt;text-align:right;"><span style="mso-spacerun:\'yes\';font-family:仿宋;font-size:14.0000pt;mso-font-kerning:1.0000pt;">人力资源部</span><span style="mso-spacerun:\'yes\';font-family:仿宋;font-size:14.0000pt;mso-font-kerning:1.0000pt;"><o:p></o:p></span></p><p class="MsoNormal" align="right" style="text-align:right;"><span style="mso-spacerun:\'yes\';font-family:仿宋;font-size:14.0000pt;mso-font-kerning:1.0000pt;">2017年12月26日</span><span style="mso-spacerun:\'yes\';font-family:Calibri;mso-fareast-font-family:宋体;mso-bidi-font-family:\'Times New Roman\';font-size:10.5000pt;mso-font-kerning:1.0000pt;"><o:p></o:p></span></p></td></tr></tbody></table>'
                },
                columns: [
                    {
                        title: '公告',
                        key: 'title'
                    },
                    {
                        title: '时间',
                        key: 'time',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '发布人',
                        key: 'people',
                        width: 120
                    }
                ],
                rowData: [
                    {
                        title: '关于集团金币制度调整的通知',
                        time: '2017-12-30',
                        people: '管理员',
                        id: 1010
                    },
                    {
                        title: '今天开始写日志拉',
                        time: '2017-12-30',
                        people: '管理员',
                        id: 1010
                    },
                    {
                        title: '今天开始写日志拉',
                        time: '2017-12-30',
                        people: '管理员',
                        id: 1010
                    },
                    {
                        title: '今天开始写日志拉',
                        time: '2017-12-30',
                        people: '管理员',
                        id: 1010
                    },
                    {
                        title: '今天开始写日志拉',
                        time: '2017-12-30',
                        people: '管理员',
                        id: 1010
                    },
                    {
                        title: '今天开始写日志拉',
                        time: '2017-12-30',
                        people: '管理员',
                        id: 1010
                    }
                ]
            };
        },
        created() {
            // this.getNoticeInfo();
        },
        methods: {
            pageChangeHandler(current) {
                this.currentPage = current;
            },
            getNoticeInfo() {
                let data = {
                    page: this.currentPage,
                    pageSize: 10
                };
                this.$http.get('', data).then((res) => {
                    console.log(res);
                });
            },
            _checkDetails(rowData) {
                // let data = {
                //     id: rowData.id
                // };
                this.modelFlag = true;
                // this.$http.get('', data).then((res) => {
                // });
            },
            _rowClassName() {
                return 'row-cursor';
            }
        },
        components: {}
    };
</script>
