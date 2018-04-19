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
			:searchtitle="searchtitle"
			:hideAdd="hideAdd"
			ref="usertable"
		></common-table>
	</section>
</template>

<script>
	import { path,stateitems,percision } from '../../api/api';
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
				tableheight:'',
				queryapi:'/unionuser/query',
				editapi:'/unionuser/edit',
				exportapi:'/unionuser/export',
				btswidth:'70',
				fieldsstr:'id__user_id__plate_number__ctime__utime__state__balance',
				tableitems:[
					{hasSubs:false,subs:[
						{label:'编号',prop:'id',width:'120',type:'number',editable:false,searchable:true,align:'center',},
					]},
					{hasSubs:false,subs:[
						{label:'会员编号',prop:'user_id',width:'350',type:'str',editable:false,searchable:true,unsortable:true,align:'center',},
					]},
					{hasSubs:false,subs:[
						{label:'车牌',prop:'plate_number',width:'320',type:'str',editable:false,searchable:true,unsortable:true},
					]},
					{hasSubs:false,subs:[
						{label:'新建日期',prop:'ctime',width:'175',type:'date',editable:false,searchable:true,align:'center',
							format:function(row){
									if(!row.utime=="")
									return common.dateformat(row.ctime);
								}
						},
					]},
					{hasSubs:false,subs:[
						{label:'修改日期',prop:'utime',width:'175',type:'date',editable:false,searchable:true,align:'center',
							format:function(row){
								if(!row.ctime=="")
								return common.dateformat(row.utime);
							}
						},
					]},
					{hasSubs:false,subs:[
						{label:'状态',prop:'state',width:'90',type:'selection',selectlist:stateitems,editable:true,searchable:true,align:'center',
							format:function(row){
								return common.stateformat(row.state)
							}
						},
					]},
					{hasSubs:false,subs:[
						{label:'余额',prop:'balance',width:'150',type:'number',editable:false,searchable:true,align:'center',
							format:function(row){
								return common.balanceformat(row.balance,percision)
							}
						},
					]},
				],
				searchtitle:'查询会员',
				editFormRules: {
					state: [
						{ required: true, message: '请选择状态', trigger: 'change' }
					],
				},
			}
		},
		mounted() {
			window.onresize=()=>{this.tableheight=common.gwh()-135;}
			this.tableheight=common.gwh()-135;
		},
		activated(){
			window.onresize=()=>{this.tableheight=common.gwh()-135;}
			this.tableheight=common.gwh()-135;
			this.$refs['usertable'].$refs['search'].resetSearch()
			this.$refs['usertable'].getTableData({})
		}
	}

</script>

<style scoped>

</style>

