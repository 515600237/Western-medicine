<template>
  <div class="wrapper">
    <!--标题-->
    <van-nav-bar
      title="完善信息"
      left-text="返回"
      right-text="保存"
      left-arrow
      @click-left="goPage()"
      @click-right="savePage()"
      class="titSaveBtn"
    />
    <!--标签页-->
    <div class="tabbar addRoleBox">
      <!-- 基本信息 -->
      <van-cell-group>
        <van-field v-model.trim="userInfo.userName"
                   label="姓名"
                   readonly="readonly"
                   input-align="right">

        </van-field>
      </van-cell-group>
      <van-cell-group>
        <van-field
          v-model.trim="userInfo.phone"
          label="手机"
          readonly="readonly"
          input-align="right">
        </van-field>
      </van-cell-group>

      <van-cell-group>
        <van-field
          v-model.trim="userInfo.idCard"
          clearable
          @change="cardChange()"
          label="身份证号码"
          placeholder="请输入身份证号码"
          @blur="isCard"
        />
      </van-cell-group>

      <!--性别 男 女-->
      <van-cell-group class="labelTab">
        <van-row type="flex" justify="space-between">
          <van-col span="14" class="text-left">性别</van-col>
          <van-col span="10" class="text-right">
            <van-tabs v-model="unitActive" type="card" style="margin-right：0;"
                      @click="tabClick">
              <van-tab title="男"></van-tab>
              <van-tab title="女"></van-tab>
            </van-tabs>
          </van-col>
        </van-row>
      </van-cell-group>

      <!--出生日期-->
      <van-cell-group>
        <van-field
          v-model.trim="userInfo.birthday"
          is-link
          placeholder="请选择"
          label="出生日期"
          readonly="readonly"
          input-align="right"
          @click="brithdayDate()"
        ></van-field>
        <van-popup v-model="timeFlag1"
                   position="bottom"
                   :overlay="true"
        >
          <van-datetime-picker
            v-model="currentDate1"
            title="选择出生日期"
            type="date"
            :min-date="minDate"
            :max-date="maxDate"
            @cancel="onCancel"
            @confirm="TimeConfirm1"
            :formatter="formatter"
          />
        </van-popup>
      </van-cell-group>


      <!--技术职务-->
      <van-cell-group>
        <van-field
          v-model.trim="userInfo.job"
          is-link
          placeholder="请选择"
          label="技术职务"
          readonly="readonly"
          input-align="right"
          @click="TechnicalClick"
        ></van-field>

        <van-popup v-model="TechnicalShow"
                   position="bottom"
                   close-on-click-overlay :overlay="true">
          <van-picker
            show-toolbar
            title="技术职务"
            :columns="jobList"
            @cancel="onCancel"
            @confirm="TechnicalConfirm"
          />
        </van-popup>
      </van-cell-group>

      <!--科室-->
      <van-cell-group>
        <van-field
          v-model.trim="userInfo.departmentName"
          is-link
          placeholder="请选择"
          label="所在科室"
          readonly="readonly"
          input-align="right"
          @click="departmentNameHandleClick"
        ></van-field>

        <van-popup v-model="standardListShow"
                   position="bottom"
                   close-on-click-overlay
                   :overlay="true"
        >
          <van-picker
            show-toolbar
            title="选择科室"
            value-key="name"
            :columns="derpartList"
            @cancel="onCancel"
            @confirm="departmentNameConfirm"
          />
        </van-popup>
      </van-cell-group>


      <!--带教年限-->
      <van-cell-group>
        <van-field
          v-model.trim="userInfo.teachYear"
          is-link
          placeholder="请选择"
          label="带教年限"
          readonly="readonly"
          input-align="right"
          @click="teachYearClick"
        ></van-field>

        <van-popup v-model="teachYearShow" position="bottom" close-on-click-overlay :overlay="true">
          <van-picker
            show-toolbar
            title="带教年限"
            value-key="name"
            :columns="teachYearList"
            @cancel="onCancel"
            @confirm="teachYearFirm"
          />
        </van-popup>
      </van-cell-group>

      <van-cell-group>
        <van-field
          v-model.trim="userInfo.email"
          clearable
          label="电子邮箱"
          @blur="emailBlur()"
          placeholder="请输入电子邮箱"
        />
      </van-cell-group>

    </div>
  </div>
