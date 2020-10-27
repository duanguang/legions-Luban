#!/bin/bash
projectDir=$1
branch=$2
email=$3
name=$4
DIR=$projectDir
cd $projectDir
pwd
git add .
git config --global user.email $email
git config --global user.name $name
git commit -m 'feat: 同步新列表页面代码'
git push -u orgin $branch:$branch
git push -u origin $branch:$branch 