let base = process.env.userRoot1;
const base2=process.env.userRoot2;//基础数据 一龙
let base3 = process.env.userRoot3;
let file = process.env.file;

const api = {
  // 用户
  login: `${base}/sys/login`, // 登录
  mysetInfo: `${base}/userinfo/myInfo`, // 我的页面
  changePassword:`${base}/changePwd`,  //修改密码
  //首页
  swiper:`${base}/cms/swapper`,//首页轮播图
  swiperDetail:`${base}/cms/detail/`,//轮播图进入的新闻页
  homeStudentInfo:`${base2}/student/home`,//住院医师首页情况
  //统计
  rotationProgress:`${base2}/student/statistic/rotationProgress`,//统计首页
  medicalInfo:`${base2}/student/medicalInfo`,//住院医师统计详情

  //完善信息
  userDetailInfo:`${base}/userinfo/userDetailInfo`,//用户详情
  saveuserInfo:`${base}/userinfo/saveOrUpdate`,//保存
  getTypeList:`${base2}/api/getTypeList`,//技术职能
  getUserRelation:`${base}/userinfo/getUserRelation`,//获取老师多科室列表,选择身份
  getStandardList:`${base2}/standard/appList`,//标准科室 完善信息

    //指导老师首页
    teacherHomeStatic:`${base2}/teacher/home`,//首页上部分统计
    getStudentRotation:`${base2}/teacher/studentRotation`,//首页下部分学生轮转
    checkUserDetail:`${base}/userinfo/checkUserDetail`,


    //统计
  showRotationProgress:`${base2}/teacher/showRotationProgress`,//统计首页
  medicalInfoByStudent:`${base2}/student/medicalInfoByStudent`,//统计详情内容


    //审核
    listAuditCollect:`${base2}/teacher/listAuditCollect`,//审核列表
    audit:`${base2}/teacher/audit`,//医疗上报信息审核
    studentInfoList:`${base2}/teacher/studentInfoList`,//医疗上报信息审核

//科室详情
  recordStatisticsOfSchedule:`${base2}/student/statistic/recordStatisticsOfSchedule`,//已选科室
  recordStatistics:`${base2}/student/statistic/recordStatistics`,//全部科室录入情况

  getCooridionList:`${base}/api/getCooridionList`, //获取协同单位
  getDepartmentTeacher:`${base}/userinfo/getDepartmentTeacher`, //获取指导老师

    //意见反馈
  suggestion:`${base}/suggestion`,
  // 基础数据
  getDepartments:`${base2}/api/getDepartments`, //获取科室 轮转计划新增，修改
  getMajors:`${base2}/api/getMajors`, //获取专业

  // 轮转计划
  departAndMedicalBaseInfo:`${base2}/base/departAndMedicalBaseInfo`, //获取科室，病种，技能，手术
  getConfigInfo:`${base}/sysconfig/getSysConfigInfo`,//获取指导老师填写方式
  scheAdd:`${base2}/schedule/save`, //新增轮转计划
  schelist:`${base2}/schedule/list`, //获取轮转计划列表
  scheDetail:`${base2}/schedule/load`, //轮转详情
  scheModify:`${base2}/schedule/update`, //修改轮转计划
  scheDelete:`${base2}/schedule/delete`, //删除轮转计划
  medicalRule:`${base2}/student/medicalRule`, //培训要求
  scheduleCalendar:`${base2}/schedule/scheduleCalendar`, //轮转计划日历

  // 病种,手术,技能,操作
  medicalSave:`${base2}/student/medical/save`, //新增医疗信息
  deaseList:`${base2}/student/disease/list`, //病种列表
  diseaseModify:`${base2}/student/disease/update`, //修改病种
  diseaseDelete:`${base2}/student/disease/delete`, //删除病种
  skillList:`${base2}/student/skill/list`, //技能列表
  skillModify:`${base2}/student/skill/update`, //修改技能
  skillDelete:`${base2}/student/skill/delete`, //删除技能
  operateList:`${base2}/student/operation/list`, //手术列表
  operateModify:`${base2}/student/operation/update`, //修改手术
  operateDelete:`${base2}/student/operation/delete`, //删除手术

  admin:`${base3}/book/bind`


};
export default api;
