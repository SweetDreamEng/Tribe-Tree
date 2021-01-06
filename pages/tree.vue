<template>
  <!-- Main tree page -->
  <div class="tree h-screen overflow-hidden" :key="reset">
    <div class="pb-40 h-container v-container tree-wrap h-full overflow-hidden">
      <!-- Timeline -->
      <div class="timeline-container">
        <transition name="page">
          <timeline
            :start="dateRange[0]"
            :end="dateRange[1]"
            @rangeChange="scale"
            ref="timeline"
            :startRange="activeDateRange"
            v-if="tree == 1 && !tree2"
            :key="tmk"
          ></timeline>
        </transition>
      </div>

      <!-- Tree -->
      <div
        class="tree-container w-4/5 lg:w-11/12 mx-auto h-full rounded-lg relative"
        ref="container"
      >
        <img class="progeny-description" src="@/assets/img/tree-progeny.png" />
        <transition name="page">
          <div
            class="selected absolute rounded-lg p-4 shadow-md m-4"
            v-if="selected"
          >
            <h4 class="italic text-theme text-sm">Selected</h4>
            <div style="display: flex; justify-content: center">
              <img v-if="selected.royal" src="/tree/m10.png" />
            </div>
            <h3 class="">{{ selected.nameEn }}</h3>
            <h3 class="ar-font" v-if="selected.nameAr">
              {{ selected.nameAr }}
            </h3>
          </div>
        </transition>

        <!-- Cursor el: -->
        <div
          :class="[
            'g-cursor',
            { 'g-cursor_hover': hover },
            { 'g-cursor_hide': hideCursor },
          ]"
        >
          <div :style="cursorCircle" class="g-cursor__circle"></div>
          <div class="g-cursor__point" ref="point" :style="cursorPoint"></div>
          <div
            class="cursor-line"
            :style="cursorLine"
            v-if="tree == 1 && !tree2"
          >
            <span>{{ cursorYear }}</span>
            <hr />
          </div>
        </div>

        <!-- Back btn -->
        <h4
          class="text-theme font-semibold opacity-0 l"
          @click="back"
          ref="backTxt"
          v-if="tree2"
        >
          {{ $t("back") }}
        </h4>

        <!-- Lang switch -->
        <transition name="page">
          <h3
            class="text-theme font-semibold text-3xl absolute right-0 pr-8 opacity-25 l"
            v-if="tree2"
          >
            {{ $i18n.locale == "en" ? tribeName.en : tribeName.ar }}
          </h3>
        </transition>

        <!-- Main svg - modified by d3: -->
        <svg
          width="100%"
          height="100%"
          ref="svg1"
          id="tree1"
          :class="`s-${this.yM >= 1 || tree2 ? 1 : 0}`"
        >
          <!-- Main tree el: -->
          <g
            class="tree-g"
            :transform="`translate(${treeOffset})`"
            ref="treeGrp"
            :class="anim ? 'anim' : ''"
          >
            <g class="links"></g>
            <g class="nodes"></g>
          </g>

          <!-- Tribe tree el: -->
          <g
            class="tree2-g"
            :transform="
              `translate(${tree2Offset[0]}, ${tree2Offset[1]}) scale(${this.tree2Scale})`
            "
            ref="tree2Grp"
            :class="tree2 ? 'active' : ''"
          ></g>
          <radialGradient
            id="radial-gradient"
            cx="0.5"
            cy="0.5"
            r="0.5"
            gradientUnits="objectBoundingBox"
          >
            <stop offset="0" stop-color="#05560d" stop-opacity="0" />
            <stop offset="0.69" stop-color="#05560d" stop-opacity="0.031" />
            <stop offset="1" stop-color="#05560d" stop-opacity="0.102" />
          </radialGradient>
          <radialGradient
            id="radial-gradient2"
            cx="0.5"
            cy="0.5"
            r="0.5"
            gradientUnits="objectBoundingBox"
          >
            <stop offset="0" stop-color="#919191" stop-opacity="0" />
            <stop offset="0.69" stop-color="#919191" stop-opacity="0.031" />
            <stop offset="1" stop-color="#919191" stop-opacity="0.102" />
          </radialGradient>
        </svg>
      </div>

      <transition name="pages">
        <!-- Select a tribe -->
        <div class="tribe-select text-center cursor-pointer" v-if="!tree2">
          <a
            v-for="(tribe, index) in tribes"
            :key="index"
            class="text-theme italic mx-2"
            @click="loadTribe(tribe)"
            >{{ tribe.nameEn }}</a
          >
        </div>
      </transition>
    </div>

    <transition name="page">
      <!-- Biography modal: -->
      <div
        class="modalContainer w-screen h-screen fixed flex content-center justify-center top-0 left-0 p-16"
        v-if="modal"
      >
        <div
          class="w-screen h-screen fixed top-0 left-0 bg"
          :class="modal ? 'active' : ''"
        >
          &nbsp;
        </div>
        <div
          class="modal m-auto rounded-lg p-12 flex flex-col w-full h-full"
          ref="modal"
        >
          <div class="w-full h-full flex flex-col" ref="modalContent">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="11.697"
              height="11.697"
              viewBox="0 0 11.697 11.697"
              @click="closeModal"
              class="absolute close cursor-pointer right-0"
            >
              <g id="close" transform="translate(-7675.651 -37.651)">
                <line
                  id="Line_12"
                  data-name="Line 12"
                  x2="10"
                  y2="10"
                  transform="translate(7676.5 38.5)"
                  fill="none"
                  stroke="#057711"
                  stroke-width="2.4"
                />
                <line
                  id="Line_13"
                  data-name="Line 13"
                  y1="10"
                  x2="10"
                  transform="translate(7676.5 38.5)"
                  fill="none"
                  stroke="#057711"
                  stroke-width="2.4"
                />
              </g>
            </svg>
            <!-- <h4 class="font-semibold text-theme opacity-50 text mb-4 l">{{$t('bio')}}</h4>
                        <h3 class="text-3xl text-theme font-normal mb-4">{{modalNode.nameEn}}</h3>
                        <h3 class="text-xl text-theme font-normal mb-4">{{processDate(modalNode.year)+(bio.dod?` - ${processDate(bio.dod)}`:'')}}</h3>
                        <h3 class="text-theme font-semibold opacity-50 text-xl mb-4 ar-font">{{modalNode.nameAr}}</h3>
                        <p class="text-dark mb-4 l" v-if="$i18n.locale == 'ar'">{{bio.descAr}}</p>
                        <p class="text-dark mb-4 l" v-else-if="$i18n.locale == 'ur'">{{bio.descUr}}</p>
                        <p class="text-dark mb-4" v-else>{{bio.desc}}</p>
                        <label class="italic opacity-50 mt-8 mb-4 l" v-if="bio.img.length">{{$t('images')}}</label>
                        <div class="imgCollection flex flex-row flex-wrap">
                            <img class=" max-w-md mx-4" v-for="(img, index) in bio.img" :key="index"
                                 :src="`/bios/${img.filename}`" alt="">
                        </div>
                        <label class="italic opacity-50 mt-8 mb-4 l" v-if="bio.video.length">{{$t('videos')}}</label>
                        <div class="videoCollection mb-8">
                            <video class="max-w-md" controls playsinline v-for="(vid, index) in bio.video" :key="index"
                                   :src="`/bios/${vid.filename}`" alt="">
                            </video>
                        </div> -->
            <h4 class="font-semibold text-theme opacity-50 text mb-4 l">
              {{ $t("bio") }}
            </h4>
            <h3 class="text-3xl text-theme font-normal mb-4">
              {{ modalNode.nameEn }}
            </h3>
            <!-- <h3 class="text-xl text-theme font-normal mb-4">{{processDate(modalNode.year)+(bio.dod?` - ${processDate(bio.dod)}`:'')}}</h3> -->
            <h3
              class="text-theme font-semibold opacity-50 text-xl mb-4 ar-font"
            >
              {{ modalNode.nameAr }}
            </h3>
            <div v-html="bio.content"></div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import * as d3 from "d3";
