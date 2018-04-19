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
			ref="operateordertradein"
		></common-table>
	</section>
</template>

<script>
	import { path,stateitems,listparams,paytypelist,paychannellist} from '../../api/api';
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
				fieldsstr:'id__order_id__server_id__com_id__plate_number__start_time__end_time__trade_no__duration__total__car_union_id__pay_time__title__pay_type__pay_channel',
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
					{hasSubs:false,subs:[
						{label:'车场',prop:'com_id',width:'200',type:'selection',selectlist:this.plist,editable:false,searchable:true,unsortable:true,
							customSelect:'park',searchSelect:'local_all',
							format:(row)=>{return common.nameformat(row,this.plist,'com_id')}
						},
					]},
					{hasSubs:false,subs:[
						{label:'车牌',prop:'plate_number',width:'130',type:'str',editable:false,searchable:true,unsortable:true,},
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
                        {label:'支付时间',prop:'pay_time',width:'175',type:'date',editable:false,searchable:true,align:'center',
                            format:function(row){
                                return common.dateformat(row.pay_time);
                            }
                        },
                    ]},
					{hasSubs:false,subs:[
						{label:'停车时长',prop:'duartion',width:'160',type:'number',editable:false,searchable:false,unsortable:true,align:'center',},
					]},
					{hasSubs:false,subs:[
						{label:'订单金额',prop:'total',width:'150',type:'number',editable:false,searchable:true,align:'center',
							format:function(row){
								return common.balanceformat(row.total,2)
							}
						},
					]},
//
                    {hasSubs:false,subs:[
                        {label:'说明',prop:'title',width:'160',type:'str',editable:false,searchable:false,unsortable:true,align:'center',},
                    ]}
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

			}
		},
        mounted() {
            window.onresize=()=>{this.tableheight=common.gwh()-135;}
            this.tableheight=common.gwh()-135;
            //this.settingContent='float:left;width:'+(common.gww()*0.9-170)+'px'
        },
		activated(){
			var u = sessionStorage.getItem('user')
			var user = JSON.parse(u)
			console.log(user)
			window.onresize=()=>{this.tableheight=common.gwh()-135;}
			this.tableheight=common.gwh()-135
			//清空高级查询,重新拉取数据
			this.$refs['operateordertradein'].$refs['search'].resetSearch()
			this.$refs['operateordertradein'].getTableData({})
			var _this=this
			//请求列表
			var user = sessionStorage.getItem('user')
			user = JSON.parse(user)
			//本平台服务商,本平台车场,所有厂商平台
			let serverparams = '&unionid='+user.unionid
			if(user.roleid==3){

			}
			axios.all([
				common.getServerList(serverparams),common.getParkList()
				])
			.then(axios.spread(function(
				server,park
				){
				_this.slist=server.data
				_this.plist=park.data
			}))
		}
	}

</script>

<style scoped>

</style>

