import luxon from "luxon";
import { getMailbox, getProfile } from "./utils/office";

class EventTimezone {
  /**
   * @summary The timezone identifier of the user's timezone
   */
  get id() {
    return getProfile().timeZone;
  }

  /**
   * @summary The time offset from Coordinated Universal Time (UTC)
   * of the user's timezone, measured in milliseconds
   */
  get offset() {
    const { offset } = luxon.DateTime.fromJSDate(new Date(), { zone: this.id });

    return (offset * 60 * 1e3).toString();
  }
}

type FormInput = { value: string[] };

class CommonEventObject {
  timeZone = new EventTimezone();

  parameters: Record<string, string> = {};

  /**
   * @summary A map containing the current values of the widgets in the displayed card.
   */
  formInputs: Record<string, { stringInputs: FormInput }> = {};

  /**
   * @summary Indicates where the event originates
   */
  get platform() {
    return Office.context.platform || Office.PlatformType.OfficeOnline;
  }

  /**
   * @summary The user's language and country/region identifier
   */
  get userLocale() {
    return Office.context.displayLanguage || "en-US";
  }
}

/**
 * @see https://developers.google.com/apps-script/add-ons/concepts/event-objects#gmail_event_object
 */
class GmailEventObject {
  constructor(private item?: Office.MessageRead) {}

  /**
   * @summary The Gmail-specific access token.
   */
  get accessToken() {
    return new Promise<string>((res, rej) => {
      getMailbox().getCallbackTokenAsync((result) => {
        const { error, value } = result;
        error?.code ? rej(error) : res(value);
      });
    });
  }

  get bccRecipients() {
    return [];
  }

  /**
   * @summary The list of "CC:" recipient email addresses currently included in a draft the add-on is composing.
   */
  get ccRecipients() {
    return this.item?.cc.map(({ emailAddress }) => emailAddress) || [];
  }

  /**
   * @summary The ID of the currently open Gmail message.
   */
  get messageId() {
    return this.item?.itemId || "";
  }

  /**
   * @summary The currently open Gmail thread ID.
   */
  get threadId() {
    return this.item?.conversationId || "";
  }
}

export class EventObject {
  commonEventObject = new CommonEventObject();

  gmail = new GmailEventObject(Office.context.mailbox?.item);

  /**
   * @summary A map of the current values of all form widgets in the card, restricted to one value per widget.
   * @deprecated
   */
  get formInput() {
    const { formInputs } = this.commonEventObject;

    const inputs: Record<string, string> = {};
    Object.entries(formInputs).forEach(([key, { stringInputs }]) => {
      inputs[key] = stringInputs.value[0];
    });

    return inputs;
  }

  /**
   * @summary A map of current values of widgets in the card, presented as lists of strings.
   * @deprecated
   */
  get formInputs() {
    const { formInputs } = this.commonEventObject;

    const inputs: Record<string, string[]> = {};
    Object.entries(formInputs).forEach(([key, { stringInputs }]) => {
      inputs[key] = stringInputs.value;
    });

    return inputs;
  }

  /**
   * @summary Indicates where the event originates
   * @deprecated
   */
  get clientPlatform() {
    return this.commonEventObject.platform;
  }

  /**
   * @summary current message metadata available in message contexts
   * @deprecated
   */
  get messageMetadata() {
    const { gmail } = this;
    return {
      accessToken: gmail.accessToken,
      messageId: gmail.messageId,
    };
  }

  /**
   * @summary A map of any additional parameters
   * @deprecated
   */
  get parameters() {
    return this.commonEventObject.parameters;
  }

  set parameters(value) {
    this.commonEventObject.parameters = value;
  }

  /**
   * @summary The two-letter code indicating the user's country or region.
   * @deprecated
   */
  get userCountry() {
    const { userLocale } = this.commonEventObject;
    const [, countryCode] = userLocale.split("-");
    return countryCode || "US";
  }

  /**
   * @summary The two-letter ISO 639 code indicating the user's language
   * @deprecated
   */
  get userLocale() {
    return this.commonEventObject.userLocale;
  }

  /**
   * @summary user timezone id and offset
   * @deprecated
   */
  get userTimezone() {
    return this.commonEventObject.timeZone;
  }
}
