<template>
    <div class="wrapper">
        <van-popup v-model="oShow"
                   position="top"
                   transition="fade"
                   @click-overlay="hideOvers()"
        >
            <van-radio-group v-model="radio">
                <van-cell-group>
                    <van-cell :title="item"
                              clickable
                              checked-color="#1989fa"
                              @click="chooseItem(item,index)"
                              v-for="(item,index) of oList"
                              :key="index"
                    >
                        <van-radio :name="index"/>
                    </van-cell>
                </van-cell-group>
            </van-radio-group>
        </van-popup>
    </div>
</template>

<script>
    export default {
        name: "selectlist",
        props: {
            list: {
                type: Array,
                default: function () {
                    return ["待审核", "已通过", "未通过"]
                }
            },
            isShow:{
                type:Boolean,
                dafault:true,
            },
            oRadio:{
              type:Number,
               dafault:0,
            }
        },
        data() {
            return {
                radio: this.oRadio,
                oShow: this.isShow,
                oList:this.list,
            }
        },
        methods: {
            hideOvers() {
                this.$emit("hideOverlay", false);
            },
            chooseItem(item,index){
                this.$emit("chooseItem",item,index);
            }
        },
        watch:{
            isShow(newValue,oldValue){
                this.oShow = newValue;
            },
            list(newValue,oldValue){
                this.oList = newValue;
            },
            oRadio(newValue,oldValue){
                this.radio = newValue;
            }
        }
    };

</script>

<style scoped>
    /*.wrapper /deep/  .van-icon-success{
              color: #1989fa;
        font-size:18px;
          !*  color:#1989fa;*!
    }*/
    .wrapper /deep/ .van-cell__title {
        text-align: left;
    }

    .wrapper /deep/ .van-radio__icon--checked {

        color: #1989fa;
        background: #fff;
        border: 0;
    }

    .wrapper /deep/ .van-radio__icon--checked .van-icon {
        font-size: 23px;
        color: #1989fa;
        background: #fff;
        border: 0;
    }

    .wrapper /deep/ .van-radio__icon .van-icon {
        border: 0;
    }

    .wrapper /deep/ .van-popup--top {
        top: 5.75rem;
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }

    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
    {
        opacity: 0;
    }
</style>
