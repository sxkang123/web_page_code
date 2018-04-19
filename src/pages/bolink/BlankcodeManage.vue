<template>
	<section> 
		<common-table 
			:queryapi="queryapi" 
			:delapi="delapi"
			:editapi="editapi"
			:exportapi="exportapi"
			:selfexportapi="selfexportapi"
			:tableheight="tableheight"
			:fieldsstr="fieldsstr"
			:tableitems="tableitems"
			:btswidth="btswidth"
			:addtitle="addtitle"
			:showdelete="showdelete"
			:hideExport="hideExport"
			:hideSearch="hideSearch"
			:hideAdd="hideAdd"
			:showExportImage="showExportImage"
			:showExportExcel="showExportExcel"
			:showSelectCode="showSelectCode"
			:expoertImageTitle="expoertImageTitle"
			:expoertExcelTitle="expoertExcelTitle"
			v-on:selfAdd="selfAdd"
			v-on:selfExport="selfExport"
			ref="blankcodemanage"
		></common-table>

		<el-dialog title="注册空白码" v-model="showAddForm" top="6%" size="tiny">
			<div >
					<el-form ref="addForm" label-width="120px" style="width:100%">
						<el-row>
							<el-col :span="23" :offset="1" style="margin-top: 10px;margin-bottom:5px">
							</el-col>
							<el-row>
								<el-col :span="10" :offset="1" >
									<el-row>
										<el-col :span="23" :offset="1" style="padding-top:0px;margin-top: 10px;margin-bottom:33px">
											<span style="display:inline-block;width:84px">厂商：</span>
											<el-select v-model="addFormItem.union_id" placeholder="请选择" filterable @change="" style="width:150px">
												<el-option
													v-for="item in ulist"
													:label="item.value_name"
													:value="item.value_no"
													>
												</el-option>
											</el-select>
										</el-col>
									</el-row>
									<el-row>
										<el-col :span="23" :offset="1" style="padding-top:0px;margin-top: 10px;margin-bottom:33px">
											<span style="display:inline-block;width:84px">二维码数量：</span>
											<el-input v-model="addFormItem.code_number" style="width:150px"></el-input>
										</el-col>
									</el-row>
									<el-row>
										<el-col :span="23" :offset="1" style="padding-top:0px;margin-top: 10px;margin-bottom:33px">
											<span style="display:inline-block;width:84px">背景图：</span>
											<el-select v-model="addFormItem.bgpic_id" placeholder="请选择" filterable @change="selectBackGroudPic" style="width:150px">
												<el-option
													v-for="item in bglist"
													:label="item.value_name"
													:value="item.value_no"
													>
												</el-option>
											</el-select>
										</el-col>
									</el-row>
								</el-col>
								<el-col :span="12" :offset="1" align="center">
									<img :src="qrUrl" height="250px"/>
								</el-col>
							</el-row>
						</el-row>		
					</el-form>
					<el-col align="right" style="margin-bottom:18px;margin-top:45px;">
						<el-button @click="showAddForm = false" size="small">清 空</el-button>
						<el-button type="primary" @click="saveBlankCode" size="small" :disabled="isCLickSave">保 存</el-button>
					</el-col>
			</div>
		</el-dialog>
	</section>
</template> 


