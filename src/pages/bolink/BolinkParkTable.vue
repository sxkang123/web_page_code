<template>
	<section>
		<common-table 
			:queryapi="queryapi" 
			:editapi="editapi" 
			:exportapi="exportapi"
			:tableheight="tableheight"
			:fieldsstr="fieldsstr"
			:tableitems="tableitems"
			:editFormRules="editFormRules"
			:btswidth="btswidth"
			:showmapdialog="showmapdialog"
			:showMap="showMap"
			:showComponent="showComponent"
			:searchtitle="searchtitle"
			:hideAdd="hideAdd"
			:showsetting="showsetting"
			v-on:setting="parksetting"
			v-on:queryComponent="queryComponent"
			ref="bolinkparktable"
		></common-table>

		<!--设置-->
		<el-dialog
			title="车场设置"
			v-model="settingVisible"
			v-if="settingVisible"
			@open="openSetting"
			size="large"
			>
			  <div>
				<div class="setting">
					<el-menu :default-active="settingActive" class="el-menu-vertical-demo" @select="handleSetting">
						<el-menu-item index="2"><i class="el-icon-setting"></i>卡号管理</el-menu-item>
						<el-menu-item index="1"><i class="el-icon-setting"></i>费率设置</el-menu-item>
					</el-menu>
				</div>
				<div :style="settingContent">
					<div v-if="index1">
					  <CollectingRate
					  	:parkid="parkid"
					  ></CollectingRate>
					</div>
						<div v-if="index2" style="margin-left:15px;">
							<div>
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
										<el-table-column
										prop="name"
										label="姓名"
										width="120"
										align="center">
										</el-table-column>
										<!--
										<el-table-column
										prop="id_no"
										label="身份证号码"
										width="150"
										:formatter="idFormat"
										>

										</el-table-column>-->
										<el-table-column
										prop="bank_no"
										label="银行"
										width="185"
										align="center"
										:formatter="bankFormat">
										</el-table-column>
										<el-table-column
										prop="city"
										label="城市"
										width="120"
										>
										</el-table-column>
										<el-table-column
										prop="card_number"
										label="卡号"
										width="190"
										align="center">
										</el-table-column>
										<el-table-column
										prop="type"
										label="银行卡类型"
										width="130"
										align="center"
										:formatter="bankTypeFormat">
										</el-table-column>
										<el-table-column
										prop="state"
										label="账号状态"
										width="100"
										align="center"
										:formatter="stateFormat">
										</el-table-column>
										<!--
										<el-table-column
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
										</el-table-column>
										-->
										<el-table-column
										prop="remark"
										label="说明"
										width="180"
										align="center">
										</el-table-column>
									</el-table>
								</el-row>
							</div>
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

	</section>
</template>

