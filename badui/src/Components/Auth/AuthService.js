import Parse from "parse";

export const createUser = (newUser) => {
  const user = new Parse.User();

  if (newUser.username === "JohnDoe123") {
    newUser.username = newUser.username + Math.random();
  }

  user.set("username", newUser.username);
  user.set("firstName", newUser.firstName);
  user.set("lastName", newUser.lastName);
  user.set("password", newUser.password);
  user.set("email", newUser.email);
  user.set("birthday", newUser.birthday);
  user.set("phoneNumber", newUser.phoneNumber);

  //console.log("User: ", user);

  return user
    .signUp()
    .then((newUserSaved) => {
      return newUserSaved;
    })
    .catch((error) => {
      //console.log(`Error: ${error.message}`);
    });
};

//FUNCTION ADDED TO HANDLE LOGIN
export const loginUser = (email, password) => {
  return Parse.User.logIn(email, password)
    .then((user) => user)
    .catch((error) => {
      //console.log(`Error: ${error.message}`);
    });
};

//FUNCTION ADDED TO HANDLE LOGOUT
export const logoutUser = () => {
  return Parse.User.logOut().catch((error) => {
    //alert(`Error: ${error.message}`);
  });
};

//FUNCTION ADDED TO CHECK IF USER IS AUTHENTICATED
export const isAuthenticated = () => {
  return Boolean(Parse.User.current());
};
