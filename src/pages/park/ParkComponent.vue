<template>
	<div>
		<div>
			<!--获取验证码-->
			<el-dialog
			title="获取验证码"
			v-model="codeVisible"
			size="tiny"
			:close-on-click-modal="false">
				<div >
					<el-form ref="codeform" :model="getpass" label-width="80px" style="width:90%">
						<el-form-item label="密保手机" prop="mobile">
						<el-input v-model="getpass.mobile" :disabled="true"></el-input>
						</el-form-item>
						<el-form-item label="验证码">
						<el-input v-model="getpass.code" style="width:50%"></el-input>
						<el-button  type="primary" :plain="true" :disabled="codeBtn" @click="getCode" style="color:black">获取验证码</el-button>
						</el-form-item>
					</el-form>
					<el-col align="right" style="margin-bottom:18px;margin-top:5px;">
						<el-button @click="codeVisible = false" size="small">取 消</el-button>
						<el-button type="primary" @click="verifyCode" size="small">确 定</el-button>
					</el-col>
				</div>
			</el-dialog>

		<!--大图显示-->
		<!--<el-dialog
			v-model="showBigImg"
			title="查看图片"
			v-dialogDrag
			ref="dialog__wrapper">
			<div class="dialog-body">
				<div class="line"
					v-dialogDragWidth="$refs.dialog__wrapper">
						<div align="center">
							<img :src="bigImgPath" width="600px" height="450px"/>
						</div>
						<div align="right">
							<el-button @click="showBigImg = false" size="small">确 认</el-button>
						</div>
				</div>
			</div>
		</el-dialog>-->
		</div>	  
		<!--车场进件-->
		<div style="overflow:auto;" v-bind:style="{height: showHeight}">  
			<el-form ref="form" :rules="rules" :model="form" label-width="120px">
				<el-form-item label="">
					<div align="center"><span style="font-size:17px">车场进件</span></div>
				</el-form-item>
				<el-form-item v-show="(roleid=='4' || roleid=='2') && form.state=='3'" label="失败原因:">
					<div ><span style="font-size:14px;color:red">{{form.review_remark}}</span></div>
				</el-form-item>
				<el-form-item label="主题类型">
					<el-radio-group v-model="form.type" @change="showComponentType" :disabled="isSuperOper" required>
						<el-radio label="0" >企业</el-radio>
						<el-radio label="1" >个人</el-radio>
					</el-radio-group>
				</el-form-item>
				<!--企业进件-->
				<div v-show="!showPersonComponent">
					<el-form-item label="企业名称" prop="company_name">
						<el-input style="width:400px" v-model="form.company_name" :disabled="isSuperOper"></el-input>
					</el-form-item>
					<el-form-item label="营业执照编号" prop="buslic_no">
						<el-input style="width:400px" v-model="form.buslic_no" :disabled="isSuperOper"></el-input><span style="margin-left:10px;font-weight:lighter">三证合一企业填统一信用代码</span>
					</el-form-item>
					<el-form-item label="税务登记号" prop="taxregi_no">
						<el-input style="width:400px" v-model="form.taxregi_no" :disabled="isSuperOper"></el-input><span style="margin-left:10px;font-weight:lighter">三证合一企业填统一信用代码</span>
					</el-form-item>
					<el-form-item label="法人姓名" prop="legalper_name">
						<el-input style="width:400px" v-model="form.legalper_name" :disabled="isSuperOper"></el-input>
					</el-form-item>
					<el-form-item label="法人身份证号" prop="legalper_no">
						<el-input style="width:400px" v-model="form.legalper_no" :disabled="isSuperOper"></el-input>
					</el-form-item>


					<div style="margin-left:20px;border-bottom:1px dashed"><span style="font-size:15px;color:#48576a;">银行账户信息</span></div>
					<div style="height:20px"></div>
					<el-form-item label="开户银行" prop="bank_no">
						<el-select v-model="form.bank_no" placeholder="请选择" no-match-text="无匹配数据,请选择或输入其它" filterable @change="showEditBank" style="width:200px" :disabled="isSuperOper">
							<el-option
								v-for="item in banklist"
								:label="item.value_name"
								:value="item.value_no"
								>
							</el-option>
						</el-select>
						<el-input style="width:220px" v-if="showEditBankName" v-model="form.bank_name" placeholder="请填写银行名称" :disabled="isSuperOper"></el-input>
					</el-form-item>
					<div v-show="!isSuperOper">
						<el-form-item label="开户城市" prop="bank_city">
							<el-select v-model="form.bank_province" placeholder="省" filterable @change="getCityList" style="width:200px">
								<el-option
									v-for="item in provincelist"
									:label="item.name"
									:value="item.proID"
									>
								</el-option>
							</el-select>
							<el-select v-model="form.bank_city" placeholder="市" filterable  style="width:200px">
								<el-option
									v-for="item in citylist"
									:label="item.value_name"
									:value="item.value_no"
									>
								</el-option>
							</el-select>
						</el-form-item>
					</div>
					<div v-show="isSuperOper">
						<el-form-item label="开户城市" prop="city">
							<el-input style="width:220px"  v-model="form.city"  disabled></el-input>
						</el-form-item>
					</div>
					<el-form-item label="银行账号" prop="card_number">
						<el-input style="width:400px" v-model="form.card_number" :disabled="isSuperOper"></el-input>
					</el-form-item>
					<el-form-item label="企业开户名称" prop="name">
						<el-input style="width:400px" v-model="form.name" :disabled="isSuperOper"></el-input>
					</el-form-item>

					<div style="margin-left:20px;border-bottom:1px dashed"><span style="font-size:15px;color:#48576a;">企业资料文件</span></div>
					<div style="height:20px"></div>
					<div v-show="!isSuperOper">
						<el-form-item label="营业执照" prop="buslic_id">
							<el-upload
								class="upload-demo"
								ref="buslicRef"
								:action="action"
								:before-upload="beforeUploadBusLic"
								:on-success="setBusLicId"
								:file-list="busLicList"
								:on-change="changeBusLicList"
								:on-remove="delBusLicId"
								:disabled="isSuperOper"
								list-type="picture">
								<el-button size="small" type="primary">点击上传</el-button>
								<div slot="tip" class="el-upload__tip">请附上传营业执照的照片或者扫描件，支持jpg、jpeg、bmp、gif、png格式,大小不超过3m</div>
							</el-upload>
						</el-form-item>
						<el-form-item label="开户许可证" prop="accopen_id">
							<el-upload
								class="upload-demo"
								:action="action"
								:before-upload="beforeUploadAccOpen"
								:on-success="setAccOpenId"
								:file-list="accOpenList"
								:on-change="changeAccOpenList"
								:on-remove="delAccOpenId"
								:disabled="isSuperOper"
								list-type="picture">
								<el-button size="small" type="primary">点击上传</el-button>
								<div slot="tip" class="el-upload__tip">请附上传开户许可证的照片或者扫描件，支持jpg、jpeg、bmp、gif、png格式,大小不超过3m</div>
							</el-upload>
						</el-form-item>	
					</div>
					<div v-show="isSuperOper">
						<el-form-item label="营业执照" prop="buslic_id">
							<div style="margin-top:30px">
								<img :src="buslicPath" @click="clickImg($event)" style="width: 150px">
							</div>
						</el-form-item>
						<el-form-item label="开户许可证" prop="accopen_id">
							<div style="margin-top:30px">
								<img :src="accopenPath" @click="clickImg($event)" style="width: 150px">
							</div>
						</el-form-item>
					</div>
				</div>
				<div v-show="showPersonComponent">
					<!--个人进件-->
					<el-form-item label="管理员姓名" prop="operator_name">
						<el-input style="width:400px" v-model="form.operator_name" :disabled="isSuperOper"></el-input>
					</el-form-item>
					<el-form-item label="管理员身份证号" prop="operator_no">
						<el-input style="width:400px" v-model="form.operator_no" :disabled="isSuperOper"></el-input>
					</el-form-item>

					<div style="margin-left:20px;border-bottom:1px dashed"><span style="font-size:15px;color:#48576a;">银行账户信息</span></div>
					<div style="height:20px"></div>
					<el-form-item label="开户银行" prop="bank_no">
						<el-select v-model="form.bank_no" placeholder="请选择"  no-match-text="无匹配数据,请选择或输入其它" filterable @change="showEditBank" style="width:200px" :disabled="isSuperOper">
							<el-option
								v-for="item in banklist"
								:label="item.value_name"
								:value="item.value_no"
								>
							</el-option>
						</el-select>
						<el-input style="width:220px" v-if="showEditBankName" v-model="form.bank_name" placeholder="请填写银行名称" :disabled="isSuperOper"></el-input>
					</el-form-item>
					<div v-show="!isSuperOper">
						<el-form-item label="开户城市" prop="bank_city">
							<el-select v-model="form.bank_province" placeholder="省" filterable @change="getCityList" style="width:200px">
								<el-option
									v-for="item in provincelist"
									:label="item.name"
									:value="item.proID"
									>
								</el-option>
							</el-select>
							<el-select v-model="form.bank_city" placeholder="市" filterable  style="width:200px">
								<el-option
									v-for="item in citylist"
									:label="item.value_name"
									:value="item.value_no"
									>
								</el-option>
							</el-select>
						</el-form-item>
					</div>
					<div v-show="isSuperOper">
						<el-form-item label="开户城市" prop="city">
							<el-input style="width:220px"  v-model="form.city"  disabled></el-input>
						</el-form-item>
					</div>
					<el-form-item label="银行账号" prop="card_number">
						<el-input style="width:400px" v-model="form.card_number" :disabled="isSuperOper"></el-input>
					</el-form-item>
					<el-form-item label="开户人姓名" prop="name">
						<el-input style="width:400px" v-model="form.name" :disabled="isSuperOper"></el-input>
					</el-form-item>

					<div style="margin-left:20px;border-bottom:1px dashed"><span style="font-size:15px;color:#48576a;">个人资料文件</span></div>
					<div style="height:20px"></div>
					<div v-show="!isSuperOper">
						<el-form-item label="身份证正面照片" prop="operident_id">
							<el-upload
								class="upload-demo"
								:action="action"
								:before-upload="beforeUploadOperIdent"
								:on-success="setOperIdentId"
								:file-list="operIdentList"
								:on-change="changeOperIdentList"
								:on-remove="delOperIdentId"
								:disabled="isSuperOper"
								list-type="picture">
								<el-button size="small" type="primary">点击上传</el-button> 
								<div slot="tip" class="el-upload__tip">请附上传身份证正面清晰的照片或者扫描件，支持jpg、jpeg、bmp、gif、png格式,大小不超过3m</div>
							</el-upload>
						</el-form-item>
						<el-form-item label="身份证反面照片" prop="operident_id2">
							<el-upload
								class="upload-demo"
								:action="action"
								:before-upload="beforeUploadOperIdent2"
								:on-success="setOperIdentId2"
								:file-list="operIdentList2"
								:on-change="changeOperIdentList2"
								:on-remove="delOperIdentId2"
								:disabled="isSuperOper"
								list-type="picture">
								<el-button size="small" type="primary">点击上传</el-button> 
								<div slot="tip" class="el-upload__tip">请附上传身份证反面清晰的照片或者扫描件，支持jpg、jpeg、bmp、gif、png格式,大小不超过3m</div>
							</el-upload>
						</el-form-item>
						<el-form-item label="银行卡" prop="opercard_id">
							<el-upload
								class="upload-demo"
								:action="action"
								:before-upload="beforeUploadOperCard"
								:on-success="setOperCardId"
								:file-list="operCardList"
								:on-change="changeOperCardList"
								:on-remove="delOperCardId"
								:disabled="isSuperOper"
								list-type="picture">
								<el-button size="small" type="primary">点击上传</el-button> 
								<div slot="tip" class="el-upload__tip">请附上传标有银行卡卡号的一面照片或者扫描件，支持jpg、jpeg、bmp、gif、png格式,大小不超过3m</div>
							</el-upload>
						</el-form-item>
					</div>
					<div v-show="isSuperOper">
						<el-form-item label="身份证正面照片" prop="operident_id">
							<div style="margin-top:30px">
								<img :src="operidentPath" @click="clickImg($event)" style="width: 150px">
							</div>
						</el-form-item>
						<el-form-item label="身份证反面照片" prop="operident_id2">
							<div style="margin-top:30px">
								<img :src="operidentPath2" @click="clickImg($event)" style="width: 150px">
							</div>
						</el-form-item>
						<el-form-item label="银行卡" prop="opercard_id">
							<div style="margin-top:30px">
								<img :src="opercardPath" @click="clickImg($event)" style="width: 150px">
							</div>
						</el-form-item>
					</div>
				</div>	
				<div v-show="!showReview && !showEdit ">
					<el-form-item>
						<el-button type="primary" @click="submitCHeck(true)" :disabled="isSuperOper">提交</el-button>
						<el-button @click="backUpPage">返回</el-button>
					</el-form-item>
				</div>
				<div v-show="showEdit">
					<el-form-item>
						<el-button type="primary" @click="isSuperOper = false">编辑</el-button>
						<el-button type="primary" @click="submitCHeck(false)" :disabled="isSuperOper">提交</el-button>
						<el-button @click="backUpPage">返回</el-button>
					</el-form-item>
				</div>
				<div v-show="showReview">
					<div style="margin-left:20px;border-bottom:1px dashed"><span style="font-size:15px;color:#48576a;">资料审核</span></div>
					<div style="height:20px"></div>
					<el-form-item label="">
						<el-select v-model="form.state" filterable style="width:200px">
							<el-option
								v-for="item in statelist"
								:label="item.name"
								:value="item.value"
								>
							</el-option>
						</el-select>
						<el-input style="width:220px"  v-model="form.review_remark" placeholder="请填写备注"></el-input>
					</el-form-item>	
					<el-form-item>
						<el-button type="primary" @click="submitComponent" >提交</el-button>
						<el-button @click="backUpPage">返回</el-button>
					</el-form-item>
				</div>
				
			</el-form>
		</div>
	</div>	
