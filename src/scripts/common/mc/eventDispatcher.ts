// Phaser Singleton Class
// For Broadcasting Game Wide Events

export default class EventDispatcher extends Phaser.Events.EventEmitter {
  private static instance: EventDispatcher

  private constructor() {
      super();
  }

  public static getInstance(): Phaser.Events.EventEmitter {
    if (!EventDispatcher.instance) {
      EventDispatcher.instance = new EventDispatcher()
    }

    return EventDispatcher.instance
  }
}
