<template>
    <div class="asia h-screen">
        <h1 class="title text-5xl font-light text-dark text-center l">{{$t('asia')}}</h1>
        <SelectTribe region="asia"></SelectTribe>
    </div>
</template>

<i18n lang="yaml">
{
  "en": {
      asia: 'Asia'
  },
  "ar": {
      asia: 'آسيا'
  },
  "ur": {
      asia: 'ایشیا'
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
