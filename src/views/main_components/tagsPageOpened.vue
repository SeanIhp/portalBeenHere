<style lang="less">
@import "../main.less";
</style>

<template>
  <div>
    <!-- 绑定全局 store 中的 tabsGroup 状态数据 -->
    <transition-group v-for="(tabs,index) in protalFrameTabsGroup" name="taglist-moving-animation" :key="index" v-if="tabs.tabsGroupName==currentTabsGroupName">

      <Tag type="dot" v-for="tagItem in tabs.tabsGroupItemInfo.tabsList" :key="tagItem.code" :name="tagItem.code" @on-close="closePage" @click.native="linkTo(tagItem)" :closable="(tagItem.code===tabs.tabsGroupItemInfo.currentTabCode || tagItem.code==='home_index')?false:true" :color="(tagItem.code===tabs.tabsGroupItemInfo.currentTabCode?'blue':'default')">{{ tagItem.title }}
      </Tag>

    </transition-group>
  </div>
</template>

<script>
import util from "@/libs/util.js";

export default {
  name: "tagsPageOpened",
  data() {
    return {};
  },
  created() {},
  props: {},
  computed: {
    currentTabsGroupName() {
      return this.$store.state.currentTabsGroupName;
    },
    protalFrameTabsGroup() {
      return this.$store.state.tabsGroup;
    }
  },
  methods: {
    closePage(event, name) {
      console.log(name);
      console.log(this.currentTabsGroupName);
      this.$store.commit("removeTag", {
        name: name,
        currentTabsGroupName: this.currentTabsGroupName
      });
    },

    // tag点击事件
    // 根据key参数判断区分框架界面与第三方界面跳转
    linkTo(item) {
      util.openLocalPage(
        this,
        item.code,
        item.title,
        item.path,
        item.type,
        item.url,
        item.currentTabsGroupName
      );
    }
  },
  watch: {}
};
</script>
