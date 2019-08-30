<template>
  <div class="wrapper">
    <!--标题栏-->
    <van-nav-bar
      :title="title"
      left-text="返回"
      @click-left="onClickLeft"
      left-arrow
      class="office"
    />
    <!--标签页tab-->
    <van-tabs type="card"
              class="tabCard"
              v-model="activeTab"
              @change="tabChange"
    >
      <van-tab
        :title="item.dataTypeName + item.showNum"
        v-for="(item,index) of  typeList"
        :key="index">
      </van-tab>
    </van-tabs>

    <div class="contentBox">
      <!--病种-->
      <ul class="tab-content" v-show="activeTab==0&&deaseContentList.length>0">
        <li class="box titleLi">
          <span class="pox">病种</span>
          <span>最低例数</span>
          <span>完成例数</span>
        </li>
        <div class="tab-content1">
          <van-list
            v-model="loading"
            :finished="finished"
            :offset="30"
            :error.sync="error"
            error-text="请求失败"
            :finished-text="text"
            @load="onLoad"
          >
            <li class="box"
                :class="{highlight:item.minCaseNum > item.completedCaseNum}"
                v-for="(item,index) of deaseContentList" :key="index">
              <span class="pox">{{item.dataName}}</span>
              <span>{{item.minCaseNum}}</span>
              <span>{{item.completedCaseNum}}</span>
            </li>
          </van-list>
        </div>

      </ul>
      <defaultgraph  cname="graph"  v-if="activeTab==0&&deaseContentList.length == 0 || activeTab==1&&skillContentList.length == 0 || activeTab==2&&operationContentList.length ==0">
        <template slot="bottom" >
          暂无信息
        </template>
      </defaultgraph>
      <!--技能-->
      <ul class="tab-content" v-show="activeTab==1&&skillContentList.length>0">
        <li class="box titleLi">
          <span class="pox">临床技能操作</span>
          <span>最低例数</span>
          <span>完成例数</span>
        </li>
        <div class="tab-content1">
          <van-list
            v-model="loading1"
            :finished="finished1"
            :offset="30"
            :error.sync="error1"
            error-text="请求失败"
            :finished-text="text1"
            @load="onLoad1"
          >
            <li class="box"
                :class="{highlight:item.minCaseNum > item.completedCaseNum}"
                v-for="(item,index) of skillContentList"
                :key="index">
              <span class="pox">{{item.dataName}}</span>
              <span>{{item.minCaseNum}}</span>
              <span>{{item.completedCaseNum}}</span>
            </li>
          </van-list>
        </div>
      </ul>
      <!--手术-->
      <ul class="tab-content" v-show="activeTab==2&& operationContentList.length >0">
        <li class="box titleLi">
          <span class="pox">手术</span>
          <span>最低例数</span>
          <span>完成例数</span>
        </li>
        <div class="tab-content1">
          <van-list
            v-model="loading2"
            :finished="finished2"
            :offset="30"
            :error.sync="error2"
            error-text="请求失败"
            :finished-text="text2"
            @load="onLoad2"
          >
            <li class="box"
                :class="{highlight:item.minCaseNum > item.completedCaseNum}"
                v-for="(item,index) of operationContentList" :key="index">
              <span class="pox">{{item.dataName}}</span>
              <span>{{item.minCaseNum}}</span>
              <span>{{item.completedCaseNum}}</span>
            </li>
          </van-list>
        </div>
      </ul>
    </div>

  </div>
</template>

