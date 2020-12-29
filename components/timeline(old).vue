<template>
    <div class="timeline" ref="timeline">
        <div class="resizable" ref="el" :style="style">
        <!-- <vue-draggable-resizable :h="height" :w="45.5" @resize="onResize" :parent="true" :draggable="false"> -->
            <div class="handle-top" ref="handleTop" @mousedown="startDrag($event, 0)" @mousemove="drag($event, 0)">
                <svg width="45.5" height="30">
                    <line x1="0" x2="45.5" stroke-linecap="round"/>
                </svg>
                <span></span>
            </div>
            <div class="handle-bottom" ref="handleBottom" @mousedown="startDrag($event, 1)" @mousemove="drag($event, 1)">
                <svg width="45.5" height="30" style="transform: translateY(30px)">
                    <line x1="0" x2="45.5" stroke-linecap="round"/>
                </svg>
                <span></span>
            </div>
        <!-- </vue-draggable-resizable> -->
        </div>
    </div>
</template>

<script>
// import VueDraggableResizable from 'vue-draggable-resizable'
export default {
    // components: {VueDraggableResizable},
    data(){
        return{
            dragging: [false, false],
            dy: [null, null],
            my: [null, null],
            y: [null, null],
            isMounted: false,
            style: ""
        }
    },
    methods: {
        startDrag(event, index){
            this.dragging[index] = true;
            this.my[index] = event.clientY;
        },
        stopDrag(index){
            this.dragging = [false, false];
            this.dy = [null, null];
        },
        drag(event, index){
            if (this.dragging[index]) {
                var height = this.$refs.timeline.clientHeight;                
                var ny = this.y[index] + (event.clientY - this.my[index]);
                this.y[index] = (0 < ny < height) ? ny : this.y[index]
                this.style = `height: ${(this.y[1] - this.y[0])*100/height}%; top: ${this.y[0]*100/height}%`
                // this.$refs.el.style.height = this.y[1] - this.y[0] + 'px'
                // this.$refs.el.style.top = this.y[0] + 'px'
            }
        }
    },
    mounted(){
        this.isMounted = true;
        this.y = [0, this.$refs.timeline.clientHeight]
        window.addEventListener('mouseup', this.stopDrag);
    }
}
</script>

<style lang="scss">
    .timeline{
        background: rgba(#ECECEC, 0.76);
        width: 40px;
        height: 100%;
        .resizable{
            background: rgba(#2ACF3B, 0.07);
            position: relative;
            resize: vertical;
            height: 100%;
            // transition: all 0.01s;
        }
        .handle-bottom, .handle-top{
            position: absolute;
            z-index: 100;
            cursor: ns-resize;
            // height: 20px;
        }
        .handle-top{
            top: 0;
        }
        .handle-bottom{
            bottom: 0;
        }
        line{
            stroke: rgba(#05560D, 0.8);
            stroke-width:8;
        }
    }
</style>