</template>
<script>
	import common from '../../common/js/common.js'
	import { path,checkUpload,checkDigital,checkIdentNo } from '../../api/api';
	import directives from '../../common/js/directives.js'
export default {
    data() {
		return {
			showHeight:'',
        	banklist:[],
			provincelist:[],
			citylist:[],
			busLicList:[],
			accOpenList:[],
			operIdentList:[],
			operIdentList2:[],
			operCardList:[],
			showEditBankName:false,
			codeVisible:false,
			codeBtn:false,
			showPersonComponent:false,
			isSuperOper:false,
			showReview:false,
			showEdit:false,
			times:'0',
			action:path+'/upload/dbfile2?token='+sessionStorage.getItem('token'),
			roleid:'',
			message:'',
			banl_city:'',
			buslicPath:'',
			accopenPath:'',
			operidentPath:'',
			operidentPath2:'',
			opercardPath:'',
			showVerifyCode:false,
			getpass:{
				mobile:'',
				code:'',
				allMobile:'',
			},
			statelist:[
				{name:'审核通过',value:'1'},
				{name:'待补充',value:'3'}
			],
			form: {
				type:'',
				company_name: '',
				buslic_no: '',
				taxregi_no: '',
				legalper_name: '',
				legalper_no: '',
				bank_name: '',
				bank_no: '',
				card_number:'',
				name:'',
				bank_province:'',
				bank_city:'',
				buslic_id:'',
				accopen_id:'',
				operator_name:'',
				operator_no:'',
				operident_id:'',
				operident_id2:'',
				opercard_id:'',
				state:'',
				review_remark:'',
				city:'',
				isReviewOrEdit:'0',
			},
			rules:{},
			companyrules: {
				company_name: [
					{ required: true, message: '请输入公司名称', trigger: 'blur' },
				],
				buslic_no: [
					{ required: true, message: '请输入营业执照编号', trigger: 'blur' },
				],
				taxregi_no: [
					{ required: true, message: '请输入税务登记号', trigger: 'blur' },
				],
				legalper_name: [
					{ required: true, message: '请输入法人名称', trigger: 'blur' },
				],
				legalper_no: [
					{ required: true, message: '请输入法人身份证号', trigger: 'blur' },
					{ validator: checkIdentNo, message: '法人身份证号不合法', trigger: 'blur' },
				],
				bank_name: [
					{ required: true, message: '请输入开户银行', trigger: 'blur' },
				],
				bank_no: [
					{ required: true, message: '请选择开户银行', trigger: 'change' },
				],
				bank_city: [
					{ required: true, message: '请选择开户城市', trigger: 'change' },
				],
				card_number: [
					{ required: true, message: '请输入银行账户', trigger: 'blur' },
					{ validator: checkDigital, message: '输入银行账户必须全为数字', trigger: 'blur' },
				],
				name: [
					{ required: true, message: '请输入开户名称', trigger: 'blur' },
				],
				// buslic_id: [
				// 	{ validator: checkUpload,required: true, message: '请上传营业执照', trigger: 'on-success' },
				// ],
				// accopen_id: [
				// 	{ validator: checkUpload,required: true, message: '请上传开户许可证', trigger: 'change' },
				// ],
			},
			operrules: {
				operator_name: [
					{ required: true, message: '请输入管理员名称', trigger: 'blur' },
				],
				operator_no: [
					{ required: true, message: '请输入管理员身份证号', trigger: 'blur' },
					{ validator: checkIdentNo, message: '管理员身份证号不合法', trigger: 'blur' },
				],
				bank_name: [
					{ required: true, message: '请输入开户银行', trigger: 'blur' },
				],
				bank_no: [
					{ required: true, message: '请选择开户银行', trigger: 'change' },
				],
				bank_city: [
					{ required: true, message: '请选择开户城市', trigger: 'change' },
				],
				card_number: [
					{ required: true, message: '请输入银行账户', trigger: 'blur' },
					{ validator: checkDigital, message: '输入银行账户必须全为数字', trigger: 'blur' },
				],
				name: [
					{ required: true, message: '请输入开户名称', trigger: 'blur' },
				],
				// operident_id: [
				// 	{validator: checkUpload,required: true, message: '请上传正面管理员身份证', trigger: 'change'},
				// ],
				// operident_id2: [
				// 	{ validator: checkUpload,required: true, message: '请上传反面管理员身份证', trigger: 'change' },
				// ],
				// opercard_id: [
				// 	{ validator: checkUpload,required: true, message: '请上传管理员银行卡', trigger: 'change' },
				// ],
			}
		};  
			  
    },
    methods: {
		showComponentType:function(value){
			//console.log(value);
			if(value==0){
				this.showPersonComponent=false
				// if(this.roleid!='1'){
				// 	this.rules=this.companyrules
				// }else{//总管理员关闭校验规则
				// 	this.rules=[]
				// }
			}else{
				this.showPersonComponent=true
				// if(this.roleid!='1'){
				// 	this.rules=this.operrules
				// }else{//总管理员关闭校验规则
				// 	this.rules=[]
				// }
			}	
		},
		showEditBank:function(){
			//console.log(this.form.bank_id);
			if(this.form.bank_no==-1){
				this.showEditBankName=true
				if(this.times>1){
					this.form.bank_name=''
				}
			}else{
				this.showEditBankName=false
			}
		},
		getCityList:function(){
			if(this.form.bank_province==''){
				this.citylist=''
				return
			}
			let _this = this
			//1清空城市列表
			console.log("次数>>>"+this.times)
			if(this.times>2){
				_this.form.bank_city=''
			}
			//2查询下一级列表
			if(this.form.bank_province>0){
				this.$post(path+'/getdata/getcitylist',{ProID:this.form.bank_province},function(ret){
					_this.citylist = [];
					//_this.citylist = ret
					//var ret = eval('('+result+')')
					for(var x in ret){
						let obj = {};
						obj["value_no"]=ret[x].cityID+"";
						obj["value_name"]=ret[x].name;
						_this.citylist.push(obj);
					}
					console.log(_this.citylist)
				})
			}
			this.times++
		},
		beforeUploadBusLic:function(file,fileList) {
			var sform = this.form
        	const isTypeRight = file.type === 'image/jpg' 
				|| file.type === 'image/jpeg' ||  file.type === 'image/bmp' 
				||file.type === 'image/gif' || file.type === 'image/png';
			const isLt3M = file.size / 1024 / 1024 < 3;

			if (!isTypeRight) {
				this.$message.error('上传图片只能是 jpg、jpeg、bmp、gif、png 格式!');
				 this.busLicList=[]
				 this.$extend(sform,{'buslic_id':'-1'})
				 return fasle;
			}
			if (!isLt3M) {
				this.$message.error('上传图片大小不能超过 3MB!');
				 this.busLicList=[]
				 this.$extend(sform,{'buslic_id':'-1'})
			}
			return isTypeRight && isLt3M;
		},
		beforeUploadAccOpen:function(file,fileList) {
			var sform = this.form
        	const isTypeRight = file.type === 'image/jpg' 
				|| file.type === 'image/jpeg' ||  file.type === 'image/bmp' 
				||file.type === 'image/gif' || file.type === 'image/png';
			const isLt3M = file.size / 1024 / 1024 < 3;

			if (!isTypeRight) {
				this.$message.error('上传图片只能是 jpg、jpeg、bmp、gif、png 格式!');
				 this.accOpenList=[]
				 this.$extend(sform,{'accopen_id':'-1'})
				  return fasle;
			}
			if (!isLt3M) {
				this.$message.error('上传图片大小不能超过 3MB!');
				this.accOpenList=[]
				this.$extend(sform,{'accopen_id':'-1'})
			}
			return isTypeRight && isLt3M;
		},
		beforeUploadOperIdent:function(file,fileList) {
			var sform = this.form
        	const isTypeRight = file.type === 'image/jpg' 
				|| file.type === 'image/jpeg' ||  file.type === 'image/bmp' 
				||file.type === 'image/gif' || file.type === 'image/png';
			const isLt3M = file.size / 1024 / 1024 < 3;

			if (!isTypeRight) {
				this.$message.error('上传图片只能是 jpg、jpeg、bmp、gif、png 格式!');
				this.operIdentList=[]
				this.$extend(sform,{'operident_id':'-1'})
				 return fasle;
			}
			if (!isLt3M) {
				this.$message.error('上传图片大小不能超过 3MB!');
				this.operIdentList=[]
				this.$extend(sform,{'operident_id':'-1'})
			}
			return isTypeRight && isLt3M;
		},
		beforeUploadOperIdent2:function(file,fileList) {
			var sform = this.form
        	const isTypeRight = file.type === 'image/jpg' 
				|| file.type === 'image/jpeg' ||  file.type === 'image/bmp' 
				||file.type === 'image/gif' || file.type === 'image/png';
			const isLt3M = file.size / 1024 / 1024 < 3;

			if (!isTypeRight) {
				this.$message.error('上传图片只能是 jpg、jpeg、bmp、gif、png 格式!');
				this.operIdentList2=[]
				this.$extend(sform,{'operident_id2':'-1'})
				 return fasle;
			}
			if (!isLt3M) {
				this.$message.error('上传图片大小不能超过 3MB!');
				this.operIdentList2=[]
				this.$extend(sform,{'operident_id2':'-1'})
			}
			return isTypeRight && isLt3M;
		},
		beforeUploadOperCard:function(file,fileList) {
			var sform = this.form
        	const isTypeRight = file.type === 'image/jpg' 
				|| file.type === 'image/jpeg' ||  file.type === 'image/bmp' 
				||file.type === 'image/gif' || file.type === 'image/png';
			const isLt3M = file.size / 1024 / 1024 < 3;

			if (!isTypeRight) {
				this.$message.error('上传图片只能是 jpg、jpeg、bmp、gif、png 格式!');
				this.operCardList=[]
				this.$extend(sform,{'opercard_id':'-1'})
				 return fasle;
			}
			if (!isLt3M) {
				this.$message.error('上传图片大小不能超过 3MB!');
				this.operCardList=[]
				this.$extend(sform,{'opercard_id':'-1'})
			}
			return isTypeRight && isLt3M;
		},
		changeBusLicList:function(file,fileList){
			 this.busLicList=fileList.splice(-1)
		},
		changeAccOpenList:function(file,fileList){
			 this.accOpenList=fileList.splice(-1)
		},
		changeOperIdentList:function(file,fileList){
			 this.operIdentList=fileList.splice(-1)
		},
		changeOperIdentList2:function(file,fileList){
			 this.operIdentList2=fileList.splice(-1)
		},
		changeOperCardList:function(file,fileList){
			this.operCardList=fileList.splice(-1)
		},
		setBusLicId:function(response, file){
			var sform = this.form
			if(response.state){
				this.$extend(sform,{'buslic_id':response.file_id})
				console.log(sform.buslic_id);
			}else{
				 //上传失败
				this.$extend(sform,{'buslic_id':''})
				this.$message.error('上传失败,请重新上传!');
			}
		},
		delBusLicId:function(response, file){
			var sform = this.form
			this.$extend(sform,{'buslic_id':''})
			console.log(sform.buslic_id);
		},
		setAccOpenId:function(response, file){
			//console.log(response.file_id)
			var sform = this.form
			if(response.state){
				this.$extend(sform,{'accopen_id':response.file_id})
			}else{
				 //上传失败
				this.$extend(sform,{'accopen_id':''})
				this.$message.error('上传失败,请重新上传!');
			}
		},
		delAccOpenId:function(response, file){
			var sform = this.form
			this.$extend(sform,{'accopen_id':''})
			console.log(sform.accopen_id);
		},
		setOperIdentId:function(response, file){
			//console.log(response.file_id)
			var sform = this.form
			if(response.state){
				this.$extend(sform,{'operident_id':response.file_id})
			}else{
				 //上传失败
				this.$extend(sform,{'operident_id':''})
				this.$message.error('上传失败,请重新上传!');
			}
		},
		delOperIdentId:function(response, file){
			var sform = this.form
			this.$extend(sform,{'operident_id':''})
			console.log(sform.accopen_id);
		},
		setOperIdentId2:function(response, file){
			//console.log(response.file_id)
			var sform = this.form
			if(response.state){
				this.$extend(sform,{'operident_id2':response.file_id})
			}else{
				 //上传失败
				this.$extend(sform,{'operident_id2':''})
				this.$message.error('上传失败,请重新上传!');
			}
		},
		delOperIdentId2:function(response, file){
			var sform = this.form
			this.$extend(sform,{'operident_id2':''})
			console.log(sform.accopen_id2);
		},
		setOperCardId:function(response, file){
			//console.log(response.file_id)
			var sform = this.form
			if(response.state){
				this.$extend(sform,{'opercard_id':response.file_id})
			}else{
				 //上传失败
				this.$extend(sform,{'opercard_id':''})
				this.$message.error('上传失败,请重新上传!');
			}
		},
		delOperCardId:function(response, file){
			var sform = this.form
			this.$extend(sform,{'opercard_id':''})
			console.log(sform.opercard_id);
		},
		submitCHeck:function(showVerifyCode){
			if(this.form.type==0){
				this.rules=this.companyrules
			}else{
				this.rules=this.operrules
			}	
			setTimeout(()=>{
					var vm = this
					console.log(vm.form)
					//单独验证图片
					if(this.form.type=='0'){
						if(this.form.buslic_id==null || this.form.buslic_id=='' || this.form.buslic_id=='-1'){
							vm.$message({
								message: '请上传营业执照图片!',
								type: 'error',
								duration:2000
							})
							return 
						}					
						if(this.form.accopen_id==null || this.form.accopen_id=='' || this.form.accopen_id=='-1'){
							vm.$message({
								message: '请上传开户许可证图片!',
								type: 'error',
								duration:2000
							})
							return
						}
					}else if(this.form.type=='1'){
						if(this.form.operident_id==null || this.form.operident_id=='' || this.form.operident_id=='-1'){
							vm.$message({
								message: '请上传正面管理员身份证图片!',
								type: 'error',
								duration:2000
							})
							return 
						}					
						if(this.form.operident_id2==null || this.form.operident_id2=='' || this.form.operident_id2=='-1'){
							vm.$message({
								message: '请上传反面管理员身份证图片!',
								type: 'error',
								duration:2000
							})
							return
						}
						if(this.form.opercard_id==null || this.form.opercard_id=='' || this.form.opercard_id=='-1'){
							vm.$message({
								message: '请上传管理员银行卡图片!',
								type: 'error',
								duration:2000
							})
							return 
						}					
					}
					this.$refs.form.validate((valid)=>{
						console.log(">>>>>>>>>>>>>结果"+valid)
						if(valid){//显示获取验证码
						    if(showVerifyCode && vm.showVerifyCode){
								this.codeVisible = true;
								this.codeBtn = false;
								this.getpass.code='';
							}else{
								vm.submitComponent();
							}
						}
					})

				},0)
			
		},
		verifyCode(){//验证验证码
			var vm = this
			if(this.getpass.code==null||this.getpass.code==''){
				vm.$message({
						message: '请输入验证码!',
						type: 'error',
						duration:2000
				})
				return
			}
			var win = window
			var params = {'token':sessionStorage.getItem('token'),'code':this.getpass.code,'mobile':this.getpass.allMobile}
			this.$post(path+'/user/verifycode',params,function(result){
			var ret = JSON.parse(result)
			if(ret.state==1){
				vm.codeVisible = false
				//ok
				vm.submitComponent();
			}else{
				//验证码错误
				vm.$message({
					message: '验证码错误!',
					type: 'error',
					duration:2000
				});
			}
			})
		},
		getCode(){
			//获取验证码
			var params = {'token':sessionStorage.getItem('token'),'mobile':this.getpass.allMobile}
			var vm = this
			var win = window
			this.$post(path+'/user/getcode',params,function(result){
				var ret = JSON.parse(result)
				if(ret.state==0){
					//失败
					vm.$message({
						message: '网络异常,验证码发送失败!',
						type: 'warning',
						duration:2000
					});
				}else{
					vm.$message({
						message: '验证码发送成功!',
						type: 'success',
						duration:2000
					});
					vm.codeBtn = true
				}
			})
		},
        submitComponent() {
			//console.log("执行次数>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
			if(this!=null && typeof(this) != "undefined"){
				this.submitComponentInfo()
			}else{
				setTimeout(()=>{
					this.submitComponent()
				}, 200)
			}
        },
		submitComponentInfo(){
			var vm = this
			var sform = this.form
			//设置城市显示名称
			if(this.form.city == null || this.form.city == ''){
				var cityItem = vm.citylist.find(item => {return item.value_no === this.form.bank_city;});
				this.form.city=cityItem.value_name
			}
			//设置银行显示名称
			if(vm.form.bank_no!='-1'){
				var bankItem = vm.banklist.find(item => {return item.value_no === this.form.bank_no;});
				this.form.bank_name=bankItem.value_name
			}
			this.$extend(sform,{'token':sessionStorage.getItem('token'),'com_id':sessionStorage.getItem('component_comid')})
			console.log(sform)
			vm.$.post(path+'/park/savecomponent',sform,function(ret){
				if(ret.state==1){
					vm.$message({
						showClose: true,
						message: vm.message,
						type: 'success',
						duration: 2000,
						onClose:function(){
							// vm.active=sessionStorage.getItem('component_fromPath');
							// vm.$router.push(sessionStorage.getItem('component_fromPath'));
							window.history.back();
						}
					});
				}else {
					vm.$message({
						showClose: true,
						message: '提交失败，请稍后重试',
						type: 'error',
						duration: 2000,
						onClose:function(){
							// vm.active=sessionStorage.getItem('component_fromPath');
							// vm.$router.push(sessionStorage.getItem('component_fromPath'));
							window.history.back();
						}
					});
					}
			},"json");	
		},
		getUserInfo(platformid,roleid){
			//console.log(platformid)
			//console.log(roleid)
			var vm = this
			var params = {'token':sessionStorage.getItem('token'),'platform_id':platformid,'user_type':roleid}
			this.$.ajax({
				url:path+'/user/admin',
				type:'POST',
				data:params,
				async:false,
				success:function(result){
					var ret = eval('('+result+')')
					vm.userinfo = ret[0]
					vm.getpass.mobile = vm.userinfo.mobile
					vm.getpass.allMobile = vm.userinfo.allMobile
					//console.log(vm.getpass)
				}
			})
      	},
		backUpPage:function(){
			// this.active=sessionStorage.getItem('component_fromPath');
			// this.$router.push(sessionStorage.getItem('component_fromPath'));
			window.history.back();
		},
		clickImg(e) {
			var newWin  = window.open()
			newWin.location.href = e.currentTarget.src;
		}
    },
	mounted(){
		var _this = this
		//查询省份列表
		this.$post(path+'/getdata/getprovincelist',function(ret){
				_this.provincelist = ret
				console.log(ret)
		})
	},
	created(){

		
		
	},
	activated(){
		this.showHeight = (common.gwh()-135)+"px"
		console.log(">>>>>高度："+this.showHeight)
		var vm=this
		//获取银行信息
		this.axios.all([common.getBankInfo()])
			.then(vm.axios.spread(function(bankinfo){
				vm.banklist=bankinfo.data
				var arr  =
						{"value_name" : "其它",
							"value_no" :"-1"}
				vm.banklist.push(arr);
				console.log(vm.banklist)
			}))
		//获取登陆用户信息
		var user = sessionStorage.getItem('user')
		user = JSON.parse(user)
		this.roleid = user.roleid
		let  platformid = ''
		if(user.roleid=='1'){
			platformid = 10001
			
		}else if(user.roleid=='4'){
			platformid = user.comid
			//获取密保手机号
			this.getUserInfo(platformid,user.roleid);	
		}else if(user.roleid=='2'){
			platformid = user.unionid
			//获取密保手机号
			this.getUserInfo(sessionStorage.getItem('component_comid'),4);	
		}
		//初始化进件展示页面
		vm.showReview=false,
		vm.showEdit=false,
		vm.showVerifyCode=false,
		vm.buslicPath='',
		vm.accopenPath='',
		vm.operidentPath='',
		vm.operidentPath2='',
		vm.opercardPath='',
		vm.busLicList=[],
		vm.accOpenList=[],
		vm.operIdentList=[],
		vm.operIdentList2=[],
		vm.operCardList=[],
		vm.form = {
				type:'0',
				company_name: '',
				buslic_no: '',
				taxregi_no: '',
				legalper_name: '',
				legalper_no: '',
				bank_name: '',
				bank_no: '',
				card_number:'',
				name:'',
				bank_province:'',
				bank_city:'',
				buslic_id:'',
				accopen_id:'',
				operator_name:'',
				operator_no:'',
				operident_id:'',
				operident_id2:'',
				opercard_id:'',
				state:'',
				review_remark:'',
				city:'',
				isReviewOrEdit:'0',
			}	
		//获取车场已提交的进件资料
		var params = {'token':sessionStorage.getItem('token'),'com_id':sessionStorage.getItem('component_comid')}
		this.$.ajax({
			url:path+'/park/querycomponent',
			type:'POST',
			data:params,
			async:false,
			success:function(result){
				var ret = eval('('+result+')')
				if(ret.state == '1'){
					//console.log(ret.data)
					vm.form = ret.data
					//设置主体
					if(vm.form.type==0){
						vm.form.type='0'
					}else{
						vm.form.type='1'
					}
					//查询城市列表
					vm.form.bank_city=ret.data.bank_city+""
					if(vm.form.bank_province>0){
						vm.$post(path+'/getdata/getcitylist',{ProID:vm.form.bank_province},function(ret){
							//vm.citylist = ret
							vm.citylist = [];
							for(var x in ret){
								let obj = {};
								obj["value_no"]=ret[x].cityID+"";
								obj["value_name"]=ret[x].name;
								vm.citylist.push(obj);
							}
							console.log(vm.citylist)
						})
					}
					if(vm.roleid=='2' || vm.roleid=='4'){
						if(vm.form.state!=null && vm.form.state!='' && vm.form.state=='1'){
							vm.showVerifyCode = true;
						}
						vm.message='资料提交成功，提交资料将在两个工作日内审核完成'
						console.log(">>>>是否验证:"+vm.showVerifyCode)
					}else if(vm.roleid=='1'){
						vm.isSuperOper=true
						if(vm.form.state=='2'){
							//显示审核状态
							vm.form.state='1'
							//显示审核备注
							vm.form.review_remark=''
							vm.showReview=true
							vm.message='审核完成'
							//审核或者编辑的标记，提交给后台
							vm.form.isReviewOrEdit=1
						}else if(vm.form.state=='1'){
							vm.showEdit = true
							vm.message='修改成功'
							//审核或者编辑的标记，提交给后台
							vm.form.isReviewOrEdit=2
						}	
					}
					//营业执照图片列表
					if(ret.data.buslic_id!=null && ret.data.buslic_id!=-1){
						vm.buslicPath = path+'/upload/getimage?file_id='+ret.data.buslic_id+"&token="+sessionStorage.getItem('token')
						vm.busLicList=[{name:ret.data.buslic_name,url:vm.buslicPath}]
					}
					//开户许可证图片列表
					if(ret.data.accopen_id!=null && ret.data.accopen_id!=-1){
						vm.accopenPath = path+'/upload/getimage?file_id='+ret.data.accopen_id+"&token="+sessionStorage.getItem('token')
						vm.accOpenList=[{name:ret.data.accopen_name,url:vm.accopenPath}]
					}
					//管理员身份证图片列表
					if(ret.data.operident_id!=null && ret.data.operident_id!=-1){
						vm.operidentPath = path+'/upload/getimage?file_id='+ret.data.operident_id+"&token="+sessionStorage.getItem('token')
						vm.operIdentList=[{name:ret.data.operident_name,url:vm.operidentPath}]
					}
					if(ret.data.operident_id2!=null && ret.data.operident_id2!=-1){
						vm.operidentPath2 = path+'/upload/getimage?file_id='+ret.data.operident_id2+"&token="+sessionStorage.getItem('token')
						vm.operIdentList2=[{name:ret.data.operident_name2,url:vm.operidentPath2}]
					}
					//银行卡图片列表
					if(ret.data.opercard_id!=null && ret.data.opercard_id!=-1){
						vm.opercardPath = path+'/upload/getimage?file_id='+ret.data.opercard_id+"&token="+sessionStorage.getItem('token')
						vm.operCardList=[{name:ret.data.opercard_name,url:vm.opercardPath}]	
					}
				}
			}
		})
	},
		
}
</script>