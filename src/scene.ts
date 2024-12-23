import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
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

  addDemo() {
    const url = "/leg.glb";

    const dracoLoader = new DRACOLoader();
    const loader = new GLTFLoader();
    // public/three/examples/jsm/libs/draco
    // dracoLoader.setDecoderPath("/three/examples/jsm/libs/draco/gltf/");
    // loader.setDRACOLoader(dracoLoader);

    loader?.load(
      url,
      (gltf) => {
        // gltf.scene.matrix.identity();
        console.log("glt", gltf);
        // fix1(gltf.scene);
        // gltf.scene.traverse((child) => {
        //   if (child.isMesh) child.geometry.computeBoundingBox();
        // });
        // gltf.scene.children[0].clear();
        // gltf.scene.children[0].children[0].removeFromParent();

        // gltf.scene.updateMatrixWorld(true);

        // gltf.scene.children[0].children[1].clear();

        // normalize(gltf.scene);

        // glb.parent = null;

        // {
        //   const positionAttribute =
        //     gltf.scene.children[0].children[0].geometry.attributes.position;
        //   const box = new THREE.Box3();

        //   for (let i = 0; i < positionAttribute.count; i++) {
        //     const vertex = new THREE.Vector3();
        //     vertex.fromBufferAttribute(positionAttribute, i);
        //     box.expandByPoint(vertex);
        //   }
        //   console.log("box", box);
        //   // gltf.scene.children[0].children[0].geometry.boundingBox = box;
        //   // gltf.scene.children[0].children[0].geometry.computeBoundingBox();
        //   console.log(
        //     "gltf.scene.children[0].children[0]",
        //     gltf.scene.children[0].children[0]
        //   );
        //   // fix(gltf.scene);
        // }

        // console.log("Bounding Box:", box);

        // Visualize the bounding box
        // const boxHelper = new THREE.Box3Helper(box, 0xff0000); // Red color
        // this.scene.add(boxHelper);

        // Compute the local bounding box
        // glb.matrixWorldNeedsUpdate = true;
        // glb.geometry.computeBoundingBox();
        // glb.geometry.computeBoundingSphere();
        // glb.geometry.computeVertexNormals();
        // glb.geometry.computeTangents();

        // glb.updateMatrix();
        // const identityMatrix = new THREE.Matrix4();
        // glb.applyMatrix4(identityMatrix);

        const box = new THREE.Box3().setFromObject(gltf.scene);
        const size = new THREE.Vector3();
        // const center = box.getCenter(new THREE.Vector3());

        box.getSize(size);
        // glb.position.add(new Vector3(25, size.y / 2, size.z / 2));
        console.log("size", size);
        // console.log("obj", glb);

        // {
        //   const boxHelper = new THREE.Box3Helper(box, 0xff0000);
        //   this.scene?.add(boxHelper);
        // }

        const boxHelper1 = new THREE.Box3Helper(
          new THREE.Box3().setFromObject(gltf.scene),
          0xff0000
        );
        this.scene?.add(boxHelper1);
        this.scene.add(gltf.scene);

        // {
        //   const mesh = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.8, 0.03));
        //   mesh.position.x = 1.4;
        //   this.scene.add(mesh);
        // }
      },
      function () {
        // console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
      },
      (error) => {
        console.log("An error happened", error);
      }
    );
  }
}

// const fix = (mesh: any) => {
//   mesh.traverse((child) => {
//     if ((child as THREE.Mesh).isMesh) {
//       const mesh = child as THREE.Mesh;
//       const box = new THREE.Box3().setFromObject(mesh);
//       const center = new THREE.Vector3();
//       box.getCenter(center);

//       // Center the geometry
//       mesh.geometry.center();

//       // Adjust the position to maintain visual alignment
//       mesh.position.add(center);

//       // Recompute bounding box after centering
//       mesh.geometry.computeBoundingBox();
//     }
//   });
// };

// const fix1 = (mesh: any) => {
//   mesh.traverse((child) => {
//     if ((child as THREE.Mesh).isMesh) {
//       {
//         const positionAttribute = child.geometry.attributes.position;
//         const box = new THREE.Box3();

//         for (let i = 0; i < positionAttribute.count; i++) {
//           const vertex = new THREE.Vector3();
//           vertex.fromBufferAttribute(positionAttribute, i);
//           box.expandByPoint(vertex);
//         }
//         console.log("box", box);
//         child.geometry.boundingBox = box;
//         child.updateMatrix(true);

//         // fix(gltf.scene);
//       }
//       // mesh.geometry.computeBoundingBox();
//     }
//   });
// };

// const normalize = (mesh: THREE.Mesh) => {
//   mesh.traverse((child) => {
//     if (child.isMesh) {
//       console.log("-1233");
//       child.geometry.computeBoundingBox();
//       const center = new THREE.Vector3();
//       child.geometry.boundingBox.getCenter(center);
//       child.geometry.center(); // Centers the geometry
//       child.position.add(center); // Adjusts the position
//     }

//     if (child.isMesh) {
//       console.log("-1223");
//       child.geometry.computeBoundingBox();
//       child.geometry.computeBoundingSphere();
//     }

//     if (child.isMesh && child.geometry.attributes.position.count === 0) {
//       mesh.remove(child);
//     }
//   });
// };

export { Scene };
