<template>
	<section>
		<common-table 
			:queryapi="queryapi" 
			:editapi="editapi" 
			:exportapi="exportapi"
			:addapi="addapi"
			:addtitle="addtitle"
			:tableheight="tableheight"
			:fieldsstr="fieldsstr"
			:tableitems="tableitems"
			:editFormRules="editFormRules"
			:btswidth="btswidth"
			:searchtitle="searchtitle"
			:hideAdd="hideAdd"
			:showqrurl="showqrurl"
			:showComponent="showComponent"
			v-on:qrurl="generateurl"
			:showsetting="showsetting"
			v-on:setting="parksetting"
			v-on:queryComponent="queryComponent"
			ref="parktable"
		></common-table>

		<div></div>
		<el-dialog title="生成车场二维码" v-model="qrVisible" @close="qrclose" @open="qropen" top="6%" size="tiny">
			<div v-if="qrVisible" >
			<el-row >
				<el-col :span="11" :offset="1"  style="padding-top:0px;margin-bottom:10px">
					<span>二维码类型:</span>
				</el-col>
				<el-col :span="11" :offset="1"  style="padding-top:0px;margin-bottom:10px">
					<span v-if="needChannel">{{channelType}}:</span>
				</el-col>
			</el-row>

			<el-row>
				<el-col :span="10" :offset="1">
					<el-select v-model="type" filterable placeholder="请选择" @change="selectQrType">
						<el-option
						v-for="item in qrtype"
						:label="item.name"
						:value="item.type">
						</el-option>
					</el-select>
				</el-col>
				<el-col :span="11" :offset="2">
					<el-input v-if="needChannel" v-model="channelValue" placeholder="请输入通道编号"></el-input>
				</el-col>
			</el-row>


			<el-row v-show="loadingqrcode">
				<!--<span>&nbsp;正在努力生成二维码,请稍后...</span>-->
			</el-row>

			<div v-show="hasQr">
			<el-row>
				<el-col :span="23" :offset="1" style="padding-top:0px;margin-top: 8px;margin-bottom:7px">
					二维码地址:
				</el-col>
				<el-col :span="23" :offset="1" >
					<el-input v-model="qrurl" ></el-input>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="23" :offset="1" style="margin-top: 10px;margin-bottom:5px">
					二维码图片:
				</el-col>
				<el-row>
					<el-col :span="10" :offset="1" >
						<el-checkbox-group v-model="checkQrBox" @change="changeQrBox" style="margin-top:10px;margin-left:12px">
							<el-row style="line-height:30px;display:inline"><el-checkbox label="1">平台环境</el-checkbox></el-row>
							<el-row style="line-height:30px;display:inline"><el-checkbox label="2">车场名称</el-checkbox></el-row>
							<el-row style="line-height:30px;display:inline"><el-checkbox label="3">二维码类型</el-checkbox></el-row>
							<el-row v-if="needChannel" style="line-height:30px;display:inline"><el-checkbox label="4">通道编号</el-checkbox></el-row>
						</el-checkbox-group>
					</el-col>
					<el-col :span="12" :offset="1" >
						<canvas id="canvas" style="display:none"></canvas>
						<canvas id="img" style="display:none"></canvas>
						<img :src="qrsrc" width="100%"/>
						<a id="download" v-show="generatable" style="font-size:10px;margin-left:80px;text-decoration:none">下载二维码</a>
						<!--<form :action="downloadapi">
							<input type="text" name="filepath" :value="filepath" v-show="false">
							<input type="text" name="filename" :value="filename" v-show="false">
							<input type="text" name="token" :value="token" v-show="false">
							<el-input type="submit" style="width: 70px;margin-left: 36px;display:block" value="点击下载" size="mini"></el-input>
						</form>-->
					</el-col>
				</el-row>
			</el-row>
		</div>
		<br/>
		<el-col style="margin-bottom: 15px;" align="right">
			<el-button @click="qrVisible = false" size="small">取 消</el-button>
			<el-button type="primary" @click="generateQR" :disabled="generatable" :loading="generateloading" size="small">点击生成二维码</el-button>
		</el-col>
		</div>
		</el-dialog>

		<!--设置-->
		<el-dialog
			title="车场设置"
			v-model="settingVisible"
			v-if="settingVisible"
			size="large"
			@open="openSetting"
			>
			  <div>
				<div class="setting">
					<el-menu :default-active="settingActive" class="el-menu-vertical-demo" @select="handleSetting">
						<el-menu-item index="2"><i class="el-icon-setting"></i>账号管理</el-menu-item>
						<el-menu-item v-if="false" index="1"><i class="el-icon-setting"></i>费率设置</el-menu-item>
					</el-menu>
				</div>
				<div :style="settingContent">
					<div v-if="index1">
					   <CollectingRate
					  	:parkid="parkid"
					  ></CollectingRate>
					</div>
					<div v-if="index2" style="margin-left:15px;">
						
						<!--<el-row style="margin-top:-10px"> 
							<el-button type="primary"  size="small" @click="handleCardAdd">添加银行卡</el-button>
							<div style="color:red;margin-top:5px;display:none">开始时间不选则为当前时间,结束时间不选默认2020年12月31日</div>
						</el-row>-->

						<el-row style="margin-top:10px">
							<el-table
								:data="adminData"
								border
								style="width: 100%"
								height="220"
								v-loading="loading"
								>
								<!--<el-table-column
								fixed
								prop="opts"
								label="操作"
								width="130">
								<template scope="scope">
									<el-button size="small" v-if="scope.row.protocol_status==9" type="text" @click="handleGenProtocol(scope.$index, scope.row)">申请协议</el-button>
									<el-button size="small" v-if="scope.row.protocol_status!=9" type="text" @click="handleCheckProtocol(scope.$index, scope.row)">查询协议</el-button>
									<el-button size="small" type="text" @click="handleDelCard(scope.$index, scope.row)"><span style="color:red">删除</span></el-button>
								</template>
								</el-table-column>-->
								<el-table-column
								prop="id"
								label="登录账号"
								width="150"
								align="center">
								</el-table-column>
								<el-table-column
								prop="name"
								label="管理员名称"
								width="200"
								align="center">
								</el-table-column>
								<el-table-column
								prop="reg_time"
								label="注册时间"
								width="200"
								:formatter="dateFormat1"
								align="center">
								</el-table-column>
								<el-table-column
								prop="last_login"
								label="上次登录时间"
								width="200"
								:formatter="dateFormat2"
								align="center">
								</el-table-column>
								<el-table-column
								prop="mobile"
								label="密保手机号"
								width="180"
								align="center"
								:formatter="mobileFormat">
								</el-table-column>
								<el-table-column
								prop="state"
								label="状态"
								width="113"
								align="center"
								:formatter="stateFomat">
								</el-table-column>
							</el-table>
						</el-row>
					 
					</div>

				</div>
			
			</div>

		</el-dialog>

	</section>
