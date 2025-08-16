class Hand {
    #xrInputSource;
    #mesh;
    constructor(xrInputSource, scene) {
        this.#xrInputSource = xrInputSource;
        this.#mesh = BABYLON.MeshBuilder.CreateSphere("hand", {diameter: .1, segments: 8}, scene);
        this.#mesh.setParent(xrInputSource.grip);
    }
}