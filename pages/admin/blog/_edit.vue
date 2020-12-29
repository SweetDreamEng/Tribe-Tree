<template>
    <!-- form for editing books -->
    <div class="editTribe">
        <div class="flex flex-row">
            <div class="left flex flex-col w-1/2">
                <label>Title</label>
                <input class="inp" type="text" v-model="blogData.title" :disabled="disabled">
                <label>Genre</label>
                <input class="inp" type="text" v-model="blogData.genre" :disabled="disabled">
                <label>Content</label>
                <input class="inp" type="text" v-model="blogData.content" :disabled="disabled">
            </div>
            <div class="right">
                <label>Image</label>
                <img v-if="blogData.img" :src="blogData.img" class="max-w-xl">
                <dropzone v-if="!disabled" id="drop" ref="drop" :options="dropOptions"></dropzone>
            </div>

        </div>
        <button v-if="disabled" class="btn" @click="disabled=false">Edit</button>
        <button v-if="!disabled" class="btn" @click="save">Save</button>
        <button v-if="!disabled && !deleteConfirm" class="btn btn-danger float-right" @click="deleteConfirm = true">Delete Book</button>
        <button v-if="!disabled && deleteConfirm" class="btn btn-danger float-right" @click="deleteBook">Confirm Delete</button>
    </div>
</template>

<script>
import Dropzone from 'nuxt-dropzone'
import 'nuxt-dropzone/dropzone.css'
export default {
    layout: 'admin',
    components: {
        Dropzone
    },
    async asyncData({$axios, params}){
        const data = await $axios.$post('/api', {call: 'getBlog', payload: {id: params.edit}})
        return {blogData: data}
    },
    methods: {
        save(){
            this.$axios.$post('/api', {call: 'editBlog', payload: {...this.blogData, ...(this.$refs.drop.getAcceptedFiles().length)?{img: this.$refs.drop.getAcceptedFiles()[0].dataURL}:{}}}).then((res)=>{
                this.blogData = res
                this.disabled = true
            })
        },
        deleteBook(){
            this.$axios.$post('api', {call: 'deleteBlog', payload: this.blogData}).then((res)=>{
                this.$router.push('/admin/blogs')
            })
        }
    },
    created(){
        if(this.$route.query.e){
            this.disabled = false
        }
    },
    data(){
        return{
            disabled: true,
            dropOptions: {
                url: 'https://httpbin.org/post',
                thumbnailWidth: 150,
                maxFilesize: 5,
                maxFiles: 1
            },
            deleteConfirm: false
        }
    }
}
</script>

<style lang="scss">
    
</style>