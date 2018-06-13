<style>
.micIcon {
  padding: 10px 0px;
  text-align: center;
}
.micIcon:hover {
  cursor: pointer;
}
</style>


<template>
  <div>
    <div class="micIcon" v-for="(item,index) in sidebarMenuData" :key="index">
      <Poptip placement="right" :transfer="true" trigger="hover">
        <div v-on:click="changeMicroMenu(item)">
          <Avatar style="background-color: #fff;" v-if="item.microapp_icon && item.microapp_icon != ''" :src="item.microapp_icon | microappIconFormat" shape="square" />
          <Avatar v-else shape="square">{{item.microappname}}</Avatar>
        </div>
        <div slot="title">
          <i>{{item.microappname}}</i>
        </div>
        <div slot="content">
          <a @click="delMicroMenu(item,index)">关闭微应用</a>
        </div>
      </Poptip>
    </div>
  </div>
</template>

<script>
export default {
  name: "sidebarMenuShrink",
  props: {},
  data() {
    return {};
  },
  computed: {
    sidebarMenuData() {
      return this.$store.state.sidebarMenuData;
    }
  },
  methods: {
    changeMicroMenu(item) {
      // console.log("切换事件:", item);
      this.$emit("ListenersParentEvent", "sidebarMenuShrink", item.microappid);
    },
    delMicroMenu(item, index) {
      let lengthNum = this.sidebarMenuData.length;
      if (lengthNum <= 1) {
        // console.log("不存在侧边栏:回到首界面");
        // this.$emit("ListenersParentEvent", "sidebarMenuClose", "protalFrame");
        this.$emit("ListenersParentEvent", "sidebarMenuClose", {
          del: item.microappid,
          to: "protalFrame"
        });
      } else {
        let sub = index == 0 ? 1 : index - 1;
        // console.log();
        console.log(
          "this.sidebarMenuData[sub].microappid:",
          this.sidebarMenuData[sub].microappid
        );
        this.$emit("ListenersParentEvent", "sidebarMenuClose", {
          del: item.microappid,
          to: this.sidebarMenuData[sub].microappid
        });
      }
      this.$store.commit("removeSidebarMenuData", index);
    }
  },
  watch: {
    $route(to) {}
  }
};
</script>
