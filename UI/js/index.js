const toggleMenu = chkBtn => {
  const overlay = document.getElementById('overlay');
  overlay.style.display = chkBtn.checked ? 'block' : 'none';

  // Make it not to be scrollable
  const content = document.getElementById('user-home-main');
  if (chkBtn.checked) {
    content.classList.add('makeUnscrollable');
  } else {
    content.classList.remove('makeUnscrollable');
  }
};

// Function for login
const loginBtnClicked = () => {
  // Indicate that the button has sent
  const loginBtn = document.getElementById('loginBtn');
  const alertLabel = document.getElementById('errorMessage');

  const loginDetails = {
    email: document.getElementById('loginEmail').value,
    password: document.getElementById('loginPassword').value
  };

  // Make sure the fields are not empty
  if (loginDetails.email === '') {
    alertLabel.innerHTML = 'Please enter email address';
    return null;
  }

  if (loginDetails.password === '') {
    alertLabel.innerHTML = 'Please enter password';
    return null;
  }

  loginBtn.value = 'Signing in...';
  loginBtn.disabled = true;

  const options = {
    method: 'POST',
    body: JSON.stringify(loginDetails),
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  };

  return fetch('https://politico-okwara.herokuapp.com/api/v1/auth/login', options)
    .then(res => res.json())
    .then(res => {
      // Check if the user details is valid
      if (res.status === 200) {
        console.log('Storing token ', res.data[0].token);
        window.localStorage.setItem('userToken', res.data[0].token);
        window.location.href = '../user-home.html';
      } else {
        alertLabel.innerHTML = res.error;
      }
      loginBtn.value = 'Login';
      loginBtn.disabled = false;
    })
    .catch(error => {
      loginBtn.value = 'Login';
      loginBtn.disabled = false;
    });
};
