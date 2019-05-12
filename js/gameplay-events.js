

var ingredients = {
    blueCone: false,
    redBox: false   
}



    let cameraPosition = { x: 0, y: 1.6, z: 0 }
    var elementInitialPositions = {}
    
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
        let elPos = el.getAttribute('position')
        let cpv = new THREE.Vector3(cameraPosition.x, cameraPosition.y, cameraPosition.z, 'XYZ')
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
        
          //cameraPosition = document.getElementById('camera').getAttribute('position');
            
           

            
            el.setAttribute('animation__pos', {
                property: 'position',
                to: cameraPosition,
                dur: 5000,
                easing: 'easeInOutCubic'
            });

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

            let camera = document.querySelector("[camera]").getObject3D('camera')

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
        var position = new THREE.Vector3();
        var rotation = new THREE.Euler();


        this.el.object3D.getWorldPosition(position);
        this.el.object3D.getWorldQuaternion(rotation);

//        console.log(position);
//        console.log(rotation);
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