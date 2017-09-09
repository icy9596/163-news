<template>
    <div class="slide" ref="slide">
        <ul class="imgs" ref="imgs">
            <li v-for="(item, index) in data" :key="index" class="img-item" ref="imgItem">
                <img :src="item.src" @load="imgLoaded">
            </li>
        </ul>
    </div>
</template>

<script>
    import BScroll from 'better-scroll';

    export default {
        props: {
            data: {
                type: Array,
                default: []
            }
        },
        methods: {
            setWidth () {
                let imgs = this.$refs.imgs;
                let imgItems = this.$refs.imgItem;
                let clientWidth = document.body.clientWidth;
                let len = this.data.length;
                imgs.style.width = len * clientWidth + 'px';
                for (let i = 0; i < len; i++) {
                    imgItems[i].style.width = clientWidth + 'px';
                }
            },
            imgLoaded () {
                clearTimeout(this.timer);
                this.timer = window.setTimeout(() => {
                    this.slide.refresh();
                }, 300);
            },
            _initSlide () {
                this.slide = new BScroll(this.$refs.slide, {
                    snap: true,
                    scrollX: true,
                    momentum: false
                });
                this.slide.on('scrollEnd', (pos) => {
                    let page = this.slide.getCurrentPage().pageX;
                    this.$emit('scrollEnd', {
                        currentPage: page
                    });
                });
            }
        },
        mounted () {
            this.setWidth();
            this._initSlide();
        }
    };
</script>

<style lang="less" scoped>
    .slide {
        width: 100%;
        overflow: overflow;
        .imgs {
            display: flex;
            align-items: center;
            white-space: nowrap;
            .img-item {
                display: inline-block;
                img {
                    display: block;
                    width: 100%;
                }
            }
        }
    }
</style>
