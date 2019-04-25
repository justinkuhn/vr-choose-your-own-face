AFRAME.registerComponent('cursor-listener', {
          init: function () {
            var el = this.el;  
            //it would probably be good to replace this event with the event fired by a a cursor countdown
            el.addEventListener('fusing', function (evt) {
                
                document.querySelector("#mycursor").emit('changescene');
                
                console.log(evt.detail.intersection.face);
                console.log(evt.detail.intersection.indices);
                console.log(evt.detail.intersection.object);
                
                var enterTime = setTimeout( function() {
                
                    
                document.querySelector('#startButton').emit('fadeEvent');
                document.querySelector('#titleButton').emit('fadeEvent');
                document.querySelector('#cabinButton').emit('fadeEvent');
                    
                    setTimeout( function() {
                    
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

                    }, 2000);
                    
                }, 2000);
                
               el.addEventListener('mouseleave',function() {
                  clearTimeout(enterTime);
                  document.getElementById("mycursor").setAttribute('geometry',{'radius':0.02});
                });
            });
           
          }
        });
