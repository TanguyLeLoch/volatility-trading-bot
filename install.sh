#!/bin/bash
PATTERN_TO_EXCLUDE=("model" "core")
installModule(){
    cd $1
    pwd
    yarn
    cd ..
}
isToExclude(){
    for pattern in "${PATTERN_TO_EXCLUDE[@]}"
    do
        if [[ $1 == *"$pattern"* ]]; then
            return 0
        fi
    done
    return 1
}

echo "##############################################################################"
echo "Installing modules"
echo "##############################################################################"

modules=`ls | grep "module-.*$" ` 
for f in $modules; do
    if [ -d "$f" ]; then
        if isToExclude $f ; then
            echo "No need to install $f"
        else
            echo "Installing $f"
            installModule $f
        fi
    fi
done
