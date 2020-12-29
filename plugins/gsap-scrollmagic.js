import Vue from 'vue'
import { TweenMax, TimelineMax, Power2, Power1, CSSPlugin } from 'gsap/all'
// import ScrollMagic from 'scrollmagic'
// import SplitText from '../static/SplitText' // any extra plugins
// import 'imports-loader?define=>false!scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap'

const GSAPScrollMagic = {
  install (Vue, options) {
    // GSAP
    Vue.prototype.$GSAP = {
      TweenMax,
      TimelineMax,
      // Sine
      // Linear,
      Power1,
      Power2,
      CSSPlugin
      // Power3,
      // Back,
    //   SplitText
    }
    // ScrollMagic
    // Vue.prototype.$ScrollMagic = {
    //   Controller: new ScrollMagic.Controller(),
    //   Scene: ScrollMagic.Scene
    // }
  }
}

Vue.use(GSAPScrollMagic)
