<template>
    <div class="news">
        <div class="tab">
            <!-- tab栏 -->
            <Scroller :lock-y="true">
                <tab
                    :style="{'width': tabWidth}"
                    :line-width="3"
                    :animate="false"
                    :active-color="'#35495e'"
                    :index="2"
                >
                    <tab-item @on-item-click="go(item)" :selected="i===0" v-for="(item,i) in tabList" :key="i">{{item.title}}</tab-item>
                </tab>
            </Scroller>
        </div>

         <transition enter-active-class="animated zoomInRight" leave-active-class="animated zoomOutLeft"> 
            <router-view></router-view>
         </transition> 
        
    </div>
</template>

<script>
    import { Tab, TabItem, Scroller } from 'vux';

    export default {
        data () {
            return {
                tabList: [
                    {
                        title: '头条',
                        path: 'index'
                    },
                    {
                        title: '国内新闻',
                        path: 'inland'
                    },
                    {
                        title: '国外新闻',
                        path: 'foreign'
                    },
                    {
                        title: '汽车',
                        path: 'cart'
                    },
                    {
                        title: '历史',
                        path: 'index'
                    },
                    {
                        title: '游戏',
                        path: 'index'
                    },
                    {
                        title: '视频',
                        path: 'index'
                    }
                ]
            };
        },
        methods: {
            go (item) {
                this.$router.push(`/news/${item.path}`);
            }
        },
        computed: {
            tabWidth () {
                return this.tabList.length * 100 + 'px';
            }
        },
        components: {
            Tab,
            TabItem,
            Scroller
        }
    };
</script>

<style lang="less">
    .news {
        height: 100%;
        position: relative;
    }
</style>
