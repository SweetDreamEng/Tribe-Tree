<template>
    <div class="ansab-page h-screen w-screen">
        <div class="h-container v-container">
            <h1 class="title text-5xl font-light text-dark l">{{$t('history')}}</h1>
            <p class="text-xl text-dark mt-12 l">{{$t('historyText')}}</p>
        </div>
    </div>
</template>

<i18n lang="yaml">
{
  "en": {
      history: "History of Sada't Al Ashraf genealogy",
      historyText: "n/a",
  },
  "ar": {
    history: "تاريخ سعادة الأشرف",
      historyText: "n/a",
  },
  "ur": {
      history: "تاریخ سعادت آل اشرف نسب کی",
      historyText: "n/a",
  }
}
</i18n>

<script>
export default {
    layout: 'home'
}
</script>