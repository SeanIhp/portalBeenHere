<style lang="less">
@import "./home.less";
@import "../../styles/common.less";
.ivu-avatar {
  width: 60px;
  height: 60px;
}
.item {
  position: absolute;
  top: 5px;
  left: 5px;
  right: 5px;
  bottom: 5px;
  font-size: 1.2em;
  color: rgb(0, 158, 107);
}
.item:after {
  content: attr(index);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
}
.dashboard-title {
  padding: 10px;
  font-size: 14px;
  color: #1c2438;
  margin-bottom: 10px;
  background-color: #ffffff;
  position: relative;
}
.vertical-center-modal {
  display: flex;
  align-items: center;
  justify-content: center;

  .ivu-modal {
    top: 0;
  }
}
.not-click {
  color: #ccc;
}
</style>
<template>
  <div class="home-main">
    <!-- 微应用列表start -->
    <Row>
      <Col span="24">
      <Card :padding="10" style="margin-bottom:10px;">
        <p slot="title" class="card-title">
          <!-- <Icon type="map"></Icon> -->
          <Icon type="ios-keypad-outline"></Icon>
          我的微应用
        </p>
        <div>
          <Row :gutter="5">
            <div @click="microClick(item)" v-for="(item,index) in microListApiData" :key="index">
              <Col span="4" style="margin-bottom:5px;">
              <Card :padding="0" style="cursor:pointer;">
                <div class="infor-card-con">
                  <Col class="infor-card-icon-con" :style="{ color: 'white'}" span="8">
                  <Row class="height-100" type="flex" align="middle" justify="center">
                    <img :src="item.microapp_icon | microappIconFormat" alt="" style="width:80%;height:auto;" />
                  </Row>
                  </Col>
                  <Col span="16" class="height-100">
                  <Row type="flex" align="middle" justify="start" class="height-100">
                    <div class="infor-card-count user-created-count">
                      <p :class="{'not-click':!item.thereAreMenuYesOrNo}" style="font-size: 14px;font-weight: bold;">{{item.microappname}}</p>
                      <p :class="{'not-click':!item.thereAreMenuYesOrNo}">{{item.microappcode}}</p>
                    </div>
                  </Row>
                  </Col>
                </div>
              </Card>
              </Col>
            </div>
          </Row>
        </div>
      </Card>
      </Col>
    </Row>
    <!-- 微应用列表end -->

    <!-- 可视化报表 -->
    <div class="dashboard-title">
      <p>
        <i class="ivu-icon ivu-icon-ios-keypad-outline"></i>
        仪表盘
      </p>
      <div style="position: absolute;right:15px;top:9px;">
        <Button @click.stop="dashboardItemAdd" v-if="dashboardEditType" type="ghost" icon="ios-search" size="small">添加图表</Button>
        <Button @click.stop="dashboardItemSave" v-if="dashboardEditType" type="primary" size="small">保存设置</Button>
        <Button @click.stop="setDashboardEditType(false)" v-if="dashboardEditType" type="text" size="small">取消</Button>
        <Button @click.stop="setDashboardEditType(true)" v-if="!dashboardEditType" type="primary" size="small">编辑仪表盘</Button>
      </div>
    </div>

    <Row :gutter="10">
      <draggable v-model="dashboardData" :options="{disabled:!dashboardEditType}">
        <Col :span="item.span" style="margin-bottom:10px;" v-for="(item,index) in dashboardData" :key="index">
        <Card>
          <p slot="title" class="card-title">
            <Icon type="android-map"></Icon>
            {{item.title}}
          </p>
          <p slot="extra">
            <a v-if="dashboardEditType" style="margin-right:20px;" href="#" slot="extra" @click.prevent="dashboardItemEdit(index)">
              <Icon type="gear-b" size="20"></Icon>
            </a>
            <a v-if="dashboardEditType" href="#" slot="extra" @click.prevent="dashboardItemDel(index)">
              <Icon type="trash-a" size="20"></Icon>
            </a>
          </p>
          <div class="data-source-row">
            <component :is="item.component" :url="item.url" :contentCode="item.id" :span="item.span" :title="item.title"></component>
          </div>
        </Card>
        </Col>
      </draggable>
    </Row>
    <!-- 可视化报表end -->

    <!-- 添加、编辑图表组件模态框 -->
    <Modal title="添加图表" v-model="addDashboardModal" class-name="vertical-center-modal" :loading="true" @on-ok="addDashboardAction">
      <Form ref="dashboardAddFormRef" :model="dashboardAddForm" :label-width="80" :rules="ruleValidate">
        <FormItem label="类型选择" prop="component">
          <Select v-model="dashboardAddForm.component" style="width:80px;">
            <Option value="dashboardPie">饼状图</Option>
            <Option value="dashboardBar">柱状图</Option>
            <Option value="dashboardLine">折线图</Option>
            <Option value="dashboardArea">面积图</Option>
          </Select>
        </FormItem>
        <FormItem label="标题" prop="title">
          <Input v-model="dashboardAddForm.title" placeholder="输入图表标题..."></Input>
        </FormItem>
        <FormItem label="URL" prop="url">
          <Input v-model="dashboardAddForm.url" placeholder="输入图表数据源资源地址..."></Input>
        </FormItem>
        <FormItem label="列占比" prop="span">
          <Tooltip content="屏幕等分为24列" placement="right">
            <InputNumber :max="24" :min="1" :step="1" :precision="0" v-model="dashboardAddForm.span"></InputNumber>
            <!-- <Icon type="information-circled" size="20"></Icon> -->
          </Tooltip>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="addDashboardModal=false">取消</Button>
        <Button type="primary" @click="addDashboardAction">确定</Button>
      </div>
    </Modal>
    <!-- 添加、编辑图表组件模态框end -->

  </div>
