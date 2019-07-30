var cameraPosition = {x:0,y:2.5,z:0};
var position;
var elementInitialPositions = {}

AFRAME.registerComponent('fading', {
    init: function() {
     //initialize light
     //listen for fade out
    //fade back in after a length of time
        var el = this.el;
        setTimeout(function() {
            fadeOut();
            fadeIn();
        }, 10);
        
        
        function fadeOut() {
          el.setAttribute('animation__out', {
                property: 'light.intensity',
                from: '1',
                to: '0',
                dur: 250,
                easing: 'easeInOutQuad',
                startEvents: 'fadeOut',
                pauseEvents: 'pause'
            });
          //death events
          el.setAttribute('animation__outdeath', {
                property: 'light.color',
                from: '#FFF',
                to: '#400',
                dur: 2000,
                easing: 'easeInOutQuad',
                startEvents: 'fadeOutDeath',
                pauseEvents: 'pause'
            });
        }
        function fadeIn() {
            el.setAttribute('animation__in', {
                property: 'light.intensity',
                to: '1',
                dur: 250,
                easing: 'easeInOutQuad',
                startEvents: 'fadeIn'
            });
            el.setAttribute('animation__indeath', {
                property: 'light.color',
                to: '#FFF',
                dur: 250,
                easing: 'easeInOutQuad',
                startEvents: 'fadeInDeath',
                pauseEvents: 'pause'
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
        var sceneEl = this.el.sceneEl;
        var lights = document.getElementById('forest-lights').children;
        
        this.el.addEventListener('raycaster-intersected', function(evt) {
           
           for(var i=0;i<lights.length;i++) {
                   lights[i].emit('fadeOutDeath');
               }
           
            deathTimer = setTimeout( function() {
               
                //You Died animation or Title for 2 seconds
                document.getElementById('youdied').emit('youdied');
             //link back to start screen after 2 seconds
                setTimeout( function() {
                    sceneEl.emit('sceneSet','startScreen'); 
                }, 2000);
               
                
           }, 2000);
       });
       
       this.el.addEventListener('raycaster-intersected-cleared', function(evt) {
           if(deathTimer){
               clearTimeout(deathTimer);
               for(var i=0;i<lights.length;i++) {
                   lights[i].emit('pause');
                   lights[i].emit('fadeIn');
                   lights[i].emit('fadeInDeath');
               }
           }
           
       });
    }
});


// create teleport functionality
AFRAME.registerComponent('teleporter', {
   init: function() {
       //listen for intersection with raycaster
       //start fade on intersection
       //after two seconds, change location of camera
       //fade in objects
      
       var teleportTimer;
       var sceneEl = this.el.sceneEl;
       var lights = document.getElementById('forest-lights').children;
       var camera = document.getElementById('camera');
       var death = document.getElementById('death');
       var el = this.el;

       
       this.el.addEventListener('raycaster-intersected', function(evt) {
         
          
           for(var i=0;i<lights.length;i++) {
                   lights[i].emit('fadeOut');
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
        
               for(var i=0;i<lights.length;i++) {
                   lights[i].emit('fadeIn');
               }
                
           }, 300);
       });
       
       this.el.addEventListener('raycaster-intersected-cleared', function(evt) {
           if(teleportTimer){
               clearTimeout(teleportTimer);
               for(var i=0;i<lights.length;i++) {
                   lights[i].emit('pause');
                   lights[i].emit('fadeIn');
               }
           }
       });
   }
});
    
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
              from: 1,
              to: 0,
              dur: 4000,
              easing: 'linear'
            })

            setTimeout(function(){ 
                el.setAttribute('scale', {x:0,y:0,z:0});
                console.log(el.id);
                el.sceneEl.emit('itemCollected',el.id);
                //emit event so camera can update
                el.sceneEl.emit('updateProgress');
                
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
          }, 5000)

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
  
AFRAME.registerComponent('cabin-listener', {
    init: function() {
        //listen for intersection by player
        //if the player had collected all items link to the cabin
       var cabinTimer;
       var sceneEl = this.el.sceneEl;
       var lights = document.getElementById('forest-lights').children;
       
       this.el.addEventListener('raycaster-intersected', function(evt) {
           for(var i=0;i<lights.length;i++) {
               lights[i].emit('fadeOut');
           }

            cabinTimer = setTimeout( function() {
                //link back to cabin screen
                sceneEl.emit('sceneSet','death');
           }, 2000);
       });
       
       this.el.addEventListener('raycaster-intersected-cleared', function(evt) {
           if(cabinTimer){
               clearTimeout(cabinTimer);
               for(var i=0;i<lights.length;i++) {
                   lights[i].emit('pause');
                   lights[i].emit('fadeIn');
               }
           }
       });  
    }
});