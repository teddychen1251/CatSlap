class Player {
    static #bodyLocalOffset = new BABYLON.Vector3(0, .45, 0.075)
    #headCamera;
    #bodyMesh;
    #hands = [];
    constructor(scene, xr) {
        this.#headCamera = xr.baseExperience.camera;
        this.#bodyMesh = BABYLON.MeshBuilder.CreateBox(
            "playerBody", 
            {
                height: 0.6,
                width: .35,
                depth: .1,
            }, 
            scene
        ); 
        scene.onBeforeRenderObservable.add(() => {
            const headRotationY = this.#headCamera.rotationQuaternion.toEulerAngles().y
            this.#bodyMesh.rotation.y = headRotationY;
            const bodyOffset = Player.#bodyLocalOffset
                .applyRotationQuaternionInPlace(BABYLON.Quaternion.FromEulerAngles(0, headRotationY, 0))
            this.#bodyMesh.position = this.#headCamera.position.subtract(bodyOffset);
        })
        xr.input.onControllerAddedObservable.add(controllerInputSource => {
            this.#hands.push(new Hand(controllerInputSource, scene));
        });

    }

    get headPosition() {
        return this.#headCamera.position
    }
}