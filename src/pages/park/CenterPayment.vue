<template>
	<section>
		<common-table 
			:queryapi="queryapi"
			:addapi="addapi" 
			:editapi="editapi"
			:delapi="delapi"
			:tableheight="tableheight"
			:fieldsstr="fieldsstr"
			:tableitems="tableitems"
			:btswidth="btswidth"
			:hide-export="hideExport"
			:searchtitle="searchtitle"
			:addtitle="addtitle"
			:addFormRules="addFormRules"
			:editFormRules="editFormRules"
			:showdelete="showdelete"
			:showresetpwd="showresetpwd"
			ref="bolinkuniontable"
		></common-table>
	</section>
</template>


<script>
	import { path,checkURL,checkUpload,checkNumber,percision,parktypelist,distinctslist,checkCityInfo,provincelist,checkPass,centerpayset } from '../../api/api';
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
				showresetpwd:true,
				hideExport:true,
				tableheight:'',
				showdelete:true,
				queryapi:'/centralpaymentweb/queryinfo',
				addapi:'/centralpaymentweb/add',
				editapi:'/centralpaymentweb/edit',
				delapi:'/centralpaymentweb/remove',
				parkid:'',
				btswidth:'180',
				fieldsstr:'id__name__address__model__mac_address__last_login_time__create_time__update_time__balance__province_abbr',
				tableitems:[
					{hasSubs:false,subs:[
						{label:'登录账号',prop:'id',width:'100',type:'number',searchable:true,unsortable:true,align:'center',},
					]},
					{hasSubs:false,subs:[
						{label:'名称',prop:'name',width:'180',type:'str',editable:true,searchable:true,addable:true,unsortable:true,align:'center'},
					]},
					{hasSubs:false,subs:[
						{label:'省·市·县/区',prop:'distincts',width:'200',type:'cityinfo',editable:false,searchable:false,addable:true,unsortable:true,align:'center',
							format:function(row){
								return row.cityinfo
							}
						},
					]},
					{hasSubs:false,subs:[
						{label:'地址',prop:'address',width:'308',type:'str',editable:true,searchable:true,addable:true,unsortable:true,align:'center'},
					]},
					{hasSubs:false,subs:[
						{label:'登录密码',prop:'password',width:'100',type:'str',hidden:true,editable:false,searchable:false,addable:true,unsortable:true,align:'center'},
					]},
                    {hasSubs:false,subs:[
                        {label:'无牌车',prop:'nolicence',width:'100',type:'selection',selectlist:centerpayset,editable:true,searchable:false,addable:true,
							unsortable:true,align:'center'
							,format:function(row){
                           		 return common.nameformat(row,centerpayset,'nolicence')
                       		 }
                        },

					]},
                    {hasSubs:false,subs:[
                        {label:'电子支付',prop:'elepay',width:'100',type:'selection',selectlist:centerpayset,editable:true,searchable:false,addable:true,
							unsortable:true,align:'center'
                            ,format:function(row){
                           		 return common.nameformat(row,centerpayset,'elepay')
                       		 }
                        },
                    ]},
					// {hasSubs:false,subs:[
					// 	{label:'型号',prop:'model',width:'200',type:'str',editable:true,searchable:true,addable:true,unsortable:true,align:'center'},
					// ]},
					{hasSubs:false,subs:[
						{label:'mac地址',prop:'mac_address',width:'150',type:'str',editable:true,searchable:true,addable:false,unsortable:true,align:'center'},
					]},
					{hasSubs:false,subs:[
						{label:'默认省份',prop:'province_abbr',width:'150',type:'selection',selectlist:provincelist,editable:true,searchable:true,addable:true,unsortable:true,align:'center'},
					]},
					{hasSubs:false,subs:[
						{label:'最后登录时间',prop:'last_login_time',width:'175',type:'date',searchable:false,align:'center',
							format:function(row){
									return common.dateformat(row.last_login_time);
							}
						},
					]},
					{hasSubs:false,subs:[
						{label:'创建时间',prop:'create_time',width:'175',type:'date',searchable:true,align:'center',
							format:function(row){
									return common.dateformat(row.create_time);
							}
						},
					]},
					{hasSubs:false,subs:[
						{label:'更新时间',prop:'update_time',width:'175',type:'date',searchable:true,align:'center',
							format:function(row){
									return common.dateformat(row.update_time);
							}
						},
					]},
					{hasSubs:false,subs:[
						{label:'钱箱余额',prop:'balance',width:'120',type:'number',searchable:true,align:'center',
							format:function(row){
								return common.balanceformat(row.balance,0)
							}
						},
					]},
				],
				searchtitle:'查询缴费机',
				addtitle:'添加缴费机',
				addFormRules: {
					name: [
						{ required: true, message: '请输入名称', trigger: 'blur' }
					],
					distincts: [
						{ required: true, validator:checkCityInfo,  trigger: 'change' }
					],
					address: [
						{ required: true, message: '请输入缴费机安置详细地址', trigger: 'blur' }
					],
					// model: [
					// 	{ required: true, message: '请输入缴费机型号', trigger: 'blur' }
					// ],
					password: [
						{ required: true, validator:checkPass,trigger: 'blur' }
					],
					province_abbr: [
						{ required: true, message: '请输入默认省份缩写', trigger: 'change' }
					],
				},
				editFormRules: {
					name: [
						{ required: true, message: '请输入名称', trigger: 'blur' }
					],
					address: [
						{ required: true, message: '请输入缴费机安置详细地址', trigger: 'blur' }
					],
					// model: [
					// 	{ required: true, message: '请输入缴费机型号', trigger: 'blur' }
					// ],
					province_abbr: [
						{ required: true, message: '请输入默认省份缩写', trigger: 'change' }
					],
				},
			}
		},
		mounted() {
			window.onresize=()=>{this.tableheight=common.gwh()-135;}
			this.tableheight=common.gwh()-135;
		},
		activated(){
			console.log('active')
			console.log(distinctslist)
			window.onresize=()=>{this.tableheight=common.gwh()-135;}
			this.tableheight=common.gwh()-135;
			this.$refs['bolinkuniontable'].$refs['search'].resetSearch()
			this.$refs['bolinkuniontable'].getTableData({})
			//所有厂商,所有服务商
			this.axios.all([common.getServerList(),common.getUnionList(),common.getBankInfo(),common.getBaPayUnionList()])
		}
	}

</script>