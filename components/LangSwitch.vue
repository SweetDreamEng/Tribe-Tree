<template>
  <!-- Switches i18n lang -->
  <div :class="containerClass" class="langWrap z-50">
    <div class="langSwitch text-theme mx-auto p-2 rounded" :class="r" @click="a">
      <span class="ar-font hover:font-extrabold" :class="active('ar')" @click="$i18n.locale = 'ar'">عربى</span><span class="opacity-50 select-none">|</span>
      <span class="hover:font-semibold" :class="active('en')" @click="$i18n.locale = 'en'">en</span><span class="opacity-50 select-none">|</span>
      <span class="ar-font hover:font-extrabold" :class="active('ur')" @click="$i18n.locale = 'ur'">اردو</span>
    </div>
  </div>
</template>


<script>
export default {
  props: [
    'r'
  ],
  methods: {
    active(lang){
      return (this.$i18n.locale == lang) ? "active":""
    },
    a(){
      // console.log(this.$t('nav.home'))
    }
  },
  computed: {
    containerClass(){
      return (this.r == 'h-index') ? '' : 'h-container'
    }
  }
  // mounted(){
  //   console.log(this)
  // }
}
</script>



<style lang="scss">
    .langSwitch{
      .active{
        @apply font-semibold underline;
      }
      span{
        @apply mx-2
      }
    }
    .langWrap{
      position: fixed;
      left: 50%;
      transform: translateX(-50%);
      // top: 0;
      // position: relative;
      // background: none;
      width: 100vw;
    }
    .h-container{
      .langSwitch{
        // top: 0;
        // top: unset;
        top: 50px;
        left: unset;
        // position: relative;
      }
    }
    @media only screen and (max-width: 500px){
      .langSwitch{
        left: 30px !important;
      }
    }
    .langSwitch{
      background: rgba(black, 0.02);
      // min-width: 100px;
      text-align: center;
      position: fixed;
      left: 150px;
      box-sizing: border-box !important;
      // top: 0;
      &.h-index{
        top: calc(4rem - 10px);
        left: calc(110px + 4rem);
      }
      .ar-font{
      }
      span:not(.opacity-50){
        @apply cursor-pointer;
      }
    }
</style>
