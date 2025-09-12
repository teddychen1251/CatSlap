class Cage {
    static #height = 2;
    static #diameter = 3;
    static #barDiameter = 0.1;
    static #spawnPaceMs = 3000
    static #barCount = 24;
    soundsManager;
    mesh;
    player;
    spawning;

    constructor(scene, soundsManager, player) {
        this.player = player;
        this.material = new BABYLON.StandardMaterial("cageMat", scene);
        this.material.diffuseColor = new BABYLON.Color3(0.7, 0.7, 0.7); 
        const cageBottom = BABYLON.MeshBuilder.CreateDisc("cageBottom", {
            radius: Cage.#diameter / 2,
        }, scene);
        cageBottom.rotation.x = Math.PI / 2;
        cageBottom.material = this.material;
        const cageTop = cageBottom.clone("cageTop");
        cageTop.rotation.x = -Math.PI / 2;
        cageTop.position.y = Cage.#height;
        cageTop.material = this.material;
        const cageBar = BABYLON.MeshBuilder.CreateCylinder("bar0", {
            height: 2,
            diameter: Cage.#barDiameter,
        }, scene);
        cageBar.material = this.material;
        const maxCageBarOffset = Cage.#diameter / 2 - (Cage.#barDiameter / 2); 
        cageBar.position.y = 1;
        cageBar.position.z = maxCageBarOffset;
        for (let bar = 1; bar < Cage.#barCount; bar++) {
            const newBar = cageBar.clone("bar" + bar);
            newBar.position.z = maxCageBarOffset * Math.cos(bar * 2 * Math.PI / Cage.#barCount);
            newBar.position.x = maxCageBarOffset * Math.sin(bar * 2 * Math.PI / Cage.#barCount);
        }
        
        this.soundsManager = soundsManager;
    }

    beginArmSpawning(scene, player) {
        let lastSpawnTime = performance.now()
        this.spawning = scene.onBeforeRenderObservable.add(() => {
            if (performance.now() - lastSpawnTime >= Cage.#spawnPaceMs) {
                const spawn = this.randomWallPoint()
                const arm = this.spawnArm(scene, spawn, player.bodyPosition)
                this.soundsManager.playMeow(spawn);
                lastSpawnTime = performance.now()
            }
        })
    }
    
    stopSpawning(scene) {
        scene.onBeforeRenderObservable.remove(this.spawning);
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
        return new ExtendingArm(scene, this.player, this.soundsManager).spawnAndPoint(
            spawnPoint,
            playerPosition,
        )
    }
}