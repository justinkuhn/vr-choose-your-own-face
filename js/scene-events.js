
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
        }
        function fadeIn() {
            el.setAttribute('animation__in', {
                property: 'light.color',
                to: '#FFF',
                dur: 2000,
                easing: 'easeInOutQuad',
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
    }
});

AFRAME.registerComponent('cabin-listener', {
    init: function() {
        //listen for intersection by player
        //if the player had collected all items link to the cabin
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

       
       this.el.addEventListener('raycaster-intersected', function(evt) {
           var gameObjects = document.getElementById('gameplay-objects').children;
           for(var i=0;i<gameObjects.length;i++) {
                   gameObjects[i].emit('fadeOut');
               }
           
           
            teleportTimer = setTimeout( function() {
               
                camera.setAttribute('position', {x:10,y:1.6,z:0});
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
   } 
});