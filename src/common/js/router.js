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
                component: index
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
            }
        ]
    },
    {
        path: '/game',
        component: game
    },
    {
        path: '/discover',
        component: discover
    },
    {
        path: '/setting',
        component: setting
    }
];

let router = new VueRouter({
    routes
});

export default router;
