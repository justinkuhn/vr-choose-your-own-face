 const cameraPosition = { x: 0, y: 1.6, z: 0 }
    var elementInitialPositions = {}

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

      handler: function(event) {
        let cameraString = String(cameraPosition.x) + ' ' + String(cameraPosition.y) + ' ' + String(cameraPosition.z)
        let animation = document.createElement('a-animation');
        animation.setAttribute('attribute', 'position');
        animation.setAttribute('to', cameraString);
        animation.setAttribute('dur', '5000');
        animation.setAttribute('fill', 'forwards');
        setTimeout(function(){ 
          console.log(document.getElementById('camera').getAttribute('rotation')) }, 5000);

        event.target.appendChild(animation)
      },

      init: function() {
        var el = this.el
        el.addEventListener("mouseenter", this.handler, true);
        el.addEventListener('mouseleave', function h(e) {
          el.removeEventListener('mouseenter', this.handler, true)
          el.removeEventListener('mouseleave', h)
        }.bind(this))
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
        let animation = document.createElement('a-animation');
        let that = this
        let _event = event

        animation.setAttribute('attribute', 'rotation');
        animation.setAttribute('to', toRotation);
        animation.setAttribute('dur', '5000');
        animation.setAttribute('fill', 'forwards');
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

        event.target.appendChild(animation)
      },

      init: function() {
        var el = this.el
        el.addEventListener("mouseenter", this.handler, true);
        el.addEventListener('mouseleave', function h(e) {
          el.removeEventListener('mouseenter', this.handler, true)
          el.removeEventListener('mouseleave', h)
        }.bind(this))
      }

    })