import timeline from "@/components/timeline.vue";

export default {
  layout: "home",
  components: {
    timeline,
  },
  data() {
    return {
      //Cursor
      xChild: 0,
      yChild: 0,
      xParent: 0,
      yParent: 0,
      dragging: false,
      hover: false,
      hideCursor: true,
      cursorYear: null,
      treeOffset: 0,
      tree2Offset: 0,
      treeLayout: null,
      anim: true,
      tree: 1,
      reset: 0,
      tmk: 0,
      selected: false,
      modalNode: null,
      tribeName: null,
      modal: false,
      bio: false,
      tree2: false,
      tree2Scale: 1,
      date: null,
      yM: 0,
      dStartX: null,
      dStartY: null,
      hLink: { source: null, target: null }, //deprecated
      linkData: {},
      content: null,
      initialRoad: false,
    };
  },
  async asyncData({ $axios }) {
    //Load data from server before page load
    const data = await $axios.$post("/api", { call: "getTribes" });
    const tdata = await $axios.$post("/api", { call: "getMainTree" });
    var dr = [parseInt(tdata.dr[0]) - 80, parseInt(tdata.dr[1]) + 400];
    return {
      tribes: data.tribes,
      tree1: tdata.tree,
      dateRange: dr,
      activeDateRange: dr,
    };
  },
  mounted() {
    //Tree
    if (this.$route.query.tribe) {
      this.anim = false;
      this.initTree1();
      setTimeout(() => {
        this.loadTribe({ _id: this.$route.query.tribe });
      }, 1000);
    } else {
      this.initialRoad = true;

      this.initTree1();
      // this.initTree2()
      // Render tree - elements are hidden at first so that they can be animated
      var collapse = (d) => {
        if (d.children) {
          d._children = d.children;
          d._children.forEach(collapse);
          d.children = null;
        }
      };

      //Load animation
      setTimeout(() => {
        var offsetx = -1 * this.treeOffset;

        function getRandomInt(min, max) {
          //Randomise node positions
          min = Math.ceil(min);
          max = Math.floor(max);
          return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
        }

        var width = this.$refs.svg1.getBoundingClientRect().width,
          height = this.$refs.svg1.getBoundingClientRect().height,
          xRange = [offsetx, offsetx + width],
          yRange = [-10, height - 50];

        //Fade nodes in
        this.$GSAP.TweenMax.to(
          ".tree-g .node .t1, .tree-g .links, .tree-g .logoImg",
          0.5,
          {
            css: { opacity: 1 },
            delay: 1.5,
            onComplete: () => {
              this.anim = false;
            },
          }
        );

        // For each node element, animate to actual position:
        // Array.from(document.querySelectorAll('.tree-g .node')).forEach((node) => {
        //     var oldPosition = node.getAttribute('transform')
        //     node.setAttribute('transform', `translate(${getRandomInt(xRange[0], xRange[1])}, ${getRandomInt(yRange[0], yRange[1])})`)
        //     // Tween to position:
        //     this.$GSAP.TweenMax.to(node, 1, {
        //         css: {opacity: 1}, onComplete: () => {
        //             setTimeout(() => {
        //                 node.classList.add('a')
        //                 node.setAttribute('transform', oldPosition)
        //             }, 10);
        //         }
        //     })
        // })
      }, 100);
    }

    //Cursor
    this.$refs.container.addEventListener("mousemove", this.moveCursor);
    this.$refs.container.addEventListener("mouseleave", (e) => {
      this.hideCursor = true;
    });
    this.$refs.container.addEventListener("mouseenter", (e) => {
      this.hideCursor = false;
    });
    window.addEventListener("resize", (e) => {
      this.calcOffset();
    });

    // panning the tree:
    this.$refs.svg1.addEventListener("mousedown", (e) => {
      this.dragging = true;
      this.dStartX = e.clientX;
      this.dStartY = e.clientY;
    });
    this.$refs.svg1.addEventListener("mouseup", () => {
      this.dragging = false;
    });
    this.$refs.svg1.addEventListener("mousemove", this.pan);

    //Scroll zoom - requires editing timeline component values
    this.$refs.svg1.addEventListener("wheel", (event) => {
      event.preventDefault();
      const delta = Math.sign(event.deltaY); //get direction of zoom
      if (this.tree2) {
        //Zoom tribe tree
        this.tree2Zoom(delta);
      } else {
        this.$refs.timeline.zoom(this.date, delta);
      }
    });
  },
  computed: {
    cursorCircle() {
      return `transform: translateX(${this.xParent}px) translateY(${this.yParent}px) translateZ(0) translate3d(0, 0, 0);`;
    },
    cursorPoint() {
      return `transform: translateX(${this.xChild - 3}px) translateY(${this
        .yChild - 3}px) translateZ(0) translate3d(0, 0, 0);`;
    },
    cursorLine() {
      return `transform: translateY(${this.yParent -
        140}px) translateZ(0) translate3d(0, 0, 0);`;
      // return `transform: translateY(${this.yChild - 10}px) translateZ(0) translate3d(0, 0, 0);`
    },
    tree2Height() {
      var h = this.$refs.svg1.getBoundingClientRect().height,
        w = this.$refs.svg1.getBoundingClientRect().width;
      return h < w ? h - 40 : w - 40;
    },
  },
  methods: {
    deleteTrees() {
      d3.select("#svg1")
        .selectAll("*")
        .remove();
      d3.select("#svg2")
        .selectAll("*")
        .remove();
    },
    processDate(d) {
      return d >= 0 ? `${d} AD` : `${-d} BC`;
    },
    closeModal() {
      this.bio = false;
      this.modal = false;
      this.modalNode = false;
    },
    openModal(node) {
      this.$axios
        .$post("/api", { call: "getBio", payload: { nodeId: node.id } })
        .then((bio) => {
          if (bio) {
            this.modalNode = node;
            this.bio = bio;
            // this.bio.img = this.bio.files.filter(file => file.type.split('/')[0] == "image")
            // this.bio.video = this.bio.files.filter(file => file.type.split('/')[0] == "video")
            this.modal = true;
          }
        });
    },
    calcOffset() {
      // svg positioning
      this.treeOffset =
        -22 +
        this.$refs.svg1.clientWidth / 2 -
        this.$refs.treeGrp.getBoundingClientRect().width / 2;
      this.tree2Offset = [
        this.$refs.svg1.clientWidth / 2 -
          this.$refs.tree2Grp.getBoundingClientRect().width / 2,
        this.$refs.svg1.clientHeight / 2 -
          this.$refs.tree2Grp.getBoundingClientRect().width / 2,
      ];
    },
    updateTree1() {
      //Various code copied from initTree1() - called every time the tree needs to be updated
      var yM =
        this.$refs.timeline.$el.getBoundingClientRect().height /
        (this.activeDateRange[1] - this.activeDateRange[0]);
      this.yM = Math.floor(Math.sqrt(yM * 2));

      var calcY = (year) => {
        return (year - this.activeDateRange[0]) * yM;
      };
      var calcX = (x) => {
        return x - 125;
      };
      var link = d3
        .linkVertical()
        .x(function(d) {
          return calcX(d.x);
        })
        .y(function(d) {
          return calcY(d.data.year);
        });
      var horizontal = d3
        .linkHorizontal()
        .x(function(d) {
          return calcX(d.x);
        })
        .y(function(d) {
          return calcY(d.data.year);
        });

      var node = d3
        .select("#tree1 g.nodes")
        .selectAll("g.node")
        // .attr('transform', (d)=>{return `translate(${calcX(d.x)},${calcY(d.data.year)}) ${(!d.parent)?'scale(1.4)':''}`})
        .attr("transform", (d) => {
          return `translate(${calcX(d.x)},${calcY(d.data.year)}) ${
            !d.parent ? "scale(1.4)" : ""
          }`;
        });
      var links = d3
        .select("#tree1 g.links")
        .selectAll("path.link")
        .attr("d", (d) => (d.horizontal ? horizontal(d) : link(d)));

      d3.select("#tree1 g.links")
        .selectAll(".marriage-link")
        .remove();

      var linkData = this.linkData;

      const targetArray = [];
      linkData.map((item) => {
        targetArray.push(item.target);
      });

      const manageLinkIds = [];
      targetArray.forEach((item, idx) => {
        if (item.data.wife_id) {
          const wife_id = item.data.wife_id;
          const wife_node = targetArray.filter(
            (link) => link.data.id === wife_id
          );
          targetArray.forEach((link, i) => {
            if (link.data.id === wife_id) {
              manageLinkIds.push({
                source: idx,
                target: i,
              });
            }
          });
        }
      });

      manageLinkIds.forEach((link) => {
        const marriage_link = d3.linkHorizontal()({
          source: [
            calcX(linkData[link.source].target.x),
            calcY(linkData[link.source].target.data.year),
          ],
          target: [
            calcX(linkData[link.target].target.x),
            calcY(linkData[link.target].target.data.year),
          ],
        });

        d3.select("#tree1 g.links")
          .append("path")
          .attr("d", marriage_link)
          .classed("marriage-link", true)
          .attr("stroke", "green")
          .attr("fill", "none");
      });

      /*const marriage_link = d3.linkHorizontal()({
                    source: [calcX(linkData[6].target.x), calcY(linkData[6].target.data.year)],
                    target: [calcX(linkData[10].target.x), calcY(linkData[10].target.data.year)]
                });


                d3.select('#tree1 g.links')
                    .append('path')
                    .attr('d', marriage_link)
                    .attr('stroke', 'black')
                    .attr('fill', 'none');*/

      //Marriage link - deprecated
      // var hLink = this.hLink
      // d3.select('#tree1 text').attr('x', function(){
      //     return ((calcX(hLink.target.x)-calcX(hLink.source.x))/2)+calcX(hLink.source.x)-(this.getComputedTextLength()/2)
      // }).attr('y', ()=>{
      //     var sy = calcY(hLink.source.data.year),
      //         ty = calcY(hLink.target.data.year);
      //     return ((sy<ty)?sy:ty)-5
      // })
    },
    arrangeLabels() {
      var getTranslation = (transform) => {
        // Create a dummy g for calculation purposes only. This will never
        // be appended to the DOM and will be discarded once this function
        // returns.
        var g = document.createElementNS("http://www.w3.org/2000/svg", "g");

        // Set the transform attribute to the provided string value.
        g.setAttributeNS(null, "transform", transform);

        // consolidate the SVGTransformList containing all transformations
        // to a single SVGTransform of type SVG_TRANSFORM_MATRIX and get
        // its SVGMatrix.
        var matrix = g.transform.baseVal.consolidate().matrix;

        // As per definition values e and f are the ones for the translation.
        return [matrix.e, matrix.f];
      };
      var move = 1;
      // var svg = this.$refs.svg1;
      do {
        move = 0;
        // console.log('names =>', d3.selectAll("#tree1 g.name"))
        d3.selectAll("#tree1 g.name").each(function() {
          var that = this,
            a = this.getBoundingClientRect();
          d3.selectAll("#tree1 g.name").each(function() {
            if (this != that) {
              var b = this.getBoundingClientRect();
              if (
                Math.abs(a.left - b.left) * 2 < a.width + b.width &&
                Math.abs(a.top - b.top) * 2 < a.height + b.height
              ) {
                // overlap, move labels
                var dx =
                    (Math.max(0, a.right - b.left) +
                      Math.min(0, a.left - b.right)) *
                    1,
                  dy =
                    (Math.max(0, a.bottom - b.top) +
                      Math.min(0, a.top - b.bottom)) *
                    2;
                move += Math.abs(dx) + Math.abs(dy);

                var translate1 = [dx, dy];
                var translate2 = [-dx, -dy];

                // console.log('coordinate = ', "translate(" + translate2 + ")")

                // var translate2 = [-dx, - dy];
                d3.select(this).attr(
                  "transform",
                  "translate(" + translate2 + ")"
                );
                d3.select(that).attr(
                  "transform",
                  "translate(" + translate1 + ")"
                );
                a = this.getBoundingClientRect();
              }
            }
          });
        });
      } while (move);
    },
    redraw(treeLayout) {
      var treeData = d3.hierarchy(this.tree1.data);
      var tree = treeLayout(treeData);
      var vScale = 1;
      var vOffset = 10;
      var labelArray = [];
      this.root = tree;

      // Calculate y value from node year:
      var calcY = (year) => {
        return (
          (year - this.activeDateRange[0]) *
          (this.$refs.timeline.$el.getBoundingClientRect().height /
            (this.activeDateRange[1] - this.activeDateRange[0]))
        );
      };

      // x offset:
      var calcX = (x) => {
        return x - 125;
      };

      // Create nodes with d3:
      var nodes = d3
        .select("#tree1 g.nodes")
        .selectAll("g.node")
        .data(tree.descendants())
        .enter();

      // Node props:
      var node = nodes
        .append("g")
        // Node classes based on props:
        .classed("node", true)
        .classed("root", (d) => {
          return !d.parent;
        }) //Add root class to root node
        .classed("royal", (d) => {
          return d.data.royal;
        })
        .classed("progeny_continued", (d) => {
          return d.data?.progeny === "continued";
        })
        .classed("progeny_discontinued", (d) => {
          return d.data?.progeny === "discontinued";
        })
        .classed("marriage", (d) => {
          return d.data.category;
        })
        // Add node id to html element - used in animations:
        .attr("data-id", (d) => {
          return d.data.id;
        })
        // Position node:
        .attr("transform", (d) => {
          if (!!d.data.x0) {
            d.x = d.data.x0;
          }
          d.data.x0 = d.x;

          return `translate(${calcX(d.data.x0)},${calcY(d.data.year)}) ${
            !d.parent ? "scale(1.4)" : ""
          }`;
        }) //Make root node bigger
        // Pointer events:
        .on("mouseover", (d) => {
          this.hover = true;
          this.selected = d.data;
        })
        .on("mouseout", (d) => {
          this.hover = false;
          this.selected = false;
        })
        .on("click", (d) => {
          // console.log('child = ', d)
        });

      //Inner node elements:
      var nodeR = node.append("g").classed("nodeR", true);
      nodeR
        .append("rect")
        .classed("inner", (d) => {
          return !!!d.data.category;
        })
        .attr("rx", "2");
      nodeR
        .append("circle")
        .classed("inner-circle", (d) => {
          return !!d.data.category;
        })
        .classed("inner-circle-hidden", (d) => {
          return !!!d.data.category;
        })
        .attr("r", 8);
      nodeR
        .append("circle")
        .classed("inner-circle-border", (d) => {
          return !!d.data.category;
        })
        .classed("inner-circle-border-hidden", (d) => {
          return !!!d.data.category;
        })
        .attr("r", 10);
      nodeR
        .append("g")
        .classed("border", (d) => {
          return !!!d.data.category;
        })
        .append("rect")
        .classed("t1", true)
        .attr("rx", "2");

      nodeR.on("click", (d) => {
        // alert('here', d)
        if (d.children) {
          d._children = d.children;
          d.children = null;
        } else {
          d.children = d._children;
          d._children = null;
        }

        if (d.data.children) {
          d.data._children = d.data.children;
          d.data.children = null;
        } else {
          d.data.children = d.data._children;
          d.data._children = null;
        }
        /// remove all nodes and links

        var nodeExit = d3
          .select("#tree1 g.nodes")
          .selectAll("g.node")
          .remove();
        d3.select("#tree1 g.links")
          .selectAll("*")
          .remove();

        this.redraw(treeLayout);
      });

      // Node name txt:

      var name = node
        .append("g")
        .classed("name", true)
        .attr("transform", (d) => {
          if (!!d.data.x0) {
            d.x = d.data.x0;
          }
          d.data.x0 = d.x;

          return `translate(0, 0)`;
        })
        .attr("width", "20px");
      name
        .append("text")
        .text((d) => {
          return d.data.nameEn;
        })
        .on("click", (d) => {
          this.openModal(d.data);
        });

      name
        .append("text")
        .text((d) => d.data.nameAr)
        .classed("ar-font", true);

      var lineNumber = 0;
      var isNameEn = 0;
      var wrap = (text, width) => {
        text.each(function() {
          lineNumber = 0;
          isNameEn = !isNameEn;
          var text = d3.select(this),
            words = text.text(),
            word,
            line = [],
            lineHeight = 1.0, // ems
            y = text.attr("y"),
            // dy = parseFloat(text.attr("dy")),
            dy = 0,
            tspan = text
              .text(null)
              .append("tspan")
              .attr("x", 0)
              .attr("y", y)
              .attr("dy", 0 + "em");

          var newWords = [];
          var maxLength = 10 + 5 * !isNameEn;
          while (words.length > maxLength) {
            var temp = words.slice(0, maxLength);
            newWords.push(temp);
            words = words.slice(maxLength);
          }
          newWords.push(words);

          words = newWords.reverse();
          while ((word = words.pop())) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
              line.pop();
              tspan.text(line.join(" "));
              line = [word];
              tspan = text
                .append("tspan")
                .attr("x", 0)
                .attr("y", y);
              if (lineNumber != 0) {
                tspan.attr("dy", lineHeight + "em");
              } else {
                if (isNameEn) {
                  tspan.attr("dy", 0 - newWords.length * lineHeight + "em");
                } else {
                  tspan.attr("dy", 0 + "em");
                }
              }
              tspan.text(word);
              lineNumber++;
            }
          }
          // find corresponding rect and reszie
          d3.select(this.parentNode.children[0]).attr(
            "height",
            19 * (lineNumber + 1)
          );
        });
      };

      d3.selectAll("text").call(wrap, 30);
      //Add image:
      var img = node
        .append("g")
        .classed("logoImg", (d) => (d.data.img ? true : false));
      img.append("rect");
      img.append("image").attr("href", (d) => {
        return d.data.img ? `/tree/${d.data.id}.${d.data.img}` : "";
      });

      //Link generator
      var link = d3
        .linkVertical()
        .x(function(d) {
          return calcX(d.x);
        })
        .y(function(d) {
          return calcY(d.data.year);
        });
      var horizontal = d3
        .linkHorizontal()
        .x(function(d) {
          return calcX(d.x);
        })
        .y(function(d) {
          return calcY(d.data.year);
        });

      //Add marriage link -
      var linkData = tree.links();
      this.linkData = linkData;
      // var hrLink = {source: tree.children[0].children[0].children[0], target: tree.children[1].children[0], horizontal: true}
      // linkData.push(hrLink)
      // this.hLink = hrLinks

      //Create Links
      d3.select("#tree1 g.links")
        .selectAll("line.link")
        .data(linkData)
        .join("path")
        .classed("link", true)
        .classed("toNr", (d) => !d.target.data.royal)
        .attr("d", (d) => (d.horizontal ? horizontal(d) : link(d)));

      // --- generate marriage link --- //
      const targetArray = [];
      linkData.map((item) => {
        targetArray.push(item.target);
      });

      const manageLinkIds = [];
      targetArray.forEach((item, idx) => {
        if (item.data.wife_id) {
          const wife_id = item.data.wife_id;
          const wife_node = targetArray.filter(
            (link) => link.data.id === wife_id
          );
          targetArray.forEach((link, i) => {
            if (link.data.id === wife_id) {
              manageLinkIds.push({
                source: idx,
                target: i,
              });
            }
          });
        }
      });

      manageLinkIds.forEach((link) => {
        const marriage_link = d3.linkHorizontal()({
          source: [
            calcX(linkData[link.source].target.x),
            calcY(linkData[link.source].target.data.year),
          ],
          target: [
            calcX(linkData[link.target].target.x),
            calcY(linkData[link.target].target.data.year),
          ],
        });

        d3.select("#tree1 g.links")
          .append("path")
          .attr("d", marriage_link)
          .classed("marriage-link", true)
          .attr("stroke", "green")
          .attr("fill", "none");
      });

      // ---- label --- //

      // this.arrangeLabels()

      // console.log("labelArray => ", labelArray);

      // var labeler = () => {
      //   var labeler = {},
      //     width = 1000,
      //     height = 400,
      //     lab = [],
      //     anc = [];

      //   console.log(width, height);

      //   var max_move = 5.0,
      //     max_angle = 0.5,
      //     acc = 0,
      //     rej = 0;

      //   //weight
      //   var weight_label = 30.0,
      //     weight_label_anc = 30.0,
      //     weight_len = 0.2;

      //   var energy = (index) => {
      //     // var m = lab.length, ener = 0,  dx = lab[index].x - anc[index].x, //x dist between point and label
      //     //     dy = anc[index].y - lab[index].y, //y dist between point and label
      //     //     dist = Math.sqrt(dx * dx + dy * dy);

      //     var m = lab.length,
      //       ener = 0,
      //       dx = 10, //x dist between point and label
      //       dy = -10, //y dist between point and label
      //       dist = Math.sqrt(dx * dx + dy * dy);

      //     // penalty for length of leader line
      //     if (dist > 0) ener += dist * weight_len;

      //     var x21 = lab[index].x,
      //       y21 = lab[index].y - lab[index].height + 2.0,
      //       x22 = lab[index].x + lab[index].width,
      //       y22 = lab[index].y + 2.0;
      //     var x11, x12, y11, y12, x_overlap, y_overlap, overlap_area;
      //     for (var i = 0; i < m; i++) {
      //       if (i != index) {
      //         //label-label overlap
      //         //positions of 4 corners of rect bounding the text
      //         (x11 = lab[i].x),
      //           (y11 = lab[i].y - lab[i].height + 2.0),
      //           (x12 = lab[i].x + lab[i].width),
      //           (y12 = lab[i].y + 2.0);

      //         x_overlap = Math.max(0, Math.min(x12, x22) - Math.max(x11, x21));
      //         y_overlap = Math.max(0, Math.min(y12, y22) - Math.max(y11, y21));
      //         console.log("overlap => ", x_overlap, y_overlap);
      //         overlap_area = x_overlap * y_overlap;
      //         ener += overlap_area * weight_label;
      //       }
      //       //label point overlap
      //       // x11 = anc[i].x - anc[i].r; //x start point
      //       // y11 = anc[i].y - anc[i].r; //y start point
      //       // x12 = anc[i].x + anc[i].r; //x end point
      //       // y12 = anc[i].y + anc[i].r; //y end point

      //       x11 = lab[i].x - 10; //x start point
      //       y11 = lab[i].y - 10; //y start point
      //       x12 = lab[i].x + 10; //x end point
      //       y12 = lab[i].y + 10; //y end point
      //       x_overlap = Math.max(0, Math.min(x12, x22) - Math.max(x11, x21));
      //       y_overlap = Math.max(0, Math.min(y12, y22) - Math.max(y11, y21));
      //       overlap_area = x_overlap * y_overlap;
      //       ener += overlap_area * weight_label_anc;
      //     }
      //     return ener;
      //   };

      //   var mcmove = (currTemp) => {
      //     var i = Math.floor(Math.random() * lab.length);
      //     //save old location of label
      //     var x_old = lab[i].x;
      //     var y_old = lab[i].y;

      //     //old energy
      //     var old_energy = energy(i);
      //     //move to a new position
      //     lab[i].x += (Math.random() - 0.5) * max_move;
      //     lab[i].y += (Math.random() - 0.5) * max_move;

      //     if (lab[i].x > width || lab[i].x < 0) {
      //       lab[i].x = x_old;
      //     }
      //     if (lab[i].y > height || lab[i].y < 0) {
      //       lab[i].y = y_old;
      //     }

      //     //new energy
      //     var new_energy = energy(i);

      //     //change in energy
      //     var delta_energy = new_energy - old_energy;

      //     if (Math.random() < Math.exp(-delta_energy / currTemp)) {
      //       // acc += 1;
      //       // do nothing, label already at new pos
      //     } else {
      //       //go back to the old pos
      //       lab[i].x = x_old;
      //       lab[i].y = y_old;
      //       rej += 1;
      //     }
      //   };

      //   var coolingTemp = (currTemp, initialTemp, nsweeps) => {
      //     return currTemp - initialTemp / nsweeps;
      //   };
      //   labeler.start = function(nsweeps) {
      //     //starts simulated annealing
      //     var m = lab.length,
      //       currTemp = 1.0,
      //       initialTemp = 1.0;

      //     console.log("nsweeps =>", nsweeps);
      //     for (var i = 0; i < nsweeps; i++) {
      //       for (var j = 0; j < m; j++) {
      //         mcmove(currTemp);
      //       }
      //       currTemp = coolingTemp(currTemp, initialTemp, nsweeps);
      //     }

      //     console.log("displaying feedback => ", lab);
      //   };
      //   labeler.width = function(x) {
      //     width = x;
      //     return labeler;
      //   };
      //   labeler.height = function(x) {
      //     height = x;
      //     return labeler;
      //   };
      //   labeler.label = function(x) {
      //     lab = x;
      //     return labeler;
      //   };
      //   labeler.anchor = function(x) {
      //     anc = x;
      //     return labeler;
      //   };
      //   return labeler;
      // };

      // labeler()
      //   .label(labelArray)
      //   .width(1000)
      //   .height(400)
      //   .start(2000);

      // //   console.log("displaying feedback =>", labelArray);

      // var labels = d3
      //   .select("#tree1 g.nodes")
      //   .selectAll("#tree1 g.name")
      //   .data(labelArray)
      //   .enter()
      //   .append("text")
      //   .text((d) => d.nameEn)
      //   .attr("x", (d, i) => {
      //     return d.x;
      //   })
      //   .attr("y", (d, i) => {
      //     return d.y;
      //   })
      //   .attr("text-anchor", "start")
      //   .attr("font-size", 6);

      // labels
      //   .transition()
      //   .duration(1500)
      //   .attr("x", (d) => {
      //     // console.log('d.x', d.x)
      //     return d.x;
      //   })
      //   .attr("y", (d) => d.y);

      //Add marriage text - deprecated
      /*d3.select('#tree1 g.links')
                .append('text')
                .text(this.$t('marriage'))
                .classed('mLink', true)
                .attr('x', function(){
                    var hLink = linkData[linkData.length-1]
                    return ((calcX(hLink.target.x)-calcX(hLink.source.x))/2)+calcX(hLink.source.x)-(this.getComputedTextLength()/2)
                })
                .attr('y', ()=>{
                    var hLink = linkData[linkData.length-1],
                        sy = calcY(hLink.source.data.year),
                        ty = calcY(hLink.target.data.year);
                    return ((sy<ty)?sy:ty)-5
                })*/
    },
    initTree1() {
      //Process data structure
      var treeLayout = d3.tree();
      treeLayout.size([1000, 400]);
      var collapse = (d) => {
        if (d.children) {
          d._children = d.children;
          d._children.forEach(collapse);
          d.children = null;
        }
      };

      var collapseData = (d) => {
        if (d.data && d.data.children) {
          d.data._children = d.data.children;
          d.data._children.forEach(collapse);
          d.data.children = null;
        }
      };

      this.redraw(treeLayout);
      this.calcOffset();

      if (this.initialRoad) {
        this.root.children.forEach(collapse);
        this.root.children.forEach(collapseData);
        this.initialRoad = false;
        var nodeExit = d3
          .select("#tree1 g.nodes")
          .selectAll("g.node")
          .remove();
        d3.select("#tree1 g.links")
          .selectAll("*")
          .remove();
        // this.initTree1()
        this.redraw(treeLayout);
      }
    },
    initTree2() {
      // Produces circular tribe tree

      var linkGen = d3
        .linkVertical()
        .x(function(d) {
          return d.x;
        })
        .y(function(d) {
          return d.y;
        });

      // Create d3 obj
      var width = this.tree2Height,
        radius = width / 2,
        tree = d3.cluster().size([1.5 * Math.PI, radius]);

      var treeData = tree(d3.hierarchy(this.tree2.data));
      const root = treeData;
      //Add back link as node
      var back = tree(
        d3.hierarchy({ royal: true, id: -1, nameEn: "Back to main tree" })
      );

      //Props for 'back' link/node:
      back.x = 5.498;
      back.y = radius;
      back.depth = 1;
      back.height = 1;
      back.children = [];
      back.parent = treeData;
      treeData.children.push(back);

      const svgGrp = d3.select("#tree1 .tree2-g");

      //Bg elements for tribe tree
      svgGrp
        .append("circle")
        .attr("r", radius)
        .classed("circle", true)
        .classed("circle-outer", true);

      svgGrp
        .append("circle")
        .attr("r", radius * 0.5)
        .classed("circle", true)
        .classed("circle-inner", true);

      var createBackLink = (link) => {
        links
          .data(link)
          .enter()
          .append("path")
          .attr("stroke", "#057711")
          .attr(
            "d",
            d3
              .linkRadial()
              .angle((d) => Math.PI) //Straight
              .radius((d) => -d.y)
          );
      };

      const links = svgGrp
        .append("g")
        .classed("links", true)
        .attr("fill", "none")

        .attr("stroke-opacity", 0.4)
        .attr("stroke-width", 1.5)
        .selectAll("path");

      links
        .data(
          root.links().filter((l) => {
            if (l.target.data.id >= 0) {
              return true;
            } else {
              createBackLink([l]);
              return false;
            }
          })
        )
        .enter()
        .append("path")
        .attr("stroke", "#666")
        .attr(
          "d",
          d3
            .linkRadial()
            .angle((d) => d.x + Math.PI / 4)
            .radius((d) => d.y)
        );

      // .enter().append("line")
      // .attr("x1", function(d) { return radialPoint(d.source.x,d.source.y)[0]; })
      // .attr("y1", function(d) { return radialPoint(d.source.x,d.source.y)[1]; })
      // .attr("x2", function(d) { return radialPoint(d.target.x,d.target.y)[0]; })
      // .attr("y2", function(d) { return radialPoint(d.target.x,d.target.y)[1]; })

      // Position node
      function radialPoint(x, y) {
        return [(y = +y) * Math.cos((x -= Math.PI / 2)), y * Math.sin(x)];
      }

      // Largely copied from the main tree - as the nodes look similar
      const node = svgGrp
        .append("g")
        .classed("nodes", true)
        .attr("stroke-linejoin", "round")
        .selectAll("g")
        .data(root.descendants().reverse())
        .enter()
        .append("g")
        .classed("root", (d) => {
          return !d.parent;
        }) //Add root class to root node
        .classed("royal", (d) => {
          return d.data.royal;
        })
        .attr("data-id", (d) => {
          return d.data.id;
        })
        .classed("node", true)
        .classed("back", (d) => d.data.id == -1)
        .on("mouseover", (d) => {
          this.hover = true;
          this.selected = d.data;
        })
        .on("mouseout", (d) => {
          this.hover = false;
          this.selected = false;
        })
        .on("click", (d) => {
          if (d.data.id == -1) {
            this.back();
          } else {
            this.openModal(d.data);
          }
        })
        .attr(
          "transform",
          (d) => `
                    rotate(${(d.x * 180) / Math.PI - 45})
                    translate(${d.y},0)
                `
        );
      // rotate(${d.x * 180 / Math.PI - 45})
      var name = node
        .append("g")
        .classed("name", true)
        .attr("transform", (d) => `rotate(-${(d.x * 180) / Math.PI - 45})`);
      // name.append('rect')
      name.append("text").text((d) => d.data.nameEn);
      name
        .append("text")
        .text((d) => d.data.nameAr)
        .classed("ar-font", true);

      var nodeR = node.append("g").classed("nodeR", true);
      nodeR
        .append("rect")
        .classed("inner", true)
        .attr("rx", "2");
      nodeR
        .append("g")
        .classed("border", true)
        .append("rect")
        .classed("t1", true)
        .attr("rx", "2");

      this.tree2 = true;
    },
    back() {
      //Fade tree, transition back to main tree
      this.$GSAP.TweenMax.to(".tree2-g *", 0.5, {
        css: { opacity: 0 },
        onComplete: () => {
          d3.selectAll(".tree2-g > *").remove();
          this.tree2 = false;
          this.activeDateRange = this.dateRange;
          setTimeout(() => {
            // this.initTree1()
            var treeLayout = d3.tree();
            treeLayout.size([500, 400]);
            this.redraw(treeLayout);
            this.tmk++;
            this.selected = false;
            this.$GSAP.TweenMax.to(".tree-g, .tree-g .links", 0.5, {
              css: { opacity: 1 },
            });
            this.$GSAP.TweenMax.to(this.$refs.backTxt, 0.5, {
              css: { opacity: 0 },
            });
          }, 50);
        },
      });
    },
    moveCursor(e) {
      this.xChild = e.clientX;
      this.yChild = e.clientY;
      setTimeout(() => {
        this.xParent = e.clientX - 14;
        this.yParent = e.clientY - 14;
      }, 10);

      //Cursor year
      if (this.tree == 1) {
        var tMinY = this.$refs.timeline.$el.offsetParent.offsetTop + 20,
          tHeight = this.$refs.timeline.$el.clientHeight - 20,
          tMaxY = tMinY + tHeight,
          date = Math.round(
            ((this.yChild - tMinY) *
              (this.activeDateRange[1] - this.activeDateRange[0])) /
              tHeight +
              this.activeDateRange[0]
          );
        // this.cursorYear = (this.dateRange[0] < date && date < this.dateRange[1]) ? this.processDate(date) : null
        this.date = date;
        this.cursorYear = this.processDate(date);
      }
    },
    tree2Zoom(d) {
      this.tree2Scale += this.tree2Scale - d / 10 >= 1 ? -d / 10 : 0;
    },
    pan(e) {
      if (this.tree2 && this.dragging) {
        this.tree2Offset[0] += e.movementX;
        this.tree2Offset[1] += e.movementY;
      } else if (this.dragging) {
        var x =
          122 +
          this.$refs.svg1.clientWidth / 2 -
          this.$refs.treeGrp.getBoundingClientRect().width / 2;
        var y = this.$refs.svg1.getBoundingClientRect().top;
        this.treeOffset = x - (this.dStartX - e.clientX);
        this.$refs.timeline.pan(-e.movementY);
      }
    },
    processDate(d) {
      return d >= 0 ? `${d} AD` : `${-d} BC`;
    },
    scale(d) {
      this.activeDateRange = d;
      this.updateTree1();
    },
    loadTribe(t) {
      var id = t._id;
      this.tribeName = { en: t.nameEn, ar: t.nameAr };
      this.$axios
        .$post("/api", { call: "getTribeTree", payload: { _id: id } })
        .then((res) => {
          this.tree2 = res;
          this.initTree2();
          setTimeout(() => {
            // Animating to tribe tree:
            var nonMatches = [],
              tree1Nodes = Array.from(
                document.querySelectorAll(".tree-g [data-id]")
              ),
              tree2Nodes = Array.from(
                document.querySelectorAll(".tree2-g [data-id]")
              ),
              tree2NodesIds = tree2Nodes.map((val) =>
                val.getAttribute("data-id")
              ),
              matches = tree1Nodes.filter((val) => {
                var p = tree2NodesIds.includes(val.getAttribute("data-id"));
                if (!p) {
                  nonMatches.push(val);
                }
                return p;
              }),
              //Slightly faster way to do this would be to use tree2NodesIds and then use the index of the match
              animTargets = matches.map((val) => [
                val,
                tree2Nodes.find(
                  (tVal) =>
                    val.getAttribute("data-id") == tVal.getAttribute("data-id")
                ),
              ]);

            //fade links + non matches
            this.$GSAP.TweenMax.to(
              [
                nonMatches,
                ".tree-g .links",
                ".tree-g .name",
                ".tree-g .logoImg",
              ],
              0.6,
              { css: { opacity: 0 } }
            );
            var offsetx =
              this.treeOffset +
              this.$refs.svg1.getBoundingClientRect().left +
              35;
            var offsety = this.$refs.svg1.getBoundingClientRect().top;
            animTargets.forEach((x, index, array) => {
              x[0].removeChild(x[0].childNodes[1]);
              if (x[0].childNodes[1]) {
                x[0].removeChild(x[0].childNodes[1]);
              }

              //Animate to tribe tree location
              //x - half the width of the node + position of tribe node - offset
              this.$GSAP.TweenMax.to(x[0], 1, {
                css: {
                  x:
                    x[1].getBoundingClientRect().width / 2 +
                    x[1].getBoundingClientRect().left -
                    offsetx,
                  y:
                    x[1].getBoundingClientRect().height / 2 +
                    x[1].getBoundingClientRect().top -
                    offsety,
                },
                delay: 0.4,
                ease: this.$GSAP.Power2.in,
              });

              if (index == array.length - 1) {
                // fade in elements at various times and durations
                this.$GSAP.TweenMax.to(".tree2-g .circle", 0.5, {
                  css: { opacity: 1 },
                  delay: 0.8,
                });
                this.$GSAP.TweenMax.to(matches, 0.2, {
                  css: { opacity: 0 },
                  delay: 1.2,
                  onComplete: () => {
                    d3.selectAll(
                      ".tree-g .links > *, .tree-g .nodes > *"
                    ).remove();
                    this.$GSAP.TweenMax.set(".tree-g", { css: { opacity: 0 } });
                  },
                });
                this.$GSAP.TweenMax.to(".tree2-g .nodes", 0.2, {
                  css: { opacity: 1 },
                  delay: 1.2,
                });
                this.$GSAP.TweenMax.to(".tree2-g .links", 0.3, {
                  css: { opacity: 1 },
                  delay: 1,
                });
                this.$GSAP.TweenMax.to(this.$refs.backTxt, 0.3, {
                  css: { opacity: 1 },
                  delay: 1,
                });
              }
            });
          }, 10);
        });
    },
  },
};
</script>

