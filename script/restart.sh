#!/bin/bash
# read module list from file
scriptFolder=$(dirname -- $0)

moduleList=( $(cat ${scriptFolder}/module-list) )

# get the script folder
# run stop script

source "$scriptFolder/stop.sh"


# start modules
for module in "${moduleList[@]}"
do
  echo "restart $module"
  node ${scriptFolder}/../dist/apps/$module/main > /dev/null 2>&1 &
done

echo "done"