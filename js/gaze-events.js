AFRAME.registerComponent('cursor-listener', {
          init: function () {
            var el = this.el;  
            //it would probably be good to replace this event with the event fired by a a cursor countdown
            el.addEventListener('fusing', function (evt) {
                
                document.getElementById("mycursor").emit('changescene');
                document.getElementById('startButton').setAttribute('width',6);  
                document.getElementById('startButton').setAttribute('height',3);
//                console.log(evt.detail.intersection.face);
//                console.log(evt.detail.intersection.indices);
//                console.log(evt.detail.intersection.object);
//                
                var enterTime = setTimeout( function() {
                
               
                document.querySelector('#startButton').emit('fadeEvent');
                document.querySelector('#titleButton').emit('fadeEvent');
                document.querySelector('#cabinButton').emit('fadeEvent');
                    
                    setTimeout( function() { 
                        
                    document.getElementById('startButton').setAttribute('scale',{x:0,y:0,z:0});
                    document.getElementById('titleButton').setAttribute('scale',{x:0,y:0,z:0}); 
                    document.getElementById('cabinButton').setAttribute('scale',{x:0,y:0,z:0});  
                    
                    document.getElementById('who').setAttribute('scale',{x:4,y:4,z:4});
                    document.getElementById('outcastText').setAttribute('scale',{x:2,y:2,z:2});
                    document.getElementById('adventurerText').setAttribute('scale',{x:2,y:2,z:2});
                    document.getElementById('azure-image').setAttribute('scale',{x:1,y:1,z:1});
                    document.getElementById('olive-image').setAttribute('scale',{x:1,y:1,z:1});    
                                    
                    document.querySelector('#who').emit('fadeIn');
                    document.querySelector('#outcastText').emit('fadeIn');
                    document.querySelector('#adventurerText').emit('fadeIn');
                    document.querySelector('#azure-image').emit('fadeIn');
                    document.querySelector('#olive-image').emit('fadeIn');

                    document.getElementById("mycursor").setAttribute('geometry',{'radius':0.02});
                    }, 2000);
                    
                }, 2000);
                
//               el.addEventListener('mouseleave',function() {
//                  clearTimeout(enterTime);
//                  document.getElementById("mycursor").setAttribute('geometry',{'radius':0.02});
//                document.getElementById('startButton').setAttribute('width',3);  
//                document.getElementById('startButton').setAttribute('height',1.5);
//                });
            });
           
          }
        });


AFRAME.registerComponent('link-handler', {
    init: function () {
       //send changescene to cursor
        //emit link-event
        var el = this.el;

        el.addEventListener('fusing', function () { 
            document.getElementById("mycursor").emit('changescene');
            var linkTime = setTimeout( function () {
                el.emit('link-event');
            }, 2000)
            
//            el.addEventListener('mouseleave',function() {
//                  clearTimeout(linkTime);
//                document.getElementById("mycursor").setAttribute('geometry',{'radius':0.02});
//                });
        });
    }
});

