import { lazy } from "react";
import Home from "../views/Home";
import { withKeepAlive } from "keepalive-react-component";

const routes = [
    {
        path: '/',
        name: "home",
        component: withKeepAlive(Home, { cacheId: "home", scroll: "true" }),
        meta: {
            title: "知乎日报-首页"
        }
    }, {
        path: '/detail/:id',
        name: "detail",
        component: lazy(() => import('../views/Detail')),
        meta: {
            title: "知乎日报-新闻详情"
        }
    }, {
        path: '/personal',
        name: "personal",
        component: lazy(() => import('../views/Personal')),
        meta: {
            title: "知乎日报-个人中心"
        }
    }, {
        path: '/store',
        name: "store",
        component: lazy(() => import('../views/Store')),
        meta: {
            title: "知乎日报-个人收藏"
        }
    }, {
        path: '/login',
        name: "login",
        component: lazy(() => import('../views/Login')),
        meta: {
            title: "知乎日报-登录注册"
        }
    }, {
        path: '/update',
        name: "update",
        component: lazy(() => import('../views/Update')),
        meta: {
            title: "知乎日报-修改个人信息"
        }
    }, {
        path: '*',
        name: "page404",
        component: lazy(() => import('../views/Page404')),
        meta: {
            title: "知乎日报-404"
        }
    }]
export default routes