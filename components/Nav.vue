<template>
    <div class="nav l">
        <nuxt-link to="/">{{$t('home')}}</nuxt-link>
        <nuxt-link to="/tribes">{{$t('tribes')}}</nuxt-link>
        <nuxt-link to="/tree">{{$t('tree')}}</nuxt-link>
        <nuxt-link to="/ansab">{{$t('ansab')}}</nuxt-link>
        <nuxt-link to="/library">{{$t('library')}}</nuxt-link>
        <nuxt-link to="/blog">{{$t('blog')}}</nuxt-link>
        <nuxt-link to="/about">{{$t('about')}}</nuxt-link>
        <nuxt-link to="/signin">{{$t('signin')}}</nuxt-link>
    </div>
</template>

<i18n lang="yaml">
{
  "en": {
    home: 'Home',
    tribes: 'Tribes',
    tree: 'Genealogy Tree',
    ansab: 'Ilm Ul Ansab',
    library: 'Library',
    blog: 'blog',
    signin: 'Sign In',
    about: 'About'
  },
  "ar": {
    home: 'منزل',
    tribes: 'القبائل',
    tree: 'شجرة الأنساب',
    ansab: 'العلم أنساب',
    library: 'مكتبة',
    blog: 'مدونة',
    signin: 'تسجيل الدخول',
    about: 'حول'
  },
  "ur": {
    home: 'گھر',
    tribes: 'قبائل',
    tree: 'نسل درخت',
    ansab: 'الہام الانصاب',
    library: 'کتب خانہ',
    blog: 'بلاگ',
    signin: 'سائن ان',
    about: 'کے بارے میں'
  }
}
</i18n>

<script>
export default {

}
</script>

<style>

</style>
