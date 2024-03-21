import React, { useState } from "react";
import { Button } from "antd-mobile";

const ButtonAgain = function ButtonAgain(props) {
    let option = { ...props }
    let { children, onClick: handle } = props
    delete option.children
    delete option.onClick

    let [loading, setLoading] = useState(false)

    const clickHandle = async () => {
        setLoading(true)
        await handle()
        setLoading(false)
    }
    if (handle) {
        option.onClick = clickHandle
    }

    return <Button {...option} loading={loading}>
        {children}
    </Button>
};

export default ButtonAgain