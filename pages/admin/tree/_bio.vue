<template>
    <div class="bio t1">
        <h4 class="text-theme font-semibold text-lg mb-6">Node Details</h4>
        <div class="flex flex-row">
            <div class="left flex flex-col w-1/2 max-w-xl mr-5">
                <label>Name (En)</label>
                <input class="inp" type="text" v-model="node.nameEn" :disabled="disabled" placeholder="Enter Name (en)">
                <label>Name (Ar)</label>
                <input class="inp" type="text" v-model="node.nameAr" :disabled="disabled" placeholder="Enter Name (ar)">
                <label>Royal</label>
                <select class="inp" v-model="node.royal" :disabled="disabled">
                    <option :value="true">Yes</option>
                    <option :value="false">No</option>
                </select>
                <label>Year</label>
                <input class="inp" type="number" v-model="node.year" :disabled="disabled">
                <label>Marriage</label>
                <select class="inp" v-model="node.category" :disabled="disabled">
                    <option :value="true">Yes</option>
                    <option :value="false">No</option>
                </select>
                <label v-if="node.category">Select Wife</label>
                <select class="inp" v-if="node.category" @change="onWifeChange($event)" v-model="wifeId">
                    <option v-for="(item, index) in wifes" :key="index" :value="item.value">{{item.name}}</option>
                </select>
                <label>Progeny</label>
                <select class="inp" v-model="node.progeny" :disabled="disabled">
                    <option value="continued">No Progeny Continued</option>
                    <option value="discontinued">Progeny Discontinued</option>
                    <option value="unknown">Unknown Progeny</option>
                </select>
                <label>Tribe</label>
                <select class="inp" v-model="node.tribe" :disabled="disabled" placeholder="None">
                    <option v-for="(tribe, index) in tribes" :key="index" :value="tribe._id">{{tribe.nameEn}}</option>
                </select>
            </div>
            <div class="right w-1/2 max-w-md" v-if="node.royal">
                <label>Image (royal only)</label>
                <img v-if="node.img" :src="`/tree/${node.id}.${node.img}`" class="max-w-xl">
                <dropzone v-if="!disabled" id="drop" ref="drop" :options="dropOptions" v-on:vdropzone-success="fileUpload"></dropzone>
            </div>
        </div>
        
        <button v-if="disabled" class="btn" @click="disabled=false">Edit</button>
        <button v-if="!disabled" class="btn" @click="save">Save</button>
        <button v-if="!deleteConfirm && node.id != 1" class="btn btn-danger float-right" @click="deleteConfirm=true">Delete</button>
        <button v-if="deleteConfirm" class="btn btn-danger float-right" @click="deleteNode">Confirm Delete</button>
        <hr class=" my-12 opacity-25">
        <h4 class="text-theme font-semibold text-lg mb-6">Biography</h4>
        <div style="height: 700px">
            <!-- <label>Bio (en)</label>
            <textarea name="" v-model="bio.descEn" rows="10" :disabled="bioDisabled" class="inp"></textarea>
            <label>Bio (ar)</label>
            <textarea name="" v-model="bio.descAr" rows="10" :disabled="bioDisabled" class="inp"></textarea>
            <label>Bio (ur)</label>
            <textarea name="" v-model="bio.descUr" rows="10" :disabled="bioDisabled" class="inp"></textarea>
            <label>DOD</label>
            <input type="number" v-model="bio.dod" :disabled="bioDisabled" class="inp">
            <label>Files</label>
            <v-client-table :data="bio.files" :columns="columns" :options="options" class="mb-8">
                <span slot="delete" slot-scope="{row}" class="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="11.697" height="11.697" viewBox="0 0 11.697 11.697" @click="removeFile(row)" class="mx-auto close cursor-pointer" v-if="!bioDisabled">
                        <g id="close" transform="translate(-7675.651 -37.651)">
                            <line id="Line_12" data-name="Line 12" x2="10" y2="10" transform="translate(7676.5 38.5)" fill="none" stroke="#057711" stroke-width="2.4"/>
                            <line id="Line_13" data-name="Line 13" y1="10" x2="10" transform="translate(7676.5 38.5)" fill="none" stroke="#057711" stroke-width="2.4"/>
                        </g>
                    </svg>
                </span>
            </v-client-table>
            <button @click="addFile" v-if="!bioDisabled" class="underline text-theme font-semibold">Add file</button> -->
            <vue-editor :disabled="bioDisabled" style="height: 600px" v-model="content"></vue-editor>
        </div>
        <button v-if="bioDisabled" class="btn" @click="bioDisabled=false">Edit</button>
        <button v-if="!bioDisabled" class="btn" @click="updateBio">Save</button>
    </div>
