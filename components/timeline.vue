<template>
    <div class="timeline" ref="timeline">
        <!-- Using vue-draggable-resizable npm module for timeline -->
        <vue-draggable-resizable ref="resizable" :h="height" :y="initialY" :w="width" :parent="true" @dragging="drag" :draggable="true" active="active" :handles="['tm','bm']" @resizing="resize" :preventDeactivation="true" :key="update">
            <div class="handle-top handle-tm" slot="tm">
                <svg :width="width + 5.5" height="30">
                    <line x1="0" :x2="width + 5.5" stroke-linecap="round"/>
                </svg>
                <span>{{processDate(dateRange[0])}}</span>
            </div>
            <div class="handle-top handle-bm" style="display:block;" slot="bm">
                <svg :width="width + 5.5" height="30" style="transform: translateY(30px)">
                    <line x1="0" :x2="width + 5.5" stroke-linecap="round" />
                </svg>
                <span>{{processDate(dateRange[1])}}</span>
            </div>
        </vue-draggable-resizable>
    </div>
</template>

<script>
import VueDraggableResizable from 'vue-draggable-resizable'
export default {
    components: {VueDraggableResizable},
    props: ['start', 'end', 'startRange'],
    data(){
        return{
            height: 350,
            initialY: 0,
            isMounted: false,
            width: 40,
            update: 0,
            y: [0, 1],
            active: true,
            range: this.end - this.start
        }
    },
    methods: {
        resize(x, y, width, height){ //Upon resize of timeline
            var tHeight = this.$refs.timeline.clientHeight
            this.y = [y/tHeight, height/tHeight]
            this.scale()
            this.initialY = y
            this.height = height
        },
        drag(x, y){
            this.y = [y/this.$refs.timeline.clientHeight, this.y[1]]
            this.scale()
            this.intialY = y
        },
        processDate(d){
            return (d>=0) ? `${d} AD` : `${-d} BC` 
        },
        updateActiveRange(tHeight){ //Update range timeline covers
            this.initialY = ((this.startRange[0] - this.start)/this.range)*tHeight;
            this.height = (this.startRange[1] - this.startRange[0])*tHeight/this.range;
            this.y = [this.initialY/tHeight, this.height/tHeight]
            this.update ++
        },
        pan(cy){ //Update timeline upon panning the tree
            var dy = cy * (this.dateRange[1]-this.dateRange[0])/this.range
            if(this.initialY + dy > 0 && this.height + dy + this.initialY < this.$refs.timeline.clientHeight){ //If allowed
                //Update values:
                this.initialY += dy
                this.height += dy
                this.y = [this.initialY/this.$refs.timeline.clientHeight, this.height/this.$refs.timeline.clientHeight]
                this.update ++
                this.scale()
            }
        },
        zoom(year, d, svgY){
            //Y % and direction
            
            var step = -d*10,
                y = (year-this.dateRange[0])/(this.dateRange[1] - this.dateRange[0]),
                dyt = step*y, // from top
                dyb = step*(1-y)


            //change height
            this.initialY += ((this.initialY + dyt) > 0)?dyt:0
            this.height -= ((this.initialY + this.height - (dyt+dyb)) < this.$refs.timeline.clientHeight)?dyt + dyb : 0

            this.y = [this.initialY/this.$refs.timeline.clientHeight, this.height/this.$refs.timeline.clientHeight]

            this.update ++
            this.scale()
        },
        scale(){
            this.$emit('rangeChange', this.dateRange)
        }
    },
    computed: {
        dateRange(){
            return [Math.round(this.y[0]*this.range + this.start), Math.round((this.y[1]+this.y[0])*this.range + this.start)]
        }
    },
    mounted(){
        if(window.innerWidth < 800){
            this.width = 25
            this.update ++
        }

        this.isMounted = true;
        this.updateActiveRange(this.$refs.timeline.clientHeight)
        window.addEventListener('resize', ()=>{
            console.log(window.innerHeight*0.8)
            this.updateActiveRange(window.innerHeight*0.8)
            this.update ++
        })
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
        }
        .handle-bm, .handle-tm{
            position: absolute;
            z-index: 100;
            cursor: ns-resize;
            span{
                width: 100px;
                left: 50px;
                @apply text-theme font-semibold absolute;
            }
            // height: 20px;
        }
        .handle-tm{
            top: 0;
            span{
                top: -10px;
            }
        }
        .handle-bm{
            bottom: 0;
            span{
                top: 20px;
            }
        }
        line{
            stroke: rgba(#05560D, 0.8);
            stroke-width:8;
        }
    }
    @media only screen and (max-width: 800px){
        .timeline{
            width: 25px;
        }
        .handle-bm, .handle-tm{
            span{
                left: 35px !important;
            }
        }
    }
</style>
