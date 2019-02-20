// Get the token of the user
const userDetails = JSON.parse(window.localStorage.getItem('userDetails'));

if (!userDetails) {
  // Return the user to the sign in page
  window.location.href = './signin.html';
} else {
  const userToken = userDetails.token;

  // Get the interested offices

  // Get votes that have been casted by this user
}

signoutBtnClicked = () => {
  window.localStorage.removeItem('userDetails');
  window.location.href = './signin.html';
};

dashboardSignoutBtnClicked = () => {
  window.localStorage.removeItem('userDetails');
  window.location.href = '../signin.html';
};
