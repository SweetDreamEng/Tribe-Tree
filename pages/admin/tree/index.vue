<template>
    <!-- Editing main tree - based off a file-tree - hence the references to folders -->
    <div class="admin-tree t1 relative">
        <tree-item
            class="item"
            :item="tree.data"
            ref="tl"
            @make-folder="makeFolder"
            @add-item="addItem"
        ></tree-item>

        <button class="btn text-sm absolute expand" @click="expandAll">Expand All</button>

        <div class="modalContainer w-screen h-screen fixed flex content-center justify-center top-0 left-0" v-if="modal">
            <div class="modal m-auto rounded p-12 flex flex-col">
                <svg xmlns="http://www.w3.org/2000/svg" width="11.697" height="11.697" viewBox="0 0 11.697 11.697" @click="closeModal" class="absolute close cursor-pointer">
                    <g id="close" transform="translate(-7675.651 -37.651)">
                        <line id="Line_12" data-name="Line 12" x2="10" y2="10" transform="translate(7676.5 38.5)" fill="none" stroke="#057711" stroke-width="2.4"/>
                        <line id="Line_13" data-name="Line 13" y1="10" x2="10" transform="translate(7676.5 38.5)" fill="none" stroke="#057711" stroke-width="2.4"/>
                    </g>
                </svg>
                <label class="italic text-dark opacity-50">Name (En)</label>
                <input type="text" class="inp my-5" placeholder="Enter descendants name" v-model="newNodeName">
                <label class="italic text-dark opacity-50">DOB (Year)</label>
                <input type="number" :min="currentParent.year" @blur="checkInput" class="inp my-5" placeholder="Enter descendants DOB" v-model="newNodeYear">
                <button class="btn" @click="newNode">Submit</button>
            </div>
        </div>

        <!-- <button @click="updateTree">update</button> -->
    </div>
</template>

<script>
import TreeItem from '@/components/TreeItem.vue'
export default {
    layout: 'admin',
    async asyncData({ $axios }){
        const data = await $axios.$post('/api', {call: 'getMainTree'})
        return {tree: data.tree}
    },
    data() {
        return{
            newNodeName: "",
            newNodeYear: null,
            modal: false,
            currentParent: {nameEn: null, year: 0},
        }
    },
    components: {
        TreeItem
    },
    methods: {
        makeFolder(item) {
            this.addItem(item)
        },
        addItem(item) {
            this.modal = true
            this.currentParent = item
        },
        expandAll(){
            this.$refs.tl.expand()
        },
        closeModal(){
            this.modal = false;
            this.newNodeName = "";
            this.newNodeYear = null;
        },
        newNode(){
            this.currentParent.children.push({
                nameEn: this.newNodeName,
                year: this.newNodeYear,
                royal: true, //temp
                id: this.currentParent.id + this.currentParent.children.length,
                children: []
            })
            this.updateTree()
            this.closeModal()
        },
        checkInput(){
            this.newNodeYear = (this.newNodeYear <= this.currentParent.year)?this.currentParent.year:this.newNodeYear
        },
        updateTree(){
            this.$axios.$post('/api', {call: 'updateTree', payload: {tree: this.tree}}).then((res)=>{

            })
        }
    }
}

</script>

<style lang="scss">

.admin-tree{
    margin: 50px;
    .item {
        cursor: pointer;
    }
    .modal{
        // min-width: 300px;
        max-width: 500px;
        width: 100%;
        box-sizing: content-box;
        position: relative;
    }
    .bold {
        font-weight: bold;
    }
    ul {
        padding-left: 1em;
        line-height: 1.5em;
        list-style: none;
    }
    li{
        list-style: none;
    }
    .expand{
        top: 0;
        right: 0;
    }
    .close{
        right: 30px;
        top: 30px;
        transform: scale(1.3);
        opacity: 0.7;
        &:hover{
            opacity: 1;
        }
    }
    // tr:nth-child(even) {
}
</style>
