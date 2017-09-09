<template>
    <transition name="fade">
        <div class="index">
            <scroller class="pos" ref="scroller"
                :refreshText="'刷新内容'"
                :on-refresh="refresh"
                :on-infinite="infinite"
            >
                <!-- 轮播海报 -->
                <Swiper 
                    :list="swiperList"
                    :auto="true"
                    :loop="true"
                ></Swiper>
                <!-- 滚动新闻 -->
                <Marquee class="marquee">
                    <MarqueeItem v-for="(item,i) in marqueeList" :key="i">{{item}}</MarqueeItem>
                </Marquee>
                <!-- 图文列表 -->
                <Panel :list="panelList" type="1"></Panel>
            </scroller> 
        </div>
    </transition>
</template>

<script>
    function getUrl (item) {
        let url;
        if (item.type === 'doc') {
            url = `/news/${item.docid}`;
        } else if (item.type === 'photoset') {
            url = `/photoview/${item.typeid}`;
        }
        return url;
    }

    import { Swiper, Marquee, MarqueeItem, Panel } from 'vux';

    let typeList = ['A', 'B01', 'B02', 'B03', 'B04', 'B05', 'B06', 'B07', 'B08', 'B09', 'B10'];
    let key = 0;
    let type = 'A';

    function getType () {
        key++;
        if (key === typeList.length) {
            key = 0;
        }
        type = typeList[key];
    }
    
    export default {
        data () {
            return {
                swiperList: [],
                marqueeList: [],
                panelList: [],
                pageIndex: 0,
                initLoad: false
            };
        },
        methods: {
            refresh () {
                getType();

                this.pageIndex = 0;

                this.$http.jsonp(`http://3g.163.com/touch/jsonp/sy/recommend/0-9.html`, {
                    params: {
                        miss: 0,
                        refresh: type
                    }
                }).then(res => {
                    let body = res.body;
                    if (body.code === 200) {
                        this.panelList = body.list.filter(item => (item.addata === null && item.picInfo.length > 0)).map(item => {
                            return {
                                src: item.picInfo[0].url,
                                title: item.title,
                                url: getUrl(item),
                                desc: item.category
                            };
                        });
                        this.$refs.scroller.finishPullToRefresh();
                        this.$vux.toast.text(`成功刷新${this.panelList.length}条数据`, 'top');
                    }
                });
            },
            infinite () {
                if (!this.initLoad) {
                    this.$refs.scroller.finishInfinite();
                    return;
                }
                this.pageIndex++;
                let start = this.pageIndex * 10;
                let end = start + 10;
                this.$http.jsonp(`http://3g.163.com/touch/jsonp/sy/recommend/${start}-${end}.html`, {
                    params: {
                        miss: 0,
                        refresh: type
                    }
                }).then(res => {
                    let body = res.body;
                    let data;
                    if (body.code === 200) {
                        data = body.list.filter(item => (item.addata === null && item.picInfo.length > 0)).map(item => {
                            return {
                                src: item.picInfo[0].url,
                                title: item.title,
                                url: getUrl(item),
                                desc: item.category
                            };
                        });
                        this.panelList = this.panelList.concat(data);
                    }
                    this.$refs.scroller.finishInfinite();
                });
            }
        },
        components: {
            Swiper,
            Marquee,
            MarqueeItem,
            Panel
        },
        created () {
            this.$http.jsonp('http://3g.163.com/touch/jsonp/sy/recommend/0-9.html').then(res => {
                let body = res.body;
                if (body.code === 200) {
                    this.initLoad = true;
                    this.swiperList = body.focus.filter(item => item.addata === null).map(item => {
                        return {
                            img: item.picInfo[0].url,
                            url: getUrl(item),
                            title: item.title
                        };
                    });

                    body.live.forEach(item => {
                        this.marqueeList.push(item.title);
                    });

                    this.panelList = body.list.filter(item => item.addata === null).map(item => {
                        return {
                            src: item.picInfo[0].url,
                            title: item.title,
                            url: `/news/${item.docid}`,
                            desc: item.category
                        };
                    });
                }
            });
        }
    };
</script>

<style lang="less">
    #app {
        .index {
            position: absolute;
            width: 100%;
            top: 46px;
            bottom: 0px;
            overflow: hidden;
        }
        .marquee {
            margin: 10px;
            color: #333;
        }

        .weui-media-box__hd, .weui-media-box__hd img {
            width: 102px;
            height: 78px;
        }

        .weui-media-box__title {
            white-space: normal;
        }

        .pos {
            position: relative;
            left: 0;
            top: 0;
        }

        .fade-enter-active, .fade-leave-active {
            transition: opacity 0.3s;
        }
        .fade-enter, .fade-leave-to {
            opacity: 0;
        }
    }
</style>
