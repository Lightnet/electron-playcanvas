class GameBehavior extends Sup.Behavior {
  awake() {
    // Summon our first actor, he'll play the main character
    let mainCharacterActor = new Sup.Actor("Main Character");
    // Tell our actor to slip into the "Leonard" costume (sprite)
    new Sup.SpriteRenderer(mainCharacterActor, "Leonard");

    // Summon a second person on stage, he'll be the camera man
    let cameraManActor = new Sup.Actor("Camera");
    // Give the man a camera!
    new Sup.Camera(cameraManActor);

    // Place our actors. The main character actor is at the center of the stage
    mainCharacterActor.setPosition(0, 0, 0);

    // The camera man will be looking at the main actor from a distance
    cameraManActor.setPosition(0, 0, 5);
  }

  update() {
    
  }
}
Sup.registerBehavior(GameBehavior);
