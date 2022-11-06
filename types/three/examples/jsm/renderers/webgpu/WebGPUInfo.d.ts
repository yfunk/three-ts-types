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
        textures: number;
    };

    constructor();
    update(object, count, instanceCount) {
        this.render.drawCalls++;

        if (object.isMesh || object.isSprite) {
            this.render.triangles += instanceCount * (count / 3);
        } else if (object.isPoints) {
            this.render.points += instanceCount * count;
        } else if (object.isLineSegments) {
            this.render.lines += instanceCount * (count / 2);
        } else if (object.isLine) {
            this.render.lines += instanceCount * (count - 1);
        } else {
            console.error('THREE.WebGPUInfo: Unknown object type.');
        }
    }

    reset(): void;

    dispose(): void;
}
