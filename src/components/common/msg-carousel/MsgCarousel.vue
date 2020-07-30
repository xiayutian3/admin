<template>
  <div class="msg-carousel" id="msgCarousel">
    <div class="title">
      <div class="tle" v-for="(item,index) in titleList" :key="index">{{item.name}}</div>
    </div>
    <div id="swipWrap" :style="swiperStyle">
      <swiper id="mySwiper" ref="mySwiper" :options="swiperOptions">
        <swiper-slide v-for="(item,index) in slideList" :key="index">
          <div class="slide">
            <div class="slide-l" v-for="(sub ,idx) in objkeys" :key="'sub'+idx">
              <!-- sub =='photosUrlList' -->
              <img v-if="sub ==='photosUrlList' && item[sub]" class="txImg" :src="test(item[sub][0]) ?item[sub][0]:require('../../../assets/nopic.jpg')">
              <div v-else>{{item[sub]}}</div>
            </div>
          </div>
        </swiper-slide>
        <!-- <div class="swiper-pagination" slot="pagination"></div> -->
      </swiper>
    </div>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
export default {
  name: 'msg-carousel',
  props: {
    titleList: {
      type: Array,
      default: () => []
    },
    slideList: {
      type: Array,
      default: () => []
    },
    swiperH: {
      type: Number,
      default: 0
    },
    objkeys: {
      type: Array,
      default: () => []
    },
    slidView: {
      type: Number,
      default: 4
    }
  },
  data () {
    return {
      swiperOptions: {
        freeMode: true,
        loop: true,
        slidesPerView: this.slidView,
        direction: 'vertical',
        autoplay: {
          delay: 2500,
          disableOnInteraction: false
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        }
      }
    }
  },
  created () {
  },
  mounted () {
    // this.updateSwiper()
    // 鼠标覆盖停止自动切换
    this.swiper.el.onmouseover = function () {
      this.swiper.autoplay.stop()
    }

    // 鼠标离开开始自动切换
    this.swiper.el.onmouseout = function () {
      this.swiper.autoplay.start()
    }
  },
  computed: {
    swiper () {
      return this.$refs.mySwiper.$swiper
    },
    swiperStyle () {
      return {
        height: this.swiperH + 'px'
      }
    }
  },
  watch: {},
  methods: {
    // 正则匹配图片路径
    test (url) {
      var reg = /^http\S/g
      const res = reg.test(url)
      return res
    }
    // updateSwiper () {
    // const swiperH = document.getElementById('swipWrap').clientHeight
    // document.getElementById('mySwiper').style.height = swiperH + 'px'
    // this.swiper.update()
    // }
  },
  components: {
    Swiper,
    SwiperSlide
  }
}
</script>

<style lang='scss'>
.msg-carousel {
  padding-left: 5px;
  padding-right: 5px;
  flex: 1;
  display: flex;
  flex-direction: column;
  .txImg{
    width: 100px;
    height: 80px;
  }
  .title {
    display: flex;
    .tle {
      flex: 1;
      font-size: 18px;
      color: #11b1ff;
      text-align: center;
    }
  }
  .swiper-container {
    width: 100%;
    height: 100%;
  }
  .swiper-slide {
    text-align: center;
    font-size: 14px;
    // background: #fff;

    /* Center slide text vertically */
    display: -webkit-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    -webkit-justify-content: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    -webkit-align-items: center;
    align-items: center;
  }
  .slide{
    flex: 1;
    display: flex;
    .slide-l{
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
#swipWrap {
  // height: 210px;
  cursor: pointer;
}
</style>
