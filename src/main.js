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
    (async () => {
        const audioEngine = await BABYLON.CreateAudioEngineAsync(
            {
                // listenerEnabled: true,
                volume: 0.3
            }
        );
        audioEngine.listener.attach(xr.baseExperience.camera)
        const meow = await BABYLON.CreateSoundAsync("meow",
            "assets/meow-2kb.mp3",
            { spatialEnabled: true }
        );
        meow.spatial.coneInnerAngle = Math.PI / 4

        await audioEngine.unlockAsync();
        Cage.meow = meow
    })();
    xr.baseExperience.featuresManager.enableFeature(
        BABYLON.WebXRFeatureName.HAND_TRACKING, 
        "latest", 
        {
            xrInput: xr.input,
            jointMeshes: {
                disableDefaultHandMesh: true,
                invisible: true,
            },
        }
    );
    xr.baseExperience.camera.setTransformationFromNonVRCamera()
    const player = new Player(scene, xr);
    const cage = new Cage(scene);
    xr.baseExperience.sessionManager.onXRSessionInit.add(() => cage.beginArmSpawning(scene, player))
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