<template>


    <div class="wrapper">
      <div class="chart_title">请求数</div>
      <div  id="countChart" class="chart" ></div>
      <div class="chart_title">请求耗时</div>
      <div  id="timeChart"  class="chart" ></div>
      </div>

</template>

<style scoped>

  .wrapper{
    width: 98%;
    margin: 30px auto;
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
  .chart{
    height: 400px;
    width: 100%;
  }
  .chart_title{
    text-align: center;
    border-top: 1px solid #000;
    padding-top: 20px;
    margin: 10px;
  }
</style>
<script>
  import { getStat } from '../../api/tcp'
  import echarts from 'echarts'
  export default {

    methods: {
      onSelect(value) {
        this.tcpConnData = this.allData[value]
      },
      filterName(value, row) {
        return row.name === value
      },
      getOptionByData(countData) {
        const series = ((countData) => {
          const seriesArray = []
          for (let i = 0; i < countData.seriesData.length; i++) {
            const item = countData.seriesData[i]
            const itemData = {
              name: item.name,
              type: 'line',
              smooth: true,
              symbol: 'circle',
              symbolSize: 5,
              showSymbol: false,
              lineStyle: {
                normal: {
                  width: 1
                }
              },
              areaStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(137, 189, 27, 0.3)'
                  }, {
                    offset: 0.8,
                    color: 'rgba(137, 189, 27, 0)'
                  }], false),
                  shadowColor: 'rgba(0, 0, 0, 0.1)',
                  shadowBlur: 10
                }
              },
              itemStyle: {
                normal: {
                  color: 'rgb(137,189,27)',
                  borderColor: 'rgba(137,189,2,0.27)',
                  borderWidth: 12
                }
              },
              data: item.data
            }
            seriesArray.push(itemData)
          }
          return seriesArray
        })(countData)
        const option = {
          backgroundColor: '#ffffff',
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              lineStyle: {
                color: '#57617B'
              }
            }
          },
          legend: {
            icon: 'rect',
            itemWidth: 14,
            itemHeight: 5,
            itemGap: 13,
            data: countData.legendData,
            right: '4%',
            textStyle: {
              fontSize: 12,
              color: '#ffffff'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [{
            type: 'category',
            boundaryGap: false,
            axisLine: {
              lineStyle: {
                color: '#57617B'
              }
            },
            data: countData.xAxisData
          }],
          yAxis: [{
            type: 'value',
            name: countData.yAxisName,
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#57617B'
              }
            },
            axisLabel: {
              margin: 10,
              textStyle: {
                fontSize: 14
              }
            },
            splitLine: {
              lineStyle: {
                color: '#57617B'
              }
            }
          }],
          series: series
        }
        return option
      },
      initChart() {
        this.countChart = echarts.init(document.getElementById('countChart'))
        const countData = {
          legendData: ['doBeatUp'],
          xAxisData: ['13:00', '13:05', '13:10', '13:15', '13:20', '13:25', '13:30', '13:35', '13:40', '13:45', '13:50', '13:55'],
          yAxisName: '请求数',
          seriesData: [{ name: 'doBeatUp', data: [220, 182, 191, 134, 150, 120, 110, 125, 145, 122, 165, 122] }]
        }
        this.countChart.setOption(this.getOptionByData(countData))
        this.timeChart = echarts.init(document.getElementById('timeChart'))
        this.timeChart.setOption(this.getOptionByData(countData))
      }
    },
    async mounted() {
      this.filterArray = [{ text: 'doBeatUp', value: 'doBeatUp' }, { text: 'doLogin', value: 'doLogin' }, { text: 'handleHttpsRet', value: 'handleHttpsRet' }]
      this.statData = [{ 'time': '11:01',
        'name': 'doBeatUp',
        'count': '200',
        'timeC': '200'
      }, { 'time': '11:01',
        'name': 'handleHttpsRet',
        'count': '200',
        'timeC': '200'
      }, { 'time': '11:01',
        'name': 'doLogin',
        'count': '200',
        'timeC': '200'
      }
      ]
      this.initChart();
      const resultArr = (await getStat())
      console.log(resultArr)
    },
    data() {
      return {
        statData: [],
        filterArray: [],
        selectValue: '',
        unionList: [],
        tcpConnData: [
        ]
      }
    }
  }
</script>
