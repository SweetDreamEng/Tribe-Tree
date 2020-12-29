<template>
    <div class="adminTribes t1">
        <!-- <div v-for="(tribe, index) in tribes" :key="index">{{tribe.nameAr}}</div> -->
        <v-client-table :data="tribes" :columns="columns" :options="options" @row-click="editTribe">
            <span slot="region" slot-scope="{row}" v-if="row.region">
                {{(row.region == 'asia') ? "Asia" : "Middle East"}}
            </span>
        </v-client-table>
        <button class="btn" @click="modal = true">+</button>
        <div class="modalContainer w-screen h-screen fixed flex content-center justify-center top-0 left-0" v-if="modal">
            <div class="modal m-auto rounded p-12 flex flex-col">
                <label class="italic text-dark opacity-50">Name (en)</label>
                <input type="text" class="inp my-5" placeholder="Enter new tribe name" v-model="newTribeName">
                <button class="btn" @click="newTribe">Submit</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    layout: 'admin',
    async asyncData({ $axios }){
        const data = await $axios.$post('/api', {call: 'getTribesAdmin'})
        return {tribes: data}
    },
    methods: {
        editTribe(e){
            this.$router.push(`/admin/tribes/${e.row._id}`)
        },
        newTribe(){
            this.$axios.$post('/api', {call: 'newTribe', payload: {nameEn: this.newTribeName}}).then((res)=>{
                this.newTribeName = null
                this.modal = false
                this.$router.push(`/admin/tribes/${res._id}?e=true`)
            })
        }
    },
    data(){
        return{
            columns: ['nameEn', 'nameAr', 'region', 'type'],
            options: {
                headings: {nameEn: 'Name', nameAr: 'Name (ar)', region: 'Region', type: 'Type'},
                filterable: false
            },
            modal: false,
            newTribeName: null
        }
    }
}
</script>

<style lang="scss">
    .adminTribes{
        margin: 50px;
    }
    
    .VuePagination__count{
        @apply text-dark italic opacity-50
    }
</style>
