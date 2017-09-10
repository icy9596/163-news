import VueRouter from 'vue-router';

// 新闻模块
import news from '../../components/news/news';
import index from '../../components/news/index';
import cart from '../../components/news/cart';
import inland from '../../components/news/inland';
import foreign from '../../components/news/foreign';

// 功能模块
import game from '../../components/game/game';
import discover from '../../components/discover/discover';
import setting from '../../components/setting/setting';

// 新闻详情
import newDetail from '../../components/news/new-detail';

// 图集
import photoView from '../../components/photo/photoview';

let routes = [
    {
        path: '/',
        redirect: '/news'
    },
    {
        path: '/news',
        component: news,
        children: [
            {
                path: '',
                redirect: 'index'
            },
            {
                path: 'index',
                component: index,
                meta: {
                    keepAlive: false,
                    title: '网易 - 头条新闻'
                }
            },
            {
                path: 'inland',
                component: inland
            },
            {
                path: 'foreign',
                component: foreign
            },
            {
                path: 'cart',
                component: cart
            },
            {
                path: ':docId',
                components: {
                    default: index,
                    newDetail: newDetail
                },
                meta: {
                    keepAlive: false,
                    title: '新闻详情'
                }
            }
        ]
    },
    {
        path: '/game',
        component: game,
        meta: {
            title: '游戏'
        }
    },
    {
        path: '/discover',
        component: discover,
        meta: {
            title: '发现'
        }
    },
    {
        path: '/setting',
        component: setting,
        meta: {
            title: '设置'
        }
    },
    {
        path: '/photoview/:id',
        component: photoView,
        meta: {
            title: '图集'
        }
    }
];

let router = new VueRouter({
    routes
});

router.afterEach($route => {
    document.title = $route.meta.title;
});

export default router;
