class GameSoundsManager {
    constructor() {
        this.context = new AudioContext();
        this.panner = new PannerNode(
            this.context,
            {
                panningModel: "HRTF",
                positionX: 1,
                orientationX: -1,
            }
        );
        const meow = document.getElementById("meow");
        this.context.createMediaElementSource(meow).connect(this.panner).connect(this.context.destination);
        this.meow = meow;
        this.block = document.getElementById("block");
        this.context.createMediaElementSource(this.block).connect(this.panner).connect(this.context.destination);
        this.hitHurt = document.getElementById("hitHurt");
        this.context.createMediaElementSource(this.hitHurt).connect(this.panner).connect(this.context.destination);
    }

    updateListener(xrCamera) {
        // note that Babylon is left-handed (+z into screen) 
        // while WebAudio is right-handed (+z out of screen)
        const position = xrCamera.position;
        this.context.listener.positionX.value = position.x;
        this.context.listener.positionY.value = position.y;
        this.context.listener.positionZ.value = -position.z;
        const cameraForward = BABYLON.Vector3.TransformNormal(
            BABYLON.Vector3.Forward(),
            xrCamera.getWorldMatrix()
        );
        this.context.listener.forwardX.value = cameraForward.x;
        this.context.listener.forwardY.value = cameraForward.y;
        this.context.listener.forwardZ.value = -cameraForward.z;
        const cameraUp = BABYLON.Vector3.TransformNormal(
            BABYLON.Vector3.Up(),
            xrCamera.getWorldMatrix()
        );
        this.context.listener.upX.value = cameraUp.x;
        this.context.listener.upY.value = cameraUp.y;
        this.context.listener.upZ.value = -cameraUp.z;
    }

    playMeow(position) {
        if (this.context.state == "suspended") {
            this.context.resume();
        }
        this.panner.positionX.value = position.x;
        this.panner.positionY.value = position.y;
        this.panner.positionZ.value = -position.z;
        this.meow.play()
    }

    playBlock(position) {
        this.panner.positionX.value = position.x;
        this.panner.positionY.value = position.y;
        this.panner.positionZ.value = -position.z;
        this.block.play();
    }

    playHitHurt(position) {
        this.panner.positionX.value = position.x;
        this.panner.positionY.value = position.y;
        this.panner.positionZ.value = -position.z;
        this.hitHurt.play();
    }
}