<style lang="scss">
img.progeny-description {
  position: absolute;
  right: 40px;
  top: 30px;
  width: 200px;
  z-index: 1000;
  cursor: pointer;
}
.tree2-g {
  // opacity: 0;
  // margin-top: 10px;
  // &.active{
  //     opacity: 1
  // }
  .links,
  .nodes,
  .circle {
    opacity: 0;
  }
}

.tree {
  background: url("../assets/img/watermark-min.png"),
    url("../assets/img/bg2-min.jpg");
  background-size: 226px, cover;
  background-position: 50% 50%, 50% 50%;
  background-repeat: no-repeat;

  .mLink {
    fill: #05560d;
    font-weight: bold;
    font-style: italic;
    fill-opacity: 0.3;
  }

  .modalContainer {
    z-index: 10000000000000000;
    background: none;

    .bg {
      background: none;
      transition: background 0.1s;

      &.active {
        background: rgba(black, 0.3);
      }
    }

    .modal {
      // box-sizing: content-box
      position: relative;
      max-width: 90em;
      overflow-y: auto;
    }

    .close {
      transform: scale(1.4);
      top: 30px;
      right: 30px;
    }

    // box-sizing: content-box
  }
}

.tree-g.anim {
  .links {
    opacity: 0;
  }

  .node {
    opacity: 0;

    .name,
    .logoImg {
      opacity: 0;
    }

    &.a {
      transition: all 1s;
    }

    .t1 {
      opacity: 0;
    }
  }
}

