#!/bin/bash

# Workaround for `svelte-check` error in `src/lib/paraglide/server.js`.

grep -q '// @ts-nocheck' yourfile.js ||  sed -i '1s;^;// @ts-nocheck\n;' $1
