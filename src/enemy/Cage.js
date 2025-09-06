class Cage {
    static #height = 2
    static #diameter = 3
    static #spawnPaceMs = 3000
    static meow;
    static soundsManager;
    initializedSounds = false
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
                const spawn = this.randomWallPoint()
                const arm = this.spawnArm(scene, spawn, player.bodyPosition)
                // Cage.meow.spatial.attach(arm.node)
                if (soundsManager.context.state == "suspended") {
                    soundsManager.context.resume();
                }
                Cage.meow.play()
                lastSpawnTime = performance.now()
            }
        })
    }

    randomWallPoint() {
        // pick point on cage wall
        const angle = Math.random() * 2 * Math.PI;
        const height = Math.random() * Cage.#height;
        return new BABYLON.Vector3(
            Math.cos(angle) * Cage.#diameter / 2,
            height,
            Math.sin(angle) * Cage.#diameter / 2,
        )
    }

    spawnArm(scene, spawnPoint, playerPosition, maxOffsetX, maxOffsetY, maxOffsetZ) {
        return new ExtendingArm(scene).spawnAndPoint(
            spawnPoint,
            playerPosition,
        )
    }
}