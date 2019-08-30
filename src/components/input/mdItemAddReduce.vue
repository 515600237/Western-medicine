 <!-- 新增删除 -->
  <template >
      <div id="addReduceItem">
          <p class="promise">本人承诺信息真实有效，如有不实之处承担全部责任</p>
          <div>
              <div class="add" @click="addList()">
                <van-icon name="add" color="#1DA29A" class="add-icon"/>
                <span>新增</span>
              </div>
              <div class="add reduce" @click="reduceList()" v-if="currentList.length>=2">
                <van-icon name="delete" color="#FF0000" class="add-icon"/>
                <span>删除</span>
              </div>
          </div>
      </div>
  </template>

<script>
export default {
  props: ["currentList"],
  data() {
    return {
      showSelectJson: this.showJson,
      selectDepShow: false,
    };
  },
  created(){
  
  },
  computed:{
      
  },
  methods: {
    addList(){
      this.$emit("addList");
    },
    reduceList(){
      this.$emit("reduceList");
    }
  },
  watch:{
    
  },
  mounted() {}
};
</script>

<style scoped>
.promise {
  width: 160%;
  height: 50px;
  line-height: 50px;
  font-size: 12px;
  color: #999999;
  font-size: 16px;
  transform: scale(0.625);
  transform-origin: 0 0;
}
.add {
  display: flex;
  float: right;
  align-items: flex-end;
  font-size: 12px;
  text-align: right;
  margin-right: 24px;
  color: #1da29a;
  padding-top: 10px;
  box-sizing: border-box;
}
.add .add-icon {
  font-size: 18px;
}
.add span {
  margin-left: 5px;
}
.reduce{
  color: red;
}

</style>