.tree-container {
  text-align: center;
  cursor: none;
  background: rgba(black, 0.015);
  // padding: 130px 0;
  // box-sizing: content-box;
  // overflow: hidden;
}

.timeline-container {
  // position: relative;
  position: absolute;
  // margin: 130px 0;
  height: 100%;
  max-height: calc(100vh - (140px + 5em)); //temp solution
  // box-sizing: content-box;
  // padding: 130px 0;
  // height: calc(100% - 260px);
  //temp
  // top: 130px;
  // left: 100px;
}

.tree-wrap {
  box-sizing: content-box;
  // position: relative;
  padding-bottom: 5em;
  max-height: calc(100vh - (140px + 5em));
  // height: auto;
  // padding-bottom: 140px;
  // height: calc(100vh - 140px);
}

.circle {
  fill: none;
  stroke: rgba(black, 0.11);
  stroke-width: 1px;
}

.logoImg {
  image {
    height: 60px;
    width: 60px;
    transition: 0.3s all;
  }

  rect {
    width: 60px;

    height: 60px;
    fill: none;
    rx: 5;
    ry: 5;
  }

  opacity: 0.6;
  transition: opacity 0.3s ease;
  transform: translate(-80px, -30px);
}

.tree2-g {
  .node.back {
    .name {
      display: none;
    }
  }
}

