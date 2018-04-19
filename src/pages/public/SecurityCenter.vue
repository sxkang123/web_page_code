<template>
  
<div class="security-content">  
      
      <div class="security-info">
        <div class="security-left">管理员:</div>
        <div class="security-middle">{{userinfo.name}}</div>
        <div class="security-right"><el-button type="text" @click="editUserInfo=true">修改</el-button></div>
      </div>

      <div class="security-info">
        <div class="security-left">注册时间:</div>
        <div class="security-middle">{{ctime}}</div>
        <div class="security-right"></div>
      </div>

      <div class="security-info">
        <div class="security-left">上次登录时间:</div>
        <div class="security-middle">{{ltime}}</div>
        <div class="security-right"></div>
      </div>

       <div class="security-info">
        <div class="security-left">密保手机:</div>
        <div class="security-middle" v-if="hasMobile">您已绑定了手机号 <span style="color:green">{{userinfo.mobile}}</span> [您的手机为密保手机，可以找回或重置密码，但不能用于登录]</div>
        <div class="security-middle" v-if="!hasMobile">您尚未绑定手机，请联系系统管理员完成密保手机的首次设置。</div>
        <div class="security-right">{{mobileSetted}} | <el-button type="text" @click="handleGetCode(1)">修改</el-button></div>
      </div>

       <div class="security-info">
        <div class="security-left">登录密码:</div>
        <div class="security-middle">安全性高的密码可以使帐号更安全。建议您定期更换密码，设置一个包含数字，字母或下划线中至少两项且长度超过6位的密码。</div>
        <div class="security-right">已设置 | <el-button type="text" @click="handleGetCode(2)">修改</el-button></div>
      </div>

       <div class="security-info" v-if="false">
        <div class="security-left">秘钥:</div>
        <div class="security-middle">秘钥是登录SDK的身份密码，具有极高的安全性，请妥善保管。</div>
        <div class="security-right"><el-button type="text" @click="handleGetCode(3)">查看</el-button>| <el-button type="text" @click="handleGetCode(4)">重置</el-button></div>
      </div>


      <!--对话框-->
      <div>
        <!--获取验证码-->
        <el-dialog
          :title="title"
          v-model="codeVisible"
          size="tiny"
          :close-on-click-modal="false"
          @close="closeGetPass">
          
          <div v-if="showCode">
          <el-form ref="codeform" :model="getpass" label-width="80px" style="width:90%">
            <el-form-item label="密保手机" prop="mobile">
              <el-input v-model="getpass.mobile" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="验证码">
              <el-input v-model="getpass.code" style="width:50%"></el-input>
              <el-button  type="primary" :plain="true" :disabled="codeBtn" @click="getCode" style="color:black">{{passinfo}}</el-button>
            </el-form-item>
          </el-form>
          <el-col align="right" style="margin-bottom:18px;margin-top:5px;">
            <el-button @click="codeVisible = false" size="small">取 消</el-button>
            <el-button type="primary" @click="verifyCode" size="small">确 定</el-button>
          </el-col>
          </div>

          <!--修改手机-->
          <div v-if="showModifyMobile">
          <el-form ref="mobileform" :model="resetMobile"  label-width="100px" style="width:90%">
            <el-form-item label="新手机号" >
              <el-input v-model="resetMobile.mobile"></el-input>
            </el-form-item>
            <el-form-item label="验证码">
              <el-input v-model="resetMobile.code" style="width:50%"></el-input>
              <el-button  type="primary" :plain="true" :disabled="codeBtn" @click="getNewCode" style="color:black">{{passinfo}}</el-button>
            </el-form-item>
          </el-form>
          <el-col align="right" style="margin-bottom:18px;margin-top:5px;">
            <el-button @click="codeVisible = false" size="small">取 消</el-button>
            <el-button type="primary" @click="modifyMobile" size="small" :loading="loading">确 定</el-button>
          </el-col>
          </div>

          <!--重置密码-->
          <div v-if="showResetPass">
          <el-form ref="passform" :model="newpass" :rules="resetPassRules" label-width="100px" style="width:90%">
            <el-form-item label="输入新密码" prop="pass1">
              <el-input v-model="newpass.pass1" type="password" @focus="focus"></el-input>
            </el-form-item>
            <el-form-item label="再次输入" prop="pass2">
              <el-input v-model="newpass.pass2" type="password"></el-input>
            </el-form-item>
          </el-form>
          <el-col align="right" style="margin-bottom:18px;margin-top:5px;">
            <el-button @click="codeVisible = false" size="small">取 消</el-button>
            <el-button type="primary" @click="resetPass" size="small">确 定</el-button>
          </el-col>
          </div>

          <!--查看当前秘钥-->
         <div v-if="showCurUkey">
          <el-form ref="ukeyform" label-width="130px" style="width:90%">
            <el-form-item label="秘钥(切勿泄露)">
              <el-input v-model="ukey"></el-input>
            </el-form-item>
          </el-form>
          <el-col align="right" style="margin-bottom:18px;margin-top:5px;">
            <el-button type="primary" @click="codeVisible = false" size="small">关 闭</el-button>
          </el-col>
          </div>

          <!--重置秘钥-->
         <div v-if="showResetUkey">
         
         <div align="center" style="margin-bottom:5px">
            <div style="color:#888888;margin-bottom:10px">注意:秘钥重置后当前SDK的所有连接都会失效!<br>重置后,请使用新的秘钥连接服务器</div>
            <el-button type="warning" @click="handleResetUkey">点击重置</el-button>
         </div>
          <el-col align="right" style="margin-bottom:18px;margin-top:5px;">
            <el-button type="primary" @click="codeVisible = false" size="small">关 闭</el-button>
          </el-col>
          </div>

        </el-dialog>
        
        <!--重置秘钥确认对话框-->
        <el-dialog
          title="警告"
          v-model="confirmKey"
          size="tiny">
          <div style="color:red;font-size:15px;text-align:center;margin-bottom:20px">点击确定重置秘钥,此操作不可恢复!</div>
          <el-col align="right" style="margin-bottom:18px;margin-top:5px;">
            <el-button size="small" @click="confirmKey=false">取 消</el-button>
            <el-button type="primary" size="small" @click="resetUkey">确 定</el-button>
          </el-col>
        </el-dialog>

        <!--修改管理员名称对话框-->
        <el-dialog
          title="修改名称"
          v-model="editUserInfo"
          v-if="editUserInfo"
          size="tiny">
          <el-form :model="user" :rules="userFormRules" ref="userForm" label-width="80px" style="width:90%">
            <el-form-item label="名称" prop="name">
              <el-input v-model="user.name"></el-input>
            </el-form-item>
          </el-form>
          <el-col align="right" style="margin-bottom:18px;margin-top:5px;">
            <el-button size="small" @click="editUserInfo=false">取 消</el-button>
            <el-button type="primary" size="small" @click="editUser">确 定</el-button>
          </el-col>

        </el-dialog>


      </div>

