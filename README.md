# SharePoint Workbench demo with TypeScript

This example uses Bryntum Gantt wrapped in the provided `BryntumGantt` wrapper.
This demo contains a Basic React Gantt example. The demo is written in TypeScript

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# Bryntum Repository access setup

**IMPORTANT NOTE!** These access instructions are mandatory when using the private Bryntum NPM repository.

This example uses npm packages from the Bryntum private NPM repository. You must be logged-in to this repository as a
licensed or trial user to access the packages. Please
check [Online npm repository guide](https://bryntum.com/products/gantt/docs/guide/Gantt/npm-repository) for detailed information
on the sign-up/login process. Also you can check bundled guide inside distribution zip
in `docs/guides/npm-repository.md`.

# React integration guide

Please check this  
[Bryntum React integration online guide](https://bryntum.com/products/gantt/docs/guide/Gantt/integration/react/guide) for
detailed integration information and help. Also you can check bundled guide inside distribution zip
in `docs/guides/integration/react/guide.md`.

# Installation

Use the following command to install the example packages after the successful login.

Using **npm**:

```shell
$ npm install
```

Using **yarn**:

```shell
$ yarn install
```

# SharePoint Fabric (SPFx) framework versions and requirements

## Versions and requirements

- EsNext
- React 17.0+
- SharePoint Online
- ClientSideAssets (CDN enabled)
- @microsoft/generator-sharepoint 1.16.1
- @microsoft/sp-core-library 1.16.1
- gulp 4.0.2
- npm@8.19.3
- yo 4.3.0
- NodeJS >=16.13.0 <17.0.0
- Gantt 5.2.6+

Consider nvm version manager for switching node versions: https://github.com/nvm-sh/nvm

## Documentation online

- https://docs.microsoft.com/nl-nl/sharepoint/dev/spfx/set-up-your-development-environment
- https://docs.microsoft.com/nl-nl/sharepoint/dev/spfx/set-up-your-developer-tenant
- https://docs.microsoft.com/nl-nl/sharepoint/dev/spfx/web-parts/get-started/build-a-hello-world-web-part

## Pre install

Skeleton is built and installed with (these steps can be skipped)

- `nvm use lts/gallium`
- `npm install -g yo gulp`
- `npm install -g @microsoft/generator-sharepoint`

To start and install, issue the following commands in the web part example folder.

- `npm i`
- `npm install -g gulp`
- `gulp trust-dev-cert`

## Developing on localhost and the remote tenant

Docs: https://docs.microsoft.com/nl-nl/sharepoint/dev/spfx/web-parts/get-started/serve-your-web-part-in-a-sharepoint-page

- The command `gulp serve` will open the workbench on the configured tenant in /config/serve.json
- Add the gantt webpart workbench, it should correctly load the demo data.
- Add the BryntumGantt WebPart on the remote workbench page.
- Open the PropertyPane in the GanttDemo webpart and create a new demo tasklist by
  clicking `Create Tasklist: BryntumGanttDemo`.

If all correct the gantt chart with selected demo data `single` or `full demo` will appear on the remote tenant.

To quit the serve process `ctrl-c`

## Deploy the production package

Docs: https://docs.microsoft.com/nl-nl/sharepoint/dev/spfx/web-parts/get-started/serve-your-web-part-in-a-sharepoint-page

- Quit the serve process `ctrl-c`
- `gulp bundle --ship`
- `gulp package-solution --ship`
- Upload the `sharepoint\solution\bryntum-fabric-sp.sppkg` package to your app catalog

It is recommended to setup CDN for a better loading performance. CDN is included in any SharePoint Online account. To
enable it you can follow the steps in this
guide https://docs.microsoft.com/nl-nl/sharepoint/dev/spfx/web-parts/get-started/hosting-webpart-from-office-365-cdn

# Running a development server

To build example and start development server run this command:

Using **npm**:

```shell
$ npm run start
```

Using **yarn**:

```shell
$ yarn run start
```

Navigate to `http://localhost:3000/` or `http://127.0.0.1:3000/` in your browser. We recommend to use latest versions of
modern browsers like Chrome, FireFox, Safari or Edge (Chromium). The app will automatically reload if you change any of
the source files.

# Creating a production build

To build production code for the example run this command:

Using **npm**:

```shell
$ npm run build
```

Using **yarn**:

```shell
$ yarn run build
```

The build artifacts will be stored in the `build/` directory.

# Distribution zip references

* Bryntum API docs. Open `docs/index.html` in your browser.
* Bryntum Repository guide `docs/guides/npm-repository.md`.
* Bryntum React integration guide `docs/guides/integration/react/guide.md`.

# Online References

* [React Framework](https://github.com/facebook/create-react-app)
* [Bryntum React integration guide](https://bryntum.com/products/gantt/docs/guide/Gantt/integration/react/guide)
* [Bryntum Gantt documentation](https://bryntum.com/products/gantt/docs/)
* [Bryntum Gantt examples](https://bryntum.com/products/gantt/examples/)
* [Bryntum npm repository guide](https://bryntum.com/products/gantt/docs/guide/Gantt/npm-repository)
* [Bryntum support Forum](https://forum.bryntum.com/)
* [Contacts us](https://bryntum.com/contact/)
