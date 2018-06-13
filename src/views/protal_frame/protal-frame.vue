<style>

</style>

<template>
  <iframe id="protalFrame" frameBorder="0" :src=url width="100%" :height="contentHeight+'px'" style="background-color: #fff;" />
</template>

<script>
import Cookies from "js-cookie";
import config from "@/config/config";

export default {
  data() {
    return {
      url: ""
    };
  },
  created() {},
  computed: {
    contentHeight() {
      return this.$store.state.contentHeight;
    }
  },
  methods: {
    init() {
      const ls_url = decodeURIComponent(this.$route.params.url);
      this.url = ls_url
        .replace("{token}", Cookies.get("token"))
        .replace("{userid}", Cookies.get("userid"));
      if (this.url.indexOf("http://") < 0 || this.url.indexOf("https://") < 0) {
        // [待优化，提取server地址配置]
        // this.url = "http://172.17.13.80" + this.url;
        this.url = config.remote_host + this.url;
      }
    }
  },
  mounted() {
    this.init();
  },
  watch: {
    $route() {
      this.init();
    }
  }
};
</script>

