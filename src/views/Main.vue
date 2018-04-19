<style lang="less">
    @import "./main.less";
    .tags-con {
        user-select: none;
    }
</style>
<template>
    <div class="main" :class="{'main-hide-text': shrink}">
        <div class="sidebar-menu-con"
             v-if="premissionMenu.length"
             :style="{width: shrink?'60px':'200px', overflow: shrink ? 'visible' : 'auto'}">
            <shrinkable-menu
                :shrink="shrink"
                @on-change="handleSubmenuChange"
                :theme="menuTheme"
                :before-push="beforePush"
                :open-names="openedSubmenuArr"
                :menu-list="menuList">
                <div slot="top" class="logo-con">
                    <img v-show="!shrink"  src="../images/tianma_logo_big.jpg" key="max-logo" style="border-radius: 6px;"/>
                    <img v-show="shrink"
                         class="small"
                         style="padding: 2px;background-color: #fff;"
                         src="../images/tianma_logo_small.jpg"
                         key="min-logo" />
                </div>
            </shrinkable-menu>
        </div>
        <div class="main-header-con" :style="{paddingLeft: returnNeedPadding}">
            <div class="main-header">
                <div class="navicon-con"
                     v-if="premissionMenu.length">
                    <Button :style="{transform: 'rotateZ(' + (this.shrink ? '-90' : '0') + 'deg)'}"
                            type="text"
                            @click="toggleClick">
                        <Icon type="navicon" size="32"></Icon>
                    </Button>
                </div>
                <div v-else style="display: inline-block;font-size: 0;padding: 6px;">
                    <img  src="../images/tianma_logo_small.jpg" key="max-logo" style="border-radius: 6px;width: 50px;"/>
                </div>
                <div class="header-middle-con">
                    <div class="main-breadcrumb">
                        <breadcrumb-nav :currentPath="currentPath"></breadcrumb-nav>
                    </div>
                </div>
                <div class="header-avator-con">
                    <Dropdown v-if="isManger === 0 || isManger === 1" transfer @on-click="changeCompany" style="margin-right: 10px">
                        <a href="javascript:void(0)" style="font-size: 14px;color: #333;">
                            {{currentCompanyName}}<Icon type="arrow-down-b" style="margin-left: 5px"></Icon>
                        </a>
                        <DropdownMenu slot="list">
                            <DropdownItem :name="item.name"
                                          v-for="item,index in companyList"
                                          :key="'company' + index">{{item.name}}</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    <full-screen v-model="isFullScreen" @on-change="fullscreenChange"></full-screen>
                    <lock-screen></lock-screen>
                    <!--<message-tip v-model="mesCount"></message-tip>-->
                    <theme-switch v-if="premissionMenu.length"></theme-switch>
                    <div class="coin-left">
                        <fs-icon type="moneynew" :size="26" color="#FF5722"></fs-icon>
                        <span class="coin">{{tmCoin}}</span>
                    </div>
                    <div class="user-dropdown-menu-con">
                        <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
                            <Dropdown transfer trigger="hover" @on-click="handleClickUserDropdown">
                                <a href="javascript:void(0)">
                                    <span class="main-user-name">{{ userName }}</span>
                                    <Icon type="arrow-down-b"></Icon>
                                </a>
                                <DropdownMenu slot="list">
                                    <DropdownItem name="myLog">我的日志</DropdownItem>
                                    <DropdownItem name="myAttendance">我的考勤</DropdownItem>
                                    <DropdownItem name="myLeave">我的请假</DropdownItem>
                                    <DropdownItem name="myArrange">我的排班</DropdownItem>
                                    <DropdownItem name="myTrain">我的培训</DropdownItem>
                                    <DropdownItem name="myExam">我的考试</DropdownItem>
                                    <!--<DropdownItem name="coinShop">金币商城</DropdownItem>-->
                                    <!--<DropdownItem name="ownSpace">个人中心</DropdownItem>-->
                                    <DropdownItem name="loginout" divided>安全退出</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                            <Avatar :src="avatorPath" style="margin-left: 10px;"></Avatar>
                        </Row>
                    </div>
                </div>
            </div>
            <div class="tags-con">
                <tags-page-opened :pageTagsList="pageTagsList"></tags-page-opened>
            </div>
        </div>
        <div class="single-page-con" :style="{left: returnNeedPadding}">
            <div class="single-page">
                <keep-alive :include="cachePage">
                    <router-view></router-view>
                </keep-alive>
            </div>
        </div>
    </div>