<script>

  import DefaultGraph from '@/components/DefaultGraph.vue'
    export default {
        name: "staticDetail",
        components:{
            defaultgraph:DefaultGraph,
        },
        data() {
            return {
                text:'',
                text1:'',
                text2:'',
                page:1,
                page1:1,
                page2:1,
                loading:false,
                finished:false,
                error:false,//病种
                finished1:false,
                loading1:false,
                error1:false,//技能
                finished2:false,
                loading2:false,
                error2:false,//手术
                pageType:0, /*指导老师，根据此类型跳转首页或者统计首页*/
                activeTab: 0,
                card:[],
                tabs: [],
                content: [],
                result: [],
                title:"",
                departmentId: null,
                studentName: "",
                deaseContentList: [],
                skillContentList: [],
                operationContentList: [],
                itemData:{},
                typeList:[
                    {
                        id: 1,
                        dataTypeName: "病种",
                        showNum: "(0/0)",
                    },
                    {
                        id: 2,
                        dataTypeName: "临床技能操作",
                        showNum: "(0/0)",
                    },
                    {
                        id: 3,
                        dataTypeName: "手术",
                        showNum: "(0/0)",
                    }
                ],
                data:{},
                flag:{
                    0:true,
                    1:true,
                    2:true,
                }

            };
        },

        methods: {
            /*默认病种*/
            onLoad(){
                this.getInfoList(1).then(res => {
                    this.deaseContentList = this.deaseContentList.concat(res.data.result);
                    if( this.deaseContentList.length>=20 && this.deaseContentList.length == res.data.count){
                        this.text = "没有更多了";
                    }
                });
            },
            /*技能*/
            onLoad1() {
                this.getInfoList(2).then(res => {
                    this.skillContentList = this.skillContentList.concat(res.data.result)
                    if( this.skillContentList.length>=20 &&this.skillContentList.length == res.data.count){
                        this.text1 = "没有更多了";
                    }
                });
            },
            /*手术*/
            onLoad2() {
                this.getInfoList(3).then(res => {
                    this.operationContentList = this.operationContentList.concat(res.data.result);
                    if( this.operationContentList.length>=20 &&this.operationContentList.length == res.data.count){
                        this.text2 = "没有更多了";
                    }
                });
            },
            tabChange(name,title){
                switch(name){
                    case 1:
                        this.error = false;
                        this.error1 = false;
                        this.error2 = false;
                        if(this.flag[0]){
                            this.onLoad1();
                            this.flag[0] = false;
                        }
                        break;
                    case 2:
                        this.error = false;
                        this.error1 = false;
                        this.error2 = false;
                        if(this.flag[1]){
                            this.onLoad2();
                            this.flag[1] = false;
                        }
                        break;
                }
            },
            onClickLeft() {
                /*返回键*/
                this.$router.go(-1);
            },
            /**************数据请求*****************/
            getInfoList(type) {
                return new Promise((resolve, reject) => {
                    let url = this.api.medicalInfo;
                    const postJson = {
                        departmentId: this.itemData.departmentId,
                        pageIndex: 1,
                        pageSize: 14,
                        dataType: type
                    };
                    switch(type){
                        case 1:
                            this.loading = true;
                            postJson.pageIndex = this.page;
                            break;
                        case 2:
                            postJson.pageIndex = this.page1;
                            this.loading1 = true;
                            break;
                        case 3:
                            postJson.pageIndex = this.page2;
                            this.loading2 = true;
                            break;
                    }

                    if (this.Global.userType == 3) {
                        postJson.studentId = this.itemData.studentId;
                        url =  this.api.medicalInfoByStudent;
                        if(!this.itemData.departmentId || !this.itemData.studentId){
                            return;
                        }
                    }
                    this.utils.ajax({
                        url: url,
                        method: "POST",
                        data: postJson,
                        success: res => {
                            if(!res.success){
                                switch(type){
                                    case 1:
                                        this.error = true;
                                        break;
                                    case 2:
                                        this.error1 = true;
                                        break;
                                    case 3:
                                        this.error2 = true;
                                        break;
                                }
                                this.$toast(res.msg);
                            }
                            if (res.code == 0 && res.data) {
                                resolve(res);
                                switch(type){
                                    case 1:
                                        this.loading = false;
                                        this.page = res.data.page + 1;
                                        break;
                                    case 2:
                                        this.loading1 = false;
                                        this.page1 = res.data.page + 1;
                                        break;
                                    case 3:
                                        this.loading2 = false;
                                        this.page2 = res.data.page + 1;
                                        break;
                                }
                                if (res.data.page === res.data.totalPage || res.data.totalPage == 0) {
                                    switch(type){
                                        case 1:
                                            this.finished = true;
                                            break;
                                        case 2:
                                            this.finished1 = true;
                                            break;
                                        case 3:
                                            this.finished2 = true;
                                            break;
                                    }
                                }
                            }




                        }
                    });
                });
            },
            recordStatisticsOfSchedule(){
                let url = this.api.recordStatisticsOfSchedule + "/"+this.itemData.id;
                // ==3 指导医师 获取学生轮转id
                if(this.Global.userType==3){
                    url = this.api.recordStatisticsOfSchedule + "/"+ this.itemData.rotationScheduleId || this.itemData.rotationScheduleId;
                }
                this.utils.ajax({
                    url:url,
                    method:"POST",
                    success:res=>{
                        if(res.code == 0){
                            if(res.data && res.data.studentRecordStatisticsPerTypeVOList && res.data.studentRecordStatisticsPerTypeVOList.length){
                                this.typeList = res.data.studentRecordStatisticsPerTypeVOList;
                                console.table(this.typeList)
                                this.typeList = this.typeList.map(item => {
                                    if( item.dataType == 2){
                                        item.dataTypeName = "临床技能操作";
                                    }
                                    return {
                                        ...item,
                                        showNum: " (" + item.passNum + "/" + item.requireRecordNum + ")"
                                    };
                                });
                            }
                        }else{
                            this.$toast(res.msg);
                        }
                    }
                })
            }
        },
        created(){
            this.itemData = this.$route.params.itemData || this.$route.params.data;
            /**/
            this.pageType = this.$route.params.type
            // 指导医师
            if (this.Global.userType == 3){
                this.title= this.itemData.studentName;
            }
            if (this.Global.userType == 4){
                this.title= this.itemData.departmentName +"轮转详情";
            }
            this.recordStatisticsOfSchedule();
            this.onLoad();
        },

    };
