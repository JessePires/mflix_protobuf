### Como gerar proto?

```bash

# Directory to write generated code to (.js and .d.ts files)
protoc \
    --plugin="protoc-gen-ts=./node_modules/.bin/protoc-gen-ts" \
    --js_out="import_style=commonjs,binary:./src/generated" \
    --ts_out="./src/generated" \
    src/proto/movies.proto
```