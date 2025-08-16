class Player {
    #hands = [];
    #body;
    constructor(scene, xr) {
        xr.input.onControllerAddedObservable.add(controllerInputSource => {
            this.#hands.push(new Hand(controllerInputSource, scene));
        });

    }
}