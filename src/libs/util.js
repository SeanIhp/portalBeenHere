import axios from 'axios';
import env from '../config/env';

let util = {

};
// util.title = function (title) {
//     title = title || 'iView admin';
//     window.document.title = title;
// };

// util.inOf = function (arr, targetArr) {
//     let res = true;
//     arr.map(item => {
//         if (targetArr.indexOf(item) < 0) {
//             res = false;
//         }
//     });
//     return res;
// };

// util.oneOf = function (ele, targetArr) {
//     if (targetArr.indexOf(ele) >= 0) {
//         return true;
//     } else {
//         return false;
//     }
// };

// util.showThisRoute = function (itAccess, currentAccess) {
//     if (typeof itAccess === 'object' && itAccess.isArray()) {
//         return util.oneOf(currentAccess, itAccess);
//     } else {
//         return itAccess === currentAccess;
//     }
// };

// util.getPathObjByName = function (vm, name) {
//     let pathObj = vm.$store.state.routers.filter((item) => {
//         if (item.children.length <= 1) {
//             return item.name === name;
//         } else {
//             let i = 0;
//             let childArr = item.children;
//             let len = childArr.length;
//             while (i < len) {
//                 if (childArr[i].name === name) {
//                     return true;
//                 }
//                 i++;
//             }
//             return false;
//         }
//     })[0];
//     return pathObj;
// };



// 打开portal本工程界面
util.openLocalPage = function (vm, code, title, path, type = 'local', url = '', currentTabsGroupName = 'protalFrame') {

    // 打开侧边栏
    vm.$store.commit("showMenuType");

    // 更改当前启动的portal面板
    vm.$store.commit('changeTabsGroup', currentTabsGroupName);

    console.log("vm.$store.state.tabsGroup:", vm.$store.state.tabsGroup);

    // 查询当前打开的微应用是否已经打开
    let tabsGroupItem = vm.$store.state.tabsGroup.filter((item) => {
        return item.tabsGroupName == currentTabsGroupName;
    });

    if (tabsGroupItem.length === 0) {
        console.log("不存在微应用");

        // 微应用不存在－添加微应用到tabsGroup数据结构中
        vm.$store.commit('addTabsGroup', {
            tabsGroupName: currentTabsGroupName,
            tabsGroupItemInfo: {
                currentTabCode: code,
                tabsList: [{
                    code: code,
                    title: title,
                    path: path,
                    type: type,
                    url: url,
                    currentTabsGroupName: currentTabsGroupName
                }]
            }
        });

    } else {
        console.log("存在微应用");

        // 修改tab显示指向
        tabsGroupItem[0].tabsGroupItemInfo.currentTabCode = code;

        // tab展示界面逻辑处理
        let hasOpened = false;
        tabsGroupItem[0].tabsGroupItemInfo.tabsList.forEach((item, index) => {
            // 判断tab界面是否打开
            if (item.code === code) {
                hasOpened = true;
            }
        });

        if (!hasOpened) {
            // 不存在
            // 新增tab显示
            tabsGroupItem[0].tabsGroupItemInfo.tabsList.push({
                code: code,
                title: title,
                path: path,
                type: type,
                url: url,
                currentTabsGroupName: currentTabsGroupName
            });
            localStorage.tabsGroup = JSON.stringify(vm.$store.state.tabsGroup);
        }
    }

    // 判断启动界面类型，区分本工程界面与iframe第三方工程界面
    if (type === 'local') {
        vm.$router.push({ name: path });
    } else {
        url = encodeURIComponent(url);
        vm.$router.push({ name: path, params: { url: url } });
    };

};

export default util;
