<template>
  
      <div class="collecting-content" align="left">
        <div style="width:500px;margin:0 auto"> 

          <div v-if="notmodulated" style="text-align:center;margin-top:50px;color:#888888;font-size:15px">
            <div>您尚未设置费率</div>
            <div align="center" style="margin-top:15px;">
                <el-button type="primary" size="small" @click="setRate">点击设置</el-button>
            </div>
          </div>

          <div v-if="modulated">
            <div style="line-height:36px" v-if="paytype==5||paytype==6">
                <el-checkbox v-model="useCarUserPlatform"> 使用车主平台</el-checkbox>
            </div>

            <div v-if="useCarUserPlatform" style="height:100px;margin-top:20px">
              <div style="display:inline;width:80px;">车主平台 </div>
              <el-select v-model="carplatform" placeholder="请选择" style="width:178px" size="small" :disabled="selectCUP">
                <el-option
                  v-for="item in paypaths"
                  :label="item.value_name"
                  :value="item.value_no">
                </el-option>
              </el-select>
              <div style="margin-top:15px;font-size:12px;color:red" v-show="paytype!=5">
                <div style="display:inline;inline-height:40px;">厂商分润&nbsp;:&nbsp;0.21元每笔(无服务商)</div>
                <div style="margin-left:57px">0.04元每笔(有服务商)</div>
              </div>
            </div>


            <div v-if="nouseCarUserPlatform" style="height:100px;margin-top:20px;width:400px">
                <span>当前费率 <span style="font-size:16px;color:#888888">{{rate}}</span> (‰)</span>
                <el-slider v-model="rate" :min="min" :max="max" :step="step" show-input></el-slider>
                <div>费率区间:3.8‰ ~ 6.0‰</div>
            </div>

            <div align="right" v-show="showSave" style="margin-top:20px;margin-right:120px;bottom:10px;position:relative">
                <el-button type="primary" size="small" @click="saveRate" :loading="saving">保存</el-button>
            </div>

          </div>


        </div>
      </div>
</template> 
<script>
import {path} from '../../../api/api'
  export default {
    data() {
      return {
        roleid:'',
        selectCUP:false,
        showSave:true,
        showCUP:true,
        saving:false,
        useCarUserPlatform:false,
        nouseCarUserPlatform:false,
        carplatform: '',
        paychannel:'',
        max:6,
        min:0,
        rate:6.0,
        notmodulated:false,
        modulated:false,
        token:sessionStorage.getItem('token')
      };
    },
    props:['step','paypaths','comid','paytype'],
    methods: {
      getPayRate(){
        //查询该车场的费率情况
        var vm = this
        this.$post(path+'/park/getrate',{'comid':this.comid,'paytype':this.paytype,'token':this.token},function(ret){
          ret = JSON.parse(ret)
          vm.min=ret.min
          vm.max=ret.max
          if(ret.state==-1){

          }else if(ret.state==0){
            //未设置
            if(vm.roleid==1){
              vm.min=0
              vm.notmodulated=true
              vm.modulated=false
            }else{
              //第三方选框不可用 
              vm.selectCUP=true
              //设置选框默认值
              vm.carplatform=ret.default_platform
              //费率设置为6
              vm.rate=6
              vm.notmodulated=false
              vm.modulated=true
            }
            if(vm.paytype=="1"){
              //微信预付走第三方
              console.log('微信预付走第三方')
              if(vm.roleid!=1){
                vm.showSave=false
              }
              vm.useCarUserPlatform=true
              vm.nouseCarUserPlatform=false
            }else{
              //其他走聚合支付
              vm.useCarUserPlatform=false
              vm.nouseCarUserPlatform=true
            }

          }else if(ret.state==1){
            //设置过
            vm.notmodulated=false
            vm.modulated=true
            vm.paychannel=ret.pay_channel
            if(ret.pay_channel==1){
              //第三方
              vm.useCarUserPlatform=true
              vm.nouseCarUserPlatform=false
              vm.carplatform = ret.pc_id
            }else if(ret.pay_channel==2){
              //聚合
              vm.useCarUserPlatform=false
              vm.nouseCarUserPlatform=true
              vm.rate = parseFloat((ret.rate*10).toFixed(1))
              console.log(typeof(vm.rate))
              if(vm.roleid==2&&ret.rate<0.38){
                vm.min=0
              }else if(vm.roleid==1){
                vm.min=0
              }else{
                vm.min=3.8
              }
            }
          }
        })
      },
      setRate(){
        this.modulated=true
        this.notmodulated=false
      },
      saveRate(){
        this.saving=true
        if(this.carplatform==''&&this.useCarUserPlatform){
          this.$message({
            message: '请选择车主平台',
            type: 'warning'
          })
          this.saving=false
          return
        }
        var vm = this
        var params = {'comid':this.comid,'paytype':this.paytype,'token':this.token}
        if(this.useCarUserPlatform){
          //第三方
          this.$extend(params,{'paychannel':1})
          this.$extend(params,{'pc_id':this.carplatform})
        }else{
          //聚合
          this.$extend(params,{'paychannel':2})
          this.$extend(params,{'rate':(this.rate/10).toFixed(2)})
        }
        this.$post(path+'/park/setrate',params,function(ret){
          ret=JSON.parse(ret)
          if(ret.state>0){
            vm.$message({
              message: '更新成功!',
              type: 'success',
              duration:800
            });
          }else{
            vm.$message({
              message: '更新失败!',
              type: 'error',
              duration:1200
            });
          }
          vm.saving=false
        })
      }
    },
    watch:{
      useCarUserPlatform:function(val){
        this.nouseCarUserPlatform=!val
      }
    },
    mounted(){
      var user = JSON.parse(sessionStorage.getItem('user'))
      this.roleid = user.roleid
      console.log(user.roleid)
      if(this.roleid==2){
        this.showCUP=false
      }
      this.useCarUserPlatform=true
      this.getPayRate()
    },
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