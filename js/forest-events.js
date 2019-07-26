
//positions to choose from for the camera
//these are the initial positions
var teleporterLocations = [
    {x:20, y:1.6, z:0},
    {x:-18, y:1.6, z:-3},
    {x:-2, y:1.6, z:-21}
  ]

// Starting from the top left and going right
// 1. {x:-39, y:1.6, z:-40}
// 2.{x:-10, y:1.6, z:-35}
// 3.{x:27, y:1.6, z:-45}
// 4.{x:55, y:1.6, z:-40}

// 5.

var ingredients = {
    blueCone: false,
    redBox: false   
}



    var cameraPosition = {x:0,y:0,z:0};
    var position;
    var elementInitialPositions = {}

var itemsCollected = false;
// var teleporterEl = [];
// var numTeleporters = 3;

AFRAME.registerComponent('object-lighting', {
    init: function() {
     //initialize light
     //listen for fade out
    //fade back in after a length of time
        var el = this.el;
        el.setAttribute('light', {
            type: 'point',
            color: "#FFF",
            intensity: 0.6
        });
        setTimeout(function() {
            fadeOut();
            fadeIn();
        }, 100);
        
        
        function fadeOut() {
          el.setAttribute('animation__out', {
                property: 'light.color',
                from: '#FFF',
                to: '#000',
                dur: 300,
                easing: 'easeInOutQuad',
                startEvents: 'fadeOut',
                pauseEvents: 'pause'
            });
            document.getElementById('ambient').setAttribute('animation__out', {
                property: 'light.intensity',
                from: 0.2,
                to: 0,
                dur: 300,
                startEvents: 'fadeOut',
                pauseEvents: 'pause'
            });
          //death events
          el.setAttribute('animation__outdeath', {
                property: 'light.color',
                from: '#FFF',
                to: '#300',
                dur: 2000,
                easing: 'easeInOutQuad',
                startEvents: 'fadeOutDeath',
                pauseEvents: 'pause'
            });
            document.getElementById('ambient').setAttribute('animation__outdeath', {
                property: 'light.intensity',
                from: 0.2,
                to: 0,
                dur: 2000,
                startEvents: 'fadeOutDeath',
                pauseEvents: 'pause'
            });
        }
        function fadeIn() {
            el.setAttribute('animation__in', {
                property: 'light.color',
                to: '#FFF',
                dur: 300,
                easing: 'easeInOutQuad',
                startEvents: 'fadeIn'
            });
            var ambient =  document.getElementById('ambient')
            ambient.setAttribute('animation__in', {
                property: 'light.intensity',
                to: 0.2,
                dur: 300,
                startEvents: 'fadeIn'
            });
          
          //death events
            el.setAttribute('animation__in', {
                property: 'light.color',
                to: '#FFF',
                dur: 300,
                easing: 'easeInOutQuad',
                startEvents: 'fadeInDeath'
            });
            var ambient =  document.getElementById('ambient')
            ambient.setAttribute('animation__in', {
                property: 'light.intensity',
                to: 0.2,
                dur: 300,
                startEvents: 'fadeInDeath'
            });
        }
    
    }
});

AFRAME.registerComponent('death-listener', {
    init: function() {
        //listen to camera for specific position relative to user
        //trigger a fadeout that can be cancelled by a mouseleave over a camera listen
        //take the user out of the game if they 'lose'
        var deathTimer;
        var gameObjects = document.getElementById('gameplay-objects').children;
        
        this.el.addEventListener('raycaster-intersected', function(evt) {
           var gameObjects = document.getElementById('gameplay-objects').children;
           for(var i=0;i<gameObjects.length;i++) {
                   gameObjects[i].emit('fadeOutDeath');
               }
           
          
            deathTimer = setTimeout( function() {
               
              //You Died animation or Title
              
                //link back to start screen
                window.location.href = 'index.html';
                
           }, 2000);
       });
       
       this.el.addEventListener('raycaster-intersected-cleared', function(evt) {
           if(deathTimer){
               clearTimeout(deathTimer);
               for(var i=0;i<gameObjects.length;i++) {
                   gameObjects[i].emit('pause');
                   gameObjects[i].emit('fadeInDeath');
               }
           }
           
       });
    }
});

//step 1 create all teleport elements

// var sceneEl = document.querySelector('a-scene');
// console.log(sceneEl);

// for (var i=0; i<numTeleporters; i++) {
//   teleporterEl[i] = document.createElement('a-entity');
//   teleporterEl[i].setAttribute("id", "teleporter-" + i);
//   teleporterEl[i].setAttribute("position", teleporterLocations[i]);
//   teleporterEl[i].setAttribute("class", "collidable");
//   teleporterEl[i].setAttribute("material", "color", "white");
//   teleporterEl[i].setAttribute("geometry", { primitive: "box" } );
//   console.log(teleporterEl[i]);
// }



