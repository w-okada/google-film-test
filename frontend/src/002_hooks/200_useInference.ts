import { useEffect, useRef, useState } from "react"
import { OUTPUT_GALLERY_DIV, OUTPUT_VIDEO, } from "../const";

require('@tensorflow/tfjs-backend-wasm');

import * as tf from '@tensorflow/tfjs';
// import { InferenceSession, Tensor } from "onnxruntime-web";
import { usePerformanceCounter } from "./200-9_usePerformanceCounter";
import { useFfmpeg } from "./200-1_useFfmpeg";
const DemoImage1 = require("../../../data/zun_g1.png")
const DemoImage2 = require("../../../data/zun_g2.png")
const DemoImage3 = require("../../../data/zun_g3.png")
const DemoImage4 = require("../../../data/zun_g4.png")


export const EngineType = {
    // onnx: "onnx",
    tfjs: "tfjs"
} as const
export type EngineType = typeof EngineType[keyof typeof EngineType]

export const InputShape = {
    "180x320": "180x320",
    "320x180": "320x180",
    "240x320": "240x320",
    "320x240": "320x240",

    // "256x320": "256x320",
    // "256x480": "256x480",
    // "256x640": "256x6400",
    // "320x320": "320x320",
    // "384x640": "384x640",
    // "416x416": "416x416",
    // "480x640": "480x640",
    // "640x640": "640x640",
    // "736x1280": "736x1280",
    // "1088x1920": "1088x1920",
    // "1280x1280": "1280x1280",
    // "1920x1920": "1920x1920",
} as const
export type InputShape = typeof InputShape[keyof typeof InputShape]

export const TimeToInterpolate = {
    "1": 1,
    "2": 2,
    "3": 3,
    "4": 4,
} as const
export type TimeToInterpolate = typeof TimeToInterpolate[keyof typeof TimeToInterpolate]


export const OutputFPS = {
    "15": 15,
} as const
export type OutputFPS = typeof OutputFPS[keyof typeof OutputFPS]

export type InferenceState = {
    processId: number
    engineType: EngineType
    inputShape: InputShape
    timeToInterpolate: TimeToInterpolate
    outputFps: OutputFPS

    canvass: HTMLCanvasElement[]

}

export type InferenceStateAndMethod = InferenceState & {
    startProcess: (processId: number) => Promise<void>
    stopProcess: () => Promise<void>
    thinOutMiddle: () => Promise<void>
    setEnginType: (val: EngineType) => void
    setInputShape: (val: InputShape) => void

    setTimeToInterpolate: (val: TimeToInterpolate) => void
    setOutputFps: (val: OutputFPS) => void
    addKeyFrame: (url: string) => Promise<void>
    // setStartImageURL: (val: string) => void
    // setEndImageURL: (val: string) => void
}

