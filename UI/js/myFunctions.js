const serverUrl = 'https://politico-okwara.herokuapp.com';
// const serverUrl = 'http://localhost:3000';

// User page functions start here
const fetchInterestedOffice = (userToken, completionHandler) => {
  const options = {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json',
      'x-access-token': userToken
    })
  };

  fetch(`${serverUrl}/api/v1/offices/candidates`, options)
    .then(res => res.json())
    .then(res => {
      if (res.status === 401) {
        // Invalid token
        window.localStorage.removeItem('userDetails');
        window.location.href = './signin.html';
      } else {
        completionHandler(res);
      }
    })
    .catch(() => {});
};

const fetchVotesForUser = (id, userToken, completionHandler) => {
  const options = {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json',
      'x-access-token': userToken
    })
  };

  fetch(`${serverUrl}/api/v1/office/${id}/user-votes`, options)
    .then(res => res.json())
    .then(res => {
      if (res.status === 401) {
        // Invalid token
        window.localStorage.removeItem('userDetails');
        window.location.href = './signin.html';
      } else {
        completionHandler(res);
      }
    })
    .catch(() => {});
};

const fetchOfficeDetailsByID = (id, userToken, completionHandler) => {
  const options = {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json',
      'x-access-token': userToken
    })
  };

  fetch(`${serverUrl}/api/v1/offices/${id}`, options)
    .then(res => res.json())
    .then(res => {
      if (res.status === 401) {
        // Invalid token
        window.localStorage.removeItem('userDetails');
        window.location.href = './signin.html';
      } else {
        completionHandler(res);
      }
    })
    .catch(() => {});
};

const fetchUserByID = (id, userToken, completionHandler) => {
  const options = {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json',
      'x-access-token': userToken
    })
  };

  fetch(`${serverUrl}/api/v1/users/${id}`, options)
    .then(res => res.json())
    .then(res => {
      if (res.status === 401) {
        // Invalid token
        window.localStorage.removeItem('userDetails');
        window.location.href = './signin.html';
      } else {
        completionHandler(res);
      }
    })
    .catch(() => {});
};

const fetchPartyDetailsByID = (id, userToken, completionHandler) => {
  const options = {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json',
      'x-access-token': userToken
    })
  };

  fetch(`${serverUrl}/api/v1/parties/${id}`, options)
    .then(res => res.json())
    .then(res => {
      if (res.status === 401) {
        // Invalid token
        window.localStorage.removeItem('userDetails');
        window.location.href = './signin.html';
      } else {
        completionHandler(res);
      }
    })
    .catch(() => {});
};

const collateResult = (id, userToken, completionHandler) => {
  const options = {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
      'x-access-token': userToken
    })
  };

  fetch(`${serverUrl}/api/v1/office/${id}/result`, options)
    .then(res => res.json())
    .then(res => {
      if (res.status === 401) {
        // Invalid token
        window.localStorage.removeItem('userDetails');
        window.location.href = './signin.html';
      } else {
        completionHandler(res);
      }
    })
    .catch(() => {});
};

const fetchAllParties = (userToken, completionHandler) => {
  const options = {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json',
      'x-access-token': userToken
    })
  };

  fetch(`${serverUrl}/api/v1/parties`, options)
    .then(res => res.json())
    .then(res => {
      if (res.status === 401) {
        // Invalid token
        window.localStorage.removeItem('userDetails');
        window.location.href = './signin.html';
      } else {
        completionHandler(res);
      }
    })
    .catch(() => {});
};

const fetchAllOffices = (userToken, completionHandler) => {
  const options = {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json',
      'x-access-token': userToken
    })
  };

  fetch(`${serverUrl}/api/v1/offices`, options)
    .then(res => res.json())
    .then(res => {
      if (res.status === 401) {
        // Invalid token
        window.localStorage.removeItem('userDetails');
        window.location.href = './signin.html';
      } else {
        completionHandler(res);
      }
    })
    .catch(() => {});
};

