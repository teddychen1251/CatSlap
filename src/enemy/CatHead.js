class CatHead {
    static headRadius = 0.45;
    static earRadius = 0.1;
    static earHeight = 0.25;
    static eyeRadius = 0.1;
    static pupilRadius = 0.01;
    static pupilHeight = this.eyeRadius;
    static noseRadius = 0.02;
    static jowlHeight = 0.04;
    static jowlDiameter = 0.008;
    static jowlNoseOffset = 0.05;
    static whiskerLen = 0.15;
    static whiskerDiameter = 0.002;
    headMesh;
    constructor(scene) {
        const headMaterial = new BABYLON.StandardMaterial("catHeadMat", scene);
        headMaterial.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1);
        this.headMesh = BABYLON.MeshBuilder.CreateSphere("catHead", {
            diameter: 2 * CatHead.headRadius, 
            segments: 16
        }, scene);
        this.headMesh.material = headMaterial;

        this.rightEarMesh = BABYLON.MeshBuilder.CreateCylinder("rightEar", {
            height: CatHead.earHeight,
            diameterTop: 0,
            diameterBottom: CatHead.earRadius * 2,
            tessellation: 64,
        }, scene);
        this.rightEarMesh.material = headMaterial;
        this.rightEarMesh.position.y = CatHead.headRadius + CatHead.earHeight / 3;
        this.rightEarMesh.parent = this.headMesh;
        this.leftEarMesh = this.rightEarMesh.clone("leftEar");
        this.leftEarMesh.position.y = CatHead.headRadius + CatHead.earHeight / 3;
        this.leftEarMesh.parent = this.headMesh;
        this.rightEarMesh.rotateAround(BABYLON.Vector3.Zero(), BABYLON.Vector3.Right(), Math.PI / 12);
        this.rightEarMesh.rotateAround(BABYLON.Vector3.Zero(), BABYLON.Vector3.Forward(), -Math.PI / 5);
        this.leftEarMesh.rotateAround(BABYLON.Vector3.Zero(), BABYLON.Vector3.Right(), Math.PI / 12);
        this.leftEarMesh.rotateAround(BABYLON.Vector3.Zero(), BABYLON.Vector3.Forward(), Math.PI / 5);

        const eyeMaterial = new BABYLON.StandardMaterial("catEyeMat", scene);
        eyeMaterial.emissiveColor = new BABYLON.Color3(0.9, 1.0, 0.2);
        this.rightEyeMesh = BABYLON.MeshBuilder.CreateSphere("rightEye", {
            diameter: 2 * CatHead.eyeRadius, 
            segments: 16
        }, scene);
        this.rightEyeMesh.material = eyeMaterial;
        this.rightEyeMesh.position.y = CatHead.headRadius;
        this.rightEyeMesh.parent = this.headMesh;
        this.leftEyeMesh = this.rightEyeMesh.clone("leftEye");
        this.leftEyeMesh.position.y = CatHead.headRadius;
        this.leftEyeMesh.parent = this.headMesh;
        this.rightEyeMesh.rotateAround(BABYLON.Vector3.Zero(), BABYLON.Vector3.Right(), Math.PI / 2.7);
        this.rightEyeMesh.rotateAround(BABYLON.Vector3.Zero(), BABYLON.Vector3.Forward(), -Math.PI / 3.5);
        this.leftEyeMesh.rotateAround(BABYLON.Vector3.Zero(), BABYLON.Vector3.Right(), Math.PI / 2.7);
        this.leftEyeMesh.rotateAround(BABYLON.Vector3.Zero(), BABYLON.Vector3.Forward(), Math.PI / 3.5);
        this.rightPupilMesh = BABYLON.MeshBuilder.CreateCapsule("rightPupil", {
            radius: CatHead.pupilRadius, 
            height: CatHead.pupilHeight,
            capSubdivisions: 1,
        }, scene);
        this.rightPupilMesh.material = headMaterial;
        this.rightPupilMesh.position.copyFrom(this.rightEyeMesh.absolutePosition);
        this.rightPupilMesh.position.z += CatHead.eyeRadius;
        this.rightPupilMesh.parent = this.headMesh;
        this.leftPupilMesh = this.rightPupilMesh.clone("leftPupil");
        this.leftPupilMesh.position.copyFrom(this.leftEyeMesh.absolutePosition);
        this.leftPupilMesh.position.z += CatHead.eyeRadius;

        const noseMaterial = new BABYLON.StandardMaterial("noseMat", scene);
        noseMaterial.diffuseColor = new BABYLON.Color3(1.0, 0.7, 0.75);
        this.noseMesh = BABYLON.MeshBuilder.CreateSphere("nose", {
            diameter: 2 * CatHead.noseRadius, 
            segments: 8,
        }, scene);
        this.noseMesh.material = noseMaterial;
        this.noseMesh.position.z = CatHead.headRadius;
        this.noseMesh.parent = this.headMesh;
        this.noseMesh.rotateAround(BABYLON.Vector3.Zero(), BABYLON.Vector3.Right(), Math.PI / 20);

        const mouthMaterial = new BABYLON.StandardMaterial("mouthMat", scene);
        mouthMaterial.diffuseColor = new BABYLON.Color3(1.0, 1.0, 1.0);
        this.rightJowl = BABYLON.MeshBuilder.CreateCylinder("rightJowl", {
            height: CatHead.jowlHeight,
            diameter: CatHead.jowlDiameter,
        }, scene);
        this.rightJowl.material = mouthMaterial;
        this.rightJowl.position.copyFrom(this.noseMesh.absolutePosition);
        this.rightJowl.position.y -= CatHead.jowlHeight / 2 - 0.003;
        this.leftJowl = this.rightJowl.clone("leftJowl");
        this.leftJowl.material = mouthMaterial;
        this.rightJowl.rotateAround(this.noseMesh.absolutePosition, BABYLON.Vector3.Forward(), Math.PI / 4);
        this.leftJowl.rotateAround(this.noseMesh.absolutePosition, BABYLON.Vector3.Forward(), -Math.PI / 4);
        this.rightJowl.position.y -= CatHead.jowlNoseOffset;
        this.leftJowl.position.y -= CatHead.jowlNoseOffset;
        this.rightJowl.parent = this.headMesh;
        this.leftJowl.parent = this.headMesh;

        this.whisker0 = BABYLON.MeshBuilder.CreateCylinder("whisker0", {
            height: CatHead.whiskerLen,
            diameter: CatHead.whiskerDiameter,
        }, scene);
        this.whisker0.material = mouthMaterial;
        this.whisker0.position.copyFrom(this.noseMesh.absolutePosition);
        this.whisker1 = this.whisker0.clone("whisker1");
        this.whisker2 = this.whisker0.clone("whisker2");
        this.whisker0.rotation.z = Math.PI / 2;
        this.whisker1.rotation.z = Math.PI / 6 + Math.PI / 2;
        this.whisker2.rotation.z = -Math.PI / 6 + Math.PI / 2;
        this.whisker0.parent = this.headMesh;
        this.whisker1.parent = this.headMesh;
        this.whisker2.parent = this.headMesh;
    }

    setPosition(position) {
        this.headMesh.position.copyFrom(position);
    }
    
    getPosition() {
        return this.headMesh.position;
    }

    setRotation(rotation) {
        this.headMesh.position.copyFrom(rotation);
    }

    setVisible(isVisible) {
        this.headMesh.isVisible = isVisible;
    }

    destroy() {
        this.headMesh.dispose();
    }
    lookAt(position) {
        this.headMesh.lookAt(position);
    }
}