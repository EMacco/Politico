const serverUrl = 'https://politico-okwara.herokuapp.com';
// const serverUrl = 'http://localhost:3000';

const fetchInterestedOffice = (id, userToken, completionHandler) => {
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
      // Check if the user details is valid
      completionHandler(res);
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
      // Check if the user details is valid
      completionHandler(res);
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
      // Check if the user details is valid
      completionHandler(res);
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
      // Check if the user details is valid
      completionHandler({ userDets: res });
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
      // Check if the user details is valid
      completionHandler(res);
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
      // Check if the user details is valid
      completionHandler(res);
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
      // Check if the user details is valid
      completionHandler(res);
    })
    .catch(() => {});
};
