
 AFRAME.registerComponent('tractor-beam-book', {
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
                to: {x:position.x,y:position.y,z:position.z-1},
                dur: 5000,
                easing: 'easeInOutCubic'
            });
          
          el.emit('open');

          }
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
      var deathSound = document.getElementById('death-sound');
      var playerSound = document.getElementById('azure-sound');
      console.log(deathSound);
      console.log("turning on audio...");
      deathSound.play();
      playerSound.play();
      // wait until audio is finished
      deathSound.addEventListener("stopped", function() {
        
        //      fade out and return to start screen
        window.location.href ='index.html';
      });
      
    }
  }
  
});


// Things to do:

// 1. allow door to be opened once book is opened and closed
// 2. closing animation for book
// 3. lighting control
// 4. populate book with recipe items