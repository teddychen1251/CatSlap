const setUpXR = async (scene) => {
    const xr = await scene.createDefaultXRExperienceAsync({
        disablePointerSelection: true,
        inputOptions: { doNotLoadControllerMeshes: true },
    });
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
    return xr
}