</template>

<script>
import dashboardPie from "./components/dashboardPie.vue";
import dashboardBar from "./components/dashboardBar.vue";
import dashboardLine from "./components/dashboardLine.vue";
import dashboardArea from "./components/dashboardArea.vue";

import draggable from "vuedraggable";

import { request } from "@/libs/httpRequest";
import Cookies from "js-cookie";

// import "@/libs/EfuMessenger.js";

// 随机数
function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}

export default {
  components: {
    dashboardBar,
    dashboardPie,
    dashboardLine,
    dashboardArea,
    draggable
  },
  data() {
    return {
      //   仪表盘编辑标记
      dashboardEditType: false,
      //   仪表盘数据集合
      dashboardData: [],
      //   添加仪表盘信息模态框显示标记
      addDashboardModal: false,
      //   添加仪表盘图表form数据model
      dashboardAddForm: {
        title: "",
        component: "",
        url: "",
        span: 8
      },
      //   仪表盘添加、编辑标记，true添加，false编辑
      addDashboardActionType: true,
      //   表单验证
      ruleValidate: {
        title: [
          {
            required: true,
            message: "标题不能为空",
            type: "string"
          }
        ],
        component: [
          {
            required: true,
            message: "类型不能为空",
            type: "string"
          }
        ],
        url: [
          {
            required: true,
            message: "URL不能为空",
            type: "url"
          }
        ],
        span: [
          {
            required: true,
            message: "列占比不能为空",
            type: "number"
          }
        ]
      }
    };
  },
  computed: {
    microListApiData() {
      return this.$store.state.microServiceMenu;
    }
  },
  mounted() {
    //   初始化渲染仪表盘信息
    this.dashboardInit();
  },
  watch: {
    // dashboardEditType: function(val, oldVal) {
    //   if (val != oldVal) {
    //     this.Sortable.option("disabled", !val);
    //   }
    // }
  },
  methods: {
    //   仪表盘数据初始化
    dashboardInit() {
      const that = this;
      let queryParam = {};
      queryParam.accountId = Cookies.get("userid");
      request(
        {
          url:
            "/ampOpenapiService?method=user.dashboard.search&token=" +
            Cookies.get("token"),
          method: "post",
          data: queryParam
        },
        function(data) {
          let ls_data = data.data.dashboar[0].dashboardJson || {};
          if (typeof ls_data != "object") {
            ls_data = JSON.parse(ls_data);
          }
          that.dashboardData = ls_data.newPortal || [];
        }
      );
    },
    //   数据持久化仪表盘信息
    dashboardItemSave() {
      // 关闭编辑模式
      this.dashboardEditType = false;
      console.log("数据持久化仪表盘信息:", this.dashboardData);
      //   请求参数整理
      let param = {};
      //   JSON.stringify(res)
      param.dashboardJson = JSON.stringify({
        newPortal: this.dashboardData
      });
      param.accountId = Cookies.get("userid");
      console.log("asdf:", param);
      const that = this;

      request(
        {
          url:
            "/ampOpenapiService?method=user.dashboard.save&token=" +
            Cookies.get("token"),
          method: "post",
          data: param
        },
        function(data) {
          that.$Modal.success({
            title: "操作提示",
            content: "保存成功"
          });
        }
      );
    },
    //   添加仪表盘信息触发按钮事件
    dashboardItemAdd() {
      this.addDashboardActionType = true;
      this.addDashboardModal = true;
      //   初始化
      this.dashboardAddForm = {
        title: "",
        component: "",
        url: "",
        span: 8
      };
    },
    //   仪表盘编辑
    dashboardItemEdit(index) {
      // 切换维护仪表盘项目模态框提交事件为编辑状态
      this.addDashboardActionType = false;
      //   初始化模态框内容为当前点击事件触发项目
      this.dashboardAddForm = {
        title: this.dashboardData[index].title,
        component: this.dashboardData[index].component,
        url: this.dashboardData[index].url,
        span: this.dashboardData[index].span,
        id: this.dashboardData[index].id,
        indexSub: index
      };
      //   显示模态框
      this.addDashboardModal = true;
    },
    //   仪表片删除
    dashboardItemDel(index) {
      this.$Modal.confirm({
        title: "操作提示",
        content: "确定要删除图表吗？",
        onOk: () => {
          this.dashboardData.splice(index, 1);
        }
      });
    },
    //   添加仪表盘信息
    addDashboardAction() {
      this.$refs["dashboardAddFormRef"].validate(valid => {
        if (valid) {
          //   关闭模态框
          this.addDashboardModal = false;
          if (this.addDashboardActionType) {
            // 添加仪表盘
            this.dashboardData.push({
              id: s4() + s4() + "-" + s4(),
              title: this.dashboardAddForm.title,
              component: this.dashboardAddForm.component,
              url: this.dashboardAddForm.url,
              span: this.dashboardAddForm.span
            });
            //   初始化
            this.dashboardAddForm = {
              title: "",
              component: "",
              url: "",
              span: 8
            };
          } else {
            //   编辑仪表盘
            this.dashboardData[
              this.dashboardAddForm.indexSub
            ].title = this.dashboardAddForm.title;

            this.dashboardData[
              this.dashboardAddForm.indexSub
            ].component = this.dashboardAddForm.component;

            this.dashboardData[
              this.dashboardAddForm.indexSub
            ].url = this.dashboardAddForm.url;

            this.dashboardData[
              this.dashboardAddForm.indexSub
            ].span = this.dashboardAddForm.span;
          }
        }
      });
    },
    //   设置仪表盘编辑标记
    setDashboardEditType(type) {
      this.dashboardEditType = type;
    },
    //   启动微应用
    microClick(item) {
      console.log("microClick:", item);
      if (item.thereAreMenuYesOrNo) {
        this.NonParentChildCommunication.$emit("MListeners", {
          type: "home",
          param: [item]
        });
      }
    }
  },
  created() {
    // let EfuMessenger = new window.EfuMessenger();
    // console.log("EfuMessenger:", EfuMessenger);
  }
};
</script>