</template>

<script>
    export default {
        name: "teacherPerfectInfo",
        data() {
            return {

                loadingFlag:false,
                /* sexIndex:-1,*/
                // 出生日期最大时间，最小时间
                minDate: new Date(1900,0,1),
                maxDate: new Date(),
                //用户ID 必传参数
                userInfo: {
                    userId: this.Global.userInfo.userId,
                    userName: "",
                    phone: "",
                    sex:"",
                    //身份证号
                    idCard: "",
                    //邮箱
                    email: "",
                    //出生日期
                    birthday:"",
                    //专业
                    majorId:0,
                    majorName:"",
                    //工作
                    job:"",
                    //带教年限
                    teachYear: "",
                    //详情ID
                    detailId: 0,
                    //科室
                    departmentName:"",
                },
                // 前一个页面类型  =1 首页  =2 设置页面
                preType: 1,
                // 基本信息
                // 科室弹窗
                derpartList: [],
                //专业
                majorShow: false,
                majorList: [],
                //带教年限
                teachYearShow: false,
                teachYearList: [],
                //技术职务
                TechnicalList:[],
                jobList:[],
                TechnicalShow: false,
                //所在科室弹窗
                standardListShow:false,
                // 协同单位
                unitActive: -1,//1表示女
                unitPopFlag: false,
                // 开始时间选择1 结束时间选择
                timeFlag1: false,
                currentDate1: new Date(),
                // 指导医师
                teacherName: "",
                teacherPhone: "",
                showKeyboard: false,
                keyboard: "teacherPhone",
            };
        },
        created() {
            this.preType = this.$route.params.type;
            //带教年限
            this.teachYearList = [];
            for(var i=0;i< 50;i++){
                this.teachYearList.push( i+1+"年");
            }

            //获取标准科室列表
            this.getDeptlist();
        },
        mounted() {
            //基本信息(姓名，手机号);
            this.userDetailInfo();
            //专业;
            /*  this.getMajors();*/
            //技术职务
            this.getTypeList();
        },
        methods: {

            //获取标准科室信息
            getDeptlist() {
                const url = this.api.getStandardList;
                this.utils.ajax({
                    url: url,
                    method: "POST",
                    success: (res) => {

                        if(res.code == 0){
                            this.derpartList = res.data;
                        }
                    }
                });
            },
            // 页面跳转
            goPage() {
                if (this.preType == 2) {
                    // this.$store.dispatch("setNewNum",1);
                    this.$router.push({name: "teacherSet"});
                } else {
                    this.$router.push({name: "teacherHomeindex"});
                }
            },
            savePage() {
                this.loadingFlag = !this.loadingFlag;
                setTimeout(()=>{
                    this.loadingFlag = !this.loadingFlag;
                    this.isSaveAll();
                },500)
            },
            //身份证号
            isCard() {
                let reg = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/;
                if (!reg.test(this.userInfo.idCard)) {
                    this.$toast("身份证输入不正确,请重新输入");
                    return;
                }
            },
            //出生日期
            brithdayDate() {
                this.timeFlag1= true;
                let birthdayDate = Date.parse(this.userInfo.birthday);
                let currentDate = Date.parse(new Date());
                if (birthdayDate >= currentDate) {
                    this.$toast("出生日期不能超过今天");
                    this.userInfo.birthday = new Date().toLocaleDateString();
                    return;
                }
            },
            cardChange(){
                let  birthday = "";
                if(this.userInfo.idCard!= null && this.userInfo.idCard!= ""){
                    if(this.userInfo.idCard.length == 15){
                        birthday = "19"+this.userInfo.idCard.slice(6,12);
                    } else if(this.userInfo.idCard.length == 18){
                        birthday = this.userInfo.idCard.slice(6,14);
                    }
                    birthday = birthday.replace(/(.{4})(.{2})/,"$1-$2-");
                    //通过正则表达式来指定输出格式为:1990-01-01
                }
                let sexSel = this.userInfo.idCard.substring(16,17);

                if(sexSel % 2 != 0){
                    this.unitActive = 0;
                    this.userInfo.sex = "男";
                }else{
                    this.unitActive = 1;
                    this.userInfo.sex = "女";
                }
                this.userInfo.birthday = birthday;
            },
            TimeConfirm1(value) {
                this.userInfo.birthday = new Date(value).toLocaleDateString().replace(/\//g,"-");
                this.timeFlag1 = false;
            },
            formatter(type, value) {
                if (type === "year") {
                    return `${value}年`;
                } else if (type === "month") {
                    return `${value}月`;
                } else if (type === "day") {
                    return `${value}日`;
                }
                return value;
            },
            // 专业
            majorClick() {
                this.majorShow = !this.majorShow;
            },
            /*专业确认*/
            majorFirm(value, index) {
                this.majorShow = false;
                this.userInfo.majorName = value.name;
                this.userInfo.majorId = index;
            },
            /****时间change事件****/
            timeChangeConfrim(e) {
                let timearr = e.getValues();

                this.userInfo.birthday = `${timearr[0]}${timearr[1]}${timearr[2]}`;

            },
            //技术职务
            TechnicalClick(){
                this.TechnicalShow = !this.TechnicalShow
            },
            TechnicalConfirm(value,index){
                this.TechnicalShow = false;
                this.userInfo.job = value;
            },
            //所在科室
            departmentNameHandleClick() {
                this.standardListShow = true;
            },
            // 科室确认
            departmentNameConfirm(value) {
                this.standardListShow = false;
                this.userInfo.departmentName = value.name;
                this.userInfo.departmentId = value.id;
            },
            //带教年限
            teachYearClick() {
                this.teachYearShow = !this.teachYearShow;

            },
            teachYearFirm(value) {
                this.teachYearShow = false;
                this.userInfo.teachYear = value;
            },
            //电子邮箱
            emailBlur(){
                let emailReg = new RegExp("^[a-zA-Z0-9]+([._\\-]*[a-zA-Z0-9])*@([a-zA-Z0-9]+[-a-zA-Z0-9]*[a-zA-Z0-9]+.){1,63}[a-zA-Z0-9]+$");
                if(!emailReg.test(this.userInfo.email)){
                    this.$toast("电子邮箱不正确，请重新输入");
                    return;
                }

            },
            // 性别选择tab
            tabClick(index, title) {
                this.unitActive = index;
                if ( this.unitActive  == 0) {
                    this.userInfo.sex = "男"
                } else {
                    this.userInfo.sex = "女"
                }
            },
            //取消弹窗
            onCancel() {
                this.standardListShow = false;
                this.majorShow = false;
                this.TechnicalShow = false;
                this.teachYearShow = false;
                this.unitPopFlag = false;
                this.timeFlag1 = false;
            },

            /****点击保存提示****/
            isSaveAll() {
                if(!this.userInfo.idCard){
                    this.$toast("请填写身份证号");
                    return;
                }
                let reg = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/;
                if (!reg.test(this.userInfo.idCard)) {
                    this.$toast("身份证输入不正确,请重新输入");
                    return;
                }
                if(!this.userInfo.birthday){
                    this.$toast("请填写出生日期");
                    return;
                }
                if(!this.userInfo.job){
                    this.$toast("请填写技术职务");
                    return;
                }
                if(!this.userInfo.teachYear) {
                    this.$toast("请填写带教年限");
                    return;
                }
                if(!this.userInfo.email){
                    this.$toast("请填写电子邮箱");
                    return;
                }
                let emailReg = new RegExp("^[a-zA-Z0-9]+([._\\-]*[a-zA-Z0-9])*@([a-zA-Z0-9]+[-a-zA-Z0-9]*[a-zA-Z0-9]+.){1,63}[a-zA-Z0-9]+$");
                if(!emailReg.test(this.userInfo.email)){
                    this.$toast("电子邮箱不正确，请重新输入");
                    return;
                }
                this.saveUserInfo();
            },
            /*********数据请求*******/
            //基本信息(姓名，手机号等)
            userDetailInfo() {
                const url = this.api.userDetailInfo;//请求路径
                const postJson = {
                    "userId": this.Global.userInfo.userId,       //必传参数
                };
                this.utils.ajax({
                    url: url,
                    method: "POST",
                    data: postJson,
                    success: (res) => {
                        if (res.code == 0) {
                            this.userInfo = Object.assign({}, this.userInfo, res.result);
                            if(this.userInfo.sex=="女"){
                                this.unitActive = 1;
                            }else{
                                this.unitActive = 0;
                            }
                        }
                    }
                })
            },
            //保存
            saveUserInfo() {
                const url = this.api.saveuserInfo;//请求路径
                this.utils.ajax({
                    url: url,
                    method: "POST",
                    data: this.userInfo,
                    success: res => {
                        if (res.code == 0) {
                            this.$toast("保存成功");
                            //完善信息修改科室后，将当前科室置为修改后的科室
                            this.Global.userInfo.standardDepartmentId = this.userInfo.departmentId;
                            this.goPage("teacherHomeindex");
                        }
                    }
                })
            },
            //技术职务
            getTypeList(){
                const url = this.api.getTypeList;
                const postJson ={
                    type:"JOB"
                };
                this.utils.ajax({
                    url:url,
                    method:"POST",
                    data:postJson,
                    success:res=>{

                        this.TechnicalList = res.data;
                        this.TechnicalList.forEach((item)=>{
                            this.jobList.push(item.name)
                        })
                    }
                })
            },

        },

    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .wrapper /deep/ .van-picker__cancel{
    color:#1DA29A;
  }
  .wrapper /deep/ .van-picker__confirm{
    color:#1DA29A;
  }
  .wrapper /deep/ .van-icon{
    color:#1DA29A;
  }
  .wrapper /deep/ .van-nav-bar__right{
    background:#1DA29A;
  }
  .wrapper /deep/ .van-nav-bar__text{
    color:#1DA29A;
  }
  .wrapper /deep/.van-icon{
    color:#1DA29A;
  }
  .wrapper /deep/  .van-nav-bar__right .van-nav-bar__text{
    color:#fff;
  }
  .wrapper {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: #f5f5f5;
  }

  .addRoleBox {
    margin-top: 15px;
  }

  .labelTab {
    padding: 10px 15px;
    font-size: 14px;
  }

  .labelTab /deep/ .van-tabs__nav {
    margin-right: 0;
  }

  .wrapper /deep/ .van-field__label {
    max-width: 150px;
  }

  .wrapper /deep/ .van-cell {
    text-align: left;
  }

  .wrapper /deep/ .van-cell span {
    font-size: 14px;
  }

  .wrapper /deep/ .van-hairline--surround {
    height: 0;
  }

  .wrapper /deep/ .van-password-input {
    margin: 0 auto;
  }

  .wrapper /deep/ .van-field__control {
    text-align: right;
  }

  .tabs_card {
    width: 100%;
    height: 80px;
    margin-top: 15px;
  }

  .tab_content {
    width: 100%;
    margin-top: 15px;
  }

  .promise {
    height: 40px;
    line-height: 40px;
    margin-top: 5px;
    font-size: 12px;
    color: #999999;
  }

  .defaultNone {
    display: block;
  }

  .add {
    display: flex;
    float: right;
    align-items: flex-end;
    font-size: 12px;
    text-align: right;
    margin-right: 24px;
    padding-top: 10px;
    box-sizing: border-box;
  }

  .add .add-icon {
    font-size: 18px;
  }

  .add span {
    margin-left: 5px;
  }





</style>
