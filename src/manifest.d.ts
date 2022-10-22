interface AppsScriptManifest {
  timeZone: string;
  dependencies: {
    enabledAdvancedServices?: Array<{
      serviceId: string;
      userSymbol: string;
      version: string;
    }>;
    libraries?: Array<{
      developmentMode?: boolean;
      libraryId: string;
      userSymbol: string;
      version: string;
    }>;
  };
  exceptionLogging: "STACKDRIVER" | "NONE";
  runtimeVersion?: "DEPRECATED_ES5" | "STABLE" | "V8";
  oauthScopes: string[];
  urlFetchWhitelist?: string[];
}

interface AddOnManifest extends AppsScriptManifest {
  addOns: {
    common: {
      homepageTrigger: {
        enabled?: boolean;
        runFunction: string;
      };
      universalActions: Array<{ label: string; runFunction: string }>;
      openLinkUrlPrefixes: string[];
      logoUrl: string;
      name: string;
      layoutProperties: {
        secondaryColor: string;
        primaryColor: string;
      };
    };
  };
}

export interface GmailAddOnManifest extends AddOnManifest {
  addOns: {
    common: AddOnManifest["addOns"]["common"];
    gmail: {
      homepageTrigger: {
        enabled?: boolean;
        runFunction: string;
      };
      contextualTriggers: [
        {
          unconditional: {};
          onTriggerFunction: string;
        }
      ];
    };
  };
}
