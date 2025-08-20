const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);
const createScene = async function () {
    const scene = new BABYLON.Scene(engine);
    const camera = new BABYLON.FreeCamera("initialCam", new BABYLON.Vector3(0, 0, 0), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    const xr = await scene.createDefaultXRExperienceAsync({
        disablePointerSelection: true,
        inputOptions: { doNotLoadControllerMeshes: true },
    });
    xr.baseExperience.camera.setTransformationFromNonVRCamera()
    const player = new Player(scene, xr);
    const cage = new Cage(scene);
    return scene;
};
const scene = createScene();
createScene().then(scene => {
    engine.runRenderLoop(() => scene.render());
})
// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
    engine.resize();
});