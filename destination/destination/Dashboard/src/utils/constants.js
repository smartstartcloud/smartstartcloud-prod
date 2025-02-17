import { App, AppPortal } from "../App";

export const APPS = [
  {
    subdomain: "www",
    app: App,
    main: true,
  },
  {
    subdomain: "portal",
    app: AppPortal,
    main: false,
  },
];

export const getApp = () => {
    const subdomain = getSubdomain(window.location.hostname);

    const mainApp = APPS.find((app) => app.main)

    if (!mainApp) throw new Error("Must have main APP")

    if (subdomain === "") return mainApp.app
    const app = APPS.find(app => subdomain === app.subdomain)

    if (!app) return mainApp.app
    return app.app
}

const getSubdomain = (location) => {
    let sliceTill = -2
    const locationParts = location.split(".")
    // for localhost
    const isLocalHost = locationParts.slice(-1)[0] === "localhost"
    if (isLocalHost) sliceTill = -1

    return locationParts.slice(0, sliceTill).join("")

}