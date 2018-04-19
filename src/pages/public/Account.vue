<template>
  <section style="padding: 10px;">

    <!--账户名称-->
    <el-row>
      <el-col :span="24" style="font-size: 18px;font-weight: bold;">
           &nbsp;账户名称&nbsp;: <span style="color: red">{{name}}</span>
      </el-col>
    </el-row>

     <el-row :gutter="15" style="margin-top:20px">
      <el-col :span="8">
        <el-card class="box-card" style="height:180px">
          <div>
            <div>账户余额(元)&nbsp;:</div>
            <div style="text-align:center;margin-top:45px;color:#9B9EA0;font-size:22px;font-weight:bold;">{{balance+'元'}}</div> 
          </div>
        </el-card>
        <el-button-group style="width:100%">
          <el-button style="display:inline;width:50%;margin-top:-4px" type="primary"  @click="recharge"><span style="font-weight: bold;">充值</span></el-button>
          <el-button style="display:inline;width:50%;margin-top:-4px" :disabled="nocard" type="primary" @click="withdrawFormVisible = true"><span style="font-weight: bold;">提现</span></el-button>
        </el-button-group>
      </el-col>
     <el-col :span="6">
        <el-card class="box-card" style="height:212px">
          <div >
            <div>银行卡&nbsp;:</div>
            <div style="text-align:center;margin-top:40px;color:#9B9EA0;font-size:15px;font-weight:bold;">{{bankname}}</div> 
            <div style="text-align:center;margin-top:10px;color:#9B9EA0;font-size:15px;font-weight:bold;">{{cardnum}}</div> 
          </div>
        </el-card>
      </el-col>
      <el-col :span="7">
        <el-card class="box-card" style="height:212px">
          <div align="center">
              <div style="text-align:left">概况&nbsp;:</div>
              <!--总车位数,剩余车位数,创建时间,更新时间,状态,所属平台,所属服务商,-->
              <div style="font-size:15px;width:350px;text-align:left;padding-top:10px">
                <div class="parkstatus" v-if="roleid==3||roleid==5">所属平台:<span class="statustext">{{account.union_name}}</span></div>
                <div class="parkstatus">{{typename}}状态:<span class="statustext">{{status}}</span></div>
                <div class="parkstatus">创建时间:<span class="statustext">{{common.dateformat(ctime)}}</span></div>
                <div class="parkstatus">更新时间:<span class="statustext">{{common.dateformat(utime)}}</span></div>
              </div>
          </div>
        </el-card>
      </el-col>
      </el-row>
 
    <!--提现申请-->
		<el-dialog title="提现申请" v-model="withdrawFormVisible" :close-on-click-modal="false" size="tiny" @close="closeWithdraw">
      <el-col :span="24" style="margin-left:5%" >
			<el-form :model="withdrawForm" label-width="100px" :rules="withdrawFormRules" ref="withdrawForm" style="width:92%"> 
				<div style="width:100%;text-align:center">
          <div style="color:#888888;font-size:12px;margin-bottom:25px">账户余额为0元时, 本平台会员不能使用余位查询和自动扣费功能</div>
        </div>
        <el-form-item label="银行卡 ">
          <el-input v-model="cardnum" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="提现金额" prop="money">
					<el-input v-model="withdrawForm.money"></el-input>
				</el-form-item>
			</el-form>
      </el-col>
			<div style="width:100%;text-align:center;margin-bottom:10px">
        <div style="color:#888888;font-size:12px">单笔500元以下,提现手续费3元</div>
      </div>
			<el-col :span="24" align="right" style="margin-bottom: 15px">
				<el-button @click.native="withdrawFormVisible = false" size="small">取消</el-button>
				<el-button type="primary" @click.native="withdrawSubmit" :loading="withdrawLoading" size="small">提交</el-button>
      </el-col>
      
    </el-dialog>


    <!--可修改信息-->
    <el-row :gutter="15" style="margin-top:20px">
      <el-col :span="14">
        <el-card class="box-card">
          <div style="text-align:left">{{typename}}信息&nbsp;:</div>
          <el-form :model="account" label-width="110px" ref="editForm" :rules="accountFormRules" style="width:80%;margin-left:30px">
            <el-input v-model="account.id" style="display:none"></el-input>
            <el-form-item label="名称" prop="name" style="height:30px">
              <el-input v-model="account.name"  ></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="phone" style="height:30px">
              <el-input v-model="account.phone" ></el-input>
            </el-form-item>
            <el-form-item label="地址" prop="address" style="height:30px">
              <el-input v-model="account.address"></el-input>
            </el-form-item>
            </br>
          </el-form>	
          <el-col :span="24" align="right" style="margin-bottom: 15px">
            <el-button @click="resetEdit" size="small">重置</el-button>
            <el-button type="primary" @click="editSubmit" size="small" :loading="loading">保存</el-button>
          </el-col>
        </el-card>
      </el-col>
  </el-row>

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
      roleid:'',
      unionid:'',
      serverid:'',
      operatorid:'',
      loading: false,
      rechargeFormVisible: false,
      withdrawFormVisible: false,
      name:'',
      ctime:'',
      utime:'',
      tempaccount:{},
      account:{
        balance:0,
      },
      rechargeForm:{
        cardid:'',
        money:''
      },
      withdrawForm:{
        money:''
      },
      withdrawLoading:false,
      rechargeLoading:false,
      withdrawFormRules:{
        money: [
          { required: true, message: '请输入金额', trigger: 'blur' }
        ],
      },
      rechargeFormRules:{},
      editFormRules:{},
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
      bankname:'无',
      queryaccount:'',
      editaccount:'',
      unionname:'',
      balance:'获取中...',
      name:'获取中...',
      typename:'',
      cardnum:'',
      nocard:'',
      status:'',
    }  
  },
  mounted(){
    var user = sessionStorage.getItem('user');
    if (user) {
      user = JSON.parse(user);
      this.roleid = user.roleid
      if(this.roleid==2){
        this.typename='厂商平台'
        this.unionid=user.unionid
        this.queryaccount='/union/unioninfo'
        this.editaccount='/union/unionedit'
      }else if(this.roleid==3){
        this.typename='服务商'
        this.serverid=user.serverid
        this.queryaccount='/server/serverinfo'
        this.editaccount='/server/serveredit'
      }else if(this.roleid==5){
       this.typename='运营商'
       this.operatorid=user.operatorid
       this.queryaccount='/operator/operatorinfo'
       this.editaccount='/operator/operatoredit'
     }
    }
  },
  methods: {
    getAccountInfo(){
      var vm=this;
			this.$post(path+this.queryaccount+"?token="+sessionStorage.getItem('token'),function(result){
        var ret = JSON.parse(result)
        vm.account=ret;
        //vm.balance=ret.balance.toFixed(percision)
        var b = ret.balance+''
        console.log(typeof(b))
        var start = b.indexOf('.')
        vm.balance=b.substring(0,start+percision+1)
        vm.name=ret.name;
        if(vm.roleid==3){
          vm.unionname=ret.union_name
          vm.ctime=ret.ctime
          vm.utime=ret.utime
        }else if(vm.roleid==2){
          vm.ctime=ret.reg_time
          vm.utime=ret.update_time
        }else if(vm.roleid==5){
          vm.unionname=ret.union_name
          vm.ctime=ret.ctime
          vm.utime=ret.utime
        }
        if(ret.state==1){
          vm.status='已审核'
        }else if(ret.state==0){
          vm.status='未审核'
        }else if(ret.state==2){
          vm.status='禁用'
        }
        vm.tempaccount=common.clone(ret)
      });
    },
    recharge(){
      window.open(path+'/recharge/kftPreRecharg?token='+sessionStorage.getItem('token'));
    },
    resetEdit(){
      this.account=common.clone(this.tempaccount)
    },
    editSubmit(){
      //发送ajax,提交表单更新
      var vm = this;
      var eform=this.account;
      this.$extend(eform,{'token':sessionStorage.getItem('token')})
      console.log(this.$refs)
      this.$refs.editForm.validate((valid)=>{
        if(valid){
          vm.loading=true
          vm.$.post(path+this.editaccount,eform,function(ret){
            if(ret>0){
              //更新成功
              vm.getAccountInfo();
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
    //获取银行卡信息
    getCardInfo(){
      var vm=this;
      var platform_id 
      if(this.roleid==2){
        platform_id=this.unionid
      }else if(this.roleid==3){
        platform_id=this.serverid
      }else if(this.roleid==5){
        platform_id=this.operatorid
      }
			this.$post(path+"/account/querycard?token="+sessionStorage.getItem('token')+"&platform_id="+platform_id+"&user_type="+this.roleid,function(result){
        var ret = JSON.parse(result)
        if(ret.total<1){
          //无绑定卡
          vm.nocard = true
        }else{
          vm.nocard = false
          vm.card=ret.rows[0]
          vm.cardid=ret.rows[0].id
          vm.bankname=ret.rows[0].bank_name
          vm.cardnum=ret.rows[0].card_number
        }
      });
    },
    closeWithdraw(){
      this.withdrawForm.money=''
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
                  vm.getAccountInfo();
                  vm.$message({
                    message: ret.errmsg,
                    type: 'success',
                    duration: 3000
                  });
                  vm.withdrawLoading=false
                  vm.withdrawFormVisible=false
                }else{
                  //更新失败
                  vm.$message({
                    message: ret.errmsg,
                    type: 'error',
                    duration: 5000
                  });
                  vm.withdrawLoading=false
                }
              },"json")
            }
         })
     },
  },
  activated(){
      this.getAccountInfo()
      this.getCardInfo()
	},
  watch:{
    account:function(val,oldVal){
      this.account = val
    }
  }

}

</script>

<style>
.el-button+.el-button {
    margin-left: 0px;
}
.parkstatus{
  margin-top:12px
}
.statustext{
  font-weight:bold;margin-left:10px;color:#9B9EA0
}
</style>