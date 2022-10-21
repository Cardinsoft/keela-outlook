namespace Components {
  type SelectionInputItemProps = {
    selected: boolean;
    text: string;
    value: string;
  };

  type SelectionInputItemInit = SelectionInputItemProps & {
    action?: Action;
    name: string;
  };

  class SelectionInputItem extends CardServiceRenderableComponent {
    constructor(
      private type: SelectionInputType,
      private init: SelectionInputItemInit
    ) {
      super();
    }

    create(): HTMLElement {
      const handlers: Record<
        SelectionInputType,
        (item: SelectionInputItemInit) => HTMLElement
      > = {
        [SelectionInputType.CHECK_BOX]: ({
          action,
          name,
          text,
          value,
          selected,
        }) => {
          const wrapper = document.createElement("div");
          wrapper.classList.add("ms-CheckBox");

          const input = document.createElement("input");
          input.classList.add("ms-CheckBox-input");
          input.checked = selected;
          input.name = name;
          input.type = "checkbox";
          input.value = value;
          wrapper.append(input);

          const label = document.createElement("label");
          label.classList.add("ms-CheckBox-field");
          label.classList.toggle("is-checked", selected);
          wrapper.append(label);

          const labelText = document.createElement("span");
          labelText.classList.add("ms-Label");
          labelText.textContent = text;
          label.append(labelText);

          if (action) {
            wrapper.addEventListener("click", () => {
              ActionStore.set(wrapper, action);
              const { checked } = input;
              input.checked = !checked;
              label.classList.toggle("is-checked", !checked);
              handleEvent(wrapper);
            });
          }

          return wrapper;
        },
        [SelectionInputType.DROPDOWN]: ({ selected, text, value }) => {
          const wrapper = document.createElement("option");
          wrapper.selected = selected;
          wrapper.textContent = text;
          wrapper.value = value;
          return wrapper;
        },
        [SelectionInputType.RADIO_BUTTON]: ({
          action,
          name,
          selected,
          text,
          value,
        }) => {
          const wrapper = document.createElement("li");
          wrapper.classList.add("ms-RadioButton");

          const input = document.createElement("input");
          input.classList.add("ms-RadioButton-input");
          input.checked = selected;
          input.name = name;
          input.type = "radio";
          input.value = value;
          wrapper.append(input);

          const label = document.createElement("label");
          label.classList.add("ms-RadioButton-field");
          label.classList.toggle("is-checked", selected);
          wrapper.append(label);

          const labelText = document.createElement("span");
          labelText.classList.add("ms-Label");
          labelText.textContent = text;
          label.append(labelText);

          if (action) {
            wrapper.addEventListener("click", () => {
              ActionStore.set(wrapper, action);

              const { parentElement } = wrapper;
              if (!parentElement) {
                throw new Error("disconnected input", { cause: wrapper });
              }

              const inputs = [...parentElement.getElementsByTagName("input")];
              const labels = [...parentElement.getElementsByTagName("label")];

              inputs.forEach((item, index) => {
                const selected = item === input;
                item.checked = selected;
                labels[index].classList.toggle("is-checked", selected);
              });

              handleEvent(wrapper);
            });
          }

          return wrapper;
        },
      };

      return handlers[this.type](this.init);
    }
  }

  /**
   * @see https://developers.google.com/apps-script/reference/card-service/selection-input
   */
  export class SelectionInput extends CardServiceRenderableComponent {
    private action?: Action;
    private fieldName?: string;
    private items: SelectionInputItemProps[] = [];
    private title?: string;
    private type: SelectionInputType = SelectionInputType.CHECK_BOX;

    /**
     * @see https://developers.google.com/apps-script/reference/card-service/selection-input#additemtext,-value,-selected
     *
     * @summary Adds a new item that can be selected.
     * @param text The text to be shown for this item.
     * @param value The form input value that is sent via the callback.
     * @param selected Whether the item should start as selected or unselected.
     */
    addItem(text: string, value: string, selected: boolean) {
      this.items.push({
        text: safeToString(text),
        value: safeToString(value),
        selected,
      });
      return this;
    }

    /**
     * @see https://developers.google.com/apps-script/reference/card-service/selection-input#setfieldnamefieldname
     *
     * @summary Sets the key that identifies this selection input in the event object that is generated when there is a UI interaction. Not visible to the user. Required, must be unique.
     * @param fieldName The name to assign to this input.
     */
    setFieldName(fieldName: string) {
      this.fieldName = fieldName;
      return this;
    }

    /**
     * @see https://developers.google.com/apps-script/reference/card-service/selection-input#setonchangeactionaction
     *
     * @summary Sets an {@link Action} to be performed whenever the selection input changes.
     * @param action The action to take.
     */
    setOnChangeAction(action: Action) {
      this.action = action;
      return this;
    }

    /**
     * @see https://developers.google.com/apps-script/reference/card-service/selection-input#settitletitle
     *
     * @summary Sets the title to be shown ahead of the input field.
     * @param title The input field title.
     */
    setTitle(title: string) {
      this.title = title;
      return this;
    }

    /**
     * @see https://developers.google.com/apps-script/reference/card-service/selection-input#settypetype
     *
     * @summary Sets the type of this input. Defaults to {@link SelectionInputType.CHECKBOX}.
     * @param type The selection type.
     */
    setType(type: SelectionInputType) {
      this.type = type;
      return this;
    }

    /**
     * @summary renders this selection input items
     * @param name field name of the input
     * @param parent items parent element
     */
    private async renderItems(name: string, parent: HTMLElement) {
      const { action, type, items } = this;
      for (const props of items) {
        const item = new SelectionInputItem(type, {
          ...props,
          name,
          action,
        });
        await item.render(parent);
      }
    }

    async create(): Promise<HTMLElement> {
      const { fieldName, type } = this;

      if (!fieldName) {
        throw new Error("SelectionInput must have field name set");
      }

      const widget = document.createElement("div");
      widget.classList.add("row", "SelectionInput");

      const handlers: Record<
        SelectionInputType,
        (name: string, self: SelectionInput) => Promise<HTMLElement>
      > = {
        [SelectionInputType.CHECK_BOX]: async (name) => {
          const column = document.createElement("div");
          column.classList.add("column");
          widget.append(column);

          await this.renderItems(name, column);
          return column;
        },
        [SelectionInputType.DROPDOWN]: async (name, { action, title }) => {
          const wrapper = document.createElement("div");
          wrapper.classList.add("ms-Dropdown");
          widget.append(wrapper);

          if (title) {
            const label = document.createElement("label");
            label.classList.add("ms-Label SelectionInputTopLabel");
            label.textContent = title;
            wrapper.append(label);
          }

          const chevron = document.createElement("i");
          chevron.classList.add(
            "ms-Dropdown-caretDown",
            "ms-Icon",
            "ms-Icon--ChevronDown"
          );
          wrapper.append(chevron);

          const input = document.createElement("select");
          input.classList.add("ms-Dropdown-select");
          input.name = name;
          wrapper.append(input);

          if (action) {
            input.addEventListener("change", () => {
              ActionStore.set(widget, action);
              handleEvent(input);
            });
          }

          new fabric.Dropdown(wrapper);

          //quick fix for the dropdown UI
          wrapper
            .querySelector(".ms-Dropdown-truncator")
            ?.classList.add("hidden");

          await this.renderItems(name, input);
          return wrapper;
        },
        [SelectionInputType.RADIO_BUTTON]: async (name) => {
          const column = document.createElement("div");
          column.classList.add("column");
          widget.append(column);

          const group = document.createElement("div");
          group.classList.add("ms-ChoiceFieldGroup");
          column.append(group);

          const list = document.createElement("ul");
          list.classList.add("ms-ChoiceFieldGroup-list");
          group.append(list);

          await this.renderItems(name, list);
          return column;
        },
      };

      const content = await handlers[type](fieldName, this);
      widget.append(content);
      return widget;
    }
  }
}
