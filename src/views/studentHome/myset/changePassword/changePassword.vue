<template>
  <div class="wrapper">
    <!--标题栏-->
    <van-nav-bar title="修改密码"
                 left-text="返回"
                 @click-left="onClickLeft"
                 left-arrow
                 class="office"
    />
    <!--内容区-->
    <section>
      <van-field v-model="oldPwd"
                 type="password"
                 left-icon="lock"
                 placeholder="输入当前登录密码"
      />
      <van-field v-model=" newPwd"
                 type="password"
                 left-icon="lock"
                 placeholder="输入新的登录密码"
      />

      <van-field v-model="newsecondpassword"
                 type="password"
                 left-icon="lock"
                 placeholder="再次输入新的登录密码"/>
      <button class="deleteBtn" @click="handleSubmit">提交</button>
    </section>
  </div>
</template>

<script>
export default {
  name: "changePassword",
  data() {
    return {
      userId: "",
      oldPwd: "",
      newPwd: "",
      newsecondpassword: "",
    };
  },
  methods: {
    onClickLeft() {
     /* if (this.Global.userType == 3) {
        this.$router.push({ name: "teacherSet" });
      } else if (this.Global.userType == 4) {
        this.$router.push({ name: "mySet" });
      }*/
      this.$router.go(-1);
    },
    isInApp() {
      if (typeof Elf.AppCallWeb != "undefined") {
        return !!((window.webkit && window.webkit.messageHandlers) || typeof Elf.WebCallApp == "function" || typeof Elf.WebCallCef == "function");
      }
    },
    handleSubmit() {
      if (!this.oldPwd) {
        this.$toast("请先填写当前登录密码");
        return;
      }
      if(!this.newPwd){
        this.$toast("请输入新的登录密码");
        return;
      }
      if (this.newPwd&&this.newPwd.length < 6){
        this.$toast("密码长度不能小于6位");
        return;
      }
      if (this.newPwd && this.newPwd == this.oldPwd) {
        this.$toast("密码不能和上次的密码相同");
        return;
      }
      if(!this.newsecondpassword){
        this.$toast("请再次输入新的登录密码");
        return;
      }
      if (this.newPwd != this.newsecondpassword) {
        this.$toast("新登录密码两次输入不一致");
        return;
      }
      /****** 必传参数 *****/
      const url = this.api.changePassword;
      console.log(url);
      const postJson = {
        userId: this.Global.userId,
        newPwd: this.newPwd,
        oldPwd: this.oldPwd,
        type: "1"
      };
      /******** 请求数据   *******/
        this.utils.ajax({
            url: url,
            method: "POST",
            data: postJson,
            success: (res) => {
              console.log(res);
              if(res.code == 0){
                this.$toast("修改密码成功");
                setTimeout(()=>{
                  if(this.isInApp()){
                    this.webApp.WebCallApp("UserLogout", {}, (res) => {});
                  }else{
                    this.$router.push({ name: "login"});
                  }
                },200)
              }else{
                this.$toast(res.msg);
              }
            }
          });
    }
  },

};
</script>

<style scoped>

.wrapper /deep/ .van-nav-bar__title {
  color: #333;
  font-size: 16px;
}
.wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  background: #f2f2f2;
}

section {
  width: 100%;
  height: 300px;
  padding: 50px 40px 55px;
  box-sizing: border-box;
  background: #fff;
}
.deleteBtn {
  border-radius: 20px;
  height: 40px;
  margin-top: 15px;
  border: none;
  width: 95%;
  background: #1da29a;
  color: #fff;
  font-size: 14px;
}
.wrapper /deep/ .van-field__control {
  margin-left: 17px;
}
.wrapper /deep/ .van-field__control::-webkit-input-placeholder {
  color: #ccc;
}
</style>