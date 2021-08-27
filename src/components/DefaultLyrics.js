import React, { memo } from 'react'
import { Lrc } from "react-lrc";


const DefaultLyrics = ({
lyrics,                 //전체 가사
currentMillisecond,     //현재 재생 시간(currentSecond * 1000)
}) => {
    return(
    <Lrc
        lrc={lyrics}
        currentMillisecond={currentMillisecond}
        autoScroll={true}
        style={{width:400,height:800}}
        lineRenderer={({ index, active, line }) => (
            <div
                style={{
                    fontSize: active ? "20px" : "18px",
                    color: active ? "red" : "#333",
                    fontWeight: active ? 500 : 300,
                    lineHeight: "40px"
                }}
            >
                {line.content}
            </div>
        )}
    />);

};

export default memo(DefaultLyrics)