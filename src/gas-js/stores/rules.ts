export class RuleStore<T extends [unknown, unknown]> {
  constructor(private rules: T[]) {}

  find(predicate: (rule: T) => boolean) {
    return this.rules.find(predicate) || [];
  }
}
