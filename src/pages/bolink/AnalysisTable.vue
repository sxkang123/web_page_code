<template>
	<section>
		<common-table 
			:queryapi="queryapi" 
			:tableheight="tableheight"
			:fieldsstr="fieldsstr"
			:tableitems="tableitems"
			:btswidth="btswidth"
			:showdelete="showdelete"
			:hide-options="hideOptions"
			:hide-export="hideExport"
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
				hideAdd:true,
				hideTool:true,
				hideExport:true,
				tableheight:'',
				showdelete:false,
				hideOptions:true,
				queryapi:'/analysis/overviewnew',
				btswidth:'100',
				fieldsstr:'id__date__park_counts__trade_counts__money_sum__cash_count__cash_money',
				tableitems:[
					{hasSubs:false,subs:[
						{label:'日期',prop:'date',width:'200',type:'str',editable:true,searchable:true,addable:true,unsortable:true,align:'center'},
					]},
					{hasSubs:true,label:'交易车场数',subs:[
						{label:'现金',prop:'park_cash',width:"200",type:'str',editable:true,searchable:true,addable:true,unsortable:true,align:'center'},
            			{label:'电子',prop:'park_counts',width:"200",type:'str',editable:true,searchable:true,addable:true,unsortable:true,align:'center'},
					]},
					{hasSubs:true,label:'交易笔数',subs:[
						{label:'现金',prop:'cash_count',width:"200",type:'str',editable:true,searchable:true,addable:true,unsortable:true,align:'center'},
                        {label:'电子',prop:'trade_counts',width:"200",type:'str',editable:true,searchable:true,addable:true,unsortable:true,align:'center'},
					]},		
					{hasSubs:true,label:'交易金额',subs:[
						{label:'现金',prop:'cash_money',width:"200",type:'str',editable:true,searchable:true,addable:true,unsortable:true,align:'center',
							format:function(row){
								return common.balanceformat(row.cash_money,2)
							}
						},
						{label:'电子',prop:'money_sum',width:"200",type:'str',editable:true,searchable:true,addable:true,unsortable:true,align:'center',
							format:function(row){
								return common.balanceformat(row.money_sum,2)
							}
						},
					]},
				],
			}
		},
		mounted() {
			window.onresize=()=>{this.tableheight=common.gwh()-99;}
			this.tableheight=common.gwh()-99;
		},
		activated(){
			console.log('active')
			window.onresize=()=>{this.tableheight=common.gwh()-99;}
			this.tableheight=common.gwh()-99;
			this.$refs['bolinkanalysistable'].getTableData({})
		}
	}

</script>