<script>
	import { path,blankcodestate,bgpiclist } from '../../api/api';
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
				isCLickSave:false,
				qrUrl:'',
				prepic:require(('../../assets/outpark.png')),
				outparkpic:require(('../../assets/outpark.png')),
				inparkpic:require(('../../assets/outpark.png')),
				ulist:[],
				plist:[],
				// bglist:[{'value_no':'1','value_name':'预付背景图'},
				// 	{'value_no':'2','value_name':'直付背景图'},
				// 	{'value_no':'3','value_name':'入场背景图'}],
				bglist:[{'value_no':'2','value_name':'直付背景图'}],
				showAddForm:false,
				addFormItem:{
					'union_id':'',
					'code_number':'',
					'bgpic_id':'',

				},
				loading: false,
				tableheight:'',
				queryapi:'/blankcode/query',
				delapi:'/blankcode/delete',
				exportapi:'/blankcode/export',
				addapi:'/blankcode/add',
				editapi:'/blankcode/edit',
				selfexportapi:'/blankcode/exportpic',
				showdelete:true,
				btswidth:'120',
				hideExport:true,
				hideSearch:true,
				hideAdd:true,
				showExportImage:true,
				showExportExcel:true,
				showSelectCode:true,
				fieldsstr:'union_id__park_id__state__bgpic_id__qrcode_id',
				tableitems:[
					{hasSubs:false,subs:[
						{label:'厂商名称',prop:'union_id',width:'250',type:'selection',align:'center',selectlist:this.ulist,unsortable:true,addable:true,
							format:(row)=>{return common.nameformat(row,this.ulist,'union_id')}
						},
					]},
					{hasSubs:false,subs:[
						{label:'车场名称',prop:'pid',width:'250',type:'selection',align:'center',selectlist:this.plist,unsortable:true,
							format:(row)=>{return common.nameformat(row,this.plist,'pid')}
						},
					]},
					{hasSubs:false,subs:[
						{label:'是否激活',prop:'state',width:'120',type:'selection',align:'center',selectlist:blankcodestate,unsortable:true,
							format:(row)=>{return common.nameformat(row,blankcodestate,'state')}
						},
					]},
					{hasSubs:false,subs:[
						{label:'背景图',prop:'bgpic_id',width:'120',type:'selection',align:'center',selectlist:bgpiclist,editable:true,unsortable:true,
							format:(row)=>{return common.nameformat(row,bgpiclist,'bgpic_id')}	
						},
					]},
					{hasSubs:false,subs:[
						{label:'二维码',prop:'qrcode_id',width:'310',type:'number',align:'center',unsortable:true},
					]},
				],
				addtitle:'注册空白码',
				expoertImageTitle:'导出图片',
				expoertExcelTitle:'导出excel',
				editFormRules: {
					name: [
						{ required: true, message: '请输入名称', trigger: 'blur' }
					],
					
				},
			}
		},
		mounted() {
			window.onresize=()=>{this.tableheight=common.gwh()-135;}
			this.tableheight=common.gwh()-135;
			this.settingContent='float:left;width:'+(common.gww()*0.9-170)+'px'
		},
		methods:{
			selfAdd(){
				//初始化注册页面
				this.addFormItem={
					'union_id':'',
					'code_number':'',
					'bgpic_id':'',

				},
				this.qrUrl=''
				this.isCLickSave=false
				this.showAddForm=true
			},
			selfExport(params){
                var api = this.selfexportapi;
                window.open(path + api + '?' + params);

			},
			saveBlankCode(){
				var vm = this
				var sform = this.addFormItem
				//校验输入信息
				if(typeof(sform.union_id)=='undefined'||sform.union_id==''){
					vm.$message({
							message: '请选择厂商!',
							type: 'error',
							duration:2000,
						});
					return;	
				}
				if(typeof(sform.code_number)=='undefined'||sform.code_number==''){
					vm.$message({
							message: '请填写二维码数量!',
							type: 'error',
							duration:2000,
						});
					return;	
				}else if(!(/^[0-9]*$/.test(sform.code_number)) || sform.code_number<1){
					vm.$message({
							message: '二维码数量必须为大于0的数字!',
							type: 'error',
							duration:2000,
						});
					return;	
				}
				//禁用保存按钮，防止重复提交
				this.isCLickSave=true
				this.$extend(sform,{'token':sessionStorage.getItem('token')})
				vm.$post(path + vm.addapi, sform, function (result) {
                   var ret = JSON.parse(result)
					if(ret.state==1){
						//验证码错误
						vm.$message({
							message: '保存成功!',
							type: 'success',
							duration:2000,
							onClose:function(){
								vm.isCLickSave=false
								vm.showAddForm = false
								vm.$refs['blankcodemanage'].getTableData({})
							}
						});
					}else{
						//验证码错误
						vm.$message({
							message: '保存失败!',
							type: 'error',
							duration:2000,
							onClose:function(){
								vm.isCLickSave=false
								vm.showAddForm = false
							}
						});
					}
				})
			},
			selectBackGroudPic(){
				var vm = this
				var bgId = vm.addFormItem.bgpic_id
				if(bgId == 1){
					vm.qrUrl = vm.prepic
				}
				if(bgId == 2){
					vm.qrUrl = vm.outparkpic
				}
				if(bgId == 3){
					vm.qrUrl = vm.inparkpic
				}
			}
		
		},
		activated(){
			window.onresize=()=>{this.tableheight=common.gwh()-135-56;}
			this.tableheight=common.gwh()-135-56;
			this.$refs['blankcodemanage'].getTableData({})
			//初始化信息
			var _this=this
			this.axios.all([common.getServerList(),common.getUnionList(),common.getParkList(),common.getBankInfo(),common.getBaPayUnionList(),common.getOperatorList()])
			.then(this.axios.spread(function(server,union,park,bankinfo,paylist,operatorList){
				_this.ulist=union.data
				_this.plist=park.data
				// _this.slist=server.data
				// _this.banklist=bankinfo.data
				// _this.paylist=paylist.data
				// _this.olist=operatorList.data
			}))
		},
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