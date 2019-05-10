#!/usr/bin/env bash

CURRENT_PATH=$(dirname $(realpath $0))
AVD_HOME_PATH="$CURRENT_PATH/avd"
REBOX_AVD_PATH="$AVD_HOME_PATH/rebox.avd"

cat >"$AVD_HOME_PATH/rebox.ini" <<EOL
avd.ini.encoding=UTF-8
path=${REBOX_AVD_PATH}
path.rel=avd/rebox.avd
target=android-28
EOL

# https://developer.android.com/studio/run/emulator-commandline.html
# https://github.com/voidxv/avd_creation_script
ANDROID_AVD_HOME=$AVD_HOME_PATH $ANDROID_HOME/emulator/emulator \
  -avd rebox \
  -gpu host \
  -no-audio \
  -memory 2048 \
  -partition-size 1024 \
  -netfast \
  -accel on \
  -no-boot-anim \
   1> /dev/null &

# https://stackoverflow.com/questions/41151883/wait-for-android-emulator-to-be-running-before-next-shell-command
$ANDROID_HOME/platform-tools/adb wait-for-device shell 'while [[ -z $(getprop sys.boot_completed) ]]; do sleep 1; done;'

# TODO: move 3001 out
$ANDROID_HOME/platform-tools/adb reverse tcp:3001 tcp:3001
$ANDROID_HOME/platform-tools/adb reverse tcp:8081 tcp:8081
