class Player {
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
        const bodyClone = this.#bodyMesh.clone();
        scene.onBeforeRenderObservable.add(() => {
            this.#bodyMesh.rotation.y = this.#headCamera.rotationQuaternion.toEulerAngles().y;
            this.#bodyMesh.position = this.#headCamera.position.subtract(new BABYLON.Vector3(0, .45, 0.075));
            bodyClone.position = this.#bodyMesh.position.add(new BABYLON.Vector3(0, 0, 0.5))
        })
        xr.input.onControllerAddedObservable.add(controllerInputSource => {
            this.#hands.push(new Hand(controllerInputSource, scene));
        });

    }

    get headPosition() {
        return this.#headCamera.position
    }
}