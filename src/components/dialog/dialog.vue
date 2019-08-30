<template>
  <div>
    <div class="popUp">
      <van-dialog
        v-model="show"
        show-cancel-button
        overlay
        :confirm-button-text="buttonRightText"
        :close-on-click-overlay="true"
        :before-close="beforeClose"
        @cancel="onCancel()"
      >
        <div class="headTitle">
          <p class="headText">
            {{auditTitle}}
            <span></span>
          </p>
          <p class="btn">
            <button @click="status = 2" class="btnLeft" :class="{'active':status == 2}">不属实</button>
            <button @click="status = 1" class="btnRight" :class="{'active1':status == 1}">属实</button>
          </p>
        </div>
        <div class="content">
          <textarea
            maxlength="100"
            placeholder="请输入审核意见"
            v-model="textarea"
            class="textWord"
          ></textarea>
          <p class="numberWord">{{remnant}}/100</p>
        </div>
      </van-dialog>
    </div>
  </div>
</template>
<script>
export default {
  name: "dialogPopUp",
  props:["studentNameList","auditType"],
  data() {
    return {
      show: false,
      textarea: "",
      message: "李雷",
      status: -1,
      buttonRightText: "提交",
        msg:'',
    };
  },
  computed:{
    remnant(){
        return this.textarea.length;
    },
    auditTitle(){
        const length = this.studentNameList.length;
        if(this.auditType == 1 && length){
            return "学员 【" + this.studentNameList[0] +"】 上报的此条信息是否属实";
        }
        if(this.auditType == 2 && length){
           let nameList = Array.from( new Set(this.studentNameList) );
           let nameString ="";
           nameList.forEach((item)=>{
               nameString +="【"+item+ "】、";
           })
           nameString = nameString.slice(0,nameString.length -1);
            return "学员"+nameString+"上报的"+ length +"条信息是否属实";
        }
        return "";
    }
  },
  methods: {
    isShowHidePopUp() {
      this.show = !this.show;
    },
    //提交
    beforeClose(action, done) {
      if (this.status == -1 && action == "confirm") {
        this.$toast("请填写是否属实");
        done(false);
        return;
      }
      if (this.status == 2 && !this.textarea) {
        this.$toast({
          className: "redToast",
          message: "请填写不属实原因",
          onClose:()=>{
              this.$toast.resetDefaultOptions();
          }
        });
        done(false);
        return;
      }
      console.log(this.status);
      if(this.status != -1){
         this.$emit("checkAudit", this.textarea, this.status);
      }

      this.textarea = "";
      this.status = -1;
      done();
    },
    onCancel() {
      this.textarea = "";
      this.status = -1;
    }
  },
    created(){
    },
  updated() {
      this.$nextTick(()=>{
          let toast = document.getElementsByClassName('msg')[0]
          if(toast){
              toast.style.backgroundColor='rgb(255,0,0.5)';
          }
      })


  }
};
</script>

<style scoped>
body >>> .redToast{
  background-color: red !important;
}
.headText {
  font-size: 14px;
  margin: 10px;
}
.textWord {
  width: 100%;
  text-indent: 1em;
  padding-top: 10px;
  box-sizing: border-box;
  height: 130px;
  border: 1px solid #ccc;
  font-size: 14px;
}
.numberWord {
  position: absolute;
  top: 180px;
  right: 20px;
  z-index: 9999;
  font-size: 12px;
  color: #ccc;
}
.btn {
  display: flex;
  justify-content: space-around;
  margin: 10px 0;
}
.btn button {
  width: 120px;
  height: 35px;
  font-size: 14px;
  border-radius: 15px;
  border: 1px solid #ccc;
  background: #fff;
}
.btn .btnLeft {
  color: #ff402d;
}
.btn .btnRight {
  color: #1DA29A;
}

::-webkit-input-placeholder {
  /* WebKit browsers */

  text-indent: 1em;
  font-size: 14px;
}
:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */

  text-indent: 1em;
  font-size: 14px;
}
::-moz-placeholder {
  /* Mozilla Firefox 19+ */

  text-indent: 1em;
  font-size: 14px;
}
:-ms-input-placeholder {
  /* Internet Explorer 10+ */

  text-indent: 1em;
  font-size: 14px;
}
.btn .active {
  background: #ff402d;
  color: #fff;
}
.btn .active1 {
  background: #1DA29A;
  color: #fff;
}
.body >>> .van-toast{
  background:red;
}
</style>
