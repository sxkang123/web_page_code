<template>
	<section>
		<common-table 
			:queryapi="queryapi" 
			:queryparams="queryparams"
			:exportapi="exportapi"
			:tableheight="tableheight"
			:fieldsstr="fieldsstr"
			:tableitems="tableitems"
			:editFormRules="editFormRules"
			:btswidth="btswidth"
			:searchtitle="searchtitle"
			:hide-options="hideOptions"
			:hide-export="hideExport"
			:hide-add="hideAdd"
			ref="ordertradeout"
		></common-table>
	</section>
</template>

<script>
	import { path,stateitems,listparams,paytypelist,paychannellist } from '../../../api/api';
	import util from '../../../common/js/util'
	import common from '../../../common/js/common'
	import CommonTable from '../../../components/CommonTable'
	import axios from 'axios'

	export default {
		components:{
			CommonTable,
		},
		data(){
			return {
				loading: false,
				hideOptions:true,
				hideExport:true,
				hideAdd:true,
				tableheight:'',
				slist:[],
				plist:[],
				ulist:[],
				allslist:[],
				queryapi:'/trade/order',
				queryparams:{'direction':'out'},
				exportapi:'/trade/export',
				btswidth:'70',
				fieldsstr:'id__order_id__server_id__com_id__plate_number__start_time__end_time__duration__total__union_id__car_union_service__pay_type__pay_channel',
				tableitems:[
					{hasSubs:false,subs:[
						{label:'编号',prop:'id',width:'120',type:'number',editable:false,searchable:true,hide:true,align:'center',},
					]},
					{hasSubs:false,subs:[
						{label:'订单编号',prop:'order_id',width:'350',type:'str',editable:false,searchable:true,align:'center',},
					]},
                    {hasSubs:false,subs:[
                        {label:'交易流水号',prop:'trade_no',width:'350',type:'str',editable:false,searchable:true,align:'center',},
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
						{label:'服务商',prop:'server_id',width:'120',type:'selection',selectlist:this.slist,editable:false,searchable:false,unsortable:true,
							customSelect:'parkserver',searchSelect:'all',
							format:(row)=>{return common.nameformat(row,this.slist,'server_id')}
						},
					]},
					{hasSubs:false,subs:[
						{label:'车场',prop:'com_id',width:'200',type:'selection',selectlist:this.plist,editable:false,searchable:false,unsortable:true,
							format:(row)=>{return common.nameformat(row,this.plist,'com_id')}
						},
					]},
					{hasSubs:false,subs:[
						{label:'车牌',prop:'plate_number',width:'300',type:'str',editable:false,searchable:true,unsortable:true,},
					]},
					{hasSubs:false,subs:[
						{label:'进场时间',prop:'start_time',width:'175',type:'date',editable:false,searchable:true,align:'center',
							format:function(row){
									return common.dateformat(row.start_time);
								}
						},
					]},
					{hasSubs:false,subs:[
						{label:'出场时间',prop:'end_time',width:'175',type:'date',editable:false,searchable:true,align:'center',
							format:function(row){
								return common.dateformat(row.end_time);
							}
						},
					]},
                    {hasSubs:false,subs:[
                        {label:'支付时间',prop:'_time',width:'175',type:'date',editable:false,searchable:true,align:'center',
                            format:function(row){
                                return common.dateformat(row.pay_time);
                            }
                        },
                    ]},
					{hasSubs:false,subs:[
						{label:'停车时长',prop:'duartion',width:'160',type:'number',editable:false,searchable:false,unsortable:true,align:'center',},
					]},
					{hasSubs:false,subs:[
						{label:'订单金额',prop:'total',width:'120',type:'number',editable:false,searchable:true,align:'center',
							format:function(row){
								return common.balanceformat(row.total,2)
							}
						},
					]},
					{hasSubs:false,subs:[
						{label:'收款厂商',prop:'union_id',width:'120',type:'selection',selectlist:this.ulist,editable:false,searchable:false,unsortable:true,
							format:(row)=>{return common.nameformat(row,this.ulist,'union_id')}
						},
					]},
					{hasSubs:false,subs:[
						{label:'分润',prop:'car_union_service',width:'120',type:'number',editable:false,searchable:true,align:'center',
							format:function(row){
								return common.balanceformat(row.car_union_service,5)
							}
						},
					]},
                    {hasSubs:false,subs:[
                        {label:'说明',prop:'title',width:'160',type:'str',editable:false,searchable:false,unsortable:true,align:'center',},
                    ]}
				],
				searchtitle:'交易订单支出查询',
				editFormRules: {},
			}
		},
		methods:{
		},
		mounted() {
			window.onresize=()=>{this.tableheight=common.gwh()-185;}
			this.tableheight=common.gwh()-185;
			//预加载子组件
		},
		watch:{
			slist:function(val,oldVal){
				this.tableitems[5].subs[0].selectlist=val
			},
			plist:function(val,oldVal){
				this.tableitems[6].subs[0].selectlist=val
			},
			ulist:function(val,oldVal){
				this.tableitems[13].subs[0].selectlist=val
			}
		},
		activated(){
			window.onresize=()=>{this.tableheight=common.gwh()-185;}
			this.tableheight=common.gwh()-185
			this.$refs['ordertradeout'].$refs['search'].resetSearch()
			this.$refs['ordertradeout'].getTableData({})
			var _this=this
			//请求列表
			//所有车场,所有服务商,所有厂商
			axios.all([common.getUnionList(),common.getServerList(),common.getParkLists()])
			.then(axios.spread(function(union,server,park){
				_this.ulist=union.data
				_this.slist=server.data
				_this.plist=park.data
			}))
		}
	}

</script>

<style scoped>

</style>

