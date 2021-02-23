export default class WebGPUProperties {
    properties: WeakMap;

    constructor();

    get(object) {
        let map = this.properties.get(object);

        if (map === undefined) {
            map = {};
            this.properties.set(object, map);
        }

        return map;
    }

    remove: (object) => void { 
        this.properties.delete(object);
    }

    dispose: () => void;
}
