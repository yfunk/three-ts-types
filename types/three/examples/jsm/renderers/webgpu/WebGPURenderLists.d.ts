import { Scene, Camera } from '../../../../src/Three';

export class WebGPURenderList {
    constructor() {
        this.renderItems = [];
        this.renderItemsIndex = 0;

        this.opaque = [];
        this.transparent = [];
    }

    init() {
        this.renderItemsIndex = 0;

        this.opaque.length = 0;
        this.transparent.length = 0;
    }

    getNextRenderItem(object, geometry, material, groupOrder, z, group) {
        let renderItem = this.renderItems[this.renderItemsIndex];

        if (renderItem === undefined) {
            renderItem = {
                id: object.id,
                object: object,
                geometry: geometry,
                material: material,
                groupOrder: groupOrder,
                renderOrder: object.renderOrder,
                z: z,
                group: group,
            };

            this.renderItems[this.renderItemsIndex] = renderItem;
        } else {
            renderItem.id = object.id;
            renderItem.object = object;
            renderItem.geometry = geometry;
            renderItem.material = material;
            renderItem.groupOrder = groupOrder;
            renderItem.renderOrder = object.renderOrder;
            renderItem.z = z;
            renderItem.group = group;
        }

        this.renderItemsIndex++;

        return renderItem;
    }

    push(object, geometry, material, groupOrder, z, group) {
        const renderItem = this.getNextRenderItem(object, geometry, material, groupOrder, z, group);

        (material.transparent === true ? this.transparent : this.opaque).push(renderItem);
    }

    unshift(object, geometry, material, groupOrder, z, group) {
        const renderItem = this.getNextRenderItem(object, geometry, material, groupOrder, z, group);

        (material.transparent === true ? this.transparent : this.opaque).unshift(renderItem);
    }

    sort(customOpaqueSort, customTransparentSort) {
        if (this.opaque.length > 1) this.opaque.sort(customOpaqueSort || painterSortStable);
        if (this.transparent.length > 1) this.transparent.sort(customTransparentSort || reversePainterSortStable);
    }

    finish() {
        // Clear references from inactive renderItems in the list

        for (let i = this.renderItemsIndex, il = this.renderItems.length; i < il; i++) {
            const renderItem = this.renderItems[i];

            if (renderItem.id === null) break;

            renderItem.id = null;
            renderItem.object = null;
            renderItem.geometry = null;
            renderItem.material = null;
            renderItem.program = null;
            renderItem.group = null;
        }
    }
}

export default class WebGPURenderLists {
    lists: WeakMap<Scene, WeakMap<Camera, WebGPURenderList>>;
    constructor();

    get: (scene: Scene, camera: Camera) => WebGPURenderList;

    dispose: () => void;
}
