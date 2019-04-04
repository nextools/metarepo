#!/usr/bin/env bash

if git apply --check --ignore-space-change --ignore-whitespace --directory node_modules/typescript/ typescript.patch 2> /dev/null; then
  git apply --verbose --ignore-space-change --ignore-whitespace --directory node_modules/typescript/ typescript.patch
fi
