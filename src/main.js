import Vue from 'vue';
import iView from 'iview';
import VueRouter from 'vue-router';
import { routers, otherRouter, appRouter } from './router';
import Vuex from 'vuex';
import Util from './libs/util';
import App from './app.vue';
import Cookies from 'js-cookie';
import 'iview/dist/styles/iview.css';

import VueI18n from 'vue-i18n';
import Locales from './locale';
import zhLocale from 'iview/src/locale/lang/zh-CN';
import enLocale from 'iview/src/locale/lang/en-US';

import config from './config/config';

// import axiosPlugin from "./libs/httpserver";
// Vue.use(axiosPlugin);

import request from "./libs/httpserver";

Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(VueI18n);
Vue.use(iView);

// 自动设置语言
const navLang = navigator.language;
const localLang = (navLang === 'zh-CN' || navLang === 'en-US') ? navLang : false;
const lang = window.localStorage.getItem('language') || localLang || 'zh-CN';

Vue.config.lang = lang;

// 多语言配置
const locales = Locales;
const mergeZH = Object.assign(zhLocale, locales['zh-CN']);
const mergeEN = Object.assign(enLocale, locales['en-US']);
Vue.locale('zh-CN', mergeZH);
Vue.locale('en-US', mergeEN);

// 路由配置
const RouterConfig = {
    // mode: 'history',
    routes: routers
};

const router = new VueRouter(RouterConfig);

function toLogin() {
    router.push({
        name: "login"
    });
};

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();

    console.log("Cookies.get('status'):", Cookies.get('status'));
    console.log("to.name:", to.name);

    if (!Cookies.get('status') && to.name !== 'login') {
        console.log("asdf456");
        next({
            name: 'login'
        });
    } else if (!Cookies.get('status') && to.name === 'login') {
        next();
    } else if (Cookies.get('status') && to.name === 'login') {
        iView.LoadingBar.finish();
        next({
            name: 'home_index'
        });
    } else {
        // cookies重新设置
        const inFifteenMinutes = new Date(
            new Date().getTime() + 30 * 60 * 1000
        );
        Cookies.set("status", true, { expires: inFifteenMinutes });
        next();
    }
});