// create teleport functionality
AFRAME.registerComponent('teleporter', {
   init: function() {
       //listen for intersection with raycaster
       //start fade on intersection
       //after two seconds, change location of camera
       //fade in objects
      
       var teleportTimer;
       var gameObjects = document.getElementById('gameplay-objects').children;
       var camera = document.getElementById('camera');
       var death = document.getElementById('death');
       var el = this.el;

       
       this.el.addEventListener('raycaster-intersected', function(evt) {
         
           var gameObjects = document.getElementById('gameplay-objects').children;
           for(var i=0;i<gameObjects.length;i++) {
                   gameObjects[i].emit('fadeOut');
               }
           
           
            teleportTimer = setTimeout( function() {
                 
                //determine the position that the camera will go to based on the world quaternion
                position = el.getAttribute("position");
                camera.setAttribute('position', position);
              //death follows you
                var rotation = new THREE.Quaternion();
                camera.object3D.getWorldQuaternion(rotation);
              
                var deathDistance = new THREE.Vector3(0, 0, 1);
                deathDistance.applyQuaternion(rotation);
                console.log("Death distance x is " + deathDistance.x);
              
                death.setAttribute('position', position);
                death.object3D.position.addScaledVector(deathDistance, 10);
              
                
                
                //determine which teleporter items will appear
                //set new teleporter objects position relative to camera position
                //set death position relative to camera position
                
                
             //  console.log(document.querySelector('#ambient').getAttribute('light.intensity'));  
                
               for(var i=0;i<gameObjects.length;i++) {
                   gameObjects[i].emit('fadeIn');
               }
                
           }, 300);
       });
       
       this.el.addEventListener('raycaster-intersected-cleared', function(evt) {
           if(teleportTimer){
               clearTimeout(teleportTimer);
               for(var i=0;i<gameObjects.length;i++) {
                   gameObjects[i].emit('pause');
                   gameObjects[i].emit('fadeIn');
               }
           }
           
       });
   },
    
  nextPosition: function(currentPosition, direction) {
      //determine from list of coordinates, which are the nearest possible coordinates
      //choose the coordinates in the direction that the camera is looking at
      //return the next position
  }
});


// for (var i=0; i<numTeleporters; i++) { 
//     teleporterEl[i].setAttribute('teleporter', '');
//   }

// //add all elements to scene
// setTimeout( function() {
//   for (var i=0; i<numTeleporters; i++) {
//     console.log(i);
//     sceneEl.appendChild(teleporterEl[i]);
//   }
// }, 2000);



    
    AFRAME.registerComponent('collider-check', {
//      dependencies: ['raycaster'],

      init: function () {
        this.el.addEventListener('raycaster-intersection', function (evt) {
          console.log('Player hit something!');
            console.log(evt.detail);
        });
          
        this.el.addEventListener('raycaster-intersection-cleared', function (evt) {
          console.log('Looked Away!');
            console.log(evt.detail)
        });
      }
    });

    AFRAME.registerComponent('snag-rot-on-land', {
      schema: {},



      init: function() {
        var el = this.el
        this.snagRotation(el)
      }

    })

    AFRAME.registerComponent('set-rot-by-pos', {
      schema: {},

      setRotation: function(el) {
        console.log(" Cmaera position is " + cameraPosition.x);
        let elPos = el.getAttribute('position')
        // y-2 so the object goes under you
        let cpv = new THREE.Vector3(cameraPosition.x, cameraPosition.y , cameraPosition.z, 'XYZ')
        let epv = new THREE.Vector3(elPos.x, elPos.y, elPos.z, 'XYZ')
        
        let dv = epv.sub(cpv)

        elementInitialPositions[el.id] = dv

        let cpvnorm = cpv.normalize()
        let dvnorm = dv.normalize()

        let q = new THREE.Quaternion();
        q.setFromUnitVectors( cpvnorm, dvnorm );

        el.object3D.applyQuaternion(q)
      },

      init: function() {
        var el = this.el
        this.setRotation(el)
      }
    })

    AFRAME.registerComponent('tractor-beam', {
      schema: {},

      init: function() {
        var el = this.el;
        el.addEventListener("raycaster-intersected", handler, true);
        el.addEventListener('raycaster-intersected-cleared', function h(e) {
          el.removeEventListener('raycaster-intersected', handler, true)
          el.removeEventListener('raycaster-intersected-cleared', h)
        }.bind(this))
        
        function handler() {
        
          position = document.getElementById('camera').getAttribute('position');
            
          
            
            el.setAttribute('animation__pos', {
                property: 'position',
                to: {x:position.x,y:position.y-1,z:position.z},
                dur: 5000,
                easing: 'easeInOutCubic'
            });
          
            el.setAttribute('animation__opacity', {
              property: 'material.opacity',
              to: 0,
              dur: 4000,
              easing: 'linear'
            })

            setTimeout(function(){ 
                el.setAttribute('scale', {x:0,y:0,z:0});
                
                //if the object belongs to ingredients list
                if(ingredients[el.id] != null){
                    //say it's been collected
                    ingredients[el.id] = true;
                }
                
                //emit event so camera can update
                document.getElementById('camera').emit('updateProgress');
                
            }, 5000);

          }
      }
    })

    AFRAME.registerComponent('rotate-on-object-axis', {
      schema: {},

      getCameraRotation: function() {
        let camera = document.querySelector("[camera]").getObject3D('camera')

        let initVector = new THREE.Vector3(0, 0, -1)
        let dirVector = new THREE.Vector3()
        camera.getWorldDirection(dirVector)

        let dirSpherical = new THREE.Spherical().setFromVector3(dirVector)
        console.log(dirSpherical)

        return dirVector
      },

      handler: function(event) {
        let currentRotation = event.target.getAttribute('rotation')
        let nextRotationZ = THREE.Math.radToDeg(event.target.object3D.rotation.z + Math.PI);
        let toRotation = String(currentRotation.x) + ' ' + String(currentRotation.y) + ' ' + String(nextRotationZ)
        let that = this
        let _event = event

        setTimeout(
          function() {
            let epv = elementInitialPositions[_event.target.id]

            let camera = document.getElementById("camera").getObject3D('camera')

            let initVector = new THREE.Vector3(0, 0, -1)
            let dirVector = new THREE.Vector3()
            camera.getWorldDirection(dirVector)

            let dirSpherical = new THREE.Spherical().setFromVector3(dirVector)
            console.log(dirSpherical)

            let epSpherical = new THREE.Spherical().setFromVector3(epv)

            console.log("Event Target Vector:")
            console.log(epSpherical)
            console.log("Camera Rotation Vector:")
            console.log(dirSpherical)

          }, 5000
        )

        event.target.setAttribute('animation', {
            property: 'rotation',
            to: toRotation,
            dur: 5000,
        });
      },

      init: function() {
        var el = this.el
        el.addEventListener("raycaster-intersected", this.handler, true);
        el.addEventListener('raycaster-intersected-cleared', function h(e) {
          el.removeEventListener('raycaster-intersected', this.handler, true)
          el.removeEventListener('raycaster-intersected-cleared', h)
        }.bind(this))
      }

    })
    