.node {
  &:hover,
  &.active {
    // cursor: pointer;
    .border .t1 {
      width: 26px;
      height: 26px;
      fill: url(#radial-gradient);
      transform: translate(-12.5px, -12.5px);
    }

    .border {
      stroke: #919191;
    }

    .logoImg {
      opacity: 1;
      // transform: translate(-60px, -40px) scale(2)
      image {
        width: 110px !important;
        height: 110px !important;
        transform: translate(-60px, -40px) !important;
      }

      rect {
        width: 110px !important;
        height: 110px !important;
      }
    }
  }

  .name {
    opacity: 0;
    transition: 0.2s opacity;

    text {
      fill: #919191;
      font-size: 11px;
      // font-weight: bold;
      &:first-of-type {
        transform: translate(18px, 5px);
      }

      &:nth-of-type(2) {
        transform: translate(18px, 20px);
      }
    }
  }

  &.royal {
    .name {
      text {
        fill: #05560d;
      }
    }

    .border {
      stroke: #05560d;
    }

    .inner {
      fill: #05560d;
    }
  }

  .inner-circle-hidden {
    display: none;
  }

  .inner-circle {
    fill: #ff5500;
  }

  .inner-circle-border {
    border: 1px solid #ff5500;
    fill: transparent;
    stroke: #ff5500;
  }

  .inner-circle-border-hidden {
    display: none;
  }

  &.progeny_continued {
    .name {
      text {
        fill: #0000ff;
      }
    }

    .border {
      stroke: #0000ff;
    }

    .inner {
      fill: #0000ff;
    }
  }

  &.progeny_discontinued {
    .name {
      text {
        fill: #ff0000;
      }
    }

    .border {
      stroke: #ff0000;
    }

    .inner {
      fill: #ff0000;
    }
  }

  &.progeny_unknown {
    .name {
      text {
        fill: #05560d;
      }
    }

    .border {
      stroke: #05560d;
    }

    .inner {
      fill: #05560d;
    }
  }

  &.marriage {
    .name {
      text {
        fill: #ff5500;
      }
    }

    .border {
      stroke: #ff5500;
    }

    .inner {
      fill: #ff5500;
    }
  }

  .border {
    fill: none;
    stroke: none;
    stroke-width: 1px;

    .t1 {
      width: 13.94px;
      height: 13.94px;
      transform: translate(-6.6px, -6.6px);
      transition: all 0.2s;
    }
  }

  .inner {
    fill: #919191;
    width: 9.15px;
    height: 9.15px;
    transform: translate(-4.075px, -4.075px);
  }
}

//Size Changes
#tree1 {
  &.s-1 {
    .link {
      stroke-width: 1.5px;
    }

    .node {
      .name {
        opacity: 1;
      }

      &:hover,
      &.active {
        .border .t1 {
          width: 30px;
          height: 30px;
          transform: translate(-14.4px, -14.4px);
        }
      }

      .border .t1 {
        width: 21px;
        height: 21px;
        transform: translate(-9.9px, -9.9px);
      }

      .inner {
        width: 13.7px;
        height: 13.7px;
        transform: translate(-6.113px, -6.113px);
      }
    }

    .link.toNr {
      stroke-opacity: 1;
    }

    .logoImg {
      image {
        height: 90px;
        width: 90px;
      }

      rect {
        width: 90px;
        height: 90px;
      }

      transform: translate(-110px, -45px);
    }
  }
}

