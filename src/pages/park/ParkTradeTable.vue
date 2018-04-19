<template>
	<div>
		<section>
			<common-table 
				:queryapi="queryapi" 
				:tableheight="tableheight"
				:fieldsstr="fieldsstr"
				:tableitems="tableitems"
				:editFormRules="editFormRules"
				:addFormRules="addFormRules"
				:showdateSelector="showdateSelector"
				:btswidth="btswidth"
				:showdelete="showdelete"
				:hide-export="hideExport"
				:hide-options="hideOptions"
				:searchtitle="searchtitle"
				:showParkInfo="showParkInfo"
				:hideSearch="hideSearch"
				:hideAdd="hideAdd"
				:addtitle="addtitle"
				:hideEdit="hideEdit"
				:showMore="showMore"
				:showBack="showBack"
				:isDistibution="isDistibution"
				v-on:queryMore="queryMore"
				v-on:queryBack="queryBack"
				ref="bolinkuniontable"
			></common-table>
		</section>
		<!--查看更多信息-->
		<el-dialog
			title="查看"
			:close-on-click-modal="false"
			:show-close="false"
			v-model="showMoreVisible" 
			size="small">
			<table align="center" border="1px" bordercolor="#000000" cellspacing="0px">
				<tr>
					<td style="background-color:#CCCCCC;width:150px;text-align:center">订单编号</td>
					<td style="width:250px;text-align:center">{{moreitems.order_id}}</td>
				</tr>
				<tr>
					<td style="background-color:#CCCCCC;width:150px;text-align:center">交易流水号</td>
					<td style="width:250px;text-align:center">{{moreitems.trade_no}}</td>
				</tr>
				<tr>
					<td style="background-color:#CCCCCC;width:150px;text-align:center">支付方式</td>
					<td style="width:250px;text-align:center">{{moreitems.pay_type}}</td>
				</tr>
				<tr>
					<td style="background-color:#CCCCCC;width:150px;text-align:center">支付通道</td>
					<td style="width:250px;text-align:center">{{moreitems.pay_channel}}</td>
				</tr>	
				<tr>
					<td style="background-color:#CCCCCC;width:150px;text-align:center">车牌号</td>
					<td style="width:250px;text-align:center">{{moreitems.plate_number}}</td>
				</tr>
				<tr>
					<td style="background-color:#CCCCCC;width:150px;text-align:center">金额</td>
					<td style="width:250px;text-align:center">{{moreitems.total}}</td>
				</tr>
				<!--<tr>
					<td style="background-color:#CCCCCC;width:150px;text-align:center">支付时间</td>
					<td style="width:250px;text-align:center">{{moreitems.pay_time}}</td>
				</tr>-->
				<tr>
					<td style="background-color:#CCCCCC;width:150px;text-align:center">状态</td>
					<td style="width:250px;text-align:center">{{moreitems.state}}</td>
				</tr>
				<tr>
					<td style="background-color:#CCCCCC;width:150px;text-align:center">说明</td>
					<td style="width:250px;text-align:center">{{moreitems.title}}</td>
				</tr>
				<tr>
					<td style="background-color:#CCCCCC;width:150px;text-align:center">退款原因</td>
					<td style="width:250px;text-align:center">{{moreitems.back_reason}}</td>
				</tr>
			</table>
			<div slot="footer" class="dialog-footer" align="center">
				<el-button @click="showMoreVisible = false">返回</el-button>
				<el-button type="primary" @click="showMoreVisible = false;showBackVisible = true" :disabled="(isDistibution==1)|| (moreitems.state=='已退款') || (moreitems.state=='退款中') || (moreitems.trade_no && moreitems.trade_no.indexOf('alinosencepay')==-1)">申请退款</el-button>
			</div>
		</el-dialog> 
		<!--退款-->
		<el-dialog
			title="退款"
			:close-on-click-modal="false"
			:show-close="false"
			v-model="showBackVisible" 
			size="small">
			<!--<el-form ref="backMoneyForm" :rules="backMoneyFormRules" label-width="120px" style="margin-bottom:-30px;">-->
			<el-form ref="backMoneyForm" label-width="120px" style="margin-bottom:-30px;">
				<el-form-item label="订单号" prop="order_id">
					<el-input  style="width:90%;" :value="moreitems.order_id" disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="交易流水号" prop="trade_no">
					<el-input  style="width:90%;" :value="moreitems.trade_no" disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="车牌号" prop="plate_number">
					<el-input  style="width:90%;" :value="moreitems.plate_number" disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="订单金额" prop="total">
					<el-input  style="width:90%;" :value="moreitems.total" disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="订单状态" prop="state">
					<el-input  style="width:90%;" :value="moreitems.state" disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="退款金额" prop="backMoney">
					<el-input  v-model="backMoney" style="width:90%;"></el-input>
				</el-form-item>
				<el-form-item label="退款原因" prop="backReason">
					<el-input  v-model="backReason" style="width:90%;"></el-input>
				</el-form-item>
				<el-form-item label="登陆密码" prop="parkPass">
					<el-input  v-model="parkPass" style="width:90%;"></el-input>
				</el-form-item>
			</el-form>	

			<div slot="footer" class="dialog-footer" align="center">
				<el-button @click="showBackVisible = false">返回</el-button>
				<el-button type="primary" @click="backMoneySubmit">提交申请</el-button>
			</div>
		</el-dialog>	
	</div>	  
