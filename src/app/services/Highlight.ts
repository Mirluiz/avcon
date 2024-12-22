import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass.js";
import * as THREE from "three";

class Highlight {
  static dashedBox(container: {
    color: number;
    dimension: { width: number; height: number; depth: number };
  }) {
    const { dimension } = container;

    const color = container.color;

    const createBox = (w: number, h: number, d: number, color: number) => {
      let basePts = [
        [0, 0, 0],
        [1, 0, 0],
        [1, 0, 1],
        [0, 0, 1],
        [0, 1, 0],
        [1, 1, 0],
        [1, 1, 1],
        [0, 1, 1],
      ].map((p) => {
        return new THREE.Vector3(p[0], p[1], p[2]);
      });
      // box sides normals
      let baseNor = [
        [0, 0, -1],
        [1, 0, 0],
        [0, 0, 1],
        [-1, 0, 0],
        [0, 1, 0],
        [0, -1, 0],
      ].map((n) => {
        return new THREE.Vector3(n[0], n[1], n[2]);
      });

      let pts = [];
      let n1 = [];
      let n2 = [];

      //bottom
      for (let i = 0; i < 4; i++) {
        // bottom
        pts.push(basePts[i].clone());
        pts.push(basePts[i + 1 > 3 ? 0 : i + 1].clone());
        n1.push(
          baseNor[i].x,
          baseNor[i].y,
          baseNor[i].z,
          baseNor[i].x,
          baseNor[i].y,
          baseNor[i].z
        );
        n2.push(
          baseNor[5].x,
          baseNor[5].y,
          baseNor[5].z,
          baseNor[5].x,
          baseNor[5].y,
          baseNor[5].z
        );
        // top
        pts.push(basePts[4 + i].clone());
        pts.push(basePts[4 + i + 1 > 7 ? 4 : 4 + i + 1].clone());
        n1.push(
          baseNor[i].x,
          baseNor[i].y,
          baseNor[i].z,
          baseNor[i].x,
          baseNor[i].y,
          baseNor[i].z
        );
        n2.push(
          baseNor[4].x,
          baseNor[4].y,
          baseNor[4].z,
          baseNor[4].x,
          baseNor[4].y,
          baseNor[4].z
        );
        // middle
        pts.push(basePts[i].clone());
        pts.push(basePts[i + 4].clone());
        n1.push(
          baseNor[i].x,
          baseNor[i].y,
          baseNor[i].z,
          baseNor[i].x,
          baseNor[i].y,
          baseNor[i].z
        );
        let prev = i - 1 < 0 ? 3 : i - 1;
        n2.push(
          baseNor[prev].x,
          baseNor[prev].y,
          baseNor[prev].z,
          baseNor[prev].x,
          baseNor[prev].y,
          baseNor[prev].z
        );
      }
      //console.log(pts)

      let g = new THREE.BufferGeometry().setFromPoints(pts);
      g.setAttribute("n1", new THREE.Float32BufferAttribute(n1, 3));
      g.setAttribute("n2", new THREE.Float32BufferAttribute(n2, 3));
      g.translate(-0.5, -0.5, -0.5);
      g.scale(w, h, d);

      let m = new THREE.LineDashedMaterial({
        color: color,
        linewidth: 1,
        dashSize: 0.05,
        gapSize: 0.05,
        // @ts-ignore
        onBeforeCompile: (shader) => {
          shader.vertexShader = `
        attribute vec3 n1;
        attribute vec3 n2;
        varying float isDashed;
        ${shader.vertexShader}
      `.replace(
            `#include <fog_vertex>`,
            `#include <fog_vertex>
        
          vec3 nor1 = normalize(normalMatrix * n1);
          vec3 nor2 = normalize(normalMatrix * n2);
          vec3 vDir = normalize(mvPosition.xyz);
          //vDir = vec3(0, 0, -1);
          float v1 = step( 0., dot( vDir, nor1 ) );
          float v2 = step( 0., dot( vDir, nor2 ) );
          isDashed = min(v1, v2);
        `
          );
          shader.fragmentShader = `
        varying float isDashed;
        ${shader.fragmentShader}
      `.replace(
            `if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}`,
            `
          if ( isDashed > 0.0 ) {
            if ( mod( vLineDistance, totalSize ) > dashSize ) {
              discard;
            }
          }`
          );
        },
      });

      m.depthTest = false;
      let l = new THREE.LineSegments(g, m);
      l.renderOrder = 1000;
      l.computeLineDistances();
      return l;
    };

    return createBox(
      dimension.width / 100,
      dimension.height / 100,
      dimension.depth / 100,
      color
    );
  }
}
export { Highlight };
