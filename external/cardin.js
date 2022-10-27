function action(config, message) {
    var event = config.event;
    var params = event.parameters;
    var form = event.formInputs;
    var method = config.method;
    var instance = config.instance;
    if (!message) {
        message = getMessage(event);
    }
    var result;
    switch (method) {
        case "add":
            result = instance.add(message, form);
            break;
        case "confirm":
            result = cardConfirm(params);
            break;
        case "update":
            result = instance.update(message, form);
            break;
        case "remove":
            result = instance.remove(message, params.entity);
            break;
        case "next":
            result = instance.run(message, +params.start);
            break;
        case "back":
            result = instance.run(message, +params.start);
            break;
        default: result = instance.run(message);
    }
    return actionResponse({
        event: event,
        reload: {
            card: result
        }
    });
}
function appendOptions_(widget, entities, parser) {
    switch (widget.type) {
        case Type.KEY_VALUE:
            widget.content += parser.text.separate + entities.map(function (entity) {
                return parser.text.props.map(function (p) {
                    return entity[p];
                }).join(parser.text.join);
            }).join(parser.text.separate);
            break;
        default:
            var content = entities.map(function (entity) {
                return {
                    value: parser.value.props.map(function (p) {
                        return entity[p];
                    }).join(parser.value.join),
                    text: parser.text.props.map(function (p) {
                        return entity[p];
                    }).join(parser.text.join)
                };
            });
            widget.content = widget.content.concat(content);
    }
    return widget;
}
function edit(config) {
    var event = config.event || {};
    var auto = toBoolean(config.auto);
    var params = event.parameters || {};
    var form = event.formInputs || {};
    var cardConfig = JSON.parse(params.card);
    cardConfig.sections.forEach((section, s) => {
        var widgets = section.widgets;
        var hasEditable = widgets.some((w) => {
            return w.state === State.EDITABLE;
        });
        if (hasEditable) {
            widgets.forEach(function (widget, w) {
                if ((+params.index === w && +params.section === s) || !params.index) {
                    section.isCollapsible = false;
                    switchToInput_(widgets, widget, w);
                    if (widget.group) {
                        widgets.forEach(function (w, i) {
                            if (widget.group === w.group) {
                                switchToInput_(widgets, w, i);
                                if (i > 0) {
                                    section.max++;
                                }
                            }
                        });
                    }
                }
            });
            widgets.forEach(function (widget) {
                if (widget.state === State.EDITABLE) {
                    if (auto) {
                        section.widgets.forEach(function (widget) {
                            widget.change = {
                                callback: "action",
                                spinner: true,
                                params: {
                                    method: "update"
                                }
                            };
                        });
                    }
                }
            });
            preserve_(form, widgets);
        }
    });
    return actionResponse({
        event: event,
        reload: {
            type: Reload.CARD,
            card: cardConfig
        }
    });
}
function fetchAndReload(config) {
    var { event, instance } = config;
    var params = event.parameters;
    var fetch = JSON.parse(params.fetch);
    var display = JSON.parse(params.display);
    var sindex = +params.section;
    var windex = +params.widget;
    var card = JSON.parse(params.card);
    var section = card.sections[sindex];
    try {
        fetch.params.apply[fetch.params.apply.length - 1] += fetch.params.increment;
        var response = instance[fetch.callback].apply(instance, fetch.params.apply);
        if (windex) {
            var widget = section.widgets[windex];
            try {
                if (response.length > 0) {
                    var wDisplay = widget.more.display;
                    var edit = wDisplay.edit;
                    var show = wDisplay.show;
                    if (show) {
                        appendOptions_(widget, response, show);
                    }
                    if (edit) {
                        widget.map.forEach(function (mapper, m) {
                            if (edit.widgets.indexOf(m) !== -1) {
                                appendOptions_(mapper, response, edit);
                            }
                        });
                    }
                    widget.more.fetch.params.apply[widget.more.fetch.params.apply.length - 1] += widget.more.fetch.params.increment;
                    section.isCollapsible = false;
                }
                else {
                    return actionResponse({
                        event: event,
                        notify: "No more " + (widget.more.entity ? widget.more.entity : "info") + " to display"
                    });
                }
            }
            catch (error) {
                timestamp("failed to add " + (widget.more.entity ? widget.more.entity : "info") + " to widget", error, "warning");
                return actionResponse({
                    event: event,
                    notify: "Failed to display more " + (widget.more.entity ? widget.more.entity : "info")
                });
            }
        }
        else {
            try {
                var fetchWidget = getByProperty(section.widgets, "id", "fetcher");
                fetchWidget.click.params.fetch.params.apply[fetch.params.apply.length - 1] += fetch.params.increment;
                if (response.length > 0) {
                    display.params.apply[display.params.argument || 0] = response;
                    var display = instance[display.callback].apply(instance, display.params.apply);
                    var temp = section.widgets.pop();
                    section.widgets = section.widgets.concat(display);
                    section.widgets.push(temp);
                    section.numUncollapsible = section.widgets.length + 1;
                    fetchWidget.click.params.card.sections[sindex] = copyObject(section);
                }
                else {
                    return actionResponse({
                        event: event,
                        notify: "No more " + (params.entity ? params.entity : "info") + " to display"
                    });
                }
            }
            catch (error) {
                timestamp("failed to display fetched", error, "warning");
                return actionResponse({
                    event: event,
                    notify: "Failed to display more " + (params.entity ? params.entity : "info")
                });
            }
        }
    }
    catch (error) {
        timestamp("failed to fetch", error, "warning");
        return actionResponse({
            event: event,
            notify: "Failed to fetch more " + (params.entity ? params.entity : "info")
        });
    }
    card.sections.forEach(function (section) {
        preserve_(event.formInputs, section.widgets);
    });
    return actionResponse({
        event: event,
        refresh: true,
        reload: {
            card: card
        }
    });
}
function switchToInput_(widgets, widget, index) {
    if (widget.state === State.EDITABLE) {
        if (widget.map) {
            widgets.splice(index, 1);
            widget.map.forEach((el, m) => {
                if (!el.type) {
                    el.type = Type.TEXT_INPUT;
                }
                if ((/\r|\n/g).test(widget.content)) {
                    el.multiline = true;
                }
                widgets.splice(index + m, 0, el);
            });
        }
        else {
            widget.type = Type.TEXT_INPUT;
        }
    }
}
function actionBuilder({ callback, library, params = {}, spinner = false }) {
    const action = CardService.newAction();
    if (!callback) {
        throw new Error("Action should have a callback name");
    }
    action.setFunctionName(library ? `${library}.${callback}` : callback);
    action.setParameters(propertiesToString(params));
    if (spinner) {
        action.setLoadIndicator(CardService.LoadIndicator.SPINNER);
    }
    return action;
}
const errorDecorator = (handler, callback) => (...args) => {
    try {
        return callback(...args);
    }
    catch (error) {
        return handler(error);
    }
};
const actionDecorator = (widget, widgetConfig) => {
    if (!widgetConfig) {
        return widget;
    }
    const common = { widget, ...widgetConfig };
    const strategies = new Map();
    strategies.set("auth", authStrategy);
    strategies.set("change", changeStrategy);
    strategies.set("click", clickStrategy);
    strategies.set("compose", composeStrategy);
    strategies.set("suggest", suggestStrategy);
    strategies.set("link", openLinkStrategy);
    Object.entries(common).forEach(([k, v]) => {
        const strategy = strategies.get(k);
        if (k === "link") {
            return strategy(widget, isStr(v) ? { url: v } : v);
        }
        isFunc(strategy) && strategy(widget, v);
    });
    return widget;
};
const iconDecorator = (widget, { icon }) => {
    if (!icon) {
        return widget;
    }
    const iconEnum = CardService.Icon[icon];
    if ("setStartIcon" in widget) {
        const image = CardService.newIconImage();
        widget.setStartIcon(/^https?:/.test(icon) ? image.setIconUrl(icon) : image.setIcon(iconEnum || icon));
        return widget;
    }
    if (!("setIconUrl" in widget) || !("setIcon" in widget)) {
        return widget;
    }
    if (/^https?:/.test(icon)) {
        widget.setIconUrl(icon);
        return widget;
    }
    widget.setIcon(iconEnum || icon);
    return widget;
};
const labelDecorator = (widget, { title, hint, color, titleColor, hintColor }) => {
    if (color) {
        title = Formatter.colorize(titleColor || color, title);
        hint = Formatter.colorize(hintColor || color, hint);
    }
    if ("setTopLabel" in widget && title) {
        widget.setTopLabel(title);
    }
    if ("setBottomLabel" in widget && hint) {
        widget.setBottomLabel(hint);
    }
    if ("setTitle" in widget && title) {
        widget.setTitle(title);
    }
    if ("setHint" in widget && hint) {
        widget.setHint(hint);
    }
    return widget;
};
const suggestionDecorator = (widget, { suggestions = [] }) => {
    if (!("setSuggestions" in widget) || !suggestions.length) {
        return widget;
    }
    const suggs = CardService.newSuggestions();
    suggestions.forEach((sug) => suggs.addSuggestion(sug));
    widget.setSuggestions(suggs);
    return widget;
};
const buttonDecorator = (widget, options) => {
    if (!("setButton" in widget) || !options) {
        return widget;
    }
    const { type = Type.TEXT_BUTTON } = options;
    const buttonTemplates = {
        [Type.IMAGE_BUTTON]: imageButtonWidget,
        [Type.TEXT_BUTTON]: textButtonWidget,
    };
    const handler = buttonTemplates[type];
    if (typeof handler === "function") {
        widget.setButton(handler(options));
    }
    return widget;
};
var globalEnumReplyDraft = "REPLY_AS_DRAFT";
var globalEnumStandalone = "STANDALONE_DRAFT";
var Auth = Object.freeze({
    API_TOKEN: "api_token",
    BASIC: "basic",
    UC: "user_credentials",
    OAUTH2: "oauth2",
    QUERY: "query",
    SERVICE: "service",
});
var Mime = Object.freeze({
    FORM: "application/x-www-form-urlencoded",
    JSON: "application/json",
    XML: "application/xml",
    TEXT: "text/plain",
});
var Token = Object.freeze({
    ID: "id_token",
    ACCESS: "access_token",
});
var Icon = Object.freeze({
    ACCOUNT: "account_box",
    ADD: "add",
    ACTIVITIES: "assignment",
    BACK_ARROW: "arrow_back",
    BACKGROUND: "description",
    BIRTHDAY: "cake",
    CALL_IN: "call",
    CALL_OUT: "call_made",
    CALL_MISSED: "call_missed",
    CALL_ENDED: "call_end",
    COMPANY: "business",
    CUSTOM: "add_circle",
    DEAL: "fa-solid fa-file",
    DEAL_CLOSED: "fa-solid fa-file-export",
    DEAL_LOST: "fa-solid fa-file-slash",
    DEAL_OPEN: "fa-solid fa-file-import",
    DEAL_QUAL: "fa-solid fa-file-magnifying-glass",
    DEAL_WON: "fa-solid fa-file-check",
    DEPARTMENT: "badge",
    DIALPAD: "dialpad",
    DOWNLOAD: "cloud_download",
    EDIT: "edit",
    EMAIL_DIRECT: "contact_mail",
    EMAIL_HOME: "home",
    EMAIL_MOBILE: "smartphone",
    EMAIL_OFFICE: "alternate_email",
    EURO: "euro_symbol",
    EVENT_RECURRENT: "event_repeat",
    INBOX: "inbox",
    INDUSTRY: "domain",
    FACEBOOK: `fa-brands fa-facebook`,
    FAX: "fax",
    FIRE: "local_fire_department",
    FLAG: "flag",
    FORWARD: "chevron_right",
    FORWARD_ARROW: "arrow_forward",
    JOB_TITLE: "business_center",
    LINK: "link",
    LIST: "list",
    LOST_INFO: "help",
    MAP_BILL: "local_atm",
    MAP_MAIL: "email",
    MAP_SHIP: "local_shipping",
    MEETING_MISSED: "group_off",
    NUMBER: "pin",
    NOTES: "notes",
    OPEN: "open_in_new",
    OVERDUE: "pending_actions",
    PHONE_DIRECT: "phone_forwarded",
    PHONE_HOME: "home",
    PHONE_MOBILE: "smartphone",
    PHONE_WORK: "headset",
    REFRESH: "refresh",
    REMOVE: "delete",
    RESET: "power_settings_new",
    SAVE: "save",
    SEARCH: "search",
    SENT: "send",
    SETTINGS: "settings",
    SKYPE: "fa-brands fa-skype",
    SHOW: "visibility",
    SWITCH: "visibility_off",
    TAB: "tab",
    TASK: "done",
    TASK_DONE: "done_all",
    TASK_FAILED: "remove_done",
    TEXT: "title",
    TIME_RECURRENT: "update",
    TWITTER: `fa-brands fa-twitter`,
    TWITTER_CIRCLE: `fa-brands fa-square-twitter`,
    WARNING: "warning",
    WEB: "public",
    WEBHOOK: "webhook",
    UPLOAD: "cloud_upload",
});
var Reload = Object.freeze({
    ACTION: "action",
    CALLBACK: "callback",
    CONFIG: "config",
});
var Response = Object.freeze({
    UNIVERSAL: "universal",
    COMPOSE: "compose",
    ACTION: "action",
});
var Show = Object.freeze({
    UPDATED: "updated",
    RESET: "reset",
});
var State = ((e) => {
    e[(e.EDITABLE = "editable")] = 0;
    e[(e.HIDDEN = "hidden")] = 1;
    return e;
})({});
var Type = ((e) => {
    const { SelectionInputType: { CHECK_BOX, DROPDOWN, RADIO_BUTTON }, } = CardService;
    e[(e.BUTTON_SET = "ButtonSet")] = 0;
    e[(e.CHECK_BOX = "CHECK_BOX")] = CHECK_BOX;
    e[(e.DROPDOWN = "DROPDOWN")] = DROPDOWN;
    e[(e.IMAGE = "Image")] = 3;
    e[(e.KEY_VALUE = "KeyValue")] = 4;
    e[(e.IMAGE_BUTTON = "ImageButton")] = 5;
    e[(e.RADIO = "RADIO_BUTTON")] = RADIO_BUTTON;
    e[(e.TEXT_BUTTON = "TextButton")] = 7;
    e[(e.TEXT_INPUT = "TextInput")] = 8;
    e[(e.TEXT_PAR = "TextParagraph")] = 9;
    e[(e.GRID = "Grid")] = 10;
    return e;
})({});
var section = errorDecorator((err) => console.warn(`section is misconfigured: ${err}`), (config, sectionIndex = 0) => {
    const section = CardService.newCardSection();
    const { sections = [] } = config;
    var sectionConfig = sections[sectionIndex];
    let { isCollapsible, numUncollapsible = 0 } = sectionConfig;
    const { fetch, header, max, start = 0, widgets = [], more } = sectionConfig;
    let numSeparators = 0;
    let current = 0;
    const parsedWidgets = [];
    for (let index = start; index < widgets.length; index++) {
        var widget = validateConfig(widgets[index] || {}, sectionIndex, index);
        const { content, state, type } = widget;
        if (state === State.HIDDEN) {
            continue;
        }
        if (!type) {
            throw new Error(`widget config should have a type`);
        }
        if (index + numSeparators >= start + max) {
            continue;
        }
        current++;
        switch (type) {
            case Type.TEXT_PAR:
                parsedWidgets.push(textWidget(widget));
                break;
            case Type.IMAGE:
                parsedWidgets.push(imageWidget(widget));
                break;
            case Type.BUTTON_SET:
                parsedWidgets.push(getButtonSetWidget(widget));
                break;
            case Type.IMAGE_BUTTON:
                parsedWidgets.push(imageButtonWidget(widget));
                break;
            case Type.GRID:
                parsedWidgets.push(getGridWidget(widget));
                break;
            case Type.TEXT_BUTTON:
                parsedWidgets.push(textButtonWidget(widget));
                break;
            case Type.KEY_VALUE:
                parsedWidgets.push(keyValueWidget(widget));
                break;
            case Type.TEXT_INPUT:
                parsedWidgets.push(textInputWidget(widget));
                break;
            case Type.RADIO:
            case Type.CHECK_BOX:
            case Type.DROPDOWN:
                parsedWidgets.push(selectionInputWidget(widget));
                break;
        }
        pushIf(parsedWidgets, makeFetchMoreWidget(widget, sectionIndex, index));
        if (widget.spaceAfter && (index + numSeparators + 2 < start + max) && index < widgets.length - 1) {
            parsedWidgets.push(textWidget({ content: "\r" }));
            numSeparators++;
            if (isCollapsible && numUncollapsible) {
                numUncollapsible++;
            }
        }
        pushIf(parsedWidgets, makeMultiplyWidget(config, widget, sectionIndex, index));
    }
    if (!parsedWidgets.length) {
        return;
    }
    parsedWidgets.forEach(w => section.addWidget(w));
    var fetcher = getByProperty(sectionConfig.widgets, "id", "fetcher");
    if (more && !fetcher) {
        var fetchParams = copyObject(more, {
            card: copyObject(config, {}),
            section: sectionIndex
        });
        fetcher = {
            icon: Icon.DOWNLOAD,
            state: State.HIDDEN,
            title: "Load more " + more.entity,
            id: "fetcher",
            click: { callback: "fetch", params: fetchParams }
        };
        fetchParams.card.sections[sectionIndex].widgets.push(copyObject(fetcher, {}));
        section.addWidget(keyValueWidget({ content: "\r" }));
        section.addWidget(keyValueWidget(fetcher));
    }
    else if (more) {
        section.addWidget(keyValueWidget({ content: "\r" }));
        section.addWidget(keyValueWidget(fetcher));
    }
    header && section.setHeader(header);
    const backAndNext = [];
    if (start > 0) {
        isCollapsible = false;
        backAndNext.push(getBackButtonConfig(config, sectionConfig, sectionIndex, start, max));
    }
    if ((start + max - numSeparators < widgets.length)) {
        backAndNext.push(getNextButtonConfig(config, sectionIndex, start, max, numSeparators));
    }
    if (backAndNext.length > 0) {
        section.addWidget(getButtonSetWidget({ content: backAndNext }));
    }
    if (isCollapsible) {
        section.setCollapsible(isCollapsible);
        section.setNumUncollapsibleWidgets(numUncollapsible);
    }
    return section;
});
var card = errorDecorator((err) => timestamp(`card is misconfigured`, err, "warning"), (config) => {
    const builder = CardService.newCardBuilder();
    const { actions = [], build = true, header, name, sections = [] } = config;
    header && builder.setHeader(cardHeader(header));
    name && builder.setName(name);
    const MAX_WIDGETS = +getGlobal_("MAX_WIDGETS", "12");
    if (!sections.length) {
        throw new Error("Cards should have at least one section");
    }
    const parsedSections = sections.map((s, i) => {
        s.max = s.max || MAX_WIDGETS;
        s.numUncollapsible = s.numUncollapsible || 0;
        return section(config, i);
    });
    parsedSections.filter(Boolean).forEach((s) => builder.addSection(s));
    actions.forEach(action => builder.addCardAction(cardAction(action)));
    return build ? builder.build() : builder;
});
var deck = (config) => ensureArray(config).map(card);
var Fetcher = class {
    static isSuccess(response) {
        const { code } = response;
        return code >= 200 && code < 300;
    }
};
function fetchAuthorized(config, auth, payload) {
    if (!config || !config.url)
        throw new URIError("no url property or config object provided");
    if (!auth)
        auth = {};
    try {
        var params = {
            method: (config.method || "get").toLowerCase(),
            muteHttpExceptions: true,
            contentType: config.type || Mime.JSON,
        };
        params.headers = config.headers || {};
        if (params.method !== "get" && payload) {
            switch (params.contentType) {
                case Mime.FORM:
                    if (typeof payload === "object")
                        params.payload = JSONtoQuery(payload);
                    break;
                default: params.payload = JSON.stringify(payload);
            }
        }
        var query = JSONtoQuery(config.params);
        var url = config.url + (query.length ? "?" + query : "");
        switch (auth.type) {
            case Auth.QUERY:
                url += (query.length ? "&" : "?") + JSONtoQuery(auth.query);
                break;
            case Auth.API_TOKEN:
                if (auth.query) {
                    url += "&" + auth.query + "=" + auth.token;
                }
                if (auth.basic) {
                    params.headers.Authorization = "Basic " + Utilities.base64Encode(auth.token + auth.basic);
                }
                break;
            case Auth.BASIC:
                params.headers.Authorization = "Basic " + Utilities.base64Encode((auth.id + ":" + auth.pass) || auth.token);
                break;
            case Auth.OAUTH2:
                if (auth.token) {
                    params.headers.Authorization = "Bearer " + auth.token;
                }
                else {
                }
                break;
            case Auth.SERVICE:
                var token = auth.token;
                if (!token) {
                    var serviceSA = serviceAccount(auth);
                    if (serviceSA) {
                        try {
                            if (serviceSA.hasAccess()) {
                                serviceSA.exchangeJwt_();
                                switch (auth.tokenType) {
                                    case Token.ID:
                                        token = serviceSA.getIdToken();
                                        break;
                                    default: token = serviceSA.getAccessToken();
                                }
                            }
                            else {
                                timestamp("service account not authorized", {
                                    error: serviceSA.getLastError(),
                                    name: auth.name || "name not provided",
                                    type: "fetch"
                                }, "warning");
                            }
                        }
                        catch (serviceError) {
                            timestamp("error during service account", {
                                error: serviceError,
                                name: auth.name || "name not provided",
                                type: "fetch"
                            }, "error");
                        }
                    }
                }
                if (token) {
                    params.headers.Authorization = "Bearer " + token;
                }
                break;
            default:
        }
        if (config.encode || config.encode === undefined)
            url = encodeURI(url);
        var response = UrlFetchApp.fetch(url, params);
        var code = response.getResponseCode();
        var heads = response.getAllHeaders();
        if (config.retry && !isNaN(+config.retry) && code > 400) {
            while (+config.retry) {
                response = UrlFetchApp.fetch(url, params);
                +config.retry--;
            }
        }
        if (config.followLocation && code === 201 && heads["Location"]) {
            config.url = heads["Location"];
            return fetchAuthorized(config, auth, payload);
        }
        return handleResponse(response, { config, auth, payload });
    }
    catch (error) {
        return handleRequestError_(error);
    }
}
function handleRequestError_(error) {
    console.warn("HTTP request failed due to: %s", error);
    var card = generateCard(true);
    card.header.title = "Request failed";
    card.sections[0].widgets[0] = {
        type: Type.KEY_VALUE,
        content: "Request to the endpoint failed"
    };
    return {
        code: 0,
        headers: {},
        content: error,
        defaultCard: card
    };
}
function handleResponse(response, request) {
    var code = response.getResponseCode();
    var headers = response.getAllHeaders();
    var content = response.getContentText();
    for (var key in headers) {
        var lcased = key.toLowerCase();
        if (lcased !== key) {
            headers[lcased] = headers[key];
            delete headers[key];
        }
    }
    var card = generateCard(true);
    switch (code) {
        case 201:
            card.header.title = "Created";
            card.sections[0].widgets[0] = {
                content: "The resource was successfully created"
            };
            if (headers["location"])
                card.sections[0].widgets.push({
                    title: "Location available",
                    content: "The newly created resource is available at\n" + headers["location"]
                });
            break;
        case 202:
            card.header.title = "Accepted";
            card.sections[0].widgets[0] = {
                content: "The request was received and is accepted"
            };
            break;
        case 203:
            card.header.title = "Non-Authoritative Information";
            card.sections[0].widgets[0] = {
                content: "The request was successful and the response payload is transformed"
            };
            break;
        case 204:
            card.header.title = "No Content";
            card.sections[0].widgets[0] = {
                content: "The request was successful and nothing is returned by the service"
            };
            break;
        case 205:
            card.header.title = "Reset Content";
            card.sections[0].widgets[0] = {
                content: "The response asked to reset the document view (debug info)"
            };
            break;
        case 206:
            card.header.title = "Partial Content";
            card.sections[0].widgets[0] = {
                content: "The response body contains only partial data"
            };
            break;
        case 400:
            card.header.title = "Bad request";
            card.sections[0].widgets[0] = {
                content: "The request is malformed or the service could not handle it correctly"
            };
            break;
        case 401:
            card.header.title = "Unauthorized";
            if (headers["www-authenticate"]) {
            }
            break;
        case 402:
            card.header.title = "Payment Required";
            break;
        case 403:
            card.header.title = "Forbidden";
            card.sections[0].widgets[0] = {
                content: "The requested service refused to connect"
            };
            break;
        case 404:
            card.header.title = "Not found";
            break;
        case 405:
            card.header.title = "Method Not Allowed";
            card.sections[0].widgets[0] = {
                content: "The request was made with method not allowed by the service"
            };
            if (request) {
                card.sections[0].widgets.push({
                    title: "Current method",
                    content: (request.config.method || "GET").toUpperCase()
                }, {
                    title: "Allowed methods",
                    content: ""
                });
            }
            break;
        case 406:
            card.header.title = "Not Acceptable";
            break;
        case 408:
            card.header.title = "Request Timeout";
            break;
        case 409:
            card.header.title = "Conflict";
            break;
        case 411:
            if (request && request.payload) {
                request.config.headers = request.config.headers || {};
                request.config.headers["Content-Length"] = request.payload;
                response = fetchAuthorized(request.config, request.auth, request.payload);
                return handleResponse(response, request);
            }
            break;
        case 412:
            card.header.title = "Precondition failed";
            if (request && request.config) {
                request.config.headers = request.config.headers || {};
                if (request.config.headers["if-unmodified-since"])
                    card.sections[0].widgets[0] = {
                        content: "The requested resource has been modified after " + new Date(request.config.headers["if-unmodified-since"]).toLocaleString()
                    };
            }
            break;
        case 413:
            card.header.title = "Payload too large";
            card.sections[0].widgets[0] = {
                content: "Request payload is too large for the service to handle"
            };
            break;
        case 414:
            card.header.title = "URI Too long";
            card.sections[0].widgets[0] = {
                content: "Consider shortening the URI provided - the service could not handle it"
            };
            break;
        case 415:
            card.header.title = "Unsupported Media Type";
            card.sections[0].widgets[0] = {
                content: "The payload format is unsupported by the service"
            };
            break;
        case 416:
            card.header.title = "Range Not Satisfiable";
            card.sections[0].widgets[0] = {
                content: "The requested range could not be returned by the service"
            };
            if (headers["content-range"]) {
                var range416 = parseContentRangeHeader(headers["content-range"]);
                card.sections[0].widgets.push({
                    title: "Expected range",
                    content: "Units: " + range416.units + "\rFull: " + range416.full
                });
            }
            break;
        case 417:
            card.header.title = "Expectation Failed";
            card.sections[0].widgets[0] = {
                content: "The service could not meet the request's expectations"
            };
            break;
        case 418:
            card.header.title = "I'm a teapot";
            card.sections[0].widgets[0] = {
                content: "You can't brew coffee in a teapot"
            };
            break;
        case 422:
            card.header.title = "Unprocessable Entity";
            card.sections[0].widgets[0] = {
                content: "The request could not be processed by the service"
            };
            break;
        case 425:
            card.header.title = "Too Early";
            break;
        case 426:
            card.header.title = "Upgrade Required";
            card.sections[0].widgets[0] = {
                content: "The service requires an upgrade to a different protocol"
            };
            if (headers["upgrade"]) {
                card.sections[0].widgets.push({
                    title: "Requested upgrade",
                    content: "The service requested an upgrade to " + (headers["upgrade"].split(/,\s*/).join(", "))
                });
            }
            break;
        case 428:
            card.header.title = "Precondition Required";
            card.sections[0].widgets[0] = {
                content: "The request should be made conditional"
            };
            break;
        case 429:
            card.header.title = "Too many requests";
            card.sections[0].widgets[0] = {
                content: "The request exceeded service's rate or quota limit - try again later"
            };
            if (headers["retry-after"]) {
                var retry429 = headers["retry-after"];
                card.sections[0].widgets.push({
                    title: "Wait estimate",
                    content: "The request should be allowed" + (isNaN(+retry429) ? retry429 = " after \r\n" + new Date(retry429).toLocaleString() : " in " + +retry429 / 3600 + " H")
                });
            }
            break;
        case 451:
            card.header.title = "Unavailable For Legal Reasons";
            card.sections[0].widgets[0] = {
                content: "The requested resource is unavailable due to legal reasons"
            };
            break;
        case 500:
            card.header.title = "Internal Server Error";
            card.sections[0].widgets[0] = {
                content: "The service could not handle the request due to an internal problem"
            };
            break;
        case 501:
            card.header.title = "Not Implemented";
            var method501 = "GET";
            if (request && request.config.method)
                method501 = request.config.method.toUpperCase();
            card.sections[0].widgets[0] = {
                content: "The " + method501 + " method used with the request is not yet implemented by the service"
            };
            if (headers["retry-after"]) {
                var retry501 = headers["retry-after"];
                card.sections[0].widgets.push({
                    title: "Implementation estimate",
                    content: "The method should be implemented" + (isNaN(+retry501) ? retry501 = " after \r\n" + new Date(retry501).toLocaleString() : " in " + +retry501 / 3600 + " H")
                });
            }
            break;
        case 502:
            card.header.title = "Bad Gateway";
            card.sections[0].widgets[0] = {
                content: "The service gateway could not handle the request"
            };
            break;
        case 503:
            card.header.title = "Service Unavailable";
            card.sections[0].widgets[0] = {
                content: "The service is temporarily unavailable - try again later"
            };
            if (headers["retry-after"]) {
                var retry503 = headers["retry-after"];
                card.sections[0].widgets.push({
                    title: "Estimated downtime",
                    content: "The service should be available" + (isNaN(+retry503) ? retry503 = " after \r\n" + new Date(retry503).toLocaleString() : " in " + +retry503 / 3600 + " H")
                });
            }
            break;
        case 504:
            card.header.title = "Gateway Timeout";
            card.sections[0].widgets[0] = {
                content: "The service gateway could not get the response in time"
            };
            break;
        case 505:
            card.header.title = "HTTP Version Not Supported";
            card.sections[0].widgets[0] = {
                content: "The HTTP version used by the request is not supported by the service"
            };
            break;
        case 506:
            card.header.title = "Variant Also Negotiates";
            card.sections[0].widgets[0] = {
                content: "Content negotiation with the service failed due to an internal service problem"
            };
            break;
        case 511:
            card.header.title = "Network Authentication Required";
            card.sections[0].widgets[0] = {
                content: "You are required to authenticate to the network the service uses"
            };
            break;
        default:
            card.header.title = "Success";
            card.sections[0].widgets[0] = {
                content: "The request was successful and returned nothing in response"
            };
    }
    return {
        code: code,
        headers: headers,
        content: content,
        defaultCard: card,
        isFailure: function () {
            return code >= 400 || code === 0;
        },
        isSuccess: function () {
            return code >= 200 && code < 300;
        }
    };
}
function validateMethod(method) {
    if (!method || typeof method !== "string")
        return false;
    var mRegExp = /(^connect$)|(^get$)|(^head$)|(^put$)|(^post$)|(^delete$)|(^options$)|(^trace$)|(^patch$)/i;
    return mRegExp.test(method);
}
function parseAuthenticateHeader(header) {
    var authenticate = {
        schema: null,
        realm: null
    };
    if (!header || typeof header !== "string")
        return authenticate;
    var aRegExp = /(?:WWW-Authenticate|Proxy-Authenticate)\s+(Basic|Bearer|Digest|HOBA|Mutual|OAuth)(?=\s+realm="(.+)"|\s*$)/;
    var matched = header.match(aRegExp);
    if (!matched)
        return authenticate;
    authenticate.schema = matched[1] || null;
    authenticate.realm = matched[2] || null;
    return authenticate;
}
function parseContentRangeHeader(header) {
    var range = {
        units: null,
        start: null,
        end: null,
        full: null
    };
    if (!header || typeof header !== "string")
        return range;
    var rRegExp = /(\w+)\s+(?:(\d+)\-(\d+)|(\*))(?=\/(?:(\d+)|(\*)))/;
    var matched = header.match(rRegExp);
    range.units = matched[1] || "bytes";
    range.start = +matched[2] || null;
    range.end = +matched[3] || null;
    range.full = +matched[5] || null;
    return range;
}
function acceptsPayload(method) {
    if (!validateMethod(method))
        return false;
    switch (method.toUpperCase()) {
        case "GET":
        case "CONNECT":
        case "OPTIONS":
        case "TRACE":
        case "HEAD":
            return false;
            break;
        default: return true;
    }
}
function getGlobal_(key, def) {
    const props = PropertiesService.getScriptProperties();
    const value = props.getProperty(key);
    if (value === null && def !== void 0) {
        return def;
    }
    try {
        return JSON.parse(value);
    }
    catch (e) {
    }
    return value;
}
function getProperty(key) {
    var props = PropertiesService.getUserProperties();
    var value = props.getProperty(key);
    try {
        value = JSON.parse(value);
    }
    catch (e) {
    }
    return value;
}
function getProperties() {
    var props = PropertiesService.getUserProperties();
    var values = props.getProperties();
    try {
        values = JSON.parse(values);
    }
    catch (e) {
    }
    return values;
}
function setProperty(key, value) {
    var props = PropertiesService.getUserProperties();
    try {
        value = JSON.stringify(value);
    }
    catch (e) {
    }
    props.setProperty(key, value);
}
function getFromStore(store, key) {
    var value = store.getProperty(key);
    try {
        value = JSON.parse(value);
    }
    catch (error) {
    }
    return value;
}
function setToStore(store, key, value) {
    try {
        value = JSON.stringify(value);
    }
    catch (error) {
    }
    store.setProperty(key, value);
}
function clearStore(store) {
    store.deleteAllProperties();
}
function setProperties(properties) {
    var props = PropertiesService.getUserProperties();
    for (var key in properties) {
        var value = properties[key];
        try {
            properties[key] = JSON.stringify(value);
        }
        catch (e) {
        }
    }
    props.setProperties(properties);
}
function deleteProperty(key) {
    var props = PropertiesService.getUserProperties();
    props.deleteProperty(key);
}
function deleteAllProperties() {
    var props = PropertiesService.getUserProperties();
    props.deleteAllProperties();
}
function initialize(g, identifier) {
    if (!g.paginate) {
        g.paginate = function (e) {
            var params = e.parameters;
            return this[identifier].actionResponse({
                event: e,
                reload: {
                    card: JSON.parse(params.card)
                }
            });
        };
    }
    if (!g.MULTIPLY) {
        g.MULTIPLY = function (e) {
            try {
                var params = e.parameters;
                var card = JSON.parse(params.card);
                var sIdx = +params.section;
                var wIdx = +params.widget;
                var multiplied = card.sections[sIdx].widgets[wIdx];
                if (multiplied) {
                    card.sections[sIdx].widgets.splice(wIdx + 1, 0, copyObject(multiplied, {}));
                }
                return this[identifier].actionResponse({
                    event: e,
                    reload: {
                        card: card
                    }
                });
            }
            catch (error) {
                timestamp("failed to add widget", {
                    error: error,
                    type: "multiply"
                }, "warning");
                return this[identifier].actionResponse({
                    event: e,
                    notify: "Failed to add another widget"
                });
            }
        };
    }
}
function mute(onerror, muted, context) {
    if (!typeof muted === "function")
        throw new Error("Only functions can be muted");
    (context || this)[muted.name] = function () {
        try {
            return muted.apply(context || null, Array.prototype.slice.call(arguments));
        }
        catch (error) {
            if (onerror) {
                return onerror.bind(context || this, error).call();
            }
            else {
                console.log(error);
            }
        }
    };
}
function save(config) {
    var data = config.data;
    data.timestamp = [new Date().toUTCString()];
    var loaded = getProperty(config.name);
    if (loaded) {
        for (var key in data) {
            loaded[key] = data[key];
        }
        if (!config.keep) {
            if (config.fields) {
                if (typeof config.fields === "string") {
                    config.fields = config.fields.split(",");
                }
                config.fields.forEach(function (field) {
                    if (!data[field]) {
                        delete loaded[field];
                    }
                });
            }
            else {
                for (var key in loaded) {
                    if (!data[key]) {
                        delete loaded[key];
                    }
                }
            }
        }
        else if (config.current) {
            if (!data[config.current])
                delete loaded[config.current];
        }
        setProperty(config.name, loaded);
    }
    else {
        setProperty(config.name, data);
    }
    if (config.respond) {
        return actionResponse(config.respond);
    }
}
function load(config) {
    var saved = getProperty(config.name);
    if (saved) {
        var tstamp = new Date(saved.timestamp[0]);
        if (config.sections) {
            config.sections.forEach(function (i) {
                preserve_(saved, i.widgets, true);
            });
            var show = config.show || [];
            if (show.length > 0) {
                var utility = {
                    widgets: []
                };
                show.forEach(function (sh) {
                    switch (sh) {
                        case Show.UPDATED:
                            utility.widgets.push({
                                type: Type.KEY_VALUE,
                                icon: "CLOCK",
                                title: "Last updated",
                                content: tstamp.toLocaleString()
                            });
                            break;
                        case Show.RESET:
                            utility.widgets.push({
                                type: Type.KEY_VALUE,
                                icon: Icon.RESET,
                                content: "Reset all settings",
                                click: { callback: "reset" },
                                spaceBefore: true
                            });
                            break;
                    }
                });
                config.sections.push(utility);
            }
            saved.sections = config.sections;
        }
    }
    return saved;
}
function reset(config) {
    deleteAllProperties();
    if (config.respond) {
        return actionResponse(config.respond);
    }
}
const authStrategy = (widget, { url }) => {
    if (!("setAuthorizationAction" in widget)) {
        return widget;
    }
    const auc = CardService.newAuthorizationAction();
    auc.setAuthorizationUrl(url);
    widget.setAuthorizationAction(auc);
    return widget;
};
const changeStrategy = (widget, { ...config }) => {
    if (!("setOnChangeAction" in widget)) {
        return widget;
    }
    widget.setOnChangeAction(actionBuilder(config));
    return widget;
};
const clickStrategy = (widget, { ...config }) => {
    if (!("setOnClickAction" in widget)) {
        return widget;
    }
    widget.setOnClickAction(actionBuilder(config));
    return widget;
};
const composeStrategy = (widget, { standalone, ...config }) => {
    if (!("setComposeAction" in widget)) {
        return widget;
    }
    const { ComposedEmailType: { REPLY_AS_DRAFT, STANDALONE_DRAFT } } = CardService;
    const etype = standalone ? STANDALONE_DRAFT : REPLY_AS_DRAFT;
    widget.setComposeAction(actionBuilder(config), etype);
    return widget;
};
const suggestStrategy = (widget, { ...config }) => {
    if (!("setSuggestionsAction" in widget)) {
        return widget;
    }
    widget.setSuggestionsAction(actionBuilder(config));
    return widget;
};
const openLinkStrategy = (widget, { ...config }) => {
    if (!("setOpenLink" in widget)) {
        return widget;
    }
    const { url, callback } = config;
    if (!url && !callback) {
        throw new Error("Link config should have callback name or Url set");
    }
    if (url) {
        widget.setOpenLink(openLink(config));
    }
    if (callback) {
        widget.setOnClickOpenLinkAction(actionBuilder(config));
    }
    return widget;
};
function initialize_() {
    var sp = PropertiesService.getScriptProperties();
    sp.setProperties({
        MAX_WIDGETS: "12"
    });
}
function cardConfirm(params, build) {
    const { cancel, confirm, prompt } = params;
    var confirmParams = JSON.parse(confirm);
    var cancelParams = JSON.parse(cancel);
    var confirmer = {
        build,
        header: {
            title: "Confirm action"
        },
        sections: [{
                widgets: [{
                        icon: Icon.WARNING,
                        content: prompt || "You are about to perform a sensitive action. Please, confirm"
                    }, {
                        type: Type.BUTTON_SET,
                        content: [
                            { type: Type.TEXT_BUTTON, text: "Confirm", click: confirmParams },
                            { type: Type.TEXT_BUTTON, text: "Cancel", click: cancelParams }
                        ]
                    }]
            }]
    };
    return card(confirmer);
}
function paginate() { }
const validateKeyValueConfig = (widgetConfig, validType) => {
    const { name, state, type } = widgetConfig;
    if (type || name || state === State.EDITABLE) {
        return widgetConfig;
    }
    widgetConfig.type = validType;
    return widgetConfig;
};
const validateTextInputConfig = (widgetConfig, validType) => {
    const { type, name } = widgetConfig;
    if (type || !name) {
        return widgetConfig;
    }
    widgetConfig.type = validType;
    return widgetConfig;
};
const validateEditableConfig = (config, sectionIdx = 0, widgetIdx = 0) => {
    const { state } = config;
    if (state !== State.EDITABLE) {
        return config;
    }
    return {
        ...config,
        click: {
            callback: "edit",
            params: propertiesToString({
                card: config,
                section: sectionIdx,
                index: widgetIdx
            })
        }
    };
};
const validateConfig = (widgetConfig, sectionIndex, widgetIndex) => {
    const kvValid = validateKeyValueConfig(widgetConfig, Type.KEY_VALUE);
    const tiValid = validateTextInputConfig(kvValid, Type.TEXT_INPUT);
    return validateEditableConfig(tiValid, sectionIndex, widgetIndex);
};
const makeFetchMoreWidget = (config, sectionIndex = 0, widgetIndex = 0) => {
    const { more } = config;
    if (!more) {
        return;
    }
    const moreParams = copyObject(more, {
        card: copyObject(config, {}),
        section: sectionIndex,
        widget: widgetIndex
    });
    const { entity } = more;
    return keyValueWidget({
        title: `Load more ${entity || "info"}`,
        click: {
            callback: "fetch",
            params: moreParams
        }
    });
};
const makeMultiplyWidget = (cardConfig, widgetConfig, sectionIdx = 0, widgetIdx = 0) => {
    const { multiply } = widgetConfig;
    if (!multiply) {
        return;
    }
    return keyValueWidget({
        title: "add more",
        click: {
            callback: "MULTIPLY",
            params: {
                card: copyObject(cardConfig, {}),
                section: sectionIdx,
                widget: widgetIdx
            }
        }
    });
};
const defineIfNot = (obj, prop, value) => {
    if (!(prop in obj)) {
        obj[prop] = value;
    }
    return obj;
};
const getBackButtonConfig = (cardConfig, sectionConfig, index, start, max) => {
    const { separators } = sectionConfig;
    const prevSeparators = separators[separators.length - 1];
    const decrement = start - max + prevSeparators;
    const backCopy = copyObject(cardConfig, {});
    const section = backCopy.sections[index];
    section.start = (decrement > 0 ? decrement : 0);
    defineIfNot(section, "separators", []);
    section.separators.pop();
    return {
        text: "back",
        click: {
            callback: "paginate",
            params: {
                card: JSON.stringify(backCopy)
            }
        }
    };
};
const getNextButtonConfig = (cardConfig, index, start, max, numSeparators) => {
    const increment = start + max - numSeparators;
    const nextCopy = copyObject(cardConfig, {});
    const section = nextCopy.sections[index];
    section.start = increment;
    defineIfNot(section, "separators", []);
    section.separators.push(numSeparators);
    return {
        text: "next",
        click: {
            callback: "paginate",
            params: { card: JSON.stringify(nextCopy) }
        }
    };
};
function cardHeader(config) {
    const header = CardService.newCardHeader();
    const { alt, crop, image, subtitle, title } = config;
    if (!title) {
        throw new Error("Title is required for Card headers");
    }
    header.setTitle(title);
    subtitle && header.setSubtitle(subtitle);
    if (image) {
        header.setImageUrl(image);
        crop && header.setImageStyle(CardService.ImageStyle.CIRCLE);
        header.setImageAltText(alt || title.toLowerCase());
    }
    return header;
}
function navigation(sequence = []) {
    const navigation = CardService.newNavigation();
    const actionMap = {
        named: (value) => navigation.popToNamedCard(value),
        pop: () => navigation.popCard(),
        push: (card) => navigation.pushCard(card),
        root: () => navigation.popToRoot(),
        update: (card) => navigation.updateCard(card)
    };
    sequence.forEach((action) => {
        switch (action) {
            case "root":
                actionMap.root();
                break;
            case "pop":
                actionMap.pop();
                break;
            default:
                if (is.str(action)) {
                    return;
                }
                const { apply } = action;
                Object.entries(action).forEach(errorDecorator((err) => console.warn(`something went wrong during nav: ${err}`), ([type, value]) => {
                    const built = convertToCard_(value, apply);
                    const card = is.arr(built) ? built[0] : built;
                    actionMap[type](card || value);
                }));
        }
    });
    return navigation;
}
function convertToCard_(input, args = []) {
    let output;
    switch (typeof input) {
        case "function":
            output = input.apply(null, args);
            break;
        case "object":
            if (!("printJson" in input) && input.sections) {
                output = card(input);
            }
            break;
    }
    return output || input;
}
const notification = (text = "") => {
    const msg = CardService.newNotification();
    msg.setText(text);
    return msg;
};
const verifyAction = ({ auth, change, click, link, compose }) => {
    if ([auth, change, click, compose, link].every((a) => !a)) {
        throw new Error("must have an action set");
    }
};
function cardAction(config) {
    const cardAction = CardService.newCardAction();
    const { text = "" } = config;
    verifyAction(config);
    cardAction.setText(text);
    actionDecorator(cardAction, config);
    return cardAction;
}
var Responder = (() => {
    return {
        notify(text) {
            const builder = CardService.newActionResponseBuilder();
            builder.setNotification(notification(text));
            return builder.build();
        }
    };
})();
const reloadStrategy = (builder, reload, event) => {
    const { type, callback, card: cardConfig, apply = [] } = reload;
    let nav;
    switch (type) {
        case Reload.ACTION:
            if (!event) {
                throw new Error("Response with card reload via action should be passed an event object");
            }
            nav = navigation([{ update: reload.card(event) }]);
            break;
        case Reload.CALLBACK:
            const result = callback.apply(null, apply);
            const update = "printJson" in result ? result : card(result);
            nav = navigation([{ update }]);
            break;
        default: nav = navigation([{ update: card(cardConfig) }]);
    }
    builder.setNavigation(nav);
    return builder;
};
function actionResponse(config) {
    const { display, event, link, navigate, notify, refresh, reload, type } = config;
    let builder;
    switch (type) {
        case Response.UNIVERSAL:
            builder = CardService.newUniversalActionResponseBuilder();
            if (!display && !link) {
                throw new Error("Universal Action response should either display cards or open a link");
            }
            builder.displayAddOnCards(display);
            break;
        case Response.COMPOSE:
            builder = CardService.newComposeActionResponseBuilder();
            break;
        default:
            builder = CardService.newActionResponseBuilder();
            if (!navigate && !notify && !reload) {
                throw new Error("Action response should result in notification or navigation");
            }
            if (reload) {
                reloadStrategy(builder, reload, event);
            }
            if (navigate) {
                builder.setNavigation(navigation(navigate));
            }
            if (notify) {
                builder.setNotification(notification(notify));
            }
            if (refresh) {
                builder.setStateChanged(true);
            }
    }
    return builder.build();
}
function openLink(config) {
    const open = CardService.newOpenLink();
    if (isStr(config)) {
        config = { url: config };
    }
    const { reload = false, tab = true, url } = config;
    if (!url) {
        throw new Error("Open link should have a Url set");
    }
    const { OpenAs: { FULL_SIZE, OVERLAY }, OnClose: { RELOAD_ADD_ON, NOTHING } } = CardService;
    open.setUrl(url);
    open.setOpenAs(tab ? OVERLAY : FULL_SIZE);
    open.setOnClose(reload ? RELOAD_ADD_ON : NOTHING);
    return open;
}
const textWidget = (config) => {
    const widget = CardService.newTextParagraph();
    widget.setText(validateContent_(config));
    return widget;
};
function selectionInputWidget(config = {}) {
    const { content = [], name, select, title, type = Type.CHECK_BOX } = config;
    const widget = CardService.newSelectionInput();
    widget.setFieldName(name);
    widget.setType(CardService.SelectionInputType[type]);
    title && widget.setTitle(title);
    actionDecorator(widget, config);
    const selected = content.map((o) => {
        const { value } = o;
        return { ...o, selected: select !== void 0 ? select === value : o.selected };
    });
    if (!selected.some((o) => o.selected) && type !== Type.CHECK_BOX) {
        selected[0].selected = true;
    }
    selected.forEach(({ selected = false, text, value }) => widget.addItem(text, value, selected));
    return widget;
}
const validateContent_ = ({ content = "" }) => is.date(content) ? content.toLocaleDateString() : is.arr(content) ? content.join(",") : is.obj(content) ? JSON.stringify(content) : content;
function textInputWidget(config) {
    const widget = CardService.newTextInput();
    const { name, multiline = false } = config;
    widget.setFieldName(name);
    widget.setMultiline(multiline);
    labelDecorator(widget, config);
    widget.setValue(validateContent_(config));
    actionDecorator(widget, config);
    suggestionDecorator(widget, config);
    return widget;
}
const getButtonSetWidget = (config) => {
    const { content } = config;
    const buttons = content.map((btn) => {
        const { type } = btn;
        return type === Type.IMAGE_BUTTON ? imageButtonWidget(btn) : textButtonWidget(btn);
    });
    const widget = CardService.newButtonSet();
    for (const button of buttons) {
        widget.addButton(button);
    }
    return widget;
};
const textButtonWidget = errorDecorator((err) => console.warn(`failed to create TextButton: ${err}`), (config) => {
    const { background, color, colour, disabled = false, filled = false, text } = config;
    const widget = CardService.newTextButton();
    const locColor = (colour || color);
    const validatedText = text || validateContent_(config);
    widget.setText(locColor ? Formatter.colorize(locColor, validatedText) : validatedText);
    widget.setDisabled(disabled);
    if (filled) {
        widget.setTextButtonStyle(CardService.TextButtonStyle.FILLED);
        widget.setBackgroundColor(background || locColor);
    }
    return actionDecorator(widget, config);
});
const imageButtonWidget = errorDecorator((err) => console.warn(`failed to create ImageButton: ${err}`), (config) => {
    const widget = CardService.newImageButton();
    const { alt } = config;
    if (!alt) {
        throw new Error("ImageButton should have alt text set");
    }
    widget.setAltText(alt);
    iconDecorator(widget, config);
    actionDecorator(widget, config);
    return widget;
});
const imageWidget = errorDecorator((err) => console.warn(`failed to create ImageWidget: ${err}`), (config) => {
    const widget = CardService.newImage();
    const { alt, content, src } = config;
    if (!src && !content) {
        throw new Error("Image widget should have an image set");
    }
    widget.setImageUrl(src || validateContent_(config));
    if (!alt) {
        throw new Error("Image widget should have alt text set");
    }
    widget.setAltText(alt);
    actionDecorator(widget, config);
    return widget;
});
const getSwitchWidget = (config) => {
    const { name, selected = false, value = "" } = config;
    const toggle = CardService.newSwitch();
    toggle.setFieldName(name);
    toggle.setSelected(selected);
    toggle.setValue(value);
    actionDecorator(toggle, config);
    return toggle;
};
const getGridItemWidget = (config) => {
    const { subtitle, id, valign = "below" } = config;
    const item = CardService.newGridItem();
    item.setIdentifier(id.toString());
    item.setLayout(CardService.GridItemLayout[`TEXT_${valign.toUpperCase()}`]);
    if (subtitle)
        item.setSubtitle(subtitle.toString());
    return labelDecorator(item, config);
};
const getGridWidget = (config) => {
    const { columns = 1, content } = config;
    const grid = CardService.newGrid();
    grid.setNumColumns(columns);
    content.forEach((c) => grid.addItem(getGridItemWidget(c)));
    labelDecorator(grid, config);
    return actionDecorator(grid, config);
};
const getDecoratedTextWidget = (config) => {
    const { lines = [], switchConfig, buttonConfig, label, multiline = true, } = config;
    if (buttonConfig && switchConfig) {
        throw new Error("KeyValue widgets cannot have both Button and Switch set");
    }
    const widget = CardService.newDecoratedText();
    widget.setWrapText(multiline);
    const validContent = validateContent_(config);
    const text = (validContent ? [validContent, ...lines] : lines).join("\n");
    widget.setText(text);
    if (label) {
        buttonDecorator(widget, {
            text: label,
            disabled: true,
            click: {
                callback: label
            },
        });
    }
    buttonDecorator(widget, buttonConfig);
    switchConfig && widget.setSwitchControl(getSwitchWidget(switchConfig));
    actionDecorator(widget, config);
    iconDecorator(widget, config);
    labelDecorator(widget, config);
    return widget;
};
const keyValueWidget = errorDecorator((err) => console.warn(`failed to create KeyValue: ${err}`), (config) => getDecoratedTextWidget(config));
const hasAction = ({ suggest, click, change, auth, link }) => ({
    action: !!(suggest || click || change || auth || link)
});
function passesTests() {
    var suite = new TestSuite_("Library");
    var test1 = new Test_("Call with no parameters").whenTesting(fetchAuthorized).shouldFail(URIError);
    var test2 = new Test_("Call with empty params").whenTesting(fetchAuthorized).withParams({}).shouldFail(URIError);
    var test3 = new Test_("Query from JSON").whenTesting(JSONtoQuery).withParams({
        nullable: null,
        undefinable: undefined,
        emptyObject: {},
        emptyArray: [],
        simpleObject: { a: 1, b: 2 },
        simpleArray: [1, 2],
        string: "sample"
    }).shouldInclude("sample", /simpleObject\[\w\]/, /simpleArray\[\d\]/, "string");
    var test4 = new Test_("WWW-Authenticate | Proxy-Authenticate parsing").whenTesting(parseAuthenticateHeader).withParams("WWW-Authenticate Basic realm=\"Shire\"").shouldEqual({
        schema: "Basic",
        realm: "Shire"
    });
    var test5 = new Test_("Partial WWW-Authenticate").whenTesting(parseAuthenticateHeader).withParams("WWW-Authenticate Bearer").shouldEqual({
        schema: "Bearer",
        realm: null
    });
    var test6 = new Test_("unit start-end/full Content-Range").whenTesting(parseContentRangeHeader).withParams("bytes 200-1000/67589").shouldEqual({
        units: "bytes",
        start: 200,
        end: 1000,
        full: 67589
    });
    var test7 = new Test_("unit */full Content-Range").whenTesting(parseContentRangeHeader).withParams("bytes */10000").shouldEqual({
        units: "bytes",
        start: null,
        end: null,
        full: 10000
    });
    suite.addTest(test1, test2, test3, test4, test5, test6, test7);
    suite.testAll();
}
function serviceAccount(auth) {
    try {
        var serviceSA = OA2.createService(Auth.SERVICE + ":" + (auth.name || ""));
        serviceSA.setTokenUrl(auth.tokenUrl || "https://oauth2.googleapis.com/token");
        serviceSA.setPrivateKey(auth.key);
        serviceSA.setIssuer(auth.issuer);
        serviceSA.setScope(auth.scopes || []);
        serviceSA.setPropertyStore(auth.store);
        serviceSA.setCache(auth.cache);
        Logger.log(auth.store);
        auth.store.setProperty("library", "works");
        var claims = {};
        for (var key in auth) {
            switch (key) {
                case "audience":
                    claims.target_audience = auth[key];
                    break;
            }
        }
        if (Object.keys(claims).length > 0) {
            serviceSA.setAdditionalClaims(claims);
        }
        return serviceSA;
    }
    catch (serviceError) {
        timestamp("error during service account", {
            error: serviceError,
            name: auth.name || "name not provided",
            type: "fetch"
        }, "error");
    }
}
function resetSA(auth) {
    var service = serviceAccount(auth);
    if (service) {
        service.reset();
    }
}
function compare() {
    var args = Array.prototype.slice.call(arguments);
    return args.every(function (arg, a) {
        if (a) {
            var previous = args[a - 1];
            if (typeof arg !== typeof previous && !(arg instanceof RegExp) && !(previous instanceof RegExp))
                return false;
            switch (typeof arg) {
                case "function": return Function.prototype.toString.call(arg) === Function.prototype.toString.call(previous);
                case "object":
                    if (arg === null || previous === null)
                        return arg === previous;
                    if (arg instanceof RegExp && (typeof previous === "string" || typeof previous === "number"))
                        return arg.test(previous.toString());
                    var isOK = true;
                    for (var key in arg) {
                        isOK = previous.hasOwnProperty(key) && compare(arg[key], previous[key]);
                        if (!isOK)
                            return false;
                    }
                    for (var key in previous) {
                        isOK = arg.hasOwnProperty(key) && compare(arg[key], previous[key]);
                        if (!isOK)
                            return false;
                    }
                    return isOK;
                default:
                    if ((typeof arg === "string" || typeof arg === "number") && previous instanceof RegExp)
                        return previous.test(arg.toString());
                    return arg === previous;
            }
        }
        else {
            return true;
        }
    });
}
var Formatter = class {
    static anchor(link = "", text = link) {
        return link ? `<a href="${link}">${text}</a>` : text;
    }
    static mailto(email = "", text = email) {
        return email ? `<a href="mailto:${email}">${text}</a>` : text;
    }
    static boldify(text = "") {
        return text && `<b>${text}</b>`;
    }
    static colorize(color = "#000000", text = "") {
        return text && `<font color="${color}">${text}</font>`;
    }
    static format({ anchor, bold, color, email, text } = {}) {
        const maybeColored = color ? Formatter.colorize(color, text) : text;
        const maybeBold = bold ? Formatter.boldify(maybeColored) : maybeColored;
        if (anchor && email) {
            throw new RangeError("cannot set anchor and mailto simultaneously");
        }
        return Formatter.mailto(email, Formatter.anchor(anchor, maybeBold));
    }
};
function concatInPlace(params) {
    var args = Array.prototype.slice.call(arguments);
    Array.prototype.push.apply(args[0], args.slice(1).reduce(function (red, cur) {
        return (red || [red]).concat(cur);
    }));
}
function copyObject(source, target, override) {
    if (!source) {
        return source;
    }
    var transport = {};
    if (source.constructor) {
        transport = new source.constructor;
    }
    for (var key in source) {
        transport[key] = source[key];
    }
    for (var key in target) {
        if (!override && source[key]) {
            transport[key] = target[key];
        }
    }
    return transport;
}
function endsOnOne(input) {
    var result = false;
    var isNum = typeof input === "number";
    var isStr = typeof input === "string";
    if (isNum) {
        var arr = input.toString().split("");
        var li = arr.lastIndexOf("1");
        if (li === arr.length - 1) {
            result = true;
        }
    }
    else if (isStr) {
        return input.lastIndexOf("1") === (input.length - 1);
    }
    return result;
}
function flatten(input, depth) {
    depth = depth || 1;
    var f = [];
    input.forEach(function (el) {
        if ((el instanceof Array) && depth > 1) {
            f = f.concat(flatten(el, depth - 1));
        }
        else if ((el instanceof Array)) {
            f = f.concat(el);
        }
        else {
            f.push(el);
        }
    });
    return f;
}
function generateCard(addHeader, numSections, numWidgets) {
    var card = {
        sections: []
    };
    if (addHeader)
        card.header = { title: "" };
    if (!isNaN(+numSections) && numSections) {
        while (numSections) {
            card.sections.push(generateSection(false, numWidgets));
            numSections--;
        }
    }
    else {
        card.sections.push(generateSection(false, numWidgets));
    }
    return card;
}
function generateSection(addHeader, numWidgets) {
    var section = {
        widgets: []
    };
    if (addHeader)
        section.header = "";
    if (!isNaN(numWidgets) && numWidgets) {
        while (numWidgets) {
            section.widgets.push({});
            numWidgets--;
        }
    }
    else {
        section.widgets.push({});
    }
    return section;
}
function getByProperty(input, name, value) {
    return (input || []).filter(function (element) {
        return compare(element[name], value);
    })[0];
}
function getDeepLastIndex(arr, elem) {
    var lidx = -1;
    for (var curr = 0; curr < arr.length; curr++) {
        var same = compare(arr[curr], elem);
        if (same)
            lidx = curr;
    }
    return lidx;
}
function frost(obj) {
    if (!obj || typeof obj !== "object")
        return obj;
    for (var key in obj) {
        var value = obj[key];
        if (value && typeof value === "object")
            frost(obj[key]);
    }
    return Object.freeze(obj);
}
function indexByProperty(input, name, value) {
    return (input || []).map(function (element, i) {
        if (element[name] === value) {
            return i;
        }
    }).filter(function (f) {
        return f || f === 0;
    })[0];
}
function JSONtoQuery(json, options) {
    if (!options) {
        options = {
            indexed: true
        };
    }
    function deep(obj, seq) {
        var output = [];
        for (var key in obj) {
            if (typeof obj[key] === "object") {
                output.push(deep(obj[key], (seq ? seq + "[" : "") + key + (seq ? "]" : "")));
            }
            else if (obj[key] !== undefined) {
                output.push((seq ? seq + "[" : "") + key + (seq ? "]" : "") + "=" + obj[key]);
            }
        }
        return output.reduce(function (r, c) {
            return r.concat(c);
        }, []);
    }
    return deep(json).join("&");
}
function nest(obj, subs, depth) {
    depth = depth || 0;
    var sub = subs[depth];
    var nsub = subs[depth + 1];
    if (nsub === undefined) {
        obj[sub] = undefined;
        return;
    }
    while (depth < subs.length) {
        if (isNaN(parseInt(nsub))) {
            obj[sub] = obj[sub] || {};
        }
        else {
            obj[sub] = obj[sub] || [];
        }
        return nest(obj[sub], subs, ++depth);
    }
}
function traverseNested(obj, props, value) {
    var depth = 0;
    return function t(o, p, d, v) {
        while (d < p.length) {
            if (v !== undefined & d === p.length - 1) {
                o[p[d]] = v;
            }
            return t(o[p[d]], p, ++d, v);
        }
        return o;
    }(obj, props, depth++, value);
}
function queryToJSON(query) {
    var parameters = {};
    if (query && typeof query === "string") {
        query.split("&").forEach(function (param) {
            var split = param.split("=");
            if (split[0] !== undefined && split[1] !== undefined) {
                parameters[split[0]] = split[1];
            }
        });
    }
    return parameters;
}
function getMessage({ messageMetadata = {} } = {}) {
    const { accessToken, messageId } = messageMetadata;
    if (!messageId) {
        return null;
    }
    GmailApp.setCurrentMessageAccessToken(accessToken);
    return GmailApp.getMessageById(messageId);
}
function handleError(error, cardConfig) {
    timestamp(error.message, error, "error");
    var defCard = {
        header: {
            title: "Issue with the Add-on",
            image: Icon.WARNING
        },
        sections: [
            {
                widgets: [
                    { content: error.message }
                ]
            }
        ]
    };
    if (!cardConfig) {
        return (card(defCard));
    }
    try {
        return (card(cardConfig));
    }
    catch (err) {
        return (card(defCard));
    }
}
function order_(A, B, reverse) {
    toBoolean(reverse);
    var areStrings = (typeof A === "string") && (typeof B === "string");
    var areDates = (A instanceof Date) && (B instanceof Date);
    var areNumbers = (typeof A === "number") && (typeof B === "number");
    switch (true) {
        case areStrings:
            A = A.toLowerCase();
            B = B.toLowerCase();
            if (reverse) {
                if (A > B) {
                    return -1;
                }
                else if (A < B) {
                    return 1;
                }
            }
            else {
                if (A > B) {
                    return 1;
                }
                else if (A < B) {
                    return -1;
                }
            }
            break;
        case areNumbers:
            if (reverse) {
                return B - A;
            }
            else {
                return A - B;
            }
            break;
        case areDates:
            A = A.valueOf();
            B = B.valueOf();
            if (reverse) {
                return B - A;
            }
            else {
                return A - B;
            }
            break;
        default: return 0;
    }
}
function preserve_(form, widgets, remove) {
    if (widgets.length > 0) {
        widgets.forEach(function (widget) {
            var type = widget.type;
            var content = widget.content;
            var sw = widget.switchConfig || {};
            var name = widget.name || sw.name;
            if (name) {
                if (remove) {
                    if (!form.hasOwnProperty(name)) {
                        switch (type) {
                            case Type.KEY_VALUE:
                                sw.selected = false;
                                break;
                            case Type.CHECK_BOX: content.forEach(function (option) {
                                option.selected = false;
                            });
                        }
                    }
                }
                for (var key in form) {
                    var field = form[key];
                    if (key === name) {
                        switch (type) {
                            case Type.KEY_VALUE:
                                if (field[0]) {
                                    sw.selected = true;
                                }
                                break;
                            case Type.TEXT_INPUT:
                                widget.content = field[0];
                                break;
                            default: content.forEach(function (option) {
                                if (field.indexOf(option.value) !== -1) {
                                    option.selected = true;
                                }
                                else {
                                    option.selected = false;
                                }
                            });
                        }
                    }
                }
            }
        });
    }
}
function sort(array, property, invert) {
    try {
        return array.sort(function (a, b) {
            if (property) {
                return order_(a[property], b[property], invert);
            }
            else {
                return order_(a, b, invert);
            }
        });
    }
    catch (error) {
        timestamp("array sorting error", error, "warning");
        return array;
    }
}
const is = (() => {
    const instOf = (out, cls) => out.constructor.name === cls.name;
    return {
        arr(maybeArr) {
            return Array.isArray(maybeArr);
        },
        bool(maybeBool) {
            return instOf(maybeBool, Boolean);
        },
        date(maybeDate) {
            return instOf(maybeDate, Date);
        },
        nan(maybeNaN) {
            return Number.isNaN(maybeNaN);
        },
        numerable(maybe) {
            return !Number.isNaN(maybe);
        },
        number(maybeNum) {
            return instOf(maybeNum, Number);
        },
        null(maybeNull) {
            return maybeNull === null;
        },
        obj(maybeObj) {
            return typeof maybeObj === "object" && maybeObj;
        },
        str(maybeStr) {
            return instOf(maybeStr, String);
        },
        undef(maybeDef) {
            return maybeDef === void 0;
        }
    };
})();
function propertiesToString(object) {
    for (const key in object) {
        const value = object[key];
        if (is.undef(value)) {
            object[key] = "";
            continue;
        }
        if (is.obj(value) || is.null(value)) {
            object[key] = JSON.stringify(value || {});
            continue;
        }
        if (is.bool(value) || is.numerable(value)) {
            object[key] = value.toString();
            continue;
        }
    }
    return object;
}
function timestamp(label, content, type) {
    var current = new Date();
    var date = current.toLocaleDateString();
    var time = current.toLocaleTimeString();
    var log = {
        message: label,
        on: date,
        at: time,
        happened: content
    };
    switch (type) {
        case "log":
            console.log(log);
            break;
        case "warning":
            console.warn(log);
            break;
        case "error":
            console.error(log);
            break;
        default: console.log(log);
    }
}
function toSentenceCase(input) {
    if (!input || input === "") {
        return "";
    }
    input = input.toLowerCase();
    input = input[0].toUpperCase() + input.substring(1, input.length);
    return input;
}
function toCamelCase(input) {
    if (!input || input === "") {
        return "";
    }
    return input.split(" ").map((word) => {
        return toSentenceCase(word);
    }).join(" ");
}
function trimMessage(message) {
    const date = message.getDate();
    const subject = message.getSubject();
    const body = message.getBody();
    const from = message.getFrom();
    var to = message.getTo().split(", ");
    var cc = message.getCc().split(", ");
    var me = Session.getEffectiveUser().getEmail();
    var toTrim = from;
    if (trimFrom(to[0]) !== me && trimFrom(from) === me) {
        toTrim = to[0];
    }
    var trimmed = {
        to,
        cc,
        body,
        date,
        subject
    };
    var domains = toTrim.match(/\w+(?=\..+(?=$))/g) || [];
    trimmed.domain = toSentenceCase(domains[domains.length - 1]);
    trimmed.email = trimFrom(toTrim).toLowerCase();
    trimmed.name = trimSender(toTrim);
    var split = trimmed.name.split(" ");
    var first = split[0];
    var lwd = first.toLowerCase();
    var start = 0;
    if (lwd === "the" || lwd === "a") {
        first += " " + split[1];
        start = 1;
    }
    trimmed.first = first;
    trimmed.last = "";
    if (split.length > 1) {
        split.forEach((part, idx) => {
            var spacer = "";
            if (idx !== (start + 1)) {
                spacer = " ";
            }
            if (idx > start) {
                trimmed.last += spacer + part;
            }
        });
    }
    if (!first && !trimmed.last) {
        trimmed.name = trimmed.first = toSentenceCase(trimmed.email.split("@")[0]);
    }
    trimmed.entities = extractEntities_(trimmed);
    return trimmed;
}
const emailRegex = /([-+\w.]+@[-+\w.]+\w+(?:\.\w+)+)/ig;
function extractEntities_(message) {
    const { cc, domain, email, name, to } = message;
    var entities = {
        names: [name],
        emails: [email],
        domains: [domain]
    };
    if (!message) {
        return entities;
    }
    var emails = to.concat(cc);
    emails = emails.concat(message.body.match(/\w+?@\w+\.\w+?\b/g) || []);
    var rNames = emails.map(r => trimSender(r)).filter(r => r !== "");
    var rEmails = emails.map((c) => trimFrom(c).toLowerCase()).filter(c => c !== "");
    entities.names = entities.names.concat(rNames).filter((name, n, nms) => {
        return nms.lastIndexOf(name) === n;
    }).sort((a, b) => order_(a, b));
    entities.emails = entities.emails.concat(rEmails).filter((email, m, ems) => {
        return ems.lastIndexOf(email) === m;
    });
    return entities;
}
const trimFrom = (input) => {
    try {
        const [[email]] = input.matchAll(emailRegex) || [[input]];
        return email || input;
    }
    catch (error) {
        console.warn(error);
        return input;
    }
};
function trimSender(input) {
    try {
        var index = input.indexOf(" <");
        if (index === -1)
            return "";
        input = input.replace(input.slice(index), "");
        input = input.replace(/^\"|\"+(?=$)/g, "");
        input = input.replace(/^\'|\'$/g, "");
        return toCamelCase(input);
    }
    catch (e) {
        return "";
    }
}
function toBoolean(input) {
    if (!input) {
        return false;
    }
    var isBoolean = typeof input === "boolean";
    if (isBoolean) {
        return input;
    }
    var isString = typeof input === "string";
    return isString ? input === "true" : false;
}
const isFunc = (maybeFunc) => typeof maybeFunc === "function";
const isStr = (maybeStr) => typeof maybeStr === "string";
const ensureArray = (maybeArray) => Array.isArray(maybeArray) ? maybeArray : [maybeArray];
const compose_ = (...f) => f.reduce((x, y) => (...args) => y(x(...args)));
const pushIf = (arr, maybeEl) => !!maybeEl && arr.push(maybeEl);
const putToCache = (key, value) => {
    const ucache = CacheService.getUserCache();
    ucache.put(key, value.toString());
};
const getFromCache = (key) => {
    const ucache = CacheService.getUserCache();
    return ucache.get(key) || "";
};
const isSuccess = ({ res }) => res.getResponseCode() === 200;
const processImageURI = ({ uri, width = -1, height = -1 }) => {
    const commonParams = { muteHttpExceptions: true };
    const res = UrlFetchApp.fetch(uri, commonParams);
    if (!isSuccess({ res })) {
        return "";
    }
    const base64 = Utilities.base64Encode(res.getContent());
    const cacheName = "resized_image";
    const selfURI = `${ScriptApp.getService().getUrl()}?resize:width=${width}&height=${height}&cache=${cacheName}`;
    const resizedRes = UrlFetchApp.fetch(selfURI, { ...commonParams, method: "post", payload: base64 });
    if (!isSuccess({ res: resizedRes })) {
        return "";
    }
    const cached = getFromCache(cacheName);
    if (!cached) {
        return "";
    }
    return `data:image/jpeg;base64,${cached}`;
};
var Cardin = {
    action,
    edit,
    fetchAndReload,
    actionBuilder,
    errorDecorator,
    actionDecorator,
    iconDecorator,
    labelDecorator,
    suggestionDecorator,
    buttonDecorator,
    globalEnumReplyDraft,
    globalEnumStandalone,
    Auth,
    Mime,
    Token,
    Icon,
    Reload,
    Response,
    Show,
    State,
    Type,
    section,
    card,
    deck,
    Fetcher,
    fetchAuthorized,
    handleResponse,
    validateMethod,
    parseAuthenticateHeader,
    parseContentRangeHeader,
    acceptsPayload,
    getProperty,
    getProperties,
    setProperty,
    getFromStore,
    setToStore,
    clearStore,
    setProperties,
    deleteProperty,
    deleteAllProperties,
    initialize,
    mute,
    save,
    load,
    reset,
    authStrategy,
    changeStrategy,
    clickStrategy,
    composeStrategy,
    suggestStrategy,
    openLinkStrategy,
    cardConfirm,
    paginate,
    validateKeyValueConfig,
    validateTextInputConfig,
    validateEditableConfig,
    validateConfig,
    makeFetchMoreWidget,
    makeMultiplyWidget,
    defineIfNot,
    getBackButtonConfig,
    getNextButtonConfig,
    cardHeader,
    navigation,
    notification,
    verifyAction,
    cardAction,
    Responder,
    reloadStrategy,
    actionResponse,
    openLink,
    textWidget,
    selectionInputWidget,
    textInputWidget,
    getButtonSetWidget,
    textButtonWidget,
    imageButtonWidget,
    imageWidget,
    getSwitchWidget,
    getGridItemWidget,
    getGridWidget,
    getDecoratedTextWidget,
    keyValueWidget,
    hasAction,
    passesTests,
    serviceAccount,
    resetSA,
    compare,
    Formatter,
    concatInPlace,
    copyObject,
    endsOnOne,
    flatten,
    generateCard,
    generateSection,
    getByProperty,
    getDeepLastIndex,
    frost,
    indexByProperty,
    JSONtoQuery,
    nest,
    traverseNested,
    queryToJSON,
    getMessage,
    handleError,
    sort,
    is,
    propertiesToString,
    timestamp,
    toSentenceCase,
    toCamelCase,
    trimMessage,
    emailRegex,
    trimFrom,
    trimSender,
    toBoolean,
    isFunc,
    isStr,
    ensureArray,
    pushIf,
    putToCache,
    getFromCache,
    isSuccess,
    processImageURI
};
