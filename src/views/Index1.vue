<template>
  <div class="de-index">
    <!-- 首页 -->
    <div class="part1">
      <div class="row1">
        <div class="title">人员通行记录</div>
        <div class="list">
          <div class="item" v-for="(item,idx) in peoplepass" :key="idx">
            <img class="imgW" :src="item.photosUrlList[0]" alt />
            <div class="num">{{item.xm}}</div>
            <div class="role">
              <div class="name">{{directType(item.jcfx)}}</div>
              <Tag class="tag" :color="item.jcrylx === '7'?'error':'primary'">{{peopleType(item.jcrylx)}}</Tag>
            </div>
            <div class="year">{{item.sk_rqsj|timeFormat}}</div>
            <!-- <div class="time">12:11:00</div> -->
          </div>
        </div>
      </div>
      <div class="row2">
        <!-- <div class="title">本日通行人员记录</div> -->
        <div id="p1row2"></div>
      </div>
      <div class="row3">
        <div id="p1row3"></div>
      </div>
    </div>
    <div class="part2">
      <div class="row1" id="p2row1"></div>
      <div class="row2">
        <div class="title">警告信息</div>
        <div class="pic-wrap">
          <div class="none" v-if="!isWarn">场景设备人员无异常！</div>
          <SwiperDe v-else :list="warning"/>
        </div>
        <div class="tip" :style="{backgroundImage:`url(${warnBg})`}">
          <div v-if="!isWarn" class="none">无告警信息！</div>
          <div v-else class="tip-msg">
            <div class="p1">花园小区XXX设备掉线，请及时处理！</div>
            <!-- <div class="p2">
              <Button>处理</Button>
              <Button>取消</Button>
            </div> -->
          </div>
        </div>
      </div>
    </div>
    <div class="part1">
      <div class="row1">
        <div class="title">车辆通行记录</div>
        <div class="list">
          <div class="item" v-for="(item,idx) in carpass" :key="idx">
            <img class="imgW" :src="item.photosUrlList[0]" alt />
            <div class="num">{{item.jdchphm}}</div>
            <div class="role">
              <div class="name">{{directType(item.gcfx)}}</div>
              <Tag class="tag" :color="item.jdcgcxxbz == '7'?'error':'primary'" >{{carType(item.jdcgcxxbz)}}</Tag>
            </div>
            <div class="year">{{item.cjsj|timeFormat}}</div>
            <!-- <div class="time">12:11:00</div> -->
          </div>
        </div>
      </div>
      <div class="row2">
        <div id="p3row2"></div>
      </div>
      <div class="row3 p3r3">
        <div class="title r3-title">感知设备</div>
        <div class="carous">
          <Carousel v-model="carouselVal" loop>
            <CarouselItem v-for="(item,idx) in devicechart" :key="idx">
              <div class="demo-carousel">
                <div class="icons">
                   <!-- {online: "0", total: 1, type: "车辆道闸"} -->
                  <div class="item" v-for="(subItem,subIdx) in item" :key="subIdx">
                    <img class="i-img" :src="deviceTypeUrl(subItem.type)" alt />
                    <div class="i-detail">{{subItem.type}} <span :style="{color:'#e7ac32'}">{{+subItem.online}}</span><span :style="{color:'#25d3ff'}">/{{subItem.total}}</span></div>
                    <div class="i-line">
                      <div class="in" :style="{width:`${(+subItem.online/subItem.total)*100}%`}"></div>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          </Carousel>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import { publicPath } from '@/config'
