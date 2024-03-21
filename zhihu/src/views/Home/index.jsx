import React, { useState, useEffect, useRef } from "react";
import HomeHead from "../../component/HomeHead";
import _ from "../../assets/utils"
import { Swiper, Image, Divider, DotLoading } from "antd-mobile";
import './index.less'
import { Link } from "react-router-dom";
import api from '../../api'
import Newsitem from "../../component/Newsitem"
import SkeletonAgain from "../../component/SkeletonAgain"



const Home = function Home() {
    let [today, setToday] = useState(_.formatTime(null, "{0}{1}{2}"))
    let [bannerData, setBannerData] = useState([])
    let [newList, setNewList] = useState([])
    let lodeMore = useRef()
    //let [scroll, setScroll] = useState("")
    //第一次渲染完毕，向服务器发送请求
    useEffect(() => {
        (async () => {
            try {
                let res = await api.queryNewsLatest()
                console.log(res)
                let { date, stories, top_stories } = res
                setToday(date)
                setBannerData(top_stories)
                //更新新闻列表信息
                newList.push({
                    date,
                    stories
                })
                setNewList([...newList])
            } catch (error) {
                console.log(error)
            }
        })()
        return () => null
    }, [])
    //第一次渲染完毕，设置监听器实现数据加载
    //IntersectionObserver交叉观察器:监听”数据加载中“是否出现在视窗中，当视窗发送变化的时候，isIntersecting会变为true
    useEffect(() => {
        let ob = new IntersectionObserver(async changes => {
            let { isIntersecting } = changes[0]
            if (isIntersecting) {
                //加载更多的按钮出现在视口中
                try {
                    let time = newList[newList.length - 1]['date']
                    const res = await api.queryNewsBefore(time)
                    newList.push(res)
                    setNewList([...newList])
                } catch (error) {
                    console.log(error)
                }
            }
        })
        let loadMoreBox = lodeMore.current
        ob.observe(lodeMore.current)
        //在组件销毁释放的时候，销毁监听器
        return () => {
            ob.unobserve(loadMoreBox)
            ob = null
        }
    }, [])

    // const getScollTop = () => {
    //     let docu = document.documentElement
    //     let result = docu.scrollHeight - docu.clientHeight - docu.scrollTop
    //     setScroll(result)
    // }

    return <div className="home_box">
        <HomeHead today={today} />

        <div className="swiper-box">
            {bannerData.length > 0 ? <Swiper autoplay={true} loop={true}>
                {bannerData.map((item) => {
                    let { id, image, title, hint } = item
                    return <Swiper.Item key={id}>
                        <Link to={{
                            pathname: `/detail/${id}`
                        }}>
                            <Image src={image} lazy />
                            <div className="desc">
                                <h3 className="title">{title}</h3>
                                <p className="author">{hint}</p>
                            </div>
                        </Link>
                    </Swiper.Item>
                })}
            </Swiper> : null}
        </div>

        {newList.length === 0 ? <SkeletonAgain /> : <>{
            newList.map((item, index) => {
                let { date, stories } = item
                return <div className="new_box" key={date}>
                    {index === 0 ? null : <Divider contentPosition='left'>{_.formatTime(date, '{1}年{2}日')}</Divider>}
                    <div className="list">
                        {stories.map((el) => {
                            return <Newsitem info={el} key={el.id} />
                        })}
                    </div>
                </div>
            })
        }</>}

        {/*  加载更多 */}
        <div className="loading-box" ref={lodeMore} style={{
            display: newList.length === 0 ? 'none' : "block"
        }} >
            <DotLoading />
            数据加载中
        </div>
    </div>
}

export default Home

