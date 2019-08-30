<template>
  <div  :class="[loseImg]" >
    <slot name="top"/>
    <div :class="[box,cname]" >
      <img :src="img" alt="">
      <div class="text">
        <slot name="bottom"/>
      </div>
    </div>

  </div>

</template>

<script>
    export default {
        name: "demo",
        inheritAttrs:false,
        props:{
            cname:{
                type:String,
                default:'',
            },
            img:{
                type:String,
                default :require('../assets/image/defalutRotate.png')
            },
            /*  styleObj:{
                  type:Object,
                  default:{'background':'#f2f2f2','width':'100%','height':'100%','border':'300px,solid,#ccc'}
              }*/

        },
        data(){
            return {
                loseImg:'lose',
                box:'box',
            }
        },
    }
</script>


<style scoped>
  .lose{
    width:100%;
    height:100%;
    position: relative;
  }
  .box{
    width:200px;
    height:150px;
    position:absolute;
    top:0;
    left:0;
    right:0;
    bottom:0;
    margin:auto;
    font-size:18px;
    color:#ccc;
  }

  .box img{
    width:100%;
    height:inherit;
  }
  .text{
    margin-top:-10px;
  }
</style>
