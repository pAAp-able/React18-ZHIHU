import React from "react";
import { Skeleton } from "antd-mobile";
import "./index.less"

const SkeletonAgain = function SkeletonAgain() {

    return <div className="skeleton_box">
        <Skeleton.Title animated />
        <Skeleton.Paragraph lineCount={5} animated />
    </div>
}

export default SkeletonAgain
