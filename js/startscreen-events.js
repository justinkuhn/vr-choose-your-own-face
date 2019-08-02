AFRAME.registerComponent('cursor-listener', {
          init: function () {
            var el = this.el;  
            //it would probably be good to replace this event with the event fired by a a cursor countdown
            el.addEventListener('fusing', function () {
                
                document.getElementById("mycursor").emit('changescene');
                document.getElementById('startButton').setAttribute('width',6);  
                document.getElementById('startButton').setAttribute('height',3);               
                var enterTime = setTimeout( function() {
                    //fade out
                var startObjects = document.getElementById('starters').children;
                for(var i=0;i<startObjects.length;i++) {
                       startObjects[i].emit('fadeOut');
                   }
                    setTimeout( function() {
                    //for state change
                el.sceneEl.emit('sceneSet', 'characters');  
                                    
                }, 2000);     
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
               
                var characte = document.getElementById('characters').children;
                for(var i=0;i<characte.length;i++) {
                       characte[i].emit('fadeOut');
                   }
                 setTimeout( function () {
                //send character to state
                el.sceneEl.emit('characterSet',el.id);
                el.sceneEl.emit('sceneSet', 'motive');  
                }, 2000);
            }, 2000);
            
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
                
                var motives = document.getElementById('motives').children;
                for(var i=0;i<motives.length;i++) {
                       motives[i].emit('fadeOut');
                   }
               setTimeout( function () {
                //send character to state
                el.sceneEl.emit('motiveSet',el.id);
                el.sceneEl.emit('sceneSet', 'cabin');  
            }, 2000);
            }, 2000);
            
        });
    }
});

