<template>
  <div class="ht100">
    <!-- 住院医师 -->
    <van-tabbar v-model="isActive"
                v-if="isShow && userType ==4"
                class="bottomTab" >
      <van-tabbar-item icon="home-o" @click="goPage('/studentHome/homeindex')">首页</van-tabbar-item>
      <van-tabbar-item icon="bar-chart-o" @click="goPage('/studentHome/staticindex')">统计</van-tabbar-item>
      <van-tabbar-item icon="user-o" @click="goPage('/studentHome/mySet')">我的</van-tabbar-item>
    </van-tabbar>

    <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view class="viewCenter" :class="{'ht100':!isShow}" v-if="!$route.meta.keepAlive"></router-view>

  </div>

</template>

<script>
export default {
  name: "studentHome",
  data() {
    return {
      userType: 1
    };
  },
  computed:{
     isShow(){
       return this.$store.getters.isShow;
     },
     isActive:{
       get(){
         return this.$store.getters.getActiveNum;
       },
       set(number){
         this.$store.dispatch("setNewNum",number);
       }
    }
  },
  methods: {
    goPage(path) {
      this.$router.push({ path: path});
    }
  },
  mounted(){
     this.userType = this.Global.userType;
  },
  watch:{
      $route(to,from){ //跳转组件页面后，监听路由参数中对应的当前页面以及上一个页面
         console.log(to.meta.keepAlive);
        if(to.name=='homeindex'||to.name=='staticindex'|| to.name=='mySet' ){
           this.$store.dispatch('showFooter');
        }else{
          this.$store.dispatch('hideFooter');
        }
      }
  }
};
</script>

<style scoped>

  .ht100 /deep/ .van-tabbar-item--active{
        color:#006754;
  }
 .bottomTab{
   height: 50px;
 }
 .viewCenter{
   height: 100%;
   padding-bottom: 50px;
 }
 .viewCenter.ht100{
   height: 100%;
   padding: 0;
 }

</style>
