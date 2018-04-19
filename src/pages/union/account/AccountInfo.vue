<template>
  <section style="padding: 10px;">

    <!--账户名称-->
    <el-row>
      <el-col :span="24" style="font-size: 18px;font-weight: bold;">
           &nbsp;账号名称: <span style="color: red">{{name}}</span> 
      </el-col>
    </el-row>
    </br></br>

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
import { path,checkPhone } from '../../../api/api';
import common from '../../../common/js/common'
import CommonTable from '../../../components/CommonTable'

export default {
  data(){
    return{
      name:'',
      ctime:'',
      utime:'',
      loading:false,
      account:{},
      tempaccount:{},
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
    this.getUnionAccountInfo()
  },
  activated(){
    this.getUnionAccountInfo()
	},
  methods: {
    getUnionAccountInfo:function(){
      var vm=this;
			this.$getJSON(path+"/getdata/unionaccount?token="+sessionStorage.getItem('token'),function(ret){
        vm.account=ret;
        vm.name=ret.name;
        vm.ctime=ret.reg_time*1000;
        vm.utime=ret.update_time*1000;
        vm.tempaccount=common.clone(ret)
      });
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
  }

}

</script>