import React, { useContext } from "react";
import { ReactNode } from "react";
import { FrontendManagerStateAndMethod, useFrontendManager } from "../002_hooks/100_useFrontendManager";
import { InferenceStateAndMethod, useInference } from "../002_hooks/200_useInference";
import { FfmpegStateAndMethod, useFfmpeg } from "../002_hooks/201_useFfmpeg";

type Props = {
    children: ReactNode;
};

interface AppStateValue {
    frontendManagerState: FrontendManagerStateAndMethod;
    inferenceState: InferenceStateAndMethod
    ffmpegState: FfmpegStateAndMethod
}

const AppStateContext = React.createContext<AppStateValue | null>(null);
export const useAppState = (): AppStateValue => {
    const state = useContext(AppStateContext);
    if (!state) {
        throw new Error("useAppState must be used within AppStateProvider");
    }
    return state;
};

export const AppStateProvider = ({ children }: Props) => {
    const frontendManagerState = useFrontendManager();
    const inferenceState = useInference();
    const ffmpegState = useFfmpeg()

    const providerValue: AppStateValue = {
        frontendManagerState,
        inferenceState,
        ffmpegState,
    };

    return <AppStateContext.Provider value={providerValue}>{children}</AppStateContext.Provider>;
};
