<template>
	<section>
		<common-table 
			:queryapi="queryapi" 
			:editapi="editapi" 
			:addapi="addapi"
			:delapi="delapi"
			:tableheight="tableheight"
			:fieldsstr="fieldsstr"
			:tableitems="tableitems"
			:editFormRules="editFormRules"
			:addFormRules="addFormRules"
			:btswidth="btswidth"
			:showdelete="showdelete"
			:hide-export="hideExport"
			:searchtitle="searchtitle"
			:addtitle="addtitle"
			ref="bolinkuniontable"
		></common-table>
	</section>
</template>


<script>
	import { path,checkURL,checkUpload,checkNumber } from '../../api/api';
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
				hideExport:true,
				tableheight:'',
				showdelete:true,
                hideAdd:false,
				queryapi:'/business/query',
				editapi:'/business/edit',
				delapi:'/business/delete',
				addapi:'/business/add',
				btswidth:'100',
				fieldsstr:'id__name__description__url__logo_uri__weight__tmd5__ttype__tdir',
				tableitems:[
					{hasSubs:false,subs:[
						{label:'编号',prop:'id',width:'80',type:'number',searchable:true,unsortable:true,align:'center',},
					]},
					{hasSubs:false,subs:[
						{label:'友商名称',prop:'name',width:'150',type:'str',editable:true,searchable:true,addable:true,unsortable:true},
					]},
					{hasSubs:false,subs:[
						{label:'官网地址',prop:'url',width:"260",type:'str',editable:true,searchable:true,addable:true,unsortable:true},
					]},
					{hasSubs:false,subs:[
						{label:'logo',prop:'file_id',width:"300",type:'upload',editable:true,searchable:false,addable:true,unsortable:true,
							format:(row)=>{ return row.logo_uri }
						},
					]},
					{hasSubs:false,subs:[
						{label:'权重',prop:'weight',width:"100",type:'number',editable:true,searchable:true,addable:true,align:'center',},
					]},
					{hasSubs:false,subs:[
						{label:'描述',prop:'description',type:'multitext',width:"300",editable:true,searchable:true,addable:true,unsortable:true},
					]},
				],
				searchtitle:'查询友商',
				addtitle:'注册友商',
				addFormRules: {
					name: [
						{ required: true, message: '请输入名称', trigger: 'blur' }
					],
					url: [
						{ required: true, validator:checkURL, trigger: 'blur' }
					],
					file_id: [
						{ required: true, validator:checkUpload, trigger: 'change' }
					],
					weight: [
						{ required: true, validator: checkNumber, trigger: 'blur' }
					],
					description: [
						{ required: true, message: '请输入描述', trigger: 'blur' },
						{ min: 60, max: 80, message: '长度在 60 到 80 个字符', trigger: 'blur' }
					],
				},
				editFormRules: {
					name: [
						{ required: true, message: '请输入名称', trigger: 'blur' }
					],
					url: [
						{ required: true, validator:checkURL, trigger: 'blur' }
					],
					weight: [
						{ required: true, validator: checkNumber, trigger: 'blur' }
					],
					description: [
						{ required: true, message: '请输入描述', trigger: 'blur' },
						{ min: 60, max: 80, message: '长度在 60 到 80 个字符', trigger: 'blur' }
					],
				},
			}
		},
		mounted() {
			window.onresize=()=>{this.tableheight=common.gwh()-135;}
			this.tableheight=common.gwh()-135;
            var u = sessionStorage.getItem('user')
            var user = JSON.parse(u)
			if(user.roleid!=1){
                this.hideAdd=true;
			}
		},
		activated(){
			console.log('active')
			window.onresize=()=>{this.tableheight=common.gwh()-135;}
			this.tableheight=common.gwh()-135;
			this.$refs['bolinkuniontable'].$refs['search'].resetSearch()
			this.$refs['bolinkuniontable'].getTableData({})
		}
	}

</script>