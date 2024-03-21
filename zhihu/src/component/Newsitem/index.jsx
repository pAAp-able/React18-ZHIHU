import React from "react";
import './index.less'
import { Image } from "antd-mobile";
import { Link } from "react-router-dom";
import PropTypes from "prop-types"

const Newsitem = function (props) {
    let { info } = props
    if (!info) return null
    let { id, hint, images, title, image } = info
    if (!Array.isArray(images)) images = [""]
    return <div className="box">
        <Link to={{
            pathname: `/detail/${id}`
        }}>
            <div className="content">
                <h4 className="title">{title}</h4 >
                <p className="author">{hint}</p>
            </div>
            <Image src={image ? image : images[0]} lazy />
        </Link>
    </div>
}

//属性规则校验处理
Newsitem.defaultProps = {
    info: null
};
Newsitem.propTypes = {
    info: PropTypes.object
}
export default Newsitem
