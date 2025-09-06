const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);
const scene = new BABYLON.Scene(engine);
const soundsManager = new GameSoundsManager();
Cage.meow = soundsManager.meow;
Cage.soundsManager = soundsManager;
const xr = setUpXR(scene)
const createScene = async function () {
    const camera = new BABYLON.FreeCamera("initialCam", new BABYLON.Vector3(0, 0, 0), scene);
    camera.attachControl(canvas, true);
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    const xrHelper = await xr
    const player = new Player(scene, xrHelper);
    const cage = new Cage(scene);
    xrHelper.baseExperience.onStateChangedObservable.add(async (state) => {
        switch (state) {
            case BABYLON.WebXRState.IN_XR: // noticing that I get spatial audio when I exit, then re-enter the session
                cage.beginArmSpawning(scene, player)
        }
    })
    xrHelper.baseExperience.sessionManager.onXRFrameObservable.add(async () => {
    })
    xrHelper.baseExperience.sessionManager.onXRSessionInit.add(async (session) => {
        session.addEventListener('visibilitychange', async () => {
            console.log(session.visibilityState)
        })
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