</template>
<script>
	import { path,stateitems,checkMobile,listparams,phonewidth,percision,addAccountState } from '../../api/api';
	import util from '../../common/js/util'
	import common from '../../common/js/common'
	import CommonTable from '../../components/CommonTable'
 	import CollectingRate from '../public/CollectingRate'

	export default {
		components:{
			CommonTable,CollectingRate
		},
		data(){
			return {
				checkQrBox:[],
				slist:[],
				aslist:[],
				olist:[],
                aolist:[],
				qrunionlist:[],
				unionid:'',
				initunionid:'',
				parkid:'',
				qrsrc:'',
				qrurl:'',
				filepath:'',
				filename:'',
				text:'',
				token:sessionStorage.getItem('token'),
				downloadapi:path+"/park/download",
				generateloading:false,
				generatable:true,
				settingVisible:false,
				loadingqrcode:false,
				hasQr:false,
				loading: false,
				hideAdd:false,
				showqrurl:true,
				showsetting:true,
				qrVisible:false,
				tableheight:'',
				showComponent:true,
				queryapi:'/park/query',
				editapi:'/park/edit',
				addapi:'/park/add',
				exportapi:'/park/export',
				btswidth:'290', 
				fieldsstr:'id__server_id__operator_id__park_id__name__add_account_time__add_account_state__total_plot__empty_plot__lng__lat__address__phone__ctime__utime__state__balance',
				tableitems:[
					{hasSubs:false,subs:[
						{label:'泊链编号',prop:'id',width:'120',type:'number',editable:false,searchable:true,align:'center',},
					]},
					{hasSubs:false,subs:[
						{label:'服务商',prop:'server_id',width:'120',type:'selection',selectlist:this.aslist,editable:true,searchable:true,unsortable:true,addable:true,
							//customSelect:'parkserver',searchSelect:'local_all',commonSelect:'local_available',
							format:(row)=>{return common.nameformat(row,this.slist,'server_id')}
						},
					]},
					{hasSubs:false,subs:[
                         {label:'运营商',prop:'operator_id',width:'120',type:'selection',selectlist:this.aolist,editable:true,searchable:true,unsortable:true,addable:true,
                                 //customSelect:'parkoperator',searchSelect:'local_all',commonSelect:'local_available',
                                 format:(row)=>{return common.nameformat(row,this.aolist,'operator_id')}
                             },
					]},
					{hasSubs:false,subs:[
						{label:'车场编号',prop:'park_id',width:'150',type:'str',editable:false,searchable:true,unsortable:true,align:'center',addable:true},
					]},
					{hasSubs:false,subs:[
						{label:'车场名称',prop:'name',width:'260',type:'str',editable:true,searchable:true,unsortable:true,addable:true},
					]},
					{hasSubs:false,subs:[
                        {label:'进件时间',prop:'add_account_time',width:'170',type:'date',editable:false,searchable:true,unsortable:true,
                            format:function(row){
                                return common.dateformat(row.add_account_time);
                            }
                        },
                    ]},
                    {hasSubs:false,subs:[
                        {label:'进件状态',prop:'add_account_state',width:'120',type:'selection',selectlist:addAccountState,editable:false,searchable:true,unsortable:true,
                            format:(row)=>{return common.nameformat(row,addAccountState,'add_account_state')}
                        },
                    ]},
					{hasSubs:false,subs:[
						{label:'车位数',prop:'total_plot',width:'100',type:'number',editable:false,searchable:true,align:'center',addable:true},
					]},
					{hasSubs:false,subs:[
						{label:'余位数',prop:'empty_plot',width:'100',type:'number',editable:false,searchable:true,align:'center',addable:true},
					]},
					{hasSubs:false,subs:[
						{label:'经度',prop:'lng',width:'150',type:'number',editable:false,searchable:true,align:'center',addable:false,unsortable:true,
						format:function(row){
							if(row.lng<=0){
								return '-'
							}else{
								return row.lng
							}
						}},
					]},
					{hasSubs:false,subs:[
						{label:'纬度',prop:'lat',width:'150',type:'number',editable:false,searchable:true,align:'center',addable:false,unsortable:true,
						format:function(row){
							if(row.lat<=0){
								return '-'
							}else{
								return row.lat
							}
						}},
					]},
					{hasSubs:false,subs:[
						{label:'车场地址',prop:'address',width:'300',type:'str',editable:true,searchable:true,unsortable:true,addable:true},
					]},
					{hasSubs:false,subs:[
						{label:'联系手机',prop:'phone',width:phonewidth,type:'str',editable:true,searchable:true,unsortable:true,align:'center',addable:true},
					]},
					{hasSubs:false,subs:[
						{label:'新建日期',prop:'ctime',width:'175',type:'date',editable:false,searchable:true,align:'center',
							format:function(row){
									return common.dateformat(row.ctime);
								}
						},
					]},
					{hasSubs:false,subs:[
						{label:'心跳时间',prop:'utime',width:'175',type:'date',editable:false,searchable:true,align:'center',
							format:function(row){
								return common.dateformat(row.utime);
							}
						},
					]},
					{hasSubs:false,subs:[
						{label:'车场状态',prop:'state',width:'90',type:'selection',selectlist:stateitems,editable:false,searchable:true,align:'center',addable:false,
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
					]}
				],
				searchtitle:'查询车场',
				addtitle:'注册车场',
				editFormRules: {
					name: [
						{ required: true, message: '请输入名称', trigger: 'blur' }
					],
					phone: [
						{ validator:checkMobile, required: true, trigger: 'blur' }
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
					lat: [
						{ required: true, message: '请输入车场经度', trigger: 'blur' }
					],
					lng: [
						{ required: true, message: '请输入车场纬度', trigger: 'blur' }
					],
					park_id: [
						{ required: true, message: '请输入本地车场编号', trigger: 'blur' }
					],
					server_id: [
						{ required: true, message: '请选择服务商', trigger: 'change' }
					],
					// operator_id: [
                    //     { required: true, message: '请选择运营商', trigger: 'change' }
                    // ],
					state: [
						{ required: true, message: '请选择状态', trigger: 'change' }
					],
				},
				adminData:[],
				settingActive:'2',
				index1:false,
				index2:false,
				settingContent:'',
				dateFormat1:function(row){
					return common.dateformat(row.reg_time)
				},
				dateFormat2:function(row){
					return common.dateformat(row.last_login)
				},
				stateFomat:function(row){
					if(row.state==1){
						return "正常"
					}else if(row.state==0){
						return "不可用"
					}else if(row.state==2){
						return "删除"
					}else{
						return "未知"
					}
				},
				mobileFormat:function(row){
					if(row.mobile==null||row.mobile==''){
						return "未设置"
					}else{
						return row.mobile
					}
				},
				type:'',
				qrtype:[
					{'name':'场内预支付','type':1},
					{'name':'出口直付','type':2},
					{'name':'无牌车入场','type':3},
				],
				channelType:'',
				channelValue:'',
				needChannel:false,
			}
		},
		methods:{
			parksetting(parkid){
				this.adminData = []
				this.settingVisible=true
				this.parkid = parkid
				this.getAdminTableData()
			},
			openSetting(){
				this.settingActive="2"
				this.index1=false
				this.index2=true
			},
			handleSetting(key,path){
				if(key=="1"){
					this.index1=true
					this.index2=false
				}else if(key=="2"){
					this.index2=true
					this.index1=false
				}
			},
			generateurl(park_id){
				this.parkid = park_id
				//显示生成二维码对话框
				this.qrVisible = true
			},
			downloadQr(){
				location=this.qrsrc
			},
			generateQR(){
				if(this.type>1){
					if(this.channelValue==''||this.channelValue==null){
						this.$message({
						message: '请填写通道编号!',
						type: 'warning',
						duration:5000
						});
						return
					}
				}

				this.generateloading=true
				let vm = this;
				let box = "";
				for(var x in this.checkQrBox){
					box += this.checkQrBox[x];
				}
				let params = {qrBox:box,park_id:this.parkid,union_id:this.unionid,type:this.type,channel_id:this.channelValue,token:sessionStorage.getItem('token')}
				this.$ajax({
					url:path+"/park/getqrurl",
					data:params,
					asycn:false,
					success:function(result){
						//console.log(result)
						let ret =eval('('+result+')')
						//let ret = result.parseJSON()
						//console.log(ret)
						if(ret.validate!='undefined'&&ret.validate=='0'){
							vm.loading = false;
							//未携带令牌.重新登录
							setTimeout(()=>{vm.alertInfo('未携带令牌,请重新登录!')},150)
						}else if(ret.validate!='undefined'&&ret.validate=='1'){
							vm.loading = false;
							//过期.重新登录
							setTimeout(()=>{vm.alertInfo('登录过期,请重新登录!')},150)
						}else if(ret.validate!='undefined'&&ret.validate=='2'){
							vm.loading = false;
							//令牌无效.重新登录
							setTimeout(()=>{vm.alertInfo('登录异常,请重新登录!')},150)
						}else{
							if(ret.state){
								vm.qrurl=ret.qrurl
								vm.hasQr=true
								vm.text=ret.text
								vm.generateloading=false
								vm.generatable=true
								vm.loadingqrcode=false;
								vm.genqr(ret.qrurl,ret.text);
							}else{
								vm.$alert(ret.msg, '提示', {
									confirmButtonText: '确定',
									type: 'warning',
									callback: action => {
										vm.hasQr=false
										vm.generateloading=false
										vm.generatable=false
									}
								})
							}
						}
					}
				})
			},
			genqr(url,text){
				var canvas = document.getElementById('canvas')
				//console.log(canvas)
				this.QRCode.toCanvas(canvas, url,{ errorCorrectionLevel: 'H' }, function (error) {
					//console.log(url)
					if (error){
						//console.error(error)
					} else{
						//console.log('success!');
					}
				})
				//console.log(canvas.width)
				var context=canvas.getContext('2d');
           		var imageData = context.getImageData(0,0,canvas.width,canvas.height);
				
				var img = document.getElementById("img");
				img.width=canvas.width
				img.height=canvas.height+text.length*15+8
				var context2 = img.getContext('2d');
				context2.fillStyle="white";
				context2.fillRect(0,0,canvas.width,(canvas.height+text.length*15+8)); 
				context2.putImageData(imageData,0,0);
				context2.font="bold 10px 微软雅黑"
				context2.fillStyle="black"
				for(var i=0;i<text.length;i++){
					context2.fillText(text[i],14,canvas.height+5+15*i)
				}
				var url = img.toDataURL("image/png");
				this.qrsrc = url
				var filename = this.initunionid+"-"+this.parkid+"-"+this.randomNum(6)+".png"
				var triggerDownload = this.$("#download").attr("href", url).attr("download", filename);
   				//triggerDownload[0].click();
			},
			alertInfo(msg){
				this.$alert(msg, '提示', {
					confirmButtonText: '确定',
					type: 'warning',
					callback: action => {
						sessionStorage.removeItem('user');
						sessionStorage.removeItem('token');
						this.$router.push('/login');
					}
				});
			},
			randomNum(n){ 
				var t=''; 
				for(var i=0;i<n;i++){ 
				t+=Math.floor(Math.random()*10); 
				} 
				return t; 
			} , 
			qropen(){
				if(path=='https://s.bolink.club/web'){
					this.checkQrBox = ["2","3"]
				}else{
					this.checkQrBox = ["1","2","3"]
				}
				this.needChannel=false
				this.hasQr=false;
				this.loadingqrcode=true;
				this.qrsrc=''
				this.qrurl=''
				this.type=''
				this.channelValue=''
				this.generatable=true;
				//this.generateQR()
			},
			qrclose(){
				this.type=''
				this.qrVisible=false
				this.hasQr=false;
				this.generateloading=false
				setTimeout(()=>{this.unionid=''},300)
			},
			selectQrType(){
				this.hasQr=false
				if(path=='https://s.bolink.club/web'){
					this.checkQrBox = ["2","3","4"]
				}else{
					this.checkQrBox = ["1","2","3","4"]
				}
				this.channelValue=''
				if(this.type>1){
					this.needChannel=true
					if(this.type==2){
						this.channelType='请输入出场通道编号'
					}else if(this.type==3){
						this.channelType='请输入入场通道编号'
					}
				}else{
					this.needChannel=false
					this.generateQR()
				}
				this.generatable=false;

			},
			//获取车场登录账号
			getAdminTableData(){
				var vm=this;
				this.loading = true;
				var sform = {'token':sessionStorage.getItem('token'),'platform_id':this.parkid,'user_type':4}
				vm.$post(path+"/user/admin",sform,function(ret){
					if(ret.validate!='undefined'&&ret.validate=='0'){
						vm.loading = false;
						//未携带令牌.重新登录
						setTimeout(()=>{vm.alertInfo('未携带令牌,请重新登录!')},150)
					}else if(ret.validate!='undefined'&&ret.validate=='1'){
						vm.loading = false;
						//过期.重新登录
						setTimeout(()=>{vm.alertInfo('登录过期,请重新登录!')},150)
					}else if(ret.validate!='undefined'&&ret.validate=='2'){
						vm.loading = false;
						//令牌无效.重新登录
						setTimeout(()=>{vm.alertInfo('登录异常,请重新登录!')},150)
					}else{
						vm.adminData=ret;
						vm.loading = false;
					}
					
				},"json");
			},
			changeQrBox(event){
				//1平台类型,2车场名称,3二维码类型,4通道编号
				this.generatable = false
			},
			queryComponent(row){
				sessionStorage.setItem("component_comid",row.id)
				sessionStorage.setItem("component_fromPath",'/park')
				this.active="/parkcomponent"
				this.$router.push("/parkcomponent");
			}
		},
		mounted() {
			window.onresize=()=>{this.tableheight=common.gwh()-135;}
			this.tableheight=common.gwh()-135;
		},
		activated(){
			window.onresize=()=>{this.tableheight=common.gwh()-135;}
			this.tableheight=common.gwh()-135;
			this.$refs['parktable'].$refs['search'].resetSearch()
			this.$refs['parktable'].getTableData({})
			var _this=this
			//请求列表
			//本平台服务商,本平台可用服务商,配有生成二维码回调地址的厂商
			this.initunionid = eval('('+sessionStorage.getItem('user')+')')['unionid'];
			let listparams = '&unionid='+this.initunionid
			this.axios.all([common.getServerList(listparams),common.getServerList(listparams+'&state=1'),common.getUnionList('&qr=1'),common.getOperatorList(listparams),common.getOperatorList(listparams+'&state=1')])
			.then(this.axios.spread(function(server,aserver,qrunion,operator,aoperator){
				_this.slist=server.data
				_this.aslist=aserver.data
				_this.qrunionlist=qrunion.data
				_this.olist=operator.data
                _this.aolist=aoperator.data
			}))
			this.index2=true
			this.settingContent='float:left;width:'+(common.gww()*0.9-178)+'px'
		},
		watch:{
			aslist:function(val,oldVal){
				this.tableitems[1].subs[0].selectlist=val
			},
			 aolist:function(val,oldVal){
                 this.tableitems[2].subs[0].selectlist=val
             },
			channelValue:function(val,oldVal){
				this.generatable=false
			}
		},
	}

</script>

<style>
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
