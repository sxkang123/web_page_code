c<template>
	<section>
		<common-table 
			:queryapi="queryapi"
			:exportapi="exportapi"
			:tableheight="tableheight"
			:fieldsstr="fieldsstr"
			:tableitems="tableitems"
			:btswidth="btswidth"
			:hide-export="hideExport"
			:hide-options="hideOptions"
			:searchtitle="searchtitle"
			:showdateSelector="showdateSelector"
			:hideTool="hideTool"
			:showParkInfo="showParkInfo"
			:hideSearch="hideSearch"
			:hideAdd="hideAdd"
			ref="bolinkuniontable"
		></common-table>
	</section>
</template>


<script>
	import { path,checkURL,checkUpload,checkNumber,percision } from '../../api/api';
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
                hideExport:false,
                hideSearch:true,
                showdateSelector:true,
                hideAdd:true,
                tableheight:'',
                showdelete:true,
                hideOptions:true,
                showParkInfo:true,
                hideTool:false,
				queryapi:'/trade/parkmoneydayrecord',
                exportapi:'/trade/parkexport',
				btswidth:'100',
				fieldsstr:'time__money',
                searchDate:'',
				tableitems:[
					{label:'日期',hasSubs:false,subs:[{label:'日期',prop:'time',width:'123',type:'str',editable:true,searchable:true,addable:true,unsortable:true,align:'center'}]},
					
					{label:'收入',hasSubs:true,subs:[
						{label:'停车费电子收入',prop:'total',width:'162',type:'number',searchable:true,unsortable:true,align:'center',
							format:function(row){
								return common.balanceformat(row.total,percision)
							}
						},
						{label:'月卡续费收入',prop:'month',width:'162',type:'number',searchable:true,unsortable:true,align:'center',
							format:function(row){
								return common.balanceformat(row.month,percision)
							}
						},
						{label:'通用支付收入',prop:'unifed_order',width:'162',type:'number',searchable:true,unsortable:true,align:'center',
							format:function(row){
								return common.balanceformat(row.unifed_order,percision)
							}
						}
					]},
					{label:'支出',hasSubs:true,subs:[
						{label:'找零支出',prop:'mobile',width:'162',type:'number',searchable:true,unsortable:true,align:'center',
							format:function(row){
								return common.balanceformat(row.mobile + row.redpacket,percision)
							}
						},
						{label:'手续费支出',prop:'fee',width:'162',type:'number',searchable:true,unsortable:true,align:'center',
							format:function(row){
								return common.balanceformat(row.fee,2)
							}
						},
						{label:'退款支出',prop:'back',width:'162',type:'number',searchable:true,unsortable:true,align:'center',
							format:function(row){
								return common.balanceformat(row.back,2)
							}
						}
					]},
					{label:'3',hasSubs:false,subs:[
						{label:'划账金额',prop:'deposit',width:'162',type:'number',searchable:true,unsortable:true,align:'center',
							format:function(row){
								return common.balanceformat(row.deposit,2)
							}
						}
					]},
				],
				searchtitle:'查询明细',
				//addtitle:'注册友商',
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
			window.onresize=()=>{this.tableheight=common.gwh()-143;}
			this.tableheight=common.gwh()-143;
		},
		activated(){
			console.log('active')
			window.onresize=()=>{this.tableheight=common.gwh()-143;}
			this.tableheight=common.gwh()-143;
			//alert("1>>>>>>"+this.searchDate);
			var dates =this.searchDate;
            if(dates==undefined ||dates==''){
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 10);
                const bday = start.getFullYear()+"-"+(start.getMonth()+1)+"-"+start.getDate();
                const eday = end.getFullYear()+"-"+(end.getMonth()+1)+"-"+end.getDate();
                dates =bday+" 00:00:00至"+eday+" 23:59:59";
                this.searchDate=dates;
                console.log( this.searchDate)
                //alert("2>>>>>>"+dates)
            }
           // alert("3>>>>>>"+dates)
            this.$refs['bolinkuniontable'].$refs['search'].resetSearch()
           // this.$refs['bolinkuniontable'].getTableData({'date':dates})
            this.$refs['bolinkuniontable'].changeanalysisdate(dates);
		}
	}

</script>

<style>
	.gutter{
		display:none
	}
</style>