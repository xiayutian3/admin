<template>
  <div class="index">
    <div class="deaocol1">
      <div class="row1">
        <div class="row-title">车辆管控</div>
        <div class="msg">
          <span class="msgl">
            感知车辆总计
            <span class="num">{{provincialCar+localCar}}</span>
          </span>
          <!-- <div class="toggle-btn">
            <div
              class="btn"
              v-for="(item,index) in togglebtns"
              :key="index"
              :class="{act:curIndex === index}"
              @click="timeFun(index)"
            >{{item.text}}</div>
          </div>-->
        </div>
        <div class="msg">
          <span class="msg-lf">
            本省车辆总计
            <span class="num">{{localCar}}</span>
          </span>
          <span class="msg-lf">
            外省车辆总计
            <span class="num">{{provincialCar}}</span>
          </span>
        </div>
        <div id="row1Can"></div>
      </div>
      <div class="row2">
        <div class="row-title">车辆出入统计</div>
        <div class="date-sel">
          <DatePicker
            type="datetimerange"
            split-panels
            placeholder="请选择日期"
            @on-change="dateSelect"
            style="width: 250px"
          ></DatePicker>
        </div>
        <div id="row2Can"></div>
      </div>
    </div>
    <div class="deaocol2">
      <div class="row1">
        <div class="search-wrap">
          <Input
            v-model="mapCarNum"
            placeholder="输入车牌号码"
            class="map-search"
          />
          <DatePicker type="datetimerange" placeholder="请选择时间" class="map-time" @on-change="mapTimeFun"></DatePicker>
          <Button type="primary" shape="circle" icon="ios-search" @click="mapSearch"></Button>
        </div>

        <div id="map"></div>
        <div id="popup" class="ol-popup">
          <a href="#" id="popup-closer" class="ol-popup-closer" @click="closeFun"></a>
          <div id="popup-content" class="popup-content"></div>
        </div>
      </div>
      <div class="row2">
        <div class="row-title">预警信息</div>
        <MsgCarousel
          :titleList="warntitles"
          :slideList="warndata"
          :objkeys="warnobjkeys"
          :swiperH="210"
          :slidView="3"
        />
      </div>
    </div>
    <div class="deaocol3">
      <div class="row1">
        <div class="row-title">车辆通行记录</div>
        <MsgCarousel
          :titleList="cartitles"
          :slideList="cardata"
          :objkeys="carobjkeys"
          :slidView="4"
          :swiperH="350"
        />
      </div>
      <div class="row2">
        <div class="row-title">全区终端概况</div>
        <div class="situate">
          <div class="site">
            <div class="name">本月预警数</div>
            <div class="num">{{terTotal}}</div>
          </div>
          <div class="site">
            <div class="name">已处理</div>
            <div class="num">{{terHandled}}</div>
          </div>
          <div class="site">
            <div class="name">待处理</div>
            <div class="num">{{terUnhandled}}</div>
          </div>
        </div>
        <div class="device-wrap">
          <div class="list">
            <div class="device">
              <div class="de-img-wrap">
                <img class="device-img" src="../assets/img/device3.png" alt />
              </div>
              <div class="detel">
                <div class="detel-t">停车场数</div>
                <div class="detel-b">20000</div>
              </div>
            </div>
            <div class="device">
              <div class="de-img-wrap">
                <img class="device-img" src="../assets/img/device4.png" alt />
              </div>
              <div class="detel">
                <div class="detel-t">设备异常统计</div>
                <div class="detel-e">20000</div>
              </div>
            </div>
          </div>
          <div class="list">
            <div class="device">
              <div class="de-img-wrap">
                <img class="device-img" src="../assets/img/device1.png" alt />
              </div>
              <div class="detel">
                <div class="detel-t">车闸总数</div>
                <div class="detel-b">20000</div>
              </div>
            </div>
            <div class="device">
              <!-- <div class="de-img-wrap">
                <img class="device-img" src="../assets/img/device2.png" alt />
              </div>
              <div class="detel">
                <div class="detel-t">警务室接警</div>
                <div class="detel-e">20000</div>
              </div>-->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import echarts from 'echarts'
