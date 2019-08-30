<script>

const currentItem =null; //当前轮转id
const depDetailType =1; //当前轮转id
// userType 3 指导医师 4 住院医师 

// 住院医师
// const userType= 4;
// const userId =1434;
// const majorId = 889;
// const orgId = 644;

// const userInfo ={
//     userId:1434,
//     teacherId:1434,
//     departmentId:920,
//     fullName: "张三",
//     orgId:94,
//     userType: 4
// };

// 指导老师
const userType= 4;
const userId = 2068;
const majorId = null;
const orgId = 644;


const userInfo ={
    userId:2068,
    // teacherId:1434,
    departmentId:null,
    departmentName: "呼吸内科",
    fullName: "张三",
    orgId:94,
    userType: 4,
    standardDepartmentId:null, //标准科室id
};


const token="";

export default {
    currentItem,
    depDetailType,
    userType,
    userId,
    orgId,
    userInfo,
    majorId,
    token
}
</script>

