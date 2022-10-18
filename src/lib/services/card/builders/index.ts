abstract class CardServiceBuilder<T extends { constructor: Function }> {
  constructor(protected item: T) {}

  build(): T {
    const { item } = this;

    if (!this.validate()) {
      throw new Error(`Invalid ${item.constructor.name}`);
    }

    return item;
  }

  protected abstract validate(): boolean;
}