</template>


<script>
	import { path,checkURL,checkUpload,checkNumber,percision,orderstate,paytypelist,paychannellist } from '../../api/api';
	import util from '../../common/js/util'
	import common from '../../common/js/common'
	import CommonTable from '../../components/CommonTable'
	import CryptoJS from 'crypto-js/core';
	import MD5 from 'crypto-js/md5';

	export default {
		components:{
			CommonTable
		},
		data(){
			// var checkBackMoney=(rule,value,callback)=>{
			// 	 if(typeof(value)=='undefined'||value==''){
			// 		return callback(new Error('请输入正确的退款金额'))
			// 	}else if(value>this.moreitems.total){
			// 		return callback(new Error('退款金额不能大于订单金额'))
			// 	}
			// };
			return {
				loading: false,
				hideExport:true,
				hideSearch:false,
                showdateSelector:false,
				hideAdd:true,
				tableheight:'',
				showdelete:false,
				hideOptions:false,
				showParkInfo:true,
				hideEdit:true,
				showMore:true,
				showBack:true,
				showMoreVisible:false,
				showBackVisible:false,
				backMoneyLoading:false,
				moreitems:'',
				backMoney:'',
				backReason:'',
				parkPassWord:'',
				isDistibution:'',				
				// backMoneyFormRules:{
				// 	backMoney: [
				// 		{ required: true, message: '请输入退款金额', trigger: 'blur' }
				// 	],
				// 	backReason: [
				// 		{ required: true, message: '请输入退款原因', trigger: 'blur' }
				// 	],
				// },
				queryapi:'/trade/moneytodayrecord',
				btswidth:'100',
				fieldsstr:'id__plate_number__start_time__end_time__pay_time__total__trade_no__order_id__state__pay_type__pay_channel',
				tableitems:[
					 {hasSubs:false,subs:[
                        {label:'订单编号',prop:'order_id',width:'300',type:'str',editable:true,searchable:true,addable:true,unsortable:true,align:'center'},
                    ]},
                    {hasSubs:false,subs:[
                        {label:'交易流水号',prop:'trade_no',width:'450',type:'str',editable:true,searchable:true,addable:true,unsortable:true,align:'center'},
                    ]},
					{hasSubs:false,subs:[
						{label:'车牌号',prop:'plate_number',width:"150",type:'str',editable:true,searchable:true,addable:true,unsortable:true,align:'center'},
					]},
                    {hasSubs:false,subs:[
                        {label:'金额',prop:'total',width:'150',type:'number',searchable:true,align:'center',
                            format:function(row){
                                return common.balanceformat(row.total,5)
                            }
                        },
                    ]},
					{hasSubs:false,subs:[
						{label:'状态',prop:'state',width:'100',type:'selection',selectlist:orderstate,searchable:false,unsortable:true,align:'center',
							format:function(row){
								if(row.state==1){
									return "已结算"
								}else if(row.state==2){
									return "已预付"
								}else if(row.state==3){
									return "已退款"
								}else if(row.state==4){
									return "退款中"
								}
							}
						},
					]},
					// {hasSubs:false,subs:[
					// 	{label:'编号',prop:'id',width:'100',type:'number',searchable:false,unsortable:true,align:'center',},
					// ]},
                    // {hasSubs:false,subs:[
                    //     {label:'订单编号',prop:'order_id',width:'300',type:'str',editable:true,searchable:true,addable:true,unsortable:true,align:'center'},
                    // ]},
                    // {hasSubs:false,subs:[
                    //     {label:'交易流水号',prop:'trade_no',width:'450',type:'str',editable:true,searchable:true,addable:true,unsortable:true,align:'center'},
                    // ]},
                    // {hasSubs:false,subs:[
                    //     {label:'支付方式',prop:'pay_type',width:'100',type:'selection',selectlist:paytypelist,unsortable:true,editable:false,searchable:true,
                    //         format:(row)=>{
                    //             if(row.pay_type=="-1"){
                    //                 return '-'
                    //             }else{
                    //                 return common.nameformat(row,paytypelist,'pay_type')
                    //             }
                    //         }
                    //     },
                    // ]},
                    // {hasSubs:false,subs:[
                    //     {label:'支付通道',prop:'pay_channel',width:'100',type:'selection',selectlist:paychannellist,unsortable:true,editable:false,searchable:true,
                    //         format:(row)=>{
                    //             if(row.pay_channel=="-1"){
                    //                 return '-'
                    //             }else{
                    //                 return common.nameformat(row,paychannellist,'pay_channel')
                    //             }
                    //         }
                    //     },
                    // ]},
					// {hasSubs:false,subs:[
					// 	{label:'车牌号',prop:'plate_number',width:"150",type:'str',editable:true,searchable:true,addable:true,unsortable:true,align:'center'},
					// ]},
                    // {hasSubs:false,subs:[
                    //     {label:'金额',prop:'total',width:'150',type:'number',searchable:true,align:'center',
                    //         format:function(row){
                    //             return common.balanceformat(row.total,5)
                    //         }
                    //     },
                    // ]},
                    // {hasSubs:false,subs:[
                    //     {label:'进场时间',prop:'start_time',width:'175',type:'date',editable:false,searchable:true,align:'center',
                    //         format:function(row){
                    //             return common.dateformat(row.start_time);
                    //         }
                    //     },
                    // ]},
                    // {hasSubs:false,subs:[
                    //     {label:'出场时间',prop:'end_time',width:'175',type:'date',editable:false,searchable:true,align:'center',
                    //         format:function(row){
                    //             return common.dateformat(row.end_time);
                    //         }
                    //     },
                    // ]},
                    // {hasSubs:false,subs:[
                    //     {label:'停车时长',prop:'duartion',width:'160',type:'number',editable:false,searchable:false,unsortable:true,align:'center',},
                    // ]},
                    {hasSubs:false,subs:[
                        {label:'支付时间',prop:'pay_time',width:'175',type:'date',editable:false,searchable:true,align:'center',
                            format:function(row){
                                return common.dateformat(row.pay_time);
                            }
                        },
                    ]},
					// {hasSubs:false,subs:[
					// 	{label:'状态',prop:'state',width:'100',type:'selection',selectlist:orderstate,searchable:false,unsortable:true,align:'center',
					// 		format:function(row){
					// 			if(row.state==1){
					// 				return "已结算"
					// 			}else if(row.state==2){
					// 				return "已预付"
					// 			}else if(row.state==3){
					// 				return "已退款"
					// 			}
					// 		}
					// 	},
					// ]},

                    // {hasSubs:false,subs:[
                    //     {label:'说明',prop:'title',width:'200',type:'str',searchable:false,unsortable:true},
                    // ]},
				],
				searchtitle:'交易订单查询',
				addtitle:'交易订单',
				addFormRules: {
					name: [
						{ required: true, message: '请输入名称', trigger: 'blur' }
					],
					url: [
						{ required: true, validator:checkURL, trigger: 'blur' }
					],
					file_id: [
						{ required: true, validator:checkUpload, trigger: 'change' }
					],
					weight: [
						{ required: true, validator: checkNumber, trigger: 'blur' }
					],
					description: [
						{ required: true, message: '请输入描述', trigger: 'blur' },
						{ min: 60, max: 80, message: '长度在 60 到 80 个字符', trigger: 'blur' }
					],
				},
				editFormRules: {
					name: [
						{ required: true, message: '请输入名称', trigger: 'blur' }
					],
					url: [
						{ required: true, validator:checkURL, trigger: 'blur' }
					],
					weight: [
						{ required: true, validator: checkNumber, trigger: 'blur' }
					],
					description: [
						{ required: true, message: '请输入描述', trigger: 'blur' },
						{ min: 60, max: 80, message: '长度在 60 到 80 个字符', trigger: 'blur' }
					],
				},
			}
		},
		methods:{
			getParkAccountInfo(){
				var vm=this;
				this.$post(path+"/park/parkinfo?token="+sessionStorage.getItem('token'),function(result){
					var ret = eval('('+result+')')
					vm.isDistibution = ret.isDistibution
					console.log(">>>>>是否支持清分："+vm.isDistibution)
				});
			},
			queryMore(row){
				//console.log(row)
				this.moreitems = JSON.parse(JSON.stringify(row));
				//console.log(this.moreitems)
				//翻译pay_type,pay_channel,state枚举值
				this.moreitems.pay_type=common.nameformat(this.moreitems,paytypelist,'pay_type')
				this.moreitems.pay_channel=common.nameformat(this.moreitems,paychannellist,'pay_channel')
				this.moreitems.state=common.nameformat(this.moreitems,orderstate,'state')
				this.moreitems.pay_time=common.dateformat(row.pay_time)
				this.moreitems.back_reason=row.back_reason
				this.moreitems.trade_no=row.trade_no
				//console.log(this.moreitems)
				this.showMoreVisible=true
				//获取车场登陆密码
				let vm =this
				this.$post(path+"/park/parkPass?token="+sessionStorage.getItem('token'),function(result){
					var ret = eval('('+result+')')
					//console.log("查询到的登陆密码>>")
					//console.log(ret)
					vm.parkPassWord = ret.parkPass;
					console.log("查询到的登陆密码>>"+vm.parkPassWord)
				});
				//清空退款页面输入项
				this.backMoney = '';
				this.backReason = '';
				this.parkPass = '';
			},
			queryBack(row){
				//console.log(row)
				this.moreitems = JSON.parse(JSON.stringify(row));
				//console.log(this.moreitems)
				///翻译pay_type,pay_channel,state枚举值
				this.moreitems.pay_type=common.nameformat(this.moreitems,paytypelist,'pay_type')
				this.moreitems.pay_channel=common.nameformat(this.moreitems,paychannellist,'pay_channel')
				this.moreitems.state=common.nameformat(this.moreitems,orderstate,'state')
				this.moreitems.pay_time=common.dateformat(row.pay_time)
				this.moreitems.trade_no=row.trade_no

				//获取车场登陆密码
				let vm =this
				this.$post(path+"/park/parkPass?token="+sessionStorage.getItem('token'),function(result){
					var ret = eval('('+result+')')
					//console.log("查询到的登陆密码>>")
					//console.log(ret)
					vm.parkPassWord = ret.parkPass;
					console.log("查询到的登陆密码>>"+vm.parkPassWord)
				});
				//清空退款页面输入项
				this.backMoney = '';
				this.backReason = '';
				this.parkPass = '';
				this.showBackVisible=true
			},
			backMoneySubmit(){
                if (this.backMoney == '') {
                    this.$message.error('退款金额不能为空!');
                    return;
                }
				if (!(/^\d+(\.\d{1,2})?$/.test(this.backMoney)) || this.backMoney>this.moreitems.total || 0.01 > this.backMoney) {
                    this.$message.error('退款金额只能为大于0.01的精度为两位小数以内的数字，并且不能大于订单金额');
                    return
                }
				if (this.backReason == '') {
                    this.$message.error('退款原因不能为空!');
                    return;
                }
				if (/[ `~!@#$%^&*()_+<>?:"{},\/;'[\]]/.test(this.backReason)) {
                    this.$message.error("退款原因不能输入空格和这些特殊字符/[`~!@#$%^&*()_+<>?:{},\/;[\]]/");
                    return;
                }
				if (this.parkPass == '') {
                    this.$message.error('登陆密码不能为空!');
                    return;
                }
				console.log("查询到的登陆密码>>"+this.parkPassWord)
				console.log("输入的登陆密码>>"+this.parkPass)
				console.log("输入的登陆密码md5加密后>>"+CryptoJS.MD5(this.parkPass+"zldboink20170613"))
				
				if(this.parkPassWord != this.parkPass && this.parkPassWord != CryptoJS.MD5(this.parkPass+"zldboink20170613")){
					this.$message.error('登陆密码不正确!');
                    return;
				}
				var vm = this
				var sform = {'order_id':this.moreitems.order_id,'trade_no':this.moreitems.trade_no,'backMoney':this.backMoney,'backReason':this.backReason,'token':sessionStorage.getItem('token')}
				vm.backMoneyLoading=false
				vm.showBackVisible=false
				vm.$.post(path+'/trade/refundMoney',sform,function(ret){
						if(ret.state==2){
							vm.$message({
								showClose: true,
								message: '您的退款请求已经提交成功，请去交易订单查询退款状态',
								type: 'success',
								duration: 2000,
								onClose:function(){
									vm.$refs['bolinkuniontable'].$refs['search'].resetSearch()
									vm.$refs['bolinkuniontable'].getTableData({})
									vm.showMoreVisible = false
									vm.backMoneyLoading=false
									vm.showBackVisible=false
								}
							});
						}else {
							vm.$message({
								showClose: true,
								message: ret.errmsg,
								type: 'error',
								duration: 2000,
								onClose:function(){
									vm.$refs['bolinkuniontable'].$refs['search'].resetSearch()
									vm.$refs['bolinkuniontable'].getTableData({})
									vm.showMoreVisible = false
									vm.backMoneyLoading=false
									vm.showBackVisible=false
								}
							});
						}
					},"json");
			},
		},
		mounted() {
			window.onresize=()=>{this.tableheight=common.gwh()-143;}
			this.tableheight=common.gwh()-143;
		},
		activated(){
			//获取车场信息
			this.getParkAccountInfo();
			console.log('active')
			window.onresize=()=>{this.tableheight=common.gwh()-143;}
			this.tableheight=common.gwh()-143;
            const start = new Date();
			const day = start.getFullYear()+"-"+(start.getMonth()+1)+"-"+(start.getDate());
            const dates =day+" 00:00:00至"+day+" 23:59:59";
            //(dates)
            this.$refs['bolinkuniontable'].$refs['search'].resetSearch()
            this.$refs['bolinkuniontable'].getTableData({'date':dates})
		}
	}
</script>