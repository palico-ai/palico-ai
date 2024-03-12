#!/bin/sh -ex
# client-js
nx run client-js:build
(cd dist/packages/client-js;
npm unpublish --force --registry http://localhost:4873;
npm publish --registry http://localhost:4873
)

# palico-app
