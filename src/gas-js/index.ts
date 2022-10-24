import { Logger } from "./services/base/logger";
import { CacheService } from "./services/cache/service";
import { CardService, CardServiceConfig } from "./services/card/service";
import { GmailApp } from "./services/gmail/service";
import { LockService } from "./services/lock/service";
import { PropertiesService } from "./services/properties/service";
import { Session } from "./services/session/service";
import { UrlFetchApp } from "./services/url_fetch/service";
import { Utilities } from "./services/utilities/service";
import { ServicesStore } from "./stores/services";

ServicesStore.setAll([
  new CardService(),
  new CacheService(),
  new GmailApp(),
  new LockService(),
  new Logger(),
  new PropertiesService(),
  new Session(),
  new UrlFetchApp(),
  new Utilities(),
]);

window[CardServiceConfig.name] = CardServiceConfig;
