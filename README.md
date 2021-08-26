<p align="center">
  <img src="https://github.com/PiusLucky/SneakIn/blob/main/src/static/img/logo_no_gradient - github.svg" width="150" style="font-size: 2.5rem;width: 4rem;height: 4rem;display: flex;align-items: center;justify-content: center;background-color: #66c29b;border-radius: 15px;"/>
</p>

<h2 align="center">:alien: SneakIN (Beast Mode)</h2>


# A stand-alone chatting-engine built from scratch

The initial idea of this application was to take features from Whatsapp, Slack, and Telegram in building an hybrid-like Chatting System **without** depending on any form of external chatting SDK like Stream, SendBird including the Big Wolf, **Chat Engine**.



## Competitive Versions

```http
  Versions of different technologies where features were extracted
```

| Tech | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `Whatsapp` | `web/apk` | **2.21.17.2**. Andriod version |
| `Slack` | `apk` | **21.08**. Andriod version |
| `Telegram` | `web/apk` | **Desktop 2.9.2**. + 2021 alpha-version |

## Visit Site
[Check Out Live](https://sneakin.vercel.app/)
  
## ShowCase
### Home Snapshot
<div align="center">
  <img src="https://github.com/PiusLucky/SneakIn/blob/main/src/static/img/site_image/home.jpg" width="100%" style="font-size: 2.5rem;width: 100%;height: auto;display: flex;align-items: center;justify-content: center;background-color: #66c29b;border-radius: 15px;" />
</div>

<hr>

### Dashboard Snapshot (Light Mode)
<div align="center">
  <img src="https://github.com/PiusLucky/SneakIn/blob/main/src/static/img/site_image/DashboardSnapshotLight.jpg" width="100%" style="font-size: 2.5rem;width: 100%;height: auto;display: flex;align-items: center;justify-content: center;background-color: #66c29b;border-radius: 15px;"/>
</div>


### Dashboard Snapshot (Dark Mode)
<div align="center">
  <img src="https://github.com/PiusLucky/SneakIn/blob/main/src/static/img/site_image/DashboardSnapshot.jpg" width="100%" style="font-size: 2.5rem;width: 100%;height: auto;display: flex;align-items: center;justify-content: center;background-color: #66c29b;border-radius: 15px;"/>
</div>

<hr>

### PrivateChat Snapshot (Light Mode)
<div align="center">
  <img src="https://github.com/PiusLucky/SneakIn/blob/main/src/static/img/site_image/PrivateChat.jpg" width="100%" style="font-size: 2.5rem;width: 100%;height: auto;display: flex;align-items: center;justify-content: center;background-color: #66c29b;border-radius: 15px;"/>
</div>


### PrivateChat Snapshot (Dark Mode)
<div align="center">
  <img src="https://github.com/PiusLucky/SneakIn/blob/main/src/static/img/site_image/PrivateChatDark.jpg" width="100%" style="font-size: 2.5rem;width: 100%;height: auto;display: flex;align-items: center;justify-content: center;background-color: #66c29b;border-radius: 15px;"/>
</div>

<hr>

### About Snapshot (Light Mode)
<div align="left">
  <img src="https://github.com/PiusLucky/SneakIn/blob/main/src/static/img/site_image/AboutLight.jpg" width="40%" style="font-size: 2.5rem;width: 100%;height: auto;display: flex;align-items: center;justify-content: center;background-color: #66c29b;border-radius: 15px;"/>
</div>


### About Snapshot (Dark Mode)
<div align="left">
  <img src="https://github.com/PiusLucky/SneakIn/blob/main/src/static/img/site_image/About.jpg" width="40%" style="font-size: 2.5rem;width: 100%;height: auto;display: flex;align-items: center;justify-content: center;background-color: #66c29b;border-radius: 15px;"/>
</div>

<hr>

### Starred Snapshot (Light Mode)
<div align="left">
  <img src="https://github.com/PiusLucky/SneakIn/blob/main/src/static/img/site_image/Starred.jpg" width="40%" style="font-size: 2.5rem;width: 100%;height: auto;display: flex;align-items: center;justify-content: center;background-color: #66c29b;border-radius: 15px;"/>
</div>

### Starred Snapshot (Dark Mode)
<div align="left">
  <img src="https://github.com/PiusLucky/SneakIn/blob/main/src/static/img/site_image/StarredDark.jpg" width="40%" style="font-size: 2.5rem;width: 100%;height: auto;display: flex;align-items: center;justify-content: center;background-color: #66c29b;border-radius: 15px;"/>
</div>

<hr>

### Profile Snapshot (Light Mode)
<div align="left">
  <img src="https://github.com/PiusLucky/SneakIn/blob/main/src/static/img/site_image/ProfileLight.jpg" width="40%" style="font-size: 2.5rem;width: 100%;height: auto;display: flex;align-items: center;justify-content: center;background-color: #66c29b;border-radius: 15px;"/>
</div>


### Profile Snapshot (Dark Mode)
<div align="left">
  <img src="https://github.com/PiusLucky/SneakIn/blob/main/src/static/img/site_image/Profile.jpg" width="40%" style="font-size: 2.5rem;width: 100%;height: auto;display: flex;align-items: center;justify-content: center;background-color: #66c29b;border-radius: 15px;"/>
</div>

<hr>

### Firebase Rules
Database Rules
:-------------------------:
```json
{
  "rules": {
    "users": {
      ".read": "auth != null",
      ".write": "auth != null",
      "$uid": {
        ".write": "auth != null && auth.uid === $uid",
        ".validate": "(newData.hasChildren(['about', 'name', 'avatar', 'userRawData'])  && !newData.hasChildren(['starredMsgs'])) || (newData.hasChildren(['starredMsgs', 'about', 'name', 'avatar', 'userRawData'])  && newData.hasChildren(['starredMsgs']))",
        "about": {
          ".write": "auth != null",
          ".validate": "newData.hasChildren(['details', 'timeUpdated'])",
          "details": {
            ".validate": "newData.val().length > 0"
          },
          "timeUpdated": {
            ".validate": "newData.val() <= now"
          }
        },
        "name": {
          ".validate": "newData.val().length > 0"
        },
        "avatar": {
          ".validate": "newData.val().length > 0"
        },
        "starredMsgs": {
          ".read": "auth != null",
          "$starredMsgsId": {
            ".write": "auth != null && auth.uid === $uid",
            ".validate": "newData.hasChildren(['createdBy', 'isContent', 'item', 'timeStarred', 'timestamp'])",
            "createdBy": {
              ".write": "auth != null",
              ".validate": "newData.hasChildren(['id', 'name'])",
              "id": {
                ".validate": "newData.val().length > 0"
              },
              "name": {
                ".validate": "newData.val().length > 0"
              }
            },
            "isContent": {
              ".validate": "newData.val().length >= 4"
            },
            "item": {
              ".validate": "newData.val().length > 0"
            },
            "timeStarred": {
              ".validate": "newData.val() <= now"
            },
            "timestamp": {
              ".validate": "newData.val() <= now"
            }
          }
        },
        "userRawData": {
          ".write": "auth != null",
          ".validate": "newData.hasChildren(['creationTime', 'id'])",
          "creationTime": {
            ".validate": "newData.val() <= now"
          },
          "id": {
            ".validate": "newData.val() === $uid"
          }
        }
      }
    },

    "channels": {
      ".read": "auth != null",
      "$channelId": {
        ".write": "auth != null",
        ".validate": "newData.hasChildren(['id', 'name', 'createdBy', 'details', 'suscribed_users'])",
        "id": {
          ".validate": "newData.val() === $channelId"
        },
        "name": {
          ".validate": "newData.val().length >= 5"
        },
        "details": {
          ".validate": "newData.val().length >= 5"
        },
        "suscribed_users": {
          ".validate": "newData.hasChildren(['users_id', 'users_name'])"
        },
        "createdBy": {
          ".validate": "newData.hasChildren(['avatar', 'id', 'name', 'timestamp'])"
        }
      }
    },

    "messages": {
      ".read": "auth != null",
      ".write": "auth != null"
    },

    "typing": {
      ".read": "auth != null",
      ".write": "auth != null"
    },

    "presence": {
      ".read": "true",
      ".write": "true"
    },

    "privateMessagesIds": {
      ".read": "auth != null",
      ".write": "auth != null"
    },

    "unique_id_of_users": {
      ".read": "auth != null",
      "$id": {
        ".write": "auth != null",
        ".validate": "newData.hasChildren(['suscribedUsersId'])"
      }
    },

    "lastOnlinePresence": {
      ".read": "auth != null",
      "$id": {
        ".write": "auth != null",
        ".validate": "newData.hasChildren(['last_seen'])"
      }
    }
  }
}

``` 


Storage Rules
:-------------------------:
```
rules_version = '2';
service firebase.storage {
  match /b/january-ee57e.appspot.com/o {
    match /avatars {
      match /users/{userId} {
        allow read: if request.auth != null;
        allow write: if request.auth != null && request.auth.uid == userId && request.resource.contentType.matches('image/.*') && request.resource.size < 1 * 1024 * 1024;
      }
    }
    match /chat {
      match /public/{imagePath=**} {
        allow read: if request.auth != null;
        allow write: if request.auth != null && request.resource.contentType.matches('image/.*') && request.resource.size < 1 * 1024 * 1024;
      }
      match /private/{userId1}/{userId2}/{imagePath=**} {
        allow read: if request.auth != null && (request.auth.uid == userId1 || request.auth.uid == userId2);
        allow write: if request.auth != null && (request.auth.uid == userId1 || request.auth.uid == userId2) && request.resource.contentType.matches('image/.*') && request.resource.size < 1 * 1024 * 1024;
      }
    }
  }
}

```
  
## Acknowledgements

 - [Stackoverflow :: React-router-dom useParams() inside class component](https://stackoverflow.com/questions/58548767/react-router-dom-useparams-inside-class-component)
 - [Firebase Data Docs](https://firebase.google.com/docs/database/web/lists-of-data)
 - [Uploading Files to Firebase Storage](https://firebase.google.com/docs/storage/web/upload-files)
 - [Mozilla Regex](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
 - [Logic to return boolean based on client's connection status]( https://firebase.google.com/docs/database/web/offline-capabilities#section-connection-state)
 - [Retrieving Firebase data](https://firebase.google.com/docs/database/admin/retrieve-data#node.js_3)
 - [Firebase "child-added"](https://stackoverflow.com/questions/42049007/how-does-firebase-child-added-really-work)
 - [Handling window event in React](https://www.digitalocean.com/community/tutorials/how-to-handle-dom-and-window-events-with-react)
 - [Adding and removing class from document.body](https://stackoverflow.com/questions/47706903/add-a-class-to-the-html-body-tag-with-react)
 - [How to get the DOM ref of a child class component in a parent class component](https://stackoverflow.com/questions/53848512/how-to-get-the-dom-ref-of-a-child-class-component-in-a-parent-class-component)
 - [SVG loaders](https://codepen.io/aurer/pen/jEGbA)
 - [Know everything about useEffect Hook](https://blog.logrocket.com/guide-to-react-useeffect-hook/)
 - [The answer by "Aaquib Ahmed" on stackoverflow was very helpful  (he explained how the hook "useHistory" can be used to access the history object in a functional component )](https://stackoverflow.com/questions/44009618/uncaught-typeerror-cannot-read-property-push-of-undefined-react-router-dom)
 - [Setting Authorized domains in Firebase](https://stackoverflow.com/questions/64990503/react-firebase-app-auth-service-does-not-work-in-production)
 - [Cypress Login Test](https://marcinstanek.pl/en/cypress-2.html)
 - [Best Practices in writing Cypress Tests](https://ruleoftech.com/2019/notes-of-best-practices-for-writing-cypress-tests)
 - [Firebase Rules](https://medium.com/@juliomacr/10-firebase-realtime-database-rule-templates-d4894a118a98)
 - [Firebase Security and Rules](https://www.linkedin.com/pulse/firebase-database-security-rules-sachin-gawai)
 - [More on Firebase Rules ](https://firebase.google.com/docs/database/security/rules-conditions)



  
## Tech Stack

**Client:** React, Redux, Styled-component

**Server:** Firebase

**E2E Testing:** Cypress


  
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`REACT_APP_API_KEY` 

`REACT_APP_AUTH_DOMAIN` 

`REACT_APP_DATABASE_URL` 

`REACT_APP_PROJECT_ID` 

`REACT_APP_STORAGE_BUCKET` 

`REACT_APP_SENDER_ID` 

`REACT_APP_APP_ID` 


## Roadmap

- Adding more tests

- Fixing minor UI bugs

  
## Authors

- [@PiusLucky](https://github.com/PiusLucky)


## License
[MIT License](https://github.com/PiusLucky/SneakIn/blob/main/LICENSE)

  
## Support

For support, email luckypius50@gmail.com
