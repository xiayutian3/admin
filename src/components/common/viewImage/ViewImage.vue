<template>
  <div class="view-image">
    <Modal
      title="查看图片"
      v-model="viewImgShow"
      class-name="vertical-center-modal"
    >
      <swiper v-if="viewImgShow" ref="imgSwiper" id="imgSwiper" :options="swiperOptions">
        <swiper-slide v-for="(item,index) in imgList" :key="index">
          <div class="swiper-zoom-container">
            <img :src="item" />
          </div>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
        <div class="swiper-button-next" slot="button-next"></div>
        <div class="swiper-button-prev" slot="button-prev"></div>
      </swiper>
    </Modal>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
export default {
  name: 'view-image',
  props: {
    viewShow: {
      type: Boolean,
      default: true
    },
    imgList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      swiperOptions: {
        zoom: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      }
    }
  },
  created () {},
  mounted () {
    // console.log(this.swiper)
    // this.swiper.init()
  },
  computed: {
    viewImgShow: {
      get () {
        return this.viewShow
      },
      set (val) {
        this.$emit('viewClose', val)
      }
    }
    // swiper () {
    //   return this.$refs.imgSwiper.$swiper
    // }
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
.view-image {
  .vertical-center-modal{
    display: flex;
    align-items: center;
    justify-content: center;

    .ivu-modal{
        top: 0;
    }
}
}
</style>
