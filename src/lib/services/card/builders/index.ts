abstract class CardServiceBuilder<T extends { constructor: Function }> {
  constructor() {}

  build(item: T): T {
    if (!this.validate()) {
      throw new Error(`Invalid ${item.constructor.name}`);
    }

    return item;
  }

  protected abstract validate(): boolean;
}
