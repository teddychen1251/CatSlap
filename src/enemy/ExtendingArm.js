class ExtendingArm {
    scene;
    node;
    arm;
    player;
    #paw;
    updater;
    soundsManager;
    speedMultiplier;
    constructor(scene, player, soundsManager, speedMultiplier) {
        this.speedMultiplier = speedMultiplier;
        this.soundsManager = soundsManager;
        this.scene = scene;
        this.player = player;
        this.node = new BABYLON.TransformNode("extendingArm", scene)

        const armHeight = 0.1
        this.arm = BABYLON.MeshBuilder.CreateCylinder(
            "arm", 
            {
                diameter: 0.16, 
                height: armHeight,
            },
            scene
        );
        this.arm.setPivotPoint(new BABYLON.Vector3(0, -armHeight / 2, 0))
        this.arm.position.y = armHeight / 2
        this.arm.setParent(this.node)
        const material = new BABYLON.StandardMaterial("pawMat", scene);
        material.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1);
        this.arm.material = material

        const pawPositionNode = new BABYLON.TransformNode("pawPosNode", scene)
        pawPositionNode.position.y = armHeight
        pawPositionNode.setParent(this.node)

        this.#paw = new Paw(scene);

        this.updater = scene.onBeforeRenderObservable.add(() => {
            this.#paw.mesh.position = pawPositionNode.absolutePosition
            this.node.scaling.y += 0.1 * speedMultiplier;
            if (this.#paw.mesh.intersectsMesh(this.player.bodyMesh, false)) {
                this.destroy();
                this.player.registerHit(this.#paw.mesh.position);
            } else {
                for (let hand of player.hands) {
                    if (hand.blocks(this.#paw)) {
                        this.soundsManager.playBlock(hand.mesh.position);
                        this.destroy();
                        break;
                    }
                }
            }
        })
    }

    spawnAndPoint(spawnPosition, pointPosition) {
        this.node.position = spawnPosition
        this.node.lookAt(
            pointPosition,
            0,
            Math.PI / 2
        )
        return this
    }

    destroy() {
        this.#paw.destroy();
        this.arm.dispose();
        this.scene.onBeforeRenderObservable.remove(this.updater);
    }
}