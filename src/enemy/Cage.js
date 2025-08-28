class Cage {
    static #height = 2
    static #diameter = 3
    static #spawnPaceMs = 3000
    static meow;
    mesh;

    constructor(scene) {
        this.mesh = BABYLON.MeshBuilder.CreateCylinder(
            "cage", 
            {
                height: Cage.#height,
                diameter: Cage.#diameter,
                sideOrientation: BABYLON.Mesh.BACKSIDE,
            }, 
            scene,
        );
        this.mesh.position.y = 1
    }

    beginArmSpawning(scene, player) {
        let lastSpawnTime = performance.now()
        let boomBox = BABYLON.MeshBuilder.CreateBox(
            "boomBox", 
            {
                size: 0.2,
            }, 
            scene,
        );
        boomBox.position = new BABYLON.Vector3(1, 1, 1)
        scene.onBeforeRenderObservable.add(() => {
            if (Cage.meow === undefined) return
            if (performance.now() - lastSpawnTime >= Cage.#spawnPaceMs) {
                const arm = this.spawnArm(scene, player.bodyPosition)
                Cage.meow.spatial.attach(arm.arm)
                Cage.meow.play()
                lastSpawnTime = performance.now()
            }
        })
    }

    spawnArm(scene, playerPosition, maxOffsetX, maxOffsetY, maxOffsetZ) {
        // pick point on cage wall
        const angle = Math.random() * 2 * Math.PI;
        const height = Math.random() * Cage.#height;
        return new ExtendingArm(scene).spawnAndPoint(
            new BABYLON.Vector3(
                Math.cos(angle) * Cage.#diameter / 2,
                height,
                Math.sin(angle) * Cage.#diameter / 2,
            ),
            playerPosition,
        )
    }
}