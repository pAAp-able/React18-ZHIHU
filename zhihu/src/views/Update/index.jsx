import React, { useState } from "react";
import { ImageUploader, Button, Toast, Input } from "antd-mobile";
import "./index.less";
import { connect } from "react-redux";
import api from "../../api";
import action from "../../store/actions";
import NavBarAgain from "../../component/NavBarAgain";
function Update(props) {
    let { info, queryUserInfoAsync, navigate } = props;
    console.log(props)
    /* 定义状态 */
    let [pic, setPic] = useState([{ url: info.pic }])
    let [username, setUserName] = useState(info.name)
    //简易校验
    const limitImage = (file) => {
        if (file.size > 1024 * 1024) {
            Toast.show("请选择小于 1M 的图片");
            return null;
        }
        return file;
    };
    const uploadImage = async (file) => {
        let temp;
        try {
            let { code, pic } = await api.upload(file);
            if (+code !== 0) {
                Toast.show({
                    icon: "fail",
                    content: "上传失败",
                });
                return;
            }
            temp = pic;
            setPic([
                {
                    url: pic,
                },
            ]);
        } catch (_) { }
        return { url: temp };
    };

    async function send() {
        // 表单校验
        if (pic.length === 0) {
            Toast.show({
                icon: "fail",
                content: "请先上传图片",
            });
            return;
        }
        if (username.trim() === "") {
            Toast.show({
                icon: "fail",
                content: "请先输入名字",
            });
            return;
        }
        // 获取信息，发送请求
        let [{ url }] = pic;
        try {
            let { code } = await api.userUpdate(username.trim(), url);
            if (+code !== 0) {
                Toast.show({
                    icon: "fail",
                    content: "修改信息失败",
                });
                return;
            }
            Toast.show({
                icon: "success",
                content: "修改信息成功",
            });
            queryUserInfoAsync(); //同步redux中的信息
            navigate(-1);
        } catch (_) { }
    }

    return (
        <div className="update">
            <div>
                <NavBarAgain title="修改信息"></NavBarAgain>
            </div>
            <div className="avatar">
                <span className="avatar_span">头像</span>
                <div>
                    <ImageUploader
                        style={{ "--cell-size": "40px" }}
                        value={pic}
                        maxCount={1}
                        onDelete={() => {
                            setPic([]);
                        }}
                        beforeUpload={limitImage}
                        upload={uploadImage}
                    />
                </div>
            </div>
            <div className="name">
                <span className="name_name">姓名</span>
                <div className="input_div">
                    <Input
                        placeholder="请输入账号名称"
                        // className="input"
                        value={username}
                        onChange={val => {
                            setUserName(val);
                        }}
                    />
                </div>
            </div>
            <div className="div_btn">
                <Button color="primary" size="large " onClick={send}>
                    修改
                </Button>
            </div>
        </div>
    );
}
export default connect(
    state => state.base,
    action.base
)(Update);
