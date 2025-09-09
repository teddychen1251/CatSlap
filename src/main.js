const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);
const scene = new BABYLON.Scene(engine);
const soundsManager = new GameSoundsManager();
const xrPromise = setUpXR(scene)
const createScene = async function () {
    const camera = new BABYLON.FreeCamera("initialCam", new BABYLON.Vector3(0, 0, 0), scene);
    camera.attachControl(canvas, true);
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    const xr = await xrPromise
    const player = new Player(scene, xr);
    const cage = new Cage(scene, soundsManager, player);
    xr.baseExperience.sessionManager.onXRFrameObservable.add(() => {
        soundsManager.updateListener(xr.baseExperience.camera);
    });
    xr.baseExperience.onStateChangedObservable.add(async (state) => {
        switch (state) {
            case BABYLON.WebXRState.IN_XR:
                cage.beginArmSpawning(scene, player)
        }
    })
    return scene;
};
createScene().then(scene => {
    engine.runRenderLoop(() => scene.render());
})
// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
    engine.resize();
});