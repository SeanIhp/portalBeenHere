<style lang="less">
// @import "./message.less";
</style>

<template>
  <div>
    <Card>
      <Table ref="messageList" :columns="mesTitleColumns" :data="currentMesList" :no-data-text="noDataText" @on-expand="tableExpand"></Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page :total="dataTotal" :current="1" @on-change="changePage"></Page>
        </div>
      </div>
    </Card>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import util from "@/libs/util.js";
import { request } from "@/libs/httpRequest";

export default {
  data() {
    const readBtn = (h, params) => {
      return h(
        "Button",
        {
          props: {
            size: "small"
          },
          on: {
            click: () => {
              console.log("paramclick:", params.row);
            }
          }
        },
        "标为已读"
      );
    };
    const actionBtn = (h, params) => {
      return h(
        "Button",
        {
          props: {
            size: "small"
          },
          on: {
            click: () => {
              console.log("paramclick:", params.row);

              let data = {
                code: params.row.modulecode,
                title: params.row.modulename,
                path: "protal_frame",
                type: "iframe",
                url: params.row.responseurl,
                currentTabsGroupName: params.row.microserviceid
              };

              this.NonParentChildCommunication.$emit("MListeners", {
                type: "message",
                param: data
              });
            }
          }
        },
        "去处理"
      );
    };

    return {
      // －－－－－－－－－－当前用到的－－－－－－－－－－
      //   消息总数
      dataTotal: 0,
      //   表格请求API参数
      queryParam: {
        user_id: Cookies.get("userid"),
        topic: "newstore-cxh",
        order_field: "readtime",
        order_direction: "desc",
        isread: ["1", "0"],
        page_size: 10,
        page_no: 1
      },
      noDataText: "暂无未读消息",
      mesTitleColumns: [
        {
          type: "expand",
          width: 50,
          render: (h, params) => {
            return h("p", {}, params.row.messagecontent);
          }
        },
        {
          title: " ",
          key: "title",
          align: "left",
          ellipsis: true,
          render: (h, params) => {
            console.log();
            if (params.row.isread === 1) {
              return h("p", [
                h("span", {}, "来自" + params.row.microservicename + "的消息")
              ]);
            } else {
              return h("p", [
                h("span", {}, "来自"),
                h(
                  "span",
                  {
                    style: {
                      color: "red"
                    }
                  },
                  params.row.microservicename
                ),
                h("span", {}, "的消息")
              ]);
            }
          }
        },
        {
          title: " ",
          key: "consumername",
          align: "left"
        },
        {
          title: " ",
          key: "readtime",
          align: "left"
        },
        {
          title: " ",
          key: "asread",
          align: "center",
          width: 100,
          render: (h, params) => {
            if (params.row.messagecatid === 1) {
              return h("div", [actionBtn(h, params)]);
            }
          }
        }
      ],
      currentMesList: [
        {
          messagecontent: "我是详细信息",
          title: "123123",
          consumername: "css",
          readtime: "123123"
        }
      ]
      // －－－－－－－－－－当前用到的end－－－－－－－－－－
    };
  },
  methods: {
    //－－－－－－－－－－－－－－－－－－－－
    // 阅读消息展开事件
    tableExpand(row, status) {
      if (status && row.isread === 0) {
        this.$http({
          url: "/portalMsgService?&ent_id=0&method=omk.thrift.msg.update",
          method: "post",
          data: {
            isread: 1,
            messageno: row.messageno
          }
        }).then(res => {
          this.init();
        });
      }
    },

    // 格式化数据，拼接响应字段
    formatData(param) {
      console.log("formatData:", param);
      param.map((item, index) => {
        // param[index].info = "2222";
        param[index].title = "来自" + item.microservicename + "的消息";
      });
      return param;
    },
    // 初始化消息数据
    init() {
      // Cookies.get("userid");
      //   Cookies.get("token")
      // 获取微应用菜单列表
      console.log("queryParam:", this.queryParam);
      const that = this;
      request(
        {
          url:
            "/portalMsgService?&ent_id=0&topic=newstore-cxh&method=omk.thrift.msg.consumptionMsg&token=" +
            Cookies.get("token"),
          method: "post",
          data: this.queryParam
        },
        function(data) {
          // 微服务菜单数据集合
          console.log("data:", data);
          that.dataTotal = data.data.total_results;
          //   that.formatData(data.data.messageDetail);
          that.currentMesList = that.formatData(data.data.messageDetail);
        }
      );
    },
    // 分也改变事件
    changePage(page) {
      console.log(page);
      this.queryParam.page_no = page;
      this.init();
    },
    //－－－－－－－－－－－－－－－－－－－－
    formatDate(time) {
      let date = new Date(time);
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let hour = date.getHours();
      let minute = date.getMinutes();
      let second = date.getSeconds();
      return (
        year +
        "/" +
        month +
        "/" +
        day +
        "  " +
        hour +
        ":" +
        minute +
        ":" +
        second
      );
    }
  },
  mounted() {
    this.init();
  },
  watch: {}
};
</script>

