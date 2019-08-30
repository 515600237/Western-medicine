<template>
    <div class="wrapper disFlex" ref="wrapper">
        <!--我的-->
        <div class="header">
           我的
            <button class="headBtn" @click="goPage('teacherPerfecInfo')">完善信息</button>
        </div>
        <!--内容区-->
        <div class="artice">
            <!--内容区标题-->
            <div class="caption disFlex">
                <div class="iconPortrait">
                    <img src="../../../assets/image/user.png" alt="">
                </div>
                <p class="teacherName ">{{myInfo.userName}}</p>
                <div class="caption-content">
                    <ul class="manInfo disFlex">
                        <li>职能</li>
                        <li class="colon">:</li>
                        <li class="startTime">指导医师</li>
                    </ul>
                    <ol class="endTime disFlex">
                        <li>截止目前您的带教人数是</li>
                        <li class="colon">:</li>
                        <li>{{myInfo.peopleNum ?myInfo.peopleNum:"0"}}人</li>
                    </ol>

                </div>


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
        name: "teacherSet",
        data() {
            return {
                userType: 0,
                myInfo:"",
                /*多科室选择列表*/
                showDeptPicker:false,
                columns:[],
                departmentName:""
            };
        },
        methods: {
            officeClick(){
                this.showDeptPicker = true;
            },
            isInApp() {
                if (typeof Elf.AppCallWeb != "undefined") {
                return !!((window.webkit && window.webkit.messageHandlers) || typeof Elf.WebCallApp == "function" || typeof Elf.WebCallCef == "function");
                }
            },
            goPage(name) {
                this.$router.push({ name: name, params: { type: 2 } });
            },
            outLogin() {
                this.$dialog
                    .confirm({
                        message: "确定要退出吗"
                    })
                    .then(() => {
                        this.$store.dispatch("setResetState");
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
                        this.webApp.WebCallApp("CmdDialing", {"tel":"400-001-8080"}, (res) => {});
                    })
                    .catch(() => {

                    });
            },
            handleTo() {
                this.$router.push(
                    { name: "feedback" }
                );
            },
            getUserInfo() {
                const url = this.api.mysetInfo;
                const postJson = {
                    userId: this.Global.userInfo.userId,
                    userType: this.Global.userType
                };
                this.utils.ajax({
                    url: url,
                    method: "POST",
                    data: postJson,
                    success: res => {
                        console.log(res);
                        if( res.code == 0){
                            this.myInfo = res.result;
                            this.myInfo  =Object.assign({},this.myInfo,res.result);
                        }
                    }
                });
            },
        },
        created(){
            this.getUserInfo();

        },

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
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
    }
    .header{
        width:100%;
        height:2.875rem;
        background:#0ba29b;
        color:#fff;
        line-height:2.875rem;
        font-size:16px;
        position: relative;
    }
    .headBtn{
        min-width:60px;
        max-height:2rem;
        background:#fff;
        border-radius: 5px;
        position: absolute;
        right:10px;
        top:0.4375rem;
        text-align: center;
        font-size:14px;
        border:0;
        color:#0ba29b;
        line-height:2rem;
    }
    /*图标 姓名 参培时间*/
    .artice{
        flex:1;
        margin-top:10px;
    }
    .artice .caption{
        width:100%;
        height:210px;
        position: relative;
        flex-direction: column;
        justify-content: space-evenly;
        background:#fff;
        padding:0 17px;
        box-sizing: border-box;
    }
    .teacherName{
        color:#0ba29b;
        font-size:1rem;
    }
    .iconPortrait{
        width:67px;
        height:67px;
        align-self: center;
        margin:20px 0;
    }
    .iconPortrait img{
        width:100%;
    }
    .caption-content{
        display:flex;
        flex-direction: column;
    }
    .manInfo{
        align-self: flex-start;
        font-size:12px;
        color:#333333;
        margin:20px 0;
    }
    .endTime{
        align-self: flex-start;
        font-size:12px;
        color:#ff8800;
        margin-bottom:10px;
    }

    .colon{
        margin:0 7px;

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
    .office{
        width:80px;
        height:36px;
        border:1px solid red;
        justify-self: flex-end;

    }
</style>
