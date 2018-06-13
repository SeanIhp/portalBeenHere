<style lang="less">
@import "./main.less";
.ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.header-menu-hover:hover {
  background-color: #36373b;
}

.mainContent .ivu-select-dropdown {
  background-color: #36373b;
  margin: 0;
}
</style>
<template class="mainContent">
  <!-- 整体布局start -->
  <div id="main" class="main" :class="{'main-hide-text': hideMenuText}">

    <!-- 左侧导航栏start -->
    <div class="sidebar-menu-con" :style="{width: hideMenuText?'60px':'0px', overflow: hideMenuText ? 'visible' : 'auto', background: '#495060'}">
      <div class="logo-con" style="margin-bottom:40px;">
        <img style="cursor:pointer;" @click="toPortalHome('protalFrame')" src="../images/logo.png">
      </div>
      <sidebar-menu-shrink v-on:ListenersParentEvent="ListenersParentEvent" />
    </div>
    <!-- 左侧导航栏end -->

    <!-- 主体部分头部导航start -->
    <div class="main-header-con" :style="{paddingLeft: hideMenuText?'60px':'0px'}">
      <div class="main-header">

        <!-- 显示隐藏左侧菜单 -->
        <div class="navicon-con">
          <Button :style="{transform: 'rotateZ(' + (this.hideMenuText ? '-90' : '0') + 'deg)',color:'#C8D8DD'}" type="text" @click="toggleClick">
            <Icon type="navicon" size="32"></Icon>
          </Button>
        </div>
        <!-- 显示隐藏左侧菜单end -->

        <div class="header-middle-con">
          <!-- <div class="main-breadcrumb" v-if="headerMicMenuShowType"> -->
          <div class="mainContent" v-if="headerMicMenuShowType">
            <!-- 微应用一级菜单遍历体 -->
            <Dropdown :key="index" v-for="(tItem,index) in microServiceMenu" placement="bottom-start" style="margin-right:10px;">
              <a class="header-menu-hover" style="color:#DCDEDF;font-size:14px;font-weight:bold;padding:10px;display:block;" href="javascript:void(0)">{{tItem.label}}</a>
              <DropdownMenu slot="list">
                <div style="padding:5px 10px 0;min-width:700px;">
                  <!-- 微应用二级菜单遍历体 -->
                  <div style="margin-bottom:10px;" :key="mIndex" v-for="(mItem,mIndex) in tItem.children">
                    <Row style="width:100%;" :gutter="16">
                      <Col :span="3" style="color:#DCDEDF;font-weight:bold;">{{mItem.label}}</Col>
                      <Col :span="21">
                      <Row :gutter="16">
                        <!-- 微应用三级菜单遍历体 -->
                        <Col style="margin-bottom:5px;" :span="8" :key="bIndex" v-for="(bItem,bIndex) in mItem.children">
                        <p class="ellipsis">
                          <a style="color:#1D85D3;font-weight:bold;" href="javascript:void(0)" @click="dropdownItemClick(bItem)">{{bItem.label}}</a>
                        </p>
                        </Col>
                        <!-- 微应用三级菜单遍历体end -->
                      </Row>
                      </Col>
                    </Row>
                    <!-- <hr v-if="(tItem.children.length-1==mIndex)?false:true" style="margin:5px 0;border:1px solid #F0F0F0;" /> -->
                  </div>
                  <!-- 微应用二级菜单遍历体end -->
                </div>
              </DropdownMenu>
            </Dropdown>
            <!-- 微应用一级菜单遍历体end -->
          </div>
        </div>

        <!-- 微服务菜单搜索 -->
        <div class="header-avator-con" style="right: 300px;padding: 16px 0px;color: #242527;">
          <Cascader :value="cascaderValue" :data="microServiceMenu | cascaderDataFormat" filterable :transfer="true" trigger="hover" :clearable="false" @on-change="microSelChange"></Cascader>
        </div>
        <!-- 微服务菜单搜索end -->

        <div class="header-avator-con" style="width:210px;">

          <div @click="showLogging" class="message-con" style="padding:20px 0;">
            <Tooltip content="日志记录" placement="bottom">
              <Icon type="clipboard" :size="22"></Icon>
            </Tooltip>
          </div>

          <div @click="showMessage" class="message-con" style="padding:20px 0;">
            <Tooltip :content="messageCount > 0 ? '有' + messageCount + '条未读消息' : '无未读消息'" placement="bottom">
              <Badge :count="messageCount" dot>
                <!-- <Icon type="ios-bell" :size="22"></Icon> -->
                <Icon type="chatbox-working" :size="22"></Icon>
              </Badge>
            </Tooltip>
          </div>

          <div class="user-dropdown-menu-con">
            <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
              <Dropdown trigger="click" @on-click="handleClickUserDropdown">
                <a href="javascript:void(0)">
                  <span class="main-user-name">{{ userName }}</span>
                  <Icon type="arrow-down-b"></Icon>
                </a>
                <DropdownMenu slot="list">
                  <DropdownItem name="ownSpace">个人中心</DropdownItem>
                  <DropdownItem name="loginout" divided>退出登录</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <!-- <Avatar :src="avatorPath" style="background: #619fe7;margin-left: 10px;"></Avatar> -->
              <Avatar style="background: #619fe7;margin-left: 10px;">{{ userName }}</Avatar>
            </Row>
          </div>
        </div>
      </div>
      <div class="tags-con">
        <tags-page-opened></tags-page-opened>
      </div>
    </div>
    <!-- 主体部分头部导航end -->

    <!-- 主体部分内容区域start -->
    <div class="single-page-con" :style="{paddingLeft: hideMenuText?'60px':'0px',height:'100%'}">
      <div class="single-page" :style="{height:contentHeight+'px'}">
        <router-view></router-view>
      </div>
    </div>
    <!-- 主体部分内容区域end -->

    <!-- 公共服务调用model -->
    <Modal title="公共共享模块" v-model="EfuframeVisible" width="90" :transfer="true" :closable="false">
      <iframe id="EfuFrameWin" :height=clientHeight frameBorder="0" :src=EfuframeSrc width="100%" />
      <p slot="footer"></p>
    </Modal>
    <!-- 公共服务调用model end -->

  </div>