.link {
  fill: none;
  stroke: rgba(#057711, 0.4);
  stroke-width: 1px;

  &.toNr {
    stroke: rgba(#919191, 0.4);
    stroke-opacity: 0;
  }
}

//Cursor

.g-cursor {
  // overflow: hidden;
  // width: auto;
  position: relative;

  .cursor-line {
    width: 100%;
    overflow: hidden;
    position: absolute;
    pointer-events: none;
    text-align: left;
    top: 11px;

    span {
      right: 0;
      float: right;
      position: relative;
      color: rgba(#666, 0.3);
      @apply font-semibold;
      // position: absolute;
    }
  }

  hr {
    position: absolute;
    border: 1px solid rgba(#666, 0.15);
    width: 100%;
    overflow: hidden;
    top: 3px;
    z-index: 0;
  }

  &_hide {
    opacity: 0;
    //   width: 60px;
    //   height: 60px;
    transition: width 0.6s ease, height 0.6s ease, opacity 0.6s ease;
  }

  &__circle {
    pointer-events: none;
    user-select: none;
    top: 0;
    left: 0;
    position: fixed;
    width: 30px;
    height: 30px;
    border: 1px solid #666;
    border-radius: 100%;
    z-index: 5555;
    opacity: 0.8;
    backface-visibility: hidden;
    transition: opacity 0.6s ease;
  }

  &__point {
    top: 0;
    left: 0;
    position: fixed;
    width: 10px;
    height: 10px;
    pointer-events: none;
    user-select: none;
    border-radius: 100%;
    background: #666;
    z-index: 55555555;
    backface-visibility: hidden;
    will-change: transform;
  }

  &_hover {
    .g-cursor__circle {
      opacity: 0.3;
      width: 40px;
      height: 40px;
      left: -5px;
      top: -5px;
      transition: width 0.2s ease, height 0.2s ease, opacity 0.2s ease;
    }

    .g-cursor__point {
      opacity: 0.5;
    }
  }
}
</style>

<i18n lang="yaml">
    {
    "en": {
    marriage: 'Marriage',
    back: "Back to main tree",
    images: 'Images',
    videos: 'Videos',
    bio: 'Biography'
    },
    "ar": {
    marriage: 'زواج',
    back: "العودة إلى الشجرة الرئيسية",
    images: 'صور',
    videos: 'أشرطة فيديو',
    bio: 'سيرة شخصية'
    },
    "ur": {
    marriage: 'شادی',
    back: "واپس مرکزی درخت پر",
    images: 'تصاویر',
    videos: 'ویڈیوز',
    bio: 'سیرت'
    }
    }
</i18n>
