<template>
    <!-- Tree item for admin editing of the main tree -->
    <!-- Basic tree layout - where the component is recursively used -->
    <li class="tree-item">
        <div
        class="py-1"
        >
        <span :class="{'font-semibold': isFolder, 'text-theme': isRoyal}" @click="toggle">{{ item.nameEn }}</span>
        <span class="year font-semibold mx-2" @click="toggle">{{processDate(item.year)}}</span>
        <!-- <span v-if="isFolder">[{{ isOpen ? '-' : '+' }}]</span> -->
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="8" viewBox="0 0 14 8" class="inline arrow mx-2" v-if="isFolder" @click="toggle">
            <path id="Polygon_1" data-name="Polygon 1" class="cls-1" d="M7,0l7,8H0Z" :transform="`${isOpen ? '0':'translate(14 8) rotate(180)'}`" fill="#057711"/>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="11.651" height="11.594" viewBox="0 0 11.651 11.594" class="inline edit mx-2" @click="$router.push(`/admin/tree/${item.id}`)">
            <g id="pencil-edit-button" transform="translate(-0.001 -1.289)">
                <path id="Path_4167" data-name="Path 4167" d="M7.246,3.224l2.37,2.37-6,6L1.248,9.223Zm4.169-.572L10.357,1.6a1.049,1.049,0,0,0-1.482,0L7.863,2.608l2.37,2.37L11.414,3.8A.808.808,0,0,0,11.414,2.652ZM.007,12.554a.27.27,0,0,0,.326.321l2.641-.64L.606,9.865Z" transform="translate(0)" fill="#057711"/>
            </g>
        </svg>
        <button class="text-sm ml-3 text-theme font-semibold underline" v-if="!isFolder" @click="makeFolder">Add Child</button>
        </div>
        <hr class=" border-grey">
        <ul v-show="isOpen" v-if="isFolder">
        <tree-item
            class="item"
            v-for="(child, index) in item.children"
            :key="index"
            :item="child"
            ref="tl"
            @make-folder="$emit('make-folder', $event)"
            @add-item="$emit('add-item', $event)"
        ></tree-item>
        <li class="add font-bold text-theme text-lg" @click="$emit('add-item', item)">+</li>
        </ul>
    </li>
</template>

<script>
import TreeItem from '@/components/TreeItem.vue'
export default {
    props: {
        item: Object
    },
    name: 'tree-item',
    components: {
        TreeItem
    },
    mounted(){
        console.log(this.item)
    },
    data() {
        return {
            isOpen: false
        }
    },
    computed: {
        isFolder() {
            return this.item.children && this.item.children.length
        },
        isRoyal(){
            return this.item.royal
        }
    },
    methods: {
        toggle() {
        if (this.isFolder) {
            this.isOpen = !this.isOpen
        }
        },
        expand(){
            this.isOpen = true;
            if(this.$refs.tl){
                this.$refs.tl.forEach((tl)=>{
                    tl.expand()
                })
            }
        },
        makeFolder() {
        if (!this.isFolder) {
            this.$emit('make-folder', this.item)
            this.isOpen = true
        }
        },
        processDate(d){
            return (d>=0) ? `${d} AD` : `${-d} BC` 
        },
        edit(){
             
        }
    }
}
</script>

<style lang="scss">
    .tree-item{
    
        .arrow{
            // transform: scale(0.9)
        }
        .edit{
            transform: scale(1.2)
        }
        .year{
            color: rgba(#333, 0.5)
        }
        .btn{
            @apply px-3 py-1;
        }
    }
</style>
