class Player {
    static #bodyLocalOffset = new BABYLON.Vector3(0, .45, 0.075)
    #headCamera;
    bodyMaterial;
    bodyMesh;
    hands = [];
    lives = 3;
    xr;
    soundsManager;
    constructor(scene, xr, soundsManager) {
        this.soundsManager = soundsManager;
        this.xr = xr;
        this.#headCamera = xr.baseExperience.camera;
        this.bodyMaterial = new BABYLON.StandardMaterial("bodyMat", scene);
        this.bodyMaterial.diffuseColor = new BABYLON.Color3(1, 1, 1);
        this.bodyMesh = BABYLON.MeshBuilder.CreateCapsule(
            "playerBody", 
            {
                height: 0.6,
                radius: .2,
            }, 
            scene
        ); 
        this.bodyMesh.material = this.bodyMaterial;
        scene.onBeforeRenderObservable.add(() => {
            const headRotationY = this.#headCamera.rotationQuaternion.toEulerAngles().y
            const bodyOffset = Player.#bodyLocalOffset
                .applyRotationQuaternion(BABYLON.Quaternion.FromEulerAngles(0, headRotationY, 0))
            this.bodyMesh.position = this.#headCamera.position.subtract(bodyOffset);
        })
        xr.input.onControllerAddedObservable.add(controllerInputSource => {
            this.hands.push(new Hand(controllerInputSource, scene));
        });

    }

    registerHit(position) {
        this.soundsManager.playHitHurt(position);
        this.lives--;
        if (this.lives <= 0) {
            this.xr.baseExperience.exitXRAsync();
        }
        // make animation for color
        this.bodyMaterial.diffuseColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
    }

    get headPosition() {
        return this.#headCamera.position
    }
    get bodyPosition() {
        return this.bodyMesh.position
    }
}