<style lang="less">
@import "./login.less";
.ivu-form-item-error .tagInput {
  background-color: #fff;
}
.tagInput {
  // background-color: #eeeeee;
  border: none;
  height: 22px;
  width: 60px;
}
.ivu-input-wrapper .ivu-input-group-append {
  background-color: #fff;
}
</style>

<template>
  <div class="login" @keydown.enter="handleSubmit">
    <div class="login-con" style="width:350px;">
      <Card :bordered="false">
        <p slot="title">
          <Icon type="log-in"></Icon>
          欢迎登录
        </p>
        <div class="form-con">
          <Form ref="loginForm" :model="form" :rules="rules">
            <FormItem prop="userName">
              <Input v-model="form.userName">
              <span slot="prepend">
                <Icon :size="16" type="person"></Icon>
              </span>
              <span slot="append">
                <input class="tagInput" :readonly="isReadOnly" v-model="ent" />
              </span>
              </Input>
            </FormItem>
            <FormItem prop="password">
              <Input type="password" v-model="form.password">
              <span slot="prepend">
                <Icon :size="14" type="locked"></Icon>
              </span>
              </Input>
            </FormItem>
            <FormItem>
              <Button @click="handleSubmit" type="primary" long>登录</Button>
            </FormItem>
          </Form>
          <p class="login-tip" style="color:#5A616E;">Copyright © 2017 eFuture Information Technology Inc.</p>
          <p class="login-tip" style="color:#5A616E;">{{ICP}}</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import config from "@/config/config";
export default {
  data() {
    return {
      // config.remote_host
      ICP: config.icp,
      isReadOnly: true,
      ent: "",
      form: { userName: "", password: "" },
      rules: {
        userName: [
          { required: true, message: "账号不能为空", trigger: "blur" }
        ],
        password: [{ required: true, message: "密码不能为空", trigger: "blur" }]
      }
    };
  },
  methods: {
    handleSubmit() {
      // 实现最后一次登陆用户名记住
      //   this.form.userName = "111"; //数据类型药一致，不然v-model显示改变了，但是运行无响应

      const that = this;
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.$Loading.start();
          this.$http({
            url: "/ampAuthService?method=amp.auth.authentication.signInNoEnt",
            method: "post",
            data: {
              code: this.form.userName,
              password: this.form.password,
              tag: this.ent
            }
          }).then(res => {
            const { token } = res.data;
            Cookies.set("token", token);
            this.$http({
              url: "/ampAuthService?method=amp.auth.authentication.checkState",
              method: "post",
              data: { token: token }
            }).then(res => {
              this.$Loading.finish();
              const { authid, code, ent_id, expires, name } = res.data;
              Cookies.set("user", name);
              Cookies.set("userid", authid);
              Cookies.set("ent_id", ent_id);

              // cookies过期时间
              const inFifteenMinutes = new Date(
                new Date().getTime() + 30 * 60 * 1000
              );
              Cookies.set("status", true, { expires: inFifteenMinutes });

              this.$router.push({
                name: "home_index"
              });
            });
          });
        }
      });
    }
  },
  created() {
    this.ent = window.location.host.split(".")[0];
    if (this.ent == "www") {
      this.isReadOnly = false;
    }
  }
};
</script>

<style>

</style>
