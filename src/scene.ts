import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Vector3 } from "three";
import Stats from "three/examples/jsm/libs/stats.module";

class Scene {
  stats: Stats;

  camera: THREE.OrthographicCamera | THREE.PerspectiveCamera;
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  axis: THREE.AxesHelper;
  controls: OrbitControls;
  intersected: boolean = false;
  pointer: THREE.Vector3;

  raycaster: THREE.Raycaster;
  htmlElement: HTMLElement | null;

  constructor(props: { canvas: HTMLElement }) {
    const { canvas } = props;

    this.renderer = new THREE.WebGLRenderer({ antialias: true });

    this.renderer.setClearColor(0xffffff);

    this.axis = new THREE.AxesHelper(400);

    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector3();

    this.htmlElement = canvas;

    this.renderer.setSize(
      this.htmlElement.clientWidth,
      this.htmlElement.clientHeight
    );
    this.htmlElement.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      30,
      this.htmlElement.clientWidth / this.htmlElement.clientHeight,
      0.1,
      100
    );

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.camera.updateMatrix();
    this.controls.update();

    this.camera.position.set(0, 1, 2);
    this.camera.lookAt(0, 0, 0);

    this.scene = new THREE.Scene();

    const axis = new THREE.AxesHelper(20);
    this.scene.add(axis);

    const netSize = 10;
    const helper = new THREE.GridHelper(netSize, 100);
    this.scene.add(helper);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
    this.scene.add(ambientLight);

    const hLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
    hLight.position.set(1, 2, 0);

    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.renderer.shadowMap.type = THREE.PCFShadowMap;

    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.NoToneMapping;
    this.renderer.toneMappingExposure = 1;

    this.stats = new Stats();
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    this.renderer.render(this.scene, this.camera);
    this.stats.update();
  }
}

export { Scene };