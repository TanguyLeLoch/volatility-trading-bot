#!/bin/bash
modules=( "$@" )
echo $modules
for module in "${modules}"
do  
    cd ../$module
    echo "Installing $module"
    tsc
    cd -
done