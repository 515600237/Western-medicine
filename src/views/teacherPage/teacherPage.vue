<template>
    <div class="ht100">
        <!-- 指导医师 -->
        <van-tabbar v-model="isActive" v-if="isShow && userType == 3" class="bottomTab">
            <van-tabbar-item icon="home-o" @click="goPage(0,'/teacherPage/teacherHomeindex')">首页</van-tabbar-item>
            <van-tabbar-item icon="bar-chart-o" @click="goPage(1,'/teacherPage/teacherStatic')">统计</van-tabbar-item>
            <van-tabbar-item icon="user-o" @click="goPage(2,'/teacherPage/teacherSet')">我的</van-tabbar-item>
        </van-tabbar>
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
        <router-view v-if="!$route.meta.keepAlive" class="viewCenter" :class="{'ht100':!isShow}"></router-view>
    </div>
</template>

<script>
    export default {
        name: "teacherPage",
        data() {
            return {
                userType: 1,


            };
        },
        computed: {
            isShow() {
                return this.$store.getters.isShow;
            },
            isActive: {
                get() {
                    return this.$store.getters.getActiveNum;
                },
                set(number) {
                    this.$store.dispatch("setNewNum", number);
                }
            }
        },
        methods: {
            goPage(activeNum, path) {
                // this.$store.dispatch("setNewNum",activeNum);
                this.$router.push({path: path});
            },
        },
        mounted() {
            this.userType = this.Global.userType;
        },
        watch: {
            $route(to, from) {
                if(from.name == 'teacherAudit' && to.name=='teacherHomeindex'){
                    to.meta.keepAlive = true;
                }else{
                    to.meta.keepAlive = false;
                }
                //跳转组件页面后，监听路由参数中对应的当前页面以及上一个页面
                if (to.name == 'teacherHomeindex' || to.name == 'teacherStatic' || to.name == 'teacherSet' || to.name == "teacherAudit") {
                    this.$store.dispatch('showFooter');
                } else {
                    this.$store.dispatch('hideFooter');
                }
            }
        }
    };
</script>

<style scoped>
    .ht100 /deep/ .van-tabbar-item--active{
        color:#006754;
    }
    .bottomTab {
        height: 50px;
    }

    .viewCenter {
        height: 100%;
        padding-bottom: 50px;
    }

    .viewCenter.ht100 {
        height: 100%;
        padding: 0;
    }

</style>
