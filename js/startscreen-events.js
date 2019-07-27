AFRAME.registerComponent('cursor-listener', {
          init: function () {
            var el = this.el;  
            //it would probably be good to replace this event with the event fired by a a cursor countdown
            el.addEventListener('fusing', function () {
                
                document.getElementById("mycursor").emit('changescene');
                document.getElementById('startButton').setAttribute('width',6);  
                document.getElementById('startButton').setAttribute('height',3);               
                var enterTime = setTimeout( function() {
                    //for state change
                el.sceneEl.emit('sceneSet', 'characters');  
                                    
                }, 2000);
            });
           
          }
        });


AFRAME.registerComponent('character-handler', {
    init: function () {
       //send changescene to cursor
        //emit link-event
        var el = this.el;

        el.addEventListener('fusing', function () { 
            document.getElementById("mycursor").emit('changescene');
            setTimeout( function () {
                //send character to state
                el.sceneEl.emit('characterSet',el.id);
                el.sceneEl.emit('sceneSet', 'motive');  
            }, 2000)
            
        });
    }
});

AFRAME.registerComponent('motive-handler', {
    init: function () {
       //send changescene to cursor
        //emit link-event
        var el = this.el;
        el.addEventListener('fusing', function () { 
            document.getElementById("mycursor").emit('changescene');
            setTimeout( function () {
                //send character to state
                el.sceneEl.emit('motiveSet',el.id);
                el.sceneEl.emit('sceneSet', 'cabin');  
            }, 2000)
            
        });
    }
});

