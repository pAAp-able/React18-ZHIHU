import React, { useEffect } from 'react';
import './index.less';
import SkeletonAgain from '../../component/SkeletonAgain';
import NavBarAgain from '../../component/NavBarAgain';
import NewsItem from '../../component/Newsitem'
import { SwipeAction, Toast } from 'antd-mobile';
import { connect } from 'react-redux';
import action from '../../store/actions';
import api from '../../api';

const Store = (props) => {
    let { list: storeList, queryStoreListAsync, removeStoreListById } = props;
    /** state部分 **/

    /** effect部分 **/
    useEffect(() => {
        // 如果redux中没有收藏列表，异步派发获取
        if (!storeList) {
            queryStoreListAsync();
        }
    }, [])

    /** methods部分 **/
    const handleRemove = async (id) => {
        try {
            let { code } = await api.storeRemove(id);
            if (+code !== 0) {
                Toast.show({
                    icon: 'fail',
                    content: '移除失败'
                });
                return;
            }
            Toast.show({
                icon: 'success',
                content: '移除成功'
            });
            removeStoreListById(id);
        } catch (_) { }
    };

    /** render **/
    return (
        <div className={"store-box"}>
            <NavBarAgain title="我的收藏" />
            {storeList ?
                <div className="box">
                    {storeList.map(item => {
                        let { id, news } = item;
                        return <SwipeAction key={id} rightActions={[{
                            key: 'delete',
                            text: '删除',
                            color: 'danger',
                            onClick: handleRemove.bind(null, id),
                        }]}>
                            <NewsItem info={news} />
                        </SwipeAction>;
                    })}
                </div> :
                <SkeletonAgain />
            }
        </div>
    );
};

export default connect(
    state => state.store,
    action.store,
)(Store);