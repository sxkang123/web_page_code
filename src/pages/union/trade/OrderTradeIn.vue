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
			ref="ordertradein"
		></common-table>
	</section>
</template>

<script>
	import { path,stateitems,listparams,paytypelist,paychannellist} from '../../../api/api';
	import common from '../../../common/js/common'
	import CommonTable from '../../../components/CommonTable'
	import axios from 'axios'

	export default {
		components:{
			CommonTable
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
				olist:[],
				allslist:[],
				queryapi:'/trade/order',
				queryparams:{'direction':'in'},
				exportapi:'/trade/export',
				btswidth:'70',
				fieldsstr:'id__order_id__server_id__com_id__plate_number__start_time__end_time__trade_no__duration__total__car_union_id__union_service__server_service__pay_time__title__pay_type__pay_channel',
				tableitems:[
					{hasSubs:false,index:0,subs:[
						{label:'编号',prop:'id',width:'120',type:'number',editable:false,searchable:true,hide:true,align:'center',},
					]},
					{hasSubs:false,index:1,subs:[
						{label:'订单编号',prop:'order_id',width:'350',type:'str',editable:false,searchable:true,align:'center',},
					]},
                    {hasSubs:false,index:2,subs:[
                        {label:'交易流水号',prop:'trade_no',width:'350',type:'str',editable:false,searchable:true,align:'center',},
                    ]},
                    {hasSubs:false,index:3,subs:[
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
                    {hasSubs:false,index:4,subs:[
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
					{hasSubs:false,index:5,subs:[
						{label:'服务商',prop:'server_id',width:'120',type:'selection',selectlist:this.slist,unsortable:true,editable:false,searchable:true,
							customSelect:'parkserver',searchSelect:'local_all',
							format:(row)=>{return common.nameformat(row,this.slist,'server_id')}
						},
					]},
					/*{hasSubs:false,subs:[
                        {label:'运营商',prop:'operator_id',width:'120',type:'selection',selectlist:this.olist,unsortable:true,editable:false,searchable:true,
                            customSelect:'parkoperator',searchSelect:'local_all',
                            format:(row)=>{return common.nameformat(row,this.olist,'operator_id')}
                        },
                    ]},*/
					{hasSubs:false,index:6,subs:[
						{label:'车场',prop:'com_id',width:'200',type:'selection',selectlist:this.plist,editable:false,searchable:true,unsortable:true,
							customSelect:'park',searchSelect:'local_all',
							format:(row)=>{return common.nameformat(row,this.plist,'com_id')}
						},
					]},
					{hasSubs:false,index:7,subs:[
						{label:'车牌',prop:'plate_number',width:'130',type:'str',editable:false,searchable:true,unsortable:true,},
					]},
					{hasSubs:false,index:8,subs:[
						{label:'进场时间',prop:'start_time',width:'175',type:'date',editable:false,searchable:true,align:'center',
							format:function(row){
									return common.dateformat(row.start_time);
								}
						},
					]},
					{hasSubs:false,index:9,subs:[
						{label:'出场时间',prop:'end_time',width:'175',type:'date',editable:false,searchable:true,align:'center',
							format:function(row){
								return common.dateformat(row.end_time);
							}
						},
					]},
                    {hasSubs:false,index:10,subs:[
                        {label:'支付时间',prop:'pay_time',width:'175',type:'date',editable:false,searchable:true,align:'center',
                            format:function(row){
                                return common.dateformat(row.pay_time);
                            }
                        },
                    ]},
					{hasSubs:false,index:11,subs:[
						{label:'停车时长',prop:'duartion',width:'160',type:'number',editable:false,searchable:false,unsortable:true,align:'center',},
					]},
					{hasSubs:false,index:12,subs:[
						{label:'订单金额',prop:'total',width:'150',type:'number',editable:false,searchable:true,align:'center',
							format:function(row){
								return common.balanceformat(row.total,2)
							}
						},
					]},
//					{hasSubs:false,subs:[
//						{label:'付款厂商',prop:'car_union_id',width:'120',type:'selection',selectlist:this.ulist,editable:false,searchable:false,unsortable:true,align:'center',
//							format:(row)=>{
//								if(row.car_union_id=="-1"){
//									return '-'
//								}else{
//									return common.nameformat(row,this.ulist,'car_union_id')
//								}
//							}
//						},
//					]},

					{hasSubs:false,subs:[
						{label:'分润(厂商)',prop:'union_service',width:'150',type:'number',editable:false,searchable:false,hidden:false,align:'center',
							format:function(row){
								return common.balanceformat(row.union_service,5)
							}
						},
					]},
					{hasSubs:false,subs:[
						{label:'分润(服务商)',prop:'server_service',width:'150',type:'number',editable:false,searchable:false,hidden:true,align:'center',
							format:function(row){
								return common.balanceformat(row.server_service,5)
							}
						},
					]},
                    {hasSubs:false,subs:[
                        {label:'说明',prop:'title',width:'160',type:'str',editable:false,searchable:false,unsortable:true,hidden:true,align:'center',},
                    ]},
				],
				searchtitle:'交易订单收入查询',
				editFormRules: {},
			}
		},
		watch:{
			slist:function(val,oldVal){
				this.tableitems[5].subs[0].selectlist=val
			},
			plist:function(val,oldVal){
				this.tableitems[6].subs[0].selectlist=val
			},
			/*ulist:function(val,oldVal){
				this.tableitems[14].subs[0].selectlist=val

			},*/
//			olist:function(val,oldVal){
//                this.tableitems[6].subs[0].selectlist=val
//            },
		},
		activated(){
			var u = sessionStorage.getItem('user')
			var user = JSON.parse(u)
			console.log(user)
			var dat = 185;
			if(user.roleid=="2"){
//				this.tableitems[13].subs[0].searchable=true
//				this.tableitems[13].subs[0].hidden=false
//                this.tableitems[14].subs[0].hidden=false
                this.tableitems[15].subs[0].hidden=false
			}else if(user.roleid=="3"){
				this.tableitems[2].subs[0].searchable=false
                this.tableitems[13].subs[0].hidden=true
//                this.tableitems[14].subs[0].searchable=true
                this.tableitems[14].subs[0].hidden=false
                this.tableitems[15].subs[0].hidden=false
            }
			else if(user.roleid=="5"){
                this.tableitems[2].subs[0].searchable=false
                this.tableitems[13].subs[0].hidden=true
                this.tableitems[14].subs[0].hidden=true
                this.tableitems[15].subs[0].hidden=false
                dat = 143;
            }
			window.onresize=()=>{this.tableheight=common.gwh()-dat;}
			this.tableheight=common.gwh()-dat
			//清空高级查询,重新拉取数据
			this.$refs['ordertradein'].$refs['search'].resetSearch()
			this.$refs['ordertradein'].getTableData({})
			var _this=this
			//请求列表
			var user = sessionStorage.getItem('user')
			user = JSON.parse(user)
			//本平台服务商,本平台车场,所有厂商平台
			let serverparams = '&unionid='+user.unionid
			if(user.roleid==3){

			}
			axios.all([
			    //common.getUnionList(),
				common.getServerList(serverparams),common.getParkList()
				//,common.getOperatorList(serverparams)
				])
			.then(axios.spread(function(
			  //  union,
				server,park
				//,operator
				){
				//_this.ulist=union.data
				_this.slist=server.data
				_this.plist=park.data
				//_this.olist=operator.data
			}))
		}
	}

</script>

<style scoped>

</style>

