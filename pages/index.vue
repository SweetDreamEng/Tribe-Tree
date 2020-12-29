<template>
  <div class="homepage ">
    <SideNav v-if="showNav" :r="routeClass"></SideNav>
    <div class="m-6 flex shadow flex-row justify-start rounded-lg relative block h-full xs:m-3">
      <div class="scarf ml-4 relative xs:hidden">&nbsp;</div>
      <div class="container flex flex-col justify-between lg:items-center md:justify-around">
        <div class="md:hidden"></div>
        <div class="title justify-between flex-row lg:flex-col">
          <div class="left max-w-2xl lg:text-center lg:mb-12">
            <h1 class="ar-font text-6xl text-theme2 lg:text-4xl">إِدَارَةُ نَقَابَةِ السَّادَةِ الْأَشْرَاف</h1>
            <h1 class="text-5xl text-dark lg:text-3xl">Association of Guardianship For the Sadat Al Ashraf</h1>
            <h3 class="text-theme text-lg font-semibold lg:text-base l">{{$t('subtitle')}}</h3>
          </div>
          <div class="right flex-1">
            <div class="flex justify-center items-center">
            <img class="opacity-0 xl2:max-w-lg" src="@/assets/img/particleLogo.png" id="particleLogo" alt="">

            </div>
          </div>
        </div>
        <Nav class="max-w-3xl uppercase justify-between lg:w-full md:hidden flex font-semibold"></Nav>
      </div>
      <!-- <p>Lang test: {{$t('test')}}</p> -->
    </div>
  </div>
</template>

<script>
import Nav from '@/components/Nav.vue'
import LangSwitch from '@/components/LangSwitch.vue'
import SideNav from '@/components/SideNav.vue'
export default {
  components: {
    Nav,
    LangSwitch,
    SideNav
  },
  layout: 'home',
  mounted(){
    console.log(this.$route.name)
    this.initParticles()
    this.checkNav()
  },
  data(){
    return{
      particles: null,
      showNav: false
    }
  },
  methods: {
    checkNav(){
      this.showNav = window.innerWidth <= 800
    },
    initParticles(){
      var getSize = ()=>{
        // return (window.innerWidth > 1400)?'90%': ('70%')
        var w = window.innerWidth
        return Math.floor(588* (w > 1400 ? 0.9: ( w > 1000 ? 0.7 : (0.5))))
      }
      this.particles = new NextParticle({
            image: document.getElementById('particleLogo') ,
            // maxHeight: '90%',
            // maxWidth: '90%',
            // maxHeight: getSize(),
            // maxWidth: getSize(),
            width: getSize(),
            height: getSize(),
            mouseForce: '50',
            gravity: '0.13',
            fadePosition: 'random',
            fadeDirection: 'random',
            initPosition: 'random',
            initDirection: 'random',
            particleSize: 1000,
            particleGap: 2
        })
        window.onresize = ()=> {
          // this.particles.maxHeight = getSize()
          // this.particles.maxWidth = getSize()
          this.particles.height = getSize()
          this.particles.width = getSize()
          this.particles.start();
          this.checkNav()
        };
    },
    
  },
  beforeDestroy(){
      this.particles.stop()
    }
}

</script>

<style lang="scss">

.homepage{
  background: radial-gradient(ellipse at center, #fbfaf7 0%,#fdfcfb 36%,#fcfbf8 100%);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 0;
  box-sizing: content-box;
  .container{
    // display: flex;
    // height: 100vh;
    // flex-direction: column;
    // justify-content: space-between;
    // padding-left: 20px;
    // margin-left: 20px;
  }
  .shadow{
    // box-sizing: border-box;
    box-sizing: content-box;
    height: calc(100vh - 3em);
    box-shadow: 0 0 5px 5px rgba(black, 0.08);
  }
  .scarf{
    width: 77px; //temp
    background: url('../assets/img/scarf.png');
    background-repeat: repeat-y;
    background-position: 0 -80px;
    // background-size: auto 100%;
  }
  .title{
    display: flex;
    align-items: center;
    // justify-content: space-between;
    // max-width: 1000px;
    .left{
      // justify-self: flex-start
    }
  }
  img{
    position: absolute;
  }
  
  .title{
    justify-self: center;
  }
  .nav{
  
  }
}


/* Sample `apply` at-rules with Tailwind CSS
.container {
  @apply min-h-screen flex justify-center items-center text-center mx-auto;
}
*/
</style>

<i18n lang="yaml">
{
  "en": {
    subtitle: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.'
  },
  "ar": {
    subtitle: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.'
  },
  "ur": {
    subtitle: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt.'
  }
}
</i18n>