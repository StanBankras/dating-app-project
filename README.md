# Project Tech: Dating app feature
This part of the dating app is for liking users that you match with. Once you like a user, and they like you too, a new chat is opened in the chat list. The chat functionality itself is not ready yet.
For the sake of testing the feature, a simple login screen is present to log in as any user you want to.

## Table of Contents
* **Installation**
* **Sources**

## Installation
To run this project use git clone in your desired location:
```
git clone git@github.com:StanBankras/dating-app-project.git
```

Then install the node modules and run:
```
npm install
npm run dev
```

## Database structure
There are two different collections in my database:
* Users
* Chats

### Users collection
**How each user looks:**

![users collection](https://i.imgur.com/PqJqwML.png)

__Gender should be m for male or f for female__

### Chats collection
**How each chat looks:**

![chats collection](https://i.imgur.com/gmYbzxV.png)

__Note that the chats collection at start should be empty, as the server creates chats by itself!__


## Sources used
* MongoDB documentation: https://docs.mongodb.com/
* MDN documentation: https://developer.mozilla.org/en-US/
* Stackoverflow for small bugs: https://stackoverflow.com/
* Expressjs site to install Express and learn basics: https://expressjs.com/en/starter/installing.html
