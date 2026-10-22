// The white-label identity of this deployment: the product name, the logo
// shown before a session is known, and the primary color the interface starts
// from.
//
// The agency can override name, logo and color at runtime from
// Settings -> Identity (they live on the agency row, see the /agency
// endpoints). These are the defaults and the fallback for the pages that
// render without a session, like sign-in.
export const APP_NAME = "MerQato Digital";
export const APP_LOGO = "/brand/merqato-mark.png";
export const APP_BRAND_COLOR = "#b30001";