router.afterEach(() => {
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});
// 状态管理
const store = new Vuex.Store({
    state: {

        // －－－－－－－－－portal框架数据结构声明－－－－－－－－－
        //当前框架tabs显示块
        currentTabsGroupName: 'protalFrame',
        //所有框架tabs显示obj对象
        tabsGroup: [{
            tabsGroupName: 'protalFrame',
            tabsGroupItemInfo: {
                currentTabCode: 'home_index',
                tabsList: [{
                    code: 'home_index',
                    title: '首页',
                    path: 'home_index',
                    type: 'local',
                    url: '',
                    currentTabsGroupName: 'protalFrame'
                }]
            }
        }],
        //左侧导航栏显示与隐藏标记
        hideMenuType: false,
        // 左侧导航栏展示内容
        sidebarMenuData: [],
        headerMicMenuShowType: false,
        // 微应用菜单数据持久化
        microServiceMenu: [],
        // 主内容窗体高度动态计算
        contentHeight: document.documentElement.clientHeight - 120,
        // －－－－－－－－－portal框架数据结构声明end－－－－－－－－－
    },
    getters: {},
    mutations: {

        logoutInit(state) {
            console.log("初始化状态");
            state.currentTabsGroupName = 'protalFrame';
            state.tabsGroup = [{
                tabsGroupName: 'protalFrame',
                tabsGroupItemInfo: {
                    currentTabCode: 'home_index',
                    tabsList: [{
                        code: 'home_index',
                        title: '首页',
                        path: 'home_index',
                        type: 'local',
                        url: '',
                        currentTabsGroupName: 'protalFrame'
                    }]
                }
            }];
            state.hideMenuType = false;
            state.headerMicMenuShowType = false;
            state.microServiceMenu = [];
            state.sidebarMenuData = [];
        },

        /**
         * 微应用菜单数据持久化
         * 
         * @param {any} state 
         * @param {any} param 
         */
        initMicroServiceMenu(state, param) {
            state.microServiceMenu = param;
        },

        /**
         * 现实头部微应用菜单
         * 
         * @param {any} state 
         */
        changeHeaderMicMenuShow(state) {
            state.headerMicMenuShowType = true;
        },

        /**
         * 隐藏头部微应用菜单
         * 
         * @param {any} state 
         */
        changeHeaderMicMenuHide(state) {
            state.headerMicMenuShowType = false;
        },
        /**
         * 初始化左侧导航栏信息
         * 
         * @param {any} state 
         */
        initSidebarMenuData(state) {
            if (localStorage.sidebarMenuData) {
                state.sidebarMenuData = JSON.parse(localStorage.sidebarMenuData);
            }
        },

        /**
         * 添加左侧导航栏信息
         * 
         * @param {any} state 
         * @param {any} obj 
         */
        addSidebarMenuData(state, obj) {
            state.sidebarMenuData.push(obj);
            localStorage.sidebarMenuData = JSON.stringify(state.sidebarMenuData);
        },

        /**
         * 删除sidebarMenuData左侧边栏微应用列表项
         * 
         * @param {any} state 
         * @param {any} obj 
         */
        removeSidebarMenuData(state, index) {
            state.sidebarMenuData.splice(index, 1);
            localStorage.sidebarMenuData = JSON.stringify(state.sidebarMenuData);
        },

        /**
         * 初始化左侧导航栏显示开关
         * 
         * @param {any} state 
         */
        initHideMenuType(state) {
            // 获取侧边栏内容长度
            let len = state.sidebarMenuData.length;
            if (len > 0) {
                state.hideMenuType = true;
                state.headerMicMenuShowType = true;
            } else {
                state.hideMenuType = false;
                state.headerMicMenuShowType = false;
            }
            // console.log("asdfasdfasd123123123", len);
        },

        /**
         * 切换hideMenuType(左侧导航栏显示与隐藏事件)
         * 
         * @param {any} state 
         */
        toggleHideMenuType(state) {
            state.hideMenuType = !state.hideMenuType;
        },

        /**
         * 显示左侧菜单
         * 
         * @param {any} state 
         */
        showMenuType(state) {
            state.hideMenuType = true;
        },

        /**
         * 初始化微应用tab信息
         * 
         * @param {any} state 
         */
        initTabsGroup(state) {
            if (localStorage.tabsGroup) {
                state.tabsGroup = JSON.parse(localStorage.tabsGroup);
            }
        },

        /**
         * tabsGroup中初始化微应用tab信息
         * 
         * @param {any} obj 
         */
        addTabsGroup(state, obj) {
            state.tabsGroup.push(obj);
            localStorage.tabsGroup = JSON.stringify(state.tabsGroup);
        },

        /**
         * 初始化当前微应用标记
         * 
         * @param {any} state 
         */
        initCurrentTabsGroupName(state) {
            if (localStorage.currentTabsGroupName) {
                state.currentTabsGroupName = JSON.parse(localStorage.currentTabsGroupName);
            }
        },

        /**
         * 改变当前启动的微应用
         * 
         * @param {any} state 
         * @param {any} currentTabsGroupName 
         */
        changeTabsGroup(state, currentTabsGroupName) {
            state.currentTabsGroupName = currentTabsGroupName;
            localStorage.currentTabsGroupName = JSON.stringify(state.currentTabsGroupName);
        },

        /**
         * 关闭标签界面
         * 
         * @param {any} state 
         * @param {any} obj 
         */
        removeTag(state, obj) {
            state.tabsGroup.map((item, index) => {
                if (item.tabsGroupName === obj.currentTabsGroupName) {
                    item.tabsGroupItemInfo.tabsList.map((litem, lindex) => {
                        if (litem.code === obj.name) {
                            item.tabsGroupItemInfo.tabsList.splice(lindex, 1);
                        }
                    });
                }
            });
            localStorage.tabsGroup = JSON.stringify(state.tabsGroup);
        },

        /**
         * 删除tabsgroup微应用面板
         * 
         * @param {any} state 
         * @param {any} obj 
         */
        removeTabsGroup(state, obj) {
            state.tabsGroup.map((item, index) => {
                if (item.tabsGroupName === obj.tabsGroupName) {
                    state.tabsGroup.splice(index, 1);
                }
            });
            localStorage.tabsGroup = JSON.stringify(state.tabsGroup);
        },

        /**
         * 修改主窗体高度方法
         * 
         * @param {any} obj 
         */
        setContentHeight(state, obj) {
            state.contentHeight = obj.height;
        },
    },
    actions: {}
});

// 过滤器[待优化，提取server地址配置]
Vue.filter('microappIconFormat', function (value) {
    // return 'http://172.17.13.80' + value;
    return config.remote_host + value;
})
// 过滤器－头部菜单搜索数据过滤
Vue.filter('cascaderDataFormat', function (value) {
    return value.filter((item) => {
        if (typeof (item.thereAreMenuYesOrNo) == "undefined") {
            return item;
        } else if (item.thereAreMenuYesOrNo) {
            return item;
        }
    });
})

// 使用一个空的 Vue 实例作为一个事件总线，实现非父子组件通讯［不使用全局state状态管理］
const NonParentChildCommunication = new Vue();
Vue.prototype.NonParentChildCommunication = NonParentChildCommunication;

// 封装网络请求，在vue中使用$http来启动http请求
Vue.prototype.$http = request;

new Vue({
    el: '#app',
    router: router,
    store: store,
    render: h => h(App),
    data: {
        currentPageName: '',
        aa: ''
    },
    mounted() {
        this.currentPageName = this.$route.name;
    },
    created() {
        // http请求用例
        // this.$http({
        //     url: "/ampOpenapiService?method=user.app.search",
        //     method: "post",
        //     data: {
        //         fields: "ent_id,microappid,microappcode,microappname,microapp_group_id,microapp_group_name,url,microapp_desc,microapp_icon,note,status,lang,create_date,timestamp,creator_id,creator_id,modifier_id,modifier",
        //         order_direction: "desc1",
        //         order_field: "microappid",
        //         page_no: 1,
        //         page_size: 50
        //     }
        // }).then(res => {
        //     // this.aa = res.data;
        //     console.log('this.aa:', res);
        // });
    },
    watch: {
        $route() {
            // 监听浏览器窗口变化
            const that = this;
            window.onresize = function temp() {
                that.$store.commit("setContentHeight", {
                    height: document.documentElement.clientHeight - 120
                });
            };
        }
    },
});
