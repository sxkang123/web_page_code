<template>
  <section style="padding: 10px;">

    <!--账户名称-->
    <el-row>
      <el-col :span="24" style="font-size: 18px;font-weight: bold;">
           &nbsp;车场名称: <span style="color: red">{{parkname}}</span>
      </el-col>
    </el-row>
    <el-row :gutter="15" style="margin-top:28px" >

      <el-col :span="15">
      <el-col :span="7" >
        <el-card class="box-card" style="height:180px">
          <div>
            <div>账户余额(元):</div>
            <div style="text-align:center;margin-top:45px;color:#9B9EA0;font-size:22px;font-weight:bold;">{{balance+'元'}}</div> 
          </div>
        </el-card>
          <div v-show="openWeBankWallet==0">
          </div>
          <div v-show="openWeBankWallet==2">
             <el-button-group style="width:100%">
                  <el-button style="display:inline;width:50%;margin-top:-4px" @click="setupVisible = true" type="primary" >提现设置</el-button>
                  <el-button style="display:inline;width:50%;margin-top:-4px" @click="withdrawFormVisible = true"   type="primary" >提现申请</el-button>
            </el-button-group>
          </div>
          <div v-show="openWeBankWallet==1">
             <el-button-group style="width:100%">
                  <el-button style="display:inline;width:100%;margin-top:-4px" @click="queryWebBankWallet" type="primary" >查看钱包</el-button>
            </el-button-group>
          </div> 
      </el-col>
      <div v-show="openWeBankWallet==2">
        <el-col :span="6">
            <el-card class="box-card" style="height:180px">
              <div>
                <div style="display:inline-block;width:40%;">银行卡:</div>
                <div v-show="bigScreen" style="display:inline-block;width:25%;"></div>
                <div v-show="!bigScreen" style="display:inline-block;width:7%;"></div>
                <div style="display:inline-block;text-align:right"><span>{{componentStatu}}</span></div>
                <div style="text-align:center;margin-top:40px;color:#9B9EA0;font-size:15px;font-weight:bold;">{{bankname}}</div> 
                <div style="text-align:center;margin-top:10px;color:#9B9EA0;font-size:15px;font-weight:bold;">{{cardnum}}</div> 
              </div> 
            </el-card>
            <div>
                <el-button-group style="width:100%">
                  <el-button style="display:inline;width:100%;margin-top:-4px;border-radius:4px" @click="editParkComponent" type="primary" >修改</el-button>
                </el-button-group>
            </div> 
          </el-col>
      </div>
       <el-col :span="11">
        <el-card class="box-card" style="height:212px">
          <div align="center">
              <div style="text-align:left">车场概况&nbsp;<span style="color:#9B9EA0">(2分钟更新一次)</span>:</div>
              <!--总车位数,剩余车位数,创建时间,更新时间,状态,所属平台,所属服务商,-->
              <div style="font-size:15px;width:350px;text-align:left;padding-top:5px">
                <!--<div class="parkstatus">所属平台:<span class="statustext">{{account.union_name}}</span></div>-->
                <div class="parkstatus">服&nbsp;&nbsp;务&nbsp;&nbsp;商:<span class="statustext">{{account.server_name}}</span></div>
                <div class="parkstatus">车场状态:<span class="statustext">{{status}}</span></div>
                <div class="parkstatus">车位总数:<span class="statustext">{{account.total_plot}}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;空余车位:<span class="statustext">{{account.empty_plot}}</span></div>
                <div class="parkstatus">创建时间:<span class="statustext">{{common.dateformat(account.ctime)}}</span></div>
                <div class="parkstatus">更新时间:<span class="statustext">{{common.dateformat(account.utime)}}</span></div>
              </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="24" style="margin-top:20px">
        <el-card class="box-card" style="height:220px">
          <div>
            <div>车场信息:</div>
            <div style="">
              <el-row style="padding:20px;padding-left:1px">
                 <el-form ref="form" :model="accountModify" label-width="100px" :rules="accountFormRules" style="width:85%">
                    <el-form-item label="车场名称" prop="name">
                      <el-input v-model="accountModify.name"></el-input>
                    </el-form-item>
                    <el-form-item label="车场地址" prop="address">
                      <el-input v-model="accountModify.address"></el-input>
                    </el-form-item>
                    <el-form-item label="车场电话" prop="phone" style="display:none"> 
                      <el-input v-model="accountModify.phone"></el-input>
                    </el-form-item>
                  </el-form>
                  <el-col :span="24" align="right" style="margin-bottom: 15px">
                    <el-button @click="resetEdit" size="small">重置</el-button>
                    <el-button type="primary" @click="editSubmit" size="small" :loading="loading">保存</el-button>
                  </el-col>
              </el-row>
            </div> 
          </div>
        </el-card>
      </el-col>
      </el-col>

      <el-col :span="9" style="margin-left:-8px">
        <el-card class="box-card" style="height:455px">
          <div align="center">
              <div style="text-align:left">岗亭在线状况&nbsp;<span style="color:#9B9EA0">(10秒钟更新一次)</span>:</div>
              <!--总车位数,剩余车位数,创建时间,更新时间,状态,所属平台,所属服务商,-->
              <div style="font-size:15px;text-align:left;padding-top:15px">
                <div style="width:280px;text-align:center;margin-top:100px;color:#9B9EA0" v-show="noStation">暂无在线岗亭</div>
                <div v-for="station in parkstations">
                  <div class="parkstatus"><span class="statustext">岗亭编号:{{station.local_id}}</span>&nbsp;&nbsp;&nbsp;&nbsp;在线状态:<span class="statustext"><img src="../../assets/on.gif" v-show="station.parkstatus"><img src="../../assets/off.gif" v-show="!station.parkstatus"></span></div>
                </div>
              </div>
          </div>
        </el-card>
     </el-col>
    </el-row>
    <!--提现申请-->
	<el-dialog title="提现申请" v-model="withdrawFormVisible" :close-on-click-modal="false" size="tiny" @close="closeWithdraw">
        <el-col :span="24" style="margin-left:5%" >
            <el-form :model="withdrawForm" label-width="110px" :rules="withdrawFormRules" ref="withdrawForm">
				<el-form-item label="提现卡号">
					<el-input v-model="card.card_number" disabled style="width:85%"></el-input>
				</el-form-item>
                <el-form-item label="提现金额(元)" prop="money">
					<el-input v-model="withdrawForm.money" style="width:85%"></el-input>
				</el-form-item>
		    </el-form>
        </el-col>
        <div style="width:100%;text-align:center;margin-bottom:10px">
            <div style="color:#888888;font-size:12px">每笔提现手续费3元</div>
        </div>
			<el-col :span="24" align="right" style="margin-bottom: 15px">
				<el-button @click.native="withdrawFormVisible = false" size="small">取消</el-button>
				<el-button type="primary" @click.native="withdrawSubmit" :loading="withdrawLoading" size="small">提交</el-button>
			</el-col>
	</el-dialog>


        	<el-dialog title="提现设置(二选一)" v-model="setupVisible" :close-on-click-modal="false" size="tiny" @close="closesetup">
                <el-col :span="24" style="margin-left:5%" >
                    <el-form :model="setup" label-width="110px" ref="setup">

                         <el-form-item label="提现周期(天)" >
                            <el-input v-model="setup.cycle" style="width:85%" v-on:input ="cycleinputFunc" :disabled=cycleisdisable></el-input>
                         </el-form-item>


                        <el-form-item label="提现金额(元)" >
                            <el-input v-model="setup.money" style="width:85%" v-on:input ="moneyinputFunc" :disabled=moneyisdisable></el-input>
                        </el-form-item>
                        <el-form-item label="自动提现" >
                             <div>
                               <el-checkbox id="box" v-model="setup.checked" :disabled=checkisdisable @change="selectChecked"></el-checkbox>
                             </div>
                        </el-form-item>
                    </el-form>
                </el-col>
                    <el-col :span="24" align="right" style="margin-bottom: 15px">
                        <el-button type="primary" @click.native="setupSubmit" :loading="withdrawLoading" size="small">保存</el-button>
                    </el-col>
            </el-dialog>
  </section>

