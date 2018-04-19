//生成环境改为web,测试环境cms-web

// export const path="http://192.168.199.122/web"
export const path="https://beta.bolink.club/web"
// export const path="https://s.bolink.club:8443/web"



export const phonewidth='150'
//beta设置为5   s.bolink设置为2 
export const percision = 2

export const blankcodestate=[
          {'value_name':'全部状态','value_no':'-1'},
          {'value_name':'是','value_no':'1'},
          {'value_name':'否','value_no':'0'},
        ];

export const bgpiclist=[{'value_no':'2','value_name':'直付背景图'}];
export const stateitems=[
          {'value_name':'未审核','value_no':'0'},
          {'value_name':'已审核','value_no':'1'},
          {'value_name':'禁用','value_no':'2'},
          {'value_name':'已锁定','value_no':'3'},
        ];

export const excptions=[
    {'value_name':'未处理','value_no':'2'},
    {'value_name':'已处理','value_no':'3'},
];
export const accountitems=[
          {'value_name':'银行卡','value_no':'0'},
          {'value_name':'支付宝','value_no':'1'},
          {'value_name':'微信','value_no':'2'},
        ];

export const ynitems=[
          {'value_name':'否','value_no':'0'},
          {'value_name':'是','value_no':'1'},
        ];


export const centerpayset=[
          {'value_name':'车主扫码','value_no':'0'},
          {'value_name':'扫码窗','value_no':'1'},
        ];

export const belongitems=[
    {'value_name':'公司','value_no':'0'},
    {'value_name':'个人','value_no':'1'},
];

export const settleitems=[
          {'value_name':'转账','value_no':'0'},
          {'value_name':'现金','value_no':'1'},
        ];

export const carditems=[
          {'value_name':'禁用','value_no':'0'},
          {'value_name':'正常','value_no':'1'},
        ];
export const orderstate=[
    {'value_name':'请选择','value_no':'-1'},
    {'value_name':'已结算','value_no':'1'},
    {'value_name':'已预付','value_no':'2'},
    {'value_name':'已退款','value_no':'3'},
    {'value_name':'退款中','value_no':'4'},
];
export const dockingtypeitems=[
          // {'value_name':'SDK','value_no':'0'},
          // {'value_name':'HTTP','value_no':'1'},
          // {'value_name':'CLOUD','value_no':'2'},
    {'value_name':'车场','value_no':'0'},
    //{'value_name':'HTTP','value_no':'1'},
    {'value_name':'云平台','value_no':'2'},
        ];

export const cardtypeitems=[
          {'value_name':'借记卡','value_no':'0'},
          {'value_name':'信用卡','value_no':'1'},
          {'value_name':'非银行卡','value_no':'-1'},
        ];

//0：查询 1支付 2充值 3提现 4月卡续费 5通用支付

export const dtypelist=[
					{'value_no':'0','value_name':'余位调用'},
					{'value_no':'1','value_name':"交易订单"},
					{'value_no':'2','value_name':"充值"},
					{'value_no':'3','value_name':"提现"},
          {'value_no':'4','value_name':"月卡续费"},
          {'value_no':'5','value_name':"通用支付"},
          {'value_no':'6','value_name':"无感支付"}
				]

//0停车费收入 1提现 2月卡续费收入 3停车费支付手续费
export const parktypelist=[
					{'value_no':'0','value_name':'停车费电子收入'},
					{'value_no':'1','value_name':"提现"},
					{'value_no':'2','value_name':"月卡续费收入"},
					{'value_no':'3','value_name':"手续费"},
					{'value_no':'4','value_name':"电子找零"},
          {'value_no':'5','value_name':"通用支付"},
          {'value_no':'6','value_name':"电子找零"},
          {'value_no':'7','value_name':"退款"},
				]
