import Login from './pages/Login.vue'
import NotFound from './pages/404.vue'
import Home from './pages/Home.vue'
//泊链页面
import BolinkUnionTable from './pages/bolink/BolinkUnionTable.vue'
import BolinkServerTable from './pages/bolink/BolinkServerTable.vue'
import BolinkOperatorTable from './pages/bolink/BolinkOperatorTable.vue'
import BolinkParkTable from './pages/bolink/BolinkParkTable.vue'
import BolinkUserTable from './pages/bolink/BolinkUserTable.vue'
import BusinessTable from './pages/bolink/BusinessTable.vue'
import AnalysisTable from './pages/bolink/AnalysisTable.vue'
import ParkOverviewTable from './pages/bolink/ParkOverviewTable.vue'
import AnalysisTodayTable from './pages/bolink/AnalysisTodayTable.vue'
import PayExceptions from './pages/bolink/PayExceptions.vue'
import BlankcodeManageTable from './pages/bolink/BlankcodeManage.vue'
//车场页面
import ParkTradeTable from './pages/park/ParkTradeTable.vue'
import DailyTable from './pages/park/DailyTable.vue'
import ParkAccount from './pages/park/ParkAccount.vue'
import WithdrawTable from './pages/park/WithdrawTable.vue'
import CenterPayment from './pages/park/CenterPayment.vue'
import CenterPaymentAccount from './pages/park/CenterPaymentAccount.vue'
import ParkComponent from './pages/park/ParkComponent.vue'
//厂商平台页面
// import ServerTable from './pages/union/ServerTable.vue'
import ServerTable from './pages/union/ServerTable_Expanable.vue'
import OperatorTable from './pages/union/OperatorTable.vue'
import ParkTable from './pages/union/ParkTable.vue'
import UserTable from './pages/union/UserTable.vue'
import Order from './pages/union/trade/Order.vue'
import OrderTradeIn from './pages/union/trade/OrderTradeIn.vue'
import OrderTradeOut from './pages/union/trade/OrderTradeOut.vue'
import Query from './pages/union/trade/Query.vue'
import QueryTradeIn from './pages/union/trade/QueryTradeIn.vue'
import QueryTradeOut from './pages/union/trade/QueryTradeOut.vue'
import MoneyRecord from './pages/union/trade/MoneyRecord.vue'
import AccountInfo from './pages/union/account/AccountInfo.vue'
import Development from './pages/union/account/Development.vue'
//服务商页面
import ServerParkTable from './pages/server/ServerParkTable.vue'
//运营商页面
import OperatorParkTable from './pages/operator/OperatorParkTable.vue'
import OperatorDailyTable from './pages/operator/OperatorDailyTable.vue'
import OperatorAccount from './pages/operator/OperatorAccount.vue'
//公共页面
import Account from './pages/public/Account.vue'
import SecurityCenter from './pages/public/SecurityCenter.vue'
//tcp统计
import TcpIndex from './pages/tcp/index.vue'
import Profile from './pages/tcp/profile.vue'