</template>
<script>
    import shrinkableMenu from './main-components/shrinkable-menu/shrinkable-menu.vue';
    import tagsPageOpened from './main-components/tags-page-opened.vue';
    import breadcrumbNav from './main-components/breadcrumb-nav.vue';
    import fullScreen from './main-components/fullscreen.vue';
    import lockScreen from './main-components/lockscreen/lockscreen.vue';
    import messageTip from './main-components/message-tip.vue';
    import themeSwitch from './main-components/theme-switch/theme-switch.vue';
    import util from '@/libs/util.js';
    export default {
        components: {
            shrinkableMenu,
            tagsPageOpened,
            breadcrumbNav,
            fullScreen,
            lockScreen,
            messageTip,
            themeSwitch
        },
        data () {
            return {
                shrink: true,
                isFullScreen: false,
                companyList: [],
                openedSubmenuArr: this.$store.state.app.openedSubmenuArr
            };
        },
        computed: {
            isManger() {
                return this.$store.state.user.userInfo.ismanger;
            },
            returnNeedPadding() {
                return this.premissionMenu.length ? this.shrink ? '60px' : '200px' : '0';
            },
            premissionMenu() {
                return this.$store.state.app.premissionMenu;
            },
            userName() {
                return this.$store.state.user.userInfo.realname;
            },
            tmCoin() {
                return this.$store.state.user.userInfo.tm_coin;
            },
            menuList () {
                return this.$store.state.app.menuList;
            },
            pageTagsList () {
                return this.$store.state.app.pageOpenedList; // 打开的页面的页面对象
            },
            currentPath () {
                return this.$store.state.app.currentPath; // 当前面包屑数组
            },
            avatorPath () {
                return this.$store.state.user.userInfo.headimagepath;
            },
            cachePage () {
                return this.$store.state.app.cachePage;
            },
            lang () {
                return this.$store.state.app.lang;
            },
            menuTheme () {
                return this.$store.state.app.menuTheme;
            },
            mesCount () {
                return this.$store.state.app.messageCount;
            },
            currentCompanyName() {
                return this.$store.state.user.userInfo.currentcompanyname;
            }
        },
        methods: {
            init () {
                let pathArr = util.setCurrentPath(this, this.$route.name);
                if (pathArr.length >= 2) {
                    this.$store.commit('addOpenSubmenu', pathArr[1].name);
                }
                let messageCount = 3;
                this.messageCount = messageCount.toString();
                this.checkTag(this.$route.name);
                this.$store.commit('setMessageCount', 3);
                var name = sessionStorage.getItem('newCompany');
                if (name) {
                    this.$Notice.config({
                        top: 62,
                        duration: 3.5
                    });
                    setTimeout(() => {
                        this.$Notice.success({
                            title: '公司切换成功',
                            desc: '正在查看 ' + name
                        });
                        sessionStorage.removeItem('newCompany');
                    }, 300);
                }
            },
            toggleClick () {
                this.shrink = !this.shrink;
            },
            changeCompany(name) {
                this.$store.commit('changeCompanyName', name);
                var d = {};
                d.name = name;
                this.$http.post('/login/changeCompany', d).then((res) => {
                    if (res.success) {
                        sessionStorage.setItem('newCompany', name);
                        setTimeout(function () {
                            window.location.reload();
                        }, 200);
                    }
                });
            },
            handleClickUserDropdown (name) {
                if (name === 'ownSpace') {
                    util.openNewPage(this, 'ownspace_index');
                    this.$router.push({
                        name: 'ownspace_index'
                    });
                } else if (name === 'loginout') {
                    // 退出登录
                    this.$store.commit('logout');
                    this.$store.commit('clearOpenedSubmenu');
                } else {
                    util.openNewPage(this, name);
                    this.$router.push({
                        name: name
                    });
                }
            },
            checkTag (name) {
                let openpageHasTag = this.pageTagsList.some(item => {
                    if (item.name === name) {
                        return true;
                    }
                });
                if (!openpageHasTag) { //  解决关闭当前标签后再点击回退按钮会退到当前页时没有标签的问题
                    util.openNewPage(this, name, this.$route.params || {}, this.$route.query || {});
                }
            },
            handleSubmenuChange (val) {
                // console.log(val)
            },
            beforePush (name) {
                // if (name === 'accesstest_index') {
                //     return false;
                // } else {
                //     return true;
                // }
                return true;
            },
            fullscreenChange (isFullScreen) {
                // console.log(isFullScreen);
            }
        },
        watch: {
            '$route' (to) {
                this.$store.commit('setCurrentPageName', to.name);
                let pathArr = util.setCurrentPath(this, to.name);
                if (pathArr.length > 2) {
                    this.$store.commit('addOpenSubmenu', pathArr[1].name);
                }
                this.checkTag(to.name);
                localStorage.currentPageName = to.name;
            },
            lang () {
                util.setCurrentPath(this, this.$route.name); // 在切换语言时用于刷新面包屑
            }
        },
        mounted () {
            this.init();
        },
        created () {
            // 显示打开的页面的列表
            this.$store.commit('setOpenedList');
            this.$http.post('/company/lists').then((res) => {
                this.companyList = res.data;
                let cid = this.$store.state.user.userInfo.companyid;
                for (var i = 0; i < res.data.length; i++) {
                    let item = res.data[i];
                    if (cid === item.id) {
                        this.$store.state.user.userInfo.currentcompanyname = item.name;
                        break;
                    }
                }
            });
        }
    };
</script>