export const addAccountState=[
    {'value_no':'0','value_name':'未提交'},
    {'value_no':'2','value_name':"待审核"},
    {'value_no':'3','value_name':"待补充"},
    {'value_no':'1','value_name':"审核完成"}
]
export const servertypelist=[
					{'value_no':'0','value_name':'余位调用'},
					{'value_no':'1','value_name':"交易订单"},
					{'value_no':'2','value_name':"充值"},
					{'value_no':'3','value_name':"提现"},
          {'value_no':'4','value_name':"月卡续费"},
          {'value_no':'5','value_name':"通用支付"}
				]

export const uniontypelist=[
					{'value_no':'0','value_name':'余位调用'},
					{'value_no':'1','value_name':"交易订单"},
					{'value_no':'2','value_name':"充值"},
					{'value_no':'3','value_name':"提现"},
          {'value_no':'4','value_name':"月卡续费"},
          {'value_no':'5','value_name':"缴费机话费充值"},
          {'value_no':'6','value_name':"通用支付"}
				]

export const eventlist=[
					{'value_no':'1','value_name':"车辆进场通知"},
					{'value_no':'2','value_name':"车辆出场通知"},
					{'value_no':'3','value_name':"查询订单实时金额通知"},
					{'value_no':'4','value_name':"新增车主，或车主修改、删除车牌号通知"},
					{'value_no':'5','value_name':"获取车场二维码"},
          {'value_no':'6','value_name':"预付订单通知"},
          {'value_no':'7','value_name':"预付订单回调通知"},
          {'value_no':'8','value_name':"订单结算待支付通知"},
          {'value_no':'9','value_name':"订单接待支付回调通知"},
          {'value_no':'10','value_name':"获取进场图片地址"},
          {'value_no':'11','value_name':"通用支付回调地址"},
          {'value_no':'12','value_name':"电子收费异步返回结果"},
          {'value_no':'13','value_name':"电子退款异步返回结果"},
          {'value_no':'14','value_name':"无牌车入场通知"},
        ]

export const provincelist=[
					{'value_no':'京','value_name':"京"},
					{'value_no':'沪','value_name':"沪"},
					{'value_no':'浙','value_name':"浙"},
					{'value_no':'粤','value_name':"粤"},
					{'value_no':'苏','value_name':"苏"},
					{'value_no':'鲁','value_name':"鲁"},
					{'value_no':'晋','value_name':"晋"},
					{'value_no':'吉','value_name':"吉"},
					{'value_no':'冀','value_name':"冀"},
					{'value_no':'豫','value_name':"豫"},
					{'value_no':'川','value_name':"川"},
					{'value_no':'渝','value_name':"渝"},
					{'value_no':'辽','value_name':"辽"},
					{'value_no':'黑','value_name':"黑"},
					{'value_no':'皖','value_name':"皖"},
					{'value_no':'鄂','value_name':"鄂"},
					{'value_no':'湘','value_name':"湘"},
					{'value_no':'赣','value_name':"赣"},
					{'value_no':'闽','value_name':"闽"},
					{'value_no':'陕','value_name':"陕"},
					{'value_no':'宁','value_name':"宁"},
					{'value_no':'蒙','value_name':"蒙"},
					{'value_no':'津','value_name':"津"},
					{'value_no':'桂','value_name':"桂"},
					{'value_no':'云','value_name':"云"},
					{'value_no':'贵','value_name':"贵"},
					{'value_no':'琼','value_name':"琼"},
					{'value_no':'青','value_name':"青"},
					{'value_no':'新','value_name':"新"},
					{'value_no':'藏','value_name':"藏"},
					{'value_no':'使','value_name':"使"},
        ]    

export const otypelist=[
					{'value_no':'0',"value_name":"收入"},{'value_no':'1',"value_name":"支出"}
				]

export const centralpaymenttypelist=[
					{'value_no':'0',"value_name":"投入"},{'value_no':'1',"value_name":"取出"}
				]

