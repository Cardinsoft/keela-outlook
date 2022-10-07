abstract class BaseResponse {
    /**
     * @summary Prints the JSON representation of this object. This is for debugging only.
     */
    printJSON() { }
}

/**
 * @see https://developers.google.com/apps-script/reference/card-service/action-response
 */
class ActionResponse extends BaseResponse {
}

/**
 * @see https://developers.google.com/apps-script/reference/card-service/suggestions-response
 */
class SuggestionsResponse extends BaseResponse {

}

/**
 * @see https://developers.google.com/apps-script/reference/card-service/universal-action-response
 */
class UniversalActionResponse extends BaseResponse {

}