let THREE = require('three')
let HUSL = require('husl')
let scene, camera, renderer;
let geometry, material, mesh;
const origin = new THREE.Vector3(0,0,0);
let cursor = {x:150,y:150}
let lastRender = new Date()
document.onmousemove = function(e){
    cursor.x = window.innerWidth - e.x;
    cursor.y = window.innerHeight -e.y;
}

init();
animate();
function init() {

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
  camera.position.z = 20;
  const many = 400
  const row = (Math.sqrt(many)/2) |0
  for(let x = -row; x<row; x+=1){
    for(let y = -row; y<row; y+=1){
      material =  new THREE.MeshBasicMaterial( { color: HUSL.toHex(Math.random()*359, 99,70)} );
      geometry =new THREE.SphereGeometry( 1, 7, 7 );
      mesh = new THREE.Mesh( geometry, material );
      mesh.position.x = x;
      mesh.position.y = y;
      mesh.velocity = new THREE.Vector3((Math.random()-0.5),(Math.random()-0.5),(Math.random()-0.5))
      scene.add( mesh );
    }
  }
  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

}


function animate() {

  requestAnimationFrame( animate );
  scene.children.forEach(me=>{
    let move = origin.clone()

    scene.children.forEach(friend=>{
      if(friend === me) return;
      let distance = friend.position.clone().sub(me.position)
      let delta = distance.length()
      if(delta < 15)
        move.sub(distance.setLength(Math.pow(delta, -1)*10))
      else if(delta > 150)
        move.add(distance.max(25))
      else
        move.add(me.position.clone().cross(distance))
    })

    me.velocity.add(move.normalize().divideScalar(20))
    me.velocity.sub(me.position.clone().divideScalar(cursor.y*2))
    me.position.add(me.velocity.normalize().divideScalar( 1 + (cursor.x / 100)));

  })

  const c = Date.now()
  if( c -lastRender > 35 && scene.children.length>15){
    scene.children = scene.children.slice(1)
    console.log(scene.children.length, c - lastRender)
  }
  lastRender = c
  renderer.render( scene, camera );

}
