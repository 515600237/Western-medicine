<template>
          <div class="table-container">
            <slot name="title"></slot>
            <header v-if="true">
            </header>
            <slot name="header"></slot>

            <div class="table-content" >
              <div class="box-left">
                 <p  class="left" v-for="(item) of list">{{item}}</p>
              </div>
                <div class="box-right">
                   <p  class="right" v-for="(val) of items">{{val}}开始结束开具爱三道岭as看的安赛况囧大龙啊撒旦as单东狂发三菱扥就sdk
                   冬季风铃奥赛东狂发三矿扥赛季发赛风东街东肯东机盖锁肯
                   </p>
                </div>

            </div>
          </div>
</template>

<script>
    export default {
        name: "table-list",
        props:{
            flag:{
                type:Boolean,
                default:false
            },
            items:{
                type:[Array,Object],
                default:function(){
                    return []
                }
            },
            list:{
                type:[Array,Object],
            }
        },
        data(){
            return {
                table:[
                    {
                        key:"科室",
                        value:"住院"
                    },
                    {
                        key:"就诊方式",
                        value:"门诊"
                    },
                    {
                      key:"病种",
                        value:"糖尿病"
                    },
                    {
                        key:"就诊时间",
                        value:"2019-08-12"
                    },
                    {
                        key:"是否全程管理",
                        value:"是",
                    },
                    {
                      key:"书写大病历",
                        value:"否"
                    },
                    {
                        key:"病历号",
                        value:"123"

                    }

                ]
            }
        }

    }
</script>

<style scoped>
    .table-content{
              width:100%;
              background:#fff;
              display: flex;
              font-size:12px;
              overflow: hidden;
    }
    .box-left{
      width:30%;
      display: flex;
      flex-direction: column;
      flex-grow: 2;
    }
    .box-right{
      width:70%;
      display: flex;
      flex-direction: column;

      position: relative;
    }
    .box-right:after{
      content:"";
      width:1px;
      position: absolute;
      top:0;
      left:0;
      display: block;
      height:100%;
      background:red;
    }
    p{
      border-bottom:1px solid red;
      min-height:2.5rem;
      display: flex;
      flex-wrap: wrap;

      align-items: center;
      justify-content: center;
    }
 /* .table-content span:nth-of-type(1){
           width:30%
  }
    .table-content span:nth-of-type(2){
      width:70%;
      min-height:2.5rem;
    }*/
  /*  .table-content span:nth-of-type(2)::before{
      content: "";
      width:0;
      height:100%;
      display: flex;

      background:red;
      position: absolute;
     !* display: block;*!
      box-sizing: border-box;
      border:1px solid blue;
    }*/
</style>
