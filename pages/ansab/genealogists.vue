<template>
    <div class="ansab-page h-screen w-screen">
        <div class="h-container v-container">
            <h1 class="title text-5xl font-light text-dark l">{{$t('genealogists')}}</h1>
            <p class="text-xl text-dark mt-12 l">{{$t('genealogistsText')}}</p>
        </div>
    </div>
</template>

<script>
export default {
    layout: 'home'
}
</script>

<i18n lang="yaml">
{
  "en": {
      genealogists: "Notable Nsaba'h genealogists",
      genealogistsText: "n/a",
  },
  "ar": {
      genealogists: "أشهر علماء الأنساب في النصابة",
      genealogistsText: "n/a",
  },
  "ur": {
      genealogists: "قابل نسب النساء",
      genealogistsText: "n/a",
  }
}
</i18n>