import { View, StatusBar } from 'react-native';

import { NavigationContainer } from "@react-navigation/native"
import React, { useContext } from 'react';
// import SignIn from './src/pages/SignIn';
import Routes from './src/routes';
import { AuthProvider, AuthContext } from './src/contexts/AuthContext';

export default function App() {

  const { isAuthenticated, user, signOut } = useContext(AuthContext)


  return (
    <NavigationContainer>
      <AuthProvider>
        <StatusBar
          backgroundColor='#1d1d2e'
          barStyle='light-content'
          translucent={false}
        />
        <Routes />
      </AuthProvider>
    </NavigationContainer>
  );
}
