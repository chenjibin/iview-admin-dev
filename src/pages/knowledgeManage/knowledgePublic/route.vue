<template>
    <div class="knowledge-page">
        <div class="tooltop">
            <div class="tooltop-main" :style="{width: topHeight}">
                <div class="left">
                    <h1>天马知识库</h1>
                    <Button type="text"
                            style="font-size: 16px;margin-left: 16px"
                            @click.stop="$router.push({name: 'articleHome'})">首页</Button>
                    <div class="search-wrapper"
                         v-clickoutside="clickoutsideHandler"
                         :class="{'is-focus': isFocus}">
                        <input type="text"
                               maxlength="100"
                               placeholder="搜索知识..."
                               @focus="isFocus = true"
                               v-model="searchValue"
                               @keyup.enter="_searchKnowledge"
                               autocomplete="off"/>
                        <div class="search-btn"
                             @click.stop="_searchKnowledge"
                             :class="{'can-search': canSearch}">
                            <Icon type="ios-search"></Icon>
                        </div>
                    </div>
                </div>
                <div class="right">
                    <Button type="text"
                            @click.stop="$router.replace({name: 'home_index'})"><Icon type="chevron-left"></Icon>&nbsp;返回人事系统</Button>
                </div>
            </div>
        </div>
        <div class="fs-article-main">
            <transition name="route-fade" mode="out-in">
                <router-view></router-view>
            </transition>
        </div>
    </div>
</template>
<style lang="less">
    .route-fade-enter-active, .route-fade-leave-active {
        transition: opacity .3s;
    }
    .route-fade-enter, .route-fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        opacity: 0;
    }
    .knowledge-page {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        .tooltop {
            position: absolute;
            z-index: 2;
            left: 0;
            width: 100%;
            top: 0;
            height: 52px;
            background-color: #fff;
            box-shadow: 0 1px 3px rgba(26,26,26,.1);
            background-clip: content-box;
            &-main {
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 1200px;
                height: 100%;
                margin: 0 auto;
                transition: width 0.3s ease-in;
                .left {
                    display: flex;
                    .search-wrapper {
                        position: relative;
                        display: flex;
                        margin-left: 16px;
                        width: 326px;
                        height: 34px;
                        padding: 4px 10px;
                        font-size: 14px;
                        border: 1px solid #ebebeb;
                        border-radius: 3px;
                        box-sizing: border-box;
                        transition: background .2s,border .2s, width 0.2s ease;
                        background: #f6f6f6;
                        overflow: hidden;
                        &.is-focus {
                            background: #fff;
                            border: 1px solid #8590a6;
                            width: 400px;
                        }
                        input {
                            flex: 1;
                            padding: 0;
                            overflow: hidden;
                            font-family: inherit;
                            font-size: inherit;
                            font-weight: inherit;
                            background: transparent;
                            border: none;
                            outline: none;
                            resize: none;
                        }
                        .search-btn {
                            position: absolute;
                            right: 0;
                            top: 0;
                            z-index: 1;
                            width: 40px;
                            height: 34px;
                            line-height: 34px;
                            text-align: center;
                            font-size: 20px;
                            cursor: pointer;
                            transition: background .2s;
                            &.can-search {
                                background-color: #0084ff;
                                color: #fff;
                            }
                            &.can-search:hover {
                                background-color: #0077e6;
                            }
                        }
                    }
                }
            }
        }
        .fs-article-main {
            position: absolute;
            z-index: 1;
            left: 0;
            top: 52px;
            right: 0;
            bottom: 0;
            overflow: auto;
        }
    }
</style>
<script>
    import clickoutside from '@/directives/click-outside';
    export default {
        name: 'knowledgePublic',
        directives: {clickoutside},
        data () {
            return {
                isFocus: false,
                canSearch: true,
                searchValue: ''
            };
        },
        computed: {
            topHeight() {
                return this.$store.state.knowledge.topHeight;
            }
        },
        created() {
            this.$store.commit('setToHeight', '1200px');
        },
        watch: {
            '$route'(to) {
                let topHeight = '';
                if (to.name === 'articleDetail') {
                    topHeight = '880px';
                } else if (to.name === 'articleList') {
                    topHeight = '1000px';
                } else if (to.name === 'articleHome') {
                    topHeight = '1200px';
                }
                this.$store.commit('setToHeight', topHeight);
            },
            searchValue(val) {
                this.$store.commit('setKeyWord', val);
            }
        },
        methods: {
            clickoutsideHandler() {
                this.isFocus = false;
            },
            _searchKnowledge() {
                this.$store.commit('setKeyWord', this.searchValue);
                this.$store.commit('toListPage', this);
            }
        },
        components: {}
    };
</script>
