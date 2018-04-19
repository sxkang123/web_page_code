<template>
	<section>
		<common-table 
			:queryapi="queryapi" 
			:exportapi="exportapi"
			:tableheight="tableheight"
			:fieldsstr="fieldsstr"
			:tableitems="tableitems"
			:editFormRules="editFormRules"
			:btswidth="btswidth"
			:searchtitle="searchtitle"
			:hide-options="hideOptions"
			:hide-export="hideExport"
			:hide-add="hideAdd"
			ref="moneyrecord"
		></common-table>
	</section>
</template>

<script>
	import { path,stateitems,dtypelist,otypelist,paytypelist,paychannellist } from '../../../api/api';
	import util from '../../../common/js/util'
	import common from '../../../common/js/common'
	import CommonTable from '../../../components/CommonTable'

	export default {
		components:{
			CommonTable
		},
		data(){
			return {
				loading: false,
				hideOptions:true,
				hideExport:true,
				hideAdd:true,
				tableheight:'',
				queryapi:'/trade/moneyrecord',
				exportapi:'/trade/export',
				btswidth:'70',
				fieldsstr:'id__order_id__query_id__dtype__otype__money__ctime__pay_type__pay_channel',
				otypelist:[],
				tableitems:[
					{hasSubs:false,subs:[
						{label:'编号',prop:'id',width:'160',type:'number',searchable:true,align:'center',},
					]},
					{hasSubs:false,subs:[
						{label:'订单编号',prop:'order_id',width:'320',type:'str',searchable:true,unsortable:true,align:'center',
							format:function(row){
								if(row.order_id==''||row.order_id==null){
									return '-'
								}else{
									return row.order_id
								}
							}
						},
					]},
					{hasSubs:false,subs:[
						{label:'查询编号',prop:'query_id',width:'120',type:'number',searchable:true,unsortable:true,align:'center',
							format:function(row){
								if(row.query_id==''||row.query_id==null){
									return '-'
								}else{
									return row.query_id
								}
							}
						},
					]},
                    {hasSubs:false,subs:[
                        {label:'交易流水号',prop:'trade_no',width:'200',type:'str',searchable:false,unsortable:true},
                    ]},
                    {hasSubs:false,subs:[
                        {label:'支付方式',prop:'pay_type',width:'100',type:'selection',selectlist:paytypelist,unsortable:true,editable:false,searchable:true,
                            format:(row)=>{
                                if(row.pay_type=="-1"){
                                    return '-'
                                }else{
                                    return common.nameformat(row,paytypelist,'pay_type')
                                }
                            }
                        },
                    ]},
                    {hasSubs:false,subs:[
                        {label:'支付通道',prop:'pay_channel',width:'100',type:'selection',selectlist:paychannellist,unsortable:true,editable:false,searchable:true,
                            format:(row)=>{
                                if(row.pay_channel=="-1"){
                                    return '-'
                                }else{
                                    return common.nameformat(row,paychannellist,'pay_channel')
                                }
                            }
                        },
                    ]},
					{hasSubs:false,subs:[
						{label:'账务类型',prop:'dtype',width:'200',type:'selection',selectlist:dtypelist,searchable:true,unsortable:true,align:'center',
							format:function(row){
								return common.nameformat(row,dtypelist,'dtype')
							}
						},
					]},
					{hasSubs:false,subs:[
						{label:'收支类型',prop:'otype',width:'100',type:'selection',selectlist:otypelist,searchable:true,unsortable:true,align:'center',
							format:function(row){
								return common.nameformat(row,otypelist,'otype')
							}
						},
					]},
					{hasSubs:false,subs:[
						{label:'交易时间',prop:'ctime',width:'200',type:'date',searchable:true,align:'center',
							format:function(row){
								return common.dateformat(row.ctime);
							}
						},
					]},
					{hasSubs:false,subs:[
						{label:'金额',prop:'money',width:'150',type:'number',searchable:true,align:'center',
							format:function(row){
								return common.balanceformat(row.money,5)
							}
						},
					]},
					{hasSubs:false,subs:[
						{label:'说明',prop:'remark',width:'480',type:'str',searchable:false,unsortable:true},
					]},
				],
				searchtitle:'资金流水',
				editFormRules: {},
			}
		},
		mounted() {
			window.onresize=()=>{this.tableheight=common.gwh()-135;}
			this.tableheight=common.gwh()-135;
		},
		activated(){
			window.onresize=()=>{this.tableheight=common.gwh()-135;}
			this.tableheight=common.gwh()-135;
			this.$refs['moneyrecord'].$refs['search'].resetSearch()
			this.$refs['moneyrecord'].getTableData({})
		}
	}

</script>

<style>
	.el-menu--horizontal.el-menu--dark .el-submenu .el-menu-item.is-active, .el-menu-item.is-active {
		color: #008F4C;
		font-weight:bold;
	}
</style>

