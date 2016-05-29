var THREE = require('three')
var HUSL = require('husl')
var scene, camera, renderer;
var geometry, material, mesh;
var uniforms = {
  uTime: { type: "f", value: 1.0 },
  cx: { type: "f", value: 1.0 },
  cy: { type: "f", value: 1.0 },
  resolution: { value: new THREE.Vector2(500,500) },
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
  uniform vec2 resolution;




  float sdSphere( vec3 p, float s )
  {
    return length(p)-s;
  }

  // vec3 opTx( vec3 p, mat4 m )
  // {
  //     vec3 q = invert(m)*p;
  //     return sdTorus(q, vec2(0.2, 0.2));
  // }

  float sdTorus( vec3 p, vec2 t )
  {
  vec2 q = vec2(length(p.yz)-t.y,p.x);
  return length(q)-t.x;
  }


  float opRep( vec3 p, vec3 c )
  {
      vec3 q = mod(p,c)-0.5*c;
      // return opTx(p, mat4(0.0,0.5,0.0,0.0));
      // return sdSphere( q, 0.3 + (.01*sin(uTime)));
      return sdTorus( q, vec2(0.2, 0.8));

  }
  void main() {

    vec3 eye = vec3(0, 0, -1);
    vec3 up = vec3(0, 1, 0);
    vec3 right = vec3(1, 0, 0);
    vec3 forward = vec3(0, 0, -1);


    float u = gl_FragCoord.x * 2.0 / resolution.x - 1.0;
    float v = gl_FragCoord.y * 2.0 / resolution.y - 1.0;
    vec3 ro = vec3(tan(uTime), 1, 1);
    vec3 rd = eye + (right * vec3(1.0)) + (forward * v) + (up * u);

    vec4 color = vec4(193.0/255.0,164.0/255.0,126.0/255.0,1.0); // Sky color

    float t = 0.0;
    const int maxSteps = 16;
    for(int i = 0; i < maxSteps; ++i)
    {
        vec3 p = ro + rd * t;
        float d = opRep(p, vec3(2.1,2.1,2.1));

        if(d < 0.01)
        {
            float c = (float(i) / float(maxSteps)) ;
            color = color * vec4(0.1-v*c,c,c,1); // Sphere color
            break;
        }

        t += d;
    }

    gl_FragColor  = color;


  }`
/*
gl_FragColor = vec4(
               sin(pow((gl_FragCoord.x - 360.0), 2.0) - pow((gl_FragCoord.y - 210.0), 2.0) * (cx / 15000.0)),
               sin(pow((gl_FragCoord.x - 360.0), 2.0) - pow((gl_FragCoord.y - 210.0), 2.0) * (cy / 15000.0)),
               sin(pow((gl_FragCoord.x - 360.0), 2.0) - pow((gl_FragCoord.y - 210.0), 2.0) * (cx * cy / 150000.0)),
               1);
               */
} );


  mesh = new THREE.Mesh( geometry, material );

  scene.add( mesh );

  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setClearColor('#c1a47e', 1)

  document.body.appendChild( renderer.domElement );

}
document.onmousemove = function(e){
    uniforms.cx = { type: "f", value: e.pageX };
    uniforms.cy = { type: "f", value: e.pageY };
}
function animate() {
  uniforms.uTime.value += 0.01;

  requestAnimationFrame( animate );
  renderer.render( scene, camera );

}
