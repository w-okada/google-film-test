import { useRef } from "react"
import { PERFORMANCE_ALL_SPAN, PERFORMANCE_INFER_SPAN, PROGRESS_SPAN, STATUS_SPAN } from "../const";

const PerformancCounter_num = 3

export const usePerformanceCounter = () => {
    const perfCounterInferenceRef = useRef<number[]>([])
    const perfCounterAllRef = useRef<number[]>([])
    const progressRef = useRef<number>(0)
    const _updatePerfCounterInference = (counter: number) => {
        perfCounterInferenceRef.current.push(counter)
        while (perfCounterInferenceRef.current.length > PerformancCounter_num) {
            perfCounterInferenceRef.current.shift()
        }
        const perfCounterInferenceAvr = perfCounterInferenceRef.current.reduce((prev, cur) => {
            return prev + cur
        }) / perfCounterInferenceRef.current.length;
        (document.getElementById(PERFORMANCE_INFER_SPAN) as HTMLSpanElement).innerText = `${perfCounterInferenceAvr.toFixed(2)}`
        // console.log("UPDATE TIME!")
    }

    const _updatePerfCounterAll = (counter: number) => {
        perfCounterAllRef.current.push(counter)
        while (perfCounterAllRef.current.length > PerformancCounter_num) {
            perfCounterAllRef.current.shift()
        }
        const perfCounterAllAvr = perfCounterAllRef.current.reduce((prev, cur) => {
            return prev + cur
        }) / perfCounterAllRef.current.length;
        (document.getElementById(PERFORMANCE_ALL_SPAN) as HTMLSpanElement).innerText = `${perfCounterAllAvr.toFixed(2)}`
    }
    const _updateProgress = (val: number) => {
        progressRef.current = val
        const span = document.getElementById(PROGRESS_SPAN) as HTMLSpanElement
        span.innerText = `${progressRef.current.toFixed(1)}`
        // console.log("UPDATE Progress!")
    }

    const _updateStatusMessage = (val: string) => {
        const span = document.getElementById(STATUS_SPAN) as HTMLSpanElement
        span.innerText = `${val}`

    }


    const returnValue = {
        _updatePerfCounterInference,
        _updatePerfCounterAll,
        _updateProgress,
        _updateStatusMessage,
    };
    return returnValue;
};


