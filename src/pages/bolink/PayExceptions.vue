<template>
	<section>
		<common-table 
			:queryapi="queryapi" 
			:editapi="editapi"
			:setpayexcpapi="setpayexcpapi"
			:exportapi="exportapi"
			:tableheight="tableheight"
			:fieldsstr="fieldsstr"
			:tableitems="tableitems"
			:editFormRules="editFormRules"
			:btswidth="btswidth"
			:searchtitle="searchtitle"
			:hideAdd="hideAdd"
			:hideExport="hideExport"
			:hideSearch="hideSearch"
			:hideEdit="hideEdit"
			:showsetpayexcep="showsetpayexcep"
			ref="payexcptions"
		></common-table>
	</section>
</template>

<script>
	import { path,percision,excptions } from '../../api/api';
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
                hideSearch:false,
                hideOptions:true,
                hideExport:true,
				hideEdit:true,
                showsetpayexcep:true,
				queryapi:'/payexcep/query',
                setpayexcpapi:'/payexcep/edit',
				exportapi:'/payexcep/export',
				btswidth:'70',
				fieldsstr:'id__ctime__car_number__state__money',
				tableitems:[
                    {hasSubs:false,subs:[
                        {label:'编号',prop:'id',width:'120',type:'number',editable:false,searchable:false,align:'center',},
                    ]},
					{hasSubs:false,subs:[
						{label:'日期',prop:'ctime',width:'200',type:'number',editable:false,searchable:false,align:'center',
                            format:function(row){
                                return common.dateformat(row.ctime);
                            }},
					]},
					{hasSubs:false,subs:[
						{label:'车牌',prop:'car_number',width:'140',type:'str',editable:false,searchable:false,unsortable:true},
					]},
                    {hasSubs:false,subs:[
                        {label:'交易编号',prop:'trade_no',width:'240',type:'str',selectlist:this.ulist,editable:true,searchable:false,unsortable:true},
                    ]},
					{hasSubs:false,subs:[
						{label:'状态',prop:'state',width:'90',type:'selection',selectlist:excptions,editable:true,searchable:true,align:'center',
							format:function(row){
								return common.nameformat(row,excptions,'state')
							}
						},
					]},
					{hasSubs:false,subs:[
						{label:'金额',prop:'money',width:'150',type:'number',editable:false,searchable:false,align:'center',
							format:function(row){
								return common.balanceformat(row.money,percision)
							}
						},
					]},

				],
				searchtitle:'选择类型',
				editFormRules: {
                    state: [
						{ required: true, message: '请选', trigger: 'change' }
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
			this.$refs['payexcptions'].$refs['search'].resetSearch()
			this.$refs['payexcptions'].getTableData({})
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

