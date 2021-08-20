import React, { useEffect, useRef, useState, memo } from "react";

import WaveSurfer from "wavesurfer.js";

const formWaveSurferOptions = (ref) => ({
    container: ref,
    waveColor: "#eee",
    progressColor: "OrangeRed",
    cursorColor: "OrangeRed",
    barWidth: 2,
    barRadius: 3,
    responsive: true,
    height: 150,
    // If true, normalize by the maximum peak instead of 1.0.
    normalize: true,
    // Use the PeakCache to improve rendering speed of large waveforms.
    partialRender: true,
    hideScrollbar: true,
    displayMilliseconds: true,
    debug: true,
    controls : true,
});

const Waveform = ({
wave,   //기본 Wave
url,    //Wave 주소
onSeek  //Wave 수동으로 변경시 이벤트(On Seek)
} = {}) => {
    const waveformRef = useRef(null);

    // create new WaveSurfer instance
    // On component mount and when url changes
    useEffect(() => {

        wave.current = WaveSurfer.create(formWaveSurferOptions(waveformRef.current));

        wave.current.load(url);

        wave.current.setMute(true);

        wave.current.on('seek', onSeek);

        // Removes events, elements and disconnects Web Audio nodes.
        // when component unmount
        return () => wave.current.destroy();
    }, [url]);


    return (
        <div>
            <div id="waveform" ref={waveformRef} />
        </div>
    )
}

export default memo(Waveform);