</template>
<script>
import tagsPageOpened from "./main_components/tagsPageOpened.vue";
import sidebarMenuShrink from "./main_components/sidebarMenuShrink.vue";
import Cookies from "js-cookie";
import util from "../libs/util.js";

import { request } from "@/libs/httpRequest";

// iframe通讯库
import "@/libs/messenger.js";

import config from "@/config/config";

// 微应用列表格式化
function formatMicroList(data) {
  let result = [];
  for (let i = 0; i < data.length; i++) {
    let ls = data[i];
    ls.value = ls.microappid;
    ls.label = ls.microappname;
    ls.portalMicroType = true;
    ls.parent_micro_id = ls.microappid;
    result.push(ls);
  }
  return result;
}

// 微应用菜单数据格式化
function formatMicroServiceMenu(data, parent_micro_id) {
  let result = [];
  for (let i = 0; i < data.length; i++) {
    let ls = data[i];
    ls.value = ls.menu_id;
    ls.label = ls.menu_name;
    ls.url = ls.module_url;
    ls.portalMicroType = false;
    ls.parent_micro_id = parent_micro_id;
    if (data[i].child) {
      ls.children = formatMicroServiceMenu(data[i].child, parent_micro_id);
    }
    result.push(ls);
  }
  return result;
}

export default {
  components: {
    tagsPageOpened,
    sidebarMenuShrink
  },
  data() {
    return {
      userName: "",
      isFullScreen: false,
      messageCount: 0,
      lockScreenSize: 0,
      // －－－－－－－－－－目前用到的数据－－－－－－－－－－
      //微服务菜单数据集合
      microServiceMenu: [],
      // 微服务列表数据
      microListApiData: [],
      // 微服务菜单数据暂存
      microMenuApiData: [],
      // 头部搜索菜单数据model
      cascaderValue: [],
      // iframe通讯使用model
      EfuframeVisible: false,
      EfuframeSrc: "",
      LastEfuframeName: "",
      EfuframeExtendInfo: "",
      clientHeight:
        window && window.document.documentElement.clientHeight
          ? window.document.documentElement.clientHeight - 300
          : 700
      // －－－－－－－－－－目前用到的数据end－－－－－－－－－－
    };
  },
  computed: {
    headerMicMenuShowType() {
      return this.$store.state.headerMicMenuShowType;
    },
    avatorPath() {
      return localStorage.avatorImgPath;
    },
    hideMenuText() {
      return this.$store.state.hideMenuType; // 从全局store中获取hideMenuType状态值
    },
    contentHeight() {
      return this.$store.state.contentHeight;
    }
  },
  methods: {
    // 微应用菜单导航界面切换
    dropdownItemClick(item) {
      console.log(item);
      // 启动界面显示
      util.openLocalPage(
        this,
        item.value,
        item.label,
        "protal_frame",
        "iframe",
        item.url,
        item.parent_micro_id
      );
    },

    // 切换到portal面板
    toPortalHome(currentTabsGroupName) {
      // 头部搜索数据初始化
      this.microServiceMenu = this.microListApiData;
      this.cascaderValue = [];
      this.$store.commit("changeHeaderMicMenuHide");
      this.changePotalPanel(currentTabsGroupName);
    },

    // portal微应用面板切换
    changePotalPanel(currentTabsGroupName) {
      const tabsGroup = this.$store.state.tabsGroup;
      const targetGroup = tabsGroup.filter(item => {
        return item.tabsGroupName === currentTabsGroupName;
      });
      const targetPage = targetGroup[0].tabsGroupItemInfo.tabsList.filter(
        item => {
          return item.code === targetGroup[0].tabsGroupItemInfo.currentTabCode;
        }
      );

      console.log(targetGroup);
      console.log(targetPage);

      util.openLocalPage(
        this,
        targetPage[0].code,
        targetPage[0].title,
        targetPage[0].path,
        targetPage[0].type,
        targetPage[0].url,
        targetPage[0].currentTabsGroupName
      );
    },

    // 监听子组件传递事件
    ListenersParentEvent(type, currentTabsGroupName) {
      // toPortalHome
      switch (type) {
        case "sidebarMenuShrink":
          this.cascaderValue = [];
          this.getMicroServiceMenu(currentTabsGroupName);
          this.changePotalPanel(currentTabsGroupName);
          break;
        case "sidebarMenuClose":
          this.cascaderValue = [];
          this.$store.commit("removeTabsGroup", {
            tabsGroupName: currentTabsGroupName.del
          });
          this.changePotalPanel(currentTabsGroupName.to);
          if (currentTabsGroupName.to === "protalFrame") {
            this.microServiceMenu = this.microListApiData;
            this.$store.commit("changeHeaderMicMenuHide");
          } else {
            this.getMicroServiceMenu(currentTabsGroupName.to);
          }
          break;
      }
    },

    // 获取微应用下的菜单信息
    getMicroServiceMenu(microappid) {
      console.log("asdfxczvzxcv", this.microMenuApiData);
      this.$store.commit("changeHeaderMicMenuShow");
      const ls = this.microMenuApiData.filter(item => {
        if (item.microappid === microappid) {
          return item;
        }
      });
      console.log("lslslsls,", ls);
      this.microServiceMenu = formatMicroServiceMenu(
        ls[0].microapp_moduals.data.data,
        microappid
      );
      console.log("----this.microServiceMenu--:", this.microServiceMenu);
    },

    // 微应用搜索控件改变事件
    microSelChange(value, selectedData) {
      // 获取最后层级点击数据key
      const selKey = selectedData.length - 1;

      // 如果启动的是微服务，则改变搜索内容为该微应用的菜单
      if (selectedData[selKey].portalMicroType) {
        this.getMicroServiceMenu(selectedData[selKey].microappid);

        this.$store.commit("changeHeaderMicMenuShow");

        // 添加微应用到左侧边栏
        let dataYesOrNo = this.$store.state.sidebarMenuData.filter(item => {
          return item.microappid === selectedData[selKey].microappid;
        });
        if (dataYesOrNo.length === 0) {
          // 添加
          this.$store.commit("addSidebarMenuData", {
            microapp_icon: selectedData[selKey].microapp_icon,
            microappid: selectedData[selKey].microappid,
            microappname: selectedData[selKey].microappname,
            url: selectedData[selKey].url
          });
        } else {
          // 切换
          this.changePotalPanel(selectedData[selKey].microappid);
        }
      }
      // 启动界面显示
      util.openLocalPage(
        this,
        selectedData[selKey].value,
        selectedData[selKey].label,
        "protal_frame",
        "iframe",
        selectedData[selKey].url,
        selectedData[selKey].parent_micro_id
      );
    },
    init() {
      // this.$store.commit("setCurrentPageName", this.$route.name);
      // let pathArr = util.setCurrentPath(this, this.$route.name);
      // if (pathArr.length >= 2) {
      //   this.$store.commit("addOpenSubmenu", pathArr[1].name);
      // }
      this.userName = Cookies.get("user");
      // let messageCount = 3;

      // 获得未读消息数量
      const that = this;
      request(
        {
          url:
            "/portalMsgService?&ent_id=0&topic=newstore-cxh&method=omk.thrift.msg.consumptionMsg&token=" +
            Cookies.get("token"),
          method: "post",
          data: {
            user_id: Cookies.get("userid"),
            topic: "newstore-cxh",
            order_field: "readtime",
            order_direction: "desc",
            isread: ["0"],
            page_size: 1,
            page_no: 1
          }
        },
        function(data) {
          // 微服务菜单数据集合
          that.messageCount = data.data.total_results.toString();
        }
      );
    },
    toggleClick() {
      this.$store.commit("toggleHideMenuType");
    },
    handleClickUserDropdown(name) {
      if (name === "ownSpace") {
        util.openPage(this, "ownspace_index", "个人中心");
      } else if (name === "loginout") {
        // 退出登录
        Cookies.remove("user");
        Cookies.remove("password");
        Cookies.remove("hasGreet");
        Cookies.remove("access");
        Cookies.remove("status");
        this.$Notice.close("greeting");
        // this.$store.commit("clearOpenedSubmenu");
        // 回复默认样式
        let themeLink = document.querySelector('link[name="theme"]');
        themeLink.setAttribute("href", "");
        // 清空打开的页面等数据，但是保存主题数据
        let theme = "";
        if (localStorage.theme) {
          theme = localStorage.theme;
        }
        localStorage.clear();
        if (theme) {
          localStorage.theme = theme;
        }
        this.$router.push({
          name: "login"
        });
        this.$store.commit("logoutInit");
      }
    },
    handleFullScreen() {
      let main = document.getElementById("main");
      if (this.isFullScreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        if (main.requestFullscreen) {
          main.requestFullscreen();
        } else if (main.mozRequestFullScreen) {
          main.mozRequestFullScreen();
        } else if (main.webkitRequestFullScreen) {
          main.webkitRequestFullScreen();
        } else if (main.msRequestFullscreen) {
          main.msRequestFullscreen();
        }
      }
    },
    // 系统消息点击事件
    showMessage() {
      util.openLocalPage(this, "message_index", "消息中心", "message_index");
    },
    // 日志纪录点击事件
    showLogging() {
      util.openLocalPage(this, "logging_index", "日志记录", "logging_index");
    },
    lockScreen() {
      let lockScreenBack = document.getElementById("lock_screen_back");
      lockScreenBack.style.transition = "all 3s";
      lockScreenBack.style.zIndex = 10000;
      lockScreenBack.style.boxShadow =
        "0 0 0 " + this.lockScreenSize + "px #667aa6 inset";
      this.showUnlock = true;
      this.$store.commit("lock");
      Cookies.set("last_page_name", this.$route.name); // 本地存储锁屏之前打开的页面以便解锁后打开
      setTimeout(() => {
        lockScreenBack.style.transition = "all 0s";
        this.$router.push({
          name: "locking"
        });
      }, 800);
    }
  },
  watch: {
    $route(to) {},

    //   监听获取微应用是否存在菜单
    microMenuApiData: function(val, oldVal) {
      // const ls_microListApiData = this.microListApiData;
      // // console.log("this.microListApiData:", this.microListApiData);
      // ls_microListApiData.map((item, index) => {
      //   let ls = val.filter(mitem => {
      //     if (mitem.microappid === item.microappid) {
      //       return mitem;
      //     }
      //   });
      //   // console.log("ls.length:", ls.length);
      //   if (ls.length === 0) {
      //     // 不存在菜单
      //     ls_microListApiData[index].thereAreMenuYesOrNo = false;
      //   } else {
      //     // 存在菜单
      //     ls_microListApiData[index].thereAreMenuYesOrNo = true;
      //   }
      // });
      // this.microListApiData = ls_microListApiData;
      // this.microServiceMenu = ls_microListApiData;
      // this.$store.commit("initMicroServiceMenu", ls_microListApiData);
      // this.getMicroServiceMenu(this.$store.state.currentTabsGroupName);
    }
  },
  mounted() {
    // 初始化状态信息
    this.$store.commit("initSidebarMenuData");
    this.$store.commit("initTabsGroup");
    this.$store.commit("initCurrentTabsGroupName");
    this.$store.commit("initTabsGroup");
    this.$store.commit("initHideMenuType");

    this.init();
    // 全屏相关
    document.addEventListener("fullscreenchange", () => {
      this.isFullScreen = !this.isFullScreen;
    });
    document.addEventListener("mozfullscreenchange", () => {
      this.isFullScreen = !this.isFullScreen;
    });
    document.addEventListener("webkitfullscreenchange", () => {
      this.isFullScreen = !this.isFullScreen;
    });
    document.addEventListener("msfullscreenchange", () => {
      this.isFullScreen = !this.isFullScreen;
    });
    // 锁屏相关
    let lockScreenBack = document.getElementById("lock_screen_back");
    let x = document.body.clientWidth;
    let y = document.body.clientHeight;
    let r = Math.sqrt(x * x + y * y);
    let size = parseInt(r);
    this.lockScreenSize = size;
    window.addEventListener("resize", () => {
      let x = document.body.clientWidth;
      let y = document.body.clientHeight;
      let r = Math.sqrt(x * x + y * y);
      let size = parseInt(r);
      this.lockScreenSize = size;
      lockScreenBack.style.transition = "all 0s";
      lockScreenBack.style.width = lockScreenBack.style.height = size + "px";
    });
    lockScreenBack.style.width = lockScreenBack.style.height = size + "px";
    // 问候信息相关
    if (!Cookies.get("hasGreet")) {
      let now = new Date();
      let hour = now.getHours();
      let greetingWord = {
        title: "",
        words: ""
      };
      let userName = Cookies.get("user");
      if (hour < 6) {
        greetingWord = {
          title: "凌晨好~" + userName,
          words: "早起的鸟儿有虫吃~"
        };
      } else if (hour >= 6 && hour < 9) {
        greetingWord = {
          title: "早上好~" + userName,
          words: "来一杯咖啡开启美好的一天~"
        };
      } else if (hour >= 9 && hour < 12) {
        greetingWord = { title: "上午好~" + userName, words: "工作要加油哦~" };
      } else if (hour >= 12 && hour < 14) {
        greetingWord = { title: "中午好~" + userName, words: "午饭要吃饱~" };
      } else if (hour >= 14 && hour < 17) {
        greetingWord = {
          title: "下午好~" + userName,
          words: "下午也要活力满满哦~"
        };
      } else if (hour >= 17 && hour < 19) {
        greetingWord = {
          title: "傍晚好~" + userName,
          words: "下班没事问候下爸妈吧~"
        };
      } else if (hour >= 19 && hour < 21) {
        greetingWord = {
          title: "晚上好~" + userName,
          words: "工作之余品一品书香吧~"
        };
      } else {
        greetingWord = {
          title: "深夜好~" + userName,
          words: "夜深了，注意休息哦~"
        };
      }
      this.$Notice.config({
        top: 130
      });
      this.$Notice.info({
        title: greetingWord.title,
        desc: greetingWord.words,
        duration: 4,
        name: "greeting"
      });
      Cookies.set("hasGreet", 1);
    }
  },
  created() {
    const token = Cookies.get("token");
    const that = this;

    // 每10秒轮询一次检查登录状态
    let pollingStatus = setInterval(function() {
      if (!Cookies.get("status")) {
        that.$Modal.info({
          title: "操作提示",
          content: "长时间未操作，请重新登录系统",
          onOk: function() {
            clearInterval(pollingStatus);
            that.$router.push({
              name: "login"
            });
          }
        });
      }
    }, 10000);

    // 获取微应用菜单列表
    this.$http({
      url: "/ampOpenapiService?method=user.role.permission.gettreeByApp",
      method: "post",
      data: {
        user_id: Cookies.get("userid")
      }
    })
      .then(data => {
        this.microMenuApiData = data.data.data;
        console.log("第一");
      })
      .then(data => {
        // 获取微应用列表
        this.$http({
          url: "/ampOpenapiService?method=user.app.search",
          method: "post",
          data: {
            fields:
              "ent_id,microappid,microappcode,microappname,microapp_group_id,microapp_group_name,url,microapp_desc,microapp_icon,note,status,lang,create_date,timestamp,creator_id,creator_id,modifier_id,modifier",
            order_direction: "desc",
            order_field: "microappid",
            page_no: 1,
            page_size: 50
          }
        }).then(data => {
          // 微服务菜单数据集合
          this.microListApiData = formatMicroList(data.data.microapp);
          console.log("第二", this.microListApiData);

          // 微应用菜单整理
          const ls_microListApiData = this.microListApiData;
          ls_microListApiData.map((item, index) => {
            let ls = this.microMenuApiData.filter(mitem => {
              if (
                mitem.microappid === item.microappid &&
                mitem.microapp_moduals.data.data &&
                mitem.microapp_moduals.data.data.length > 0
              ) {
                return mitem;
              }
            });
            // 存在菜单
            console.log("ls.length", ls);
            ls_microListApiData[index].thereAreMenuYesOrNo = true;
            if (ls.length === 0) {
              // 不存在菜单
              ls_microListApiData[index].thereAreMenuYesOrNo = false;
            }
          });
          console.log("第san", this.microListApiData);
          this.microListApiData = ls_microListApiData;
          this.microServiceMenu = ls_microListApiData;
          this.$store.commit("initMicroServiceMenu", ls_microListApiData);
          this.$store.commit("changeHeaderMicMenuHide");

          // 当前界面刷新修改逻辑
          if (this.$store.state.currentTabsGroupName != "protalFrame") {
            console.log(
              "this.$store.state.currentTabsGroupName:",
              this.$store.state.currentTabsGroupName
            );
            this.getMicroServiceMenu(this.$store.state.currentTabsGroupName);
          }
        });
      });

    // main.vue组件监听器
    this.NonParentChildCommunication.$on("MListeners", function(obj) {
      switch (obj.type) {
        case "home":
          //  microSelChange(value, selectedData) {
          that.microSelChange([], obj.param);
          break;
        case "message":
          console.log("MListeners:", obj);
          // 切换微应用菜单
          that.getMicroServiceMenu(obj.param.currentTabsGroupName);
          // 启动界面显示
          // vm, code, title, path, type = 'local', url = '', currentTabsGroupName = 'protalFrame'
          util.openLocalPage(
            that,
            obj.param.code,
            obj.param.title,
            obj.param.path,
            obj.param.type,
            obj.param.url,
            obj.param.currentTabsGroupName
          );
          break;
      }
    });

    // ＋＋＋＋＋＋＋＋＋＋portal平台转发应用于公共模版之间消息＋＋＋＋＋＋＋＋＋＋
    const messenger = new window.Messenger("Efuframe", "Efuframe");
    // const that = this;
    messenger.listen(function(msg) {
      let msgObg = JSON.parse(msg);
      if (typeof msgObg.extendInfo == "object") {
        msgObg.extendInfo = JSON.stringify(msgObg.extendInfo);
      }
      if (msgObg.role && msgObg.role === "use") {
        if (msgObg.queryType === "falg") {
          // 标签转换URL
          request(
            {
              url: "/ampOpenapiService?method=user.label.search&token=" + token,
              method: "post",
              data: {
                label_code: msgObg.pathUrl, //验证取值
                page_no: 1,
                page_size: 50
              }
            },
            function(data) {
              // [待优化，提取server地址配置]
              // const REMOTE_HOST = "http://172.17.13.80";
              const REMOTE_HOST = config.remote_host;

              if (data.data.label[0]) {
                msgObg.pathUrl = REMOTE_HOST + data.data.label[0].url;
              } else {
                msgObg.pathUrl = "";
              }
              msgObg.pathUrl = msgObg.pathUrl
                .replace("{token}", Cookies.get("token"))
                .replace("{userid}", Cookies.get("userid"));
              that.EfuframeVisible = true;
              that.EfuframeSrc = msgObg.pathUrl;
              that.LastEfuframeName = msgObg.messengerName;
              that.EfuframeExtendInfo = msgObg.extendInfo;
            }
          );
        } else {
          msgObg.pathUrl = msgObg.pathUrl
            .replace("{token}", Cookies.get("token"))
            .replace("{userid}", Cookies.get("userid"));
          that.EfuframeVisible = true;
          that.EfuframeSrc = msgObg.pathUrl;
          that.LastEfuframeName = msgObg.messengerName;
          that.EfuframeExtendInfo = msgObg.extendInfo;
        }
        const EfuFrameWinDom = document.getElementById("EfuFrameWin");
        EfuFrameWinDom.onload = function() {
          // 弥补iframe没有加载完毕未启动消息传递，则为iframe添加一个onLoad事件
          messenger.addTarget(
            EfuFrameWinDom.contentWindow,
            "publicMessageObjName"
          );
          messenger.targets["publicMessageObjName"].send(msgObg.extendInfo);
        };
        messenger.addTarget(
          EfuFrameWinDom.contentWindow,
          "publicMessageObjName"
        );
        messenger.targets["publicMessageObjName"].send(msgObg.extendInfo);
      } else if (msgObg.role && msgObg.role === "offer") {
        const MicroAppsWinDom = document.getElementById("protalFrame");
        messenger.addTarget(
          MicroAppsWinDom.contentWindow,
          that.LastEfuframeName
        );
        messenger.targets[that.LastEfuframeName].send(msgObg.extendInfo);
        that.EfuframeVisible = false;
        that.EfuframeSrc = "";
        that.LastEfuframeName = "";
        that.EfuframeExtendInfo = "";
      }
    });
    // ＋＋＋＋＋＋＋＋＋＋portal平台转发应用于公共模版之间消息＋＋＋＋＋＋＋＋＋＋
  }
};
</script>
