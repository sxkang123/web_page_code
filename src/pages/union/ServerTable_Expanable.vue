<template>
    <section>

        <el-row style="margin-bottom:8px">
            <el-col :span="24" align="left">
                <el-col :span="18" align="left">
                    <el-button type="primary" size="small" @click="handleSearch" icon="search">高级查询
                    </el-button>
                    <el-tooltip class="item" effect="dark" content="导出内容为当前查询条件下开始时间一个月内的数据" placement="bottom">
                        <el-button type="primary" size="small" @click="handleExport"
                                   style="margin-left: 10px">导出
                        </el-button>
                    </el-tooltip>
                    <el-button type="primary" size="small" @click="handleAdd">{{addtitle}}</el-button>
                </el-col>
                <el-col :span="6" align="right">
                    <el-button @click="refresh" type="text" size="small">刷新&nbsp;&nbsp;</el-button>
                </el-col>
            </el-col>

        </el-row>
        <!--列表-->
        <el-table :data="table" border highlight-current-row style="width:100%;" :height="tableheight"
                  v-loading="loading" @sort-change="sortChange" :row-style="rowStyle">
            <!--子项折叠最终通过rowStyle实现。实际是项的显示/隐藏-->
            <el-table-column
                    align="center"
                    type="index"
                    width="83"
                    label=" "
                    fixed="left"
            >
            </el-table-column>
            <el-table-column label="操作" :width="btswidth" align="center" fixed="left">
                <template scope="scope">
                    <el-button size="small" type="text" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                </template>
            </el-table-column>

            <el-table-column v-for="(items, index) in tableitems" :key="items.subs[0].prop"
                             :label="items.subs[0].label" :align="items.subs[0].prop=='name'?'left':'center'"
                             min-width="50"
                             :width="items.subs[0].prop=='state'||items.subs[0].prop=='percent'||items.subs[0].prop=='tid'||items.subs[0].prop=='id'||items.subs[0].prop=='balance'?110:200"
                             v-if="items.subs[0].prop=='pid'?false:true"
                             :sortable="!items.subs[0].unsortable">
                <!--隐藏pid行，设置部分列宽度-->
                <template scope="scope">
                    <span v-if="(scope.row.children!=undefined&&scope.row.children.length>0||scope.row._parent)&&items.subs[0].prop=='name'"
                          v-for="(space, levelIndex) in scope.row._level" class="ms-tree-space"></span>
                    <!--子项前加空格，以突出层次结构-->
                    <i v-if="!scope.row._expanded&&scope.row.children!=undefined&&scope.row.children.length>0&&items.subs[0].prop=='name'"
                       class="el-icon-caret-right" aria-hidden="true" @click="toggle(scope.$index)"></i>
                    <i v-if="scope.row._expanded&&scope.row.children!=undefined&&scope.row.children.length>0&&items.subs[0].prop=='name'"
                       class="el-icon-caret-bottom" aria-hidden="true" @click="toggle(scope.$index)"></i>
                    <!--向下箭头和向右箭头。只有id列并且有子项的才显示-->
                    <span v-if="items.subs[0].type=='date'">{{common.dateformat(scope.row[items.subs[0].prop])}}</span>
                    <span v-else-if="items.subs[0].prop=='state'">{{common.stateformat(scope.row[items.subs[0].prop])}}</span>
                    <!--<span v-else-if="items.subs[0].prop=='name'" style="align:left">{{scope.row[items.subs[0].prop]}}</span>-->
                    <span v-else-if="items.subs[0].prop=='balance'">{{common.balanceformat(scope.row[items.subs[0].prop],this.percision)}}</span>
                    <el-button v-else-if="items.subs[0].prop=='percent'" size="small" type="text"
                               style="color: #0000ff;"
                               @click="handleShowEditPercent(scope.$index, scope.row)">{{scope.row[items.subs[0].prop]}}
                    </el-button>
                    <span v-else>{{scope.row[items.subs[0].prop]}}</span>
                    <!--不同列的表现形式、格式化-->
                </template>

            </el-table-column>

        </el-table>
        <!--工具条-->
        <el-col :span="24" align="bottom" style="margin-top:5px;margin-bottom:5px">
            <el-col :span="24" align="right">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                               :current-page="currentPage" :page-sizes="[20, 40, 80]" :page-size="pageSize"
                               layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
            </el-col>
        </el-col>
        <!--高级查询-->
        <complex-search
                :searchVisible="searchFormVisible"
                :title="searchtitle"
                :searchitems="tableitems"
                v-on:searchdialog="closesearch"
                v-on:search="onSearch"
                ref="search">
        </complex-search>
        <!--表格添加-->
        <add-form
                :addtitle="addtitle"
                :addVisible="addFormVisible"
                :addloading="addloading"
                :additems="tableitems"
                :addFormRules="addFormRules"
                v-on:adddialog="closeadd"
                v-on:add="onAdd"
                :ref="af">
        </add-form>
        <!--表格编辑-->
        <edit-form
                :editVisible="editFormVisible"
                :edititems="tableitems"
                :editloading="editloading"
                :editFormRules="editFormRules"
                :rowdata="rowdata"
                v-on:editdialog="closeedit"
                v-on:edit="onEdit"
                :ref="ef">
        </edit-form>
        <el-dialog title="分润比例调整"
                   v-model="showEditPercent"
                   size="tiny"
        >
            <div style="margin-left:50px;vertical-align:middle;">
                <span>填写分润比例：</span>
                <el-input v-model="setpercent.percent" style="width:150px"></el-input>
                <span>(最高{{maxPercent}})</span>
            </div>
            <span slot="footer" class="dialog-footer">
				<el-button @click="showEditPercent = false" size="small">取 消</el-button>
				<el-button type="primary" @click="handleEditPercent" size="small">确 定</el-button>
			</span>
        </el-dialog>
    </section>

