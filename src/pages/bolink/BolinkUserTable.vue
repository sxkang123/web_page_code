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
			ref="bolinkusertable"
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
				ulist:[],
				loading: false,
				hideAdd:true,
				tableheight:'',
				queryapi:'/unionuser/query',
				editapi:'/unionuser/edit',
				exportapi:'/unionuser/export',
				btswidth:'70',
				fieldsstr:'id__union_id__user_id__plate_number__ctime__utime__state__balance',
				tableitems:[
					{hasSubs:false,subs:[
						{label:'泊链编号',prop:'id',width:'120',type:'number',editable:false,searchable:true,align:'center',},
					]},
					{hasSubs:false,subs:[
						{label:'所属平台',prop:'union_id',width:'240',type:'selection',selectlist:this.ulist,editable:false,searchable:true,unsortable:true,
							format:(row)=>{return common.nameformat(row,this.ulist,'union_id')}
						},
					]},
					{hasSubs:false,subs:[
						{label:'会员编号',prop:'user_id',width:'200',type:'str',editable:false,searchable:true,unsortable:true,align:'center',},
					]},
					{hasSubs:false,subs:[
						{label:'车牌',prop:'plate_number',width:'250',type:'str',editable:false,unsortable:true,searchable:true},
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
			this.$refs['bolinkusertable'].$refs['search'].resetSearch()
			this.$refs['bolinkusertable'].getTableData({})
			let _this = this
			//所有厂商,所有服务商
			this.axios.all([common.getUnionList()])
			.then(this.axios.spread(function(union){
				_this.ulist=union.data
			}))
		},
		watch:{
			ulist:function(val){
				this.tableitems[1].subs[0].selectlist=val
			}
		}
	}

</script>

<style scoped>

</style>

