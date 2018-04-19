<template>
	<section>
		<common-table 
			:queryapi="queryapi" 
			:editapi="editapi" 
			:exportapi="exportapi"
			:addapi="addapi"
			:tableheight="tableheight"
			:fieldsstr="fieldsstr"
			:tableitems="tableitems"
			:editFormRules="editFormRules"
			:btswidth="btswidth"
			:searchtitle="searchtitle"
			:addtitle="addtitle"
			:showsetting="showsetting"
			v-on:setting="unionsetting"
			ref="bolinkuniontable"
		></common-table>

		<!--设置-->

		<el-dialog
			title="厂商平台设置"
			v-model="settingVisible"
			@open="openSetting"
			@close="closeSetting"
			size="large"
			>
			  <div v-if="settingVisible">
				<div class="setting">
					<el-menu :default-active="settingActive" class="el-menu-vertical-demo" @select="handleSetting">
						<el-menu-item index="1"><i class="el-icon-setting"></i>账号管理</el-menu-item>
						<el-menu-item index="2"><i class="el-icon-setting"></i>支付通道管理</el-menu-item>
					</el-menu>
				</div>
				<div :style="settingContent">
					<div v-show="index1" style="margin-left:15px;">
						<el-row style="margin-top:-10px"> 
								<el-button type="primary"  size="small" @click="handleCardAdd">添加银行卡</el-button>
								<div style="color:red;margin-top:5px;display:none">开始时间不选则为当前时间,结束时间不选默认2020年12月31日</div>
						</el-row>
						<el-row style="margin-top:10px">
							<el-table
								:data="cardData"
								border
								style="width: 100%"
								height="220"
								v-loading="loading"
								>
								<el-table-column
								fixed
								prop="opts"
								label="操作"
								width="100"
								align="center">
								<template scope="scope">
									<!--<el-button size="small" v-if="scope.row.protocol_status==9" type="text" @click="handleGenProtocol(scope.$index, scope.row)">申请协议</el-button>
									<el-button size="small" v-if="scope.row.protocol_status!=9" type="text" @click="handleCheckProtocol(scope.$index, scope.row)">查询协议</el-button>-->
									<el-button size="small" type="text" @click="handleDelCard(scope.$index, scope.row)"><span style="color:red">删除</span></el-button>
								</template>
								</el-table-column>
								<!--<el-table-column
								prop="name"
								label="姓名"
								width="95">
								</el-table-column>-->

								<el-table-column
								prop="bank_no"
								label="银行"
								width="243"
								:formatter="bankFormat">
								</el-table-column>
								<el-table-column
								prop="card_number"
								label="卡号"
								width="250"
								>
								</el-table-column>
								<el-table-column prop="type" label="银行卡类型" width="130"  align="center" :formatter="bankTypeFormat">
								</el-table-column>
								<el-table-column
								prop="city"
								label="城市"
								width="150"
								>
								</el-table-column>
								<!--<el-table-column
								prop="mobile"
								label="预留电话"
								width="130">
								</el-table-column>-->
								<el-table-column
								prop="state"
								label="账号状态"
								width="100"
								:formatter="stateFormat">
								</el-table-column>
								<!--<el-table-column
								prop="protocol_status"
								label="协议状态"
								width="100"
								:formatter="pstateFormat">
								</el-table-column>
								<el-table-column
								prop="kft_protocol_no"
								label="快付通协议编号"
								width="160">
								</el-table-column>
								<el-table-column
								prop="mch_protocol_no"
								label="泊链合作协议编号"
								width="200">
								</el-table-column>
								<el-table-column
								prop="protocol_start_date"
								label="协议开始时间"
								width="180"
								:formatter="dateFormat1"
								>
								</el-table-column>
								<el-table-column
								prop="protocol_end_date"
								label="协议结束时间"
								width="180"
								:formatter="dateFormat2">
								</el-table-column>-->
								<el-table-column
									prop="remark"
									label="说明"
									width="200"
									align="center">
								</el-table-column>
							</el-table>
						</el-row>
					</div>
					<div v-show="index2" style="margin-left:15px;">
						
						<el-row style="margin-top:-10px"> 
							<el-button type="primary" size="small" @click="handlePaypathAdd">添加支付通道</el-button>
						</el-row>

						<el-row style="margin-top:10px">
							<el-table
								:data="payData"
								border
								style="width: 100%"
								height="220"
								v-loading="loading"
								>
								<el-table-column
								fixed
								prop="opts"
								label="操作"
								width="70">
								<template scope="scope">
									<el-button size="small" type="text" @click="handleDelPaypath(scope.$index, scope.row)"><span style="color:red">删除</span></el-button>
								</template>
								</el-table-column>
								<el-table-column
								prop="platform_id"
								label="厂商平台编号"
								width="130">
								</el-table-column>
								<el-table-column
								prop="name"
								label="厂商平台名称"
								width="150">
								</el-table-column>
								<el-table-column
								prop="pay_url"
								label="支付通道地址"
								width="512">
								</el-table-column>
								<el-table-column
								prop="create_time"
								label="创建时间"
								width="180"
								:formatter="dateformat">
								</el-table-column>
							</el-table>
						</el-row>
					</div>
				</div>
			</div>
		</el-dialog>

		<!--添加银行卡-->
		<add-form
			:addtitle="addcardtitle"
			:addVisible="addCardFormVisible"
			:addloading="addcardloading"
			:additems="cardtableitems"
			:addFormRules="addCardFormRules"
			v-on:adddialog="closeaddcard" 
			v-on:add="onAddCard"
			ref="addcard">
		</add-form>

		<!--申请协议对话框-->
		<el-dialog
		title="申请协议"
		v-model="protocolDialogVisible"
		size="tiny"
		@close="closeProtocol"
		>
		<div style="text-align:left;margin-left:16px">
		 <el-radio class="radio" v-model="ischeck" label="1">验证四要素</el-radio>
  		 <el-radio class="radio" v-model="ischeck" label="0">不验证四要素</el-radio>
		</div>
		<div style="text-align:center;margin-top:20px">
		协议开始时间:
		<el-date-picker
		v-model="start"
		type="date"
		style="width:65%"
		placeholder="选择日期"
		:picker-options="datetOptions"
		>
		</el-date-picker>
		</div>
		<div style="text-align:center;margin-top:15px">
		协议结束时间:
		<el-date-picker
		v-model="end"
		type="date"
		style="width:65%"
		placeholder="选择日期"
		:picker-options="datetOptions"
		>
		</el-date-picker>
		</div>
		<el-col  align="right" style="margin-top:15px;margin-bottom:15px">
			<el-button @click="protocolDialogVisible = false" size="small">取 消</el-button>
			<el-button type="primary" @click="genProtocol" size="small" :loading="protocolLoading">确 定</el-button>
		</el-col>
		</el-dialog>

		<!--删除提示框-->
		<el-dialog
			title="提示"
			v-model="delVisible"
			size="tiny"
			>
			<div class="el-message-box__status el-icon-warning"></div><br/>
			<div style="margin-left:50px;vertical-align:middle;">确定删除吗?此操作不可恢复!</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="delVisible = false" size="small">取 消</el-button>
				<el-button type="primary" @click="delCard" size="small">确 定</el-button>
			</span>
		</el-dialog>

		<!--查询协议详情-->
		<el-dialog
		title="协议详情"
		v-model="protocolVisible"
		size="tiny"
		>
		<div style="margin-left:17px;font-size:15px;">
			姓名:&nbsp;&nbsp;{{protocolInfo.holderName}}<br/>
			银行卡号:&nbsp;&nbsp;{{protocolInfo.bankCardNo}}<br/>
			预留手机:&nbsp;&nbsp;{{protocolInfo.mobileNo}}<br/>
			状态:&nbsp;&nbsp;{{protocolInfo.state}}&nbsp;&nbsp;(0待复审|1生效|2失效)<br/>
			开始时间:&nbsp;&nbsp;{{protocolInfo.startDate}}<br/>
			结束时间:&nbsp;&nbsp;{{protocolInfo.endDate}}<br/>
			快付通协议编号:&nbsp;&nbsp;{{protocolInfo.treatyNo}}<br/>
			泊链合作协议编号:&nbsp;&nbsp;{{protocolInfo.merchantTreatyNo}}
		</div>
		<el-col align="right" style="margin-top:15px;margin-bottom:15px">
			<el-button @click="protocolVisible = false" size="small">取 消</el-button>
			<el-button type="primary" @click="protocolVisible = false" size="small">确 定</el-button>
		</el-col>
		</el-dialog>

		<!--添加支付通道-->
		<add-form
			:addtitle="addpaypathtitle"
			:addVisible="addPaypathFormVisible"
			:addloading="addpaypathloading"
			:additems="paypathtableitems"
			:addFormRules="addPaypathFormRules"
			dialogsize="small"
			v-on:adddialog="closeaddpaypath" 
			v-on:add="onAddPaypath"
			ref="addpaypath">
		</add-form>

		<!--删除支付通道提示框-->
		<el-dialog
			title="提示"
			v-model="delVisible"
			size="tiny"
			>
			<div class="el-message-box__status el-icon-warning"></div><br/>
			<div style="margin-left:50px;vertical-align:middle;">确定删除吗?此操作不可恢复!</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="delVisible = false" size="small">取 消</el-button>
				<el-button type="primary" @click="delPaypath" size="small">确 定</el-button>
			</span>
		</el-dialog>

		<!--删除银行卡提示框-->
		<el-dialog
			title="提示"
			v-model="delCardVisible"
			size="tiny"
			>
			<div class="el-message-box__status el-icon-warning"></div><br/>
			<div style="margin-left:50px;vertical-align:middle;">确定删除吗?此操作不可恢复!</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="delCardVisible = false" size="small">取 消</el-button>
				<el-button type="primary" @click="delCard" size="small">确 定</el-button>
			</span>
		</el-dialog>
	</section>