//import Echarts from './pages/union/Echarts.vue'

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
        path: '/',
        component: Home,
        name: '泊链厂商平台',
        iconCls: 'el-icon-message',//图标样式class
        leaf: true,//只有一个节点
        children: [
            { path: '/bolinkunion', component: BolinkUnionTable, name: '泊链厂商平台' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '营销中心',
        iconCls: 'el-icon-message',//图标样式class
        leaf: true,//只有一个节点
        children: [
            { path: '/blankcodemanage', component: BlankcodeManageTable, name: '空白码管理' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '泊链服务商',
        iconCls: 'el-icon-message',//图标样式class
        leaf: true,//只有一个节点
        children: [
            { path: '/bolinkserver', component: BolinkServerTable, name: '泊链服务商' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '泊链运营商',
        iconCls: 'el-icon-message',//图标样式class
        leaf: true,//只有一个节点
        children: [
            { path: '/bolinkoperator', component: BolinkOperatorTable, name: '泊链运营商' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '泊链车场',
        iconCls: 'el-icon-message',//图标样式class
        leaf: true,//只有一个节点
        children: [
            { path: '/bolinkpark', component: BolinkParkTable, name: '泊链车场' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '泊链会员',
        iconCls: 'el-icon-message',//图标样式class
        leaf: true,//只有一个节点
        children: [
            { path: '/bolinkuser', component: BolinkUserTable, name: '泊链会员' }
        ]
    },
     {
        path: '/',
        component: Home,
        name: '合作商家管理',
        iconCls: 'el-icon-message',//图标样式class
        leaf: true,//只有一个节点
        children: [
            { path: '/bolinkbusiness', component:BusinessTable, name: '合作商家管理' }
        ]
    },
   
    {
        path: '/',
        component: Home,
        name: '服务商',
        iconCls: 'el-icon-message',//图标样式class
        leaf: true,//只有一个节点
        children: [
            { path: '/server', component: ServerTable, name: '服务商管理' }
        ]
    },

    {
        path: '/',
        component: Home,
        name: '运营商',
        iconCls: 'el-icon-message',//图标样式class
        leaf: true,//只有一个节点
        children: [
            { path: '/operator', component: OperatorTable, name: '运营商管理' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '我的账户',
        iconCls: 'el-icon-setting',
        children: [
            { path: '/analysisoverview', component: AnalysisTable , name: '总览' },
            { path: '/parkoverview', component: ParkOverviewTable , name: '车场总览' },
            { path: '/analystodayisoverview', component: AnalysisTodayTable , name: '今日总览' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '车场',
        iconCls: 'el-icon-date',
		    leaf: true,
        children: [
            { path: '/park', component: ParkTable, name: '车场管理' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '会员',
        iconCls: 'el-icon-upload',
        leaf: true,//只有一个节点
        children: [
            { path: '/user', component: UserTable, name: '会员管理' }
        ]
    },
	{
        path: '/',
        component: Home,
        name: '交易中心',
        iconCls: 'el-icon-document',
        children: [
                { path: '/order', component: Order, name: '定单交易',
                    children: [
                        { path: 'orderin', component: OrderTradeIn , name: '收入' },
                        { path: 'orderout', component: OrderTradeOut , name: '支出' }
                    ] },
      			{ path: '/query', component: Query, name: '车位查询' ,
                    children: [
                        { path: 'queryin', component:  QueryTradeIn , name: '收入' },
                        { path: 'queryout', component: QueryTradeOut , name: '支出' }
                    ] },
               { path: '/moneyrecord', component: MoneyRecord , name: '资金流水' },
               { path: '/opermoneyrecord', component: OrderTradeIn , name: '资金流水' },
        ]
    },
	{
        path: '/',
        component: Home,
        name: '我的账户',
        iconCls: 'el-icon-setting',
        children: [
            { path: '/accountinfo', component: AccountInfo , name: '基本信息' },
            { path: '/account', component: Account , name: '账户信息' },
            { path: '/operatoraccount', component: OperatorAccount , name: '账户信息' },
      		{ path: '/dev', component: Development , name: '开发配置' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '车场进件',
        iconCls: 'el-icon-message',//图标样式class
        leaf: true,//只有一个节点
        children: [
            { path: '/parkcomponent', component: ParkComponent, name: '车场进件' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '交易流水',
        iconCls: 'el-icon-message',//图标样式class
        leaf: true,//只有一个节点
        children: [
            { path: '/parktrade', component: ParkTradeTable, name: '交易流水' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '日报',
        iconCls: 'el-icon-message',//图标样式class
        leaf: true,//只有一个节点
        children: [
            { path: '/daily', component: DailyTable, name: '日报' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '日报',
        iconCls: 'el-icon-message',//图标样式class
        leaf: true,//只有一个节点
        children: [
            { path: '/operatordaily', component: OperatorDailyTable, name: '日报' }
        ]
    },
     {
        path: '/',
        component: Home,
        name: '我的账户',
        iconCls: 'el-icon-message',//图标样式class
        leaf: true,//只有一个节点
        children: [
            { path: '/parkaccount', component: ParkAccount, name: '日报' }
        ]
    },
     {
        path: '/',
        component: Home,
        name: '提现明细',
        iconCls: 'el-icon-message',//图标样式class
        leaf: true,//只有一个节点
        children: [
            { path: '/withdraws', component: WithdrawTable, name: '提现明细' }
        ]
    },
     {
        path: '/',
        component: Home,
        name: '车场管理',
        iconCls: 'el-icon-message',//图标样式class
        leaf: true,//只有一个节点
        children: [
            { path: '/serverpark', component: ServerParkTable, name: '车场管理' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '支付未记账',
        iconCls: 'el-icon-message',//图标样式class
        leaf: true,//只有一个节点
        children: [
            { path: '/payexceptions', component: PayExceptions, name: '车场管理' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '车场管理',
        iconCls: 'el-icon-message',//图标样式class
        leaf: true,//只有一个节点
        children: [
            { path: '/operatorpark', component: OperatorParkTable, name: '车场管理' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '自助缴费机',
        iconCls: 'el-icon-document',
        children: [
      			{ path: '/centerpayment', component: CenterPayment , name: '缴费机信息' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '自助缴费机',
        iconCls: 'el-icon-document',
        children: [
      			{ path: '/centerpaymentaccount', component: CenterPaymentAccount , name: '缴费机明细' },
        ]
    },
     {
        path: '/',
        component: Home,
        name: '安全中心',
        iconCls: 'el-icon-message',//图标样式class
        leaf: true,//只有一个节点
        children: [
            { path: '/securitycenter', component: SecurityCenter, name: '安全中心' }
        ]
    },
     {
        path: '/',
        component: Home,
        name: 'tcp',
        iconCls: 'el-icon-document',
        children: [
      			{ path: '/tcpindex', component: TcpIndex , name: 'tcp统计2' },
        ]
    },
     {
        path: '/',
        component: Home,
        name: 'tcp',
        iconCls: 'el-icon-document',
        children: [
            { path: '/tcpprofile', component: Profile , name: 'tcp统计2' },
        ]
    },
   /*
    {
        path: '/',
        component: Home,
        name: '控制台',
        iconCls: 'el-icon-menu',
        hidden:true,
        children: [
            { path: '/echarts1', component: Echarts, name: '收费趋势图' },
      			{ path: '/echarts2', component: Echarts, name: '车位利用率' },
      			{ path: '/echarts3', component: Echarts, name: '人员设备概况' },
        ]
    },
    */
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;
