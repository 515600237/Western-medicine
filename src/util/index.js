import axios from "axios";
import { Toast, ImagePreview } from "vant";
import Vue from 'vue'
import router from '@/router/index.js'
import webApp from '@/webApp/index'

export default{
    isInApp() {
        if (typeof Elf.AppCallWeb != "undefined") {
        return !!((window.webkit && window.webkit.messageHandlers) || typeof Elf.WebCallApp == "function" || typeof Elf.WebCallCef == "function");
        }
    },
    ajax(options,isFlag){
      if (!isFlag) {
          Toast.loading({
              mask: true,
              message: '加载中...'
          });
      }
      options.data = options.data || {};
      axios(options).then(result => {
          Toast.clear();
          const res = result.data;
          if(res.code == 0){
              options.success && options.success(res);
          }else if(res.code == 81){
              Toast("登录失效，请重新登录");
              setTimeout(()=>{
                  if(this.isInApp()){
                      webApp.WebCallApp("UserLogout", {}, (res) => {});
                   }else{
                      router.push({ name: "login"});
                   }
              },200)
          }else{
              options.success(res);
          }

        }).catch(
          error => {
              Toast.clear();
              if (options.catch) {
                  options.catch && options.catch(error);
              } else {
                  // Toast(error.message);
              }
          }
        );
  },

  toPercent(point){
  var str = Number(point * 100).toFixed(2);
  str += "%";
  return str;
},
  /*去除数组中的相同对象*/
  deteleObject(arr) {
    var uniques = [];
    var stringify = {};
    for (var i = 0; i < arr.length; i++) {
      var keys = Object.keys(arr[i]);
      keys.sort(function(a, b) {
        return (Number(a) - Number(b));
      });
      var str = '';
      for (var j = 0; j < keys.length; j++) {
        str += JSON.stringify(keys[j]);
        str += JSON.stringify(arr[i][keys[j]]);
      }
      if (!stringify.hasOwnProperty(str)) {
        uniques.push(arr[i]);
        stringify[str] = true;
      }
    }
    uniques = uniques;
    return uniques;
  },
  //截取路径参数
  urlObj(str) {
    let obj = {};
    if(str.indexOf("?") !== -1){
      let arr1 = str.split("?");
      let arr2 = arr1[1].split("&");
      for (let i = 0; i < arr2.length; i++) {
        let res = arr2[i].split("=");
        obj[res[0]] = res[1];
      }
    }else{
      return;
    }
    return obj;
  }

}
