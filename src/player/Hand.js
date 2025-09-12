class Hand {
    static radius = 0.05;
    #xrInputSource;
    mesh;
    constructor(xrInputSource, scene, material) {
        this.#xrInputSource = xrInputSource;
        this.mesh = BABYLON.MeshBuilder.CreateSphere("hand", {diameter: 2 * Hand.radius, segments: 8}, scene);
        this.mesh.setParent(xrInputSource.grip);
        this.mesh.material = material;
    }

    blocks(paw) {
        return BABYLON.Vector3.Distance(this.#xrInputSource.grip.position, paw.position()) < (Hand.radius + Paw.radius);
    }
}