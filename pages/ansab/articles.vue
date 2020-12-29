<template>
    <div class="ansab-page h-screen w-screen">
        <div class="h-container v-container">
            <h1 class="title text-5xl font-light text-dark l">{{$t('articles')}}</h1>
            <p class="text-xl text-dark mt-12 l">{{$t('articlesText')}}</p>
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
      articles: 'Current affairs / articles',
      articlesText: 'n/a'
  },
  "ar": {
    articles: 'الشؤون الجارية / المقالات',
      articlesText: 'n/a'
  },
  "ur": {
      articles: 'الشؤون الجارية / المقالات',
      articlesText: 'n/a'
  }
}
</i18n>