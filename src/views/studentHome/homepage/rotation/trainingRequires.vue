<template>
  <div class="static-detail">
    <!--标题栏-->
    <van-nav-bar :title="requireTitle"
                 left-text="返回"
                 @click-left="onClickLeft"
                 left-arrow class="office"
    />
    <!--标签页tab-->
    <van-tabs type="card" class="tabCard" @click="tabClick">
      <van-tab title="病种要求" class="smallTab">
        <!--内容区-->
        <div class="tabBox">
          <ul class="tab-content">
            <div class="box boxHeader bgGray">
              <li class="pox">病种</li>
              <li class="completeLi">
                要求完成例数 ({{deaseRqList.attach}})
              </li>
            </div>
            <div v-if="deaseRqListArray" class="list-content">
              <van-list
                v-model="loading"
                :finished="finished"
                :offset="30"
                :error.sync="error"
                error-text="请求失败"
                :finished-text="text"
                @load="onLoad"
              >
                <div class="box" v-for="(item,index) in deaseRqListArray" :key="index">
                  <li class="pox">{{item.dataName}}</li>
                  <li class="completeLi">{{item.minCaseNum}}</li>
                </div>
              </van-list>
            </div>
          </ul>
        </div>
      </van-tab>

      <van-tab title="临床技能操作要求" class="largeTab">
        <div class="tabBox">
          <ul class="tab-content">
            <div class="box boxHeader bgGray">
              <li class="pox">临床技能操作要求</li>
              <li class="completeLi">
                要求完成例数({{skillRqList.attach}})
              </li>
            </div>
             <div v-if="skillRqListArray" class="list-content">
               <van-list
                 v-model="loading1"
                 :finished="finished1"
                 :error.sync="error1"
                 error-text="请求失败"
                 :finished-text="text1"
                 @load="onLoad1"
               >
                 <div class="box" v-for="(item,index) in skillRqListArray" :key="index">
                  <li>{{item.dataName}}</li>
                  <li>{{item.minCaseNum}}</li>
                </div>
               </van-list>
             </div>
          </ul>
        </div>
      </van-tab>
      <van-tab title="手术要求" class="smallTab">
        <div class="tabBox">
          <ul class="tab-content">
            <div class="box boxHeader bgGray">
              <li class="pox">手术要求</li>
              <li class="completeLi">
                要求完成例数({{operationRqList.attach}})
              </li>
            </div>
            <div v-if="operationRqListArray" class="list-content">
              <van-list
                v-model="loading2"
                :finished="finished2"
                :offset="30"
                :error.sync="error2"
                error-text="请求失败"
                :finished-text="text2"
                @load="onLoad2"
              >
                <div class="box" v-for="(item,index) in  operationRqListArray" :key="index">
                  <li>{{item.dataName}}</li>
                  <li>{{item.minCaseNum}}</li>
                </div>
              </van-list>
            </div>
          </ul>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import {debounce} from '@/common/js/dom.js'
