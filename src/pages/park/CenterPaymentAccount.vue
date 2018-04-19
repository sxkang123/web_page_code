<template>
	<section>
		<common-table 
			:queryapi="queryapi"
			:tableheight="tableheight"
			:fieldsstr="fieldsstr"
			:tableitems="tableitems"
			:btswidth="btswidth"
			:hide-add="hideAdd"
			:hide-export="hideExport"
			:hide-options="hideOptions"
			:searchtitle="searchtitle"
			:addtitle="addtitle"
			:addFormRules="addFormRules"
			:showdelete="showdelete"
			:showCenterInfo="showCenterInfo"
			ref="bolinkuniontable"
		></common-table>
	</section>
</template>


<script>
	import { path,checkURL,checkUpload,checkNumber,percision,parktypelist,otypelist,checkCityInfo,distinctslist,changetypelist,centralpaymenttypelist,paytypelist  } from '../../api/api';
	import util from '../../common/js/util'
	import common from '../../common/js/common'
	import CommonTable from '../../components/CommonTable'
	import axios from 'axios'

	export default {
		components:{
			CommonTable
		},
		data(){
			return {
				loading: false,
				hideExport:true,
				hideOptions:true,
				showCenterInfo:true,
				hideAdd:true,
				tableheight:'',
				showdelete:true,
				queryapi:'/centralpaymentweb/queryaccount',
				parkid:'',
				btswidth:'100',
				fieldsstr:'id__machine_id__record_time__pay_type__machine_id__receive__remark__trade_no__change_type__order_id__change__money__pay_ment',
				tableitems:[
					{hasSubs:false,subs:[
						{label:'记录编号',prop:'id',width:'100',type:'number',searchable:true,unsortable:true,align:'center',},
					]},
					{hasSubs:false,subs:[
						{label:'设备',prop:'machine_id',width:'180',type:'selection',selectlist:this.centralpaymentlist,editable:false,searchable:false,addable:true,unsortable:true,align:'center',
							format:(row)=>{return common.nameformat(row,this.centralpaymentlist,'machine_id')}
						}
					]},
					{hasSubs:false,subs:[
						{label:'记录时间',prop:'record_time',width:'175',type:'date',searchable:true,align:'center',
							format:function(row){
									return common.dateformat(row.record_time);
								}
						},

					]},
					{hasSubs:false,subs:[
						{label:'财务类型',prop:'pay_type',width:'120',type:'selection',selectlist:centralpaymenttypelist,editable:true,searchable:true,addable:true,unsortable:true,align:'center',
							format:function(row){
								return common.nameformat(row,centralpaymenttypelist,'pay_type')
							}
						},
					]},
					{hasSubs:false,subs:[
						{label:'金额',prop:'receive',width:'120',type:'number',searchable:true,align:'center',
							format:function(row){
								return common.balanceformat(row.receive,0)
							}
						},
					]},
					{hasSubs:false,subs:[
						{label:'订单金额',prop:'money',width:'120',type:'number',searchable:true,align:'center',
							format:function(row){
								return common.balanceformat(row.money,2)
							}
						},
					]},
					{hasSubs:false,subs:[
						{label:'找零金额',prop:'change',width:'120',type:'number',searchable:true,align:'center',
							format:function(row){
								return common.balanceformat(row.change,2)
							}
						},
					]},
					{hasSubs:false,subs:[
						{label:'找零类型',prop:'change_type',width:'120',type:'selection',selectlist:changetypelist,editable:false,searchable:true,addable:false,unsortable:true,align:'center',
							format:function(row){
								return common.nameformat(row,changetypelist,'change_type')
							}
						},
					]},
					{hasSubs:false,subs:[
						{label:'车牌号',prop:'plate_number',width:'120',type:'str',editable:true,searchable:true,addable:true,unsortable:true,align:'center',
							format:function(row){
									if(row.plate_number==null){
										return '-'
									}else{
										return row.plate_number
									}
							}
						},
					]},
					{hasSubs:false,subs:[
						{label:'订单编号',prop:'order_id',width:'300',type:'str',editable:true,searchable:true,addable:true,unsortable:true,align:'center',
							format:function(row){
									if(row.order_id==null){
										return '-'
									}else{
										return row.order_id
									}
							}
						},
					]},
					{hasSubs:false,subs:[
						{label:'交易号',prop:'trade_no',width:'300',type:'str',editable:true,searchable:true,addable:true,unsortable:true,align:'center',
							format:function(row){
									if(row.trade_no==null){
										return '-'
									}else{
										return row.trade_no
									}
							}
						},
					]},
					{hasSubs:false,subs:[
						{label:'备注',prop:'remark',width:'250',type:'str',editable:false,searchable:true,addable:false,unsortable:true,align:'center'},
					]},
				],
				searchtitle:'查询缴费机',
				addFormRules: {
					name: [
						{ required: true, message: '请输入名称', trigger: 'blur' }
					],
					distincts: [
						{ required: true, validator:checkCityInfo,  trigger: 'change' }
					],
					address: [
						{ required: true, message: '请输入缴费机安置详细地址', trigger: 'blur' }
					],
					model: [
						{ required: true, message: '请输入缴费机型号', trigger: 'blur' }
					],
					password: [
						{ required: true, message: '请输入缴费机登录密码', trigger: 'blur' }
					],
				},
				editFormRules: {
					name: [
						{ required: true, message: '请输入名称', trigger: 'blur' }
					],
				},
				centralpaymentlist:'',
			}
		},
		mounted() {
			window.onresize=()=>{this.tableheight=common.gwh()-143;}
			this.tableheight=common.gwh()-143;
		},
		activated(){
			var _this = this
			window.onresize=()=>{this.tableheight=common.gwh()-143;}
			this.tableheight=common.gwh()-143;
			this.$refs['bolinkuniontable'].$refs['search'].resetSearch()
			this.$refs['bolinkuniontable'].getTableData({})
			//所有厂商,所有服务商
			axios.all([common.getCentralPaymentList('&state=1')])
				.then(axios.spread(function(central){
					_this.centralpaymentlist=central.data
			}))
		},
		watch:{
			centralpaymentlist:function(val,oldVal){
				this.tableitems[1].subs[0].selectlist=val
			}
		}
	}

</script>