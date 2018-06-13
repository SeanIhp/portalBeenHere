<template>
  <div style="width:100%;height:100%;" :id="contentCode"></div>
</template>

<script>
const echarts = require("echarts");
export default {
  name: "dashboardLine",
  data() {
    return {
      //echarts对象声明
      echarts: {},
      apiData: {}
    };
  },
  props: {
    url: String,
    contentCode: String,
    span: Number
  },
  methods: {
    // 仪表盘初始化
    init() {
      this.$nextTick(() => {
        //－－－－－－－－－－网络请求数据格式［待替换成异步API请求获取］－－－－－－－－－－
        // const ls_data = {
        //   data: [
        //     { name: "分类分类分类", text1: 4000, text2: 24000 },
        //     { name: "分类2", text1: 3000, text2: 1398 },
        //     { name: "分类3", text1: 2000, text2: 9800 },
        //     { name: "分类4", text1: 2780, text2: 3908 },
        //     { name: "分类5", text1: 1890, text2: 4800 },
        //     { name: "分类6", text1: 2390, text2: 3800 },
        //     { name: "分类7", text1: 3490, text2: 4300 }
        //   ],
        //   itemShowInfo: [
        //     { keyName: "text1", color: "#2d8cf0" },
        //     { keyName: "text2", color: "#82ca9d" }
        //   ]
        // };
        //－－－－－－－－－－网络请求数据格式［待替换成异步API请求获取］end－－－－－－－－－－

        // 数据格式处理变量声明
        let xAxisData = [];
        let seriesData = [];
        let legendData = [];

        // 数据格式处理
        if (
          this.apiData.itemShowInfo &&
          this.apiData.itemShowInfo.length != 0
        ) {
          ls_data.itemShowInfo.map((item, index) => {
            legendData.push(item.keyName);
            seriesData.push({
              name: item.keyName,
              type: "line",
              data: []
            });
            ls_data.data.map((citem, cindex) => {
              seriesData[index].data.push(citem[item.keyName]);
            });
          });
        }

        // 数据格式处理

        ls_data.data.map(item => {
          xAxisData.push(item.name);
        });
        console.log("xAxisData:", xAxisData);
        console.log("seriesData:", seriesData);

        // 图表config配置参数设置
        const option = {
          tooltip: {
            trigger: "axis"
          },
          legend: {
            data: legendData
          },
          grid: {
            top: "20",
            left: "2%",
            right: "4%",
            bottom: "9%",
            containLabel: true
          },
          yAxis: {
            type: "value"
            // boundaryGap: ['20%', '20%']
          },
          xAxis: {
            type: "category",
            data: xAxisData,
            boundaryGap: false,
            nameGap: 20,
            axisLabel: {
              rotate: 30,
              interval: 0
            }
          },
          series: seriesData
        };
        //   声明图表dom对象
        this.echarts = echarts.init(document.getElementById(this.contentCode));
        // 设置图表参数，启动图表显示
        this.echarts.setOption(option);
      });
    },
    // 根据仪表盘URL配置获取数据
    getData() {
      this.$http({
        url: this.url,
        method: "post",
        data: {}
      }).then(res => {
        if (res) {
          this.apiData = res;
          this.init();
        }
      });
    }
  },
  mounted() {
    this.getData();
    //   声明窗口改变事件，刷新图表布局
    const that = this;
    window.addEventListener("resize", function() {
      that.echarts.resize();
    });
  },
  watch: {
    //   监听列布局参数改变后刷新图表布局重绘
    span: function(val, oldVal) {
      if (val != oldVal) {
        this.echarts.resize();
      }
    },
    //监听列表数据URL改变后刷新图表数据
    url: function(val, oldVal) {
      if (val != oldVal) {
        this.getData();
      }
    }
  }
};
</script>
