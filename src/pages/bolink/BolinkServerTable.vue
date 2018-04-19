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
			v-on:setting="serversetting"
			ref="bolinkservertable"
		></common-table>


<!--设置-->
		<el-dialog
			title="车场设置"
			v-model="settingVisible"
			v-if="settingVisible"
			@close="closeSetting"
			size="large"
			>
			  <div>
				<div class="setting">
					<el-menu :default-active="settingActive" class="el-menu-vertical-demo" @select="handleSetting">
						<el-menu-item index="1"><i class="el-icon-setting"></i>卡号管理</el-menu-item>
					</el-menu>
				</div>
				<div :style="settingContent">
					<div v-if="index1" style="margin-left:15px;">
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
										<el-button size="small" type="text" @click="handleDelCard(scope.$index, scope.row)"><span style="color:red">删除</span></el-button>
									</template>
									</el-table-column>
									<el-table-column
									prop="name"
									label="姓名"
									width="120"
									align="center">
									</el-table-column>
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
									width="100"
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
									<el-table-column
									prop="remark"
									label="说明"
									width="137"
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
	import { path,stateitems,getUnionList,checkPhone,phonewidth,belongitems } from '../../api/api';
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
				cardData:'',
				settingActive:'1',
				index1:true,
				delCardVisible:false,
				addCardFormVisible:false,
				delCardVisible:false,
				settingVisible:false,
				showsetting:true,
				ulist:'',
				slist:'',
				tableheight:'',
				settingContent:'',
				u:'',
				queryapi:'/server/query',
				editapi:'/server/edit',
				exportapi:'/server/export',
				addapi:'/server/add',
				btswidth:'120',
				fieldsstr:'id__union_id__name__phone__area__ctime__utime__state__balance__tid',
				tableitems:[
					{hasSubs:false,subs:[
						{label:'泊链编号',prop:'id',width:'120',type:'number',editable:false,searchable:true,align:'center',},
					]},
					{hasSubs:false,subs:[
						{label:'所属平台',prop:'union_id',width:'240',type:'selection',selectlist:this.ulist,editable:false,searchable:true,addable:true,unsortable:true,
							format:(row)=>{return common.nameformat(row,this.ulist,'union_id')}
						},
					]},
                    {hasSubs:false,subs:[
                        {label:'上级服务商',prop:'p_server_id',width:'120',type:'selection',hidden:true,selectlist:this.slist,editable:false,searchable:false,addable:true,unsortable:true,
                            format:(row)=>{return common.nameformat(row,this.ulist,'p_server_id')}
                        },
                    ]},
					{hasSubs:false,subs:[
						{label:'名称',prop:'name',width:'220',type:'str',editable:true,searchable:true,addable:true,unsortable:true,},
					]},
					{hasSubs:false,subs:[
						{label:'地址',prop:'area',width:'380',type:'str',editable:true,searchable:true,addable:true,unsortable:true,},
					]},
					{hasSubs:false,subs:[
						{label:'联系电话',prop:'phone',width:phonewidth,type:'str',editable:true,searchable:true,addable:true,unsortable:true,align:'center',},
					]},
					{hasSubs:false,subs:[
						{label:'密保电话',prop:'tmobile',width:phonewidth,type:'str',editable:true,searchable:true,unsortable:true,align:'center',addable:true,
							format:function(row){
								if(row.tmobile==""||row.tmobile==null||row.tmobile=='null'){
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
						{label:'修改日期',prop:'utime',width:'175',type:'date',editable:false,searchable:true,align:'center',
							format:function(row){
								return common.dateformat(row.utime);
							}
						},
					]},
					{hasSubs:false,subs:[
						{label:'状态',prop:'state',width:'90',type:'selection',selectlist:stateitems,editable:true,searchable:true,addable:true,align:'center',
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
					{hasSubs:false,subs:[
						{label:'管理员账号',prop:'tid',width:'120',type:'number',editable:false,searchable:false,unsortable:true,align:'center',},
					]},
				],
				searchtitle:'查询服务商',
				addtitle:'注册服务商',
				editFormRules: {
					name: [
						{ required: true, message: '请输入服务商名称', trigger: 'blur' }
					],
					phone: [
						{ validator:checkPhone, required: true,  trigger: 'blur' }
					],
					mobile: [
						{ validator:checkPhone, required: true, trigger: 'blur' }
					],
					area: [
						{ required: true, message: '请输入地址', trigger: 'blur' }
					],
					state: [
						{ required: true, message: '请选择状态', trigger: 'change' }
					],
					union_id: [
						{ required: true, message: '请选择厂商平台', trigger: 'change' }
					],
				},
				cardfieldsstr:'id__name__card_number___mobile___bank_no',
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
				addcardtitle:'添加银行卡',
				addcardloading:false,
				card_id:'',
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
				banklist:'',
			}
		},
		methods:{
			stateFormat:function(row){
				if(row.state==0){
					return "不可用"
				}else if(row.state==1){
					return "正常"
				}
			},
			handleSetting(key,path){
				if(key=="1"){
					this.index1=true
				}
			},
			serversetting(serverid){
				this.payData = []
				this.settingVisible=true
				this.serverid = serverid
				//获取银行卡数据
				this.getTableData()
			},
			delCard(){
				var dform = {'id':this.card_id,'platform_id':this.serverid,'user_type':3,'token':sessionStorage.getItem('token')}
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
			closeSetting(){
				this.cardData=[];
				this.settingActive="1"
				this.index1=true
			},
			handleCardAdd(){
				this.addCardFormVisible=true
			},
			closeaddcard(val){
				this.addCardFormVisible=val
				this.addcardloading=val;
			},
			handleDelCard(index,row){
				this.card_id = row.id
				this.delCardVisible = true
			},
			onAddCard(aform){
				//console.log(aform)
				//发送请求,添加一条记录
				var vm = this;
				this.$extend(aform,{'token':sessionStorage.getItem('token')})
				this.$extend(aform,{'platform_id':vm.serverid})
				this.$extend(aform,{'user_type':3})
				//console.log(this)
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
			//拉取表格数据
			getTableData(){
				var vm=this;
				this.loading = true;
				var sform = {'token':sessionStorage.getItem('token'),'platform_id':this.serverid,'user_type':3}
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
		},
		mounted() {
			window.onresize=()=>{this.tableheight=common.gwh()-135;}
			this.tableheight=common.gwh()-135;
			this.settingContent='float:left;width:'+(common.gww()*0.9-170)+'px'
		},
		activated(){
			window.onresize=()=>{this.tableheight=common.gwh()-135;}
			this.tableheight=common.gwh()-135;
			this.$refs['bolinkservertable'].$refs['search'].resetSearch()
			this.$refs['bolinkservertable'].getTableData({})
			let _this = this
			//所有厂商,所有服务商
			this.axios.all([common.getUnionList(),common.getBankInfo(),common.getServerList()])
				.then(this.axios.spread(function(union,bankinfo,sevlist){
					_this.ulist=union.data
					_this.banklist=bankinfo.data
					_this.slist = sevlist.data
			}))
		},
		watch:{
			ulist:function(val){
				this.tableitems[1].subs[0].selectlist=val
			},
            slist:function(val){
                this.tableitems[2].subs[0].selectlist=val
            },
			banklist:function(val){
				this.cardtableitems[2].subs[0].selectlist=val
			},
		}
	}

</script>