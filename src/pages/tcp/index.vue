<template>


    <div class="wrapper">
        <div class="union_sel">
        <div class="union_title">请选择联盟id</div>
        <el-select v-model="selectValue" filterable placeholder="联盟id"  @change="onSelect">
            <el-option
              v-for="item in unionList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
        </el-select>
      </div>
          <el-table
            :data="tcpConnData"
            style="width: 100%"
            height="500"
            >
            <el-table-column
              prop="unionId"
              label="联盟id"
              width="160">
            </el-table-column>
            <el-table-column
              prop="parkId"
              label="车场id"
              width="160">
            </el-table-column>

            <el-table-column
              prop="localId"
              label="localId">
            </el-table-column>

            <el-table-column
              prop="ip"
              label="ip和端口"
              width="165">
            </el-table-column>

            <el-table-column
              prop="inTime"
              :formatter="inTimeFormatterDate"
              label="联入时间"
              width="170">
            </el-table-column>

            <el-table-column
              prop="outTime"
              label="断开时间"
              :formatter="outTimeFormatterDate"
              width="170">
            </el-table-column>
            <el-table-column
              prop="packCount"
              label="业务包数">
            </el-table-column>
            <el-table-column
              prop="isClose"
              :formatter="isCloseFormatter"
              label="连接状态">
            </el-table-column>

          </el-table>
      </div>

</template>

<style scoped>

  .wrapper{
    width: 98%;
    margin: 10px auto;
  }
  .union_sel{
    margin-bottom: 20px;
    display: flex;
    justify-content: flex-end;
  }
  .union_sel .union_title{
    line-height: 36px;
    text-align: center;
    margin-right: 10px;
  }
</style>
<script>
  import { getStat } from '../../api/tcp'
  import common from '../../common/js/common'
  export default {
    methods: {
      tableRowClassName(row, index) {
        if (index === 1) {
          return 'info-row'
        } else if (index === 3) {
          return 'positive-row'
        }
        return ''
      },
      dateFormatter(date) {
        return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
      },
      onSelect(value) {
        console.log("valuezhi:"+value)
        this.tcpConnData = this.allData[value]
        console.log("-----"+this.tcpConnData)
      },
      outTimeFormatterDate(row, cloumn) {
        if (!row.outTime || row.outTime < 0) {
          return '-'
        }
        var date = new Date(row.outTime)
        return this.dateFormatter(date)
      },
      isCloseFormatter(row, cloumn) {
        if (row.close) {
          return '已经关闭'
        } else {
          return '已连接'
        }
      },
      inTimeFormatterDate(row, column) {
        var date = new Date(row.inTime)
        return this.dateFormatter(date)
      }
    },
    async mounted() {

    //  console.log(await getStat());

      // result ={
      //     2323: [{
      //       unionId: "2323",
      //       ip: "/127.0.0.1:61325",
      //       inTime: 1505531453157,
      //       packCount: 1,
      //       parkId: "2323",
      //       localId: "2323",
      //       isClose: true
      //     }],
      //     23236: [{
      //       unionId: "23236",
      //       ip: "/127.0.0.1:61323",
      //       inTime: 1505531443096,
      //       packCount: 1,
      //       parkId: "2323",
      //       localId: "2323",
      //       isClose: true
      //     },{
      //       unionId: "23236",
      //       ip: "/127.0.0.1:61326",
      //       inTime: 1505531458211,
      //       packCount: 1,
      //       parkId: "2323",
      //       localId: "2323",
      //       isClose: false
      //     }]
      // }

      const resultArr = (await getStat())

      // for (var i = 0; i < 5; i++) {
      //   var result1 = (await getStat()).data
      //   resultArr.push(result1)
      // }
      //console.log(resultArr)
      const result = resultArr
      this.allData = resultArr
      this.unionList = []
      for (var union in result) {
        this.unionList.push({
          value: union,
          label: union
        })
      }
      this.tcpConnData = result[this.unionList[0].value]
    },
    data() {
      return {
        tableheight:'600px',
        allData: {},
        selectValue: '',
        unionList: [],
        tcpConnData: [
        ]
      }
    }
  }
</script>
