class Player {
    static diedEventId = "player_died";
    static #bodyLocalOffset = new BABYLON.Vector3(0, .45, 0.075);
    static materialColor = new BABYLON.Color3(1, 1, 1);
    #headCamera;
    bodyMaterial;
    bodyMesh;
    hands = [];
    lives = 3;
    xr;
    soundsManager;
    #flashing = null;
    constructor(scene, xr, soundsManager) {
        this.soundsManager = soundsManager;
        this.xr = xr;
        this.#headCamera = xr.baseExperience.camera;
        this.bodyMaterial = new BABYLON.StandardMaterial("bodyMat", scene);
        this.bodyMaterial.diffuseColor = Player.materialColor;
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
            this.hands.push(new Hand(controllerInputSource, scene, this.bodyMaterial));
        });

    }

    registerHit(position) {
        this.soundsManager.playHitHurt(position);
        this.lives--;
        if (this.lives <= 0) {
            dispatchEvent(new Event(Player.diedEventId));
            this.xr.baseExperience.exitXRAsync();
        }
        this.#flashHit();
    }

    #flashHit() {
        if (this.#flashing != null) {
            clearInterval(this.#flashing);
            this.bodyMaterial.diffuseColor = Player.materialColor;
        }
        let count = 0;
        let limit = 3;
        this.#flashing = setInterval(
            () => {
                if (this.bodyMaterial.diffuseColor.equals(Player.materialColor)) {
                    this.bodyMaterial.diffuseColor = new BABYLON.Color3(1, 0.2, 0.2);
                } else {
                    this.bodyMaterial.diffuseColor = Player.materialColor;
                    count++;
                }
                if (count >= limit) {
                    clearInterval(this.#flashing);
                    this.#flashing = null;
                }
            },
            167,
        )
    }

    get headPosition() {
        return this.#headCamera.position
    }
    get bodyPosition() {
        return this.bodyMesh.position
    }
}