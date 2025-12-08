import Parse from "parse";

export const createUser = (newUser) => {
  const user = new Parse.User();

  user.set("username", newUser.email);
  user.set("firstName", newUser.firstName);
  user.set("lastName", newUser.lastName);
  user.set("password", newUser.password);
  user.set("email", newUser.email);

  console.log("User: ", user);

  return user
    .signUp()
    .then((newUserSaved) => {
      return { user: newUserSaved };
    })
    .catch((error) => {
      let errorMessage = "An error occurred during registration";
      
      if (error.code === 202) {
        errorMessage = "This email is already registered. Please use a different email or login.";
      } else if (error.code === 200) {
        errorMessage = "Username is required";
      } else if (error.code === 201) {
        errorMessage = "Password is required";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return { error: errorMessage };
    });
};

//FUNCTION ADDED TO HANDLE LOGIN
export const loginUser = (email, password) => {
  return Parse.User.logIn(email, password)
    .then((user) => {
      return { user: user };
    })
    .catch((error) => {
      let errorMessage = "An error occurred during login";
      
      if (error.code === 101) {
        errorMessage = "Invalid email or password. Please check your credentials and try again.";
      } else if (error.code === 200) {
        errorMessage = "Email is required";
      } else if (error.code === 201) {
        errorMessage = "Password is required";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return { error: errorMessage };
    });
};

//FUNCTION ADDED TO HANDLE LOGOUT
export const logoutUser = () => {
  return Parse.User.logOut().catch((error) => {
    alert(`Error: ${error.message}`);
  });
};

//FUNCTION ADDED TO CHECK IF USER IS AUTHENTICATED
export const isAuthenticated = () => {
  return Boolean(Parse.User.current());
};