</template>

<script>
    import {path, stateitems, checkPhone, phonewidth, percision} from '../../api/api';
    import common from '../../common/js/common'
    import dataTranslate from '../../common/js/dataTranslate'
    import ComplexSearch from '../../components/ComplexSearch'
    import EditForm from '../../components/EditForm'
    import AddForm from '../../components/AddForm'

    export default {
        components: {
            ComplexSearch, EditForm, AddForm
        },
        props: {
            // 该属性是确认父组件传过来的数据是否已经是树形结构了，如果是，则不需要进行树形格式化
            treeStructure: {
                type: Boolean,
                default: function () {
                    return false
                }
            },
            // 是否默认展开所有树
            defaultExpandAll: {
                type: Boolean,
                default: function () {
                    return true
                }
            }
        },
        data() {
            return {
                ef: 'editref',
                af: 'addref',
                searchFormVisible: false,
                addFormVisible: false,
                addLoading: false,
                editFormVisible: false,
                editloading: false,

                loading: false,
                hideAdd: true,
                tableheight: '',
                queryapi: '/server/query',
                editapi: '/server/edit',
                exportapi: '/server/export',
                addapi: '/server/add',
                btswidth: '70',
                fieldsstr: 'id__name__phone__area__ctime__utime__state__balance',
                tableitems: [
                    {
                        hasSubs: false, subs: [
                            {
                                label: '编号',
                                prop: 'id',
                                width: '120',
                                type: 'number',
                                editable: false,
                                searchable: true,
                                align: 'center',
                            },
                        ]
                    },
                    {
                        hasSubs: false, subs: [
                            {
                                label: '名称',
                                prop: 'name',
                                width: '260',
                                type: 'str',
                                editable: true,
                                searchable: true,
                                unsortable: true,
                                addable: true,
                            },
                        ]
                    },
                    {
                        hasSubs: false, subs: [
                            {
                                label: '上级服务商',
                                prop: 'pid',
                                width: '120',
                                type: 'selection',
                                hidden: true,
                                selectlist: this.slist,
                                editable: false,
                                searchable: false,
                                addable: true,
                                unsortable: true,
                                format: (row) => {
                                    return common.nameformat(row, this.slist, 'pid')
                                }
                            },
                        ]
                    },
                    {
                        hasSubs: false, subs: [
                            {
                                label: '分润比例%',
                                prop: 'percent',
                                width: '140',
                                type: 'str',

                                unsortable: true,

                            },
                        ]
                    },
                    {
                        hasSubs: false, subs: [
                            {
                                label: '地址',
                                prop: 'area',
                                width: '300',
                                type: 'str',
                                editable: true,
                                searchable: true,
                                unsortable: true,
                                addable: true,
                            },
                        ]
                    },
                    {
                        hasSubs: false, subs: [
                            {
                                label: '联系电话',
                                prop: 'phone',
                                width: phonewidth,
                                type: 'str',
                                editable: true,
                                searchable: true,
                                unsortable: true,
                                addable: true,
                                align: 'center',
                            },
                        ]
                    },
                    {
                        hasSubs: false, subs: [
                            {
                                label: '新建日期',
                                prop: 'ctime',
                                width: '175',
                                type: 'date',
                                editable: false,
                                searchable: true,
                                align: 'center',
                                format: function (row) {
                                    return common.dateformat(row.ctime);
                                }
                            },
                        ]
                    },
                    {
                        hasSubs: false, subs: [
                            {
                                label: '修改日期',
                                prop: 'utime',
                                width: '175',
                                type: 'date',
                                editable: false,
                                searchable: true,
                                align: 'center',
                                format: function (row) {
                                    return common.dateformat(row.utime);
                                }
                            },
                        ]
                    },
                    {
                        hasSubs: false, subs: [
                            {
                                label: '状态',
                                prop: 'state',
                                width: '90',
                                type: 'selection',
                                selectlist: stateitems,
                                editable: true,
                                searchable: true,
                                addable: true,
                                align: 'center',
                                format: function (row) {
                                    return common.stateformat(row.state)
                                }
                            },
                        ]
                    },
                    {
                        hasSubs: false, subs: [
                            {
                                label: '余额',
                                prop: 'balance',
                                width: '150',
                                type: 'number',
                                editable: false,
                                searchable: true,
                                align: 'center',
                                format: function (row) {
                                    return common.balanceformat(row.balance, percision)
                                }
                            },
                        ]
                    },
                    {
                        hasSubs: false, subs: [
                            {
                                label: '管理员账号',
                                prop: 'tid',
                                width: '120',
                                type: 'str',
                                editable: false,
                                searchable: false,
                                unsortable: true,
                                align: 'center',
                            },
                        ]
                    },
                ],
                searchtitle: '查询服务商',
                addtitle: '注册服务商',
                editFormRules: {
                    name: [
                        {required: true, message: '请输入服务商名称', trigger: 'blur'}
                    ],
                    phone: [
                        {validator: checkPhone, required: true, trigger: 'blur'}
                    ],
                    area: [
                        {required: true, message: '请输入地址', trigger: 'blur'}
                    ],
                    state: [
                        {required: true, message: '请选择状态', trigger: 'change'}
                    ],
                },
                addFormRules: {
                    name: [
                        {required: true, message: '请输入服务商名称', trigger: 'blur'}
                    ],
                    pid: [
                        {required: true, trigger: 'change', message: '请选择上级服务商'}
                    ],
                    phone: [
                        {validator: checkPhone, required: true, trigger: 'blur'}
                    ],
                    area: [
                        {required: true, message: '请输入地址', trigger: 'blur'}
                    ],
                    state: [
                        {required: true, message: '请选择状态', trigger: 'change'}
                    ],
                },
                table: [],
                pageSize: 20,
                currentPage: 1,
                orderby: 'desc',
                orderfield: 'id',
                orderby: 'desc',
                sform: {},
                loading: false,
                rowdata: {},
                total: 0,
                slist: '',
                showEditPercent: false,
                currentIndex: 0,
                currentRow: {},
                setpercent: {
                    percent: '',
                    id: '',
                },
                maxPercent: 85,
                minPercent: 85,
                addloading: false,
            }
        },
        methods: {
            //分页变动
            handleSizeChange(val) {
                this.pageSize = val;
                console.log('size change')
                this.getTableData(this.sform);
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                console.log('page change')
                this.sform.date = this.searchDate
                this.getTableData(this.sform);
            },
            //排序变动
            sortChange(val) {
                if (val.order != null && val.order.substring(0, 1) == "a") {
                    this.orderby = "asc";
                } else {
                    this.orderby = "desc";
                }
                this.orderfield = val.prop;
                console.log('sort change')
                this.getTableData(this.sform);
            },
            onSearch: function (sform) {
                //在这里得到表单项,提交查询
                this.sform = sform
                this.getTableData(sform)
            },
            closesearch: function (val) {
                this.searchFormVisible = val;
            },
            getTableData(sform) {
                // console.log('getdata')
                let vm = this;
                this.loading = true;
                var api = this.queryapi;
                //alert(sform);
                this.$extend(sform, {'rp': this.pageSize})
                this.$extend(sform, {'page': this.currentPage})
                this.$extend(sform, {'orderby': this.orderby})
                this.$extend(sform, {'orderfield': this.orderfield})
                this.$extend(sform, {'fieldsstr': this.fieldsstr})
                this.$extend(sform, {'token': sessionStorage.getItem('token')})
                vm.$post(path + api, sform, function (ret) {
                    if (ret.validate != 'undefined' && ret.validate == '0') {
                        vm.loading = false;
                        //未携带令牌.重新登录
                        setTimeout(() => {
                            vm.alertInfo('未携带令牌,请重新登录!')
                        }, 150)
                    } else if (ret.validate != 'undefined' && ret.validate == '1') {
                        vm.loading = false;
                        //过期.重新登录
                        setTimeout(() => {
                            vm.alertInfo('登录过期,请重新登录!')
                        }, 150)
                    } else if (ret.validate != 'undefined' && ret.validate == '2') {
                        vm.loading = false;
                        //令牌无效.重新登录
                        setTimeout(() => {
                            vm.alertInfo('登录异常,请重新登录!')
                        }, 150)
                    } else {
                        console.log(ret)
                        vm.table = ret.rows;
                        vm.loading = false;
                        vm.total = ret.total;

                        // let extra = JSON.parse('{"id":800023,"name":"bbb","union_id":200002,"state":0,"ctime":1498466088,"utime":1503542710,"balance":0,"phone":"18200000000","area":"dd","mobile":"","webank_wallet_id":null,"pid":0,"tid":10192,"parentId":0,\n' +
                        //     '"children":[{"id":800086,"name":"ddd","union_id":200002,"state":1,"ctime":1520307715,"utime":1520307715,"balance":0,"phone":"13788888888","area":"ddd","mobile":null,"webank_wallet_id":null,"pid":800023,"children":[],"parentId":800023},\n' +
                        //     '{"id":800085,"name":"ccc","union_id":200002,"state":1,"ctime":1520307093,"utime":1520307552,"balance":0,"phone":"18010001111","area":"ccc","mobile":"","webank_wallet_id":null,"pid":800023,\n' +
                        //     '"children":[{"id":800087,"name":"eee","union_id":200002,"state":1,"ctime":1520310949,"utime":1520310949,"balance":0,"phone":"15809999999","area":"eee","mobile":null,"webank_wallet_id":null,"pid":800085,"children":[],"parentId":800085}],\n' +
                        //     '"parentId":800023}]}');
                        //
                        // vm.table.push(extra)

                        vm.table = dataTranslate.treeToArray(vm.table, null, null, vm.defaultExpandAll)
                        console.log(vm.table)

                    }
                }, "json");
            },
            //高级查询
            handleSearch() {
                //弹出高级查询界面
                //全平台服务商
                var vm = this
                var user = sessionStorage.getItem('user')
                user = JSON.parse(user)
                this.searchFormVisible = true;
            },
            handleAdd() {
                var vm = this
                var user = sessionStorage.getItem('user')
                user = JSON.parse(user)
                this.addFormVisible = true
            },
            closeadd(val) {
                this.addFormVisible = val
                this.addLoading = val;
            },
            onAdd(aform) {
                console.log(aform)
                //发送请求,添加一条记录
                var vm = this;
                var api = this.addapi;
                var qform = this.sform;
                var msg = '添加失败';
                vm.addloading = true;
                this.$extend(aform, {'token': sessionStorage.getItem('token')})
                this.$refs.addref.$refs.addForm.validate((valid) => {

                    if (valid) {
                        vm.$post(path + api, aform, function (ret) {
                            if (ret.validate != 'undefined' && ret.validate == '1') {
                                //过期.重新登录
                                setTimeout(() => {
                                    vm.alertInfo('登录过期,请重新登录!')
                                }, 100)
                            } else if (ret.validate != 'undefined' && ret.validate == '2') {
                                //令牌无效.重新登录
                                setTimeout(() => {
                                    vm.alertInfo('登录异常,请重新登录!')
                                }, 100)
                            } else {
                                if (ret > 0) {
                                    //更新成功
                                    vm.getTableData(qform);
                                    vm.$message({
                                        message: '添加成功!',
                                        type: 'success',
                                        duration: 600
                                    });
                                    vm.addFormVisible = false;
                                    vm.addloading = false;

                                    vm.axios.all([common.getServerList()])
                                        .then(vm.axios.spread(function (sevlist) {
                                            vm.slist = sevlist.data
                                        }))

                                } else {
                                    //更新失败
                                    vm.$message({
                                        message: msg,
                                        type: 'error',
                                        duration: 1200
                                    });
                                }
                            }

                        }, "json")
                    } else {
                        vm.addloading = false;
                    }
                });

            },
            //表格编辑
            handleEdit(index, row) {
                //拿到当前行数据row,传递给表单编辑子组件,子组建中包括重置和保存按钮
                this.rowdata = row;
                //获取角色编号,获取rowid,
                this.editFormVisible = true;
            },
            closeedit: function (val) {
                this.editFormVisible = val
                this.editloading = val
            },
            onEdit: function (eform) {
                //发送ajax,提交表单更新
                let vm = this;
                var api = this.editapi;
                var qform = this.sform;
                this.$extend(eform, {'token': sessionStorage.getItem('token')})
                this.$refs.editref.$refs.editForm.validate((valid) => {
                    if (valid) {
                        vm.editloading = true;
                        vm.$post(path + api, eform, function (ret) {
                            if (ret.validate != 'undefined' && ret.validate == '1') {
                                //过期.重新登录
                                setTimeout(() => {
                                    vm.alertInfo('登录过期,请重新登录!')
                                }, 100)
                            } else if (ret.validate != 'undefined' && ret.validate == '2') {
                                //令牌无效.重新登录
                                setTimeout(() => {
                                    vm.alertInfo('登录异常,请重新登录!')
                                }, 100)
                            } else {
                                if (ret > 0) {
                                    //更新成功
                                    vm.getTableData(qform);
                                    vm.$message({
                                        message: '更新成功!',
                                        type: 'success',
                                        duration: 600
                                    });
                                    vm.editFormVisible = false;

                                    vm.axios.all([common.getServerList()])
                                        .then(vm.axios.spread(function (sevlist) {
                                            vm.slist = sevlist.data
                                        }))

                                } else {
                                    //更新失败
                                    vm.$message({
                                        message: '更新失败!',
                                        type: 'error',
                                        duration: 600
                                    });
                                }
                                setTimeout('this.editloading=false', 5000)
                            }

                        }, "json")
                    }
                });
            },
            //导出表格数据
            handleExport() {
                var vm = this;
                var api = this.exportapi;
                var params = ''
                console.log(this.showdateSelector);
                if (common.getLength(this.sform) == 0 || this.showdateSelector || this.showanalysisdate) {
                    params = 'fieldsstr=' + this.fieldsstr + '&token=' + sessionStorage.getItem('token');//
                    if (this.showanalysisdate) {
                        if (this.analysisdate instanceof Date)
                            params += '&date=' + this.analysisdate.getTime();
                    } else if (this.showdateSelector) {
                        params += '&date=' + this.searchDate.replace("至", "|");
                    }
                } else {
                    for (var x in this.sform) {
                        //console.log(this.sform[x])

                        params += x + '=' + encodeURI(encodeURI(this.sform[x])) + '&'
                    }
                }
                // console.log(params)
                window.open(path + api + '?' + params);
            },
            //刷新页面
            refresh() {
                this.getTableData(this.sform);
                //清空高级查询表单项内容
                this.$message({
                    message: '刷新成功!',
                    type: 'success',
                    duration: 600
                });
            },
            alertInfo(msg) {
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
            rowStyle(row, rowIndex) {
                let show = (row._parent ? (row._parent._expanded && row._parent._show) : true)
                row._show = show
                return show ? '' : 'display:none;'
            },
            // 点击展开和关闭的时候，图标的切换
            toggleIconShow(index, record) {
                let me = this
                if (me.treeStructure && index === 0 && record.children && record.children.length > 0) {
                    return true
                }
                return false
            },
            // 展开下级
            toggle: function (trIndex) {
                let me = this
                let record = me.table[trIndex]
                console.log(trIndex + '>>>')
                console.log(record)
                record._expanded = !record._expanded
            },
            // 显示层级关系的空格和图标
            spaceIconShow(index) {
                let me = this
                if (me.treeStructure && index === 0) {
                    return true
                }
                return false
            },
            tableColunmWidth(items) {
                let prop = items.subs[0].prop;
                let width = 160;
                switch (prop) {
                    case 'state' || 'percent':
                        width = 100;
                        break;
                    case 'utime' || 'ctime':
                        width = 180;
                    default:
                        break;
                }
                return width;
                // :width="items.subs[0].prop=='state'||items.subs[0].prop=='percent'?100:160"
            },
            handleShowEditPercent(index, row) {
                // console.log('--------------')
                this.showEditPercent = true;
                this.currentIndex = index;
                this.currentRow = row;
                let vm = this;
                if (vm.currentRow._parent) {
                    for (let item of vm.table) {
                        if (vm.currentRow.pid == item.id) {

                            vm.maxPercent = item.percent;
                        }
                    }
                } else {
                    vm.maxPercent = '85';
                }
                let first = true;
                if (vm.currentRow.children && vm.currentRow.children.length > 0) {
                    for (let item of vm.table) {
                        if (vm.currentRow.id == item.pid) {
                            if (first) {
                                vm.minPercent = item.percent;
                                first = false;
                            }

                            if (vm.minPercent < item.percent) {
                                vm.minPercent = item.percent;
                            }
                        }
                    }
                } else {
                    console.log('------------------')
                    vm.minPercent = 0;
                }
                vm.setpercent.percent = row.percent;

            },
            handleEditPercent() {
                let vm = this;
                if (!common.numberCheck(vm.setpercent.percent)) {
                    vm.$message({
                        message: '数据格式错误!',
                        type: 'error',
                        duration: 600
                    });
                    return;
                } else {
                    if (vm.setpercent.percent > vm.maxPercent) {
                        vm.$message({
                            message: '不可超过父级百分比!',
                            type: 'error',
                            duration: 600
                        });
                        return;
                    }
                    if (vm.setpercent.percent < vm.minPercent) {
                        vm.$message({
                            message: '不可低于子级百分比!',
                            type: 'error',
                            duration: 600
                        });
                        return;
                    }
                    if (vm.setpercent.percent > 85) {
                        vm.$message({
                            message: '最大比例为85!',
                            type: 'error',
                            duration: 600
                        });
                        return;
                    }
                    vm.setpercent.id = vm.currentRow.id;
                }

                var api = '/server/setpercent';
                var qform = this.setpercent;
                this.$extend(qform, {'token': sessionStorage.getItem('token')})
                vm.$post(path + api, qform, function (ret) {
                    if (ret.validate != 'undefined' && ret.validate == '0') {
                        vm.loading = false;
                        //未携带令牌.重新登录
                        setTimeout(() => {
                            vm.alertInfo('未携带令牌,请重新登录!')
                        }, 150)
                    } else if (ret.validate != 'undefined' && ret.validate == '1') {
                        vm.loading = false;
                        //过期.重新登录
                        setTimeout(() => {
                            vm.alertInfo('登录过期,请重新登录!')
                        }, 150)
                    } else if (ret.validate != 'undefined' && ret.validate == '2') {
                        vm.loading = false;
                        //令牌无效.重新登录
                        setTimeout(() => {
                            vm.alertInfo('登录异常,请重新登录!')
                        }, 150)
                    } else {
                        // console.log(ret)
                        vm.loading = false;
                        vm.showEditPercent = false;
                        if (ret.result == 1) {
                            vm.getTableData(vm.sform);
                        } else {
                            vm.$message({
                                message: '请求错误!' + ret.errmsg,
                                type: 'error',
                                duration: 600
                            });
                        }

                    }

                }, "json");
            }
        },
        mounted() {
            window.onresize = () => {
                this.tableheight = common.gwh() - 135;
            }
            this.tableheight = common.gwh() - 135;


        },
        activated() {
            window.onresize = () => {
                this.tableheight = common.gwh() - 135;
            }
            this.tableheight = common.gwh() - 135;
            this.getTableData({});
            this.sform = {};
            let _this = this
            this.axios.all([common.getServerList()])
                .then(this.axios.spread(function (sevlist) {
                    _this.slist = sevlist.data
                }))
        },
        watch: {
            slist: function (val) {
                console.log('set sverlist')
                this.tableitems[2].subs[0].selectlist = val
            },
        }
    }

</script>
<style scoped>
    .ms-tree-space {
        position: relative;
        top: 1px;
        display: inline-block;
        font-family: 'Glyphicons Halflings';
        font-style: normal;
        font-weight: 400;
        line-height: 1;
        width: 18px;
        height: 14px;
    }

    .ms-tree-space::before {
        content: ""
    }
</style>