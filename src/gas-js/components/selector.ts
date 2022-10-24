import { RenderableComponent } from ".";

export type SelectorOption = {
  selected?: boolean;
  text: string;
  value: string;
};

export class Selector extends RenderableComponent {
  options: SelectorOption[] = [];
  open = false;

  constructor(public name: string) {
    super();
  }

  /**
   * @summary gets the underlying {@link HTMLSelectElement}
   */
  get $select() {
    const { element = this.create() } = this;
    const select = element.querySelector("select");
    if (!select) {
      throw new Error("selector is missing select element");
    }
    return select;
  }

  create() {
    const { name, options } = this;

    const wrapper = document.createElement("div");
    wrapper.classList.add("Select");

    const select = document.createElement("select");
    select.name = name;
    select.hidden = true;
    wrapper.append(select);

    const newDisplayOptions = options.map((item) => {
      const { text } = item;

      const wrapper = document.createElement("div");
      wrapper.classList.add("selectItem");

      const display = document.createElement("p");
      display.textContent = text;
      display.classList.add("selectText");
      wrapper.append(text);

      return wrapper;
    });

    const newOptions = options.map((item) => {
      const { selected = false, value } = item;
      const option = document.createElement("option");
      option.selected = selected;
      option.value = value;
      return option;
    });

    wrapper.append(...newDisplayOptions);
    select.append(...newOptions);
    return wrapper;
  }

  /**
   * @summary adds an option to the {@link Selector}
   * @param items item or items to add
   */
  add(...items: SelectorOption[]) {
    const { options } = this;
    options.push(...items);
    return this;
  }

  /**
   * @summary removes an option from the {@link Selector}
   * @param index option index
   */
  remove(index: number) {
    const { options } = this;
    options.splice(index, 1);
    return this;
  }

  /**
   * @summary selects an option of the {@link Selector}
   * @param index option index
   */
  select(index: number) {
    const { options } = this;
    options.forEach((option, idx) => {
      option.selected = idx === index;
    });
    return this;
  }

  toggle() {
    // TODO: future releases
  }
}
