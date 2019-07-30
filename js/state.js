//what an action looks like
//AFRAME.scenes[0].emit('increaseScore', {points: 50});
function allTrue(object) { 
            for (var i in object) {
                if (!object[i]) return false;
            }
            return true;
        }

var sceneData = {
        startScreen: {
          objects: 
              [
            'cabinButton','startButton','titleButton'
         ]
        },
        characters: {
            objects: [
                'who', 'outcastText', 'adventurerText', 'azure-image', 'olive-image'
            ]
        },
        motive: {
            objects: [
                'why', 'erase', 'zombie', 'hologram'
            ]
        },
        cabin: {
            objects: [
                'cabin-placeholder', 'book', 'door'
            ]
        },
        forest: {
            objects: [
                'who', 'outcastText', 'adventurerText', 'azure-image', 'olive-image'
            ]
        },
        death: {
            objects: [
                'who', 'outcastText', 'adventurerText', 'azure-image', 'olive-image'
            ]
        }
    };

var itemsData = {
    erase: ['termite queen','fermented fruit','mushroom'],
    zombie: ['poop','bleeding heart','fang'],
    hologram: ['bug exoskeleton','ghostly moss','dandelion']
}


AFRAME.registerState({
  initialState: {
//    only numbers strings and booleans for state, unless we use bind for
      scene: 'startScreen',
      objects: [
        'cabinButton',
        'startButton',
        'titleButton'
      ],
      itemsToCollect: {
          blueCone: false,
          redBox: false,
          mushroom: false
      },
      itemsCollected: false,
      bookRead: false,
      character: "",
      motive: "",
      gamesPlayed: 0
  },
 
  handlers: {
      
     // This is emitted by the environment-changer component.
    // The environment to change to is passed by the event detail.
    sceneSet: function (state, scene) {

        //this doesn't do anything right now because nothing can fade out if it's invisible already
        for(var i=0; i<state.objects.length; i++){
            document.getElementById(state.objects[i]).emit('fadeOut');
        }
        //timeout
        //change scene
      
        
            
            
            for(var i=0; i<state.objects.length; i++){
                document.getElementById(state.objects[i]).setAttribute('scale',{x:0,y:0,z:0});
            }
            state.scene = scene;
        
         
        if(scene == 'forest') {
            document.getElementById('light1').setAttribute('intensity',1);
            document.getElementById('light2').setAttribute('intensity',1);
            document.getElementById('youdied').setAttribute('opacity',0);
        } else if(scene == 'startScreen') {
            
        }
       
    },
      
      characterSet: function(state, character) {
          if(character.includes('azure')){
              state.character = 'azure';
          } else if (character.includes('olive')){
              state.character = 'olive';
          }
      },
      
      motiveSet: function(state, motive) {
          
          state.motive = motive;
          
          if(motive == 'erase'){
              for(var i=0;i<itemsData.erase.length;i++){
                  state.itemsToCollect[itemsData.erase[i]] = false;
              } 
          } else if(motive == 'zombie') {
              for(var i=0; i<itemsData.zombie.length; i++){
                  state.itemsToCollect[itemsData.zombie[i]] = false;
              }
          } else if(motive == 'hologram') {
              for(var i=0; i<itemsData.hologram.length;i++) {
                  state.itemsToCollect[itemsData.hologram[i]] = false;
              }
          }
          console.log(state.itemsToCollect)
      },
      
      bookRead: function(state, bool) { state.bookRead = bool; },
      
      itemCollected: function(state, item) {
          state.itemsToCollect[item] = true;
          
          if(allTrue(state.itemsToCollect)) {
              state.itemsCollected = true;
          }
      },
      
      updateProgress: function(state) {
            var totalItems = Object.keys(state.itemsToCollect).length;
            //update theta length based on fraction
            var numberCollected = 0;
            
            for(var item in state.itemsToCollect){
                if(state.itemsToCollect[item]) numberCollected++; 
            }
            

            document.getElementById('progress-bar').setAttribute('geometry', {thetaLength: (numberCollected/totalItems * 360)})                     
      },
      
      completedGame: function(state) {
          state.itemsCollected = false;
          state.bookRead = false;
          state.gamesPlayed++;
            
        if(state.gamesPlayed == 6){
            //play credits
            //state.scene == 'credits';
        } else {
            state.scene = 'startScreen';
        }
      }
  },
    computeState: function (state) {
        //get data for current scene from object
        var currentData = sceneData[state.scene];
 
        document.getElementById("mycursor").setAttribute('geometry',{'radius':0.02});
        
        state.objects = [];
        for(var i = 0; i < currentData.objects.length; i++) {
            state.objects.push(currentData.objects[i]);
            var currentObj = document.getElementById(currentData.objects[i]);
            //to prevent objects from rescaling
            if(currentData.scene != 'forest' || 'cabin' || 'death')
            currentObj.setAttribute('scale',{x:1,y:1,z:1});
            console.log(currentObj);
            currentObj.emit('fadeIn');
        }
        
        
        
    }
});