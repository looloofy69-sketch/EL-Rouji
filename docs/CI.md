# CI build boundary

GitHub Actions performs a TypeScript check and Vite frontend build. AppDeploy injects its real `@appdeploy/client` SDK in the hosted environment; that private/runtime-provided module is not listed as an ordinary npm dependency in the exported manifest.

For repository CI only, setting `EL_ROUJI_CI_BUILD=1` makes Vite alias that import to `ci/appdeploy-client-shim.ts`. This shim exists solely to verify that the frontend type-checks and bundles outside AppDeploy. It does not emulate AppDeploy authentication, image processing, or production service behavior, and its generated bundle must not be deployed.

The hosted AppDeploy build remains authoritative for platform integration. CI green, once observed, should be read as a source-level type/bundle check—not end-to-end verification of the hosted services. A committed lockfile and clean `npm ci` validation remain outstanding.
