import React, { Suspense, useEffect, useState } from "react";
import { Route, Routes, useNavigate, useLocation, useParams, useSearchParams, Navigate } from "react-router-dom";
import routes from "./index";
import { Mask, SpinLoading, Toast, DotLoading } from "antd-mobile";
import style from './index.less'
import store from '../store'
import action from '../store/actions'

const isCheckLogin = (path) => {
    let { base: { info } } = store.getState()
    let checkList = ['/personal', '/store', 'update']
    return !info && checkList.includes(path)
}

//统一路由配置
const Element = function Element(props) {
    let { component: Component, meta, path } = props
    let isShow = !isCheckLogin(path)
    let [flage, setFlage] = useState(0)
    //登录校验
    useEffect(() => {
        if (isShow) return
        (async () => {
            let infoAction = await action.base.queryUserInfoAsync()
            let info = infoAction.info
            if (!info) {
                //如果获取后还是不存在，跳转到登录页
                Toast.show({
                    icon: 'fail',
                    content: '请先登录'
                })
                navigate({
                    pathname: '/login',
                    search: `?to=${path}`
                }, { replace: true })
                return
            }
            //如何获取到info，说明已经登录
            store.dispatch(infoAction)
            setFlage(+new Date())
        })()
    })



    //修改页面的title
    let { title = '知乎日报-首页' } = meta || {}
    document.title = title
    //获取路由信息，基于属性传递给组件
    const navigate = useNavigate()
    const location = useLocation()
    const params = useParams()
    const [usp] = useSearchParams()




    return <>{
        isShow ? <Component navigate={navigate} location={location} params={params} usp={usp} /> : <Mask visible={true}>
            <DotLoading />
        </Mask>
    } </>
}

export default function RouterView() {
    return <Suspense fallback={<Mask visible={true} color='white' opacity='thin'><SpinLoading className={style} /></Mask>}>
        <Routes>
            {routes.map((item) => {
                let { name, path } = item
                return <Route key={name}
                    path={path}
                    element={
                        <Element {...item}
                        />
                    } />
            })}
        </Routes>
    </Suspense>
}