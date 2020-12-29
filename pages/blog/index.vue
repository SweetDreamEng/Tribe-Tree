<template>
    <div class="blog max-h-screen">
        <div class="h-container items-center justify-around content-start h-screen v-container">
            <div class="row flex flex-row content-center mb-8 lg:flex-col">
                <h1 class="title text-5xl font-light text-dark l">{{$t('title')}}</h1>
                <div class="relative my-auto ml-12 w-5/12 lg:w-full lg:ml-0">
                    <input class="inp w-full m-0 l" type="text" :placeholder="$t('searchPh')" v-model="searchTerm">
                    <img src="@/assets/img/search.svg" alt="" class="absolute searchIcon">
                    <!-- <svg></svg> -->
                </div>
            </div>
            <div class="row flex-row flex justify-around flex-wrap books overflow-y-scroll">
                <div class="book bg-white rounded-lg shadow-lg p-5 flex flex-col justify-between mb-8 hover:shadow-xl cursor-pointer" v-for="(blog, index) in blogsP" :key="index" @click="$router.push(`/blog/view?id=${blog._id}`)">
                    <img :src="blog.img" alt="" class="rounded-lg border-lgrey border-solid border-2 mb-4" width="430" height="240">
                    <div>
                        <h4 class="font-semibold text-theme2 text-sm">By: {{blog.author}}</h4>
                        <h4 class="text-base">{{blog.title}}</h4>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<i18n lang="yaml">
{
  "en": {
      title: 'Blog',
        searchPh: 'Search by blog title...'
  },
  "ar": {
    title: 'مكتبة',
        searchPh: 'البحث عن طريق اسم الكتاب'
  },
  "ur": {
      title: 'کتب خانہ',
        searchPh: 'کتاب کے نام سے تلاش کریں'
  }
}
</i18n>

<script>
export default {
    layout: 'home',
    async asyncData({ $axios }){
        const data = await $axios.$post('/api', {call: 'getBlogs'})
        return {blogs: data}
    },
    computed: {
        blogsP(){
            return this.blogs.filter(blog => blog.content && ( (this.searchTerm) ? blog.title.includes(this.searchTerm) : true))
        }
    },
    data(){
        return{
            searchTerm: null
        }
    }
}
</script>

<style lang="scss">
    .blog {
        background: url('../../assets/img/bg1.jpg');
        background-size: cover;
        background-position: 50% 50%;
        .searchIcon{
            top: 0.5em;
            right: 0.8em;
        }
        .book{
            margin-right: 2em;
        }
        .books{
            margin-right: -2em;
            max-height: calc(100vh - (170px + 6em)); //Will need to be adjusted in media qs
        }
    }
</style>
