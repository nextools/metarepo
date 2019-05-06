```sh
./node_modules/.bin/haul start --config node_modules/@rebox/run/haul.config.js
./node_modules/.bin/react-native run-ios --no-packager --project-path node_modules/@rebox/ios/ios
./node_modules/@rebox/android/run-android-emulator.sh
./node_modules/.bin/react-native run-android --no-packager --root node_modules/@rebox/android
```
