<template>
  <section style="padding: 10px;">

    <!--账户名称-->
    <el-row>
      <el-col :span="24" style="font-size: 18px;font-weight: bold;">
           &nbsp;账户名称: <span style="color: red">{{name}}</span>
           &nbsp;&nbsp;账号余额: <span style="color: red">{{account.balance.toFixed(2)+'元'}}</span> 
      </el-col>
    </el-row>
    </br>
    <el-row>
        <el-col :span="24" style="font-size: 18px;font-weight: bold;">
          <el-button type="primary" :plain="true"  @click="recharge"><span style="font-weight: bold;">充值申请</span></el-button> 
          <el-button type="primary" :plain="true"  :disabled="true" @click="withdrawFormVisible = true"><span style="font-weight: bold;">提现申请</span></el-button>
      </el-col>
    </el-row>
    </br>

  <!--账号信息-->
  <el-card class="box-card" style="display:none">
    <common-table 
			:queryapi="queryapi" 
			:editapi="editapi" 
      :addapi="addapi"
			:fieldsstr="fieldsstr"
			:tableitems="tableitems"
			:editFormRules="editFormRules"
			:btswidth="btswidth"
      :show-right="showRight"
      :hide-search="hideSearch"
      :hide-export="hideExport"
      :addtitle="addtitle"
      :show-left-title="showLeftTitle"
      :left-title="leftTitle"
      ref="accountcard"
		></common-table>
  </el-card>
  </br>

  <!--充值申请-->
		<el-dialog title="充值申请" v-model="rechargeFormVisible" :close-on-click-modal="false" size="tiny">
      <el-col :span="24" style="margin-left:5%" >
			<el-form :model="rechargeForm" label-width="100px" :rules="rechargeFormRules" ref="rechargeForm" style="width:80%"> 
				<el-form-item label="充值金额">
					<el-input v-model="rechargeForm.money"></el-input>
				</el-form-item>
			</el-form>
      </el-col>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="rechargeFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="rechargeSubmit" :loading="rechargeLoading">提交</el-button>
			</div>
		</el-dialog>

    <!--提现申请-->
		<el-dialog title="提现申请" v-model="withdrawFormVisible" :close-on-click-modal="false" size="tiny">
      <el-col :span="24" style="margin-left:5%" >
			<el-form :model="withdrawForm" label-width="100px" :rules="withdrawFormRules" ref="withdrawForm" style="width:80%"> 
				<el-form-item label="银行卡 ">
					<el-select v-model="withdrawForm.cardid" placeholder="请选择" style="width:100%">
            <el-option
              v-for="item in card"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled">
            </el-option>
          </el-select>
				</el-form-item>
				<el-form-item label="提现金额">
					<el-input v-model="withdrawForm.money"></el-input>
				</el-form-item>
			</el-form>
      </el-col>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="withdrawFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="withdrawSubmit" :loading="withdrawLoading">提交</el-button>
			</div>
		</el-dialog>

   <!--资金流水table-->
  <el-card class="box-card" style="width:500px">

    <el-form :model="account" label-width="110px" ref="editForm" :rules="accountFormRules" style="width:98%;margin-left:30px">
			<el-input v-model="account.id" style="display:none"></el-input>
      <el-form-item label="名称" prop="name" style="height:30px">
        <el-input v-model="account.name" style="width:200px;" ></el-input>
      </el-form-item>

      <el-form-item label="联系电话" prop="phone" style="height:30px">
        <el-input v-model="account.phone" style="width:200px"></el-input>
      </el-form-item>

      <el-form-item label="地址" prop="address" style="height:30px">
        <el-input v-model="account.address" style="width:200px"></el-input>
      </el-form-item>

      <el-form-item label="注册时间" prop="reg_time" style="height:30px">
        <el-date-picker
          :disabled="true"
          v-model="ctime"
          type="datetime"
          style="width:200px"
          placeholder="选择日期时间">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="更新时间" prop="update_time" style="height:30px">
        <el-date-picker
          :disabled="true"
          v-model="utime"
          type="datetime"
          style="width:200px"
          placeholder="选择日期时间">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="状态" prop="state" style="height:30px">
       <el-select v-model="account.state" :disabled="true" style="width:200px">
          <el-option label="未审核" :value="0"></el-option>
          <el-option label="正常" :value="1"></el-option>
          <el-option label="禁用" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <!--
      <el-form-item label="是否支持清分" prop="isdistibution" style="height:30px">
       <el-select v-model="account.isdistibution">
          <el-option label="否" :value="0"></el-option>
          <el-option label="是" :value="1"></el-option>
        </el-select>
      </el-form-item>
      -->
      </br>

      
		</el-form>	
		<el-col :span="24" align="right" style="margin-bottom: 15px">
			<el-button @click="resetEdit" size="small">重置</el-button>
			<el-button type="primary" @click="editSubmit" size="small" :loading="loading">保存</el-button>
		</el-col>
  </el-card>


  </section>