export const useInference = (): InferenceStateAndMethod => {
    const { _updatePerfCounterAll, _updatePerfCounterInference, _updateProgress, _updateStatusMessage } = usePerformanceCounter()
    const { generateMp4, ffmpeg } = useFfmpeg()
    const processIdRef = useRef<number>(0)
    const [processId, _setProcessId] = useState<number>(processIdRef.current)
    const setProcessId = (val: number) => {
        processIdRef.current = val
        _setProcessId(processIdRef.current)
    }

    const [engineType, setEnginType] = useState<EngineType>("tfjs")
    const inputShapeRef = useRef<InputShape>("320x180")
    const [inputShape, _setInputShape] = useState<InputShape>(inputShapeRef.current)
    const setInputShape = (val: InputShape) => {
        inputShapeRef.current = val
        _setInputShape(inputShapeRef.current)
    }

    // const [startImageURL, setStartImageURL] = useState<string>(DefaultStartImage)
    // const [endImageURL, setEndImageURL] = useState<string>(DefaultEndImage)

    const timeToInterpolateRef = useRef<TimeToInterpolate>(1)
    const [timeToInterpolate, _setTimeToInterpolate] = useState<TimeToInterpolate>(timeToInterpolateRef.current)
    const setTimeToInterpolate = (val: TimeToInterpolate) => {
        timeToInterpolateRef.current = val
        _setTimeToInterpolate(timeToInterpolateRef.current)
    }

    const outputFpsRef = useRef<OutputFPS>(15)
    const [outputFps, _setOutputFps] = useState<OutputFPS>(outputFpsRef.current)
    const setOutputFps = (val: OutputFPS) => {
        outputFpsRef.current = val
        _setOutputFps(outputFpsRef.current)
    }

    const canvassRef = useRef<HTMLCanvasElement[]>([])
    const [canvass, _setCanvass] = useState<HTMLCanvasElement[]>(canvassRef.current)
    const setCanvass = (val: HTMLCanvasElement[]) => {
        canvassRef.current = val
        _setCanvass(canvassRef.current)
    }

    useEffect(() => {
        // const shapeArray = inputShapeRef.current.split("x").map(x => { return Number(x) })
        // const canvass = Array(2).fill(0).map((_x, index) => {
        //     const canvas = document.createElement("canvas")
        //     canvas.width = shapeArray[1]
        //     canvas.height = shapeArray[0]
        //     canvas.id = `body-gallary-canvas-${index}`
        //     return canvas
        // })

        // canvassRef.current = canvass
        // setCanvass(canvassRef.current)
        canvassRef.current = []
        setCanvass(canvassRef.current)
    }, [inputShape, timeToInterpolate])


    // useEffect(() => {
    //     const img = new Image()
    //     img.onload = () => {
    //         const ctx = canvassRef.current[0].getContext("2d")!
    //         ctx.drawImage(img, 0, 0, canvassRef.current[0].width, canvassRef.current[0].height)
    //     }
    //     img.src = startImageURL
    // }, [startImageURL, canvass])

    // useEffect(() => {
    //     const img = new Image()
    //     img.onload = () => {
    //         const ctx = canvassRef.current[canvassRef.current.length - 1].getContext("2d")!
    //         ctx.drawImage(img, 0, 0, canvassRef.current[0].width, canvassRef.current[0].height)
    //     }
    //     img.src = endImageURL
    // }, [endImageURL, canvass])

    useEffect(() => {
        const div = document.getElementById(OUTPUT_GALLERY_DIV) as HTMLDivElement
        div.innerHTML = ""
        div.append(...canvass)
    }, [canvass])

    // useEffect(() => {
    //     tf.setBackend('wasm').then(() => console.log("wasm setuped"));
    // }, [])

    // Add Demo Image
    useEffect(() => {
        const initGallary = async () => {
            await addKeyFrame(DemoImage1)
            await addKeyFrame(DemoImage2)
            await addKeyFrame(DemoImage1)
            await addKeyFrame(DemoImage2)
            await addKeyFrame(DemoImage3)
            await addKeyFrame(DemoImage4)
            await addKeyFrame(DemoImage2)
            await addKeyFrame(DemoImage1)
        }
        initGallary()
    }, [])
    useEffect(() => {
        if (!ffmpeg) {
            return
        }
        _setVideo()
    }, [ffmpeg])

    const addKeyFrame = async (url: string) => {
        const shapeArray = inputShapeRef.current.split("x").map(x => { return Number(x) })
        const canvas = document.createElement("canvas")
        canvas.width = shapeArray[1]
        canvas.height = shapeArray[0]
        canvas.className = "gallary-canvas"

        const img = new Image()
        const p = new Promise<void>((resolve) => {
            img.onload = () => {
                const ctx = canvas.getContext("2d")!
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
                canvassRef.current.push(canvas)
                setCanvass([...canvassRef.current])
                resolve()
            }
        })
        img.src = url
        await p
    }

    const thinOutMiddle = async () => {
        canvassRef.current = canvassRef.current.filter((_x, index) => { return index % 2 == 0 })
        setCanvass([...canvassRef.current])
        _setVideo()
    }

    const _setVideo = async () => {
        const movieUrl = await generateMp4(canvassRef.current)
        if (!movieUrl) { return }
        const video = document.getElementById(OUTPUT_VIDEO) as HTMLVideoElement
        video.src = ""
        video.srcObject = null
        video.src = movieUrl
    }
    const stopProcess = async () => {
        processIdRef.current = 0
        setProcessId(processIdRef.current)
    }

    const sessionRef = useRef<tf.GraphModel>()
    const startProcess = async (processId: number) => {
        // Params for GUI
        //// ProcessId
        processIdRef.current = processId
        setProcessId(processIdRef.current)

        //// inputShape
        const inputShapeArray = inputShapeRef.current.split("x").map(x => { return Number(x) })

        //// Model File
        const modelFilePath = `./models/tfjs/L1/model.json`
        // const modelFilePath = `./models/onnx/film_net_L1_HxW.onnx` // Note: ONNX return error "Cannot read properties of undefined (reading 'byteLength')" 

        // Create Session
        if (!sessionRef.current) {
            _updateStatusMessage("Loding model...")
            sessionRef.current = await tf.loadGraphModel(modelFilePath);
            _updateStatusMessage("Warming up...")
            await new Promise<void>((resolve) => {
                // requestAnimationFrame(() => { resolve() })
                setTimeout(resolve, 100)
            })
            const identityIndex = sessionRef.current.outputNodes.findIndex(x => { return x === "Identity:0" })
            console.log("Film:Index", identityIndex)
            const dummyCanvas1 = document.createElement("canvas")
            dummyCanvas1.width = inputShapeArray[1]
            dummyCanvas1.height = inputShapeArray[0]
            const dummyCanvas2 = document.createElement("canvas")
            dummyCanvas2.width = inputShapeArray[1]
            dummyCanvas2.height = inputShapeArray[0]
            tf.tidy(() => {
                const start = tf.browser.fromPixels(dummyCanvas1).expandDims(0).asType("float32").div(255)
                const end = tf.browser.fromPixels(dummyCanvas2).expandDims(0).asType("float32").div(255)
                const time = tf.tensor([0.5]).expandDims(0)
                const results = sessionRef.current!.predict([start, end, time]) as tf.Tensor[]
                results[identityIndex].squeeze().arraySync() as number[][][]
            })
            _updateStatusMessage("Warming up complete")
        }

        // const session = await InferenceSession.create(modelFilePath)
        // Show Session Information
        if (engineType == "tfjs") {
            console.log("Film:", (sessionRef.current as tf.GraphModel).inputs)
            console.log("Film:", (sessionRef.current as tf.GraphModel).inputNodes)
            console.log("Film:", (sessionRef.current as tf.GraphModel).outputs)
            console.log("Film:", (sessionRef.current as tf.GraphModel).outputNodes)
        }
        const identityIndex = sessionRef.current.outputNodes.findIndex(x => { return x === "Identity:0" })
        console.log("Film:Index", identityIndex)

        // Note: ONNX does not work
        // const im1 = Float32Array.from(Array(1 * 320 * 180 * 3).fill(0));
        // const tensorIm1 = new Tensor("float32", im1, [1, 3, 320, 180]);
        // const im2 = Float32Array.from(Array(1 * 320 * 180 * 3).fill(0));
        // const tensorIm2 = new Tensor("float32", im1, [1, 3, 320, 180]);
        // const time = Float32Array.from(Array(1).fill(0));
        // const tensorTime = new Tensor("float32", time, [1]);
        // console.log("input onnx", session.inputNames)
        // console.log("output onnx", session.outputNames)
        // // const feeds = { x1: tensorIm1, x2:tensorIm2, time:time };
        // const feeds = { "x1:0": tensorIm1, "x0:0": tensorIm2, "time:0": time };
        // // @ts-ignore
        // const results = await session.run(feeds);
        // const end = performance.now();


        const canvasNum = canvassRef.current.length - 1
        const perfCounterAll_start = performance.now()
        let progress = 0
        _updateStatusMessage("Start generating...")
        for (let i = 0; i < timeToInterpolateRef.current; i++) {
            const newCanvass: HTMLCanvasElement[] = []
            for (let j = 1; j < canvassRef.current.length; j++) {
                const startImageCanvas = canvassRef.current[j - 1]
                const endImageCanvas = canvassRef.current[j]
                let result: number[][][] = []
                tf.tidy(() => {
                    const start = tf.browser.fromPixels(startImageCanvas).expandDims(0).asType("float32").div(255)
                    const end = tf.browser.fromPixels(endImageCanvas).expandDims(0).asType("float32").div(255)
                    // console.log("shapes", start.shape, end.shape)
                    const time = tf.tensor([0.5]).expandDims(0)
                    const perfCounterInference_start = performance.now()
                    // const results = session.predict([time. start, end]) as tf.Tensor[] // PINTO's
                    const results = sessionRef.current!.predict([start, end, time]) as tf.Tensor[]
                    // const results = session.predict([start, time, end]) as tf.Tensor[]
                    const perfCounterInference_end = performance.now()
                    const perfCounterInference = perfCounterInference_end - perfCounterInference_start
                    _updatePerfCounterInference(perfCounterInference)
                    result = results[identityIndex].squeeze().arraySync() as number[][][]
                })
                const imageData = new ImageData(inputShapeArray[1], inputShapeArray[0])
                for (let i = 0; i < result.length; i++) {
                    for (let j = 0; j < result[i].length; j++) {
                        const offset = (result[i].length * i + j) * 4
                        imageData.data[offset + 0] = result[i][j][0] * 255
                        imageData.data[offset + 1] = result[i][j][1] * 255
                        imageData.data[offset + 2] = result[i][j][2] * 255
                        imageData.data[offset + 3] = 255
                    }
                }

                const newCanvas = document.createElement("canvas")
                newCanvas.width = inputShapeArray[1]
                newCanvas.height = inputShapeArray[0]
                newCanvas.className = "gallary-canvas"
                const ctx = newCanvas.getContext("2d")!
                ctx.putImageData(imageData, 0, 0)
                progress += 1
                const progressRate = (progress * 100 / canvasNum)
                // console.log(`Progress: ${progress}/${canvasNum}`)
                _updateProgress(progressRate)
                newCanvass.push(startImageCanvas)
                newCanvass.push(newCanvas)
                await new Promise<void>((resolve) => {
                    requestAnimationFrame(() => { resolve() })
                })
            }
            newCanvass.push(canvassRef.current.pop()!)
            canvassRef.current = newCanvass

            // canvassRef.current = canvassRef.current.reduce((prev, cur, index) => {
            //     console.log("index:::", index)
            //     if (prev.length == 0) {
            //         return [cur]
            //     }
            //     const startImageCanvas = prev[prev.length - 1]
            //     const endImageCanvas = cur
            //     let result: number[][][] = []
            //     tf.tidy(() => {
            //         const start = tf.browser.fromPixels(startImageCanvas).expandDims(0).asType("float32").div(255)
            //         const end = tf.browser.fromPixels(endImageCanvas).expandDims(0).asType("float32").div(255)
            //         console.log("shapes", start.shape, end.shape)
            //         const time = tf.tensor([0.5]).expandDims(0)
            //         const perfCounterInference_start = performance.now()
            //         // const results = session.predict([time. start, end]) as tf.Tensor[] // PINTO's
            //         const results = session.predict([start, end, time]) as tf.Tensor[]
            //         // const results = session.predict([start, time, end]) as tf.Tensor[]
            //         const perfCounterInference_end = performance.now()
            //         const perfCounterInference = perfCounterInference_end - perfCounterInference_start
            //         _updatePerfCounterInference(perfCounterInference)
            //         result = results[identityIndex].squeeze().arraySync() as number[][][]
            //     })
            //     const imageData = new ImageData(inputShapeArray[1], inputShapeArray[0])
            //     for (let i = 0; i < result.length; i++) {
            //         for (let j = 0; j < result[i].length; j++) {
            //             const offset = (result[i].length * i + j) * 4
            //             imageData.data[offset + 0] = result[i][j][0] * 255
            //             imageData.data[offset + 1] = result[i][j][1] * 255
            //             imageData.data[offset + 2] = result[i][j][2] * 255
            //             imageData.data[offset + 3] = 255
            //         }
            //     }

            //     const newCanvas = document.createElement("canvas")
            //     newCanvas.width = inputShapeArray[1]
            //     newCanvas.height = inputShapeArray[0]
            //     newCanvas.className = "gallary-canvas"
            //     const ctx = newCanvas.getContext("2d")!
            //     ctx.putImageData(imageData, 0, 0)
            //     progress += 1
            //     const progressRate = (progress * 100 / canvasNum)
            //     console.log(`Progress: ${progress}/${canvasNum}`)
            //     _updateProgress(progressRate)
            //     // await new Promise<void>((resolve, reject) => {
            //     //     requestAnimationFrame(resolve)
            //     // })
            //     return [...prev, newCanvas, endImageCanvas]
            // }, [] as HTMLCanvasElement[])
        }
        setCanvass(canvassRef.current)
        setProcessId(0)
        // console.log(`canvas num:`, canvassRef.current.length)
        const perfCounterAll_end = performance.now()
        const perfCounterAll = perfCounterAll_end - perfCounterAll_start
        _updatePerfCounterAll(perfCounterAll)
        _updateStatusMessage("Done")

        _setVideo()
    }

    const returnValue = {
        processId,
        engineType,
        inputShape,
        timeToInterpolate,
        outputFps,
        canvass,

        startProcess,
        stopProcess,
        thinOutMiddle,
        setEnginType,
        setInputShape,
        setTimeToInterpolate,
        setOutputFps,
        addKeyFrame,
    };
    return returnValue;
};


