<template>
	<section>
		<common-table 
			:queryapi="queryapi" 
			:tableheight="tableheight"
			:fieldsstr="fieldsstr"
			:tableitems="tableitems"
			:btswidth="btswidth"
			:hide-export="hideExport"
			:hide-options="hideOptions"
			:showdateSelector="showdateSelector"
			:hideTool="hideTool"
			:showParkInfo="showParkInfo"
			:hideSearch="hideSearch"
			:customSearch="customSearch"
			:hidePagination="hidePagination"
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
	import axios from 'axios'

	export default {
		components:{
			CommonTable
		},
		data(){
			return {
                loading: false,
                plist:[],
                hideExport:true,
                hideSearch:true,
                customSearch:true,
                showdateSelector:false,
                hideAdd:true,
                tableheight:'',
                showdelete:true,
                hideOptions:true,
                showParkInfo:false,
                hidePagination:true,
                hideTool:false,
				queryapi:'/trade/opeartorparkmoneydayrecord',
				btswidth:'100',
				fieldsstr:'ctime__park_id',
				tableitems:[

					{label:'日期',hasSubs:false,subs:[{label:'日期',prop:'ctime',width:'123',type:'date',editable:true,searchable:true,addable:true,unsortable:true,align:'center'}]},
					{hasSubs:false,subs:[
                        {label:'车场',prop:'park_id',width:'123',type:'selection',selectlist:this.plist,editable:false,searchable:true,unsortable:true,
                            customSelect:'park',searchSelect:'local_all',
                            format:(row)=>{return common.nameformat(row,this.plist,'com_id')}
                        },
                    ]},
					{label:'收入',hasSubs:true,subs:[
						{label:'停车费电子收入',prop:'total',width:'162',type:'number',searchable:false,unsortable:true,align:'center',
							format:function(row){
						        if(row.total>0)
									return common.balanceformat(row.total,percision)
								else{
                                    return common.balanceformat(null,percision)
								}
							}
						},
						{label:'月卡续费收入',prop:'month',width:'162',type:'number',searchable:false,unsortable:true,align:'center',
							format:function(row){
						    	if(row.month>0)
									return common.balanceformat(row.month,percision)
								else
                                    return common.balanceformat(null,percision)

							}
						},
						{label:'通用支付收入',prop:'unifed_order',width:'162',type:'number',searchable:false,unsortable:true,align:'center',
							format:function(row){
						    	if(row.unifed_order>0)
									return common.balanceformat(row.unifed_order,percision)
								else
                                    return common.balanceformat(null,percision)
							}
						}
					]},
					{label:'支出',hasSubs:true,subs:[
						{label:'找零支出',prop:'mobile',width:'162',type:'number',searchable:false,unsortable:true,align:'center',
							format:function(row) {
                                if (row.mobile > 0 || row.redpacket > 0) {
                                    return common.balanceformat(row.mobile + row.redpacket, percision)
                                } else {
                                    return common.balanceformat(null, percision)
                                }
                            }
						},
						{label:'手续费支出',prop:'fee',width:'162',type:'number',searchable:false,unsortable:true,align:'center',
							format:function(row){
						    	if(row.fee>0)
									return common.balanceformat(row.fee,2)
								else
                                    return common.balanceformat(null,5)
							}
						}
					]},
					{label:'3',hasSubs:false,subs:[
						{label:'划账金额',prop:'deposit',width:'162',type:'number',searchable:false,unsortable:true,align:'center',
							format:function(row){
						    	if(row.deposit>0)
									return common.balanceformat(row.deposit,2)
								else
                                    return common.balanceformat(null,2)
							}
						}
					]},
				]
			}
		},

		mounted() {
			window.onresize=()=>{this.tableheight=common.gwh()-143;}
			this.tableheight=common.gwh()-143;
		},
		watch:{
            plist:function(val,oldVal){
                this.tableitems[1].subs[0].selectlist=val
            },
        },
		activated(){
			console.log('active')
			window.onresize=()=>{this.tableheight=common.gwh()-143;}
			this.tableheight=common.gwh()-143;
            this.$refs['bolinkuniontable'].$refs['search'].resetSearch()
            this.$refs['bolinkuniontable'].getTableData({})
            var _this=this
            var user = sessionStorage.getItem('user')
            user = JSON.parse(user)
            //本平台车场,所有厂商平台
            axios.all([common.getParkList()])
            .then(axios.spread(function(park){
                _this.plist=park.data
            }))
		}
	}
</script>

<style>
	.gutter{
		display:none
	}
</style>