AFRAME.registerComponent('camera-controller', {
    init: function () {
        var el = this.el;
        //when you collect an item, the cursor updates like a pie chart
        // when you collect all three emit a completon heads up text
        // listens for death event
        this.el.addEventListener('updateProgress', function () {
           //get total items 
            var totalItems = 2;
            //update theta length based on fraction
            var numberCollected = 0;
            
            for(var item in ingredients){
                if(ingredients[item]) numberCollected++; 
            }
            

            document.getElementById('progress-bar').setAttribute('geometry', {thetaLength: (numberCollected/totalItems * 360)})                     
                                 
        });
    },
    
     tick: (function () {
//         var position2 = new THREE.Vector3();
//         var rotation = new THREE.Euler();


//         this.el.object3D.getWorldPosition(position2);
//         this.el.object3D.getWorldQuaternion(rotation);

//        console.log(position);
//        console.log(rotation);
       var el = this.el;
       var raycaster = document.getElementById('raycaster');
       var position = el.getAttribute('position');
       //if player is inside region
       if( position.x < 40 && position.x > -25 && position.z < 40 && position.z > -25 ) {
         raycaster.setAttribute('raycaster', 'far', '25' );  
       } else {
         raycaster.setAttribute('raycaster', 'far', '35' ); 
       }
       
      })
    });

AFRAME.registerComponent('cabin-listener', {
    init: function() {
        //listen for intersection by player
        //if the player had collected all items link to the cabin
       var cabinTimer;
       var gameObjects = document.getElementById('gameplay-objects').children;
      

       
       this.el.addEventListener('raycaster-intersected', function(evt) {
           var gameObjects = document.getElementById('gameplay-objects').children;
           
           if(allTrue(ingredients)) {
               for(var i=0;i<gameObjects.length;i++) {
                   gameObjects[i].emit('fadeOut');
               }
           
           
                cabinTimer = setTimeout( function() {
                    
                    //link back to cabin screen
                    window.location.href = 'olive.html';


               }, 2000);
           }
           
       });
       
       this.el.addEventListener('raycaster-intersected-cleared', function(evt) {
           if(cabinTimer){
               clearTimeout(cabinTimer);
               for(var i=0;i<gameObjects.length;i++) {
                   gameObjects[i].emit('pause');
                   gameObjects[i].emit('fadeIn');
               }
           }
           
       });
        
         function allTrue(object) { 
            for (var i in object) {
                if (!object[i]) return false;
            }
            return true;
        }
    }
});