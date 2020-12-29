<template>
    <div class="selectTribe flex flex-row flex-wrap justify-around">
        <div class="tribe text-center border-solid border rounded border-theme cursor-pointer w-64 m-5" v-for="(tribe, index) in tribes" :key="index" @click="$router.push(`/tribes/${region}/view?id=${tribe._id}`)">
            <h1 class="text-theme font-semibold text-2xl ar-font">{{tribe.nameAr}}</h1>
            <h1 class="text-3xl text-dark font-semibold">{{tribe.nameEn}}</h1>
        </div>
    </div>
</template>

<script>
export default {
    props: ['region'],
    data(){
        return{
            tribes: []
        }
    },
    created(){
        this.$axios.$post('/api', {call: 'getTribes', payload: {region: this.region}}).then((data)=>{
            this.tribes = data.tribes
        })
    }
}
</script>
