<template>
    <div :class="[container,cname]">
      <van-icon name="calender-o"  class="icon"/>
      <p>提交时间:{{msg}}</p>
      <p v-if="flag">|<span :style="styleObj">【{{auditStatus}}】</span></p>
      <div class="btn" v-if="type" :class="sub">
        <slot name="icon"></slot>
        <van-icon name="success"  class="success" v-if="sub"/>
        审核
      </div>
    </div>


</template>

<script>
  export default {
    name: "demo",
      props:{
        msg:{
            type:String,
            default:"2018-12-21 14:22:25"
        },
        auditStatus:{
            type:String,
        },
        flag:{
            type:Boolean,
            default:true,
        },
          type:{
            type:Boolean,
              default:true,
          },
          sub:{
            type:String,
          },
          styleObj:{
            type:Object,
            default:function(){
                return {color:'#FE9400'}
            }
          }
      },
      data(){
        return {
          btn:"btn",
            cname:"cname",
            container:'container'
        }
      },
      created() {
         console.log(this.auditStatus,"545465sdf465asd4f6");
      }
  }
</script>

<style scoped>
         .container{
                  height:36px;
                  background:#666;
                  display:flex;
                  align-items: center;
                  font-size:0.78rem;
                  color:#fff;
                  margin-top:10px;
                /*  margin:10px 8px 0;*/
                  border-top-left-radius:.5rem;
                  border-top-right-radius:.5rem;
                  border-width: 1px;
                  border-style: solid;
                  border-color: rgba(215, 215, 215, 1);
                  box-sizing: border-box;
                  word-break: break-word;
                   white-space: nowrap;
          }
         .icon{
           margin:0 8px 0 5px;
         }
        @media screen and (max-width: 320px) {
          .icon,p{
          transform: scale(.9);
          }
          p:nth-of-type(1){
            margin-left:-8px;
            margin-right:-0.7125rem;
          }
        }
         p:nth-of-type(1){
           text-align: left;
         }
         p:nth-of-type(2){
           text-align: left;
           padding-left:8px;
         }
         p:nth-of-type(2) span{
           padding-left:3px;
         }
        .btn{
          margin-left:auto;
          margin-right:8px;
          text-align: center;
          line-height: 27px;
          border-radius: 2px;
          width:60px;
          height:27px;
          background:#1da29a;
        }
        .success{
              transform: translateY(2px);
        }
        .sub{
          width:70px;
          height:27px;
          line-height: 27px;
           border-radius:.2rem;
          background:skyblue;
        }
</style>
