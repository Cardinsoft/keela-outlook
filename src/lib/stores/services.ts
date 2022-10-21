type ServiceType =
  | typeof CardService
  | typeof GmailApp
  | typeof Utilities
  | typeof Session
  | typeof Logger
  | typeof PropertiesService
  | typeof CacheService;

class ServicesStore {
  /**
   * @summary map of guids to services
   */
  private static items: Record<string, ServiceType> = {};

  /**
   * @summary exposes a service on the global object
   * @param name service name
   */
  static expose(name: string) {
    const service = this.get(name);
    if (service) {
      window[service.name] = service;
    }
    return service;
  }

  /**
   * @summary exposes all services
   */
  static exposeAll() {
    const { items: services } = this;
    return Object.keys(services).map((name) => {
      return this.expose(name);
    });
  }

  /**
   * @summary unexposes a service
   * @param name service name
   */
  static unexpose(name: string) {
    delete window[name];
    return this;
  }

  /**
   * @summary gets a service by name
   * @param name action guid to lookup
   */
  static get(name: string) {
    return this.items[name];
  }

  /**
   * @summary sets a service
   * @param service service to set
   */
  static set(service: ServiceType) {
    const { items } = this;
    const { name } = service;
    items[name] = service;
    this.expose(name);
    return this;
  }

  /**
   * @summary sets multiple services at once
   * @param services list of services to set
   */
  static setAll(services: ServiceType[]) {
    const { items } = this;
    for (const service of services) {
      const { name } = service;
      items[name] = service;
      this.expose(name);
    }
    return this;
  }

  /**
   * @summary removes a service by name
   * @param name service name
   */
  static remove(name: string) {
    const { items } = this;
    delete items[name];
    this.unexpose(name);
    return this;
  }
}
