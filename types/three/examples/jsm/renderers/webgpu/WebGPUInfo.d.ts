import { Object3D } from '../../../../src/Three';

export default class WebGPUInfo {
    autoReset: boolean;

    render: {
        frame: number;
        drawCalls: number;
        triangles: number;
        points: number;
        lines: number;
    };

    memory: {
        geometries: number;
        texture: number;
    };

    constructor();

    update: (object: Object3D, count: number, instanceCount: number) => void;

    reset: () => void;

    dispose: () => void;
}
