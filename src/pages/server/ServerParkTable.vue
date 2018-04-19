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
			ref="bolinkparktable"
		></common-table>
	
	</section>
</template>

<script>
	import { path,stateitems,checkPhone,phonewidth,percision} from '../../api/api';
	import util from '../../common/js/util'
	import common from '../../common/js/common'
	import CommonTable from '../../components/CommonTable'
	import AddForm from '../../components/AddForm'


	export default {
		components:{
			CommonTable,
			AddForm
		},
		data(){ 
			return {
				ulist:[],
				slist:[],
				paylist:[],
				index1:false,
				index2:true,
				loading: false,
				hideAdd:true,
				dialogVisible:false,
				settingContent:'',
				tableheight:'',
				queryapi:'/park/query',
				editapi:'/park/edit',
				exportapi:'/park/export',
				btswidth:'70',
				fieldsstr:'id__union_id__server_id__park_id__name__address__phone__mobile__ctime__utime__total_plot__empty_plot__state__balance',
				tableitems:[
					{hasSubs:false,subs:[
						{label:'编号',prop:'id',width:'120',type:'number',editable:false,searchable:true,align:'center',},
					]},
					{hasSubs:false,subs:[
						{label:'车场编号',prop:'park_id',width:'160',type:'str',editable:false,searchable:true,unsortable:true,align:'center',},
					]},
					{hasSubs:false,subs:[
						{label:'车场名称',prop:'name',width:'260',type:'str',editable:true,searchable:true,unsortable:true},
					]},
					{hasSubs:false,subs:[
						{label:'车位数',prop:'total_plot',width:'100',type:'number',searchable:true,align:'center',},
					]},
					{hasSubs:false,subs:[
						{label:'余位数',prop:'empty_plot',width:'100',type:'number',searchable:true,align:'center',},
					]},
					{hasSubs:false,subs:[
						{label:'车场地址',prop:'address',width:'300',type:'str',editable:true,searchable:true,unsortable:true},
					]},
					{hasSubs:false,subs:[
						{label:'联系电话',prop:'phone',width:phonewidth,type:'str',editable:true,searchable:true,unsortable:true,align:'center',},
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
						{label:'状态',prop:'state',width:'90',type:'selection',selectlist:stateitems,editable:false,searchable:true,align:'center',
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
				searchtitle:'查询车场',
				editFormRules: {
					name: [
						{ required: true, message: '请输入名称', trigger: 'blur' }
					],
					phone: [
						{ validator:checkPhone, required: true, trigger: 'blur' }
					],
					address: [
						{ required: true, message: '请输入地址', trigger: 'blur' }
					],
					total_plot: [
						{ required: true, message: '请输入车位数', trigger: 'blur' }
					],
					empty_plot: [
						{ required: true, message: '请输入空闲数', trigger: 'blur' }
					],
					server_id: [
						{ required: true, message: '请选择服务商', trigger: 'change' }
					],
					state: [
						{ required: true, message: '请选择状态', trigger: 'change' }
					],
				},
			}
		},
		beforeMount(){
			
		},
		mounted() {
			window.onresize=()=>{this.tableheight=common.gwh()-135}
			this.tableheight = common.gwh()-135;
			this.settingContent='float:left;width:'+(common.gww()*0.9-170)+'px'
		},
		methods:{

		},
		activated(){
			window.onresize=()=>{this.tableheight=common.gwh()-135}
			this.tableheight=common.gwh()-135;
			this.$refs['bolinkparktable'].$refs['search'].resetSearch()
			this.$refs['bolinkparktable'].getTableData({})
			var _this=this
			//请求列表
			//所有厂商,所有服务商
			this.axios.all([common.getServerList(),common.getUnionList(),common.getBankInfo(),common.getBaPayUnionList()])
			.then(this.axios.spread(function(server,union,bankinfo,paylist){
				_this.slist=server.data
				_this.ulist=union.data
				_this.banklist=bankinfo.data
				_this.paylist=paylist.data
			}))
		},
		watch:{
			slist:function(val){
				this.tableitems[2].subs[0].selectlist=val
			},
			ulist:function(val){
				this.tableitems[1].subs[0].selectlist=val
			},
			paylist:function(val){
				this.tableitems[14].subs[0].selectlist=val
			},
		}
	}

</script>

<style scoped>
	.setting{
		width:140px;
		height:300px;
		background:#EEF6F3;
		float:left;
		padding:0px;
		margin-left:-19px;
		margin-top:-12px;
	}
</style>
