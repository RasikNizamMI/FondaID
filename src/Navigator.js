// Navigation.js

import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image} from 'react-native';

// Import your screen components
import SplashScreen from './pages/SplashScreen';
import OnboardingScreen from './pages/OnboardingScreen';
import LoginScreen from './pages/LoginScreen';
import LoginOtpScreen from './pages/LoginOtpScreen';
import DataStoragePolicyScreen from './pages/DataStoragePolicyScreen';
import Dashboard from './pages/Dashboard';
import ProfileScreen from './pages/ProfileScreen';
import NotificationScreen from './pages/NotificationScreen';
import SettingScreen from './pages/SettingScreen';
import SharingScreen from './pages/SharingScreen';
import AddNewDocumentScreen from './pages/AddNewDocumentScreen';
import ConfirmDocument from './pages/ConfirmDocument';
import SubmitSuccess from './pages/SubmitSuccess';
import RegisterScreen from './pages/RegisterScreen';
import CaptureFaceIDScreen from './pages/CaptureFaceIDScreen';
import UploadDocumentScreen from './pages/UploadDocumentScreen';
import CapturePictureInstructionScreen from './pages/CapturePictureInstructionScreen';
import CapturePictureScreen from './pages/CapturePictureScreen';
import PreviewDetailsScreen from './pages/PreviewDetailsScreen';
import SubmitSuccessScreen from './pages/SubmitSuccessScreen';
import TouchIDLogin from './pages/TouchIDLogin';
import OTPVerificationScreen from './pages/OTPVerificationScreen';
import DocumentDetailsScreen from './pages/DocumentDetailsScreen';
import BioDetailsScreen from './pages/BioDetailsScreen';

import {LogBox} from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); // Ignore all log notifications

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const OnboardStack = createStackNavigator();

const Onboard = () => (
  <OnboardStack.Navigator initialRouteName="OnboardingScreen">
    <OnboardStack.Screen
      name="OnboardingScreen"
      component={OnboardingScreen}
      options={{headerShown: false}}
    />
    </OnboardStack.Navigator>
)

const AuthStack = createStackNavigator();

const Auth = () => (
  <AuthStack.Navigator initialRouteName="LoginScreen">
    <AuthStack.Screen
      name="LoginScreen"
      component={LoginScreen}
      options={{headerShown: false}}
    />
    <AuthStack.Screen
      name="TouchIDLogin"
      component={TouchIDLogin}
      options={{headerShown: false}}
    />
    <AuthStack.Screen
      name="LoginOtpScreen"
      component={LoginOtpScreen}
      options={{headerShown: false}}
    />
    <AuthStack.Screen
      name="RegisterScreen"
      component={RegisterScreen}
      options={{headerShown: false}}
    />
    <AuthStack.Screen
      name="OTPVerificationScreen"
      component={OTPVerificationScreen}
      options={{headerShown: false}}
    />
    <AuthStack.Screen
      name="CaptureFaceIDScreen"
      component={CaptureFaceIDScreen}
      options={{headerShown: false}}
    />
    <AuthStack.Screen
      name="UploadDocumentScreen"
      component={UploadDocumentScreen}
      options={{headerShown: false}}
    />
    <AuthStack.Screen
      name="CapturePictureInstructionScreen"
      component={CapturePictureInstructionScreen}
      options={{headerShown: false}}
    />
    <AuthStack.Screen
      name="CapturePictureScreen"
      component={CapturePictureScreen}
      options={{headerShown: false}}
    />
    <AuthStack.Screen
      name="previewDetailsScreen"
      component={PreviewDetailsScreen}
      options={{headerShown: false}}
    />
    <AuthStack.Screen
      name="SubmitSuccessScreen"
      component={SubmitSuccessScreen}
      options={{headerShown: false}}
    />
    
  </AuthStack.Navigator>
);

const HomeStack = createStackNavigator();

const HomeStackScreen = () => (
  <HomeStack.Navigator
  initialRouteName="Dashboard"
    screenOptions={{
      headerShown: false,
    }}>
    <HomeStack.Screen name="Dashboard" component={Dashboard} />
    <HomeStack.Screen
      name="BioDetailsScreen"
      component={BioDetailsScreen}
    />
    <HomeStack.Screen
      name="DocumentDetailsScreen"
      component={DocumentDetailsScreen}
    />
    <HomeStack.Screen name="SharingScreen" component={SharingScreen} />
    <HomeStack.Screen
      name="AddNewDocumentScreen"
      component={AddNewDocumentScreen}
    />
    <HomeStack.Screen name="ConfirmDocument" component={ConfirmDocument} />
    <HomeStack.Screen name="SubmitSuccess" component={SubmitSuccess} />
    {/* Add more screens specific to the HomeStack */}
  </HomeStack.Navigator>
);

const Home = () => (
  <Tab.Navigator
    initialRouteName="HomeStackScreen"
    screenOptions={({route}) => ({
      tabBarStyle: {height: 80},
      tabBarIcon: ({focused, color, size}) => {
        let iconSource;

        if (route.name === 'Dashboard') {
          iconSource = focused
            ? require('./images/Dashboard1.png')
            : require('./images/Dashboard.png');
        } else if (route.name === 'Profile') {
          iconSource = focused
            ? require('./images/profile1.png')
            : require('./images/profile.png');
        } else if (route.name === 'Notification') {
          iconSource = focused
            ? require('./images/notification1.png')
            : require('./images/notification.png');
        } else if (route.name === 'Setting') {
          iconSource = focused
            ? require('./images/setting1.png')
            : require('./images/setting.png');
        }

        return (
          <Image source={iconSource} style={{width: size, height: size}} />
        );
      },
    })}
    tabBarOptions={{
      showLabel: false,
    }}>
    <Tab.Screen
      name="Dashboard"
      component={HomeStackScreen}
      options={{headerShown: false}}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{headerShown: false}}
    />
    <Tab.Screen
      name="Notification"
      component={NotificationScreen}
      options={{headerShown: false}}
    />
    <Tab.Screen
      name="Setting"
      component={SettingScreen}
      options={{headerShown: false}}
    />
  </Tab.Navigator>
);

function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen">
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{headerShown: false}}
          // initialParams={{ navigation }} // Pass the navigation prop to SplashScreen
        />
        <Stack.Screen
          name="Onboard"
          component={Onboard}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Auth"
          component={Auth}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;