</template>

<script>
import { path,carditems,checkPhone,dtypelist,cardtypeitems,otypelist,accountitems,belongitems,settleitems,percision } from '../../api/api';
import common from '../../common/js/common'
import CommonTable from '../../components/CommonTable'

export default {
  components:{
    CommonTable
  },
  data(){
    return{
      loading: false,
      cycleisdisable:false,
      moneyisdisable:false,
      checkisdisable:false,
      withdrawFormVisible:false,
      setupVisible:false,
      openWeBankWallet:0,
      setup:{
        money:'',
        oldmoney:'',
        oldcycle:'',
        cycle:'',
        checked:true,
      },
      bigScreen:false,
      withdrawLoading:false,
      noStation:false,
      account:{},
      card:{},
      cardid:'',
      nocard:false,
      bankname:'无',
      cardnum:'暂未绑定银行卡',
      parkname:'获取中...',
      balance:'获取中...',
      componentStatu:'未提交',
      withdrawForm:{
        money:''
      },
      form:{
        name:''
      },
      status:'',
      accountModify:{
        id:'',
        name:'',
        address:'',
        phone:''
      },
      parkstations:[],
      temp:{},
      accountFormRules:{
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        phone: [
          { validator:checkPhone, required: true,  trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ],
      },
      withdrawFormRules:{
        money: [
          { required: true, message: '请输入金额', trigger: 'blur' }
        ],
      },
    }  
  },
  mounted(){
  },
  methods: {
    selectChecked(){
        var vm=this;
        window.setTimeout(()=> {
            if(vm.checkisdisable){

            }else{
                vm.moneyisdisable = false
                vm.cycleisdisable = false
                if(!vm.setup.checked){
                    vm.setup.money=""
                    vm.setup.cycle=""
                    vm.moneyisdisable = true
                    vm.cycleisdisable = true
                }else{
                     vm.moneyisdisable = false
                     vm.cycleisdisable = false
                }
            }
        },0)
    },
    cycleinputFunc(){
     var vm=this;
     vm.moneyisdisable = false
     vm.checkisdisable = false
     if(this.setup.cycle!=null&&this.setup.cycle!=""){
        vm.setup.money=""

     }
    },
     moneyinputFunc(){
         var vm=this;
         vm.cycleisdisable = false
         vm.checkisdisable = false
         if(this.setup.money!=null&&this.setup.money!=""){
            vm.setup.cycle=""

         }
        },
    getAutoWithDraw(){

         var vm=this;
        			this.$post(path+"/park/autoWithdrawalMoney?token="+sessionStorage.getItem('token'),function(result){
                var ret = eval('('+result+')')
                vm.account=ret;
                if(ret.withdrawal_money>0){
                    vm.setup.money = ret.withdrawal_money
                    vm.setup.oldmoney = ret.withdrawal_money
                }
                if(ret.withdrawal_cycle>0){
                    vm.setup.cycle = ret.withdrawal_cycle
                    vm.setup.oldcycle = ret.withdrawal_cycle
                }
                if(ret.withdrawal_money==0&&ret.withdrawal_cycle==0){
                    vm.setup.checked = false
                    vm.moneyisdisable = true
                    vm.cycleisdisable = true
                }

              });
    },

    getParkAccountInfo(){
      var vm=this;
			this.$post(path+"/park/parkinfo?token="+sessionStorage.getItem('token'),function(result){
        var ret = eval('('+result+')')
        console.log(ret)
        vm.account=ret;
        if(ret.state==1){
          vm.status='已审核'
        }else if(ret.state==0){
          vm.status='未审核'
        }else if(ret.state==2){
          vm.status='禁用'
        }
        vm.parkname=ret.name
        vm.balance=ret.balance.toFixed(percision)
        vm.accountModify.id=ret.id
        vm.openWeBankWallet = ret.openWeBankWallet
        vm.accountModify.name=ret.name
        vm.accountModify.address=ret.address
        vm.accountModify.phone=ret.phone
        vm.temp=common.clone(vm.accountModify)
        if(ret.componentstatu==0){
          vm.componentStatu = '未提交'
        }else if(ret.componentstatu==1){
          vm.componentStatu = '审核完成'
        }else if(ret.componentstatu==2){
          vm.componentStatu = '待审核'
        }else if(ret.componentstatu==3){
          vm.componentStatu = '待补充'
        }
      });
    },
    getParkCardInfo(){
      var vm=this;
			this.$post(path+"/account/querycard?token="+sessionStorage.getItem('token')+"&platform_id="+eval('('+sessionStorage.getItem('user')+')')['comid']+"&user_type=4",function(result){
        var ret = eval('('+result+')')
        if(ret.total<1){
          //无绑定卡
          vm.nocard = true
        }else{
          vm.nocard = false
          vm.card=ret.rows[0]
          vm.cardid=vm.card.id
          vm.bankname=vm.card.bank_name
          vm.cardnum=vm.card.card_number
        }
      });
    },
    resetEdit(){
      this.accountModify=common.clone(this.temp)
    },
    closeWithdraw(){
      this.withdrawForm.money=''
    },
     closesetup(){
          this.setup.cycle = this.setup.oldcycle
          this.setup.money = this.setup.oldmoney
        },
    editSubmit(){
				//发送ajax,提交表单更新
				var vm = this;
        var eform=this.accountModify;
        this.$extend(eform,{'token':sessionStorage.getItem('token')})
        console.log(this.$refs)
        this.$refs.form.validate((valid)=>{
          if(valid){
            vm.loading=true
            vm.$.post(path+'/park/edit',eform,function(ret){
              if(ret>0){
                //更新成功
                vm.getParkAccountInfo();
                vm.$message({
                  message: '更新成功!',
                  type: 'success',
                  duration: 600
                });
                vm.loading=false
              }else{
                //更新失败
                vm.$message({
                  message: '更新失败!',
                  type: 'error',
                  duration: 600
                });
                vm.loading=false
              }
            },"json")
          }
        })
     },
     withdrawSubmit(){
       var vm = this
       var wform = {'cardid':this.cardid,'money':this.withdrawForm.money,'token':sessionStorage.getItem('token')}
       this.$refs.withdrawForm.validate((valid)=>{
         if(valid){
            vm.withdrawLoading=true
            vm.$.post(path+'/kftwithdraw/single',wform,function(ret){
                if(ret.state){
                  //更新成功
                  vm.getParkAccountInfo();
                  vm.$message({
                    message: ret.errmsg,
                    type: 'success',
                    duration: 1000
                  });
                  vm.withdrawLoading=false
                  vm.withdrawFormVisible=false
                }else{
                  //更新失败
                  vm.$message({
                    message: ret.errmsg,
                    type: 'error',
                    duration: 3000
                  });
                  vm.withdrawLoading=false
                }
              },"json")
            }
         })
     },
      setupSubmit(){

            var vm = this
            var wform = {'cycle':this.setup.cycle,'money':this.setup.money,'checked':this.setup.checked?1:0,'token':sessionStorage.getItem('token')}
            this.$refs.setup.validate((valid)=>{
              if(valid){
                 vm.withdrawLoading=true
                 vm.$.post(path+'/kftwithdraw/tosetup',wform,function(ret){
                     if(ret.state){
                       //更新成功
                       vm.getParkAccountInfo();
                       vm.$message({
                         message: ret.errmsg,
                         type: 'success',
                         duration: 1000
                       });
                        vm.setup.oldcycle = vm.setup.cycle
                         vm.setup.oldmoney = vm.setup.money
                       vm.withdrawLoading=false
                       vm.setupVisible=false
                     }else{
                       //更新失败
                       vm.$message({
                         message: ret.errmsg,
                         type: 'error',
                         duration: 3000
                       });
                       vm.withdrawLoading=false
                     }
                   },"json")
                 }
              })
          },
     getParkStatus(){
       console.log('获取车场状态')
        var vm=this;
        this.$post(path+"/park/parkstatus?token="+sessionStorage.getItem('token'),function(result){
          var ret = eval('('+result+')')
          if(ret.total<1){
            //无登录岗亭
            vm.parkstations = []
            vm.noStation=true
          }else{
            //有在线岗亭
            vm.noStation=false
            vm.parkstations = ret.rows
          }

        });
     },
     queryWebBankWallet(){
        console.log('获取微众钱包地址')
        var vm=this;
        var newWin  = window.open()
        this.$post(path+"/park/qryWebankWallet?token="+sessionStorage.getItem('token'),function(result){
            var ret = eval('('+result+')')
            //console.log('微众钱包地址1'+ret.walletUrl)
           newWin.location.href = ret.walletUrl;
        });
     },
     editParkComponent(){
				console.log(this.active)
        sessionStorage.setItem("component_comid",'')
				sessionStorage.setItem("component_fromPath",'/parkaccount')
				this.active="/parkcomponent"
				this.$router.push("/parkcomponent");
     }
  },
  activated(){
      //取屏幕分辨率
      let screenHeight = window.screen.height
      let screenWidth = window.screen.width
      this.bigScreen =screenWidth>1366
      console.log(">>>>>>分辨率宽度"+screenWidth)
      console.log(">>>>>>分辨率"+this.bigScreen)
      this.getAutoWithDraw()
      this.getParkAccountInfo()
      this.getParkCardInfo()
      this.getParkStatus()
      window.setInterval(this.getParkStatus,10000)
      window.setInterval(this.getParkAccountInfo,120000)
	},
  watch:{
    account:function(val,oldVal){
      this.account = val
    }
  },

}

</script>

<style>
  .parkstatus{
    margin-top:5px;
  }
  .statustext{
    font-weight:bold;margin-left:10px;color:#9B9EA0;word-wrap: break-word
  }
</style>