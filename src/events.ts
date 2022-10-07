class EventTimezone {
    /**
     * @summary The timezone identifier of the user's timezone
     */
    get id() {
        return Office.context.mailbox.userProfile.timeZone;
    }

    /**
     * @summary The time offset from Coordinated Universal Time (UTC) 
     * of the user's timezone, measured in milliseconds
     */
    get offset() {
        const { offset } = luxon.DateTime.fromJSDate(
            new Date(), { zone: this.id }
        );

        return (offset * 60 * 1e3).toString();
    }
}

class CommonEventObject {
    timeZone = new EventTimezone();

    parameters: Record<string, string> = {};

    /**
     * @summary Indicates where the event originates
     */
    get platform() {
        return Office.context.platform;
    }

    /**
     * @summary The user's language and country/region identifier
     */
    get userLocale() {
        return Office.context.displayLanguage;
    }
}

class MessageMetadata {

    /**
     * @param item Outlook message
     */
    constructor(
        private item: Exclude<Office.Mailbox["item"], undefined>
    ) { }

    /**
     * @summary An access token
     */
    get accessToken() {
        return new Promise<string>((res, rej) => {
            Office.context.mailbox.getCallbackTokenAsync((result) => {
                const { error, value } = result;
                error ? rej(error) : res(value);
            });
        })
    }

    /**
     * @summary The message ID of the thread open in the UI
     */
    get messageId() {
        return this.item.itemId;
    }
}

class EventObject {
    commonEventObject = new CommonEventObject();

    formInput: Record<string, string> = {};
    formInputs: Record<string, string[]> = {};

    /**
     * @summary Indicates where the event originates
     * @deprecated
     */
    get clientPlatform() {
        return this.commonEventObject.platform;
    }

    /**
     * @summary current message metadata available in message contexts
     */
    get messageMetadata() {
        const { item } = Office.context.mailbox;
        return item && new MessageMetadata(item);
    }

    /**
     * @summary A map of any additional parameters
     * @deprecated
     */
    get parameters() {
        return this.commonEventObject.parameters;
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