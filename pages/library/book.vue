<template>
    <!-- Page for viewing books -->
    <div class="viewBook max-h-screen">
        <div class="h-container v-container flex flex-col content-center text-center h-screen">
            <nuxt-link to="/library" class="absolute">
                <img src="@/assets/img/back.svg" alt="">
            </nuxt-link>
            <h4 class="italic text-theme font-semibold text-lg">
                {{ book.genre }}
            </h4>
            <h1 class="text-dark font-light text-5xl mb-4">
                {{ book.title }}
            </h1>
            <div class="reader shadow max-w-6xl mx-auto w-full rounded-lg relative" style="">
                <img class="plus-zoom" src="@/assets/img/plus.png" @click="scalePlus">
                <img class="minus-zoom" src="@/assets/img/minus.png" @click="scaleMinus">
                <!-- <div class="p-8 relative content-box" :style="`margin-bottom: -${margin}px`"> -->
                <div class="p-8 relative content-box flex justify-center" style="overflow: hidden; max-height: 558px;">
                    <client-only>
                        <!-- <div class="relative" :style="`transform: scale(${zoomX}, ${zoomY})`"> -->
                        <!-- <div class="relative"> -->
                        <panZoom>
                            <div class="relative" :style="`'margin:auto; text-align: center; width:${zoom * 2.2}px;`">
                                <!-- Two pairs of pages rendered at once - in order to produce the page turn effect: -->

                                <div ref="set1" class="set1 relative w-auto">
                                    <pdf
                                            ref="p00"
                                            :src="`/books/${book._id}.pdf`"
                                            :page="pages[0][0]"
                                            :style="`${(!mobile || pages[0][0])?'display: inline-block':'display: none'}; width:${zoom}px;`"
                                            style="transform-origin: right"
                                            class="pdf"
                                    />
                                    <pdf
                                            ref="p01"
                                            :src="`/books/${book._id}.pdf`"
                                            @num-pages="numPages = $event"
                                            @progress="loadedRatio = $event"
                                            :page="pages[0][1]"
                                            :style="`${(!mobile || pages[0][1])?'display: inline-block':'display: none'}; width:${zoom}px;`"
                                            style="transform-origin: left;"
                                            class="pdf"
                                    />
                                </div>
                                <!-- <div class="set2Container"> -->

                                <div class="set2 absolute top-0">
                                    <pdf
                                            ref="p10"
                                            :src="`/books/${book._id}.pdf`"
                                            :page="pages[1][0]"
                                            :style="`${(!mobile || pages[1][0])?'display: inline-block':'display: none'}; width:${zoom}px;`"
                                            style="transform-origin: right"
                                            class="pdf"
                                    />
                                    <pdf
                                            ref="p11"
                                            :src="`/books/${book._id}.pdf`"
                                            :page="pages[1][1]"
                                            :style="`${(!mobile || pages[1][1])?'display: inline-block':'display: none'}; width:${zoom}px;`"
                                            style="transform-origin: left"
                                            class="pdf"
                                    />
                                </div>
                            </div>
                        </panZoom>
                    </client-only>
                </div>
                <div :style="(loadedRatio == 1)?'opacity: 1':'opacity: 0'"
                     class="flex flex-row justify-between controls p-4 content-center">
                    <div ref="slider" class="slider relative mt-2">
                        <vue-draggable-resizable
                                ref="resizable"
                                :w="sliderWidth"
                                :x="0"
                                :h="7"
                                :parent="true"
                                :draggable="false"
                                @resizing="resize"
                                @deactivated="updateSlider"
                                :handles="['mr']"
                                :key="update"
                                :min-width="minW"
                                @resizestop="resizeStop(x[1])"
                                :onResizeStart="resizeStart"
                        >
                            <div slot="mr"
                                 class="handle-mr rounded-full shadow-md w-5 h-5 absolute right-0 z-50 bg-white"
                                 style="display:block;">
                                &nbsp
                            </div>
                        </vue-draggable-resizable>
                    </div>
                    <h4 class="italic text-theme">
                        {{ pagen }}
                    </h4>
                    <div class="pageNav">
                        <button @click="back" class="mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12.842" height="19.17"
                                 viewBox="0 0 12.842 19.17">
                                <path d="M14886.388,2160.869l-12.842,9.585,12.842,9.585Z"
                                      transform="translate(-14873.546 -2160.869)"/>
                            </svg>
                        </button>
                        <button @click="next">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12.84" height="19.17"
                                 viewBox="0 0 12.84 19.17">
                                <path d="M14873.547,2160.869l12.84,9.585-12.84,9.585Z"
                                      transform="translate(-14873.547 -2160.869)"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <!-- <div class="flex flex-row controls px-4"> -->

                <!-- </div> -->
            </div>
            <div class="max-w-6xl mx-auto w-full reader shadow flex p-4">
                <div class="pageJump">
                    <span class="italic opacity-50 text-dark text-sm l">{{ $t('jump') }}</span>
                    <input :min="1" :max="numPages" v-model="pageJump" type="number" class="inp text-sm mx-4">
                    <button @click="toPage(pageJump)" class="btn text-sm l">
                        {{ $t('go') }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<i18n lang="yaml">
    {
    "en": {
    jump: 'Jump to page:',
    go: 'Go'
    },
    "ar": {
    jump: 'اذهب إلى الصفحة',
    go: 'اذهب'
    },
    "ur": {
    jump: 'صفحے پر جائیں',
    go: 'جاؤ'
    }
    }
</i18n>

<script>
    import VueDraggableResizable from 'vue-draggable-resizable'

    export default {
        layout: 'home',
        components: {VueDraggableResizable},
        data() {
            return {
                book: {genre: null, title: null, _id: null},
                numPages: 0,
                loadedRatio: 0,
                // pages: [[0, 1], [null, null]],
                pages: {0: [0, 1], 1: [null, null]},
                sliderWidth: 200,
                minW: 0,
                x: [0, 1],
                oldw: null,
                update: 0,
                mobile: false,
                mobileWidth: 1000,
                pageSet: 0, // 0 or 1
                pdfUpdate: 0,
                pageJump: 1,
                margin: 0,
                panzoom: null,
                zoom: 350
            }
        },
        computed: {
            readingProgress() {
                return (this.numPages < 2) ? 1 : (this.pages[this.pageSet][this.pages[this.pageSet].length - 1] - 1) / (this.numPages - 1)
            },
            pagen() {
                return `${(this.pages[this.pageSet][0]) ? this.pages[this.pageSet][0] + ', ' : ''}${this.pages[this.pageSet][1]} / ${this.numPages}`
            }
        },
        watch: {
            numPages() {
                this.updateSlider(false)
                this.margin = this.$refs.p00.$el.clientHeight
                console.log(this.$refs.p00.$el.clientHeight)
            },
            mobile() {
                this.pages = {0: [0, 1], 1: [null, null]}
                this.updateSlider(true)
            }
        },
        created() {
            if (this.$route.query.id) {
                this.$axios.$post('/api', {call: 'getBook', payload: {id: this.$route.query.id}}).then((data) => {
                    this.book = data
                }).catch(() => {
                    this.$router.push('/library')
                })
            } else {
                this.$router.push('/library')
            }
        },
        mounted() {
            this.checkMobile()
            window.addEventListener('resize', () => {
                this.updateSlider()
                this.checkMobile()
            })
        },
        methods: {
            next() {
                const before = this.pages[this.pageSet]
                const c = this.pages[this.pageSet][1]
                const d = this.pages[this.pageSet][0]

                if (this.numPages > 2 && !this.mobile) {
                    // Next front pages =                  if 2 can be added, next pageset
                    // Set's non active page set to new values
                    this.pages[(this.pageSet == 0) ? 1 : 0] = (c + 2 <= this.numPages && c) ? [c + 1, c + 2] : (((c + 1 <= this.numPages) && (d + 1 <= this.numPages)) ? [c + 1, null] : this.pages[this.pageSet])
                    if (before != this.pages[(this.pageSet == 0) ? 1 : 0]) {
                        this.nextAnim(0.4, this.pages[(this.pageSet == 0) ? 1 : 0][1] == null)
                        this.updateSlider(true)
                    }
                } else {
                    this.pages[this.pageSet] = (this.pages[this.pageSet][1] + 1 <= this.numPages) ? [this.pages[this.pageSet][0], this.pages[this.pageSet][1] + 1] : this.pages[this.pageSet]
                    this.updateSlider(true)
                }
            },
            back() {
                const c = this.pages[this.pageSet][0]
                const d = this.pages[this.pageSet][1]

                if (this.numPages > 2 && !this.mobile) {
                    if (c ? (c - 1 > 0) : true && d ? (d - 1 > 0) : true) {
                        this.pages[(this.pageSet == 0) ? 1 : 0] = (c - 2 >= 0) ? [c - 2, c - 1] : ((this.pages[this.pageSet][0] == null && c - 1 > 0 && d - 1 > 0) ? [this.pages[this.pageSet][1] - 2, this.pages[this.pageSet][1] - 1] : this.pages[this.pageSet])
                        this.backAnim(0.4)
                        this.updateSlider(true)
                    }
                } else {
                    this.pages[this.pageSet] = (this.pages[this.pageSet][1] - 1 >= 1) ? [c, this.pages[this.pageSet][1] - 1] : this.pages[this.pageSet]
                    this.updateSlider(true)
                }
            },
            backAnim(x) {
                const newRight = this.$refs[`p${(this.pageSet == 0) ? 1 : 0}1`].$el
                const oldLeft = this.$refs[`p${this.pageSet}0`].$el

                // Tween between sets - backwards
                const tl = new this.$GSAP.TimelineMax({delay: 0.1})
                tl.set(newRight, {css: {scaleX: 0}})
                    .to(oldLeft, x, {
                        ease: this.$GSAP.Power1.easeIn,
                        css: {scaleX: 0},
                        onComplete: () => {
                            this.pageSet = (this.pageSet == 0) ? 1 : 0
                            if (this.pages[0][0] == 0) {
                                this.pages[1] = [null, null]
                            }
                        }
                    })
                    .set('.set2', {css: {zIndex: (this.pageSet == 0) ? 10 : 1}})
                    .to(newRight, x, {css: {scaleX: 1}, ease: this.$GSAP.Power1.easeOut})
                    .set('.pdf', {css: {scaleX: 1}})
            },
            scalePlus() {
                this.zoom += 250
            },
            scaleMinus() {
                this.zoom -= 250
            },
            // To a given page - from slider or input
            toPage(page) {
                const newPage = page
                const newPageOdd = (2 * Math.floor(newPage / 2) + 1)
                const newPageActual = (this.numPages <= 2 || this.mobile) ? newPage : newPageOdd
                this.pages[(this.pageSet == 0) ? 1 : 0] = (newPage < 1) ? [0, 1] : ((this.numPages >= 2 && !this.mobile && newPageActual > this.numPages) ? [null, this.numPages] : [(this.numPages <= 2 || this.mobile) ? 0 : (newPageOdd - 1), newPageActual])
                this.nextAnim(0.4)
                this.updateSlider(true)
            },
            nextAnim(x, end) {
                // Animate to next page spread
                const newLeft = this.$refs[`p${(this.pageSet == 0) ? 1 : 0}0`].$el
                const oldRight = this.$refs[`p${this.pageSet}1`].$el

                const tl = new this.$GSAP.TimelineMax({delay: 0.1})
                tl.set(newLeft, {css: {scaleX: 0}})
                    .to(oldRight, x, {
                        ease: this.$GSAP.Power1.easeIn,
                        css: {scaleX: 0},
                        onComplete: () => {
                            this.pageSet = (this.pageSet == 0) ? 1 : 0
                            if (end) {
                                console.log(this.pages[this.pageSet])
                                this.pages[(this.pageSet == 0) ? 1 : 0] = [null, null]
                            }
                        }
                    })
                    .set('.set2', {css: {zIndex: (this.pageSet == 0) ? 10 : 1}})
                    .to(newLeft, x, {css: {scaleX: 1}, ease: this.$GSAP.Power1.easeOut})
                    .set('.pdf', {css: {scaleX: 1}})
            },
            resize(x, y, width, height) {
                const tWidth = this.$refs.slider.clientWidth
                this.x = [x / tWidth, width / tWidth]
                const newPage = parseFloat((this.x[1] * this.numPages).toFixed())
                const newPageOdd = (2 * Math.floor(newPage / 2) + 1)
                const newPageActual = (this.numPages <= 2 || this.mobile) ? newPage : newPageOdd
                this.pages[(this.pageSet == 0) ? 1 : 0] = (newPage < 1) ? [0, 1] : ((this.numPages >= 2 && !this.mobile && newPageActual > this.numPages) ? [null, this.numPages] : [(this.numPages <= 2 || this.mobile) ? 0 : (newPageOdd - 1), newPageActual])
            },
            resizeStart() {
                this.oldw = this.x[1]
            },
            resizeStop() {
                // console.log(this.oldw, this.x[1])
                if ((this.x[1] - this.oldw) >= 0) {
                    this.nextAnim(0.4)
                } else {
                    this.backAnim(0.4)
                }
            },
            test() {
                // console.log(this.loadedRatio)
            },
            updateSlider(c) {
                const nextSet = c ? ((this.pageSet == 0) ? 1 : 0) : this.pageSet
                this.sliderWidth = parseFloat(((
                    ((this.pages[nextSet][1]) ? this.pages[nextSet][1] : this.pages[nextSet][0]) / this.numPages
                ) * this.$refs.slider.clientWidth).toFixed()) || 700
                this.minW = (1 / this.numPages) * this.$refs.slider.clientWidth || 0.0
                this.update++
            },
            checkMobile() {
                this.mobile = (window.innerWidth < this.mobileWidth)
            }
        }
    }
</script>

<style lang="scss">
    img.plus-zoom {
        position: absolute;
        right: 85px;
        top: 30px;
        width: 30px;
        z-index: 1000;
        cursor: pointer;
    }

    img.minus-zoom {
        position: absolute;
        right: 40px;
        top: 30px;
        width: 30px;
        z-index: 1000;
        cursor: pointer;
    }

    span.pdf {
        display: inline-block !important;
    }

    .viewBook {
        background: url('../../assets/img/bg5-min.jpg');
        background-position: 50% 50%;

        .reader {
            background: rgba(white, 0.7)
        }
    }

    .set1, .set2 {
        // position: absolute;
    }

    .set1 {
        z-index: 5;
    }

    .set2 {
        z-index: 1;
        // transform: translateY(-100%);
    }

    .set2Container {
        // left: 50%;
    }

    @media only screen and (max-width: 500px) {
        .pdf {
            width: 100%;
        }
    }

    .pageNav {
        button {
            opacity: 0.47;

            path {
                fill: #05560d;
            }

            &:hover {
                opacity: 0.8;
            }

            &:active {
                opacity: 1;
            }

            &:focus {
                outline: none;
            }
        }
    }

    .controls {
        background: rgba(#F9F9F9, 0.71);
    }

    .slider {
        background: rgba(#ECECEC, 0.76);
        height: 7px;
        width: 80%; //temp
        border-radius: 5px;

        .handle-mr {
            cursor: ew-resize;
            top: -0.4em;
            right: -0.2em;
        }

        .resizable {
            background: rgba(#05560d, 0.8);
            border-radius: 5px;
            // background: #05560d;
        }
    }

    .pdf-viewer-wrapper {
        overflow: hidden;
        max-height: 90vh;

        &.zoom-active {
            cursor: grab;
        }
    }
</style>
