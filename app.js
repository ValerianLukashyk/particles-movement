import * as THREE from "three";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import vertex from './shaders/vertex.glsl'
import fragment from './shaders/fragment.glsl'



class Scene {
  constructor() {
    this.container = document.getElementById("scene");
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.clock = new THREE.Clock()
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.width / this.height,
      0.1,
      1000
    );
    this.camera.position.set(0, -1, -0.1);
    this.camera.lookAt(0,0,0)
    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.container,
      antialias: true,
      // alpha: true,
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(2);

    

    
    this.addObjects()
    this.resize()
    this.setupResize()
    
    this.render();
    // this.controls = new OrbitControls(this.camera, this.renderer.domElement)
  }

  setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
    
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;    
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
  }

  addObjects() {
    this.geometry = new THREE.BufferGeometry();
    
    let count = 500;
    let position = new Float32Array(count*count*3)


    for (let i = 0; i < count; i++) {
      for (let j = 0; j < count; j++) {
        let u = Math.random()*2*Math.PI;
        let v = Math.random()*Math.PI;

        let x = (0.9 + 0.2*v)*Math.cos(u)*Math.sin(v);
        let y = 1.5*Math.cos(v)
        let z = (0.9 + 0.2*v)*Math.sin(u)*Math.sin(v);

        position.set([
          (i/count - 0.5)*10,
          (j/count - 0.5)*10,
          0,
          
        ], 3*(count*i+j))
        // position.set([
        //   x,
        //   y,
        //   z
        // ], 3*(count*i+j))
      }      
    }

    this.geometry.setAttribute('position', new THREE.BufferAttribute(position, 3))

    this.material = new THREE.ShaderMaterial({
      extensions: { derivatives: "#extension GL_OES_standard_derivatives: enable"},
      side: THREE.DoubleSide,
      transparent: true,
      vertexShader: vertex,
      fragmentShader: fragment,
      depthWrite: false,
      depthTest: false,
      uniforms: {
        u_time: {type: 'f', value: 0},
        resolution: { type: 'v4', value: new THREE.Vector4()},
        uvRate1: { value: new THREE.Vector2(1, 1)},

      },
      blending: THREE.AdditiveBlending
    })
    this.plane = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.plane);
    
    
  }
  animate() {
    this.material.uniforms.u_time.value = this.clock.getElapsedTime()
  }
  render() {
    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(this.render.bind(this));
    this.animate()
  }
}

new Scene();
