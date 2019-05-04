
//positions to choose from for the camera
//these are the initial positions
var positions = {
    right: {
        x:20,y:1.6,z:0
    },
    left: {
        x:-18,y:1.6,z:-3
    },
    front: {
        x:-2,y:1.6,z:-21
    }
}
var itemsCollected = false;


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
        }, 1000);
        
        
        function fadeOut() {
          el.setAttribute('animation__out', {
                property: 'light.color',
                from: '#FFF',
                to: '#000',
                dur: 2000,
                easing: 'easeInOutQuad',
                startEvents: 'fadeOut',
                pauseEvents: 'pause'
            });
            document.getElementById('ambient').setAttribute('animation__out', {
                property: 'light.intensity',
                from: 0.2,
                to: 0,
                dur: 2000,
                startEvents: 'fadeOut',
                pauseEvents: 'pause'
            });
        }
        function fadeIn() {
            el.setAttribute('animation__in', {
                property: 'light.color',
                to: '#FFF',
                dur: 2000,
                easing: 'easeInOutQuad',
                startEvents: 'fadeIn'
            });
            var ambient =  document.getElementById('ambient')
            ambient.setAttribute('animation__in', {
                property: 'light.intensity',
                to: 0.2,
                dur: 2000,
                startEvents: 'fadeIn'
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
                   gameObjects[i].emit('fadeOut');
               }
           
          
            deathTimer = setTimeout( function() {
               
              //You Died animation or Title
              
                //link back to start screen
                window.location.href = 'index.html';
                
           }, 3000);
       });
       
       this.el.addEventListener('raycaster-intersected-cleared', function(evt) {
           if(deathTimer){
               clearTimeout(deathTimer);
               for(var i=0;i<gameObjects.length;i++) {
                   gameObjects[i].emit('pause');
                   gameObjects[i].emit('fadeIn');
               }
           }
           
       });
    }
});



AFRAME.registerComponent('teleporter', {
   init: function() {
       //listen for intersection with raycaster
       //start fade on intersection
       //after two seconds, change location of camera
       //fade in objects
       
       var teleportTimer;
       var gameObjects = document.getElementById('gameplay-objects').children;
       var camera = document.getElementById('camera');
       var el = this.el;

       
       this.el.addEventListener('raycaster-intersected', function(evt) {
           var gameObjects = document.getElementById('gameplay-objects').children;
           for(var i=0;i<gameObjects.length;i++) {
                   gameObjects[i].emit('fadeOut');
               }
           
           
            teleportTimer = setTimeout( function() {
                 
                //determine the position that the camera will go to based on the world quaternion
                
                if(el.id == 'teleporter-front') {
                    camera.setAttribute('position', positions.front);
                } else if (el.id == 'teleporter-left') {
                    camera.setAttribute('position', positions.left);
                } else {
                    camera.setAttribute('position', positions.right);
                }
                
                //determine which teleporter items will appear
                //set new teleporter objects position relative to camera position
                //set death position relative to camera position
                
                
               console.log(document.querySelector('#ambient').getAttribute('light.intensity'));  
                
               for(var i=0;i<gameObjects.length;i++) {
                   gameObjects[i].emit('fadeIn');
               }
                
           }, 2000);
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