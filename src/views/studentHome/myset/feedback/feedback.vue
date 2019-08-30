<template>
  <div class="feedback">
    <!--标题栏-->
    <van-nav-bar
      title="意见反馈"
      left-text="返回"
      left-arrow
      class="office"
      @click-left="goPage"
    />
    <!--内容区-->
    <van-cell-group>
      <van-field v-model="value"
                 :placeholder="placeholderContent"
                 maxlength="30"
                 class="title"
                 v-if="false"
      />
    </van-cell-group>
    <form class="form">
      <textarea
        class="textArea"
        v-model="textarea"
        maxlength="200"
        @input="descArea()"
        :placeholder="placeholderContent"
      ></textarea>
      <p class="pay-service-textarea-text">
        <span>{{remnant}}</span>/200
      </p>
    </form>
    <van-cell-group>
      <van-field v-model="value"
                 :placeholder="placeholder"
                 maxlength="11"
                 class="title"
                 type="number"
      />
    </van-cell-group>
    <button class="handleSubmit" @click="handleSubmit">提交</button>
  </div>
</template>

<script>
  export default {
    name: "feedback",
    data() {
      return {
        value: "",//标题
        textarea: "",//内容
        remnant: 0,//字数限制
        placeholder:"请填写您的联系电话，方便我们联系您反馈",
        placeholderContent:'告诉我们您的建议或遇到的问题，我们将为您不断改进...'
      };
    },
    methods: {

      /**********************数据请求*********************************/
      suggestion(){
        const url = this.api.suggestion;
        let postJson = {
          phone:this.value,
          remark:this.textarea,
        };
        this.utils.ajax({
          url:url,
          method:"POST",
          data:postJson,
          success:(res)=>{
            if(res.code==0){
              this.$toast({
                duration:500,
                message:'提交成功'
              });
              setTimeout(()=>{
                this.$router.go(-1);
              },500)
            }
          }
        })
      },


      goPage() {
        if(this.Global.userType==4){
          this.$router.push({ name: 'mySet' });
        }else{
          this.$router.push({ name: 'teacherSet' });
        }

      },
      descArea() {
        let txtVal = this.textarea.length;
        this.remnant = txtVal;
      },
      /*提交#校验*/
      handleSubmit() {
        if (!this.value && !this.textarea) {
          this.$toast("请填写内容");
          return;
        }
        /*手机号校验*/
        let reg = /^[1][3,4,5,7,8][0-9]{9}$/;
        if(this.value&&!reg.test(this.value)){
          this.$toast("手机号不正确");
          return false;
        }
        if (!this.value) {
          this.$toast("请填写您的联系电话");
          return;
        }

        if(!this.textarea){
          this.$toast("请填写内容");
          return;
        }
        /*数据请求*/
        this.suggestion()

      }
    },
    mounted(){

    }
  };
</script>

<style scoped>
  .form{
    margin:12px 0;
  }
  .feedback {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: #f2f2f2;
  }

  .title {
    margin: 10px 0 5px;
  }

  .textArea {
    width: 100%;
    height: 240px;
    border: 1px solid #ccc;
    padding:10px 0;
    font-size: 0.875rem;
    text-indent: 0.935rem;
  }
  .textArea::-webkit-input-placeholder{
      text-indent: 18px;
  }
  .textArea::-moz-placeholder{
      text-indent: 18px;
  }
  .pay-service-textarea-text {
    text-align: right;
    position:absolute;
    right:25px;
    top:calc(220px + 2.875rem);
    font-size:0.9rem;
  }

  .handleSubmit {
    border-radius: 20px;
    height: 40px;
    margin-top: 15px;
    border: none;
    width: 95%;
    background: #1da29a;
    color: #fff;
    font-size: 14px;
  }
</style>