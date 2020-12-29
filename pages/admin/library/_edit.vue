<template>
    <!-- form for editing books -->
    <div class="editTribe">
        <div class="flex flex-row">
            <div class="left flex flex-col w-1/2">
                <label>Title</label>
                <input class="inp" type="text" v-model="bookData.title" :disabled="disabled">
                <label>Genre</label>
                <input class="inp" type="text" v-model="bookData.genre" :disabled="disabled">
                <label>Size</label>
                <input class="inp" type="text" v-model="bookData.size" disabled>
            </div>
            <div class="right">
                <label>File</label>
                <img v-if="bookData.preview" :src="bookData.preview" class="max-w-xl">
                <dropzone v-if="!disabled" id="drop" ref="drop" :options="dropOptions" v-on:vdropzone-success="fileUpload"></dropzone>
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
        const data = await $axios.$post('/api', {call: 'getBook', payload: {id: params.edit}})
        return {bookData: data}
    },
    methods: {
        save(){
            this.$axios.$post('/api', {call: 'editBook', payload: {...this.bookData, ...(this.$refs.drop.getAcceptedFiles().length)?{file: this.file}:{}}}).then((res)=>{
                this.bookData = res
                this.disabled = true
            })
        },
        deleteBook(){
            this.$axios.$post('api', {call: 'deleteBook', payload: this.bookData}).then((res)=>{
                this.$router.push('/admin/books')
            })
        },
        fileUpload(file, res){
            this.file = res
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
                url: '/upload',
                thumbnailWidth: 150,
                maxFilesize: 5,
                maxFiles: 1,
                acceptedFiles: "application/pdf"
            },
            deleteConfirm: false,
            file: null
        }
    }
}
</script>

<style lang="scss">
    
</style>