export default {
  name: "staticDetail",
  data() {
    return {
      requireTitle:"呼吸内科",
      itemData: {departmentId:"920"},
        deaseRqListArray:[],
      deaseRqList: {},
      skillRqList: {},
      skillRqListArray:[],
      operationRqList: {},
      operationRqListArray:[],
        page:1,
        page1:1,
        page2:1,
        loading: false,
        loading1: false,
        loading2: false,
        finished: false,
        finished1: false,
        finished2: false,
        error:false,//病种
        error1:false,//病种
        error2:false,//病种
        text:'',
        text1:'',
        text2:'',
    };
  },
  created(){
     this.itemData = this.Global.currentItem;
     if(this.itemData){
        this.requireTitle = this.itemData.departmentName;
     }

    //  获取三个要求


  },
  methods: {
      tabClick(name,title){
          switch(name){
              case 1:
                  this.error = false;
                  this.error1 = false;
                  this.error2 = false;
                  this.onLoad1();
                  break;
              case 2:
                  this.error = false;
                  this.error1 = false;
                  this.error2 = false;
                  this.onLoad2();
                  break;
          }
      },
      onLoad(){
          this.getSingleRqList(1);
      },
      onLoad1(){
          this.getSingleRqList(2);
      },
      onLoad2(){
          this.getSingleRqList(3);
      },
    onClickLeft() {
      this.$router.go(-1);
    },
    getSingleRqList(type){
        const url =this.api.medicalRule;
        const postJson={
            departmentId: this.itemData.currentDepartId,
            dataType: type,
            pageIndex: 1,
            pageSize: 15,
        };
       /* obj ={
            1:[this.page,this.loading],
            2:[this.page1,this.loading1],
            3:[this.page2,this.loading2]
        }
            postJson.pageIndex = obj[type][0]
                obj[type][1]   = true*/
        switch(type){
            case 1:
                postJson.pageIndex=this.page;
                this.loading = true;
            break;
            case 2:
                postJson.pageIndex=this.page1;
                this.loading1 = true;
                break;
            case 3:
                postJson.pageIndex=this.page2;
                this.loading2 = true;
                break;
        }

        this.utils.ajax({
                        url: url,
                        method: "POST",
                        data: postJson,
                        success: (res) => {
                            console.log(res);
                            switch(type){
                                case 1:
                                     this.deaseRqList = res.data;
                                    this.deaseRqListArray = this.deaseRqListArray.concat( res.data.result);
                                    this.loading = false;
                                    this.page = res.data.page + 1;
                                    break;
                                case 2:
                                    this.skillRqList = res.data;
                                    this.skillRqListArray = this.skillRqListArray.concat( res.data.result);
                                    this.loading1 = false;
                                    this.page1 = res.data.page + 1;
                                    break;
                                case 3:
                                    this.operationRqList = res.data;
                                    this.operationRqListArray = this.operationRqListArray.concat( res.data.result);
                                    this.loading2 = false;
                                    this.page2 = res.data.page + 1;
                                    break;
                            }
                            if (res.data.page === res.data.totalPage || res.data.totalPage == 0) {
                                if(this.deaseRqListArray.length >= 20&&this.deaseRqListArray.length==res.data.count){
                                    this.text = "没有更多了"
                                }
                                if(this.skillRqListArray.length>=20&&this.skillRqListArray.length==res.data.count){
                                    this.text1 = "没有更多了"
                                }
                                if(this.operationRqListArray.length>=20&&this.operationRqListArray.length==res.data.count){
                                    this.text2 = "没有更多了"
                                }
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
                        },
                        error: (error) =>{
                            console.log(error);
                        }
          });
    },


  }
};
</script>

<style scoped>
/* tab标签大小 */
.van-tabs--card  /deep/ .van-tab:first-child{
  flex: 3;
}
.van-tabs--card /deep/ .van-tab:nth-child(2){
  flex: 4;
}
.van-tabs--card  /deep/ .van-tab:nth-child(3){
  flex: 3;
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
}
/* 表格区域 */
.tabBox {
  position: absolute;
  top: 46px;
  left: 0;
  bottom: 30px;
  padding:0 15px;
  box-sizing: border-box;
  width: 100%;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
.tab-content{
  border-top:1px solid #e4e4e4;
}
.tab-content .boxHeader li{
  text-align:center;
}
.tab-content .completeLi{
 line-height: normal;
 padding-top: 6px;
}
.box {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  line-height: 40px;
  font-size: 12px;
  color: #999;
  border-left:1px solid #e4e4e4;
  border-right:1px solid #e4e4e4;
  border-bottom: 1px solid #e4e4e4;
}
.tab-content li{
  width: 50%;
  text-align: center;
  line-height: 20px;
  word-wrap:break-word;
  padding: 5px  12px 5px 12px;
  box-sizing: border-box;
}
.tab-content li:first-of-type{
  border-right: 1px solid #e4e4e4;
  box-sizing: border-box;
}

/* 头部 */
.viewCenter /deep/ .van-nav-bar__text{
    color:#1da29a;
}

.list-content {
  position: absolute;
  left: 0;
  right: 0;
  margin:0 15px;
  top:30px;
  bottom: 0;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
</style>
