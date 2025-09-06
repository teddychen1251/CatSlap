class GameSoundsManager {
    constructor() {
        // this.audioEngine = audioEngine
        this.context = new AudioContext();
        const panner = new PannerNode(
            this.context,
            {
                panningModel: "HRTF",
                positionX: 1,
                orientationX: -1,
            }
        );
        const meow = document.getElementById("meow");
        this.context.createMediaElementSource(meow).connect(panner).connect(this.context.destination);
        this.meow = meow;
    }
}
const setUpAudio = () => {
    // const audioEngine = await BABYLON.CreateAudioEngineAsync();
    // const meow = await BABYLON.CreateSoundAsync(
    //     "meow",
    //     "assets/meow-2kb.mp3",
    //     { spatialEnabled: true }
    // );
    // await audioEngine.unlockAsync();
    return new GameSoundsManager()
};