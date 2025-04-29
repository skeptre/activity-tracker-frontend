#!/bin/bash

# Clean iOS and Android platforms script for React Native/Expo
# Addresses version mismatches and configuration issues

set -e # Exit immediately if a command fails
SCRIPT_DIR=$(dirname "$0")
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

echo "🧹 Starting platform cleanup..."
echo "📂 Working in: $ROOT_DIR"

# Function to run commands with proper logging
run_command() {
  local command="$1"
  local error_message="$2"
  echo "🔄 Running: $command"
  if eval "$command"; then
    echo "✅ Done"
  else
    echo "❌ Failed: $error_message"
    return 1
  fi
}

# Check for Java version
check_java_version() {
  echo "🔍 Checking Java version..."
  if command -v java &> /dev/null; then
    JAVA_VERSION=$(java -version 2>&1 | awk -F '"' '/version/ {print $2}')
    echo "📊 Java Version: $JAVA_VERSION"
    
    # Extract major version
    JAVA_MAJOR_VERSION=$(echo "$JAVA_VERSION" | cut -d'.' -f1)
    if [[ "$JAVA_MAJOR_VERSION" == "1" ]]; then
      # For older Java versions like 1.8.0, the major version is in the second component
      JAVA_MAJOR_VERSION=$(echo "$JAVA_VERSION" | sed -E 's/1\.([0-9]+).*/\1/g')
    fi
    
    if [[ "$JAVA_MAJOR_VERSION" -gt 17 ]]; then
      echo "⚠️ Warning: Java version $JAVA_MAJOR_VERSION detected. Gradle 8.3 works best with Java 17 or lower."
      
      # Check if Java 17 is installed on macOS
      if [[ "$OSTYPE" == "darwin"* ]]; then
        if [[ -d "/Library/Java/JavaVirtualMachines/temurin-17.jdk" ]]; then
          echo "✅ Found Java 17 (Temurin) in /Library/Java/JavaVirtualMachines/temurin-17.jdk"
          export JAVA_HOME="/Library/Java/JavaVirtualMachines/temurin-17.jdk/Contents/Home"
        elif [[ -d "/Library/Java/JavaVirtualMachines/corretto-17.jdk" ]]; then
          echo "✅ Found Java 17 (Corretto) in /Library/Java/JavaVirtualMachines/corretto-17.jdk"
          export JAVA_HOME="/Library/Java/JavaVirtualMachines/corretto-17.jdk/Contents/Home"
        elif [[ -d "$HOME/Library/Java/JavaVirtualMachines/corretto-17.0.13" ]]; then
          echo "✅ Found Java 17 (Corretto) in $HOME/Library/Java/JavaVirtualMachines/corretto-17.0.13"
          export JAVA_HOME="$HOME/Library/Java/JavaVirtualMachines/corretto-17.0.13/Contents/Home"
        else
          echo "⚠️ Java 17 not found. You may need to install it for better Gradle compatibility."
        fi
        
        if [[ -n "$JAVA_HOME" ]]; then
          echo "🔧 Setting JAVA_HOME to $JAVA_HOME"
          echo "JAVA_HOME=$JAVA_HOME" > .env.local
        fi
      fi
    fi
  else
    echo "⚠️ Java not found. You may need to install it."
  fi
}

