package com.rebox;

import com.facebook.react.ReactActivity;
import android.os.Bundle;
import android.preference.PreferenceManager;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "rebox";
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
      PreferenceManager.getDefaultSharedPreferences(getApplicationContext()).edit().putBoolean("js_bundle_deltas", false).apply();
      super.onCreate(savedInstanceState);
    }
}
