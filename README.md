# ionic-todo
A cross-platform mobile application built with Ionic framework for an ESGI course

## Environment
On macOS, simply use Visual Studio Code with the "Cordova Tools" plugins

## Build and test
- You can whether use the serve command to test the app in your browser:
```
ionic serve --lab
```

- Or actually build and test it for each platform: 
    - iOS:

    Running the app on an actual iOS device is too complicated, so let's just emulate:
    ```
    ionic build ios
    ionic emulate ios
    ```
    - Android:
    
    In the other hand, it is much simpler to run on an Android device:
    ```
    ionic build android
    ionic run android
    ```