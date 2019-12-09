# rebox/android

## Setup

### macOS

```sh
brew update
brew tap homebrew/cask-versions
brew cask install adoptopenjdk8
brew cask install android-sdk
brew cask install intel-haxm
```

```sh
export ANDROID_HOME=$(brew --prefix)/share/android-sdk
export PATH=$ANDROID_HOME/tools:$PATH
export PATH=$ANDROID_HOME/platform-tools:$PATH
```

```sh
exec $SHELL -l
```

```sh
mkdir $HOME/.android/
touch $HOME/.android/repositories.cfg
yes | sdkmanager --licenses
sdkmanager "platform-tools" "platforms;android-28" "build-tools;28.0.3" "emulator" "extras;android;m2repository" "system-images;android-28;google_apis;x86"
```
