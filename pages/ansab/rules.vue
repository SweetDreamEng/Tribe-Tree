<template>
    <div class="h-screen w-screen ansab-page">
        <div class="h-container v-container">
            <h1 class="title text-5xl font-light text-dark l">{{$t('rules')}}</h1>
            <p class="text-xl text-dark mt-12 l">{{$t('rulesText')}}</p>
        </div>
    </div>
</template>

<i18n lang="yaml">
{
  "en": {
      rules: 'Rules of genealogy',
      rulesText: "n/a",
  },
  "ar": {
    rules: 'قواعد الأنساب',
      rulesText: "n/a",
  },
  "ur": {
      rules: 'نسب نامہ',
      rulesText: "n/a",
  }
}
</i18n>

<script>
export default {
    layout: 'home'
}
</script>