import { getEchartxArr, oneToTwo } from '@/utils/arr'
import { module1Mixin } from '@/utils/mixin'
export default {
  name: 'de-index',
  mixins: [module1Mixin],
  data () {
    return {
      optionp1row2Can: {
        backgroundColor: '#0c2f51',
        title: {
          text: '本日通行人员记录',
          textStyle: {
            color: '#fff'
          }
        },
        tooltip: {
          trigger: 'axis',
          transitionDuration: 0
        },
        legend: {
          data: ['进', '出'],
          bottom: 0,
          textStyle: {
            color: '#fff'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '10%',
          containLabel: true
        },
        // toolbox: {},
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          axisLine: {
            show: true,
            lineStyle: {
              color: '#0e3c6c'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: '#0bebff'
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            show: true,
            textStyle: {
              color: '#fff'
            }
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            lineStyle: {
              color: '#0e3c6c'
            }
          }
          // nameTextStyle: {
          //   color: 'red',
          //   borderColor: 'transparent'
          // }
          // axisLine: {
          //   lineStyle: {
          //     color: 'green'
          //   }
          // }
        },
        series: [
          {
            name: '进',
            type: 'line',
            itemStyle: {
              color: '#0bebff'
            },
            // label: {
            //   color: '#fff'
            // },
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: '出',
            type: 'line',
            itemStyle: {
              color: '#ffbf27'
            },
            data: [220, 182, 191, 234, 290, 330, 310]
          }
        ]
      },
      optionp1row3Can: {
        backgroundColor: '#0c2f51',
        title: {
          text: '人员统计',
          textStyle: {
            color: '#fff'
          }
        },
        tooltip: {
          trigger: 'item',
          transitionDuration: 0,
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          // orient: 'vertical',
          // top: 'middle',
          bottom: 0,
          left: 'center',
          textStyle: {
            color: '#fff'
          }
          // data: ['业主', '租客', '特殊群体', '重点人员']
        },
        series: [
          {
            name: '人员统计',
            type: 'pie',
            radius: ['35%', '65%'],
            center: ['50%', '48%'],
            data: [
              { value: 1548, name: '业主', itemStyle: { color: 'blue' } },
              { value: 535, name: '租客' },
              { value: 510, name: '特殊群体' },
              { value: 634, name: '重点人员' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      },
      optionp2row1Can: {
        backgroundColor: '#0c2f51',
        title: {
          text: '房屋统计',
          textStyle: {
            color: '#fff'
          }
        },
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          transitionDuration: 0,
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'line' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: [
              '社区1',
              '社区1',
              '社区1',
              '社区1',
              '社区1',
              '社区1',
              '社区1'
            ],
            axisTick: {
              show: false,
              alignWithLabel: true
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#0e3c6c'
              }
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: '#16c8fc'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              show: true,
              textStyle: {
                color: '#fff'
              }
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitLine: {
              lineStyle: {
                color: '#0e3c6c'
              }
            }
          }
        ],
        series: [
          {
            name: '直接访问',
            type: 'bar',
            barWidth: '60%',
            data: [45, 82, 70, 193]
          }
        ]
      },
      optionp3row2Can: {
        backgroundColor: '#0c2f51',
        title: {
          text: '本日通行车辆记录',
          textStyle: {
            color: '#fff'
          }
        },
        tooltip: {
          trigger: 'axis',
          transitionDuration: 0
        },
        legend: {
          data: ['进', '出'],
          bottom: 0,
          textStyle: {
            color: '#fff'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '10%',
          containLabel: true
        },
        // toolbox: {},
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          axisLine: {
            show: true,
            lineStyle: {
              color: '#0e3c6c'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: '#0bebff'
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            show: true,
            textStyle: {
              color: '#fff'
            }
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            lineStyle: {
              color: '#0e3c6c'
            }
          }
        },
        series: [
          {
            name: '进',
            type: 'line',
            itemStyle: {
              color: '#0bebff'
            },
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: '出',
            type: 'line',
            itemStyle: {
              color: '#ffbf27'
            },
            data: [220, 182, 191, 234, 290, 330, 310]
          }
        ]
      },
      carouselVal: 0,
      websocket: null,
      peoplepass: [],
      carpass: [],
      devicechart: [],
      warning: []
    }
  },
  created () {},
  mounted () {
    // this.drawp1row2()
    // this.drawp1row3()
    // this.drawp2row1()
    // this.drawp3row2()
    // websocket链接
    if ('WebSocket' in window) {
      this.websocket = new WebSocket(publicPath)
      // 更新vuex上的websocket
      this.setwebsocketInit(this.websocket)
      this.initWebSocket()
    } else {
      alert('当前浏览器 Not support websocket')
    }
  },
  computed: {
    isWarn () {
      return this.warning.length != 0
    },
    warnBg () {
      return this.warning.length == 0 ? require('../assets/img/nowarn.png') : require('../assets/img/warning.png')
    }
  },
  watch: {},
  methods: {
    drawp1row2 () {
      const p1row2Can = echarts.init(document.getElementById('p1row2'))
      p1row2Can.setOption(this.optionp1row2Can)
    },
    drawp1row3 () {
      const p1row3Can = echarts.init(document.getElementById('p1row3'))
      p1row3Can.setOption(this.optionp1row3Can)
    },
    drawp2row1 () {
      const p2row1Can = echarts.init(document.getElementById('p2row1'))
      p2row1Can.setOption(this.optionp2row1Can)
    },
    drawp3row2 () {
      const p3row2Can = echarts.init(document.getElementById('p3row2'))
      p3row2Can.setOption(this.optionp3row2Can)
    },
    // websocket
    initWebSocket () {
      // 连接错误
      this.websocket.onerror = this.setErrorMessage

      // //连接成功
      this.websocket.onopen = () => {
        // 刚连接成功发送areaID
        this.websocketSend()
        // 收到消息的回调
        this.websocket.onmessage = this.setOnmessageMessage
      }

      // 连接关闭的回调
      // this.websocket.onclose = this.setOncloseMessage

      // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
      window.onbeforeunload = this.onbeforeunload
    },
    setErrorMessage () {
      // this.data = 'WebSocket连接发生错误' + '   状态码：' + this.websocket.readyState
    },
    setOnopenMessage () {
      // this.data = 'WebSocket连接成功' + '   状态码：' + this.websocket.readyState
    },
    setOnmessageMessage (event) {
      // console.log(event.data)
      const obj = JSON.parse(event.data)

      if (obj) {
        for (const key in obj) {
          // console.log(key)
          switch (key) {
            case 'people-pass':
              // 人员通行记录
              // console.log(obj[key].data)
              this.peoplepass = obj[key].data
              break
            case 'people-pass-chart-out':
              // 本日人员同行记录  进出
              var pOutArr = getEchartxArr(obj['people-pass-chart-out'].data, 'value')
              var pInArr = getEchartxArr(obj['people-pass-chart-in'].data, 'value')
              var nameArr = getEchartxArr(obj['people-pass-chart-out'].data, 'name')
              nameArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
              this.optionp1row2Can.xAxis.data = nameArr
              this.optionp1row2Can.series[1].data = pOutArr
              this.optionp1row2Can.series[0].data = pInArr
              this.drawp1row2()
              break
            case 'pop-chart':
              // 人员组成统计
              // 颜色添加
              // console.log(obj[key].data)
              var colorArr = ['#14ffa9', '#1ee7ff', '#ffbf27', '#f06e27']
              obj[key].data.forEach((element, index) => {
                // console.log(element)
                element.itemStyle = { color: colorArr[index] }
              })
              this.optionp1row3Can.series[0].data = obj[key].data
              this.drawp1row3()
              break
            case 'building-chart':
              // 房屋统计
              var xArr = getEchartxArr(obj[key].data, 'name')
              var sArr = getEchartxArr(obj[key].data, 'value')
              this.optionp2row1Can.xAxis[0].data = xArr
              this.optionp2row1Can.series[0].data = sArr
              this.drawp2row1()
              break
            case 'device-warning':
              // 告警
              // console.log(obj[key].data)
              this.warning = obj[key].data
              break
            case 'car-pass':
              // 车辆通行记录
              this.carpass = obj[key].data
              break
            case 'car-pass-chart-in':
              // 车辆通行记录图表
              // console.log(obj[key].data)
              var cOutArr = getEchartxArr(obj['car-pass-chart-out'].data, 'value')
              var cInArr = getEchartxArr(obj['car-pass-chart-in'].data, 'value')
              var cNameArr = getEchartxArr(obj['car-pass-chart-out'].data, 'name')
              this.optionp3row2Can.xAxis.data = cNameArr
              this.optionp3row2Can.series[1].data = cOutArr
              this.optionp3row2Can.series[0].data = cInArr
              this.drawp3row2()
              break
            case 'device-chart':
              // 设备数量
              // console.log(Object.prototype.toString.call(obj[key].data))
              // console.log(JSON.stringify(obj[key].data))
              this.devicechart = oneToTwo(obj[key].data, 2)
              // this.devicechart = obj[key].data
              break
            default:
              // console.log(event.data)
              break
          }
        }
      }

      // console.log('服务端返回：', event.data)
      // this.data = '服务端返回：' + event.data
    },
    setOncloseMessage () {
      this.data = 'WebSocket连接关闭' + '   状态码：' + this.websocket.readyState
    },
    onbeforeunload () {
      this.closeWebSocket()
    },
    closeWebSocket () {
      this.websocket.close()
    },
    directType (item) {
      // 判断进出方向类型
      let type = ''

      switch (item) {
        case '0':
          type = '出'
          break
        case '1':
          type = '进'
          break
        default:
          type = '不确定'
          break
      }
      return type
    },
    peopleType (item) {
      // 判断人员类型
      let type = ''

      switch (item) {
        case '1':
          type = '业主'
          break
        case '2':
          type = '租户'
          break
        case '3':
          type = '商户'
          break
        case '4':
          type = '物业'
          break
        case '5':
          type = '政府部门'
          break
        case '6':
          type = '快递'
          break
        case '7':
          type = '重点人员'
          break
        default:
          type = '其他'
          break
      }
      return type
    },
    carType (item) {
      // 判断车辆类型
      let type = ''

      switch (item) {
        case '1':
          type = '内部车辆'
          break
        case '2':
          type = '外部车辆'
          break
        case '3':
          type = '政企车辆'
          break
        default:
          type = '其他'
          break
      }
      return type
    },
    deviceTypeUrl (name) {
      // 通过设备名称来给到图片url
      let url = ''
      switch (name) {
        case '人脸门禁':
          url = require('../assets/img/face-camera.png')
          break
        case '车辆道闸':
          url = require('../assets/img/community-barrier.png')
          break
        case '结构化相机':
          url = require('../assets/img/face-camera.png')
          break
        case '告警设备':
          url = require('../assets/img/wifi-sniffing.png')
          break
        case '视频监控':
          url = require('../assets/img/video-surveillance.png')
          break
      }
      return url
    }

  }
}
</script>

<style lang='scss'>
.de-index {
  flex: 1;
  display: flex;
  padding: 10px 20px;
  width: 100%;
  // height: 100%;
  // color: #333;
  // background: #09233d;
  .title {
    margin-bottom: 10px;
    font-size: 20px;
    font-weight: bold;
    color: #fff;
  }
  .part1 {
    flex-grow: 1;
    flex-shrink: 0;
    flex-basis: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    .row1 {
      flex: 1;
      background: #0c2f51;
      .list {
        display: flex;
        justify-content: space-between;
        padding: 2px;
        .item {
          &:nth-child(2){
            margin-right: 5px;
            margin-left: 5px;
          }
          flex: 1;
          width: 0px;
          padding: 5px;
          display: flex;
          flex-direction: column;
          background: #114170;
          box-shadow: 0px 0px 4px #888888 inset;
          .imgW {
            margin: 0 auto;
            width: 120px;
            height: 100px;
          }
          .num {
            // text-align: center;
            font-size: 18px;
            color: #fff;
          }
          .role {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .name {
              flex: 1;
              margin-right: 2px;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              word-break: break-all;
              color: #12fff7;
            }
            .ivu-tag-text{
              font-size: 14px;
            }
          }
          .year {
            font-size: 12px;
            color: #fff;
          }
          .time {
          }
        }
      }
    }
    .row2 {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 2px;
      margin-top: 5px;
      margin-bottom: 5px;
      // background: #ffffff;
      #p1row2 {
        flex: 1;
      }
      #p3row2 {
        flex: 1;
      }
    }
    .row3 {
      flex: 1;
      position: relative;
      display: flex;
      flex-direction: column;
      padding: 2px;
      &.p3r3 {
        box-sizing: border-box;
        padding-top: 20px;
        background: #0e2f50;
        color: #fff;
        // width: 100%;
        // height: 237px;
      }
      .r3-title {
        position: absolute;
        top: 0;
        left: 0;
      }
      #p1row3 {
        flex: 1;
      }
      .carous {
        flex: 1;
        .ivu-carousel {
          width: 100%;
          height: 100%;
        }
        .ivu-carousel-list {
          width: 100%;
          height: 100%;
        }
        .demo-carousel {
          height: 100%;
        }
        .ivu-carousel-track {
          height: 100%;
        }
        .ivu-carousel-item {
          height: 100% !important;
        }
        .icons {
          display: flex;
          width: 100%;
          height: 100%;
          .item {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            .i-img {
              display: block;
              width: 120px;
              height: 120px;
            }
            .i-detail {
              padding-top:5px ;
              padding-bottom: 5px;
              text-align: center;
              font-size: 16px;
            }
            .i-line{
              width: 110px;
               height: 8px;
               border-radius:4px ;
              background-color: #084076;
              overflow: hidden;
              .in{
                background-color: #14f0ff;
                height: 8px;
              }
            }
          }
        }
      }
    }
  }
  .part2 {
    flex-grow: 1;
    flex-shrink: 0;
    flex-basis: 0;
    display: flex;
    flex-direction: column;
    padding-left: 5px;
    padding-right: 5px;
    .row1 {
      flex: 1;
      // background: #f2f2f2;
    }
    .row2 {
      margin-top: 10px;
      padding: 5px;
      flex: 1;
      display: flex;
      flex-direction: column;
      background: #102f4f;
      .pic-wrap {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 150px;
        overflow-x: auto;
        .none {
          font-size: 36px;
          font-weight: bold;
          color: #12fff7;
        }
      }
      .tip {
        flex: 1;
        background: url('../assets/img/warning.png') no-repeat;
        background-size: 100% 100%;
        .none {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
          font-size: 28px;
          color: #12fff7;
        }
        .tip-msg {
          height: 100%;
          display: flex;
          justify-content: space-around;
          flex-direction: column;
          .p1 {
            text-align: center;
            font-size: 28px;
            color: #ffffff;
          }
          .p2 {
            display: flex;
            justify-content: space-around;
            span{
              color: #f01a1a;
              font-size: 16px;
            }
          }
        }
      }
    }
  }
  .part3 {
    flex-grow: 1;
    flex-shrink: 0;
    flex-basis: 0;
  }
}
</style>
