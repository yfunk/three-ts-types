import * as THREE from 'three';

import { DDSLoader } from 'three/examples/jsm/loaders/DDSLoader';

import WebGPURenderer from 'three/examples/jsm/renderers/webgpu/WebGPURenderer';
import WebGPU from 'three/examples/jsm/renderers/webgpu/WebGPU';

import AttributeNode from 'three/examples/jsm/renderers/nodes/core/AttributeNode';
import FloatNode from 'three/examples/jsm/renderers/nodes/inputs/FloatNode';
import Vector2Node from 'three/examples/jsm/renderers/nodes/inputs/Vector2Node';
import ColorNode from 'three/examples/jsm/renderers/nodes/inputs/ColorNode';
import TextureNode from 'three/examples/jsm/renderers/nodes/inputs/TextureNode';
import UVNode from 'three/examples/jsm/renderers/nodes/accessors/UVNode';
import PositionNode from 'three/examples/jsm/renderers/nodes/accessors/PositionNode';
import NormalNode from 'three/examples/jsm/renderers/nodes/accessors/NormalNode';
import OperatorNode from 'three/examples/jsm/renderers/nodes/math/OperatorNode';
import SwitchNode from 'three/examples/jsm/renderers/nodes/utils/SwitchNode';
import TimerNode from 'three/examples/jsm/renderers/nodes/utils/TimerNode';

let camera, scene, renderer;

let box;

init().then(animate).catch(error);

async function init() {
    if (WebGPU.isAvailable() === false) {
        document.body.appendChild(WebGPU.getErrorMessage());

        throw 'No WebGPU support';
    }

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 10);
    camera.position.z = 4;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x222222);

    // textures

    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('./textures/uv_grid_opengl.jpg');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.name = 'uv_grid';

    const textureDisplace = textureLoader.load('./textures/transition/transition1.png');
    textureDisplace.wrapS = THREE.RepeatWrapping;
    textureDisplace.wrapT = THREE.RepeatWrapping;

    // compressed texture

    const ddsLoader = new DDSLoader();
    const dxt5Texture = ddsLoader.load('./textures/compressed/explosion_dxt5_mip.dds');

    // box mesh

    const geometryBox = new THREE.BoxGeometry();
    const materialBox = new THREE.MeshBasicMaterial();

    const timerNode = new TimerNode();

    // birection speed
    const timerScaleNode = new OperatorNode(
        '*',
        timerNode,
        new Vector2Node(new THREE.Vector2(-0.5, 0.1)).setConst(true),
    );
    const animateUV = new OperatorNode('+', new UVNode(), timerScaleNode);

    materialBox.colorNode = new TextureNode(texture, animateUV);

    // test uv 2
    //geometryBox.setAttribute( 'uv2', geometryBox.getAttribute( 'uv' ) );
    //materialBox.colorNode = new TextureNode( texture, new UVNode( 1 ) );

    box = new THREE.Mesh(geometryBox, materialBox);
    box.position.set(0, 1, 0);
    scene.add(box);

    // displace example

    const geometrySphere = new THREE.SphereGeometry(0.5, 64, 64);
    const materialSphere = new THREE.MeshBasicMaterial();

    const displaceAnimated = new SwitchNode(new TextureNode(textureDisplace), 'x');
    const displaceY = new OperatorNode('*', displaceAnimated, new FloatNode(0.25).setConst(true));

    const displace = new OperatorNode('*', new NormalNode(NormalNode.LOCAL), displaceY);

    materialSphere.colorNode = displaceY;
    materialSphere.positionNode = new OperatorNode('+', new PositionNode(PositionNode.LOCAL), displace);

    const sphere = new THREE.Mesh(geometrySphere, materialSphere);
    sphere.position.set(-2, -1, 0);
    scene.add(sphere);

    // data texture

    const geometryPlane = new THREE.PlaneGeometry();
    const materialPlane = new THREE.MeshBasicMaterial();
    materialPlane.colorNode = new OperatorNode(
        '+',
        new TextureNode(createDataTexture()),
        new ColorNode(new THREE.Color(0x0000ff)),
    );
    materialPlane.opacityNode = new SwitchNode(new TextureNode(dxt5Texture), 'a');
    materialPlane.transparent = true;

    const plane = new THREE.Mesh(geometryPlane, materialPlane);
    plane.position.set(0, -1, 0);
    scene.add(plane);

    // compressed texture

    const materialCompressed = new THREE.MeshBasicMaterial();
    materialCompressed.colorNode = new TextureNode(dxt5Texture);
    materialCompressed.transparent = true;

    const boxCompressed = new THREE.Mesh(geometryBox, materialCompressed);
    boxCompressed.position.set(-2, 1, 0);
    scene.add(boxCompressed);

    // points

    const points = [];

    for (let i = 0; i < 1000; i++) {
        const point = new THREE.Vector3().random().subScalar(0.5);
        points.push(point);
    }

    const geometryPoints = new THREE.BufferGeometry().setFromPoints(points);
    const materialPoints = new THREE.PointsMaterial();

    materialPoints.colorNode = new OperatorNode('*', new PositionNode(), new FloatNode(3).setConst(true));

    const pointCloud = new THREE.Points(geometryPoints, materialPoints);
    pointCloud.position.set(2, -1, 0);
    scene.add(pointCloud);

    // lines

    const geometryLine = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-0.5, -0.5, 0),
        new THREE.Vector3(0.5, -0.5, 0),
        new THREE.Vector3(0.5, 0.5, 0),
        new THREE.Vector3(-0.5, 0.5, 0),
    ]);

    geometryLine.setAttribute('color', geometryLine.getAttribute('position'));

    const materialLine = new THREE.LineBasicMaterial();
    materialLine.colorNode = new AttributeNode('color', 'vec3');

    const line = new THREE.Line(geometryLine, materialLine);
    line.position.set(2, 1, 0);
    scene.add(line);

    //

    renderer = new WebGPURenderer({ extensions: ['texture-compression-bc'] });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize);

    return renderer.init();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    box.rotation.x += 0.01;
    box.rotation.y += 0.02;

    renderer.render(scene, camera);
}

function createDataTexture(): THREE.DataTexture {
    const color = new THREE.Color(0xff0000);

    const width = 512;
    const height = 512;

    const size = width * height;
    const data = new Uint8Array(4 * size);

    const r = Math.floor(color.r * 255);
    const g = Math.floor(color.g * 255);
    const b = Math.floor(color.b * 255);

    for (let i = 0; i < size; i++) {
        const stride = i * 4;

        data[stride] = r;
        data[stride + 1] = g;
        data[stride + 2] = b;
        data[stride + 3] = 255;
    }

    return new THREE.DataTexture(data, width, height, THREE.RGBAFormat);
}

function error(error: string) {
    console.error(error);
}
