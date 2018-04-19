<template>
	<section>
		<common-table
			:exportapi="exportapi"
			:queryapi="queryapi" 
			:tableheight="tableheight"
			:showanalysisdate="showanalysisdate"
			:fieldsstr="fieldsstr"
			:tableitems="tableitems"
			:btswidth="btswidth"
			:showdelete="showdelete"
			:hide-options="hideOptions"
			:hide-export="hideExport"
			:hide-search="handleSearch"
			:hideTool="hideTool"
			:hide-add="hideAdd"
			ref="bolinkanalysistable"
		></common-table>
	</section>
</template>


<script>
	import { path } from '../../api/api';
	import util from '../../common/js/util'
	import common from '../../common/js/common'
	import CommonTable from '../../components/CommonTable'

	export default {
		components:{
			CommonTable
		},
		data(){
			return {
				loading: false,
				showanalysisdate:true,
				hideAdd:true,
				handleSearch:true,
				hideTool:false,
				hideExport:false,
				tableheight:'',
				showdelete:false,
				hideOptions:true,
				queryapi:'/analysis/parkoverview',
                exportapi:'/analysis/export',
				btswidth:'100',
				fieldsstr:'id__date__park_counts__trade_counts__money_sum',
				tableitems:[
					{hasSubs:false,subs:[
						{label:'日期',prop:'date',width:'110',type:'str',editable:true,searchable:true,addable:true,unsortable:true,align:'center',
							format:function(row){
								return common.dateformatonly(row.date)
							}
						},
					]},
					{hasSubs:false,subs:[
						{label:'泊链车场编号',prop:'bolink_id',width:"125",type:'number',editable:false,searchable:true,addable:false,unsortable:true,align:'center'},
					]},
					{hasSubs:false,subs:[
						{label:'厂商编号',prop:'union_id',width:"100",type:'number',editable:false,searchable:true,addable:false,unsortable:true,align:'center'},
					]},
                    {hasSubs:false,subs:[
                        {label:'运营商',prop:'operator_id',width:'280',type:'selection',selectlist:this.olist,editable:false,searchable:true,unsortable:true,
                            format:(row)=>{return common.nameformat(row,this.olist,'operator_id')}
                        },
                    ]},
					{hasSubs:false,subs:[
						{label:'车场名称',prop:'park_name',width:"260",type:'str',editable:true,searchable:true,addable:true,unsortable:true,align:'center'},
					]},
					{hasSubs:true,label:'电子交易笔数',subs:[
						{label:'停车交易',prop:'trade_counts',width:"100",type:'str',editable:true,
							searchable:true,addable:true,unsortable:true,align:'center'},
                        {label:'月卡交易',prop:'trade_counts_month',width:"100",type:'str',editable:true,
                            searchable:true,addable:true,unsortable:true,align:'center'},
                        {label:'合计',prop:'trade_total',width:"100",type:'str',editable:true,
                            searchable:true,addable:true,unsortable:true,align:'center'},
					]},
					{hasSubs:true,label:'电子交易金额',subs:[
						{label:'停车费金额',prop:'money_sum',width:"120",type:'str',editable:true,searchable:true,addable:true,unsortable:true,align:'center',
							format:function(row){
								return common.balanceformat(row.money_sum,2)
							}
						},
                        {label:'月卡金额',prop:'money_sum_month',width:"120",type:'str',editable:true,searchable:true,addable:true,unsortable:true,align:'center',
                            format:function(row){
                                return common.balanceformat(row.money_sum_month,2)
                            }
                        },
                        {label:'合计',prop:'money_total',width:"100",type:'str',editable:true,
                            searchable:true,addable:true,unsortable:true,align:'center'},
					]},
					// {hasSubs:false,subs:[
					// 	{label:'现金停车交易笔数',prop:'cash_count',width:"200",type:'str',editable:true,
					// 		searchable:true,addable:true,unsortable:true,align:'center'},
					// ]},
					// {hasSubs:fasle,subs:[
					// 	{label:'现金停车费金额',prop:'cash_money',width:"200",type:'str',editable:true,searchable:true,addable:true,unsortable:true,align:'center',
					// 		format:function(row){
					// 			return common.balanceformat(row.money_sum,2)
					// 		}
					// 	},
					// ]},
					{hasSubs:false,subs:[
						{label:'提现状态',prop:'state',width:"100",type:'str',editable:true,searchable:true,addable:true,unsortable:true,align:'center',
							format:function(row){
								if(row.state==-1){
									return "尚未发起"
								}else if(row.state==1){
									return "提现成功"
								}else if(row.state==2){
									return "提现失败"
								}else if(row.state==3){
									return "已申请"
								}
							}
						},
					]},
					{hasSubs:false,subs:[
						{label:'提现金额',prop:'amount',width:"120",type:'str',editable:true,searchable:true,addable:true,unsortable:true,align:'center'},
					]},
					{hasSubs:false,subs:[
						{label:'提现说明',prop:'remark',width:"200",type:'str',editable:true,searchable:true,addable:true,unsortable:true,align:'center'},
					]},
					
				],
			}
		},
		mounted() {
			window.onresize=()=>{this.tableheight=common.gwh()-103;}
			this.tableheight=common.gwh()-103;
		},
		activated(){
			console.log('active')
			window.onresize=()=>{this.tableheight=common.gwh()-103;}
			this.tableheight=common.gwh()-103;
			this.$refs['bolinkanalysistable'].getTableData({})
			var _this  = this;
            this.axios.all([common.getOperatorList()])
                .then(this.axios.spread(function(operatorList){
                    _this.olist=operatorList.data
                }))
		},
        watch:{
            olist:function(val){
                this.tableitems[3].subs[0].selectlist=val
            }
        }
	}

</script>