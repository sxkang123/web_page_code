<template>
	<section>
    <div style="margin-top:10px;margin-bottom:10px;margin-left:5px;display:none">
      <div style="float:left;margin-right:10px;font-size:15px">对接模式</div>
      <el-switch
        v-model="dockingType"
        on-color="#13ce66"
        off-color="#20A0FF"
        on-text="SDK"
        off-text="API"
        on-value="0"
        off-value="1"
        @change="changeDockingType">
      </el-switch>
      <span>说明:两种对接模式二选一</span>
    </div>
    <div style="margin-top:15px;display:none">
      <div>
        <el-input placeholder="请填写获取进场图片地址" v-model="inparkImage" style="width:600px;">
          <template slot="prepend"><span style="color:black">获取进场图片URL:</span></template>
        </el-input>
        <el-button type="primary" size="small">修改</el-button>
      </div>
    </div>
    <br>
		<!--账号信息-->
		<el-card class="box-card">
		<common-table 
			:queryapi="queryapi" 
			:editapi="editapi" 
      :addapi="addapi"
      :delapi="delapi"
			:tableheight="tableheight"
			:fieldsstr="fieldsstr"
			:tableitems="tableitems"
			:editFormRules="editFormRules"
			:btswidth="btswidth"
			:show-right="showRight"
			:hide-search="hideSearch"
			:hide-export="hideExport"
			:addtitle="addtitle"
      :addfailmsg="addfailmsg"
			:show-left-title="showLeftTitle"
			:left-title="leftTitle"
      :dialogsize="dialogsize"
      :showdelete="showdelete"
      ref="dev"
			></common-table>
		</el-card>
		</br>
    
	</section>
</template>

<script>
import { path,checkURL,eventlist } from '../../../api/api';
import common from '../../../common/js/common'
import CommonTable from '../../../components/CommonTable'
import axios from 'axios'

export default {
  components:{
    CommonTable
  },
  data(){
    return{
      dockingType:'0',
      loading: false,
      showRight:true,
      hideSearch:true,
      hideExport:true,
      showLeftTitle:true,
      showdelete:true,
      aeventlist:'',
      inparkImage:'http://test.bolink.club/zld/carpicsup.do?action=getpic',
      dialogsize:'small',
      leftTitle:'回调地址管理',
      addtitle:'添加回调地址',
      addfailmsg:'添加失败!每类型地址只能添加一个',
      tableheight:'',
      queryapi:'/account/queryeventurl',
      editapi:'/account/editeventurl',
      addapi:'/account/addeventurl',
      delapi:'/account/deleventurl',
      btswidth:'106',
      fieldsstr:'id__etype__url__ctime',
      tableitems:[
        {hasSubs:false,subs:[
          {label:'编号',prop:'id',width:'90',type:'number',hidden:true,align:'center',},
				]},
        {hasSubs:false,subs:[
          {label:'事件类型',prop:'etype',width:'300',type:'selection',selectlist:eventlist,editable:false,addable:true,disable:true,unsortable:true,
            format:function(row){
                return common.nameformat(row,eventlist,'etype')
              }
            },
				]},
        {hasSubs:false,subs:[
          {label:'地址',prop:'url',type:'str',width:'484',editable:true,addable:true,unsortable:true,},
				]},
        {hasSubs:false,subs:[
          {label:'创建日期',prop:'ctime',width:'180',type:'date',align:'center',
            format:function(row){
                  return common.dateformat(row.ctime);
            }
          },
				]},
      ],
      editFormRules: {
					url: [
						{ required: true, validator:checkURL, trigger: 'blur' }
					],
					etype: [
						{ required: true, message: '请选择事件类型', trigger: 'change' }
					],
			},
    }  
  },
  mounted(){
      //获取该平台未填写的回调地址列表\
      var vm = this
      // this.$.getJSON(path+'/getdata/geteventlist',{'token':sessionStorage.getItem('token')},function(ret){
      //     vm.aeventlist=ret
      //     console.log(vm.aeventlist)
      // })
   
  },
  watch:{
     //aeventlist:function(val,oldVal){
     //  this.tableitems[1].subs[0].selectlist=val
     //}
  },
  methods: {
    //  changeDockingType(value){
    //     //改变对接模式
    //     var _this = this
    //     this.$confirm('修改对接模式会立刻使当前对接模式所有功能失效, 是否继续?', '提示', {
    //       confirmButtonText: '确定',
    //       cancelButtonText: '取消',
    //       type: 'warning'
    //     }).then(() => {
    //       this.$post(path+'/union/editdockingtype',{docking_type:value,token:sessionStorage.getItem('token')},function(ret){
    //         if(ret>0){
    //           //更新成功
    //           _this.$message({
    //             message: '修改成功!',
    //             type: 'success',
    //             duration: 600
    //           });
    //           if(value==0){
    //             //改为sdk
    //             _this.isApiUnion=false
    //           }else if(value==1){
    //             //改为api
    //             _this.isApiUnion=true
    //             _this.$refs['dev'].getTableData({})
    //           }
    //         }else{
    //           _this.$message({
    //             message: '修改失败!',
    //             type: 'error',
    //             duration: 2000
    //           });
    //         }
    //       })
    //     }).catch(() => {
    //       this.$message({
    //         type: 'info',
    //         message: '已取消修改'
    //       }); 
    //       if(value==0){
    //         _this.dockingType='1'
    //       }else if(value==1){
    //         _this.dockingType='0'
    //       }         
    //     });
    //   }
  },
  activated(){
      var _this = this
		  this.$refs['dev'].getTableData({})
      axios.all([common.getEventLists()])
        .then(axios.spread(function(event){
          _this.aeventlist=event.data
			}))
	}

}

</script>