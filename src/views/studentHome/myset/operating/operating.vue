<template>
    <div class="wrapper">
        <van-nav-bar title="使用说明"
                     left-text="返回"
                     @click-left="onClickLeft"
                     left-arrow
                     class="office"
        />

         <section>
                <div class="top same">
                  <h3 class="title">1.APP没有数据怎么办？</h3>
                    <p class="text">苹果手机针对iOS 10.0以上系统，找到【设置】--【蜂窝移动网络】--【使用无线局域网与蜂窝移动应用】重现刷新APP即可，如果失败请重现启动手机尝试。</p>
                </div>
                <div class="bottom same">
                    <h3 class="title">2.如何修改密码</h3>
                    <p class="text">在【我的】--【修改密码】，输入当前登录密码与新密码后提交即可。</p>

                </div>
         </section>

    </div>
</template>

<script>
    export default {
        name: "operating",
        data(){
          return {
                userType:0

          }
        },
        methods:{
            onClickLeft(){
                if(this.userType ==3){
                    this.$router.push({name:"teacherSet"})

                }else  if(this.userType ==4){
                    this.$router.push({name:"mySet"})
                }
            }
        },
        mounted(){
            this.userType = this.Global.userType;
            console.log(this.userType);
        },
    }
</script>

<style scoped>
    .wrapper /deep/ .van-icon-arrow-left{
        color:#1da29a;
    }
    .wrapper /deep/ .van-nav-bar__text{
        color:#1da29a;
    }
    .wrapper /deep/ .van-nav-bar__title{
        color:#333;
    }
    section {
        width:100%;
        height:300px;
        padding:20px 25px 0;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        font-size:14px;
        color:#333;
    }
    section .top{
        width:100%;
        height:150px;

    }
    section .bottom{
        width:100%;
        height:150px;

    }
    section .title{
        text-align: left;
        font-weight: bold;
        margin-bottom:20px;
    }
    section  .text{
        text-align: left;
    }
</style>
