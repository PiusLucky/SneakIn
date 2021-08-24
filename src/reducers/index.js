import { combineReducers } from 'redux';
import * as actionTypes from '../actions/types';

const initialUserState = {
  currentUser: null,
  isLoading: true
};

const user_reducer = (state = initialUserState, action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        currentUser: action.payload.currentUser,
        isLoading: false
      };
    
    case actionTypes.CLEAR_USER:
      return {
        ...state,
        isLoading: false
      };

    default:
      return state;
  }
};




// user_info reducer

const initialUserInfoState = {
  userInfo: [],
};

const user_info_reducer = (state = initialUserInfoState, action) => {
  switch (action.type) {
    case actionTypes.SET_USER_INFO:
      return {
        ...state,
        userInfo: action.payload.info,
      };
    
    default:
      return state;
  }
};

// user_in_view reducer

const initialViewState = {
  currentUserInView: "",
};

const user_currently_inview_reducer = (state = initialViewState, action) => {
  switch (action.type) {
    case actionTypes.SET_USER_CURRENTLY_IN_VIEW:
      return {
        ...state,
        currentUserInView: action.payload.user,
      };
    
    default:
      return state;
  }
};

// users_avatar_pair reducer

const initialAvatarState = {
  avatarPair: "",
};

const users_avatar_pair_reducer = (state = initialAvatarState, action) => {
  switch (action.type) {
    case actionTypes.SET_USERS_AVATAR_PAIR:
      return {
        ...state,
        avatarPair: action.payload.pair,
      };
    
    default:
      return state;
  }
};


// user_info reducer

const initialComponentStatus = {
  component_status: {},
};


const component_status_reducer = (state = initialComponentStatus, action) => {
  switch (action.type) {
    case actionTypes.SET_ACTIVE_COMPONENT:
      return {
        ...state,
        component_status: action.payload.status,
      };
    
    default:
      return state;
  }
};



const initialChannelState = {
  currentChannel: null,
  isPrivateChannel: false,
  onlineStatus: [],
  onlineLive: [],
  notifications: [],
  cNotifications: [],
  channelMessages: []
};


// Channel reducer

const channel_reducer = (state = initialChannelState, action) => {
  switch (action.type) {
    case actionTypes.SET_CURRENT_CHANNEL:
      return {
        ...state,
        currentChannel: action.payload.currentChannel
      }; 
    case actionTypes.SET_PRIVATE_CHANNEL:
      return {
        ...state,
        isPrivateChannel: action.payload.isPrivateChannel
      };
    case actionTypes.SET_ONLINE_STATUS:
      return {
        ...state,
        onlineStatus: action.payload.onlineStatus
      };
    case actionTypes.SET_ONLINE_LIVE:
      return {
        ...state,
        onlineLive: action.payload.onlineLive
      };
    case actionTypes.SET_NOTIFICATION:
      return {
        ...state,
        notifications: action.payload.notification
      };
    case actionTypes.SET_CHANNEL_NOTIFICATION:
      return {
        ...state,
        cNotifications: action.payload.cNotifications
      };
    case actionTypes.SET_CURRENT_CHANNEL_MESSAGES:
      return {
        ...state,
        channelMessages: action.payload.msgs
      };
    default:
      return state;
  }
};



// setCurrentTheme reducer

const initialThemeState = {
  color: "",
};

const theme_reducer = (state = initialThemeState, action) => {
  switch (action.type) {
    case actionTypes.SET_CURRENT_THEME:
      return {
        ...state,
        color: action.payload.theme,
      };
    
    default:
      return state;
  }
};



const rootReducer = combineReducers({
  user: user_reducer,
  channel: channel_reducer,
  userInfo: user_info_reducer,
  compStatus: component_status_reducer,
  userInView: user_currently_inview_reducer,
  usersAvatarPair: users_avatar_pair_reducer,
  theme: theme_reducer
});



export default rootReducer;


