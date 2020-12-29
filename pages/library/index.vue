<template>
    <div class="library max-h-screen">
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
                <div class="book bg-white rounded-lg shadow-lg p-5 flex flex-col justify-between mb-8 hover:shadow-xl cursor-pointer" v-for="(book, index) in booksP" :key="index" @click="$router.push(`/library/book?id=${book._id}`)">
                    <img :src="`/books/${book._id}_1.jpg`" alt="" class="rounded-lg border-lgrey border-solid border-2 mb-4">
                    <div>
                        <h4 class="font-semibold text-theme2 text-sm">{{book.genre}}</h4>
                        <h4 class="text-base">{{book.title}}</h4>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<i18n lang="yaml">
{
  "en": {
      title: 'Library',
        searchPh: 'Search by book name...'
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
        const data = await $axios.$post('/api', {call: 'getBooks'})
        return {books: data}
    },
    computed: {
        booksP(){
            return this.books.filter(book => book.size && ( (this.searchTerm) ? book.title.includes(this.searchTerm) : true))
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
    .library{
        background: url('../../assets/img/bg5-min.jpg');
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