const fetchAllInterests = (userToken, completionHandler) => {
  const options = {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json',
      'x-access-token': userToken
    })
  };

  fetch(`${serverUrl}/api/v1/offices/interests`, options)
    .then(res => res.json())
    .then(res => {
      if (res.status === 401) {
        // Invalid token
        window.localStorage.removeItem('userDetails');
        window.location.href = './signin.html';
      } else {
        completionHandler(res);
      }
    })
    .catch(() => {});
};

const changeUserParty = (userToken, partyId, completionHandler) => {
  const options = {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
      'x-access-token': userToken
    }),
    body: JSON.stringify({ partyId })
  };

  fetch(`${serverUrl}/api/v1/parties/join`, options)
    .then(res => res.json())
    .then(res => {
      if (res.status === 401) {
        // Invalid token
        window.localStorage.removeItem('userDetails');
        window.location.href = './signin.html';
      } else {
        completionHandler(res);
      }
    })
    .catch(() => {});
};

const expressInterest = (userToken, officeId, partyId, completionHandler) => {
  const options = {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
      'x-access-token': userToken
    }),
    body: JSON.stringify({ officeId, partyId })
  };

  fetch(`${serverUrl}/api/v1/offices/interests`, options)
    .then(res => res.json())
    .then(res => {
      if (res.status === 401) {
        // Invalid token
        window.localStorage.removeItem('userDetails');
        window.location.href = './signin.html';
      } else {
        completionHandler(res);
      }
    })
    .catch(() => {});
};

const registerVote = (userToken, officeId, candidateId, completionHandler) => {
  const options = {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
      'x-access-token': userToken
    }),
    body: JSON.stringify({ officeId, candidateId })
  };

  fetch(`${serverUrl}/api/v1/votes`, options)
    .then(res => res.json())
    .then(res => {
      if (res.status === 401) {
        // Invalid token
        window.localStorage.removeItem('userDetails');
        window.location.href = './signin.html';
      } else {
        completionHandler(res);
      }
    })
    .catch(() => {});
};

// User page functions end here

// These are the functions for the dashboard pages
const setElectionDate = (userToken, officeId, date, completionHandler) => {
  const options = {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
      'x-access-token': userToken
    }),
    body: JSON.stringify({ officeId, date })
  };

  fetch(`${serverUrl}/api/v1/office/schedule`, options)
    .then(res => res.json())
    .then(res => {
      if (res.status === 401) {
        // Invalid token
        window.localStorage.removeItem('userDetails');
        window.location.href = './signin.html';
      } else {
        completionHandler(res);
      }
    })
    .catch(() => {});
};

const createOffice = (userToken, name, type, logoUrl, completionHandler) => {
  const options = {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
      'x-access-token': userToken
    }),
    body: JSON.stringify({ name, type, logoUrl })
  };

  fetch(`${serverUrl}/api/v1/offices`, options)
    .then(res => res.json())
    .then(res => {
      if (res.status === 401) {
        // Invalid token
        window.localStorage.removeItem('userDetails');
        window.location.href = './signin.html';
      } else {
        completionHandler(res);
      }
    })
    .catch(() => {});
};

const createParty = (userToken, name, hqAddress, logoUrl, completionHandler) => {
  const options = {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
      'x-access-token': userToken
    }),
    body: JSON.stringify({ name, hqAddress, logoUrl })
  };

  fetch(`${serverUrl}/api/v1/parties`, options)
    .then(res => res.json())
    .then(res => {
      if (res.status === 401) {
        // Invalid token
        window.localStorage.removeItem('userDetails');
        window.location.href = './signin.html';
      } else {
        completionHandler(res);
      }
    })
    .catch(() => {});
};

const uploadImage = (file, completionHandler) => {
  const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dn4pokov0/upload';
  const CLOUDINARY_UPLOAD_PRESET = 'y2xpulok';
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  axios({
    url: CLOUDINARY_URL,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: formData
  })
    .then(res => {
      completionHandler(true, res.data.secure_url);
    })
    .catch(err => {
      completionHandler(false, err);
    });
};

