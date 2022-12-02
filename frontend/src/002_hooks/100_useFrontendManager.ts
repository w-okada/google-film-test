
import { StateControlCheckbox, useStateControlCheckbox } from "../100_components/003_hooks/useStateControlCheckbox";
export const MediaType = {
    image: "image",
    movie: "movie",
    camera: "camera",
    screen: "screen"
} as const
export type MediaType = typeof MediaType[keyof typeof MediaType]


export type StateControls = {
    openRightSidebarCheckbox: StateControlCheckbox
    generalDialogCheckbox: StateControlCheckbox
}

type FrontendManagerState = {
    stateControls: StateControls,
};

export type FrontendManagerStateAndMethod = FrontendManagerState & {
}

export const useFrontendManager = (): FrontendManagerStateAndMethod => {

    // (1) Controller Switch
    const openRightSidebarCheckbox = useStateControlCheckbox("open-right-sidebar-checkbox");
    // (2) Dialog
    const generalDialogCheckbox = useStateControlCheckbox("general-dialog-checkbox");

    const returnValue = {
        stateControls: {
            // (1) Controller Switch
            openRightSidebarCheckbox,
            generalDialogCheckbox,
        },
    };
    return returnValue;
};
