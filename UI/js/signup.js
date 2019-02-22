// Function to check if all registration fields are filled
const fieldsNotEmpty = registerDetails => {
  const alertLabel = document.getElementById('errorMessage');
  if (registerDetails.firstName === '') {
    alertLabel.innerHTML = 'Please enter first name';
    return false;
  }

  if (registerDetails.lastName === '') {
    alertLabel.innerHTML = 'Please enter last name';
    return false;
  }

  if (registerDetails.phoneNumber === '') {
    alertLabel.innerHTML = 'Please enter phone number';
    return false;
  }

  if (registerDetails.email === '') {
    alertLabel.innerHTML = 'Please enter email address';
    return false;
  }

  if (registerDetails.password === '') {
    alertLabel.innerHTML = 'Please enter password';
    return false;
  }

  return true;
};

// Function for login
const signupBtnClicked = () => {
  // Indicate that the button has sent
  const signupBtn = document.getElementById('signupBtn');
  const alertLabel = document.getElementById('errorMessage');

  const registerDetails = {
    firstName: document.getElementById('firstNameField').value,
    lastName: document.getElementById('lastNameField').value,
    phoneNumber: document.getElementById('phoneField').value,
    email: document.getElementById('emailField').value,
    password: document.getElementById('passwordField').value,
    passportUrl: 'https://'
  };

  // Make sure the fields are not empty
  if (fieldsNotEmpty(registerDetails)) {
    signupBtn.value = 'Registering User...';
    signupBtn.disabled = true;

    alertLabel.innerHTML = '';

    const options = {
      method: 'POST',
      body: JSON.stringify(registerDetails),
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    };

    return fetch('https://politico-okwara.herokuapp.com/api/v1/auth/signup', options)
      .then(res => res.json())
      .then(res => {
        console.log(res);
        // Check if the user details is valid
        if (res.status === 201) {
          window.localStorage.setItem('userDetails', JSON.stringify(res.data[0]));
          window.location.href = './user-home.html';
        } else {
          alertLabel.innerHTML = res.error;
        }
        signupBtn.value = 'Join Us';
        signupBtn.disabled = false;
      })
      .catch(() => {
        signupBtn.value = 'Join Us';
        signupBtn.disabled = false;
      });
  }
  return null;
};
