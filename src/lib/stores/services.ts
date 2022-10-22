import { type Logger } from "../services/base/logger.js";
import { type CacheService } from "../services/cache/service.js";
import { type CardService } from "../services/card/service.js";
import { type GmailApp } from "../services/gmail/service.js";
import { type LockService } from "../services/lock/service.js";
import { type PropertiesService } from "../services/properties/service.js";
import { type Session } from "../services/session/service.js";
import { type UrlFetchApp } from "../services/url_fetch/service.js";
import { type Utilities } from "../services/utilities/service.js";

export type ServiceType =
  | CardService
  | GmailApp
  | Utilities
  | Session
  | Logger
  | PropertiesService
  | CacheService
  | LockService
  | UrlFetchApp;

export class ServicesStore {
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
      window[service.constructor.name] = service;
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
    const { name } = service.constructor;
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
      const { name } = service.constructor;
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
