<template>
  <div>
    <van-popup
      v-model="show"
      position="top"
      class="yearPops"
      overlay-class="overYearbg"
      @click-overlay="hideOvers()"
    >     
      <slot v-bind:yearList="yearList">
        <ul class="yearSeList">
          <li v-for="(item,index) in  yearList"
              :key="index"
              @click="chooseItem(item,index)">
            {{item}}
          </li>
        </ul>
      </slot>
    </van-popup>
  </div>
</template>
<script>
export default {
  name:"selectListPop",
  props: ["yearList"],
  data() {
    return {
      show: true,
      radio: '1',
    };
  },
  methods: {
    hideOvers() {
      this.$emit("hideOverlay", false);
    },

    chooseItem(item,index) {
      this.$emit("chooseItem", item,index);
    }
  },
  mounted() {

  }
};
</script>

<style scoped>
/* 年度选择弹窗 */
.yearPops {
  top: 84px;
}
.overYearbg {
  opacity: 0.5;
}
.icon_more {
  border-width: 8px;
  margin-left: 10px;
  margin-top: 5px;
}
.yearSeList {
  text-align: left;
  text-indent: 20px;
}
.yearSeList li {
  height: 45px;
  line-height: 45px;
  border-bottom: 1px solid #ccc;
}
</style>

