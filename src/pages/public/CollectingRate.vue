<template>
  
<div class="collecting-rate">  
  <el-tabs :value="activeName" type="card" @tab-click="handleClick" >
    <el-tab-pane label="预付·微信" name="1">
      <RateSub
        v-if="show1"
        :max="max"
        :step="step"
        :paypaths="paypaths"
        :comid="parkid"
        paytype="1"
      ></RateSub>
    </el-tab-pane>
    <el-tab-pane label="预付·支付宝" name="2">
     <RateSub
        v-if="show2"
        :max="max"
        :step="step"
        :paypaths="paypaths"
        :comid="parkid"
        paytype="2"
      ></RateSub>
    </el-tab-pane>
    <el-tab-pane label="扫码枪·微信-支付宝" name="3">
      <RateSub
        v-if="show3"
        :max="max"
        :step="step"
        :paypaths="paypaths"
        :comid="parkid"
        paytype="3"
      ></RateSub>
    </el-tab-pane>
    <el-tab-pane v-if="false" label="扫码枪·支付宝" name="4">
      <RateSub
        v-if="show4"
        :max="max"
        :step="step"
        :paypaths="paypaths"
        :comid="parkid"
        paytype="4"
      ></RateSub>
    </el-tab-pane>
    <el-tab-pane label="月卡续费" name="5">
      <RateSub
        v-if="show5"
        :max="max"
        :step="step"
        :paypaths="paypaths"
        :comid="parkid"
        paytype="5"
      ></RateSub>
    </el-tab-pane>
    <el-tab-pane label="结算待支付·微信" name="6">
      <RateSub
        v-if="show6"
        :max="max"
        :step="step"
        :paypaths="paypaths"
        :comid="parkid"
        paytype="6"
      ></RateSub>
    </el-tab-pane>
    <el-tab-pane label="结算待支付·支付宝" name="7">
      <RateSub
        v-if="show7"
        :max="max"
        :step="step"
        :paypaths="paypaths"
        :comid="parkid"
        paytype="7"
      ></RateSub>
    </el-tab-pane>
    <el-tab-pane label="第三方微信统一下单" name="8">
      <RateSub
        v-if="show8"
        :max="max"
        :step="step"
        :paypaths="paypaths"
        :comid="parkid"
        paytype="8"
      ></RateSub>
    </el-tab-pane>
    <el-tab-pane label="无感·支付宝" name="9">
     <RateSub
        v-if="show9"
        :max="max"
        :step="step"
        :paypaths="paypaths"
        :comid="parkid"
        paytype="9"
      ></RateSub>
    </el-tab-pane>
    <el-tab-pane label="无感·银联" name="10">
     <RateSub
        v-if="show10"
        :max="max"
        :step="step"
        :paypaths="paypaths"
        :comid="parkid"
        paytype="10"
      ></RateSub>
    </el-tab-pane>
  </el-tabs>

</div>
</template> 
<script>
import {path} from '../../api/api'
import RateSub from './subs/RateSub'
  export default {
    components:{
			RateSub
		},
    data() {
      return {
        token:sessionStorage.getItem('token'),
        max:6,
        step:0.1,
        activeName: '1',
        paypaths: [],
        show1:true,
        show2:false,
        show3:false,
        show4:false,
        show5:false,
        show6:false,
        show7:false,
        show8:false,
        show9:false,
        show10:false,
      };
    },
    props:['parkid'],
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
        if(tab.name=="1"){
          this.show1=true
          this.show2=false
          this.show3=false
          this.show4=false
          this.show5=false
          this.show6=false
          this.show7=false
          this.show8=false
          this.show9=false
          this.show10=false
        }else if(tab.name=="2"){
          this.show1=false
          this.show2=true
          this.show3=false
          this.show4=false
          this.show5=false
          this.show6=false
          this.show7=false
          this.show8=false
          this.show9=false
          this.show10=false
        }else if(tab.name=="3"){
          this.show1=false
          this.show2=false
          this.show3=true
          this.show4=false
          this.show5=false
          this.show6=false
          this.show7=false
          this.show8=false
          this.show9=false
          this.show10=false
        }else if(tab.name=="4"){
          this.show1=false
          this.show2=false
          this.show3=false
          this.show4=true
          this.show5=false
          this.show6=false
          this.show7=false
          this.show8=false
          this.show9=false
          this.show10=false
        }else if(tab.name=="5"){
          this.show1=false
          this.show2=false
          this.show3=false
          this.show4=false
          this.show5=true
          this.show6=false
          this.show7=false
          this.show8=false
          this.show9=false
          this.show10=false
        }else if(tab.name=="6"){
          this.show1=false
          this.show2=false
          this.show3=false
          this.show4=false
          this.show5=false
          this.show6=true
          this.show7=false
          this.show8=false
          this.show9=false
          this.show10=false
        }else if(tab.name=="7"){
          this.show1=false
          this.show2=false
          this.show3=false
          this.show4=false
          this.show5=false
          this.show6=false
          this.show7=true
          this.show8=false
          this.show9=false
          this.show10=false
        }else if(tab.name=="8"){
          this.show1=false
          this.show2=false
          this.show3=false
          this.show4=false
          this.show5=false
          this.show6=false
          this.show7=false
          this.show8=true
          this.show9=false
          this.show10=false
        }else if(tab.name=="9"){
          this.show1=false
          this.show2=false
          this.show3=false
          this.show4=false
          this.show5=false
          this.show6=false
          this.show7=false
          this.show8=true
          this.show9=true
          this.show10=false
        }else if(tab.name=="10"){
          this.show1=false
          this.show2=false
          this.show3=false
          this.show4=false
          this.show5=false
          this.show6=false
          this.show7=false
          this.show8=true
          this.show9=false
          this.show10=true
        }

      },
      getPayPathList(){
        var vm = this
        this.$getJSON(path+'/getdata/payunionlist',{'token':this.token},function(ret){
          vm.paypaths = ret
        })
      },
    },
    mounted(){
      this.getPayPathList()
      this.useCarUserPlatform=true
    }
  };
</script>
<style>
.collecting-rate{
  margin-left:15px;
  margin-top:-50px;
}
.collecting-content{
  width:100%;
}

.el-tabs--card>.el-tabs__header .el-tabs__item.is-active{
  font-weight:bold;
}
</style>