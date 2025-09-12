const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);
const scene = new BABYLON.Scene(engine);
const soundsManager = new GameSoundsManager();
const xrPromise = setUpXR(scene)
const createScene = async function () {
    scene.clearColor = new BABYLON.Color3(0, 0, 0);
    scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
    scene.fogColor = new BABYLON.Color3(0.11, 0.11, 0.11);
    const skyBox = BABYLON.MeshBuilder.CreateBox("skyBox", {
        size: 100,
        sideOrientation: BABYLON.Mesh.BACKSIDE,
    }, scene);
    const skyBoxMat = new BABYLON.StandardMaterial("skyMat", scene);
    skyBoxMat.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1);
    skyBox.material = skyBoxMat;
    const camera = new BABYLON.FreeCamera("initialCam", new BABYLON.Vector3(0, 0, 0), scene);
    camera.attachControl(canvas, true);
    const ambientLight = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    ambientLight.intensity = 0.1;
    const pointLight = new BABYLON.PointLight("light", new BABYLON.Vector3(0, 1.7, 0), scene);
    pointLight.intensity = 0.5;
    const ground = BABYLON.MeshBuilder.CreateGround("ground", {
        width: 100,
        height: 100,
    }, scene);
    const groundMat = new BABYLON.StandardMaterial("groundMat", scene);
    groundMat.diffuseColor = new BABYLON.Color3(0.651, 0.482, 0.357);
    ground.material = groundMat;
    ground.position.y = -0.0001;
    const xr = await xrPromise
    const player = new Player(scene, xr, soundsManager);
    const cage = new Cage(scene, soundsManager, player);
    xr.baseExperience.sessionManager.onXRFrameObservable.add(() => {
        soundsManager.updateListener(xr.baseExperience.camera);
    });
    xr.baseExperience.onStateChangedObservable.add(async (state) => {
        switch (state) {
            case BABYLON.WebXRState.IN_XR:
                cage.beginArmSpawning(scene, player)
        }
    });
    addEventListener("player_died", () => cage.stopSpawning(scene));
    return scene;
};
createScene().then(scene => {
    engine.runRenderLoop(() => scene.render());
})
// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
    engine.resize();
});