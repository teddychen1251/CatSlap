class ExtendingArm {
    #node;
    #arm;
    #paw;
    constructor(scene) {
        this.#node = new BABYLON.TransformNode("extendingArm", scene)

        const armHeight = 0.1
        this.#arm = BABYLON.MeshBuilder.CreateCylinder(
            "arm", 
            {
                diameter: 0.16, 
                height: armHeight,
            },
            scene
        );
        this.#arm.setPivotPoint(new BABYLON.Vector3(0, -armHeight / 2, 0))
        this.#arm.position.y = armHeight / 2
        this.#arm.setParent(this.#node)
        const material = new BABYLON.StandardMaterial("pawMat", scene);
        material.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1);
        this.#arm.material = material

        const pawPositionNode = new BABYLON.TransformNode("pawPosNode", scene)
        pawPositionNode.position.y = armHeight
        pawPositionNode.setParent(this.#node)

        this.#paw = new Paw(scene);

        this.#node.position = new BABYLON.Vector3(0, 1, .5)
        scene.onBeforeRenderObservable.add(() => {
            this.#paw.mesh.position = pawPositionNode.absolutePosition
            this.#node.scaling.y += 0.01
        })
    }
}