</div>
</template> 
<script>
import CryptoJS from 'crypto-js';
import {path,checkPass,checkMobile} from '../../api/api'
import common from '../../common/js/common'
var key = CryptoJS.enc.Utf8.parse("zldboink20170613");   
var iv  = CryptoJS.enc.Utf8.parse('zldboink20170613');
var timer;
  export default {
    //components:{
	//	},
    data() {
      return {
        loading:false,
        showCode:true,
        showModifyMobile:false,
        showResetPass:false,
        showCurUkey:false,
        showResetUkey:false,
        title:'获取验证码',
        showUkey:false,
        codeVisible:false,
        confirmKey:false,
        editUserInfo:false,
        token:sessionStorage.getItem('token'),
        roleid:'',
        platformid:'',
        userinfo:{},
        ctime:'',
        ltime:'',
        ukey:'',
        codeBtn:false,
        getpass:{
          mobile:'',
          code:''
        },
        resetMobile:{
          mobile:'',
          code:''
        },
        newpass:{
          pass1:'',
          pass2:''
        },
        passinfo:'获取验证码',
        mobileSetted:'已设置',
        hasMobile:true,
        opt:'',
        resetPassRules:{
          pass1: [
            { validator:checkPass, required: true, trigger: 'blur' }
          ],
          pass2: [
            { validator:checkPass, required: true, trigger: 'blur' }
          ],
			  },
        mobileRules:{
          mobile: [
            { validator:checkMobile, required: true, trigger: 'blur' }
          ],
        },
        userFormRules:{
          name: [
            { required: true, message: '名称不能为空', trigger: 'blur' }
          ],
        },
        user:{
          name:''
        },
      }
    },
    //props:[],
    methods: {
      getUserInfo(){
        var vm = this
        var params = {'token':this.token,'platform_id':this.platformid,'user_type':this.roleid}
        this.$.ajax({
          url:path+'/user/admin',
          type:'POST',
          data:params,
          async:false,
          success:function(result){
            var ret = JSON.parse(result)
            vm.userinfo = ret[0]
            vm.getpass.mobile = vm.userinfo.mobile
            vm.ctime = common.dateformat(vm.userinfo.reg_time)
          }
        })
      },
      //获取秘钥
      getUKey(){
        this.showUKeyVisible = true
        var vm = this
        var params = {'token':this.token,'unionid':this.platformid}
        this.$post(path+'/union/getukey',params,function(result){
          var ret = CryptoJS.AES.decrypt(result,key, {iv:iv,mode:CryptoJS.mode.CBC}).toString(CryptoJS.enc.Utf8)
          vm.ukey = ret
        })
      },
      handleGetCode(type){
        this.opt = type
        //1.判断是否有绑定手机
        if(this.getpass.mobile==null||this.getpass.mobile==''){
          this.$notify({
            title: '提示',
            message: '您尚未设置密保手机,请先联系客服完成密保手机的首次设置,完成首次设置之后,可自主修改密保手机',
            duration: 5000,
            type: 'warning'
          });
        }else{
          //2.如果有,打开获取验证码对话框;如果没有,提示联系系统管理员设置密保手机
          this.codeVisible = true
        }
      },
      getCode(){
        //获取验证码
        var params = {'token':this.token}
        this.code(params)
      },
      getNewCode(){
        var vm = this
        if(this.opt==1){
          if(this.resetMobile.mobile==''&&this.showModifyMobile){
            this.showMessage('请输入手机号!','warning')
            return
          }else if(!(/^1[34578]\d{9}$/.test(vm.resetMobile.mobile))){
            this.showMessage('请输入正确的手机号!','error')
            return
          }
        }
        var params = {'token':this.token,'mobile':this.resetMobile.mobile}
        this.code(params)
      },
      code(params){
        var vm = this
        var win = window
        this.$post(path+'/user/getcode',params,function(result){
          var ret = JSON.parse(result)
          if(ret.state==0){
            //失败
            vm.$message({
                message: '网络异常,验证码发送失败!',
                type: 'warning',
                duration:2000
            });
          }else{
            vm.$message({
              message: '验证码发送成功!',
              type: 'success'
            });
            vm.time=60
            vm.codeBtn = true
            timer = win.setInterval(vm.getCodeBtn,1000)
          }
        })
      },
      getCodeBtn(){
        if(this.time>0){
          this.time -= 1
          this.passinfo = this.time + '秒后重发'
        }
        if(this.time==0){
          this.codeBtn=false
          this.passinfo='获取验证码'
        }
      },
      closeGetPass(){
          this.getpass.code=''
          window.clearInterval(timer)
          this.codeBtn=false
          setTimeout(()=>{this.passinfo='获取验证码'},100)
          this.title = '获取验证码'
          setTimeout(()=>{
            this.newpass = {}
            this.resetMobile = {}
            this.showCode = true
            this.showCurUkey = false
            this.showModifyMobile = false
            this.showResetPass = false
            this.showResetUkey = false
          },300)
      },
      verifyCode(){//验证验证码
        var vm = this
        if(this.getpass.code==null||this.getpass.code==''){
          vm.$message({
                message: '请输入验证码!',
                type: 'error',
                duration:2000
          })
          return
        }
        if(this.opt==3){
          this.getUKey()
        }
        var win = window
        var params = {'token':this.token,'code':this.getpass.code}
        this.$post(path+'/user/verifycode',params,function(result){
          var ret = JSON.parse(result)
          if(ret.state==1){
            //ok
            console.log(vm.opt)
            vm.showCode = false
            if(vm.opt==1){//修改手机
              vm.title = '修改密保手机'
              vm.showModifyMobile = true
              vm.getpass.code=''
              win.clearInterval(timer)
              vm.codeBtn=false
              setTimeout(()=>{vm.passinfo='获取验证码'},100)
            }else if(vm.opt==2){//{重置密码
              vm.title = '重置登录密码'
              vm.showResetPass = true
            }else if(vm.opt==3){//查看秘钥
              vm.title = '查看秘钥'
              vm.showCurUkey = true
            }else if(vm.opt==4){//重置秘钥
              vm.title = '重置秘钥'
              vm.showResetUkey = true
            }

          }else{
            //验证码错误
            vm.$message({
                message: '验证码错误!',
                type: 'error',
                duration:2000
             });
          }
        })
      },
      //重置密码
      resetPass(){
        var vm = this
        if(this.newpass.pass1!=this.newpass.pass2){
            vm.$message({
              message: '两次密码输入不一致!',
              type: 'error',
              duration:2000
            });
            return
        }else if(this.newpass.pass1==null||this.newpass.pass2==null){
          this.showMessage('密码不能为空!','warning')
          return
        }
        var params = {'token':this.token,'passwd':this.newpass.pass1}
        vm.loading = true
        this.$refs.passform.validate((valid)=>{
          if(valid){
            vm.$post(path+'/user/resetpwd',params,function(result){
              var ret = JSON.parse(result)
              if(ret.state==1){
                //成功
                vm.$message({
                  message: '重置密码成功!',
                  type: 'success',
                  duration:2000
                });
                setTimeout(()=>{vm.loading=false},3000)
                vm.codeVisible = false
              }else{
                //失败
                vm.$message({
                  message: '网络异常,密码重置失败!',
                  type: '',
                  duration:3000
                });
              }

            })
          }
        })
      },
      //重置密保手机
      modifyMobile(){
        if(this.resetMobile.mobile==''){
          this.showMessage('请输入新手机号','warning')
          return
        }else if(this.resetMobile.code==''){
          this.showMessage('请输入验证码','warning')
          return
        }
        var vm = this
        var params = {'token':this.token,'platform_id':this.platformid,'mobile':this.resetMobile.mobile,'code':this.resetMobile.code}
        vm.loading = true
        this.$post(path+'/user/resetmobile',params,function(result){
          var ret = JSON.parse(result)
          if(ret.state==-2){
            vm.showMessage('验证码错误!','error')
          }else if(ret.state=1){
            //修改成功
            vm.showMessage('重置密保手机成功!','success')
            var m = vm.resetMobile.mobile
            var mm = m.substring(0,3)+'****'+m.substring(7,11)
            vm.getpass.mobile = mm
            vm.userinfo.mobile = mm
            setTimeout(()=>{vm.loading=false},3000)
            vm.codeVisible = false
          }else{
            vm.showMessage('网络异常,修改失败!','error')
          }
        })
      },
      //重置秘钥
      handleResetUkey(){
        this.confirmKey=true
      },
      resetUkey(){
        var vm = this
        var params = {'token':this.token}
        this.$post(path+'/union/resetukey',params,function(result){
          var ret = JSON.parse(result)
          if(ret.state==1){
            vm.showMessage('秘钥重置成功!请使用新的秘钥连接服务器','success',5000)
            vm.ukey = ret.ukey
            vm.showCurUkey = true
            vm.showResetUkey = false
          }else{
            vm.showMessage('网络异常,重置失败!','warning')
          }
            vm.confirmKey = false

        })
      },
      editUser(){
        var vm = this
        var params = {'token':this.token,'name':this.user.name}
        this.$post(path+'/user/edituser',params,function(result){
          var ret = JSON.parse(result)
          if(ret.state==1){
            vm.showMessage('修改管理员名称成功!','success',1000)
            vm.editUserInfo = false
            vm.userinfo.name = vm.user.name
            vm.$parent.$parent.$parent.$parent.sysUserName = vm.user.name
          }else{
            vm.showMessage('网络异常,修改失败!','error',3000)
          }
          vm.user.name = ''
        })

      },
      focus(){
        
      },
      showMessage(msg,type,duration){
        if(duration==null){
          duration==2000
        }
        this.$message({
          message: msg,
          type: type,
          duration:duration
        });
      }
    },
    mounted(){
    },
    activated(){
      var user = sessionStorage.getItem('user')
      user = JSON.parse(user)
      this.roleid = user.roleid
      this.ltime = common.dateformat(user.lastlogin)
      if(user.roleid=='1'){
        this.platformid = 10001
      }else if(user.roleid=='2'){
        this.platformid = user.unionid
      }else if(user.roleid=='3'){
        this.platformid = user.serverid
      }else if(user.roleid=='4'){
        this.platformid = user.comid
      }else if(user.roleid=='5'){
        this.platformid = user.operatorid
      }
      this.getUserInfo()
      if(user.roleid=='2'){
        this.showUkey = true
      }
      console.log(this.getpass.mobile)
      if(this.getpass.mobile==null||this.getpass.mobile==''){//未设置手机号
        this.hasMobile = false
        this.mobileSetted = '未设置'
      }
    }
  };
</script>
<style>
.security-content{
  padding:10px;
  padding-left:5%;
  padding-right:5%;
  padding-top:3%;
}

.security-info{
  border-top:dotted 2px #E1E6EB;
  line-height:60px;
  font-size:14px;
}
.security-left{
  display:inline-block;
  width:12%;
  font-weight:bold;
}
.security-middle{
  display:inline-block;
  width:76%;
}
.security-right{
  display:inline-block;
  width:10%;
  text-align:center;
  color:blue;
}
</style>