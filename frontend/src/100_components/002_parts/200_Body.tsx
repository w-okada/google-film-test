import React, { useMemo } from "react";
import { OUTPUT_GALLERY_DIV, OUTPUT_VIDEO } from "../../const";
export const Body = () => {
    const content = useMemo(() => {
        return (
            <div className="body-content">
                <div className="body-frame-container" id={OUTPUT_GALLERY_DIV}>
                </div>
                <div className="body-video-container" id={OUTPUT_GALLERY_DIV}>
                    <video id={OUTPUT_VIDEO} className={"body-video"} controls></video>
                </div>
            </div>
        );
    }, [])
    return (
        <>
            {content}
        </>
    )
};
