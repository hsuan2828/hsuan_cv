#!/bin/bash
docker run --rm -v "$PWD":/usr/src/myapp -w /usr/src/myapp  golang-iris go build -v
mv myapp hsuan_cv
