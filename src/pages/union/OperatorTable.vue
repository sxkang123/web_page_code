<template>
	<section>
		<common-table 
			:queryapi="queryapi" 
			:editapi="editapi" 
			:exportapi="exportapi"
			:addapi="addapi"
			:tableheight="tableheight"
			:fieldsstr="fieldsstr"
			:tableitems="tableitems"
			:editFormRules="editFormRules"
			:btswidth="btswidth"
			:searchtitle="searchtitle"
			:addtitle="addtitle"
			ref='operatortable'
		></common-table>
	</section>
</template>

<script>
	import { path,stateitems,checkPhone,phonewidth,percision,ynitems } from '../../api/api';
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
				queryapi:'/operator/query',
				editapi:'/operator/edit',
				exportapi:'/operator/export',
				addapi:'/operator/add',
				btswidth:'70',
				fieldsstr:'id__name__phone__area__ctime__utime__state__balance__tid__isdistibution',
				tableitems:[
					{hasSubs:false,subs:[
						{label:'编号',prop:'id',width:'170',type:'number',editable:false,searchable:true,align:'center',},
					]},
					{hasSubs:false,subs:[
						{label:'名称',prop:'name',width:'260',type:'str',editable:true,searchable:true,unsortable:true,addable:true,},
					]},
					{hasSubs:false,subs:[
						{label:'地址',prop:'area',width:'300',type:'str',editable:true,searchable:true,unsortable:true,addable:true,},
					]},
					{hasSubs:false,subs:[
						{label:'联系电话',prop:'phone',width:phonewidth,type:'str',editable:true,searchable:true,unsortable:true,addable:true,align:'center',},
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
						{label:'状态',prop:'state',width:'90',type:'selection',selectlist:stateitems,editable:true,searchable:true,addable:true,align:'center',
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
					{hasSubs:false,subs:[
						{label:'管理员账号',prop:'tid',width:'120',type:'number',editable:false,searchable:true,unsortable:true,align:'center',},
					]},
					/*{hasSubs:false,subs:[
                        {label:'支持清分',prop:'isdistibution',width:'120',type:'selection',selectlist:ynitems,editable:true,searchable:true,addable:true,unsortable:true,align:'center',
                            format:function(row){
                                return common.ynformat(row.isdistibution)
                            }
                        },
                    ]},*/
				],
				searchtitle:'查询运营商',
				addtitle:'注册运营商',
				editFormRules: {
					name: [
						{ required: true, message: '请输入运营商名称', trigger: 'blur' }
					],
					phone: [
						{ validator: checkPhone, required: true, trigger: 'blur' }
					],
					area: [
						{ required: true, message: '请输入地址', trigger: 'blur' }
					],
					state: [
						{ required: true, message: '请选择状态', trigger: 'change' }
					],
					isdistibution: [
                        { required: true, message: '请选择清分规则', trigger: 'change' }
                    ],
				},
			}
		},
		mounted() {
			window.onresize=()=>{this.tableheight=common.gwh()-135;}
			this.tableheight=common.gwh()-135;
			console.log('mount operatortable')
		},
		activated(){
			window.onresize=()=>{this.tableheight=common.gwh()-135;}
			this.tableheight=common.gwh()-135;
			this.$refs['operatortable'].$refs['search'].resetSearch()
			this.$refs['operatortable'].getTableData({})
		}
	}

</script>