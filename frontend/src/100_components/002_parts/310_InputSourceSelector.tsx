import React, { useMemo } from "react";
import { EngineType, InputShape } from "../../002_hooks/200_useInference";
import { useAppState } from "../../003_provider/003_AppStateProvider";
import { PERFORMANCE_ALL_SPAN, PERFORMANCE_INFER_SPAN, PROGRESS_SPAN, STATUS_SPAN } from "../../const";
import { useFileInput } from "../003_hooks/useFileInput";
import JSZip from "jszip";

export const InputSourceSelector = () => {
    const { inferenceState } = useAppState()
    const { click } = useFileInput()

    /***********************
     * Input Source Area
     ***********************/

    const addKeyFrameImageChooserRow = useMemo(() => {

        const onChooseFileClicked = async () => {
            try {
                const { url } = await click("image")
                // console.log("URL", URL)
                inferenceState.addKeyFrame(url)
            } catch (exception) {
                alert(exception)
            }
        }
        return (
            <div className="sidebar-content-row-7-3">
                <div className="sidebar-content-row-label">Add Image</div>
                <div className="sidebar-content-row-buttons">
                    <div className="sidebar-content-row-button" onClick={() => onChooseFileClicked()}>Load File</div>
                </div>
            </div>
        )
    }, [])


    // const startImageChooserRow = useMemo(() => {

    //     const onChooseFileClicked = async () => {
    //         try {
    //             const { url } = await click("image")
    //             console.log("URL", URL)
    //             inferenceState.setStartImageURL(url)
    //         } catch (exception) {
    //             alert(exception)
    //         }
    //     }
    //     return (
    //         <div className="sidebar-content-row-7-3">
    //             <div className="sidebar-content-row-label">Start Image</div>
    //             <div className="sidebar-content-row-buttons">
    //                 <div className="sidebar-content-row-button" onClick={() => onChooseFileClicked()}>Load File</div>
    //             </div>
    //         </div>
    //     )
    // }, [inferenceState.startImageURL])

    // const endImageChooserRow = useMemo(() => {

    //     const onChooseFileClicked = async () => {
    //         try {
    //             const { url } = await click("image")
    //             console.log("URL", URL)
    //             inferenceState.setEndImageURL(url)
    //         } catch (exception) {
    //             alert(exception)
    //         }
    //     }
    //     return (
    //         <div className="sidebar-content-row-7-3">
    //             <div className="sidebar-content-row-label">End Image</div>
    //             <div className="sidebar-content-row-buttons">
    //                 <div className="sidebar-content-row-button" onClick={() => onChooseFileClicked()}>Load File</div>
    //             </div>
    //         </div>
    //     )
    // }, [inferenceState.endImageURL])


    /***********************
     * Performance Area
     ***********************/
    const performanceAllRow = useMemo(() => {
        return (
            <div className="sidebar-content-row-5-5">
                <div className="sidebar-content-row-label">All:</div>
                <div className="sidebar-content-row-label"><span id={PERFORMANCE_ALL_SPAN}></span>ms</div>
            </div>
        )
    }, [])
    const performanceInferenceRow = useMemo(() => {
        return (
            <div className="sidebar-content-row-5-5">
                <div className="sidebar-content-row-label pad-left-1">Inference:</div>
                <div className="sidebar-content-row-label"><span id={PERFORMANCE_INFER_SPAN}></span>ms</div>
            </div>
        )
    }, [])

    const progressRow = useMemo(() => {
        return (
            <div className="sidebar-content-row-5-5">
                <div className="sidebar-content-row-label pad-left-1">Progress:</div>
                <div className="sidebar-content-row-label"><span id={PROGRESS_SPAN}></span>%</div>
            </div>
        )
    }, [])

    const StatusRow = useMemo(() => {
        return (
            <div className="sidebar-content-row">
                <div className="sidebar-content-row-label pad-left-1"><span id={STATUS_SPAN}></span></div>
            </div>
        )
    }, [])


    /***********************
     * Select Engine Area
     ***********************/
    const selectEngineRow = useMemo(() => {
        const options = Object.keys(EngineType).map(x => {
            return (
                <option key={x} value={x}>
                    {x}
                </option>
            )
        })

        const select = (
            <select
                value={inferenceState.engineType}
                onChange={(e) => {
                    const newEnginType = e.target.value as EngineType
                    inferenceState.setEnginType(newEnginType)
                }}
                className="sidebar-content-row-select-select"
            >
                {options}
            </select>
        );

        return (
            <div className="sidebar-content-row-5-5">
                <div className="sidebar-content-row-label">Engine Type:</div>
                <div className="sidebar-content-row-select">{select}</div>
            </div>

        )
    }, [inferenceState.engineType])

    const selectInputShapeRow = useMemo(() => {
        const options = Object.keys(InputShape).map(x => {
            return (
                <option key={x} value={x}>
                    {x}
                </option>
            )
        })

        const select = (
            <select
                value={inferenceState.inputShape}
                onChange={(e) => {
                    const newInputShape = e.target.value as InputShape
                    inferenceState.setInputShape(newInputShape)
                }}
                className="sidebar-content-row-select-select"
            >
                {options}
            </select>
        );

        return (
            <div className="sidebar-content-row-5-5">
                <div className="sidebar-content-row-label">InputShape:</div>
                <div className="sidebar-content-row-select">{select}</div>
            </div>

        )
    }, [inferenceState.inputShape])


    // const selectTimeToInterpolateRow = useMemo(() => {
    //     const options = Object.keys(TimeToInterpolate).map(x => {
    //         return (
    //             <option key={x} value={TimeToInterpolate[x]}>
    //                 {x}
    //             </option>
    //         )
    //     })

    //     const select = (
    //         <select
    //             value={inferenceState.timeToInterpolate}
    //             onChange={(e) => {
    //                 const newTimeToInterpolate = Number(e.target.value) as TimeToInterpolate
    //                 inferenceState.setTimeToInterpolate(newTimeToInterpolate)
    //             }}
    //             className="sidebar-content-row-select-select"
    //         >
    //             {options}
    //         </select>
    //     );

    //     return (
    //         <div className="sidebar-content-row-5-5">
    //             <div className="sidebar-content-row-label">inter:</div>
    //             <div className="sidebar-content-row-select">{select}</div>
    //         </div>

    //     )
    // }, [inferenceState.timeToInterpolate])

    const interpolateButtonRow = useMemo(() => {
        const buttonLabel = inferenceState.processId === 0 ? "add" : "stop."
        const buttonClass = inferenceState.processId === 0 ? "sidebar-content-row-button" : "sidebar-content-row-button-activated"
        const butonAction = inferenceState.processId === 0 ?
            async () => {
                await inferenceState.startProcess(new Date().getTime())
            }
            :
            () => {
                inferenceState.stopProcess()
            }
        return (
            <div className="sidebar-content-row-7-3">
                <div className="sidebar-content-row-label">Interpolate</div>
                <div className={buttonClass} onClick={butonAction}>{buttonLabel}</div>
            </div>
        )
    }, [inferenceState.processId])



    const deleteButtonRow = useMemo(() => {
        const buttonLabel = "del"
        const buttonClass = "sidebar-content-row-button"
        const butonAction =
            async () => {
                if (inferenceState.processId !== 0) { return }
                await inferenceState.thinOutMiddle()
            }
        return (
            <div className="sidebar-content-row-7-3">
                <div className="sidebar-content-row-label">Thin out mid</div>
                <div className={buttonClass} onClick={butonAction}>{buttonLabel}</div>
            </div>
        )
    }, [inferenceState.processId])

    // const convertButtonRow = useMemo(() => {
    //     const buttonLabel = ffmpegState.isConverting ? "stop" : "generate"
    //     const buttonClass = ffmpegState.isConverting ? "sidebar-content-row-button-activated" : "sidebar-content-row-button"
    //     const butonAction = ffmpegState.isConverting ?
    //         () => {
    //         }
    //         :
    //         async () => {
    //             const url = await ffmpegState.generateMp4(inferenceState.canvass)
    //             if (!url) { return }
    //             const video = document.getElementById(OUTPUT_VIDEO) as HTMLVideoElement
    //             video.src = ""
    //             video.srcObject = null
    //             video.src = url
    //         }

    //     return (
    //         <div className="sidebar-content-row-7-3">
    //             <div className="sidebar-content-row-label">Generate mp4</div>
    //             <div className={buttonClass} onClick={butonAction}>{buttonLabel}</div>
    //         </div>
    //     )
    // }, [inferenceState.canvass])

    const downloadButtonRow = useMemo(() => {
        const buttonLabel = "download"
        const buttonClass = "sidebar-content-row-button"
        const butonAction = async () => {
            if (inferenceState.processId !== 0) { return }
            const zip = new JSZip();

            for (let i = 0; i < inferenceState.canvass.length; i++) {
                const p = new Promise<Blob | null>((resolve) => {
                    inferenceState.canvass[i].toBlob((x) => {
                        resolve(x)
                    }, "image/png")
                })
                const img = await p
                const numStr = i.toString().padStart(3, "0")
                zip.file(`${numStr}.png`, img!)

            }
            const blob = await zip.generateAsync({ type: "blob" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `images.zip`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        return (
            <div className="sidebar-content-row-7-3">
                <div className="sidebar-content-row-label">DL Images</div>
                <div className={buttonClass} onClick={butonAction}>{buttonLabel}</div>
            </div>
        )
    }, [inferenceState.canvass])




    return (
        <div className="sidebar-content">
            <div className="sidebar-content-row-label-header">
                Input Source
            </div>
            {addKeyFrameImageChooserRow}
            {/* {startImageChooserRow}
            {endImageChooserRow} */}

            <div className="sidebar-content-row-dividing"></div>
            <div className="sidebar-content-row-label-header">
                Inference Engine
            </div>
            {selectEngineRow}
            {selectInputShapeRow}

            <div className="sidebar-content-row-dividing"></div>
            <div className="sidebar-content-row-label-header">
                Performance
            </div>
            {performanceAllRow}
            {performanceInferenceRow}
            {progressRow}
            {StatusRow}
            <div className="sidebar-content-row-dividing"></div>
            <div className="sidebar-content-row-label-header">
                Operation
            </div>
            {/* {selectTimeToInterpolateRow} */}
            {interpolateButtonRow}
            {deleteButtonRow}
            {/* {convertButtonRow} */}
            {downloadButtonRow}


        </div>
    );
};