</template>

<script>
import Dropzone from 'nuxt-dropzone'
import 'nuxt-dropzone/dropzone.css'
import { VueEditor } from 'vue2-editor'

export default {
    layout: 'admin',
    components: {
        Dropzone,
        VueEditor
    },
    async asyncData({$axios, params}){
        const nodeData = await $axios.$post('/api', {call: 'getNodeData', payload: {nodeId: params.bio}})
        const wholeNodeData = await $axios.$post('/api', {call: 'getAllNodeData', payload: {}})
        const bioData = await $axios.$post('/api', {call: 'getBio', payload: {nodeId: params.bio}})
        const tribesData = await $axios.$post('/api', {call: 'getTribes'})
        const wifes = []
        const getAllChildName = (data) => {
            const children = data?.children
            if(!!!children) return
            children.forEach(element => {
                wifes.push({name: element?.nameEn, value: element?.id});
                // console.log('element = ', element)
                // console.log('wifes = ', wifes)
                getAllChildName(element);
            });
        };
        // console.log('data = ', nodeData)
        getAllChildName(wholeNodeData)        
        let wifeId = 0
        wifes.forEach((wife, i) => {
            if (wife.value === nodeData.wife_id) {
                wifeId = wife.value
            }
        })
        return {node: nodeData, bio: bioData, tribes: tribesData.tribes, wifes, wifeId}
    },
    methods: {
        save(){
            this.$axios.$post('/api', {call: 'updateNode', payload: {node: {...this.node, wife_id: this.wifeId }, file: (this.node.royal && this.$refs.drop.getAcceptedFiles().length)?this.file:false}}).then((res)=>{
                this.node = res
                this.disabled = true
                this.file = null
            })
        },
        deleteNode(){
            this.$axios.$post('/api', {call: 'deleteNode', payload: {id: this.node.id}}).then((res)=>{
                this.$router.push('/admin/tree')
            })
        },
        fileUpload(file, res){
            this.file = res
        },
        closeModal(){
            this.modal = false
            this.bioFile = null
        },
        bioFileUpload(file,res){this.bioFile = res},
        createBio(){
            this.$axios.$post('/api', {call: 'newBio', payload: {nodeId: this.node.id}}).then((res)=>{
                this.bio = res
            })
        },
        updateBio(){
            if (!!this.bio) {
                this.$axios.$post('/api', {call: 'editBio', payload: {... this.bio, content: this.content}}).then((res)=>{
                    this.bioFile = null
                    this.modal = false
                    this.bio = res
                    this.bioDisabled = true
                })
            } else {
                this.$axios.$post('/api', {call: 'newBio', payload: {nodeId: this.node.id, content: this.content}}).then((res)=>{
                    this.bio = res
                })
            }            
        },
        removeFile(x){
            this.bio.files = this.bio.files.filter(file => file.filename != x.filename)
            this.updateBio()
        },
        addFile(){
            this.modal = true;
        },
        onWifeChange(event) {
            console.log('wife = ', event);
        }
    },
    mounted(){
        console.log(this.bio?.content)
        this.content = this.bio?.content
        // console.log('content ------ ', this.bio.content)
        //setting wifes
    },
    data(){
        return{
            dropOptions: {
                url: '/upload',
                thumbnailWidth: 150,
                maxFilesize: 5,
                maxFiles: 1,
                acceptedFiles: "image/*"
            },
            bioDropOptions: {
                url: '/upload',
                thumbnailWidth: 150,
                maxFilesize: 20,
                maxFiles: 1,
                acceptedFiles: "image/*,application/pdf,video/*"
            },
            file: null,
            bioFile: null,
            disabled: true,
            bioDisabled: true,
            columns: ['type', 'size', 'filename', 'delete'],
            options: {
                headings: {type: 'Type', size: 'Size (b)', filename: 'File Name (on server)', delete: 'Delete'},
                filterable: false
            },
            modal: false,
            deleteConfirm: false,
            content: this.bio?.content
        }
    }
}
</script>

<style lang="scss">
    .bio{
        margin: 50px;
        .inp{
            max-width: 400px;
        }
        textarea{
            max-width: unset !important;
        }
        table tr {
            @apply text-dark;
            &:hover{
                background: none !important;
            }
            cursor: initial !important
        }
        .close{
            transform: scale(1.2);
            right: 50px;
            top: 50px;
        }
    }
</style>
