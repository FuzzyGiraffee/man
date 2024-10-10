import { jsx, jsxs } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@remix-run/node";
import { RemixServer, Outlet, Meta, Links, ScrollRestoration, Scripts } from "@remix-run/react";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { useState, useRef } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import emailjs from "@emailjs/browser";
import { Link } from "react-router-dom";
const ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext) {
  return isbot(request.headers.get("user-agent") || "") ? handleBotRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onAllReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onShellReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest
}, Symbol.toStringTag, { value: "Module" }));
const links = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous"
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
  }
];
function Layout({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
      /* @__PURE__ */ jsx(Meta, {}),
      /* @__PURE__ */ jsx(Links, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsx(ScrollRestoration, {}),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function App() {
  return /* @__PURE__ */ jsx(Outlet, {});
}
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Layout,
  default: App,
  links
}, Symbol.toStringTag, { value: "Module" }));
const navigation = [
  { name: "Home", href: "/" },
  { name: "Contact", href: "contact" },
  { name: "Services", href: "services" },
  { name: "About Us", href: "services" }
];
function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return /* @__PURE__ */ jsxs("header", { className: "absolute inset-x-0 top-0 z-50", children: [
    /* @__PURE__ */ jsxs("nav", { "aria-label": "Global", className: "flex items-center justify-between p-6 lg:px-8", children: [
      /* @__PURE__ */ jsx("div", { className: "flex lg:flex-1", children: /* @__PURE__ */ jsxs("a", { href: "/", className: "-m-1.5 p-1.5", children: [
        /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Speedy Tech Solutions" }),
        /* @__PURE__ */ jsx(
          "img",
          {
            alt: "",
            src: "../public/icon.svg",
            className: "h-8 w-auto"
          }
        )
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "flex lg:hidden", children: /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: () => setMobileMenuOpen(true),
          className: "-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700",
          children: [
            /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Open main menu" }),
            /* @__PURE__ */ jsx(Bars3Icon, { "aria-hidden": "true", className: "h-6 w-6" })
          ]
        }
      ) }),
      /* @__PURE__ */ jsx("div", { className: "hidden lg:flex lg:gap-x-12", children: navigation.map((item) => /* @__PURE__ */ jsx("a", { href: item.href, className: "text-sm font-semibold leading-6 text-gray-900", children: item.name }, item.name)) }),
      /* @__PURE__ */ jsx("div", { className: "hidden lg:flex lg:flex-1 lg:justify-end" })
    ] }),
    /* @__PURE__ */ jsxs(Dialog, { open: mobileMenuOpen, onClose: setMobileMenuOpen, className: "lg:hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50" }),
      /* @__PURE__ */ jsxs(DialogPanel, { className: "fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("a", { href: "asdfasdf", className: "-m-1.5 p-1.5", children: [
            /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Speedy Tech Solutions" }),
            /* @__PURE__ */ jsx(
              "img",
              {
                alt: "",
                src: "../public/icon.svg",
                className: "h-8 w-auto"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => setMobileMenuOpen(false),
              className: "-m-2.5 rounded-md p-2.5 text-gray-700",
              children: [
                /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close menu" }),
                /* @__PURE__ */ jsx(XMarkIcon, { "aria-hidden": "true", className: "h-6 w-6" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-6 flow-root", children: /* @__PURE__ */ jsxs("div", { className: "-my-6 divide-y divide-gray-500/10", children: [
          /* @__PURE__ */ jsx("div", { className: "space-y-2 py-6", children: navigation.map((item) => /* @__PURE__ */ jsx(
            "a",
            {
              href: item.href,
              className: "-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50",
              children: item.name
            },
            item.name
          )) }),
          /* @__PURE__ */ jsx("div", { className: "py-6" })
        ] }) })
      ] })
    ] })
  ] });
}
function Contact() {
  const form = useRef();
  const sendEmail = (e) => {
    e.preventDefault();
    emailjs.sendForm("service_zfbe9ch", "template_n9urgpr", form.current, {
      publicKey: ""
    }).then(
      () => {
        console.log("SUCCESS!");
      },
      (error) => {
        console.log("FAILED...", error.text);
      }
    );
  };
  return /* @__PURE__ */ jsxs("div", { className: "bg-white", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-md lg:max-w-2xl py-16 sm:py-16 lg:py-32", children: /* @__PURE__ */ jsxs("form", { ref: form, onSubmit: sendEmail, children: [
      /* @__PURE__ */ jsx("div", { class: "space-y-12", children: /* @__PURE__ */ jsxs("div", { class: "border-b border-gray-900/10 pb-12", children: [
        /* @__PURE__ */ jsx("h2", { class: "text-base font-semibold leading-7 text-gray-900", children: "Contact Us" }),
        /* @__PURE__ */ jsx("p", { class: "mt-1 text-sm leading-6 text-gray-600", children: "Please fill out the form below and we will be in touch soon" }),
        /* @__PURE__ */ jsxs("div", { class: "mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6", children: [
          /* @__PURE__ */ jsxs("div", { class: "sm:col-span-3", children: [
            /* @__PURE__ */ jsx("label", { for: "first-name", class: "block text-sm font-medium leading-6 text-gray-900", children: "First name" }),
            /* @__PURE__ */ jsx("div", { class: "mt-2", children: /* @__PURE__ */ jsx("input", { type: "text", name: "first-name", id: "first-name", autoComplete: "given-name", class: "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { class: "sm:col-span-3", children: [
            /* @__PURE__ */ jsx("label", { for: "last-name", class: "block text-sm font-medium leading-6 text-gray-900", children: "Last name" }),
            /* @__PURE__ */ jsx("div", { class: "mt-2", children: /* @__PURE__ */ jsx("input", { type: "text", name: "last-name", id: "last-name", autoComplete: "family-name", class: "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { class: "sm:col-span-4", children: [
            /* @__PURE__ */ jsx("label", { for: "email-address", class: "block text-sm font-medium leading-6 text-gray-900", children: "Email Address" }),
            /* @__PURE__ */ jsx("div", { class: "mt-2", children: /* @__PURE__ */ jsx("input", { type: "text", name: "email-address", id: "email-address", autoComplete: "email-address", class: "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { class: "sm:col-span-3", children: [
            /* @__PURE__ */ jsx("label", { for: "phone-number", class: "block text-sm font-medium leading-6 text-gray-900", children: "Phone Number" }),
            /* @__PURE__ */ jsx("div", { class: "mt-2", children: /* @__PURE__ */ jsx("input", { type: "text", name: "phone-number", id: "phone-number", autoComplete: "phone-number", class: "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { class: "col-span-full", children: [
            /* @__PURE__ */ jsx("label", { for: "about", class: "block text-sm font-medium leading-6 text-gray-900", children: "How can we help?" }),
            /* @__PURE__ */ jsx("div", { class: "mt-2", children: /* @__PURE__ */ jsx("textarea", { id: "about", name: "about", rows: "3", class: "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" }) })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { class: "mt-6 flex items-center justify-end gap-x-6", children: /* @__PURE__ */ jsx(Link, { to: "/Sucess", children: /* @__PURE__ */ jsx("button", { type: "submit", value: "Send", class: "rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600", children: "Send" }) }) })
    ] }) })
  ] });
}
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Contact
}, Symbol.toStringTag, { value: "Module" }));
function Example$1() {
  return /* @__PURE__ */ jsxs("div", { className: "bg-white", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsxs("div", { className: "relative isolate px-6 pt-14 lg:px-8", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          "aria-hidden": "true",
          className: "absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80",
          children: /* @__PURE__ */ jsx(
            "div",
            {
              style: {
                clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
              },
              className: "relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            }
          )
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-2xl py-32 sm:py-48 lg:py-56", children: [
        /* @__PURE__ */ jsx("div", { className: "hidden sm:mb-8 sm:flex sm:justify-center" }),
        /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx("h1", { className: "text-balance text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl", children: "Sucess!" }),
          /* @__PURE__ */ jsx("p", { className: "mt-6 text-lg leading-8 text-gray-600", children: "Thank you for contacting us! We will respond soon." }),
          /* @__PURE__ */ jsx("div", { className: "mt-10 flex items-center justify-center gap-x-6" })
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        "div",
        {
          "aria-hidden": "true",
          className: "absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]",
          children: /* @__PURE__ */ jsx(
            "div",
            {
              style: {
                clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
              },
              className: "relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            }
          )
        }
      )
    ] })
  ] });
}
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Example$1
}, Symbol.toStringTag, { value: "Module" }));
function Example() {
  return /* @__PURE__ */ jsxs("div", { className: "bg-white", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsxs("div", { className: "relative isolate px-6 pt-14 lg:px-8", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          "aria-hidden": "true",
          className: "absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80",
          children: /* @__PURE__ */ jsx(
            "div",
            {
              style: {
                clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
              },
              className: "relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            }
          )
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-2xl py-32 sm:py-48 lg:py-56", children: [
        /* @__PURE__ */ jsx("div", { className: "hidden sm:mb-8 sm:flex sm:justify-center" }),
        /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx("h1", { className: "text-balance text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl", children: "Speedy Tech Solutions" }),
          /* @__PURE__ */ jsx("p", { className: "mt-6 text-lg leading-8 text-gray-600", children: "Specilaizing in individual tech solutions including phones, personal computers, custom computer design and assembly, and more." }),
          /* @__PURE__ */ jsx("div", { className: "mt-10 flex items-center justify-center gap-x-6" })
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        "div",
        {
          "aria-hidden": "true",
          className: "absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]",
          children: /* @__PURE__ */ jsx(
            "div",
            {
              style: {
                clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
              },
              className: "relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            }
          )
        }
      )
    ] })
  ] });
}
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Example
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-DinF_akI.js", "imports": ["/assets/index-SQrI3hi5.js", "/assets/index-DDvB_AJq.js", "/assets/components-CANqBGba.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/root-J1FAKXnK.js", "imports": ["/assets/index-SQrI3hi5.js", "/assets/index-DDvB_AJq.js", "/assets/components-CANqBGba.js"], "css": ["/assets/root-TAclZcIo.css"] }, "routes/contact": { "id": "routes/contact", "parentId": "root", "path": "contact", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/contact-B4Qkshs4.js", "imports": ["/assets/index-SQrI3hi5.js", "/assets/navbar-tCcTPa-o.js", "/assets/index-DDvB_AJq.js"], "css": [] }, "routes/Sucess": { "id": "routes/Sucess", "parentId": "root", "path": "Sucess", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/Sucess-CFhQhbYE.js", "imports": ["/assets/index-SQrI3hi5.js", "/assets/navbar-tCcTPa-o.js"], "css": [] }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_index-MfeCxxEI.js", "imports": ["/assets/index-SQrI3hi5.js", "/assets/navbar-tCcTPa-o.js"], "css": [] } }, "url": "/assets/manifest-ab441806.js", "version": "ab441806" };
const mode = "production";
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "v3_fetcherPersist": true, "v3_relativeSplatPath": true, "v3_throwAbortReason": true, "unstable_singleFetch": false, "unstable_lazyRouteDiscovery": false, "unstable_optimizeDeps": false };
const isSpaMode = false;
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/contact": {
    id: "routes/contact",
    parentId: "root",
    path: "contact",
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/Sucess": {
    id: "routes/Sucess",
    parentId: "root",
    path: "Sucess",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route3
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  mode,
  publicPath,
  routes
};