<script>
	import { path,stateitems,checkPhone,phonewidth,belongitems,addAccountState} from '../../api/api';
	import util from '../../common/js/util'
	import common from '../../common/js/common'
	import CommonTable from '../../components/CommonTable'
	import AddForm from '../../components/AddForm'
    import CollectingRate from '../public/CollectingRate'

	export default {
		components:{
			CommonTable,
			AddForm,
			CollectingRate
		},
		data(){ 
			return {
				ulist:[],
				slist:[],
				paylist:[],
				banklist:[],
                olist:[],
				index1:false,
				index2:true,
				loading: false,
				hideAdd:true,
				showmapdialog:true,
				settingVisible:false,
				dialogVisible:false,
				settingActive:"2",
				showsetting:true,
				showMap:true,
				showComponent:true,
				settingContent:'',
				tableheight:'',
				queryapi:'/park/query',
				editapi:'/park/edit',
				exportapi:'/park/export',
				btswidth:'260',
				fieldsstr:'id__union_id__add_account_time__add_account_state__operator_id__server_id__park_id__name__total_plot__empty_plot__address__phone__tmobile__ctime__utime__state__balance',
				tableitems:[
					{hasSubs:false,subs:[
						{label:'泊链编号',prop:'id',width:'120',type:'number',editable:false,searchable:true,align:'center',},
					]},
					{hasSubs:false,subs:[
						{label:'所属平台',prop:'union_id',width:'250',type:'selection',selectlist:this.ulist,editable:false,searchable:true,unsortable:true,
							format:(row)=>{return common.nameformat(row,this.ulist,'union_id')}
						},
					]},
                    {hasSubs:false,subs:[
                        {label:'进件时间',prop:'add_account_time',width:'170',type:'date',editable:false,searchable:true,unsortable:true,
                            format:function(row){
                                return common.dateformat(row.add_account_time);
                            }
                        },
                    ]},
                    {hasSubs:false,subs:[
                        {label:'进件状态',prop:'add_account_state',width:'120',type:'selection',selectlist:addAccountState,editable:false,searchable:true,unsortable:true,
                            format:(row)=>{return common.nameformat(row,addAccountState,'add_account_state')}
                        },
                    ]},
                    {hasSubs:false,subs:[
                        {label:'运营商',prop:'operator_id',width:'120',type:'selection',selectlist:this.olist,editable:false,searchable:true,unsortable:true,
                            format:(row)=>{return common.nameformat(row,this.olist,'operator_id')}
                        },
                    ]},
					{hasSubs:false,subs:[
						{label:'服务商',prop:'server_id',width:'150',type:'selection',selectlist:this.slist,editable:false,searchable:true,unsortable:true,customSelect:'parkserver',
							searchSelect:'all',commonSelect:'local_all',
							format:(row)=>{return common.nameformat(row,this.slist,'server_id')}
						},
					]},
					{hasSubs:false,subs:[
						{label:'车场编号',prop:'park_id',width:'120',type:'str',editable:false,searchable:true,unsortable:true,align:'center',},
					]},
					{hasSubs:false,subs:[
						{label:'车场名称',prop:'name',width:'260',type:'str',editable:true,searchable:true,unsortable:true},
					]},
					{hasSubs:false,subs:[
						{label:'车位数',prop:'total_plot',width:'100',type:'str',editable:true,searchable:true,align:'center',},
					]},
					{hasSubs:false,subs:[
						{label:'余位数',prop:'empty_plot',width:'100',type:'str',editable:true,searchable:true,align:'center',},
					]},
					{hasSubs:false,subs:[
						{label:'车场地址',prop:'address',width:'300',type:'str',editable:true,searchable:true,unsortable:true},
					]},
					{hasSubs:false,subs:[
						{label:'联系手机',prop:'phone',width:phonewidth,type:'str',editable:true,searchable:true,unsortable:true,align:'center',},
					]},
					{hasSubs:false,subs:[
						{label:'密保手机',prop:'tmobile',width:phonewidth,type:'str',editable:true,searchable:true,unsortable:true,align:'center',addable:true,
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
						{label:'新建日期',prop:'ctime',width:'175',type:'date',editable:false,searchable:true,align:'center',
							format:function(row){
									return common.dateformat(row.ctime);
								}
						},
					]},
					{hasSubs:false,subs:[
						{label:'心跳时间',prop:'utime',width:'175',type:'date',editable:false,searchable:true,align:'center',
							format:function(row){
								return common.dateformat(row.utime);
							}
						},
					]},
					{hasSubs:false,subs:[
						{label:'车场状态',prop:'state',width:'120',type:'selection',selectlist:stateitems,editable:true,searchable:true,align:'center',
							format:function(row){
								return common.stateformat(row.state)
							}
						},
					]},
					{hasSubs:false,subs:[
						{label:'余额',prop:'balance',width:'150',type:'number',editable:false,searchable:true,align:'center',
							format:function(row){
								return common.balanceformat(row.balance,5)
							}
						},
					]},
					// {hasSubs:false,subs:[
					// 	{label:'支付通道',prop:'pay_platform_id',width:'120',type:'selection',selectlist:this.paylist,editable:true,searchable:true,unsortable:true,
					// 		format:(row)=>{return common.nameformat(row,this.paylist,'pay_platform_id')}
					// 	},
					// ]},
				],
				searchtitle:'查询车场',
				editFormRules: {
					name: [
						{ required: true, message: '请输入名称', trigger: 'blur' }
					],
					phone: [
						{ validator:checkPhone, required: true, trigger: 'blur' }
					],
					address: [
						{ required: true, message: '请输入地址', trigger: 'blur' }
					],
					total_plot: [
						{ required: true, message: '请输入车位数', trigger: 'blur' }
					],
					empty_plot: [
						{ required: true, message: '请输入空闲数', trigger: 'blur' }
					],
					server_id: [
						{ required: true, message: '请选择服务商', trigger: 'change' }
					],
					state: [
						{ required: true, message: '请选择状态', trigger: 'change' }
					],
					// pay_platform_id: [
					// 	{ required: true, message: '请选择支付平台', trigger: 'change' }
					// ],
				},
				addcardtitle:'添加银行卡',
				addCardFormVisible:false,
				addcardloading:false,
				protocolDialogVisible:false,
				delVisible:false,
				protocolLoading:false,
				protocolVisible:false,
				cardData:[],
				ischeck:'1',
				start:'',
				end:'',
				card_id:'',
				datetOptions: {
					disabledDate(time) {
						return time.getTime() < Date.now() - 8.64e7;
					}
				},
				cardfieldsstr:'id__name__card_number___type__mobile___bank_no',
				cardtableitems:[
					{hasSubs:false,subs:[
						{label:'编号',prop:'id',width:'120',type:'number',addable:false,searchable:true,align:'center',},
					]},
					{hasSubs:false,subs:[
						{label:'姓名',prop:'name',width:'260',type:'str',addable:true,searchable:true,unsortable:true},
					]},
					{hasSubs:false,subs:[
						{label:'银行',prop:'bank_no',width:'260',type:'selection',selectlist:this.banklist,addable:true,searchable:true,
							unsortable:true},
					]},
					{hasSubs:false,subs:[
						{label:'卡号',prop:'card_number',width:'260',type:'str',addable:true,searchable:true,unsortable:true},
					]},
                    {hasSubs:false,subs:[
                        {label:'银行卡类型',prop:'type',width:'260',type:'selection',selectlist:belongitems,addable:true,searchable:true,
                            unsortable:true},
                    ]},
					{hasSubs:false,subs:[
						{label:'城市名称',prop:'city',width:'260',type:'str',addable:true,searchable:true,unsortable:true},
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
                bankTypeFormat:(row)=>{
                    var bankinfos = belongitems
                    for(var i=0;i<bankinfos.length;i++){
                        if(bankinfos[i].value_no==row.type){
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
					//mobile: [
						//{ validator:checkPhone, required: true, trigger: 'blur' }
					//],
					card_number: [
						{ required: true, message: '请输入银行卡号', trigger: 'blur' }
					],
                    city: [
                        { required: true, message: '请输入开户行所在城市', trigger: 'blur' }
                    ],
					bank_no: [
						{ required: true, message: '请选择银行', trigger: 'change' }
					],
                    type: [
                        { required: true, message: '请选择银行卡类型', trigger: 'blur' }
                    ]
				},
				parkid:'',
				protocolInfo:{
					holderName:'查询中...',
				}
			}
		},
		beforeMount(){
			
		},
		methods:{
			parksetting(parkid){
				this.cardData = []
				this.settingVisible=true
				this.index1=false
				this.index2=true
				this.parkid = parkid
				this.getTableData()
			},
			openSetting(){
				this.settingActive="2"
				this.index1=false
				this.index2=true
			},
			handleSetting(key,path){
				if(key=="1"){
					this.index1=true
					this.index2=false
				}else if(key=="2"){
					this.index2=true
					this.index1=false
				}
			},
			//拉取表格数据
			getTableData(){
				var vm=this;
				this.loading = true;
				var sform = {'fieldsstr':this.cardfieldsstr,'token':sessionStorage.getItem('token'),'platform_id':this.parkid,'user_type':4}
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
				console.log(aform)
				//发送请求,添加一条记录
				var vm = this;
				this.$extend(aform,{'token':sessionStorage.getItem('token')})
				this.$extend(aform,{'platform_id':vm.parkid})
				this.$extend(aform,{'user_type':4})
				console.log(this)
				this.$children[1].$refs.addForm.validate((valid) => {
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
				console.log(this.start)
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
							duration: 600
						});
					}
					vm.loading = false
					vm.protocolLoading = false
				})
			}, 
			handleDelCard(index,row){
				this.card_id = row.id
				this.delVisible = true
			},
			delCard(){
				var dform = {'id':this.card_id,'platform_id':this.parkid,'user_type':4,'token':sessionStorage.getItem('token')}
				var vm = this
				console.log(dform)
				vm.$post(path+"/account/delcard",dform,function(ret){
					if(ret=="1"){
						//成功
						vm.getTableData();
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
			queryComponent(row){
				sessionStorage.setItem("component_comid",row.id)
				sessionStorage.setItem("component_fromPath",'/bolinkpark')
				this.active="/parkcomponent"
				this.$router.push("/parkcomponent");
			}

		},
		mounted(){
			window.onresize=()=>{this.tableheight=common.gwh()-135}
			this.tableheight=common.gwh()-135;
			this.settingContent='float:left;width:'+(common.gww()*0.9-170)+'px'
			this.$refs['bolinkparktable'].$refs['search'].resetSearch()
			this.$refs['bolinkparktable'].getTableData({})
			var _this=this
			//请求列表
			//所有厂商,所有服务商
			/*
			 let listparams = '&unionid='+this.initunionid
			this.axios.all([common.getServerList(),common.getUnionList(),common.getOperatorList(listparams+'&state=1')])
			.then(this.axios.spread(function(server,union,aoperator){
				_this.slist=server.data
				_this.ulist=union.data
                _this.olist=aoperator.data
			}))
			 */
			this.axios.all([common.getServerList(),common.getUnionList(),common.getBankInfo(),common.getBaPayUnionList(),common.getOperatorList()])
			.then(this.axios.spread(function(server,union,bankinfo,paylist,operatorList){
				_this.slist=server.data
				_this.ulist=union.data
				_this.banklist=bankinfo.data
				_this.paylist=paylist.data
				_this.olist=operatorList.data
			}))
		},
		watch:{
			olist:function(val){
				this.tableitems[4].subs[0].selectlist=val
			},
            slist:function(val){
                this.tableitems[5].subs[0].selectlist=val
            },
			ulist:function(val){
				this.tableitems[1].subs[0].selectlist=val
			},
			banklist:function(val){
				this.cardtableitems[2].subs[0].selectlist=val
			},
			paylist:function(val){
				this.tableitems[16].subs[0].selectlist=val
			},

		}
	}

</script>

