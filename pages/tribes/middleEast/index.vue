<template>
    <div class="middleEast h-screen">
        <h1 class="title text-5xl font-light text-dark text-center l">{{$t('middleEast')}}</h1>
        <SelectTribe region="middleEast"></SelectTribe>
    </div>
</template>

<i18n lang="yaml">
{
  "en": {
      middleEast: 'Middle East'
  },
  "ar": {
      middleEast: 'الشرق الأوسط',
  },
  "ur": {
        middleEast: 'مشرق وسطی',
  }
}
</i18n>

<script>
import SelectTribe from '@/components/SelectTribe'
export default {
    layout: 'home',
    components: {
        SelectTribe
    }
}
</script>


<style scoped>
    .title{
        padding-top: 120px;
    }
</style>
