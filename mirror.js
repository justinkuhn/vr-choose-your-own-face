AFRAME.registerComponent('mirror', {
schema:{
    renderothermirror:{default:true},
},
init: function () {
    var scene = this.el.sceneEl;
    scene.addEventListener('render-target-loaded',this.OnRenderLoaded.bind(this));
},
OnRenderLoaded: function()
{
    var mirrorObj = this.el.getOrCreateObject3D('mesh',THREE.Mesh);
    var cameraEl = document.querySelector('a-entity[camera]')
    if(!cameraEl)
    {
        cameraEl = document.querySelector('a-camera');
    }
    var camera = cameraEl.components.camera.camera;
    var scene = this.el.sceneEl;
    this.renderer = scene.renderer;
    this.mirror = new THREE.Mirror( this.renderer, camera, { clipBias: 0.003, textureWidth: window.innerWidth, textureHeight: window.innerHeight, color: 0x777777 } );
    mirrorObj.material =this.mirror.material;
    mirrorObj.add(this.mirror);
},
tick: function () {
    if(!this.data.renderothermirror)
        {
            this.mirror.render();
        }
    else
        {
            var mirrors = [];
            var mirrorEls = document.querySelectorAll("a-entity[mirror]");
            for(var i=0;i<mirrorEls.length;i++)
            {
                if(mirrorEls[i]!=this.el)
                {
                    mirrors.push(mirrorEls[i].components.mirror.mirror);
                }   
            }
            if(mirrors.length === 0)
            {
                this.mirror.render();
            }
            for(var i = 0; i<mirrors.length;i++)
            {
                this.mirror.renderWithMirror(mirrors[i]);
            }
        }
}
});