<style lang="less">
// @import "./message.less";
</style>

<template>
    <div>
        <Card>
            <Table ref="messageList" :columns="loggingColumns" :data="loggingData" :no-data-text="noDataText"></Table>
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
import { request } from "@/libs/httpRequest";

export default {
  data() {
    return {
      //   消息总数
      dataTotal: 0,
      //   表格请求API参数
      queryParam: {
        microservicename: "kafka",
        order_direction: "desc",
        order_field: "timestamp",
        page_size: 12,
        page_no: 1,
        // user_id: Cookies.get("userid"),
        user_id: "0"
      },
      noDataText: "暂无未读消息",
      loggingColumns: [
        {
          type: "expand",
          width: 50,
          render: (h, params) => {
            return h("p", {}, params.row.log_content);
          }
        },
        {
          title: "微服务",
          key: "microservicename",
          align: "left",
          ellipsis: true
        },
        {
          title: "日志时间",
          key: "proDate",
          align: "left"
        },
        {
          title: "日志偏移量",
          key: "offset",
          align: "left"
        },
        {
          title: "日志分区",
          key: "partition",
          align: "center",
          width: 100
        }
      ],
      loggingData: []
    };
  },
  methods: {
    // 初始化数据
    init() {
      this.$http({
        url: "/portalMsgService?method=omk.kafka.logs.search&ent_id=0",
        method: "post",
        data: this.queryParam
      }).then(res => {
        this.loggingData = res.data.kafkaLogs;
        this.dataTotal = res.data.total_results;
      });
    },
    // 分也改变事件
    changePage(page) {
      this.queryParam.page_no = page;
      this.init();
    }
  },
  mounted() {
    this.init();
  },
  watch: {}
};
</script>

