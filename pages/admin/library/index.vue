<template>
    <!-- lists books in the database -->
    <div class="adminLibrary t1">
        <v-client-table :data="books" :columns="columns" :options="options" @row-click="editBook"></v-client-table>
        <button class="btn" @click="modal = true">+</button>
        <div class="modalContainer w-screen h-screen fixed flex content-center justify-center top-0 left-0" v-if="modal">
            <div class="modal m-auto rounded p-12 flex flex-col">
                <label class="italic text-dark opacity-50">Book Title</label>
                <input type="text" class="inp my-5" placeholder="Enter book title" v-model="newBookTitle">
                <button class="btn" @click="newBook">Submit</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    layout: 'admin',
    async asyncData({ $axios }){
        const data = await $axios.$post('/api', {call: 'getBooks'})
        return {books: data}
    },
    methods: {
        editBook(e){
            this.$router.push(`/admin/library/${e.row._id}`)
        },
        newBook(){
            this.$axios.$post('/api', {call: 'newBook', payload: {title: this.newBookTitle}}).then((res)=>{
                this.newBookTitle = null
                this.modal = false
                this.$router.push(`/admin/library/${res._id}?e=true`)
            })
        }
    },
    data(){
        return{
            columns: ['title', 'genre', 'size'],
            options: {
                headings: {title: 'Title', genre: 'Genre', size: 'Size'},
                filterable: false
            },
            modal: false,
            newBookTitle: null
        }
    }
}
</script>

<style>

</style>
