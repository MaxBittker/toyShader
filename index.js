let THREE = require('three')
let HUSL = require('husl')
let scene, camera, renderer
let geometry, material, mesh
const origin = new THREE.Vector3(0,0,0)
let cursor = {x:150,y:150}
let lastRender = new Date()
const startCount = 250
var uniforms = {
   uTime: { type: "f", value: 1.0 },
   cx: { type: "f", value: 50.0 },
   cy: { type: "f", value: 50.0 },
   resolution: { value: new THREE.Vector2() },
 }

 material = new THREE.ShaderMaterial( {

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
                 sin(pow((gl_FragCoord.x - 360.0), 2.0) - pow((gl_FragCoord.y - 210.0), 2.0) * (cx / 15000.0)),
                 sin(pow((gl_FragCoord.x - 360.0), 2.0) - pow((gl_FragCoord.y - 210.0), 2.0) + uTime * 20.0 ),
                 sin(pow((gl_FragCoord.x - 360.0), 2.0) - pow((gl_FragCoord.y - 210.0), 2.0) + (uTime)),
                 1);
   }`

 } );


document.onmousemove = e => {
    cursor.x = window.innerWidth - e.x
    cursor.y = window.innerHeight -e.y
}
const birth = () => {
  let loc = origin.clone()
  if(scene.children.length>0) {
    let parent =scene.children[Math.random()*(scene.children.length-1)|0]
    loc.copy(parent.position)
  }
  let color  =  HUSL.toHex(Math.random()*360|0, 65,60)
  // let material = new THREE.MeshBasicMaterial( { color, transparent: true, opacity: 0.8 } )
  geometry = new THREE.SphereGeometry( .9, 7, 7 )
  mesh = new THREE.Mesh( geometry, material )
  mesh.position.copy(loc)
  mesh.velocity = new THREE.Vector3((Math.random()-0.5),(Math.random()-0.5),(Math.random()-0.5))
  scene.add( mesh )
}

const init = () => {
  scene = new THREE.Scene()

  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 )
  camera.position.z = 22

  renderer = new THREE.WebGLRenderer()
  renderer.setSize( window.innerWidth, window.innerHeight )
  renderer.setClearColor(0xfaf7f0, 1)
  document.body.appendChild( renderer.domElement )
}


const animate = () => {
  requestAnimationFrame( animate )
  scene.children.forEach(me => {
    if(me.type!=="Mesh") return
    let move = origin.clone()

    scene.children.forEach(friend => {
      if(friend === me || friend.type !== "Mesh") return
      let distance = friend.position.clone().sub(me.position)
      let delta = distance.length()
      if(delta < 20)
        move.sub(distance.setLength(Math.pow(delta, -1) * 10))
      else if(delta > 150)
        move.add(distance.max(25))
      else
        move.add(me.position.clone().cross(distance))
    })

    me.velocity.add(move.normalize().divideScalar(20))
    me.velocity.sub(me.position.clone().divideScalar(cursor.y * 2))
    me.position.add(me.velocity.normalize().divideScalar( 1 + (cursor.x / 100)))

  })

  const c = Date.now()
  const tickTime = c - lastRender
  if( tickTime > 35 && scene.children.length > 15){
    scene.children = scene.children.slice(1)
  } else if(tickTime < 30)
    birth()
  uniforms.uTime.value+= 0.1;
  lastRender = c
  renderer.render(scene, camera )

}

init()
animate()
