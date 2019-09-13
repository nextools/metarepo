const root = process.env.REBOX_CWD
const appName = process.env.REBOX_APP_NAME
const appId = process.env.REBOX_APP_ID || 'com.rebox'

const json = {
  root,
  reactNativePath: `${root}/node_modules/react-native`,
  dependencies: {
    'react-native-svg': {
      root: `${root}/node_modules/react-native-svg`,
      name: 'react-native-svg',
      platforms: {
        ios: {
          sourceDir: `${root}/node_modules/react-native-svg/ios`,
          folder: `${root}/node_modules/react-native-svg`,
          pbxprojPath: `${root}/node_modules/react-native-svg/ios/RNSVG.xcodeproj/project.pbxproj`,
          podfile: null,
          podspecPath: `${root}/node_modules/react-native-svg/RNSVG.podspec`,
          projectPath: `${root}/node_modules/react-native-svg/ios/RNSVG.xcodeproj`,
          projectName: 'RNSVG.xcodeproj',
          libraryFolder: 'Libraries',
          sharedLibraries: [],
          plist: [],
          scriptPhases: [],
        },
        android: {
          sourceDir: `${root}/node_modules/react-native-svg/android`,
          folder: `${root}/node_modules/react-native-svg`,
          packageImportPath: 'import com.horcrux.svg.SvgPackage;',
          packageInstance: 'new SvgPackage()',
        },
      },
      assets: [],
      hooks: {},
      params: [],
    },
  },
  commands: [
    {
      name: 'log-ios',
      description: 'starts iOS device syslog tail',
    },
    {
      name: 'run-ios',
      description: 'builds your app and starts it on iOS simulator',
      examples: [
        {
          desc: 'Run on a different simulator, e.g. iPhone 5',
          cmd: 'react-native run-ios --simulator "iPhone 5"',
        },
        {
          desc: 'Pass a non-standard location of iOS directory',
          cmd: 'react-native run-ios --project-path "./app/ios"',
        },
        {
          desc: 'Run on a connected device, e.g. Max\'s iPhone',
          cmd: 'react-native run-ios --device "Max\'s iPhone"',
        },
        {
          desc: 'Run on the AppleTV simulator',
          cmd: 'react-native run-ios --simulator "Apple TV"  --scheme "helloworld-tvOS"',
        },
      ],
      options: [
        {
          name: '--simulator [string]',
          description: 'Explicitly set simulator to use. Optionally include iOS version betweenparenthesis at the end to match an exact version: "iPhone 6 (10.0)"',
          default: 'iPhone X',
        },
        {
          name: '--configuration [string]',
          description: 'Explicitly set the scheme configuration to use',
          default: 'Debug',
        },
        {
          name: '--scheme [string]',
          description: 'Explicitly set Xcode scheme to use',
        },
        {
          name: '--project-path [string]',
          description: 'Path relative to project root where the Xcode project (.xcodeproj) lives.',
          default: 'ios',
        },
        {
          name: '--device [string]',
          description: 'Explicitly set device to use by name.  The value is not required if you have a single device connected.',
        },
        {
          name: '--udid [string]',
          description: 'Explicitly set device to use by udid',
        },
        {
          name: '--no-packager',
          description: 'Do not launch packager while building',
        },
        {
          name: '--verbose',
          description: 'Do not use xcpretty even if installed',
        },
        {
          name: '--port [number]',
          default: 8081,
        },
        {
          name: '--terminal [string]',
          description: 'Launches the Metro Bundler in a new window using the specified terminal path.',
        },
      ],
    },
    {
      name: 'log-android',
      description: 'starts logkitty',
    },
    {
      name: 'run-android',
      description: 'builds your app and starts it on a connected Android emulator or device',
      options: [
        {
          name: '--root [string]',
          description: 'Override the root directory for the android build (which contains the android directory)',
          default: '',
        },
        {
          name: '--variant [string]',
          description: 'Specify your app\'s build variant',
          default: 'debug',
        },
        {
          name: '--appFolder [string]',
          description: 'Specify a different application folder name for the android source. If not, we assume is "app"',
          default: 'app',
        },
        {
          name: '--appId [string]',
          description: 'Specify an applicationId to launch after build.',
          default: '',
        },
        {
          name: '--appIdSuffix [string]',
          description: 'Specify an applicationIdSuffix to launch after build.',
          default: '',
        },
        {
          name: '--main-activity [string]',
          description: 'Name of the activity to start',
          default: 'MainActivity',
        },
        {
          name: '--deviceId [string]',
          description: 'builds your app and starts it on a specific device/simulator with the given device id (listed by running "adb devices" on the command line).',
        },
        {
          name: '--no-packager',
          description: 'Do not launch packager while building',
        },
        {
          name: '--port [number]',
          default: 8081,
        },
        {
          name: '--terminal [string]',
          description: 'Launches the Metro Bundler in a new window using the specified terminal path.',
          default: 'iTerm.app',
        },
        {
          name: '--tasks [list]',
          description: 'Run custom Gradle tasks. By default it\'s "installDebug"',
        },
        {
          name: '--no-jetifier',
          description: 'Do not run "jetifier" – the AndroidX transition tool. By default it runs before Gradle to ease working with libraries that don\'t support AndroidX yet. See more at: https://www.npmjs.com/package/jetifier.',
          default: false,
        },
      ],
    },
  ],
  assets: [],
  platforms: {
    ios: {},
    android: {},
  },
  haste: {
    providesModuleNodeModules: [
      'react-native',
    ],
    platforms: [
      'ios',
      'android',
    ],
  },
  project: {
    ios: {
      sourceDir: `${root}/node_modules/.rebox/${appName}/ios`,
      folder: root,
      pbxprojPath: `${root}/node_modules/.rebox/${appName}/ios/rebox.xcodeproj/project.pbxproj`,
      podfile: `${root}/node_modules/.rebox/${appName}/ios/Podfile`,
      podspecPath: null,
      projectPath: `${root}/node_modules/.rebox/${appName}/ios/rebox.xcodeproj`,
      projectName: 'rebox.xcodeproj',
      libraryFolder: 'Libraries',
      sharedLibraries: [],
      plist: [],
      scriptPhases: [],
    },
    android: {
      sourceDir: `${root}/node_modules/.rebox/${appName}/android/app`,
      isFlat: false,
      folder: root,
      stringsPath: `${root}/node_modules/.rebox/${appName}/android/app/src/main/res/values/strings.xml`,
      manifestPath: `${root}/node_modules/.rebox/${appName}/android/app/src/main/AndroidManifest.xml`,
      buildGradlePath: `${root}/node_modules/.rebox/${appName}/android/app/build.gradle`,
      settingsGradlePath: `${root}/node_modules/.rebox/${appName}/android/settings.gradle`,
      assetsPath: `${root}/node_modules/.rebox/${appName}/android/app/src/main/assets`,
      mainFilePath: `${root}/node_modules/.rebox/${appName}/android/app/src/main/java/com/rebox/MainApplication.java`,
      packageName: appId,
    },
  },
}

exports.printReactNativeConfig = () => {
  console.log(JSON.stringify(json))
}
