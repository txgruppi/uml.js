#!/bin/bash

node index.js > diagram.dot
dot -Tpng -o diagram.png diagram.dot
