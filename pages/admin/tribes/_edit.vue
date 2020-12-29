<template>
    <!-- Edit tribe details -->
    <div class="editTribe t1">
        <div class="flex flex-row">
            <div class="left flex flex-col w-1/2">
                <label>Name (en)</label>
                <input class="inp" type="text" v-model="tribeData.nameEn" :disabled="disabled">
                <label>Name (ar)</label>
                <input class="inp" type="text" v-model="tribeData.nameAr" :disabled="disabled">
                <label>Region</label>
                <select class="inp" type="text" v-model="tribeData.region" :disabled="disabled">
                    <option value="asia">Asia</option>
                    <option value="middleEast">Middle East</option>
                </select>
                <label>Type</label>
                <input class="inp" type="text" v-model="tribeData.type" :disabled="disabled">
                <label>Description (en)</label>
                <textarea class="inp" v-model="tribeData.descEn" :disabled="disabled"></textarea>
                <label>Description (ar)</label>
                <textarea class="inp" v-model="tribeData.descAr" :disabled="disabled"></textarea>
                <label>Description (ur)</label>
                <textarea class="inp" v-model="tribeData.descUr" :disabled="disabled"></textarea>
                <label>Tribe Leader</label>
                <select class="inp" v-model="tribeData.leader" :disabled="disabled">
                    <option v-for="(member, index) in tribeMembers" :key="index" :value="member.id">{{member.nameEn}}</option>
                </select>
            </div>
            <div class="right">
                <label>Image</label>
                <img v-if="tribeData.img" :src="tribeData.img" class="max-w-xl">
                <dropzone v-if="!disabled" id="drop" ref="drop" :options="dropOptions"></dropzone>
            </div>
        </div>
        <button v-if="disabled" class="btn" @click="disabled=false">Edit</button>
        <button v-if="!disabled" class="btn" @click="save">Save</button>
        <button v-if="!disabled && !deleteConfirm" class="btn btn-danger float-right" @click="deleteConfirm = true">Delete Tribe</button>
        <button v-if="!disabled && deleteConfirm" class="btn btn-danger float-right" @click="deleteTribe">Confirm Delete</button>
    </div>
</template>

<script>
import Dropzone from 'nuxt-dropzone'
import 'nuxt-dropzone/dropzone.css'
import { VueEditor } from "vue2-editor";

export default {
    layout: 'admin',
    components: {
        Dropzone
    },
    async asyncData({$axios, params}){
        const data = await $axios.$post('/api', {call: 'getTribeData', payload: {id: params.edit}})
        const members = await $axios.$post('/api', {call: 'getTribeMembers', payload: {_id: params.edit}})
        return {tribeData: data, tribeMembers: members}
    },
    methods: {
        save(){
            this.$axios.$post('/api', {call: 'editTribe', payload: {...this.tribeData, ...(this.$refs.drop.getAcceptedFiles().length)?{img: this.$refs.drop.getAcceptedFiles()[0].dataURL}:{}}}).then((res)=>{
                this.tribeData = res
                this.disabled = true
            })
        },
        deleteTribe(){
            this.$axios.$post('api', {call: 'deleteTribe', payload: this.tribeData}).then((res)=>{
                this.$router.push('/admin/tribes')
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
            deleteConfirm: false,
            content: 'ddd'
        }
    }
}
</script>

<style lang="scss">
    .editTribe{
        .inp{
            max-width: 400px;
        }
    }
</style>

