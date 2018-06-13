<style lang="less">
@import "./styles/infor-card.less";
</style>

<template>
    <Card :padding="0">
        <div class="infor-card-con">
            <Col class="infor-card-icon-con" :style="{ color: 'white'}" span="8">
            <Row class="height-100" type="flex" align="middle" justify="center">
                <img class="avator-img" :src='url' />
            </Row>
            </Col>
            <Col span="16" class="height-100">
            <Row type="flex" align="middle" justify="center" class="height-100">
                <div class="infor-card-count user-created-count">
                    <p>133333333333333333</p>
                    <p>2</p>
                </div>
            </Row>
            </Col>
        </div>
    </Card>
</template>

<script>
import countUp from "./countUp.vue";
import config from "@/config/config";
// http://172.17.13.80//amp-resource-webin/resource/2066278030E7B8424B525746C40079E5
export default {
  name: "inforCard",
  data() {
    return {
      //   url:"http://172.17.13.80//amp-resource-webin/resource/2066278030E7B8424B525746C40079E5"
      url:
        config.remote_host +
        "/amp-resource-webin/resource/2066278030E7B8424B525746C40079E5"
    };
  },
  components: {
    countUp
  },
  props: {}
};
</script>

