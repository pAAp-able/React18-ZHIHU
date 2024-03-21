import React from 'react'
import PropTypes from "prop-types"
import { NavBar } from 'antd-mobile'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import './index.less'


const NavBarAgain = function NavBarAgain(props) {
    let { title } = props
    const navigate = useNavigate()
    const location = useLocation()
    const [usp] = useSearchParams()
    console.log(usp)
    const handleback = () => {
        let to = usp.get('to')
        if (location.pathname === "/login" && /^\/detail\/\d+$/.test(to)) {
            navigate(to, { replace: true })
            return
        }
        navigate(-1)
    }
    return <NavBar className='navbar-box' onBack={handleback}>{title}</NavBar>
}
NavBarAgain.defaultProps = {
    title: "个人中心"
};
NavBarAgain.propTypes = {
    info: PropTypes.string
}

export default NavBarAgain;