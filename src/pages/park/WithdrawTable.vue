<template>
	<section>
		<common-table 
			:queryapi="queryapi" 
			:tableheight="tableheight"
			:fieldsstr="fieldsstr"
			:tableitems="tableitems"
			:btswidth="btswidth"
			:exportapi="exportapi"
			:hide-export="hideExport"
			:hide-options="hideOptions"
			:searchtitle="searchtitle"
			:hideAdd="hideAdd"
			ref="bolinkuniontable"
		></common-table>
	</section>
</template>


<script>
	import { path,checkURL,checkUpload,checkNumber,percision,parktypelist,paytypelist,paychannellist } from '../../api/api';
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
				hideAdd:true,
				tableheight:'',
				showdelete:true,
				hideOptions:true,
				queryapi:'/trade/moneyrecord',
                exportapi:'/trade/parkacountexport',
				btswidth:'100',
				fieldsstr:'id__order_id__plate_number__trade_no__back_trade_no__pay_type__pay_channel__otype__ctime__money__remark',
				tableitems:[
					{hasSubs:false,subs:[
						{label:'编号',prop:'id',width:'100',type:'number',searchable:true,unsortable:true,align:'center'}
					]},
                    {hasSubs:false,subs:[
                        {label:'订单编号',prop:'order_id',width:'180',type:'str',editable:true,searchable:true,addable:false,unsortable:true,align:'center'},
                    ]},
                    {hasSubs:false,subs:[
                        {label:'车牌号',prop:'plate_number',width:'120',type:'str',editable:true,searchable:true,addable:false,unsortable:true,align:'center'},
                    ]},
					{hasSubs:false,subs:[
						{label:'交易流水号',prop:'trade_no',width:'300',type:'str',editable:true,searchable:true,addable:true,unsortable:true,align:'center',
							format:function(row){
								if(row.trade_no==null||row.trade_no==''){
									return '-'
								}else{
									return row.trade_no
								}
							}
						},
					]},
					{hasSubs:false,subs:[
                        {label:'退款流水号',prop:'back_trade_no',width:'450',type:'str',editable:true,searchable:true,addable:true,unsortable:true,align:'center',
							format:function(row){
								if(row.back_trade_no==null||row.back_trade_no==''){
									return '-'
								}else{
									return row.back_trade_no
								}
							}
						},
                    ]},
                    {hasSubs:false,subs:[
                        {label:'支付方式',prop:'pay_type',width:'100',type:'selection',selectlist:paytypelist,unsortable:true,editable:false,searchable:true,
                            format:(row)=>{
                                if(row.pay_type=="-1"){
                                    return '-'
                                }else{
                                    return common.nameformat(row,paytypelist,'pay_type')
                                }
                            }
                        },
                    ]},
                    {hasSubs:false,subs:[
                        {label:'支付通道',prop:'pay_channel',width:'100',type:'selection',selectlist:paychannellist,unsortable:true,editable:false,searchable:true,
                            format:(row)=>{
                                if(row.pay_channel=="-1"){
                                    return '-'
                                }else{
                                    return common.nameformat(row,paychannellist,'pay_channel')
                                }
                            }
                        },
                    ]},
					{hasSubs:false,subs:[
						{label:'账务类型',prop:'otype',width:'200',type:'selection',selectlist:parktypelist,searchable:true,unsortable:true,align:'center',
							format:function(row){
								return common.nameformat(row,parktypelist,'otype')
							}
						},
					]},
					{hasSubs:false,subs:[
						{label:'交易时间',prop:'ctime',width:'175',type:'date',searchable:true,align:'center',
							format:function(row){
									return common.dateformat(row.ctime);
								}
						},
					]},
					{hasSubs:false,subs:[
						{label:'金额',prop:'money',width:'179',type:'number',searchable:true,align:'center',
							format:function(row){
								return common.balanceformat(row.money,percision)
							}
						},
					]},
                    {hasSubs:false,subs:[
                        {label:'说明',prop:'remark',width:'308',type:'str',editable:true,searchable:true,addable:true,unsortable:true,align:'center'},
                    ]},
					
				],
				searchtitle:'查询明细',
			}
		},
		mounted() {
			window.onresize=()=>{this.tableheight=common.gwh()-135;}
			this.tableheight=common.gwh()-135;
		},
		activated(){
			console.log('active')
			window.onresize=()=>{this.tableheight=common.gwh()-135;}
			this.tableheight=common.gwh()-135;
            const end = new Date();
            const start = new Date();
            start.setHours(0);
            start.setMinutes(0);
            start.setSeconds(0);
            end.setHours(23);
            end.setMinutes(59);
            end.setSeconds(59);
            const dates = start.toDateString() +"至"+end.toDateString();
			this.$refs['bolinkuniontable'].$refs['search'].resetSearch()
			this.$refs['bolinkuniontable'].getTableData({'date':dates})
		}
	}

</script>