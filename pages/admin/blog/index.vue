<template>
    <!-- lists blogs in the database -->
    <div class="adminBlog t1">
        <v-client-table :data="blogs" :columns="columns" :options="options" @row-click="editBlog"></v-client-table>
        <button class="btn" @click="modal = true">+</button>
        <div class="modalContainer w-screen h-screen fixed flex content-center justify-center top-0 left-0" v-if="modal">
            <div class="modal m-auto rounded p-12 flex flex-col">
                <label class="italic text-dark opacity-50">Blog Title</label>
                <input type="text" class="inp my-5" placeholder="Enter blog title" v-model="newBlogTitle">
                <button class="btn" @click="newBlog">Submit</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    layout: 'admin',
    async asyncData({ $axios }){
        const data = await $axios.$post('/api', {call: 'getBlogs'})
        return {blogs: data}
    },
    methods: {
        editBlog(e){
            this.$router.push(`/admin/blog/${e.row._id}`)
        },
        newBlog(){
            this.$axios.$post('/api', {call: 'newBlog', payload: {title: this.newBlogTitle}}).then((res)=>{
                this.newBlogTitle = null
                this.modal = false
                this.$router.push(`/admin/blog/${res._id}?e=true`)
            })
        }
    },
    data(){
        return{
            columns: ['title', 'genre', 'author','created'],
            options: {
                headings: {title: 'Title', genre: 'Genre', author: 'Author', created: 'Created'},
                filterable: false
            },
            modal: false,
            newBlogTitle: null
        }
    }
}
</script>

<style>

</style>