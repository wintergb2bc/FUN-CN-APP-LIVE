#!/bin/sh
# Type a script or drag a script file from your workspace to insert its path.

APP_PATH="${TARGET_BUILD_DIR}/${WRAPPER_NAME}"



# This script loops through the frameworks embedded in the application and

# removes unused architectures.

# If some frameword doesn't have an invalid architecture, the script does

# nothing to it and just goes to the next one

find "$APP_PATH" -name '*.framework' -type d | while read -r FRAMEWORK

do

    FRAMEWORK_EXECUTABLE_NAME=$(defaults read "$FRAMEWORK/Info.plist" CFBundleExecutable)

    FRAMEWORK_EXECUTABLE_PATH="$FRAMEWORK/$FRAMEWORK_EXECUTABLE_NAME"

    echo "Executable is $FRAMEWORK_EXECUTABLE_PATH"



    if xcrun lipo -info "${FRAMEWORK_EXECUTABLE_PATH}" | grep -v --silent "i386\|x86_64"; then

        echo "This framework does not contain simulator archs: $FRAMEWORK_EXECUTABLE_NAME"

        continue

    fi



    EXTRACTED_ARCHS=()



    for ARCH in $ARCHS

    do

        echo "Extracting $ARCH from $FRAMEWORK_EXECUTABLE_NAME"

        lipo -extract "$ARCH" "$FRAMEWORK_EXECUTABLE_PATH" -o "$FRAMEWORK_EXECUTABLE_PATH-$ARCH"

        EXTRACTED_ARCHS+=("$FRAMEWORK_EXECUTABLE_PATH-$ARCH")

    done



    echo "Merging extracted architectures: ${ARCHS}"

    lipo -o "$FRAMEWORK_EXECUTABLE_PATH-merged" -create "${EXTRACTED_ARCHS[@]}"

    rm "${EXTRACTED_ARCHS[@]}"



    echo "Replacing original executable with thinned version"

    rm "$FRAMEWORK_EXECUTABLE_PATH"

    mv "$FRAMEWORK_EXECUTABLE_PATH-merged" "$FRAMEWORK_EXECUTABLE_PATH"



done