const updateUserProfilePicture = (userToken, imageUrl, completionHandler) => {
  const options = {
    method: 'PATCH',
    headers: new Headers({
      'Content-Type': 'application/json',
      'x-access-token': userToken
    }),
    body: JSON.stringify({ imageUrl })
  };

  fetch(`${serverUrl}/api/v1/users/passport`, options)
    .then(res => res.json())
    .then(res => {
      if (res.status === 401) {
        // Invalid token
        window.localStorage.removeItem('userDetails');
        window.location.href = './signin.html';
      } else {
        completionHandler(res);
      }
    })
    .catch(() => {});
};

const registerCandidate = (userToken, candidateId, officeId, partyId, completionHandler) => {
  const options = {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
      'x-access-token': userToken
    }),
    body: JSON.stringify({ officeId, partyId })
  };

  fetch(`${serverUrl}/api/v1/office/${candidateId}/register`, options)
    .then(res => res.json())
    .then(res => {
      if (res.status === 401) {
        // Invalid token
        window.localStorage.removeItem('userDetails');
        window.location.href = './signin.html';
      } else {
        completionHandler(res);
      }
    })
    .catch(() => {});
};

const declineCandidateRequest = (userToken, candidateId, officeId, partyId, completionHandler) => {
  const options = {
    method: 'DELETE',
    headers: new Headers({
      'Content-Type': 'application/json',
      'x-access-token': userToken
    }),
    body: JSON.stringify({ officeId, partyId })
  };

  fetch(`${serverUrl}/api/v1/office/${candidateId}/delete-interest`, options)
    .then(res => res.json())
    .then(res => {
      if (res.status === 401) {
        // Invalid token
        window.localStorage.removeItem('userDetails');
        window.location.href = './signin.html';
      } else {
        completionHandler(res);
      }
    })
    .catch(() => {});
};

const deleteParty = (userToken, partyId, completionHandler) => {
  const options = {
    method: 'DELETE',
    headers: new Headers({
      'Content-Type': 'application/json',
      'x-access-token': userToken
    })
  };

  fetch(`${serverUrl}/api/v1/parties/${partyId}`, options)
    .then(res => res.json())
    .then(res => {
      if (res.status === 401) {
        // Invalid token
        window.localStorage.removeItem('userDetails');
        window.location.href = './signin.html';
      } else {
        completionHandler(res);
      }
    })
    .catch(() => {});
};

const deleteOffice = (userToken, officeId, completionHandler) => {
  const options = {
    method: 'DELETE',
    headers: new Headers({
      'Content-Type': 'application/json',
      'x-access-token': userToken
    })
  };

  fetch(`${serverUrl}/api/v1/offices/${officeId}`, options)
    .then(res => res.json())
    .then(res => {
      if (res.status === 401) {
        // Invalid token
        window.localStorage.removeItem('userDetails');
        window.location.href = './signin.html';
      } else {
        completionHandler(res);
      }
    })
    .catch(() => {});
};

const updatePartyName = (userToken, partyId, newName, completionHandler) => {
  const options = {
    method: 'PATCH',
    headers: new Headers({
      'Content-Type': 'application/json',
      'x-access-token': userToken
    }),
    body: JSON.stringify({ name: newName })
  };

  fetch(`${serverUrl}/api/v1/parties/${partyId}/name`, options)
    .then(res => res.json())
    .then(res => {
      if (res.status === 401) {
        // Invalid token
        window.localStorage.removeItem('userDetails');
        window.location.href = './signin.html';
      } else {
        completionHandler(res);
      }
    })
    .catch(() => {});
};
// Dashboard pags functions end here

const showAlert = message => {
  const loader = document.getElementById('loadingIconContainer');
  loader.style.display = 'block';
  loader.style.background = 'rgba(0, 0, 0, 0.1)';
  loader.innerHTML = `<span class="centerLoadingIcon" id="alertMessageContainer"><b>Alert</b><br /><br />${message}<br /> <br /><input type="button" value="close" onclick="stopLoading()" /></span>

  
  `;
};

const startLoading = () => {
  const loader = document.getElementById('loadingIconContainer');
  loader.style.display = 'block';
  loader.style.background = 'rgba(0, 0, 0, 0)';
  loader.innerHTML = `<img src="./img/output.gif" class="centerLoadingIcon"/>`;
};

const stopLoading = () => {
  document.getElementById('loadingIconContainer').style.display = 'none';
};
