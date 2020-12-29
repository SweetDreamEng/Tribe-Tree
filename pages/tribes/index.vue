<template>
    <div class="tribes">
        <div class="container flex flex-col items-center justify-around content-start mx-auto h-screen lg:justify-start v-container">
            <h1 class="title text-5xl font-light text-dark l">{{$t('title')}}</h1>
            <div class="links flex flex-row justify-around w-full lg:justify-start md:flex-col items-center">
                <nuxt-link to="/tribes/middleEast" class="mr-8 md:mr-0">
                    <div class="region text-theme text-3xl font-semibold md:max-w-sm">
                        <h2 class="w-100 text-center l">{{$t('middleEast')}}</h2>
                        <img src="@/assets/img/middleEast.png">
                    </div>
                    </nuxt-link>
                <nuxt-link to="/tribes/asia">
                    <div class="region text-theme text-3xl font-semibold md:max-w-sm">
                        <h2 class="w-100 text-center l">{{$t('asia')}}</h2>
                        <img src="@/assets/img/asia.png">
                    </div>
                </nuxt-link>
            </div>
        </div>
    </div>
</template>

<i18n lang="yaml">
{
  "en": {
      middleEast: 'Middle East',
      asia: 'Asia',
      title: 'Tribes'
  },
  "ar": {
      middleEast: 'الشرق الأوسط',
        title: 'القبائل',
      asia: 'آسيا'
  },
  "ur": {
        middleEast: 'مشرق وسطی',
        title: 'قبائل',
      asia: 'ایشیا'
  }
}
</i18n>

<script>
export default {
    layout: 'home',
    mounted(){
        console.log(this.$route.name)
    }
}
</script>

<style lang="scss">
    .region img{
        &:hover{
            // box-shadow: #057711 5px 5px 5px 5px;
            filter: drop-shadow(0px 0px 5px rgba(#057711, 0.2));
        }
    }
    .tribes{
        background: url('../../assets/img/bg7.svg');
        background-size: cover;
    }
    .region h2{
        transform: translateY(100px);
        z-index: 100;
    }
    .middleEast, .asia, .tribeView{
        background: url('../../assets/img/bg4-min.jpg');
        background-position: 50% 50%;
        background-size: cover;
        .title{
            padding-top: 120px;
        }
    }
</style>
