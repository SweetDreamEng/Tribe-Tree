<template>
    <div class="ansab h-screen w-screen">
        <div class="v-container h-container l">
            <h1 class="title text-5xl font-light text-dark mb-12">{{$t('title')}}</h1>
            <nuxt-link class="ansab-link" to="/ansab/rules">{{$t('rules')}}</nuxt-link>
            <nuxt-link class="ansab-link" to="/ansab/history">{{$t('history')}}</nuxt-link>
            <nuxt-link class="ansab-link" to="/ansab/genealogists">{{$t('genealogists')}}</nuxt-link>
            <nuxt-link class="ansab-link" to="/ansab/articles">{{$t('articles')}}</nuxt-link>
        </div>
    </div>
</template>

<i18n lang="yaml">
{
  "en": {
      title: 'Ilm Ul Ansab',
        rules: 'Rules of genealogy',
        history: "History of Sada't Al Ashraf genealogy",
        genealogists: "Notable Nsaba'h genealogists",
        articles: 'Current affairs / articles'
  },
  "ar": {
    title: 'العلم أنساب',
        rules: 'قواعد الأنساب',
        history: "تاريخ سعادة الأشرف",
        genealogists: "أشهر علماء الأنساب في النصابة",
        articles: 'الشؤون الجارية / المقالات',
  },
  "ur": {
      title: 'الہام الانصاب',
        rules: 'نسب نامہ',
        history: "تاریخ سعادت آل اشرف نسب کی",
        genealogists: "قابل نسب النساء",
        articles: 'موجودہ معاملات / مضامین',
  }
}
</i18n>

<script>
export default {
    layout: 'home'
}
</script>

<style>
    .ansab, .ansab-page{
        background: url('../../assets/img/bg6-min.jpg');
        background-size: cover;
        background-position: 50% 50%;
    }
    .ansab-link{
        transition: 0.2s all;
        @apply text-theme text-3xl block my-8 opacity-75 font-normal;
        &:hover{
            @apply opacity-100
        }
    }
</style>
