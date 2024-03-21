import React, { useEffect, useState, useMemo } from "react";
import './index.less'
import { LeftOutline, MessageOutline, LikeOutline, StarOutline, MoreOutline } from "antd-mobile-icons";
import { Badge, Button, Toast } from "antd-mobile";
import api from "./../../api"
import SkeletonAgain from "../../component/SkeletonAgain";
import { flushSync } from "react-dom";
import { connect } from "react-redux";
import action from "../../store/actions";

const Detail = function Detail(props) {
    let { navigate, params, base: { info: useInfo }, location, store: { list: storeList } } = props
    let [info, setInfo] = useState(null)
    let [extra, setExtra] = useState(null)

    let link = document.createElement('link')

    const handleStyle = (result) => {
        let { css } = result
        if (!Array.isArray(css)) return
        //创建link导入样式
        link.rel = "stylesheet"
        link.href = css[0]
        document.head.appendChild(link)
    }
    const handleImage = (result) => {
        let imgPlaceHolder = document.querySelector('.img-place-holder')
        let title = document.createElement("h2")
        title.innerHTML = result.title
        title.className = "title"
        if (!imgPlaceHolder) return
        let tempImg = document.createElement('img')
        //let tempImg = new Image()
        tempImg.src = result.image
        tempImg.onload = () => {
            imgPlaceHolder.appendChild(title)
            imgPlaceHolder.appendChild(tempImg)
        }
        tempImg.onerror = () => {
            let parent = imgPlaceHolder.parentNode
            parent.parentNode.removeChild(parent)
        }
    }

    //点击收藏按钮
    const handleStore = async () => {
        console.log(useInfo)
        if (!useInfo) {
            Toast.show({
                icon: "fail",
                content: '请先登录'
            })
            navigate(`/login?to=${location.pathname}`, { replace: true })
            return
        }
        //已经登录&&已经收藏--移除收藏
        if (isStore) {
            let item = storeList.find(item => {
                return +item.news.id === +params.id
            })
            if (!item) return
            let { code } = await api.storeRemove(item.id)
            if (+code !== 0) {
                Toast.show({
                    icon: "fail",
                    content: "操作失败"
                })
                return
            }
            Toast.show({
                icon: "success",
                content: "操作成功"
            })
            props.removeStoreListById(item.id) //告诉redux把这一项也去掉
            return
        }
        //已经登录&&未收藏
        let { code } = await api.store(params.id)
        if (+code !== 0) {
            Toast.show({
                icon: "fail",
                content: "收藏失败"
            })
            return
        }
        Toast.show({
            icon: "success",
            content: "收藏成功"
        })
        props.queryStoreListAsync() //同步最新的收藏列表到redux容器中
    }

    //获取新闻详情，渲染页面
    useEffect(() => {
        (async () => {
            let result = await api.queryNewsInfo(params.id)
            try {
                let xxx = await api.queryNewsStory(params.id)
                console.log(xxx)
            } catch (error) {
                console.log(error)
            }
            flushSync(() => {
                setInfo(result)
                handleStyle(result)
            })
            handleImage(result)
        })()
        // eslint-disable-next-line react-hooks/exhaustive-deps
        //组件销毁的时候，移除link
        return () => {
            if (link) document.head.removeChild(link)
        }
    }, [])

    //  获取点赞和收藏数量
    useEffect(() => {
        (async () => {
            let extra = await api.queryStoryExtra(params.id)
            setExtra(extra)

        })()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    //渲染页面时，获取用户登录信息以及收藏列表
    useEffect(() => {
        (async () => {
            //第一次渲染完成的时候，如果useInfo不存在，派发任务同步登陆者信息
            if (!useInfo) {
                let { info } = await props.queryUserInfoAsync()
                useInfo = info
            }
            //如果已经登录&&没有收藏列表信息
            if (useInfo && !storeList) {
                props.queryStoreListAsync()
            }

        })()
    }, [])

    //依赖于收藏列表和路径参数，计算出是否收藏
    const isStore = useMemo(() => {
        if (!storeList) return false
        return storeList.some(item => {
            return +item.news.id === +params.id
        })
    }, [storeList, params])


    return <div className="detail_box">
        {!info ? <SkeletonAgain /> :
            <div className="content" dangerouslySetInnerHTML={{ __html: info.body }}></div>
        }
        < div className="bottom-bar" >
            <div className="back"
                onClick={() => {
                    navigate(-1)
                }}>

                <LeftOutline />
            </div>
            <div className="icons">
                <Badge content={extra ? extra.comments : 0}>
                    <MessageOutline />
                </Badge>
                <Badge content={extra ? extra.popularity : 0}>
                    <LikeOutline />
                </Badge>
                <span className={isStore ? "stored" : ""} onClick={handleStore}><StarOutline /></span>
                <span><MoreOutline /></span>
            </div>
        </div >
    </div >
}

export default connect(
    state => state,
    { ...action.base, ...action.store }
)(Detail)