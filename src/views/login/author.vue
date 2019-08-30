<template>
          <div class="author">
            <header>
              <van-icon name="arrow-left"  @click="arrowLeft" class="arrow"/>
              过程管理系统登录
            </header>
            <div class="icon">
              <img src="../../assets/iconpng.png" alt="">
              <p>过程管理系统</p>
            </div>
          <div class="author-bottom">
            <p>登录后该应用将获得以下权限</p>
            <p>获得你的公开信息(昵称、头像等)</p>
            <van-button  @click="author" class="btn">
              授权
            </van-button>
            <van-button  @click="cancelAuthor" class="btn">
              取消
            </van-button>
          </div>
          </div>
</template>

<script>
    export default {
        name: "author",
        data(){
            return {
                obj:'',
                type:0,
            }
        },
        methods:{
            arrowLeft(){
                this.webApp.WebCallApp("CmdGoBack", {}, (res) => {});
            },
            getUrl(){
                    let url = window.location.href;
                    this.obj = this.utils.urlObj(url)
            },
            author(){

                let url = this.api.admin;
                this.type =0;
                let postJson;

                     postJson = {
                        caId:this.$store.state.urlObj.caId || this.obj.caId,
                        cellPhone: this.$store.state.urlObj.cellPhone || this.obj.cellPhone ,
                        token: this.$store.state.token ||this.obj.token,
                        type: this.type,
                        source:this.$store.state.urlObj.source || this.obj.source,
                    };
                this.utils.ajax({
                     url:url,
                     method:'POST',
                     data:postJson,
                      success:(res)=>{
                        if(res&&res.code==0  ){
                            if(this.obj.token){
                                this.$store.state.token =  this.obj.token
                                this.$store.state.imei  =  this.obj.imei
                                this.$store.state.project = this.obj.project
                            }
                                this.$store.dispatch("setNewToken",this.$store.state.token );
                                this.$store.dispatch("setNewImei", this.$store.state.imei  );
                                this.$store.dispatch("setNewProject",this.$store.state.project)
                                window.location.href = res.url;

                        }
                      }
                  })
            },
            cancelAuthor(){


                let url = this.api.admin;
                this.type =1;
                let postJson;
                   console.log(this.$store.state.token,this.$store.state.urlObj.source)
                   postJson = {
                       token:this.$store.state.token || this.obj.token,
                       type: this.type,
                       source:this.$store.state.urlObj.source || this.obj.source,
                   };

                   this.utils.ajax({
                       url:url,
                       method:'POST',
                       data:postJson,
                       success:(res)=>{
                           window.location.href = res.url;
                           if(this.obj.token){
                               this.$store.state.urlObj.token  = this.obj.token;
                           }
                           this.$store.dispatch("setNewToken",this.$store.state.urlObj.token  );
                           if(res.code==0){
                           }
                       }
                   })




            },
        },
        created(){
            this.getUrl();
        }
    }
</script>

<style scoped>
        .author{
          display: flex;
          flex-direction: column;
        }
        header{
          width:100%;
          background:#1DA29A;
          height:3rem;
          line-height: 3rem;
          color:#fff;
          position: relative;
        }
        .arrow{
          position: absolute;
          top:50%;
          left:0.9375rem;
          transform: translate(0,-50%);
        }
        .icon{
          margin:50px 0;
        }
        .icon::after{
          display: block;
          width:80%;
          position: relative;
          top:25px;
          content: " ";
          height:1px;
          margin:auto;
          background:#ccc;
        /*  transform: translate(0,25px);*/
        }
        .icon p{
          margin-top:10px;
          font-weight: bold;
        }
        .author img{
          width:80px;
          height:80px;
        }
        .author-bottom{
          width:80%;
          margin:0 auto;
        }
        .author-bottom  p  {
          text-align: left;
          font-weight: bold;
        }
        .author-bottom  p:nth-of-type(2){
          font-size:14px;
          margin:15px 0;
          font-weight: normal;
        }
        .author-bottom  p:nth-of-type(2)::before{
          content:"\27a5";
          margin-right:10px;
        }
        .btn{
          width: 80%;
          background: #1DA29A;
          margin:15px auto;
          color:#fff;
        }

</style>