</template>

<script>
import { path,carditems,checkPhone,dtypelist,cardtypeitems,otypelist,accountitems,belongitems,settleitems } from '../../../api/api';
import common from '../../../common/js/common'
import CommonTable from '../../../components/CommonTable'

export default {
  components:{
    CommonTable
  },
  data(){
    return{
      loading: false,
      rechargeFormVisible: false,
      withdrawFormVisible: false,
      dialogsize:'small',
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
        cardid:'',
        money:''
      },
      card: [{
        value: '123',
        label: '卡1'
      }, {
        value: '234',
        label: '卡2',
      }],
      showRight:true,
      hideSearch:true,
      hideExport:true,
      showLeftTitle:true,
      withdrawLoading:false,
      rechargeLoading:false,
      leftTitle:'账号信息',
      addtitle:'添加银行卡',
      queryapi:'/account/querycard',
      editapi:'/account/editcard',
      addapi:'/account/addcard',
      btswidth:'70',
      fieldsstr:'id__name__uin__card_number___mobile__atype__area__bank_name__bank_pinkt__type__state__city__pay_type__pay_date__use__bank_no__note',
      tableitems:[
        {label:'账号类型',prop:'atype',width:'120',type:'selection', selectlist:accountitems,editable:true,addable:true,
          format:(row)=>{return common.nameformat(row,accountitems,'atype')}
        },
        {label:'银行卡类型',prop:'card_type',width:'150',type:'selection',selectlist:cardtypeitems,editable:true,addable:true,
          format:(row)=>{return common.nameformat(row,cardtypeitems,'type')}
        },
        {label:'编号',prop:'id',width:'100',type:'number'},
        {label:'姓名',prop:'name',width:'120',type:'str',editable:true,addable:true},
        {label:'收费员',prop:'uin',width:'120',type:'str',editable:true,addable:true},
        {label:'账号',prop:'card_number',width:'250',type:'str',editable:true,addable:true},
        {label:'手机',prop:'mobile',width:'130',type:'str',editable:true,addable:true},
        {label:'开户地区',prop:'area',width:'150',type:'str',editable:true,addable:true},
        {label:'所属',prop:'type',width:'100',type:'selection',selectlist:belongitems,editable:true,addable:true,
          format:(row)=>{return common.nameformat(row,belongitems,'type')}
        },
        {label:'状态',prop:'state',width:'100',type:'selection',selectlist:carditems,editable:true,addable:true,
          format:function(row){
            return common.nameformat(row,carditems,'state')
          }
        },
        {label:'收款人所在城市',prop:'city',width:'160',type:'str',editable:true,addable:true},
        {label:'结算方式',prop:'pay_type',width:'150',type:'selection',selectlist:settleitems,editable:true,addable:true,
          format:(row)=>{return common.nameformat(row,settleitems,'type')}
        },
        {label:'期望日',prop:'pay_date',width:'150',type:'str',editable:true,addable:true},
        {label:'用途',prop:'use',width:'200',type:'str',editable:true,addable:true},
        {label:'收方行号',prop:'bank_no',width:'200',type:'str',editable:true,addable:true},
        {label:'备注',prop:'note',width:'200',type:'str',editable:true,addable:true},
      ],
      withdrawFormRules:{},
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
      }
    }  
  },
  mounted(){
  },
  methods: {
    getUnionAccountInfo(){
      var vm=this;
			this.$getJSON(path+"/getdata/unionaccount?token="+sessionStorage.getItem('token'),function(ret){
        vm.account=ret;
        vm.name=ret.name;
        vm.ctime=ret.reg_time*1000;
        vm.utime=ret.update_time*1000;
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
        console.log(this.account)
        var eform=this.account;
        this.$extend(eform,{'token':sessionStorage.getItem('token')})
        console.log(this.$refs)
        this.$refs.editForm.validate((valid)=>{
          if(valid){
            vm.loading=true
            vm.$.post(path+'/account/editaccount',eform,function(ret){
              if(ret>0){
                //更新成功
                vm.getUnionAccountInfo();
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
    }
  },
  activated(){
			this.$refs['accountcard'].getTableData({})
      this.getUnionAccountInfo()
	},
  watch:{
    account:function(val,oldVal){
      this.account = val
    }
  }

}

</script>