# Fix Android SDK versions
fix_android_sdk_versions() {
  echo "🔧 Fixing Android SDK versions..."
  
  # Check if the build.gradle file exists
  if [[ -f "android/build.gradle" ]]; then
    # Create backup
    cp android/build.gradle android/build.gradle.bak
    
    # Update compileSdkVersion to 34 (Android 14) to ensure compatibility with modern devices
    # while not requiring API 35-36 (which is quite new and might cause compatibility issues)
    sed -i.tmp 's/compileSdkVersion = Integer.parseInt(findProperty(.android.compileSdkVersion.) ?: .35.)/compileSdkVersion = Integer.parseInt(findProperty("android.compileSdkVersion") ?: "34")/' android/build.gradle
    
    # Update targetSdkVersion to 33 or 34 for better compatibility
    sed -i.tmp 's/targetSdkVersion = Integer.parseInt(findProperty(.android.targetSdkVersion.) ?: .34.)/targetSdkVersion = Integer.parseInt(findProperty("android.targetSdkVersion") ?: "33")/' android/build.gradle
    
    # Update buildToolsVersion to a more stable version
    sed -i.tmp 's/buildToolsVersion = findProperty(.android.buildToolsVersion.) ?: .35.0.0./buildToolsVersion = findProperty("android.buildToolsVersion") ?: "34.0.0"/' android/build.gradle
    
    # Remove temporary files
    rm -f android/build.gradle.tmp
    
    echo "✅ Updated Android SDK versions to more compatible values"
  else
    echo "⚠️ android/build.gradle not found, skipping Android SDK version fix"
  fi
}

# Fix Hermes configuration
fix_android_hermes() {
  echo "🔧 Fixing Android Hermes configuration..."
  
  if [[ -f "android/app/build.gradle" ]]; then
    # Create backup
    cp android/app/build.gradle android/app/build.gradle.bak
    
    # Replace hermesEnabled reference with proper approach
    sed -i.tmp '/implementation("com.facebook.react:hermes-android")/,/implementation jscFlavor/ {
      s/if (hermesEnabled.toBoolean())/if (findProperty("hermesEnabled") ?: "true" == "true" || findProperty("expo.jsEngine") == "hermes")/
    }' android/app/build.gradle
    
    rm -f android/app/build.gradle.tmp
    
    # Ensure gradle.properties has the correct Hermes configuration
    if [[ -f "android/gradle.properties" ]]; then
      if ! grep -q "hermesEnabled=true" android/gradle.properties; then
        echo "" >> android/gradle.properties
        echo "# Enable Hermes - JavaScript engine" >> android/gradle.properties
        echo "hermesEnabled=true" >> android/gradle.properties
        echo "expo.jsEngine=hermes" >> android/gradle.properties
      fi
    fi
    
    echo "✅ Android Hermes configuration fixed"
  else
    echo "⚠️ android/app/build.gradle not found, skipping Hermes fix"
  fi
}

# Clean Android project
clean_android() {
  echo "🧹 Cleaning Android project..."
  
  if [[ -d "android" ]]; then
    # Remove build directories
    run_command "rm -rf android/app/build" "Failed to remove Android app build directory"
    run_command "rm -rf android/.gradle" "Failed to remove Android Gradle cache"
    run_command "rm -rf android/build" "Failed to remove Android build directory"
    
    # Clean Gradle cache
    if [[ -d "$HOME/.gradle/caches" ]]; then
      run_command "rm -rf $HOME/.gradle/caches/build-cache-*" "Failed to clean Gradle build cache"
    fi
    
    echo "✅ Android project cleaned"
  else
    echo "⚠️ android directory not found, skipping Android cleanup"
  fi
}

# Clean iOS project
clean_ios() {
  echo "🧹 Cleaning iOS project..."
  
  if [[ -d "ios" ]]; then
    # Remove build directories and products
    run_command "rm -rf ios/build" "Failed to remove iOS build directory"
    run_command "rm -rf ios/Pods" "Failed to remove iOS Pods"
    run_command "rm -rf ios/Podfile.lock" "Failed to remove Podfile.lock"
    
    # Clean derived data (this can be large)
    if [[ -d "$HOME/Library/Developer/Xcode/DerivedData" ]]; then
      run_command "rm -rf $HOME/Library/Developer/Xcode/DerivedData/*frontendapp*" "Failed to clean Xcode DerivedData"
    fi
    
    echo "✅ iOS project cleaned"
  else
    echo "⚠️ ios directory not found, skipping iOS cleanup"
  fi
}

