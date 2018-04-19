<template>
	<section>
		<common-table 
			:queryapi="queryapi" 
			:queryparams="queryparams"
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
			ref="querytradeout"
		></common-table>
	</section>
</template>

<script>
	import { path,stateitems } from '../../../api/api';
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
				queryapi:'/trade/query',
				queryparams:{'direction':'out'},
				exportapi:'/trade/export',
				btswidth:'70',
				fieldsstr:'id__query_id__ctime__money',
				tableitems:[
					{hasSubs:false,subs:[
						{label:'编号',prop:'id',width:'200',type:'number',editable:false,searchable:true,hide:true,align:'center',},
					]},
					{hasSubs:false,subs:[
						{label:'查询编号',prop:'query_id',type:'number',editable:false,searchable:true,align:'center',},
					]},
					{hasSubs:false,subs:[
						{label:'查询时间',prop:'ctime',width:'350',type:'date',editable:false,searchable:true,align:'center',
							format:function(row){
								return common.dateformat(row.ctime);
							}
						},
					]},
					{hasSubs:false,subs:[
						{label:'分润',prop:'money',width:'200',type:'number',editable:false,searchable:true,align:'center',
							format:function(row){
								return common.balanceformat(row.money,5)
							}
						},
					]},
				],
				searchtitle:'余位调用支出查询',
				editFormRules: {},
			}
		},
		mounted() {
			window.onresize=()=>{this.tableheight=common.gwh()-185;}
			this.tableheight=common.gwh()-185;
		},
		activated(){
			window.onresize=()=>{this.tableheight=common.gwh()-185;}
			this.tableheight=common.gwh()-185
			this.$refs['querytradeout'].$refs['search'].resetSearch()
			this.$refs['querytradeout'].getTableData({})
		}
	}

</script>

<style scoped>

</style>

