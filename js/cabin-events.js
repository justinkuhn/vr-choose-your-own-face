
 AFRAME.registerComponent('tractor-beam-book', {
      schema: {},

      init: function() {
        var el = this.el;
        el.addEventListener("raycaster-intersected", handler, true);
        el.addEventListener('raycaster-intersected-cleared', function h(e) {
          el.removeEventListener('raycaster-intersected', handler, true)
          el.removeEventListener('raycaster-intersected-cleared', h)
        }.bind(this))
    
          el.addEventListener('click', function () {
              el.sceneEl.emit('bookRead',true)
          });
          
        function handler() {
        
          position = document.getElementById('camera').getAttribute('position');
            
            el.setAttribute('animation__pos', {
                property: 'position',
                to: {x:position.x,y:position.y,z:position.z-1},
                dur: 5000,
                easing: 'easeInOutCubic'
            });
       
          }
      }
    });

AFRAME.registerComponent('exit-handler', {
    init: function () {
       //send changescene to cursor
        //emit link-event
        var el = this.el;
        
        el.addEventListener('fusing', function () {
            document.getElementById("mycursor").emit('changescene');
            setTimeout( function () {
                //send character to state
                el.emit('open');
                el.emit('move');
                el.sceneEl.emit('sceneSet', 'forest');  
            }, 2000)
            
        });
    }
});

AFRAME.registerComponent('death-interaction', {
  init: function() {
    var el = this.el;
      
    el.addEventListener("raycaster-intersected", deathhandler, true);
    el.addEventListener("raycaster-intersection-cleared", function() {
//      clear timeout
    })
    
    function deathhandler() {
//       turn on audio
      var death = document.getElementById('death-2');
      var camera = document.getElementById('camera');
    
      console.log("turning on audio...");
      death.components.sound.playSound();
      camera.components.sound.playSound();
      var lights = document.getElementById('death-lights').children;
      // wait until audio is finished
      death.addEventListener("sound-ended", function() {
          console.log("completed game");
        for(var i=0;i<lights.length;i++) {
               lights[i].emit('fadeOut');
           }
        //      fade out and return to start screen
        setTimeout( function() {
            el.sceneEl.emit('completedGame');
        }, 2000)
      });
      
    }
  }
  
});