# Rebuild native projects
rebuild_native() {
  echo "🏗️ Rebuilding native projects..."
  
  # Run prebuild with clean option
  run_command "npx expo prebuild --clean --no-install" "Failed to prebuild project"
  
  echo "✅ Native projects rebuilt"
}

# Fix iOS Pods issues
fix_ios_pods() {
  echo "🔧 Fixing iOS Pods issues..."
  
  if [[ -d "ios" ]]; then
    # Make sure Podfile has the correct iOS version
    if [[ -f "ios/Podfile" ]]; then
      cp ios/Podfile ios/Podfile.bak
      
      # Update iOS deployment target if needed
      sed -i.tmp "s/platform :ios, podfile_properties\['ios.deploymentTarget'\] || '15.1'/platform :ios, podfile_properties['ios.deploymentTarget'] || '14.0'/" ios/Podfile
      
      rm -f ios/Podfile.tmp
    fi
    
    # Check and fix ExpoModulesCore.podspec if needed
    if [[ -f "node_modules/expo-modules-core/ExpoModulesCore.podspec" ]]; then
      # Make a backup
      cp node_modules/expo-modules-core/ExpoModulesCore.podspec node_modules/expo-modules-core/ExpoModulesCore.podspec.bak
      
      # Attempt to fix the get_folly_config issue if it exists
      sed -i.tmp 's/compiler_flags = get_folly_config\(\)\[:compiler_flags\] \+ /compiler_flags = /' node_modules/expo-modules-core/ExpoModulesCore.podspec
      
      rm -f node_modules/expo-modules-core/ExpoModulesCore.podspec.tmp
      
      echo "✅ Attempted to fix ExpoModulesCore.podspec"
    fi
    
    echo "✅ iOS Pods issues fixed"
  else
    echo "⚠️ ios directory not found, skipping iOS Pods fixes"
  fi
}

# Add useful scripts to package.json
update_package_scripts() {
  echo "🔧 Updating package.json scripts..."
  
  if [[ -f "package.json" ]]; then
    # Check if jq is installed (required for JSON manipulation)
    if command -v jq &> /dev/null; then
      # Create a temporary file
      cp package.json package.json.bak
      
      # Add or update useful scripts
      jq '.scripts["clean"] = "rm -rf node_modules && npm install"' package.json > temp.json && mv temp.json package.json
      jq '.scripts["clean:android"] = "cd android && ./gradlew clean && cd .."' package.json > temp.json && mv temp.json package.json
      jq '.scripts["clean:ios"] = "cd ios && rm -rf Pods Podfile.lock build && pod install && cd .."' package.json > temp.json && mv temp.json package.json
      jq '.scripts["start:clear"] = "expo start --clear"' package.json > temp.json && mv temp.json package.json
      
      echo "✅ package.json scripts updated"
    else
      echo "⚠️ jq not installed, skipping package.json update"
      echo "  Install jq with 'brew install jq' (macOS) or 'apt-get install jq' (Linux)"
    fi
  else
    echo "⚠️ package.json not found, skipping script updates"
  fi
}

# Main function
main() {
  echo "🚀 Starting platforms cleanup process..."
  
  check_java_version
  fix_android_sdk_versions
  clean_android
  clean_ios
  fix_android_hermes
  fix_ios_pods
  update_package_scripts
  # Uncomment the next line if you want to automatically rebuild native projects
  # rebuild_native
  
  echo ""
  echo "🎉 Platform cleanup completed!"
  echo ""
  echo "To rebuild native projects, run:"
  echo "  npx expo prebuild --clean"
  echo ""
  echo "To run your app:"
  echo "  • For Android: npm run android"
  echo "  • For iOS: npm run ios"
  echo "  • For development: npx expo start"
  echo ""
  echo "If issues persist, check the logs for specific errors."
}

# Run main function
main 