/**
 * Represents a model for the required Azure Active Directory configuration  
 */
export default interface AdalConfig {
    /**
     * The AAD tenant
     */
    tenant: string;

    /**
     * The AAD application id (client id)
     */
    clientId: string;

    /**
     * The redirect URI
     */
    redirectUri: string;

    /**
     * The URI which will be direct after logout
     */
    postLogoutRedirectUri: string;

    /**
     * Additional AAD query parameters
     */
    additionalQueryParameter: string;
}