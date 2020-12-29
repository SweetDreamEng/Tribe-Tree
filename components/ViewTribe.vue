<template>
    <div class="tribe tribeView h-screen w-screen">
        <div class="h-container flex flex-row justify-between lg:flex-col">
            <div class="flex flex-col">
                <nuxt-link :to="`/tribes/${$route.path.split('/')[2]}`"><img src="@/assets/img/back.svg" alt="" style="margin-bottom:20px;"></nuxt-link>
                <h3 class="font-semibold text-theme text-2xl">{{tribeData.type}}</h3>
                <h1 class="text-6xl font-thin l">{{($i18n.locale == 'en')?tribeData.nameEn:tribeData.nameAr}}</h1>
                <p class="text-dark text-lg l" style="margin-right:20px;">{{($i18n.locale == 'en')?tribeData.descEn:(($i18n.locale == 'ar')?tribeData.descAr:tribeData.descUr)}}</p><br>
                <nuxt-link class="text-xl font-semibold underline hover:text-theme2 text-theme" :to="`/tree?tribe=${tribeData._id}`">{{$t('view')}}</nuxt-link>
            </div>
            <img :src="tribeData.img" alt="" class=" max-w-2xl xl:max-w-lg lg:mt-12" width="410" height="410">
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            tribeData: {}
        }
    },
    created(){
        if(this.$route.query.id){
            this.$axios.$post('/api', {call: 'getTribeData', payload: {id: this.$route.query.id}}).then((data)=>{
                this.tribeData = data
            }).catch(()=>{
                this.$router.push(`/tribes/${this.$route.path.split('/')[2]}`)
            })
        }else{
            this.$router.push(`/tribes/${this.$route.path.split('/')[2]}`)
        }
        
    }
}
</script>

<style lang="scss">
    .tribeView{
        padding-top: 150px;
    }
</style>


<i18n lang="yaml">
{
  "en": {
      view: 'View in genealogy tree'
  },
  "ar": {
      view: 'عرض في شجرة الأنساب'
  },
  "ur": {
      view: 'نسل درخت میں دیکھیں'
  }
}
</i18n>