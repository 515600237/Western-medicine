import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    {
      path: "/",
      redirect: "/login"
    },
    {
      path:"/author",
      name:'author',
      component:resolve => require(['@/views/login/author'],resolve)
    },
    // 登录
    {
      path: '/login',
      name: 'login',
      component: resolve => require(["@/views/login/login"], resolve)
    },
    // 住院医师
    {
      path: '/studentHome',
      name: 'studentHome',
      component: resolve => require(["@/views/studentHome/home"], resolve),
      children: [
        //学生首页
        { path: 'homeindex',name: 'homeindex', component: resolve => require(["@/views/studentHome/homepage/homeIndex/homeIndex"], resolve),
        meta:{
          keepAlive: true,
          isBack: true,
        }
       },
        //学生首页统计
        { path: 'staticindex', name: 'staticindex',component: resolve => require(["@/views/studentHome/statictable/staticIndex/staticIndex"], resolve)
        },
         //学生首页新闻
         {path:'newInformation',name:'newInformation',component:resolve => require(["@/views/studentHome/homepage/other/newInformation/newInformation"], resolve)
        },
        // 录入轮转计划
        { path: 'rotation',name: 'rotation', component: resolve => require(["@/views/studentHome/homepage/rotation/rotation"], resolve)
        },
        { path: 'addRolation',name: 'addRolation', component: resolve => require(["@/views/studentHome/homepage/rotation/addRolation"], resolve)
       },
        { path: 'relationDetail',name: 'relationDetail', component:
        resolve => require(["@/views/studentHome/homepage/rotation/relationDetail"], resolve)
      },
       //培训要求
        { path: 'trainingRequires',name: 'trainingRequires', component: resolve => require(["@/views/studentHome/homepage/rotation/trainingRequires"], resolve)
      },
        // 录入病种技能
        { path: 'medicalAdd',name: 'medicalAdd', component: resolve => require(["@/views/studentHome/homepage/medicalAdd/medicalAdd"], resolve)
      },
        // 医疗信息list列表，区分当前科室和全部科室
        { path: 'medicaList',name: 'medicaList', component: resolve => require(["@/views/studentHome/homepage/medicalList/medicaList"], resolve),
        meta:{
          keepAlive: true,
          isBack: true,
        }
       },
        // 统计详情
        {path:'staticdetail',name:"staticdetail",component:resolve => require(["@/views/studentHome/statictable/staticDetail/staticDetail"], resolve)
        },
          /*我的设置*/
        {path:"changepassword",name:"changepassword",component:resolve => require(["@/views/studentHome/myset/changePassword/changePassword"], resolve)
        },
        {path:"operating",name:"operating",component:resolve => require(["@/views/studentHome/myset/operating/operating"], resolve)
        },//操作说明
        {path:"feedback",name:"feedback",component:resolve => require(["@/views/studentHome/myset/feedback/feedback"], resolve)
        },//意见反馈
        {path:"mySet",name:"mySet",component:resolve => require(["@/views/studentHome/myset/mysetIndex/mySet"], resolve)
        },
      ]
    },
    // 指导医师
    {
      path: '/teacherPage',
      name: 'teacherPage',
      component:
      resolve => require(["@/views/teacherPage/teacherPage"], resolve),
      children: [
        // 老师首页
        { path: 'teacherHomeindex',name: 'teacherHomeindex', component: resolve => require(["@/views/teacherPage/teacherHome/homeIndex/teacherHomeindex"], resolve),
          meta:{
            keepAlive: true,
            isBack:true,
          },
        },
        // 老师统计
        { path: 'teacherStatic',name: 'teacherStatic', component: resolve => require(["@/views/teacherPage/teacherStatic/teacherStatic"], resolve)
        },
        // 老师设计
        {path:"teacherSet",name:"teacherSet",component:resolve => require(["@/views/teacherPage/teacherSet/teacherSet"], resolve)
        },
        // 完善信息
        { path: 'teacherPerfecInfo',name: 'teacherPerfecInfo', component: resolve => require(["@/views/teacherPage/teacherHome/perfect/teacherPerfectInfo"], resolve)
        },
          //审核页面
        {path:'teacherAudit',name:'teacherAudit',
          component:resolve => require(["@/views/teacherPage/teacherHome/audit/audit"], resolve),
          meta:{
            keepAlive: true,
            isBack:true,
          },
        },//审核主页面
      ]
    },
  ],

})
