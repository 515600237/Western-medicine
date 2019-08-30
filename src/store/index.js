import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

const state={//要设置的全局访问的state对象
  project:null,//项目名
    showFooter: true,
    activeTabNum:0,//底部导航活动标签
    token:"",
    imei:"",//设备号
    rotationShType: 1,//轮转日历显示类型,
    rotationDateJson:{ //
       year: "",
       month: ""
    },
    medListTabType:0,//进入当前科室判断类型 病种、技能、手术类型
    rotationDtId: 0, //轮转列表详情id,
    deaseListPagePre:1,  //病种，技能手术的前页面，1首页，2轮转计划详情,
    medicalPageType: 1, //病种，技能手术页面，1新增，2修改
    medicalModifyType: 1, //区分病种，技能，手术修改时类型 0,1,2 对应病种，技能，手术
    medicalModifyItem: {}, //保存修改item数据
    anySelectDept:null,//多科室选择列表下标
    officeList:[],//多科室列表,
    cacheHome:false, //指导老师首页是否使用缓存
    rotationDepIndex: 0, //新增轮转计划记录之前选过的科室
    checkInfo:true,  //指导医师首页验证是否完善信息

    urlObj:"",//截取当前路径对象
    url:"",//需要跳转的url
};

const copyState = deepClone(state);
function deepClone(obj){
    let newObj = obj instanceof Array ? []:{};
    for(var i in obj){
       if(typeof obj[i] ==="object"){
        newObj[i] =deepClone(obj[i]);
       }else{
        newObj[i]= obj[i];
       }
    }
    return newObj;
}
function resetClearState(obj,newObj){
    for(var i in obj){
       if(typeof obj[i] ==="object"){
          resetClearState(obj[i],newObj[i]);
       }else{
        newObj[i]= obj[i];
       }
    }
}

// 获取值
const getters = {
    isShow(state) {
       return state.showFooter;
    },
    getActiveNum(state){
       return state.activeTabNum;
    },
  getProject(state){
    return state.project;
  },
    getToken(state){
        return state.token;
    },
    getImei(state){
        return state.imei;
    },
    getRotationShType(state){
        return state.rotationShType;
    },
    getType(state){
        return state.medListTabType;
    },
    getRotationDtId(rotationDtId){
        return state.rotationDtId;
    }
};
// 改变值
const mutations = {
    show(state) {   //自定义改变state初始值的方法，这里面的参数除了state之外还可以再传额外的参数(变量或对象);
        state.showFooter = true;
    },
    hide(state) {  //同上
        state.showFooter = false;
    },
    setNum(state,number){ //同上，这里面的参数除了state之外还传了需要增加的值sum
        state.activeTabNum=number;
    },
  setProject(state,project){
    state.project = project;
  },
    setToken(state,token){
        state.token = token;
    },
    setImei(state,imei){
        state.imei = imei;
    },
    setRotationShType(state,rotationShType){//设置轮转计划显示
        state.rotationShType = rotationShType;
    },
    setType(state,newType){
        state.medListTabType = newType;
    },
    setRotationDtId(state,rotationDtId){
         state.rotationDtId = rotationDtId;
    },
    resetState(state){
        resetClearState(copyState,state);
        console.log(state);
    }
};
// 异步操作
const actions = {
    hideFooter(context) {  //自定义触发mutations里函数的方法，context与store 实例具有相同方法和属性
        context.commit('hide');
    },
    showFooter(context) {  //同上注释
        context.commit('show');
    },

    setNewNum(context,num){   //同上注释，num为要变化的形参
        context.commit('setNum',num)
    },
  setNewProject(context,project){
    context.commit('setProject',project)
  },
    setNewToken(context,token){
        context.commit('setToken',token)
    },
    setNewImei(context,imei){
        context.commit("setImei",imei);
    },
    setNewRotationShType(context,rotationShType){//设置轮转计划显示
        context.commit("setRotationShType",rotationShType);
    },
    setNewType(context,newType){
        context.commit("setType",newType)
    },
    setNewRotationDtId(context,rotationDtId){
         context.commit("setRotationDtId",rotationDtId);
    },
    setResetState(context){
         context.commit("resetState");
    }
};

const store = new Vuex.Store({
    state,
    getters,
    mutations,
    actions
});
export default store;



