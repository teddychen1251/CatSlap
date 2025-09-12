class Cage {
    static #height = 2;
    static #diameter = 3;
    static #barDiameter = 0.1;
    static #maxSpawnPaceMs = 3000;
    static #minSpawnPaceMs = 2000;
    static #barCount = 24;
    static #difficultyCurve = [
        [10, [1800, 2800]],
        [20, [1500, 2200]],
        [30, [1200, 1900]],
        [40, [800, 1400]],
        [50, [400, 1000]],
    ].reverse();
    soundsManager;
    mesh;
    player;
    spawning;
    difficulty = 1;
    spawnedCount = 0;
    nextSpawnInterval = Cage.#maxSpawnPaceMs;

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
            if (performance.now() - lastSpawnTime >= this.nextSpawnInterval) {
                const spawn = this.randomWallPoint()
                const arm = this.spawnArm(scene, spawn, player.bodyPosition)
                this.spawnedCount++;
                this.setDifficulty();
                this.nextSpawnInterval = Math.random() * (Cage.#maxSpawnPaceMs - Cage.#minSpawnPaceMs) + Cage.#minSpawnPaceMs;
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
        return new ExtendingArm(scene, this.player, this.soundsManager, this.difficulty).spawnAndPoint(
            spawnPoint,
            playerPosition,
        )
    }

    setDifficulty() {
        for (let level of Cage.#difficultyCurve) {
            if (this.spawnedCount >= level[0]) {
                Cage.#minSpawnPaceMs = level[1][0];
                Cage.#maxSpawnPaceMs = level[1][1];
                break;
            }
        }
    }
}