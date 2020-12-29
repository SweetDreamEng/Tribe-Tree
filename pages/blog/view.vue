<template>
    <div class="blogView h-screen w-screen">
        <div class="h-container flex flex-row justify-between lg:flex-col">
            <div class="flex flex-col blog-container">
                <h3 class="font-thin text-theme text-2xl">| {{blogData.genre}}</h3>
                <h2 class="text-6xl font-thin l text-center">{{blogData.title}}</h2>
                <img :src="blogData.img" alt="" class="lg:mt-12" width="100%">
                <h4 class="font-thin text-theme text-2xl">1st December 2020</h4>
                <h4 class="font-thin text-2xl">By {{blogData.author}}</h4><br>
                <p class="text-dark text-lg l" style="margin-right:20px;">{{blogData.content}}</p>         
            </div>          
        </div>
    </div>
</template>

<script>
export default {
    layout: 'home',
    data(){
        return{
            blogData: {}
        }
    },
    created(){
        if(this.$route.query.id){
            this.$axios.$post('/api', {call: 'getBlog', payload: {id: this.$route.query.id}}).then((data)=>{
                this.blogData = data
            })
        }else{
            // this.$router.push(`/tribes/${this.$route.path.split('/')[2]}`)
        }
        
    }
}
</script>

<style lang="scss">
    .blogView{
        background: url('../../assets/img/bg1.jpg');
        background-position: 50% 50%;
        padding-top: 150px;
    }
    .blog-container {
        width: 60%;
        margin: 0 auto;
    }
</style>


<i18n lang="yaml">
{
  "en": {
      view: 'View in genealogy tree'
  },
  "ar": {
      view: 'عرض في شجرة الأنساب'
  },
  "ur": {
      view: 'نسل درخت میں دیکھیں'
  }
}
</i18n>