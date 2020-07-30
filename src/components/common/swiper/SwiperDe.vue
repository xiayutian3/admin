<template>
  <div class="swiper-de" id="swiper-de">
    <swiper ref="mySwiper" id="mySwiperDe" :options="swiperOptions">
      <swiper-slide v-for="(item,index) in list" :key="index">
         <div class="pic">
           <div class="img-wrap">
              <img class="img" src="../../../assets/logo.png" alt />
           </div>
            <div class="msg">
              <div class="msg1">设备名称 <span class="name">{{item.sbmc}}</span></div>
              <div class="msg1">所属场景 <span class="name">{{item.sbdz}}</span></div>
              <div class="msg1">安装地点 <span class="name">{{item.sbdz}}</span></div>
            </div>
          </div>
      </swiper-slide>
      <div class="swiper-pagination" slot="pagination"></div>
    </swiper>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
export default {
  name: 'swiper-de',
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      swiperOptions: {
        // width: 300,
        slidesPerView: 2,
        spaceBetween: 15,
        freeMode: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        }
        // on: {
        //   resize: function () {
        //     this.params.width = this.swiperWw
        //     this.update()
        //   }
        // }
      }
    }
  },
  created () {},
  mounted () {
    const swiperWw = document.getElementById('swiper-de').clientWidth
    document.getElementById('mySwiperDe').style.width = swiperWw + 'px'
    this.swiper.update()
  },
  computed: {
    swiper () {
      return this.$refs.mySwiper.$swiper
    }
  },
  watch: {},
  methods: {},
  components: {
    Swiper,
    SwiperSlide
  }
}
</script>

<style lang='scss'>
.swiper-de {
   width: 100%;
   height: 150px;
  .swiper-container {
    width: 300px;
    height: 150px;
  }
  .swiper-slide {
    text-align: center;
    font-size: 18px;
    // background: #fff;
    // height: 150px;
    /* Center slide text vertically */
    display: flex;
    justify-content: center;
    align-items: center;
    .pic {
      flex: 1;
      // flex-shrink: 0;
      display: flex;
      // justify-content: center;
      align-items: center;
      width: 50%;
      height: 100%;
      .img-wrap{
        width: 50%;
        .img{
          margin: 0 auto;
          width:100px;
          height:110px;
          margin-right:10px;
          flex-shrink: 0;
        }
      }
      .msg {
        width: 50%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        height: 100%;
        font-size: 14px;
        .msg1 {
          // width: 100%;
          text-align: left;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          word-break: break-all;
          .name{
            color: #31e8fe;
          }
        }
      }
    }
  }
  .swiper-pagination-bullet{
    background: #ffffff;
    opacity:1;
  }
  .swiper-pagination-bullet-active{
    background: #2cf1fe;
  }
}
</style>
