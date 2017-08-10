import React from 'react';
import { Image, TouchableOpacity, Text, Platform } from 'react-native';

import Icon from '@expo/vector-icons/FontAwesome';
import {Ionicons} from '@expo/vector-icons';
import Color from './ColorConfig'

import { StackNavigator, TabNavigator } from 'react-navigation';

import Tasks from './Tasks/Tasks.js';
import TaskDetail from './Tasks/TaskDetail.js';
import Settings from './Settings/Settings.js';

// Stack
const Tasks_Stack = StackNavigator({
  Tasks_Screen: {
    screen: Tasks,
    navigationOptions: {
      title: 'List task',
      headerStyle: {
        backgroundColor: Color.purple,
        ...Platform.select({
          android: {
            marginTop: 20,
          },
        }),
       },
      headerTintColor: 'white'
    }
  },
  TaskDetail_Screen: {
    screen: TaskDetail,
    navigationOptions: ( {navigation} ) => {
      return {
        title: `${navigation.state.params.item.name}`,
        headerRight:
        <TouchableOpacity style={{marginRight: 13}}
          onPress={() => navigation.state.params.handleSave() }>
          <Text style={{color: 'white', fontSize: 18}}>Submit</Text>
        </TouchableOpacity>,
        headerStyle: {
          backgroundColor: Color.purple,
          ...Platform.select({
            android: {
              marginTop: 20,
            },
          }),
         },
        headerTintColor: 'white'

      }
    }
  },
});

const Setting_Stack = StackNavigator({
  Settings: {
    screen: Settings,
    navigationOptions: {
      title: 'Settings',
      headerStyle: {
        backgroundColor: Color.purple,
        ...Platform.select({
          android: {
            marginTop: 20,
          },
        }),
       },
      headerTintColor: 'white'
    }
  }
});


// Tab
const Tabs = TabNavigator({
  Tasks_Tab: {
    screen: Tasks_Stack,
    navigationOptions: {
      title: 'Tasks',
      tabBarIcon: ({ tintColor }) => (
        <Icon name='tasks' size={26} color={tintColor} />
      ),
    },

  },
  Products_Tab: { screen: Setting_Stack,
    navigationOptions: {
      title: 'Products',
      tabBarIcon: ({ tintColor }) => (
        <Ionicons name='md-star-half' size={35} color={tintColor} />
      ),
    }
  },
  Customers_Tab: { screen: Setting_Stack,
    navigationOptions: {
      title: 'Customers',
      tabBarIcon: ({ tintColor }) => (
        <Icon name='heartbeat' size={30} color={tintColor} />
      ),
    }
  },
  Setting_Tab: { screen: Setting_Stack,
    navigationOptions: {
      title: 'Settings',
      tabBarIcon: ({ tintColor }) => (
        <Ionicons name='md-settings' size={30} color={tintColor} />
      ),
    }
  }
}, {
  tabBarPosition: 'bottom',
  // swipeEnabled: true,
  lazy: true,
  tabBarOptions: {
    labelStyle: {
      ...Platform.select({
        ios: {
          fontSize: 12,
        },
        android: {
          fontSize: 10,
        },
      }),

    },
    // inactiveTintColor: 'grey',
    activeTintColor: Color.purple
  }
});

export default Tabs
