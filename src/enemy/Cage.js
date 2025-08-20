class Cage {
    mesh;

    constructor(scene) {
        this.mesh = BABYLON.MeshBuilder.CreateCylinder(
            "cage", 
            {
                height: 2,
                diameter: 3,
                sideOrientation: BABYLON.Mesh.BACKSIDE,
            }, 
            scene,
        );
        this.mesh.position.y = 1
    }
}