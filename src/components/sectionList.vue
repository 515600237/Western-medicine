<template>
          <div class="section-list">
                <div v-for="(item,index) of list">
                    <div v-for="(val,idx) of item.name"></div>

                </div>
          </div>
</template>

<script>
  export default {
    name: "showList",
    props:{
      titleList:{
        type:Array,
        default: function () {
          return ['病种','临床操作技能','手术']
        }
      },
      contentList:{
        type:Array,
      }
    },
    inheritAttrs:false,//非props属性不显示在Dom元素上。
    data(){
      return{
        nameList:this.titleList,
        contentList:this.contentList,
        list:[
          {
            type:[1,2,3],
            name:['病种','临床操作技能','手术'],
          },
          {
            minCase:'最低例数',
          },
          {
            maxCase:'完成例数',
          }
        ]
      }
    },
    watch:{
      titleList(newValue){
        this.nameList = newValue;
      },
      contentList(newValue){
        this.contentList = newValue;
      }
    }
  }
</script>

<style scoped>

</style>