</template> 


<script>
	import { path,stateitems,checkPhone,phonewidth,checkURL,ynitems,dockingtypeitems,belongitems } from '../../api/api';
	import util from '../../common/js/util'
	import common from '../../common/js/common'
	import CommonTable from '../../components/CommonTable'
	import AddForm from '../../components/AddForm'

	export default {
		components:{
			CommonTable,AddForm
		},
		data(){
			return {
				loading: false,
				tableheight:'',
				queryapi:'/union/query',
				editapi:'/union/edit',
				exportapi:'/union/export',
				addapi:'/union/add',
				btswidth:'120',
				fieldsstr:'id__name__phone__mobile__address__reg_time__update_time__state__balance__ukey__isdistibution__tid__docking_type',
				tableitems:[
					{hasSubs:false,subs:[
						{label:'泊链编号',prop:'id',width:'120',type:'number',searchable:true,align:'center',},
					]},
					{hasSubs:false,subs:[
						{label:'名称',prop:'name',width:'280',type:'str',editable:true,searchable:true,addable:true,unsortable:true},
					]},
					{hasSubs:false,subs:[
						{label:'地址',prop:'address',width:'400',type:'str',editable:true,searchable:true,addable:true,unsortable:true},
					]},
					{hasSubs:false,subs:[
						{label:'联系电话',prop:'phone',width:phonewidth,type:'str',editable:true,searchable:true,addable:true,unsortable:true,align:'center',},
					]},
					{hasSubs:false,subs:[
						{label:'密保电话',prop:'tmobile',width:phonewidth,type:'str',editable:true,searchable:true,unsortable:true,align:'center',addable:true,
							format:function(row){
								if(row.tmobile==""||row.tmobile==null){
									return "暂未设置"
								}else{
									return row.tmobile
								}
							}
						},
					]},
					{hasSubs:false,subs:[
						{label:'注册日期',prop:'reg_time',width:'175',type:'date',searchable:true,align:'center',
							format:function(row){
									return common.dateformat(row.reg_time);
								}
						},
					]},
					{hasSubs:false,subs:[
						{label:'更新日期',prop:'update_time',width:'175',type:'date',searchable:true,align:'center',
							format:function(row){
								return common.dateformat(row.update_time);
							}
						},
					]},
					{hasSubs:false,subs:[
						{label:'状态',prop:'state',width:'90',type:'selection',selectlist:stateitems,editable:true,searchable:true,addable:true,unsortable:true,align:'center',
							format:function(row){
								return common.stateformat(row.state)
							}
						},
					]},
					{hasSubs:false,subs:[
						{label:'余额',prop:'balance',width:'150',type:'number',searchable:true,align:'center',
							format:function(row){
								return common.balanceformat(row.balance,5)
							}
						},
					]},
					{hasSubs:false,subs:[
						{label:'密钥',prop:'ukey',width:'185',type:'str',editable:true,searchable:true,unsortable:true,align:'center',},
					]},
					{hasSubs:false,subs:[
						{label:'管理员账号',prop:'tid',width:'120',type:'number',editable:false,searchable:false,unsortable:true,align:'center',},
					]},
					{hasSubs:false,subs:[
						{label:'支持清分',prop:'isdistibution',width:'100',type:'selection',selectlist:ynitems,editable:true,searchable:true,addable:true,unsortable:true,align:'center',
							format:function(row){
								return common.ynformat(row.isdistibution)
							}
						},
					]},
					{hasSubs:false,subs:[
						{label:'对接模式',prop:'docking_type',width:'100',type:'selection',selectlist:dockingtypeitems,editable:true,searchable:true,addable:true,unsortable:true,align:'center',
							format:function(row){
								return common.nameformat(row,dockingtypeitems,'docking_type')
							}
						},
					]},
				],
				searchtitle:'查询厂商平台',
				addtitle:'注册厂商平台',
				editFormRules: {
					name: [
						{ required: true, message: '请输入名称', trigger: 'blur' }
					],
					phone: [
						{ validator:checkPhone, required: true,  trigger: 'blur'},
					],
					mobile: [
						{ validator:checkPhone, required: true, trigger: 'blur' }
					],
					address: [
						{ required: true, message: '请输入地址', trigger: 'blur' }
					],
					ukey: [
						{ required: true, message: '请输入密钥', trigger: 'blur' }
					],
					state: [
						{ required: true, message: '请选择状态', trigger: 'change' }
					],
					isdistibution: [
						{ required: true, message: '请选择清分', trigger: 'change' }
					],
					docking_type: [
						{ required: true, message: '请选择清分', trigger: 'change' }
					],
				},
				settingVisible:false,
				showsetting:true,
				payData:[],
				banklist:[],
				settingActive:'1',
				unionid:'',
				uid:'',
				index1:true,
				index2:false,
			    delVisible:false,
				settingContent:'',
				dateformat:function(row){
					return common.dateformat(row.create_time)
				},
				addpaypathtitle:'添加支付通道',
				addPaypathFormVisible:false,
				addpaypathloading:false,
				paypathtableitems:[
					{hasSubs:false,subs:[
						{label:'通道地址',prop:'pay_url',width:'350',type:'str',editable:false,searchable:false,addable:true,unsortable:true},
					]},
				],
				addPaypathFormRules:{
					pay_url: [
						{ validator:checkURL,required: true,  trigger: 'blur' }
					],

				},
				addcardtitle:'添加银行卡',
				addCardFormVisible:false,
				delCardVisible:false,
				addcardloading:false,
				protocolDialogVisible:false,
				delVisible:false,
				protocolLoading:false,
				protocolVisible:false,
				cardData:[],
				card_id:'',
				ischeck:'1',
				start:'',
				end:'',
				card_id:'',
				protocolInfo:{
					holderName:'查询中...',
				},
				datetOptions: {
					disabledDate(time) {
						return time.getTime() < Date.now() - 8.64e7;
					}
				},
				cardfieldsstr:'id__name__bank_no___card_number__type__mobile__city__',
				cardtableitems:[
					{hasSubs:false,subs:[
						{label:'编号',prop:'id',width:'120',type:'number',addable:false,searchable:true,align:'center',},
					]},
					{hasSubs:false,subs:[
						{label:'姓名',prop:'name',width:'260',type:'str',addable:true,searchable:true,unsortable:true},
					]},
					{hasSubs:false,subs:[
						{label:'银行',prop:'bank_no',width:'260',type:'selection',selectlist:this.banklist,addable:true,searchable:true,unsortable:true},
					]},
					{hasSubs:false,subs:[
						{label:'卡号',prop:'card_number',width:'260',type:'str',addable:true,searchable:true,unsortable:true},
					]},
                    {hasSubs:false,subs:[
                        {label:'银行卡类型',prop:'type',width:'260',type:'selection',selectlist:belongitems,addable:true,searchable:true,
                            unsortable:true},
                    ]},
					{hasSubs:false,subs:[
						{label:'城市',prop:'city',width:'260',type:'str',addable:true,searchable:true,unsortable:true},
					]},
					{hasSubs:false,subs:[
						{label:'预留手机',prop:'mobile',width:'260',type:'str',addable:true,searchable:true,unsortable:true},
					]},
					//{label:'身份证号码',prop:'id_no',width:'260',type:'str',addable:true,searchable:true,unsortable:true},
				],
				stateFormat:function(row){
					if(row.state==0){
						return "不可用"
					}else if(row.state==1){
						return "正常"
					}
				},
				pstateFormat:function(row){
					if(row.protocol_status==0){
							return "待复审"
						}else if(row.protocol_status==1){
							return "生效"
						}else if(row.protocol_status==2){
							return "失效"
						}else{
							return "未申请"
						}
					},
                bankTypeFormat:(row)=>{
                    var bankinfos = belongitems
                    for(var i=0;i<bankinfos.length;i++){
                        if(bankinfos[i].value_no==row.type){
                            return bankinfos[i].value_name
                        }
                    }
                   // return belongitems[0].value_name
                },
				dateFormat1:function(row){
					return common.dateformat(row.protocol_start_date);
				},
				dateFormat2:function(row){
					return common.dateformat(row.protocol_end_date);
				},
				bankFormat:(row)=>{
					var bankinfos = this.banklist
					for(var i=0;i<bankinfos.length;i++){
						if(bankinfos[i].value_no==row.bank_no){
							return bankinfos[i].value_name
						}
					}
				},
				idFormat:function(row){
					if(row.id_no==''||typeof(row.id_no)=='undefined'){
						return '未填写'
					}else{
						return row.id_no
					}
				},
				addCardFormRules:{
					name: [
					 	{ required: true, message: '请输入姓名', trigger: 'blur' }
					],
					// mobile: [
					// 	{ validator:checkPhone, required: true, trigger: 'blur' }
					// ],
					card_number: [
						{ required: true, message: '请输入银行卡号', trigger: 'blur' }
					],
					bank_no: [
						{ required: true, message: '请选择银行', trigger: 'change' }
					],
					city: [
						{ required: true, message: '请输入开户行所在城市', trigger: 'blur' }
					],
                    type: [
                        { required: true, message: '请选择银行卡类型', trigger: 'blur' }
                    ]
				},
			}
		},
		mounted() {
			window.onresize=()=>{this.tableheight=common.gwh()-135;}
			this.tableheight=common.gwh()-135;
			this.settingContent='float:left;width:'+(common.gww()*0.9-170)+'px'
		},
		methods:{
			handleSetting(key,path){
				if(key=="1"){
					this.index1=true
					this.index2=false
				}else if(key=="2"){
					this.index2=true
					this.index1=false
				}
			},
			openSetting(){
				
			},
			closeSetting(){
				this.cardData=[];
				this.payData=[];
				this.settingActive="1"
				this.index1=true
				this.index2=false
			},
			unionsetting(unionid){
				this.payData = []
				this.settingVisible=true
				this.unionid = unionid
				this.getPayTableData()
				this.getTableData()
			},
			//拉取表格数据
			getPayTableData(){
				var vm=this;
				this.loading = true;
				var sform = {'token':sessionStorage.getItem('token'),'union_id':this.unionid}
				vm.$post(path+"/union/querypaypath",sform,function(ret){
					if(ret.validate!='undefined'&&ret.validate=='0'){
						vm.loading = false;
						//未携带令牌.重新登录
						setTimeout(()=>{vm.alertInfo('未携带令牌,请重新登录!')},150)
					}else if(ret.validate!='undefined'&&ret.validate=='1'){
						vm.loading = false;
						//过期.重新登录
						setTimeout(()=>{vm.alertInfo('登录过期,请重新登录!')},150)
					}else if(ret.validate!='undefined'&&ret.validate=='2'){
						vm.loading = false;
						//令牌无效.重新登录
						setTimeout(()=>{vm.alertInfo('登录异常,请重新登录!')},150)
					}else{
						if(ret.total==0){
							vm.payData=[];
						}else{
							vm.payData=ret.rows;
						}
						vm.loading = false;
					}
					
				},"json");
			},
			closeaddpaypath(val){
				this.addPaypathFormVisible=val
				this.addpaypathloading=val;
			},
			onAddPaypath(aform){
				//向后台发送数据
				var vm = this;
				this.$extend(aform,{'token':sessionStorage.getItem('token')})
				this.$extend(aform,{'platform_id':vm.unionid})
				this.$children[2].$refs.addForm.validate((valid) => {
					if (valid) {
						vm.addpaypathloading=true
						vm.$post(path+"/union/addpaypath",aform,function(ret){
							if(ret.validate!='undefined'&&ret.validate=='1'){
								//过期.重新登录
								setTimeout(()=>{vm.alertInfo('登录过期,请重新登录!')},100)
							}else if(ret.validate!='undefined'&&ret.validate=='2'){
								//令牌无效.重新登录
								setTimeout(()=>{vm.alertInfo('登录异常,请重新登录!')},100)
							}else{
								if(ret>0){
								//更新成功
								vm.getPayTableData();
								vm.$message({
									message: '添加成功!',
									type: 'success',
									duration: 600
								});
								vm.addPaypathFormVisible = false;
								vm.addpaypathloading=false
								}else{
									//更新失败
									vm.$message({
										message: "添加失败",
										type: 'error',
										duration: 1200
									});
								}
							}
							
						},"json")
					}
				});
			},
			handlePaypathAdd(){
				this.addPaypathFormVisible = true
			},
			handleDelPaypath(index,row){
				this.uid = row.id
				this.delVisible = true
			},
			delPaypath(){
				var dform = {'id':this.uid,'token':sessionStorage.getItem('token')}
				var vm = this
				//console.log(dform)
				vm.$post(path+"/union/delpaypath",dform,function(ret){
					if(ret=="1"){
						//成功
						vm.getPayTableData();
						vm.$message({
							message: '删除成功!',
							type: 'success',
							duration: 600
						});
						vm.delVisible=false
					}else{
						//失败
						vm.$message({
							message: '删除失败!',
							type: 'error',
							duration: 600
						});
					}
				})
			},
			//拉取表格数据
			getTableData(){
				var vm=this;
				this.loading = true;
				var sform = {'token':sessionStorage.getItem('token'),'platform_id':this.unionid,'user_type':2}
				vm.$post(path+"/account/querycard",sform,function(ret){
					if(ret.validate!='undefined'&&ret.validate=='0'){
						vm.loading = false;
						//未携带令牌.重新登录
						setTimeout(()=>{vm.alertInfo('未携带令牌,请重新登录!')},150)
					}else if(ret.validate!='undefined'&&ret.validate=='1'){
						vm.loading = false;
						//过期.重新登录
						setTimeout(()=>{vm.alertInfo('登录过期,请重新登录!')},150)
					}else if(ret.validate!='undefined'&&ret.validate=='2'){
						vm.loading = false;
						//令牌无效.重新登录
						setTimeout(()=>{vm.alertInfo('登录异常,请重新登录!')},150)
					}else{
						if(ret.total==0){
							vm.cardData=[];
						}else{
							vm.cardData=ret.rows;
						}
						vm.loading = false;
					}
					
				},"json");
			},
			alertInfo(msg){
				this.$alert(msg, '提示', {
					confirmButtonText: '确定',
					type: 'warning',
					callback: action => {
						sessionStorage.removeItem('user');
						sessionStorage.removeItem('token');
						this.$router.push('/login');
					}
				});
			},
			handleCardAdd(){
				this.addCardFormVisible=true
			},
			closeaddcard(val){
				this.addCardFormVisible=val
				this.addcardloading=val;
			},
			onAddCard(aform){
				//console.log(aform)
				//发送请求,添加一条记录
				var vm = this;
				this.$extend(aform,{'token':sessionStorage.getItem('token')})
				this.$extend(aform,{'platform_id':vm.unionid})
				this.$extend(aform,{'user_type':2})
				//console.log(this)
				this.$children[2].$refs.addForm.validate((valid) => {
					if (valid) {
						vm.addcardloading=true
						vm.$post(path+"/account/addcard",aform,function(ret){
							if(ret.validate!='undefined'&&ret.validate=='1'){
								//过期.重新登录
								setTimeout(()=>{vm.alertInfo('登录过期,请重新登录!')},100)
							}else if(ret.validate!='undefined'&&ret.validate=='2'){
								//令牌无效.重新登录
								setTimeout(()=>{vm.alertInfo('登录异常,请重新登录!')},100)
							}else{
								if(ret>0){
								//更新成功
								vm.getTableData();
								vm.$message({
									message: '添加成功!',
									type: 'success',
									duration: 600
								});
								vm.addCardFormVisible = false;
								vm.addcardloading=false
								}else{
									//更新失败
									vm.$message({
										message: "添加失败",
										type: 'error',
										duration: 1200
									});
								}
							}
							
						},"json")
					}
				});
			},
			handleGenProtocol(index,row){
				this.protocolDialogVisible = true
				this.card_id = row.id
			},
			closeProtocol(){
				this.start = ''
				this.end = ''
				this.ischeck = '1'
			},
			genProtocol(){
				//console.log(this.start)
				if(this.start==''||this.end==''||typeof(this.start)=='undefined'||typeof(this.end)=='undefined'){
					this.$message({
						message: '协议开始时间和结束时间必须填写',
						type: 'info',
						duration: 1500
					});
					return
				}
				this.protocolLoading = true
				var aform = {'id':this.card_id,'ischeck':this.ischeck,'start':this.start.getTime()/1000,'end':this.end.getTime()/1000}
				var vm = this
				this.loading = true
				vm.$post(path+"/kftwithdraw/genprotocol",aform,function(ret){
					if(ret=="1"){
						//成功
						vm.getTableData();
						vm.$message({
							message: '协议已申请!',
							type: 'success',
							duration: 600
						});
						
						vm.protocolDialogVisible = false;
					}else if(ret=="-2"){
						vm.$message({
							message: '银行卡信息填写有误!',
							type: 'error',
							duration: 3000
						});
					}else{
						//失败
						vm.$message({
							message: '协议申请失败!',
							type: 'error',
							duration: 2000
						});
					}
					vm.loading = false
					vm.protocolLoading = false
				})
			}, 
			handleDelCard(index,row){
				this.card_id = row.id
				this.delCardVisible = true
			},
			delCard(){
				var dform = {'id':this.card_id,'platform_id':this.unionid,'user_type':2,'token':sessionStorage.getItem('token')}
				var vm = this
				//console.log(dform)
				vm.$post(path+"/account/delcard",dform,function(ret){
					if(ret=="1"){
						//成功
						vm.getTableData();
						vm.$message({
							message: '删除成功!',
							type: 'success',
							duration: 600
						});
						vm.delCardVisible=false
					}else{
						//失败
						vm.$message({
							message: '删除失败!',
							type: 'error',
							duration: 600
						});
					}
				})
			},
			handleCheckProtocol(index,row){
				//查询协议状态
				this.protocolInfo={}
				this.protocolVisible = true
				var vm = this
				var cform = {'id':row.id}
				this.$post(path+"/kftwithdraw/queryprotocolstatus",cform,function(ret){
					var r = eval('('+ret+')')
					vm.protocolInfo = r
					vm.getTableData()
				})
				
			},
		},
		activated(){
			//console.log('active')
			window.onresize=()=>{this.tableheight=common.gwh()-135;}
			this.tableheight=common.gwh()-135;
			this.$refs['bolinkuniontable'].$refs['search'].resetSearch()
			this.$refs['bolinkuniontable'].getTableData({})
			var _this = this
			this.axios.all([common.getBankInfo()])
			.then(this.axios.spread(function(bankinfo){
				_this.banklist=bankinfo.data
			}))
		},
		watch:{
			banklist:function(val){
				this.cardtableitems[2].subs[0].selectlist=val
			},
		}
	}

</script>

<style scoped>
.setting{
	width:140px;
	height:300px;
	background:#EEF6F3;
	float:left;
	padding:0px;
	margin-left:-19px;
	margin-top:-12px;
}
</style>