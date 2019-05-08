#!/usr/bin/env bash

# https://developer.android.com/studio/run/emulator-commandline.html
# https://github.com/voidxv/avd_creation_script
$ANDROID_HOME/emulator/emulator \
  -avd rebox \
  -gpu host \
  -no-audio \
  -memory 2048 \
  -partition-size 1024 \
  -wipe-data \
  -netfast \
  -accel on \
  -no-boot-anim \
  -no-snapshot \
  1> /dev/null &

# https://stackoverflow.com/questions/41151883/wait-for-android-emulator-to-be-running-before-next-shell-command
$ANDROID_HOME/platform-tools/adb wait-for-device shell 'while [[ -z $(getprop sys.boot_completed) ]]; do sleep 1; done;'

# TODO: move 3001 out
$ANDROID_HOME/platform-tools/adb reverse tcp:3001 tcp:3001
$ANDROID_HOME/platform-tools/adb reverse tcp:8081 tcp:8081
