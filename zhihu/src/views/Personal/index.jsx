import React from 'react';
import { RightOutline } from 'antd-mobile-icons';
import { Link } from 'react-router-dom';
import NavBarAgain from '../../component/NavBarAgain';
import { connect } from 'react-redux';
import action from '../../store/actions';
import './index.less';
import _ from '../../assets/utils';
import { Toast } from 'antd-mobile';

const Personal = (props) => {
    let { info, clearUserInfo, clearStoreList, navigate } = props;
    /** state部分 **/

    /** effect部分 **/

    /** methods部分 **/
    const signOut = () => {
        // 清除redux信息
        clearUserInfo();
        clearStoreList();
        // 清除Token信息
        _.storage.remove('token');
        Toast.show({
            icon: 'success',
            content: '退出登录成功'
        });
        navigate('/login?to=/personal', { replace: true });
    };

    /** render **/
    return (
        <div className={"personal-box"}>
            <NavBarAgain title="个人中心" />
            <div className="baseInfo">
                <Link to="/update">
                    <img className="pic" src={info.pic} alt="" />
                    <p className="name">{info.name}</p>
                </Link>
            </div>
            <div>
                <Link to="/store" className="tab">
                    我的收藏
                    <RightOutline />
                </Link>
                <div className="tab" onClick={signOut}>
                    退出登录
                    <RightOutline />
                </div>
            </div>
        </div>
    );
};

export default connect(
    state => state.base,
    {
        clearUserInfo: action.base.clearUserInfo,
        clearStoreList: action.store.clearStoreList
    }
)(Personal);