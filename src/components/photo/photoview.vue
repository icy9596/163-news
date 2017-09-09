<template>
    <transition name="slide">
        <div class="photoview">
            <header>
                <div class="back" @click="back"><</div>
                <div class="logo"></div>
            </header>

            <div class="slide-wrap">
                <slide @scrollEnd="scrollEndHandle" :data="photoData.imgs" v-if="photoData.imgs"></slide>
            </div>

            <footer>
                <div class="title">
                    <h1>{{photoData.title}}</h1>
                </div>
                <div class="note" v-if="photoData.imgs">
                    <p>{{note}}</p>
                </div>
                <div class="page" v-if="photoData.imgs"><span class="current">{{currentIndex+1}}</span>/{{photoData.imgs.length}}</div>
            </footer>
        </div>
    </transition>
</template>

<script>
    import slide from '../base/slide.vue';

    export default {
        data () {
            return {
                photoData: {},
                currentIndex: 0
            };
        },
        computed: {
            note () {
                return this.photoData.imgs[this.currentIndex].note;
            }
        },
        methods: {
            getPhoto () {
                let id = this.$route.params.id.substr(4, 4) + '|' + this.$route.params.id.split('|')[1];
                this.$http.get(`/api/getPhoto/${id}`).then(res => {
                    if (res.status === 200) {
                        this.photoData = res.body;
                    }
                });
            },
            scrollEndHandle (info) {
                this.currentIndex = info.currentPage;
            },
            back () {
                this.$router.go(-1);
            }
        },
        components: {
            slide
        },
        created () {
            this.getPhoto();
        }
    };
</script>

<style lang="less" scoped>
    .slide-enter-active, .slide-leave-active {
        transition: transform 0.3s;
    }
    .slide-enter, .slide-leave-to {
        transform: translate3d(100%, 0, 0);
    }
    .photoview {
        position: absolute;
        left: 0;
        top:0;
        width: 100%;
        height: 100%;
        z-index: 1000;
        background-color: #333333;

        header {
            position: relative;
            height: 100px;
            padding: 20px;
            background: linear-gradient(to bottom, #000 0%, rgba(51, 51, 51, 0) 100%);
            color: #fff;

            .back {
                display: inline-block;
                text-align: center;
                font-size: 20px;
                line-height: 20px;
                font-weight: bold;
                vertical-align: top;
            }

            .logo {
                position: absolute;
                left: 50%;
                top: 20px;
                transform: translateX(-50%);
                width: 102px;
                height: 23px;
                background: url('../../assets/black_logo_minfy.png') no-repeat;
                background-size: 100% 100%;
            }
        }

        .slide-wrap {
            position: absolute;
            top: 50%;
            left: 0;
            width: 100%;
            transform: translateY(-50%);
        }

        footer {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            box-sizing: border-box;
            padding: 18px 14px;
            background-color: rgba(0, 0, 0, 0.7);
            color: #fff;
            h1 {
                margin-bottom: 18px;
                font-size: 18px;
                font-weight: normal;
                line-height: 18px;
            }
            .note {
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 4;
                overflow: hidden;
                color: #cccccc;
                font-size: 16px;
            }
            .page {
                position: absolute;
                right: 10px;
                top: 2px;
                font-size: 22px;

                .current {
                    color: #bb2c34;
                    font-size: 30px;
                }
            }
        }
    }
</style>
