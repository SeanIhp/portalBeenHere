<template>

  <div style="width:100%;height:100%;" :id="contentCode"></div>

</template>

<script>
const echarts = require("echarts");

export default {
  name: "dashboardPie",

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
    span: Number,
    title: String
  },

  methods: {
    // 仪表盘初始化
    init() {
      this.$nextTick(() => {
        // 数据格式处理变量声明
        let legendData = [];
        let seriesData = [];

        // 数据格式处理
        if (this.apiData.data && this.apiData.data.length != 0) {
          this.apiData.data.map((item, index) => {
            legendData.push(item.name);
            seriesData.push({
              value: item.value,
              name: item.name,
              itemStyle: { normal: { color: item.fill } }
            });
          });
        }

        // 图表config配置参数设置
        const option = {
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            orient: "vertical",
            left: "right",
            data: legendData
          },
          series: [
            {
              name: this.title,
              type: "pie",
              radius: "66%",
              center: ["50%", "60%"],
              data: seriesData,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)"
                }
              }
            }
          ]
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
