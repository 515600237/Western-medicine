<template>
  <div id="centerBox" class="centerBox">
    <!-- 路由入口 -->
   <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      active: 1
    };
  },
  methods:{
			goPage(){
				this.$router.push({path:this.routerpath});
      },
      getUrlData(){
          let url = window.location.href.replace(window.location.hash, '');
          let wPos = url.indexOf("?");
          if(wPos == -1) return;
          let pos = url.substring(wPos + 1);
          let urlobj = {};
          let urlarr = pos.split("&");
          for (let i = 0; i < urlarr.length; i++) {
              let item = urlarr[i];
              if(item.includes("=")){``
                let item = urlarr[i].split("=");
                urlobj[item[0]] = item[1];
              }
          }
          console.log(urlobj);
          // 设置科室id
          if(urlobj["departmentId"]){
            //  this.Global.userInfo.departmentId = urlobj["departmentId"];
          }
          /*如果有书包这个参数*/
          if(urlobj["book"]){
              this.$router.push({name:"login"})
          }
          if(urlobj["token"]){
              // store中存储token,imei
              this.$store.dispatch("setNewToken",urlobj["token"]);
              this.$store.dispatch("setNewImei",urlobj["imei"]);

              const roleUrlName ={ "3":"teacherHomeindex" ,"4":"homeindex"};
              if(urlobj["userType"]){//指导医师
                    this.Global.userType = urlobj["userType"];
                    this.$router.push({name: roleUrlName[this.Global.userType] });
              }
          }

      }
  },
  created(){
       this.getUrlData();

  },
  mounted(){
    console.log(this.$route);
    let currentPath = this.$route.path;
    let  currentName = this.$route.name;

    //判断页面刷新
    window.onload=() =>{
        const name = this.$route.name;
        const hasFooterName = ['homeindex','staticindex','mysetIndex','teacherHomeindex','teacherStatic','teacherSet',"teacherAudit"];
        if(hasFooterName.includes(name)){
           this.$store.dispatch('showFooter');
        }else{
          this.$store.dispatch('hideFooter');
        }

    }
  }
};



//页面等比缩放
window.onresize = throttle(setRemSize, 300 );
function throttle(fn,interval){
	var _self=fn,timer,
		firstTime=true;

	return function(){
		var args=arguments;
		var _me=this;

		if(firstTime){
			_self.apply(_me,args);
			return firstTime=false;
		}
		if(timer){
			return false;
		}
		timer=setTimeout(function(){
			clearTimeout(timer);
			timer=null;
			_self.apply(_me,args);
		},interval||300)
	}
}
function setRemSize(){
	var clientWidth_get=document.documentElement.clientWidth;
	var _clientWidth=clientWidth_get/375*16+"px";
	document.documentElement.style.fontSize=_clientWidth;
}
setRemSize();

</script>

<style>
#centerBox {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width:100%;
  height:100%;
}

</style>