export const changetypelist=[
       {'value_no':'-1',"value_name":"-"}, 
       {'value_no':'0',"value_name":"无需找零"}, 
       {'value_no':'1',"value_name":"话费找零"},
       {'value_no':'2',"value_name":"客户拒收"},
       {'value_no':'3',"value_name":"话费直充"},
       {'value_no':'4',"value_name":"余额不足"},
       {'value_no':'5',"value_name":"红包充值"},
       {'value_no':'6',"value_name":"红包直充"}
]

export const paytypelist=[
    //{'value_no':'-1',"value_name":"-"},
    {'value_no':'0',"value_name":"主扫"},
    {'value_no':'1',"value_name":"被扫"},
    {'value_no':'2',"value_name":"免密"},
    {'value_no':'3',"value_name":"现金"},
    {'value_no':'4',"value_name":"公众号"}
]

export const paychannellist=[
    //{'value_no':'-1',"value_name":"-"},
    {'value_no':'0',"value_name":"微信"},
    {'value_no':'1',"value_name":"支付宝"},
    {'value_no':'2',"value_name":"余额"},
    {'value_no':'3',"value_name":"银联"}
]

export var checkPhone=(rule,value,callback)=>{
        if(typeof(value)=='undefined'||value==''){
          return callback(new Error('请输入正确的电话号码'))
        }else if(!((/^800[0-9]{7}$/.test(value))||(/^400[0-9]{7}$/.test(value))||(/^1[34578]\d{9}$/.test(value))||(/^(0[0-9]{2,3}\-)([2-9][0-9]{6,7})$/.test(value)))){
          return callback(new Error('请输入手机,座机(区号后加-),或400,800开头号码'))
				}else{
					callback()
				}
			}

export var checkMobile=(rule,value,callback)=>{
        if(typeof(value)=='undefined'||value==''){
          return callback(new Error('请输入正确的手机号码'))
        }else if(!((/^1[34578]\d{9}$/.test(value)))){
          return callback(new Error('请输入正确的手机号码'))
				}else{
					callback()
				}
			}

export var checkURL=(rule,value,callback)=>{
        if(typeof(value)=='undefined'||value==''){
          return callback(new Error('请输入地址'))
        }else if(!(/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/.test(value))){
          return callback(new Error('请输入正确的地址'))
        }else{
          callback()
        }
}

export var checkUpload=(rule,value,callback)=>{
        if(typeof(value)=='undefined'||value==''){
          return callback(new Error('请上传图片'))
        }else {
          return callback()
        }
}

export var checkNumber=(rule,value,callback)=>{
        if(typeof(value)=='undefined'||value==''){
          return callback(new Error('请输入权重'))
        }else if(!(/^[0-9]{1,2}$/.test(value))||value==0){
          return callback(new Error('权重值在1-99'))
        }else{
          callback()
        }
}

export var checkPass=(rule,value,callback)=>{
        if(!(/^(\w){6,12}$/.test(value))){
          return callback(new Error('密码为6-12位字母,数字或下划线'))
        }else{
          callback()
        }
}

export var checkCityInfo=(rule,value,callback)=>{
        console.log("1111=>"+value)
        if(typeof(value)=='undefined'||value==''){
          return callback(new Error('请选择城市信息'))
        }else{
          callback()
        }
}
export var checkDigital=(rule,value,callback)=>{
        if(typeof(value)=='undefined'||value==''){
          return callback(new Error('请输入数字'))
        }else if(!(/^[0-9]*$/.test(value))){
          return callback(new Error('输入必须全为数字'))
        }else{
          callback()
        }
}
export var checkIdentNo=(rule,value,callback)=>{
        console.log("222=>"+value)
        if(typeof(value)=='undefined'||value==''){
          return callback(new Error('请选择城市信息'))
        }else if(!(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value))){
          return callback(new Error('身份证号不合法'))
        }else{
          callback()
        }
}
//export const distinctslist = () => { return axios.get('http://jarvisqh.vicp.io/cms-web/getdata/getdistinctlist') }