package com.polites.android;

/**
 * Created by august on 15/12/22.
 */

import android.net.Uri;
import android.support.annotation.Nullable;

import com.facebook.react.uimanager.ReactProp;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;


public class GestureImageManager extends SimpleViewManager<GestureImageView>{

    @Override
    public String getName() {
        return "GestureImageView";
    }


    @Override
    protected GestureImageView createViewInstance(ThemedReactContext reactContext) {
        GestureImageView gestureImageView = new GestureImageView(reactContext);
        return gestureImageView;
    }

    @ReactProp(name = "uri")
    public void setURI(GestureImageView view, @Nullable String uri){
        view.setImageURI(Uri.parse(uri));
    }

}
