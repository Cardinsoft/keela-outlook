import { type Card } from "../services/card/components/card";

export class CardStore {
  /**
   * @summary stack of {@link Card}s to navigate between
   */
  private static stack: Card[] = [];

  /**
   * @summary gets last {@link Card} in the stack
   */
  static get last() {
    const { stack } = this;
    return stack[stack.length - 1];
  }

  /**
   * @summary pops the stack to a named {@link Card}
   * @param name {@link Card} name
   */
  static named(name: string) {
    const { stack } = this;
    for (let i = stack.length - 1; i >= 0; i--) {
      const card = stack[i];
      if (card.name === name) break;
      this.pop();
    }
    return this;
  }

  /**
   * @summary pops a {@link Card} from the stack
   */
  static pop() {
    this.stack.pop();
    return this;
  }

  /**
   * @summary pushes a {@link Card} on the stack
   * @param card {@link Card} to push
   */
  static push(card: Card) {
    this.stack.push(card);
    return this;
  }

  /**
   * @summary renders the last {@link Card} on the stack
   * @param parent parent element
   */
  static async render(parent: HTMLElement | null) {
    return this.last.render(parent);
  }

  /**
   * @summary resets the stack
   * @param cards {@link Card}s to push
   */
  static reset(cards: Card[]) {
    const { stack } = this;
    stack.length = 0;
    stack.push(...cards);
    return this;
  }

  /**
   * @summary unrenders all {@link Card}s on the stack
   */
  static async teardown() {
    const { stack } = this;
    await Promise.all(stack.map((card) => card.teardown()));
    return this;
  }

  /**
   * @summary pops {@link Card}s from the stack until root {@link Card} is reached
   */
  static root() {
    const { stack } = this;

    const { length } = stack;
    for (let i = 1; i < length; i++) {
      this.pop();
    }

    return this;
  }
}
