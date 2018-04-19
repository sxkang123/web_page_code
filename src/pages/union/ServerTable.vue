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
			ref='servertable'
		></common-table>
	</section>
</template>

<script>
	import { path,stateitems,checkPhone,phonewidth,percision } from '../../api/api';
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
				slist:'',
				queryapi:'/server/query',
				editapi:'/server/edit',
				exportapi:'/server/export',
				addapi:'/server/add',
				btswidth:'70',
				fieldsstr:'id__name__phone__area__ctime__utime__state__balance',
				tableitems:[
					{hasSubs:false,subs:[
						{label:'编号',prop:'id',width:'120',type:'number',editable:false,searchable:true,align:'center',},
					]},
					{hasSubs:false,subs:[
						{label:'名称',prop:'name',width:'260',type:'str',editable:true,searchable:true,unsortable:true,addable:true,},
					]},
                    {hasSubs:false,subs:[
                        {label:'上级服务商',prop:'pid',width:'120',type:'selection',hidden:true,selectlist:this.slist,editable:true,searchable:false,addable:true,unsortable:true,
                            format:(row)=>{return common.nameformat(row,this.slist,'pid')}
                        },
                    ]},
                    {hasSubs:false,subs:[
                        {label:'分润比例%',prop:'percent',width:'140',type:'str',editable:true,searchable:true,unsortable:true,addable:true,},
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
				],
				searchtitle:'查询服务商',
				addtitle:'注册服务商',
				editFormRules: {
					name: [
						{ required: true, message: '请输入服务商名称', trigger: 'blur' }
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
				},
			}
		},
		mounted() {
            console.log('wwwww>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
			window.onresize=()=>{this.tableheight=common.gwh()-135;}
			this.tableheight=common.gwh()-135;
			console.log('mount servertable')

		},
		activated(){
			window.onresize=()=>{this.tableheight=common.gwh()-135;}
			this.tableheight=common.gwh()-135;
			this.$refs['servertable'].$refs['search'].resetSearch()
			this.$refs['servertable'].getTableData({})
            let _this = this
            this.axios.all([common.getServerList()])
                .then(this.axios.spread(function(sevlist){
                    _this.slist = sevlist.data
                }))
		},
        watch:{
            slist:function(val){
                console.log('set sverlist')
                this.tableitems[2].subs[0].selectlist=val
            },
        }
	}

</script>