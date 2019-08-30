<template>
        <div class="wrapper disFlex">
            <!--我的-->
            <div class="header">
                我的
            </div>
            <!--内容区-->
            <div class="artice">
                <!--内容区标题-->
             <div class="caption disFlex">
                 <div class="iconPortrait">
                     <img src="../../../../assets/image/user.png" alt="">
                 </div>
                 <p class="userName ">{{myInfo.userName}}</p>
                 <ul class="manInfo disFlex">
                     <li>参培时间</li>
                     <li class="colon">:</li>
                     <li class="startTime">{{myInfo.startTime}}</li>
                     <li class="erect">|</li>
                     <li>专业</li>
                     <li class="colon">:</li>
                     <li>{{myInfo.majorName}}</li>
                 </ul>
                 <div class="progress">
                     <van-progress
                             :percentage="progressNum"
                             :show-pivot="false"
                             pivot-color="#037f78"
                             color="#037f78"
                     />
                 </div>
                 <p class="endTime">距规培结束还有{{lastDays}}天</p>
             </div>
                    <!--主内容-->
                <div class="section">
                    <div class="changePassWord">
                        <van-cell-group>
                            <van-cell
                                    value="修改密码"
                                    icon="lock"
                                    is-link
                                    class="password"
                                    :to="{name:'changepassword'}"
                            />
                        </van-cell-group>
                    </div>
                    <div class="tips">
                        <van-cell-group>
                            <van-cell value="使用说明"
                                      icon="question"
                                      is-link
                                      :to="{path:'/studentHome/operating'}"
                            />
                        </van-cell-group>
                        <van-cell-group>
                            <van-cell value="意见反馈"
                                      icon="comment"
                                      is-link
                                      :to="{path:'/studentHome/feedback'}"
                            />
                        </van-cell-group>
                        <van-cell value="400-001-8080"
                                  icon="phone"
                                  is-link
                                  @click="connect"
                        >
                            <template slot="title">
                                <span class="custom-text">联系我们</span>
                            </template>
                        </van-cell>
                        <van-cell value="1.0.0" icon="info">
                            <template slot="title">
                                <span class="custom-text">版本信息</span>
                            </template>
                        </van-cell>
                    </div>
                    <div class="quitLogin">
                        <button class="deleteBtn"
                                @click="outLogin">退出登录
                        </button>
                    </div>
                </div>
            </div>

        </div>
</template>

<script>
    export default {
        name: "mySet",
        data(){
            return {
                myInfo:"",
                progressNum: 75,
                lastDays: 0
            }
        },
        methods: {
            isInApp() {
                if (typeof Elf.AppCallWeb != "undefined") {
                return !!((window.webkit && window.webkit.messageHandlers) || typeof Elf.WebCallApp == "function" || typeof Elf.WebCallCef == "function");
                }
            },
            outLogin() {
                let that = this;
                this.$dialog
                    .confirm({
                        title:"确定要退出登录?",
                        message:"退出登录后，你将收不到轮转监测\n发送的消息",
                        confirmButtonColor:"red",
                        confirmButtonText:"确定",
                        className:"no-login"
                    })
                    .then(() => {
                        that.$store.dispatch("setResetState");
                        if(this.isInApp()){
                           this.webApp.WebCallApp("UserLogout", {}, (res) => {});
                        }else{
                           this.$router.push({ name: "login"});
                        }
                    })
                    .catch(() => {
                    });
            },
            connect() {
                this.$dialog
                    .confirm({
                        message: "确定要拨打电话吗？"
                    })
                    .then(() => {
                        this.webApp.WebCallApp("CmdDialing",{"tel":"400-001-8080"}, (res) => {});
                        this.webApp.WebCallApp("CmdDialing",{"tel":"400-001-8080"}, (res) => {});
                    })
                    .catch(() => {
                    });
            },
            getUserInfo() {
                const url = this.api.mysetInfo;
                const postJson = {
                    userId: this.Global.userId,
                    userType: this.Global.userType,
                };
                this.utils.ajax({
                    url: url,
                    method: "POST",
                    data: postJson,
                    success: res => {
                        console.log(res);
                        this.myInfo = Object.assign({},this.myInfo,res.result);
                        if(this.myInfo.lastDays){
                            this.lastDays = Math.abs(this.myInfo.lastDays);
                            let totalDays = Math.abs(this.myInfo.totalDays);
                            this.progressNum = ((totalDays-this.lastDays)/ totalDays).toFixed(2)*100;
                        }
                    }
                });
            }
        },
        created() {
            this.getUserInfo();

        },
        mounted(){

        }
    }
</script>

<style scoped>
    .wrapper /deep/ .van-progress{
        width:100%;
        height:0.3125rem;
    }
    .wrapper{
        width:100%;
        height:100%;
        position:absolute;
        left:0;
        right:0;
        top:0;
        bottom:0;
        margin:auto;
        flex-direction: column;
        background:#f2f2f2;
    }
    .header{
        width:100%;
        height:2.875rem;
        background:#0ba29b;
        color:#fff;
        line-height:2.875rem;
        font-size:16px;
    }
    /*图标 姓名 参培时间*/
    .artice{
        flex:1;
        margin-top:10px;
        overflow:auto;
    }
    .artice .caption{
        width:100%;
        height:210px;
        align-items: center;
        flex-direction: column;
        justify-content: space-evenly;
        background:#fff;
        padding:0 17px;
        box-sizing: border-box;
    }
    .userName{
        height:3.125rem;
        color:#0ba29b;
        font-size:1rem;
    }
    .iconPortrait{
        width:67px;
        height:67px;
        margin:10px 0;

    }
    .iconPortrait img{
        width:100%;
    }
    .manInfo{
        align-self: flex-start;
        font-size:12px;
        color:#333333;
    }
    .endTime{
        align-self: flex-start;
        font-size:12px;
        color:#333333;
        margin-bottom:10px;
    }
    .progress{
        width:100%;
        height:0.3125rem;
        margin:10px 0;
    }

    .colon{
       margin:0 7px;
        align-self: flex-end;
    }
    .startTime{
        align-self: flex-end;
    }
    .erect{
        margin:0 7px;
        align-self: flex-end;
    }
    /*修改密码 版本信息 退出登录*/
    .password {
        margin: 12px 0;
    }
    .wrapper /deep/ .van-cell__title {
        text-align: left;

    }
    .wrapper /deep/ .van-cell__value--alone span{
        font-size:14px;
    }
    .deleteBtn {
        border-radius: 4px;
        height: 40px;
        margin-top: 20px;
        border: none;
        width: 95%;
        background: #1da29a;
        color: #fff;
        font-size: 14px;
    }
    /* 退出登录 */
  /*  .wrapper >>>  .no-login .van-dialog__message .van-dialog__message--has-title{
        color:lightcyan;
    }
    .wrapper >>>.no-login .van-dialog__message{
        color:orange;
    }*/
      .no-login /deep/ .van-dialog__message--has-title{
        color:skyblue;
    }
</style>
