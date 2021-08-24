import * as actionTypes from './types';

// User actions
export const setUser = user => {
  return {
    type: actionTypes.SET_USER,
    payload: {
      currentUser: user
    }
  }
};

export const clearUser = () => {
  return {
    type: actionTypes.CLEAR_USER
  }
};


// Channel actions

export const setCurrentChannel = channel => {
  return {
    type: actionTypes.SET_CURRENT_CHANNEL,
    payload: {
      currentChannel: channel
    }
  };
};

// PrivateChannel actions

export const setPrivateChannel = isPrivateChannel => {
  return {
    type: actionTypes.SET_PRIVATE_CHANNEL,
    payload: {
      isPrivateChannel
    }
  };
};


// Online Status actions

export const setOnlineStatus = onlineStatus => {
  return {
    type: actionTypes.SET_ONLINE_STATUS,
    payload: {
      onlineStatus
    }
  };
};


// Online Live actions

export const setOnlineLive = onlineLive => {
  return {
    type: actionTypes.SET_ONLINE_LIVE,
    payload: {
      onlineLive
    }
  };
};



// Notification actions

export const setNotification = notification => {
  return {
    type: actionTypes.SET_NOTIFICATION,
    payload: {
      notification
    }
  };
};


// Channel Notification actions

export const setChannelNotification = cNotifications => {
  return {
    type: actionTypes.SET_CHANNEL_NOTIFICATION,
    payload: {
      cNotifications
    }
  };
};



//User Info actions

export const setUserInfo = info => {
  return {
    type: actionTypes.SET_USER_INFO,
    payload: {
      info
    }
  };
};


// SET_ACTIVE_COMPONENT actions

export const setActiveComponent = status => {
  return {
    type: actionTypes.SET_ACTIVE_COMPONENT,
    payload: {
      status
    }
  };
};


// SET_USER_CURRENTLY_IN_VIEW actions

export const setUserCurrentlyInView = user => {
  return {
    type: actionTypes.SET_USER_CURRENTLY_IN_VIEW,
    payload: {
      user
    }
  };
};


// SET_USERS_AVATAR_PAIR actions

export const setUsersAvatarPair = pair => {
  // pair is the real data (in this case, an Array)
  return {
    type: actionTypes.SET_USERS_AVATAR_PAIR,
    payload: {
      pair
    }
  };
};




// SET_CURRENT_CHANNEL_MESSAGES actions

export const setChannelMessage = msgs => {
  return {
    type: actionTypes.SET_CURRENT_CHANNEL_MESSAGES,
    payload: {
      msgs
    }
  };
};


// SET_CURRENT_THEME actions
export const setCurrentTheme = theme => {
  return {
    type: actionTypes.SET_CURRENT_THEME,
    payload: {
      theme
    }
  };
};



