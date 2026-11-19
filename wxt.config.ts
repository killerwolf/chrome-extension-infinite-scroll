import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  dev: {
    reloadCommand: false,
  },
  webExt: {
    chromiumArgs: ["--user-data-dir=./.wxt/chrome-data"],
    binaries: {
      chrome:
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    },
    startUrls: ["https://www.public.fr/"],
  },
  manifest: {
    name: "SuperScroll",
    version: "1.1.0",
    description:
      "An advanced auto-scroll Chrome extension with customizable features.",
    permissions: ["activeTab", "scripting"],
    host_permissions: ["<all_urls>"],
    homepage_url: "https://h4md1.fr/chrome-extension-infinite-scroll/",
    icons: {
      "16": "icon/16.png",
      "32": "icon/32.png",
      "48": "icon/48.png",
      "128": "icon/128.png",
    },
  },
  modules: ["@wxt-dev/module-react"],
});
