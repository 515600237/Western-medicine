<template>
            <div class="wrapper">
                <van-nav-bar
                        title="新闻资讯"
                        left-text="返回"
                        left-arrow
                        @click-left="onClickLeft"
                        class="newsHeader greenLg"
                />
                <div class="newsSection">
                    <div class="newsTitle disFlex" >
                        <h1 v-text="title" class="largeTitle"></h1>
                        <div class="textInfo">
                            <p><span class="wordSpace">时间：</span><span>{{currentDate}}</span></p>
                            <p><span class="wordSpace">來源：</span><span>{{author}}</span></p>
                            <p class="wordSpace">作者：<span>{{userName}}</span></p>
                            <p>通讯员：<span></span></p>
                        </div>

                    </div>
                    <div class="msgNewsContent msgHtmlBox" v-html="this.contentHtml"></div>
                </div>
            </div>
</template>

<script>
    export default {
        name: "newInformation",
        data(){
            return {
                contentId:0,
                content:{},
                contentHtml:"",
                userName:"",
                author:"",
                title:"",
                currentDate:''
            }
        },
        methods:{
            swipeDetail(contentId){
                    const url = this.api.swiperDetail+ contentId ;
                    this.utils.ajax({
                        url:url,
                        method:"POST",
                        success:res=>{
                            this.content = Object.assign({},this.content,res.data);
                                this.contentHtml = this.content.html_content
                                this.title = this.content.news_title;
                                this.userName = this.content.user_name;
                                this.author = this.content.author;
                                this.currentDate = new Date(this.content.release_date).toLocaleString('chinese',{hour12:false}).replace(/:d{1,2}$/,' ');
                        }
                    })
            },
            onClickLeft(){
                this.$router.back(-1);
            },
        },
        computed:{
            getDate(){
            },
        },
        created(){

        },
        mounted(){
            this.contentId = this.$route.query.contentId;
            this.swipeDetail(this.contentId)
        },
        beforeRouteLeave(to, from, next) {
            // 设置下一个路由的 meta
            to.meta.keepAlive = true;
            next();
        }
    }
</script>

<style scoped>
    .wrapper /deep/ .van-nav-bar__text{
        color:#1DA29A;
    }
    .wrapper /deep/ .van-icon-arrow-left{
        color:#1DA29A;
    }
    .wrapper{
        position: absolute;
        left:0;
        right:0;
        bottom:0;
        top:0;
        background:#fff;
        flex-direction: column;

    }
    .newsSection{
        position: absolute;
        top: 46px;
        left:0;
        bottom:0;
        right:0;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
        padding:0 19px;
    }
        .newsTitle{
            width:100%;
            height:160px;
            flex-direction: column;
            justify-content: space-around;  /* 主轴方向 */
            border-bottom:1px solid #ccc;
        }
        .msgNewsContent{
            width:100%;
            overflow-x: hidden;
            padding-bottom: 30px;
        }
        .msgHtmlBox >>> img{
            width:100%;
        }
        .msgHtmlBox >>> p{
            text-align: left;
            font-size:1rem !important;
        }
        .newsTitle .largeTitle{
          color:black;
        }
        .textInfo{
            width:100%;
            text-align: left;
            font-size:12px;
            color:#666;
            margin-bottom:5px;
        }
        .wordSpace{
            letter-spacing: 6px;
        }
</style>