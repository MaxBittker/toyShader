var THREE = require('three')
var scene, camera, renderer;
var geometry, material, mesh;
var uniforms = {
  uTime: { type: "f", value: 1.0 },
  cx: { type: "f", value: 1.0 },
  cy: { type: "f", value: 1.0 },
  resolution: { value: new THREE.Vector2() },
}

init();
animate();
function init() {

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
  camera.position.z = 7;

  var geometry = new THREE.Geometry();

  geometry.vertices.push(
  	new THREE.Vector3(  10,  10, 0 ),
  	new THREE.Vector3( -10, -10, 0 ),
  	new THREE.Vector3(  10, -10, 0 ),
    new THREE.Vector3( -10,  10, 0 )

  );

  geometry.faces.push( new THREE.Face3( 0, 1, 2) );
  geometry.faces.push( new THREE.Face3( 0, 3, 1) );


  var material = new THREE.ShaderMaterial( {

	uniforms,
	attributes: {
		vertexOpacity: { value: [] }
	},
	vertexShader:
  `void main() {
  gl_Position = projectionMatrix *
                modelViewMatrix *
                vec4(position, 1.0);
  }`,
	fragmentShader:
  `
  uniform float uTime;
  uniform float cx;
  uniform float cy;


  void main() {
 gl_FragColor = vec4(
                sin(pow((gl_FragCoord.x - 360.0), 1.5) - pow((gl_FragCoord.y - 210.0), 2.0) * (cx / 15000.0) + uTime),
                sin(pow((gl_FragCoord.x - 360.0), 2.0) - pow((gl_FragCoord.y - 210.0), 2.0) * (cy / 15000.0) + uTime),
                sin(pow((gl_FragCoord.x - 360.0), 2.0) - pow((gl_FragCoord.y - 210.0), 2.0) * (cx * cy / 50000.0) + uTime),
                1);
  }`

} );


  mesh = new THREE.Mesh( geometry, material );

  scene.add( mesh );

  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );

  document.body.appendChild( renderer.domElement );

}
document.onmousemove = function(e){
    uniforms.cx = { type: "f", value: e.pageX };
    uniforms.cy = { type: "f", value: e.pageY };
}
function animate() {
  uniforms.uTime.value += 0.1;

  requestAnimationFrame( animate );
  // mesh.rotation.x = uniforms.cx.value/100;
  // mesh.rotation.y = uniforms.cy.value/100;

  // mesh.rotation.y += 0.02;
  // camera.position.z -= 0.1;
  // camera.position.z = uniforms.cx.value * Math.random();

  renderer.render( scene, camera );

}