import { mapServer } from '@/config'
import {
  aksVehicleChart,
  aksChartProvince,
  aksChartVillage,
  aksWarnChart,
  mapList
} from '@/api/home'
import { carWarn } from '@/api/alarm'
import { carPassList } from '@/api/pass'
// 地图相关
import 'ol/ol.css'
import TileLayer from 'ol/layer/Tile'
import TileArcGISRest from 'ol/source/TileArcGISRest'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
// import { toStringHDMS } from 'ol/coordinate'
import Overlay from 'ol/Overlay'
import { Map, View, Feature } from 'ol'
import { Style, Icon } from 'ol/style'
// import { Style, Icon, Text, Fill } from 'ol/style'
import { Point } from 'ol/geom'
// import { fromLonLat, transform, toLonLat } from 'ol/proj'
import { fromLonLat, transform } from 'ol/proj'
export default {
  name: 'index',
  data () {
    return {
      localCar: 0,
      provincialCar: 0,
      row1Can: {
        // backgroundColor: '#0c2f51',
        // title: {
        //   text: '人员统计',
        //   textStyle: {
        //     color: '#fff'
        //   }
        // },
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
            name: '车辆管控',
            type: 'pie',
            radius: ['25%', '65%'],
            center: ['50%', '47%'],
            data: [
              {
                value: 1548,
                name: '布控车辆',
                itemStyle: { color: '#007eff' }
              },
              { value: 535, name: '预警车辆', itemStyle: { color: '#c880ff' } },
              { value: 510, name: '登记车辆', itemStyle: { color: '#ff4f5e' } },
              { value: 634, name: '访客车辆', itemStyle: { color: '#ff904a' } },
              { value: 510, name: '临时车辆', itemStyle: { color: '#18feff' } },
              {
                value: 634,
                name: '黑名单车辆',
                itemStyle: { color: '#36ff95' }
              }
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
      row2Can: {
        legend: {
          bottom: 0,
          textStyle: {
            color: '#fff'
          }
        },
        tooltip: {
          transitionDuration: 0
        },
        dataset: {
          dimensions: ['停车场', '车辆进场', '车辆离场'],
          source: [
            // ['停车场', '2015', '2016'],
            ['停车场1', 43.3, 85.8],
            ['停车场2', 83.1, 73.4],
            ['停车场3', 86.4, 65.2],
            ['停车场4', 72.4, 53.9]
          ]
        },
        color: ['#1692fc', '#fcee16'],
        xAxis: {
          type: 'category',
          axisLine: {
            show: true,
            lineStyle: {
              color: '#0b4ba5'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: '#2d86fe'
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
              color: '#0b4ba5'
            }
          }
        },
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: [{ type: 'bar' }, { type: 'bar' }]
      },
      togglebtns: [{ text: '日' }, { text: '月' }, { text: '年' }],
      curIndex: 0,
      warntitles: [
        { name: '车牌' },
        { name: '预警类型' },
        { name: '通行地点' },
        { name: '通行方向' },
        { name: '预警时间' }
      ],
      warndata: [
        {
          name: '李丽丽',
          cartype: '重点车',
          carp: '新N123456',
          qk: '频繁出入',
          chukou: '阿克苏1豪门',
          time: '2020-06-15 10:25'
        },
        {
          name: '李丽丽',
          cartype: '重点车',
          carp: '新N123456',
          qk: '频繁出入',
          chukou: '阿克苏1豪门',
          time: '2020-06-15 10:25'
        },
        {
          name: '李丽丽',
          cartype: '重点车',
          carp: '新N123456',
          qk: '频繁出入',
          chukou: '阿克苏1豪门',
          time: '2020-06-15 10:25'
        },
        {
          name: '李丽丽',
          cartype: '重点车',
          carp: '新N123456',
          qk: '频繁出入',
          chukou: '阿克苏1豪门',
          time: '2020-06-15 10:25'
        },
        {
          name: '李丽丽',
          cartype: '重点车',
          carp: '新N123456',
          qk: '频繁出入',
          chukou: '阿克苏1豪门',
          time: '2020-06-15 10:25'
        },
        {
          name: '李丽丽',
          cartype: '重点车',
          carp: '新N123456',
          qk: '频繁出入',
          chukou: '阿克苏1豪门',
          time: '2020-06-15 10:25'
        },
        {
          name: '李丽丽',
          cartype: '重点车',
          carp: '新N123456',
          qk: '频繁出入',
          chukou: '阿克苏1豪门',
          time: '2020-06-15 10:25'
        }
      ],
      warnobjkeys: ['jdchphm', 'clgjxxlx', 'sbmc', 'gcfx', 'cjsj'],
      cartitles: [
        { name: '车辆图片' },
        { name: '车辆牌号' },
        { name: '通行地点' },
        { name: '通行方式' }
      ],
      cardata: [
        {
          pic: '图片',
          chepai: '经123456',
          didian: '阿克苏1角门',
          qk: '进'
        },
        {
          pic: '图片',
          chepai: '经123456',
          didian: '阿克苏1角门',
          qk: '进'
        },
        {
          pic: '图片',
          chepai: '经123456',
          didian: '阿克苏1角门',
          qk: '进'
        },
        {
          pic: '图片',
          chepai: '经123456',
          didian: '阿克苏1角门',
          qk: '进'
        },
        {
          pic: '图片',
          chepai: '经123456',
          didian: '阿克苏1角门',
          qk: '进'
        },
        {
          pic: '图片',
          chepai: '经123456',
          didian: '阿克苏1角门',
          qk: '进'
        },
        {
          pic: '图片',
          chepai: '经123456',
          didian: '阿克苏1角门',
          qk: '进'
        }
      ],
      carobjkeys: ['photosUrlList', 'jdchphm', 'dzmc', 'gcfx'],
      terHandled: 0,
      terTotal: 0,
      terUnhandled: 0,
      timer: '',
      map: null,
      pointLayer: null,
      featuresArr: [],
      overlay: null,
      coordinates: [
        {
          x: '80.29071',
          y: '41.178502'
        }
      ],
      mapCarNum: '',
      maptimes: []
    }
  },
  created () {},
  async mounted () {
    try {
      this.initMap()
      // this.addPoints(this.coordinates) // 根据坐标点批量打点
      this.addPopup()
      // this.drawrow1Can()
      // this.drawrow2Can()

      this.getCarWarn()
      this.getCarPassList()
      this.getCarProvince()
      this.getAksVehicleChart()
      this.getChartVillage()
      this.getAksWarnChart()
      this.timer = setInterval(() => {
      //   const coordinates = [
      //     {
      //       x: '80.29071',
      //       y: '41.077502'
      //     }
      //   ]
      //   this.addPoints(coordinates) // 根据坐标点批量打点

        this.getCarWarn()
        this.getCarPassList()
        this.getCarProvince()
        this.getAksVehicleChart()
        this.getChartVillage()
        this.getAksWarnChart()
      }, 10000)
    } catch (error) {
      console.log('mounted -> error', error)
    }
  },
  computed: {},
  watch: {},
  methods: {
    drawrow1Can () {
      const row1Can = echarts.init(document.getElementById('row1Can'))
      row1Can.setOption(this.row1Can)
    },
    drawrow2Can () {
      const row2Can = echarts.init(document.getElementById('row2Can'))
      row2Can.setOption(this.row2Can)
    },
    timeFun (index) {
      this.curIndex = index
    },
    async dateSelect (dates) {
      // 清空时间的时候会触发（空的数组）
      if (!dates[0] && !dates[1]) {
        return
      }

      // 日期选择
      const TimeSpan = {
        startDate: dates[0],
        endDate: dates[1]
      }
      const {
        data: { data, code }
      } = await aksChartVillage(TimeSpan)
      if (code === 0) {
        if (!data) {
          return
        }
        const newDate = data.map((item) => {
          const dateArr = []
          dateArr.push(item.name, item.inNum, item.outNum)
          return dateArr
        })
        this.row2Can.dataset.source = newDate
        this.drawrow2Can()
      }
    },
    async getCarWarn () {
      // 获取车辆告警信息
      const {
        data: { data, code }
      } = await carWarn()
      if (data && code == 0) {
        this.warndata = data.map((item) => {
          item.gcfx = item.gcfx == 0 ? '出' : '进'
          return item
        })
      }
    },
    async getCarPassList () {
      // 获取车辆通行记录
      const {
        data: { data, code }
      } = await carPassList()
      if (data && code == 0) {
        this.cardata = data.map((item) => {
          item.gcfx = item.gcfx == 0 ? '出' : '进'
          return item
        })
      }
    },
    async getAksVehicleChart () {
      // 车辆管控echart
      const {
        data: { data, code }
      } = await aksVehicleChart()
      if (code == 0) {
        const colorArr = [
          { color: '#007eff' },
          { color: '#c880ff' },
          { color: '#ff4f5e' },
          { color: '#ff904a' },
          { color: '#18feff' }
        ]
        this.row1Can.series[0].data = data.map((item, index) => {
          item.itemStyle = colorArr[index]
          return item
        })
        this.drawrow1Can()
      }
    },
    async getCarProvince () {
      // 获取本省,外省车
      const {
        data: { data, code }
      } = await aksChartProvince()
      if (code === 0) {
        this.localCar = data[0].value
        this.provincialCar = data[1].value
      }
    },
    async getChartVillage (dateArr) {
      // 车辆出入统计图表
      let TimeSpan = {}
      const startDate = moment().format('YYYY-MM-DD 00:00:00')
      const endDate = moment().format('YYYY-MM-DD 23:59:59')
      TimeSpan = {
        startDate,
        endDate
      }
      const {
        data: { data, code }
      } = await aksChartVillage(TimeSpan)
      if (code === 0) {
        if (!data) {
          return
        }
        const newDate = data.map((item) => {
          const dateArr = []
          dateArr.push(item.name, item.inNum, item.outNum)
          return dateArr
        })
        this.row2Can.dataset.source = newDate
        this.drawrow2Can()
      }
    },
    async getAksWarnChart () {
      // 全区终端概况统计
      const {
        data: { data, code }
      } = await aksWarnChart()
      if (code === 0) {
        this.terHandled = data.handled
        this.terTotal = data.total
        this.terUnhandled = data.unhandled
      }
    },
    async getMapList (obj) {
      const { data: { code, data } } = await mapList(obj)
      if (code == 0 && data.length !== 0) {
        this.coordinates = data
        this.addPoints(this.coordinates) // 根据坐标点批量打点
      }
    },
    // 地图相关
    initMap () {
      // ArcGISRest瓦片资源
      const gaodeMapLayer = new TileLayer({
        source: new TileArcGISRest({
          attributions: '版权归属 © <a href="###">自定义科技</a>',
          ratio: 1,
          params: {},
          url: mapServer
        })
      })
      this.map = new Map({
        layers: [gaodeMapLayer],
        view: new View({
          center: transform([80.29071, 41.078502], 'EPSG:4326', 'EPSG:3857'),
          zoom: 11
        }),
        target: 'map'
      })
    },
    /**
     * 批量根据经纬度坐标打点
     */
    addPoints (coordinates) {
      // 设置图层
      this.pointLayer = new VectorLayer({
        source: new VectorSource()
      })
      // 添加图层
      this.map.addLayer(this.pointLayer)
      // 循环添加feature
      for (let i = 0; i < coordinates.length; i++) {
        // 创建feature，一个feature就是一个点坐标信息
        const feature = new Feature({
          carNo: coordinates[i].carNo,
          address: coordinates[i].address,
          geometry: new Point(fromLonLat([coordinates[i].longitude, coordinates[i].latitude]))
        })
        // feature.setStyle(this.getIcon(coordinates[i].type))
        feature.setStyle(this.getIcon())
        feature.set('posn', fromLonLat([coordinates[i].longitude, coordinates[i].latitude]))
        this.featuresArr.push(feature)
      } // for 结束
      // 批量添加feature
      this.pointLayer.getSource().addFeatures(this.featuresArr)
    },
    getIcon (type) {
      const src = require('../assets/po.png')
      var styleIcon = new Style({
        // 设置图片效果
        image: new Icon({
          src: src,
          anchor: [0.5, 0.5],
          scale: 0.5
        })
        // 设置图片下面显示字体的样式和内容
        // text: new Text({
        //   text: type, // 添加文字描述
        //   font: '14px font-size', // 设置字体大小
        //   fill: new Fill({ // 设置字体颜色
        //     color: '#1CAF9A'
        //   }),
        //   offsetY: 20// 设置文字偏移量
        // })
      })
      return styleIcon
    },
    /**
     * 创建一个 Overlay 叠加从对象用作显示弹窗
     * 思路：
     * 1. 点击地图上的位置
     * 2. 获取经纬度的坐标
     * 3. 调用 ol 内置的方法 ol.Overlay 实现弹出
     */
    addPopup () {
      // 使用变量存储弹窗所需的 DOM 对象
      var container = document.getElementById('popup')
      var content = document.getElementById('popup-content')

      // 创建一个弹窗 Overlay 对象
      this.overlay = new Overlay({
        element: container, // 绑定 Overlay 对象和 DOM 对象的
        autoPan: true, // 定义弹出窗口在边缘点击时候可能不完整 设置自动平移效果
        autoPanAnimation: {
          duration: 250 // 自动平移效果的动画时间 9毫秒
        },
        positioning: 'center-center'
      })

      // 将弹窗添加到 map 地图中
      this.map.addOverlay(this.overlay)
      const _that = this
      /**
       * 添加单击响应函数来处理弹窗动作
       */
      this.map.on('click', function (evt) {
        var feature = _that.map.forEachFeatureAtPixel(evt.pixel, function (
          feature
        ) {
          return feature
        })
        if (feature) {
          const itemPosition = feature.get('posn')
          const address = feature.get('address')
          const carNo = feature.get('carNo')
          content.innerHTML = `
                <span>${address}</span>
                <p>车牌号：${carNo}</p>`
          // <p><a href="###" class="car-Tag">昼伏夜出</a></p>`
          _that.overlay.setPosition(itemPosition) // 把 overlay 显示到指定的 x,y坐标
        }
      })
    },
    closeFun (event) {
      this.overlay.setPosition(undefined)
      event.target.parentElement.blur()
      return false
    },
    mapTimeFun (times) {
      this.maptimes = times
    },
    // 地图搜索
    mapSearch () {
      const obj = {
        carNo: this.mapCarNum,
        startDate: this.maptimes[0],
        endDate: this.maptimes[1]
      }
      this.getMapList(obj)
    }
  },
  beforeDestroy () {
    clearInterval(this.timer)
  }
}
</script>

<style lang='scss'>
.index {
  flex: 1;
  display: flex;
  padding: 10px 20px;
  width: 100%;
  .row-title {
    margin: 8px;
    padding-left: 5px;
    padding-right: 5px;
    font-size: 22px;
    color: #fff;
    background: linear-gradient(to right, #2d85fe, #16306a);
  }
  .msg {
    // margin: 8px;
    margin-left: 8px;
    margin-right: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .msgl {
      display: flex;
      align-items: center;
    }
    .msg-lf {
      flex: 1;
      display: flex;
      align-items: center;
    }
    .num {
      margin-left: 10px;
      font-size: 30px;
      color: #11b1ff;
    }
    .toggle-btn {
      display: flex;
      width: 140px;
      height: 32px;
      text-align: center;
      line-height: 32px;
      border: 1px solid #2d6bff;
      border-radius: 4px;
      color: #2d6bff;
      .btn {
        &.act {
          color: #fff;
          background: #2d6bff;
        }
        &:nth-child(2) {
          border-left: 1px solid #2d6bff;
          border-right: 1px solid #2d6bff;
        }
        flex: 1;
        cursor: pointer;
      }
    }
  }
}
.deaocol1 {
  padding-right: 10px;
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #182d59;
  .row1 {
    margin-bottom: 10px;
    flex: 1;
    display: flex;
    flex-direction: column;
    background: url("../assets/img/rowbg.png") no-repeat;
    background-size: 100% 100%;
  }
  .row2 {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: url("../assets/img/rowbg.png") no-repeat;
    background-size: 100% 100%;
    .date-sel {
      padding-left: 8px;
      color: #999;
      .ivu-input {
        &::placeholder {
          color: #fff;
        }
        color: #fff;
        background-color: #1a3d8f;
        border: 1px solid #2d6bff;
      }
      .ivu-icon-ios-calendar-outline {
        color: #fff;
      }
      .ivu-icon-ios-close-circle {
        color: #fff;
      }
    }
  }
}
.deaocol2 {
  flex: 1.6;
  display: flex;
  flex-direction: column;
  background-color: #182d59;
  .row1 {
    position: relative;
    flex: 1.5;
    .search-wrap {
      position: absolute;
      top: 1px;
      right: 2px;
      z-index: 1;
      .map-search {
        width: 200px;
        .ivu-input {
          &::placeholder {
            color: #fff;
          }
          color: #fff;
          background-color: #1a3d8f;
          border: 1px solid #2d6bff;
        }
        .ivu-input-icon {
          color: #fff;
        }
      }
      .map-time {
        margin-left: 5px;
        margin-right: 5px;
        width: 300px;
        color: #999;
        .ivu-select-dropdown{
          left: 74px !important;
        }
        .ivu-input {
          &::placeholder {
            color: #fff;
          }
          color: #fff;
          background-color: #1a3d8f;
          border: 1px solid #2d6bff;
        }
        .ivu-icon-ios-calendar-outline {
          color: #fff;
        }
        .ivu-icon-ios-close-circle {
          color: #fff;
        }
      }
    }
  }
  .row2 {
    margin-top: 10px;
    flex: 1;
    display: flex;
    flex-direction: column;
    background: url("../assets/img/rowbg.png") no-repeat;
    background-size: 100% 100%;
  }
}
.deaocol3 {
  padding-left: 10px;
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #182d59;
  .row1 {
    flex: 1.5;
    background: url("../assets/img/rowbg.png") no-repeat;
    background-size: 100% 100%;
  }
  .row2 {
    margin-top: 10px;
    flex: 1;
    display: flex;
    flex-direction: column;
    background: url("../assets/img/rowbg.png") no-repeat;
    background-size: 100% 100%;
    .situate {
      display: flex;
      .site {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        .name {
          margin-right: 8px;
          font-size: 16px;
          color: #fff;
        }
        .num {
          font-size: 22px;
          color: #11b1ff;
        }
      }
    }
    .device-wrap {
      flex: 1;
      display: flex;
      flex-direction: column;
      .list {
        flex: 1;
        display: flex;
        justify-content: space-around;
        align-items: center;
      }
      .device {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .de-img-wrap {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .device-img {
        // flex: 1;
        width: 45px;
        height: 40px;
      }
      .detel {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
      .detel-t {
        font-size: 16px;
        color: #fff;
      }
      .detel-b {
        font-size: 22px;
        color: #11b1ff;
      }
      .detel-e {
        font-size: 22px;
        color: #ff4545;
      }
    }
  }
}
#row1Can {
  flex: 1;
}
#row2Can {
  flex: 1;
}
#map {
  height: 100%;
  background: lightslategray;
}
.ol-popup {
  position: absolute;
  background-color: rgba(32, 99, 189, 0.8);
  -webkit-filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
  filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #2063bd;
  bottom: 26px;
  left: -50px;
}
.ol-popup:after,
.ol-popup:before {
  top: 100%;
  border: solid transparent;
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}
// .ol-popup:after {
//   border-top-color: white;
//   border-width: 10px;
//   left: 48px;
//   margin-left: -10px;
// }
.ol-popup:before {
  border-top-color: rgba(32, 99, 189, 0.8);
  border-width: 11px;
  left: 48px;
  margin-left: -11px;
}
.ol-popup-closer {
  text-decoration: none;
  position: absolute;
  top: 2px;
  right: 8px;
}
.popup-content {
  width: 200px;
}
.car-Tag {
  display: inline-block;
  width: 80px;
  text-align: center;
  line-height: 22px;
  border-radius: 10px;
  color: #fff;
  background: #ff2336;
}
.ol-popup-closer:after {
  content: "✖";
  color: #fff;
}
</style>
