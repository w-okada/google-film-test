import { createFFmpeg, fetchFile, FFmpeg } from "@ffmpeg/ffmpeg";
import { useEffect, useRef, useState } from "react";

export type FfmpegState = {
    isConverting: boolean
    convertProgress: number
}

export type FfmpegStateAndMethod = FfmpegState & {
    generateMp4: (canvass: HTMLCanvasElement[]) => Promise<string | undefined>
}

export const useFfmpeg = (): FfmpegStateAndMethod => {
    const ffmpegRef = useRef<FFmpeg>()
    const [_ffmpeg, setFfmpeg] = useState<FFmpeg | undefined>(ffmpegRef.current);
    const [isConverting, setIsConverting] = useState<boolean>(false)
    const [convertProgress, setConvertProgress] = useState(0);


    // (2) initialize
    useEffect(() => {
        const ffmpeg = createFFmpeg({
            log: true,
            // corePath: "./assets/ffmpeg/ffmpeg-core.js",
        });
        const loadFfmpeg = async () => {
            await ffmpeg!.load();

            ffmpeg!.setProgress(({ ratio }) => {
                console.log("ffmpeg load progress:", ratio);
                setConvertProgress(ratio);
            });
            ffmpegRef.current = ffmpeg
            setFfmpeg(ffmpegRef.current);
        };
        loadFfmpeg();
    }, []);

    const generateMp4 = async (canvass: HTMLCanvasElement[]) => {
        if (!ffmpegRef.current) {
            alert("ffmpeg is null");
            return;
        }

        if (isConverting) {
            alert("already converting");
            return;
        }
        setIsConverting(true);

        for (let i = 0; i < canvass.length; i++) {
            const p = new Promise<Blob | null>((resolve) => {
                canvass[i].toBlob((x) => {
                    resolve(x)
                }, "image/jpeg", 0.75)
            })
            const img = await p
            const numStr = i.toString().padStart(3, "0")
            ffmpegRef.current.FS("writeFile", `image_${numStr}.jpg`, await fetchFile(img!));
        }

        const flist = ffmpegRef.current.FS("readdir", "/");
        console.log("FILE LIST", flist, canvass.length)
        const outputFilename = "out.mp4"
        // const cli = `-r 30 -i image_%03d.jpg -vcodec libx264 -pix_fmt yuv420p  ${outputFilename}`
        const cli = `-y -r 30 -i image_%03d.jpg -vcodec libx264 -pix_fmt yuv420p  ${outputFilename}`
        // const cli = `-y -loop 1 -i image_001.jpg -vcodec libx264 -pix_fmt yuv420p -t 3 -r 30 ${outputFilename}`

        const cliArgs = cli.split(" ");
        cliArgs.shift()
        await ffmpegRef.current.run(...cliArgs);
        const data = ffmpegRef.current.FS("readFile", outputFilename);
        setIsConverting(false);
        return URL.createObjectURL(new Blob([data.buffer], { type: "video/mp4" }));



        // const a = document.createElement("a");
        // a.download = outputFilename;
        // a.href = URL.createObjectURL(new Blob([data.buffer], { type: "video/mp4" }));
        // a.click();
        // setIsConverting(false);
    };

    return { generateMp4, isConverting, convertProgress }
}