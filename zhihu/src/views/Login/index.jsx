import React, { useState, useEffect } from "react";
import NavBarAgain from "../../component/NavBarAgain";
import './index.less'
import { Button, Form, Input, Toast } from "antd-mobile";
import ButtonAgain from '../../component/ButtonAgain'
import { connect } from "react-redux";
import action from '../../store/actions'
import api from "../../api";
import _ from "../../assets/utils"

const rules = {
    phone(_, value) {
        value = value.trim()
        let reg = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/
        if (value.length === 0) return Promise.reject(new Error("手机号不能为空"))
        if (!reg.test(value)) return Promise.reject(new Error("手机号格式不正确"))
        return Promise.resolve()
    },
    code(_, value) {
        value = value.trim()
        let reg = /^\d{6}$/
        if (value.length === 0) return Promise.reject(new Error("验证码不能为空"))
        if (!reg.test(value)) return Promise.reject(new Error(" "))
        return Promise.resolve()
    }
}

const Login = function Login(props) {
    let { queryUserInfoAsync, navigate, usp } = props
    const [formIns] = Form.useForm()
    const [disable, setDisable] = useState(false)
    const [sendtext, setSendtext] = useState("发送验证码")

    const delay = (interval) => {
        return new Promise(reslove => {
            setTimeout(() => {
                reslove()
            }, interval)
        })
    }

    //验证提交校验
    const submit = async () => {
        try {
            await formIns.validateFields(['phone'])
            let { phone, code } = formIns.getFieldValue()
            let { code: status, token } = await api.login(phone, code)
            if (+status !== 0) {
                Toast.show({
                    icon: "fail",
                    content: '登陆失败',
                })
                formIns.resetFields(['code'])
                return
            }
            _.storage.set('token', token)
            await queryUserInfoAsync()  //派发任务，同步redux中的状态信息
            Toast.show({
                icon: "success",
                content: '登陆/注册成功',
            })
            let to = usp.get('to')
            to ? navigate(to, { replace: true }) : navigate(-1)


        } catch (error) {
            console.log(error)
        }
    };

    //获取验证码
    let timer = null
    let num = 31
    const countdown = () => {
        num--;
        if (num === 0) {
            clearInterval(timer)
            timer = null
            setSendtext('发送验证码')
            setDisable(false)
            return
        }
        setSendtext(`${num}秒后重发`)
    }
    const send = async () => {
        try {
            await formIns.validateFields(['phone'])
            let phone = formIns.getFieldValue('phone')
            let { code } = await api.sendPhoneCode(phone)
            if (+code !== 0) {
                Toast.show({
                    icon: "fail",
                    content: "发送失败"
                })
                return
            }
            setDisable(true)
            countdown()
            if (!timer) timer = setInterval(countdown, 1000)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        return () => {
            if (timer) {
                clearInterval(timer)
                timer = null
            }
        }
    }, [])


    return <div className="login-box">
        <NavBarAgain title='注册/登录' />
        <div className="container">
            <div className="login-wrapper">
                <div className="header">Login</div>
                <Form
                    className="form-wrapper"
                    layout='horizontal'
                    footer={
                        <ButtonAgain block color='primary' size='large' onClick={submit}>
                            提交
                        </ButtonAgain>
                        // <Button block type='submit' color='primary' size='large' loading={submitLoading}>
                        //     提交
                        // </Button>
                    }
                    form={formIns}
                    // onFinish={submit}
                    initialValues={{ phone: "", code: '' }}
                    requiredMarkStyle="false"
                >
                    <Form.Item
                        name='phone'
                        label='手机号'
                        rules={[{ validator: rules.phone }]}
                        className="input-item"
                    >
                        <Input placeholder='请输入手机号' />
                    </Form.Item>
                    <Form.Item name='code' className="input-item-password" label='短信验证码'
                        rules={[{ validator: rules.code }]}
                        // rules={[
                        //     { required: true, message: "验证码不能为空" },
                        //     { pattern: /^\d{6}$/, message: "验证码格式不正确" }
                        // ]}
                        extra={<ButtonAgain color="primary"
                            disabled={disable}
                            onClick={send}>
                            {sendtext}
                        </ButtonAgain>}>
                        <Input placeholder='请输入' />
                    </Form.Item>
                </Form>
                <div className="msg">
                    Don't have account?
                    <a href="#">Sign up</a>
                </div>
            </div>
        </div>
    </div>
}
export default connect(null, action.base)(Login)