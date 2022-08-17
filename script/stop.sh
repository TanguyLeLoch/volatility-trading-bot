#!/bin/bash
echo "stop process"
scriptFolder=$(dirname -- $0)
moduleList=( $(cat ${scriptFolder}/module-list) )

# kill existing node processes
for module in "${moduleList[@]}"
do
    pid=$(ps -ef | grep $module | grep -v grep | awk '{print $2}')
    if [ -n "$pid" ]; then
        echo "kill $module by pid $pid"
        kill $pid  
    else 
        echo "no $module process found"
    fi
done

echo "done"