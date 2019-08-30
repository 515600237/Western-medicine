export default{
     install:function(Vue,opt){

        // 确认框
        Vue.prototype.confirmDialog= function(msg,Tback){
            this.$dialog
            .confirm({
                message:  msg || "确定要删除吗?"
            })
            .then(() => {
                Tback(true)
            })
            .catch(() => {
                Tback(false)
            });
        }

        // 教学活动类型过滤
        const auditStateTitleJson=
        {  0: "未审核",1: "已通过",2: "未通过"};

        Vue.filter('auditTitleFilter', function (value) {
            if (!value) return '';
            return  auditStateTitleJson[value] || "";
        })


        // 教学活动类型过滤
        const ActivityTypeJson=
        {  1: "病例讨论",2: "教学查房",3: "培训讲座",4: "技能训练",5: "模拟教学",6: "院外实践",99: "其他"};

        Vue.filter('activityTypeFilter', function (value) {
            if (!value) return '';
            return  ActivityTypeJson[value] || "";
        })

        // 教学活动类型过滤
        const activityLevel=
        [
            { id: 1,name: "院级以上"},
            { id: 2,name: "院级"},
            { id: 3,name: "专业基地"},
            { id: 4,name: "科室"},
        ];
        const ActivityLevelJson=
        {  1: "院级以上",2: "院级",3: "专业基地",4: "科室"};

        Vue.filter('activityLevelFilter', function (value) {
            if (!value) return '';
            return  ActivityLevelJson[value] || "";
        })

        // 学习笔记类型过滤
        const studyNoteTypeJson={0: "跟师心得体会",1:"学习中医典籍体会",2:"其他"};

        Vue.filter('studyNoteTypeFilter', function (value) {
          if([0,1,2].includes(value)){
            return studyNoteTypeJson[value]
          }
        })

        Vue.filter('staticShowNum', function (value) {
            if(value == 0){
                return "-";
            }else{
                return value;
            }
        })
       const styleObj = {1:{color:"blue"},2:{color:"red"}}
       Vue.filter("objStyle",function(value){
              if([1,2].includes(value)){
                return styleObj[value]
              }
       })
     }
}