</script>

<style scoped>
  .wrapper >>> .graph{
    position: absolute;
    top:-100px;
    width:120px;
    height:100px;
  }
  .wrapper /deep/ .van-tabs__nav--card .van-tab{
    min-width:18%;
    font-size:12px;
  }
  .wrapper /deep/ .van-tabs__nav--card .van-tab:nth-of-type(2){
    min-width:44%;
  }
  .wrapper /deep/ .van-nav-bar__text{
    color:#1DA29A;

  }
  .wrapper /deep/ .van-icon-arrow-left{
    color:#1DA29A;
  }
  .contentBox {
    position: absolute;
    top: 98px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
  }
  .titleLi{
    background-color: #F2F2F2;
  }
  .office {
    width: 100%;
    height: 2.875rem;
    position: absolute;
    left: 0;
    top: 0;
  }
  .tabCard {
    width: 100%;
    margin-top: 10px;
    position: absolute;
    top: 2.875rem;
    left: 0;
    bottom: 0;
    color: #666666;
  }
  .box:nth-of-type(1) {
    border-top: 1px solid #e4e4e4;
  }
  .tab-content li {
    display: flex;
    width: 100%;
    text-align: left;
    line-height: 40px;
    font-size: 12px;
    border-bottom: 1px solid #e4e4e4;
  }
  .tab-content .pox {
    flex-shrink:0;
    width: 60%;
    text-align: center;
  }
  .tab-content span {
    flex-shrink:0;
    width: 20%;
    text-align: center;
    border-left: 1px solid #e4e4e4;
  }
  /*滚动*/
  .tab-content1 {
    position: absolute;
    left: 0;
    right: 0;
    top: 41px;
    bottom: 0;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
  }
  /*完成例数低于最低例数的时候高亮显示*/
  .highlight{
    background:lightgoldenrodyellow;
    color:#F04844;
  }
</style>
