class Cage {
    static #height = 2
    static #diameter = 3
    static #spawnPaceMs = 3000
    soundsManager;
    mesh;

    constructor(scene, soundsManager) {
        this.mesh = BABYLON.MeshBuilder.CreateCylinder(
            "cage", 
            {
                height: Cage.#height,
                diameter: Cage.#diameter,
                sideOrientation: BABYLON.Mesh.BACKSIDE,
            }, 
            scene,
        );
        this.mesh.position.y = 1;
        this.soundsManager = soundsManager;
    }

    beginArmSpawning(scene, player) {
        let lastSpawnTime = performance.now()
        scene.onBeforeRenderObservable.add(() => {
            if (performance.now() - lastSpawnTime >= Cage.#spawnPaceMs) {
                const spawn = this.randomWallPoint()
                const arm = this.spawnArm(scene, spawn, player.bodyPosition)
                this.soundsManager.playMeow(spawn);
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