export default class WebGPUBinding {
    name: string;
    visibility: null | number;

    readonly type: string;

    isShared: boolean;

    constructor(name: string);

    setVisibility: (visibility: string) => void;
}
