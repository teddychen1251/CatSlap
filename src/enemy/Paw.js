class Paw {
    static radius = 0.1;
    mesh;
    constructor(scene) {
        const material = new BABYLON.StandardMaterial("pawMat", scene);
        material.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1);
        this.mesh = BABYLON.MeshBuilder.CreateSphere("paw", {diameter: 2 * Paw.radius, segments: 8}, scene);
        this.mesh.material = material;
    }

    destroy() {
        this.mesh.dispose()
    }

    position() {
        return this.mesh.position;
    }
}