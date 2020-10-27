#!/bin/bash
echo "state:pending"
projectDir=$1
gitSrc=$2
branch=$3
DIR=$projectDir
if [ -x "$DIR" ]; then
  echo  'client:文件夹已经存在...';
else
   echo "client:正在创建项目文件夹 '$DIR'...";
   mkdir -p $DIR
fi 
cd $projectDir
# 判定分支是否存在
if git rev-parse --verify $branch; then
   git fetch origin develop
   git pull origin develop:$branch
   git branch
   git checkout $branch
   #git checkout -b $branch origin/$branch
   echo  'client:项目初始化完成...';
   echo 'state:complete';
else
    #if [ "$(ls -A $DIR)" ]; then
    # echo "$DIR is not Empty"
    # pwd 
    # echo "Cloning into '$projectDir'..."
    echo 'client:项目初始化中...'
    git init
    git remote add origin $gitSrc
    git fetch origin develop
    if git pull origin develop:$branch; then
    git branch
    git checkout $branch
    # if git clone -b $branch $gitSrc $projectDir --depth=1; then
    echo  'client:项目初始化完成...';
    echo 'state:complete';
    else 
    echo  'client:项目初始化失败...';
    echo 'state:error';
    fi  
fi  


