<template>
    <transition name="slide"> 
        <div class="new-detail-wrap" ref="detail">
            <div class="new-detail">
                <div class="back">
                    <span class="btn" @click="back">返回</span>
                    <span class="text">新闻详情</span>
                </div>
                <div class="title">
                    <h2>{{detail.title}}</h2>
                </div>
                <div class="info" v-html="detail.info"></div>
                <div class="slide-img-wrap" ref="slideWrap">
                    <ul class="slide-img" ref="slide">
                        <li class="img" v-for="(item, index) in detail.imgs" :key="index">
                            <img :src="item.src" @load="imgLoaded">
                            <div class="img-alt" v-if="item.alt">{{item.alt}}</div>
                        </li>
                    </ul>
                    <div class="page" v-if="detail.imgs && detail.imgs.length">
                        <span>{{slideCurrentIndex}} / {{detail.imgs.length}}</span>
                    </div>
                </div>
                <div class="detail-content" v-html="detail.content"></div>

                <Panel :header="'热门推荐'" :list="panelList" type="5"></Panel>
                <Loading v-model="loading" :text="'正在加载 ...'"></Loading>
            </div>
        </div>
    </transition> 
</template>

<script>
    import { Panel, Loading } from 'vux';
    import BScroll from 'better-scroll';

    export default {
        data () {
            return {
                detail: {},
                panelList: [],
                loading: false,
                slideCurrentIndex: 1
            };
        },
        methods: {
            getDetail () {
                let docId = this.$route.params.docId;
                let url = `/api/getNewDetail/${docId}`;
                // this.loading = true;
                this.$http.get(url).then(res => {
                    if (res.status === 200) {
                        this.detail = res.body;
                        this.loading = false;

                        this.$nextTick(() => {
                            this.scroll && this.scroll.refresh();

                            if (res.body.imgs.length) {
                                this._setSlideWidth();
                                this._initSlide();
                            }
                        });
                    }
                });
            },
            getHotNews () {
                let url = 'http://3g.163.com/touch/reconstruct/article/list/BA8J7DG9wangning/0-10.html?firstPage=1';
                this.$http.jsonp(url, {
                    jsonpCallback: 'artiList'
                }).then(res => {
                    if (res.status === 200) {
                        this.panelList = res.body.BA8J7DG9wangning.map(item => {
                            return {
                                src: item.imgsrc,
                                title: item.title,
                                url: `/news/${item.docid}`,
                                desc: item.digest === '' ? '' : `${item.digest}...`,
                                meta: {
                                    source: item.source,
                                    date: item.ptime,
                                    other: `评论量:${item.commentCount}`
                                }
                            };
                        });

                        this.$nextTick(() => {
                            this.scroll && this.scroll.refresh();
                        });
                    }
                });
            },
            imgLoaded () {
                clearTimeout(this.timer);
                this.timer = setTimeout(() => {
                    this.scroll && this.scroll.refresh();
                }, 300);
            },
            _initScroll () {
                this.scroll = new BScroll(this.$refs.detail, {
                    click: true
                });
            },
            _initSlide () {
                this.slide = new BScroll(this.$refs.slideWrap, {
                    scrollX: true,
                    snap: true,
                    momentum: false
                });
                this.slide.on('scrollEnd', () => {
                    let currentIndex = this.slide.getCurrentPage().pageX + 1;
                    this.slideCurrentIndex = currentIndex;
                });
            },
            _setSlideWidth () {
                let slide = this.$refs.slide;
                let childrens = slide.children;
                let clientWidth = this.$refs.slideWrap.clientWidth;
                for (let i = 0, len = childrens.length; i < len; i++) {
                    let li = childrens[i];
                    li.style.width = clientWidth + 'px';
                }
                let width = childrens.length * clientWidth + 'px';
                slide.style.width = width;
            },
            back () {
                this.$router.go(-1);
            }
        },
        watch: {
            $route (to, from) {
                this.scroll.scrollTo(0, 0);
                this.getDetail();
                this.getHotNews();
            }
        },
        components: {
            Panel,
            Loading
        },
        mounted () {
            this._initScroll();
            this.getDetail();
            this.getHotNews();
        }
    };
</script>

<style lang="less">
    #app {
        .slide-enter-active, .slide-leave-active {
            transition: transform 0.5s;
        }
        .slide-enter, .slide-leave-to {
            transform: translate3d(100%, 0, 0);
        }
        .new-detail-wrap {
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            width: 100%;
            z-index: 999;
            background-color: #fff;
            overflow: hidden;

            .new-detail {
                padding: 10px;

                .slide-img-wrap {
                    overflow: hidden;

                    .slide-img {
                        white-space: nowrap;

                        .img {
                            display: inline-block;
                            position: relative;
                            height: 100%;

                            .img-alt {
                                position: absolute;
                                left: 0;
                                bottom: 0;
                                width: 100%;
                                height: 24px;
                                font-size: 14px;
                                line-height: 24px;
                                text-indent: 6px;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                word-break: break-all;
                                background-color: rgba(0,0,0,0.7);
                                color: #fff;
                            }

                            img {
                                display:block;
                                width: 100%;
                            }
                        }
                    }

                    .page {
                        text-align: center;
                    }
                }

                .back {
                    position: relative;
                    text-align: center;
                    font-size: 18px;
                    color: #35495e;
                    &::after {
                        content: '';
                        position: absolute;
                        left: 0;
                        bottom: -2px;
                        width: 100%;
                        height: 0;
                        /* border-bottom: 1px solid #35495e;
                        @media (-webkit-min-device-pixel-ratio: 1.5),(min-device-pixel-ratio: 1.5){
                            transform: scaleY(0.7);
                        }
                        @media (-webkit-min-device-pixel-ratio: 2),(min-device-pixel-ratio: 2) {
                            transform: scaleY(0.5);
                        }
                        @media (-webkit-min-device-pixel-ratio: 3),(min-device-pixel-ratio: 3){
                            transform: scaleY(0.3);
                        } */
                    }

                    .btn {
                        position: absolute;
                        left: 0;
                        top: 50%;
                        transform: translateY(-50%);
                        border-radius:8px;
                        color: #fff;
                        padding: 0 10px;
                        background-color: #35495e;
                    }

                    .text {
                        font-weight: bold;
                        font-size: 22px;
                    }
                }

                .detail-content {
                    .video, .photo {
                        width: 100%;

                        video {
                            width: 100%;
                        }
                        img {
                            width:100%;
                        }
                    }

                    & p {
                        margin:20px 0;
                        text-align:justify;
                        text-indent: 2em;
                    }
                }
                
                .info {
                    font-size: 14px;
                    color: #888;
                    margin: 8px 0;
                }

                .weui-media-box__hd, .weui-media-box__hd img {
                    width: 102px;
                    height: 78px;
                }
            }
        }
    }
</style>
