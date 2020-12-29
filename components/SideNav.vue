<template>
    <div class="s-nav">
        <div class="h-wrap" :class="containerClass">
            <div class="hamburger" @click="active = !active" :class="(active) ? 'is-active' : ''" :style="`right:${right}px`">
                <span class="line"></span>
                <span class="line"></span>
                <span class="line"></span>
            </div>
        </div>
        
        <transition name="mask">
            <div class="screen-mask" v-if="active" @click="active = false"></div>
        </transition>
        <transition :css="false" mode="out-in" @enter="enter" @leave="leave">
            <div class="side-nav text-5xl w-500p xs:w-full" v-if="active">
                <Nav @click="active = false" class="flex flex-col justify-between py-24 px-12 font-light"></Nav>
            </div>
        </transition>
    </div>
</template>

<script>
import Nav from '@/components/Nav.vue'
export default {
    props: [
        'r'
    ],
    data(){
        return{
            active: false,
            right: 50
        }
    },
    mounted(){
        var x = document.querySelector('.langSwitch').getBoundingClientRect().left
        this.right = (this.$route.name == 'index' && window.innerWidth > 500)? x-50:x
    },
    components: {
        Nav
    },
    computed: {
        containerClass(){
            return (this.r == 'h-index') ? '' : 'h-container'
        }
    },
    methods: {
        enter(el, done){
            this.$GSAP.TweenMax.fromTo(el, 0.2, {css:{x: el.clientWidth, opacity: 0.2}}, {css:{x: 0, opacity: 1}, onComplete: done})
        },
        leave(el, done){
            this.$GSAP.TweenMax.to(el, 0.2, {css:{x: el.clientWidth, opacity: 0.2}, onComplete: done})
        }
    },
    watch: {
        $route(){
            this.active = false
        }
    }
}
</script>

<style lang="scss">
.mask-enter-active, .mask-leave-active {
  transition: all .1s ease-out;
}
.mask-enter, .mask-leave-active {
  opacity: 0;
}
.h-wrap{
      position: fixed;
    }

    // .h-container{
    //   .hamburger{
    //     right: 0;
    //     position: relative;
    //   }
    // }
.hamburger{
    width: 50px;
    position: fixed;
    z-index: 100;
    right: 50px;
    top: 50px;
}
.h-wrap{
    z-index: 100;
}
.screen-mask{
    position: absolute;
    z-index: 15;
    width: 100%;
    height: 100%;
    background: rgba(black, 0.1);
}
.side-nav{
    position: fixed;
    background: #FBF9F6;
    height: 100%;
    // width: 500px;
    right: 0;
    z-index: 16;
    font-weight: 400;
    box-sizing: border-box;
    .nav{
        min-height: 80%;
        .nuxt-link-exact-active{
            @apply font-normal;
        }
    }
}
.hamburger .line{
  width: 50px;
  height: 3px;
  background: #05560D;
  stroke-width: 3px;
  display: block;
  margin: 8px auto;
  transition: all 0.3s ease-in-out;
  border-radius: 2px;
  &:nth-child(2){
      width: 35px;
      margin-left: 15px;
  }
  &:nth-child(3){
      width: 17px;
      margin-left: 33px;
  }
}
.hamburger.is-active .line:nth-child(1){
  opacity: 0;
  transform: translateX(-100%);
}

.hamburger.is-active .line:nth-child(3){
  opacity: 0;
  transform: translateX(100%);
}
.hamburger:hover{
  cursor: pointer;
  text-align: right;
}
</style>
