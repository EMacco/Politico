// Get the token of the user
const userDetails = JSON.parse(window.localStorage.getItem('userDetails'));
if (!userDetails) {
  // Return the user to the sign in page
  window.location.href = '../signin.html';
}

const extractCandidateInfoFromOffice = (candidates, officeId) => {
  let count = 0;

  for (let ind = 0; ind < candidates.length; ind += 1) {
    // Check if this candidate is for the current office
    if (candidates[ind].officeid === officeId) {
      count += 1;
    }
  }

  return count;
};

const getEligibleOfficesForElection = () => {
  const userToken = userDetails.token;
  startLoading();
  // Get all the candidates
  fetchInterestedOffice(userToken, res => {
    const candidates = res.data;

    // Fetch the offices
    fetchAllOffices(userToken, officeRes => {
      const officeData = officeRes.data;
      let officeNames = `<option value="">Select Government Office...</option>`;

      for (let ind = 0; ind < officeData.length; ind += 1) {
        // Extract the candidate information for this candidate
        const count = extractCandidateInfoFromOffice(candidates, officeData[ind].id);

        if (count > 1) {
          // You can schedule election since there are at least
          // Add this office to the list of names
          officeNames += `<option value="${officeData[ind].id}">${officeData[ind].name}</option>`;
        }
      }
      stopLoading();

      // Update the select tag
      document.getElementById('officesNameSelectSlot').innerHTML = officeNames;
    });
  });
};

const scheduleElectionDate = () => {
  const userToken = userDetails.token;
  const errorLbl = document.getElementById('errorMessage');
  errorLbl.innerHTML = '';

  const successLbl = document.getElementById('successMessage');
  successLbl.innerHTML = '';
  // Get the selected item in the select tag
  const e = document.getElementById('officesNameSelectSlot');
  const selectedOfficeID = e.options[e.selectedIndex].value;
  const date = document.getElementById('scheduleElectionDateField').value;

  if (selectedOfficeID === '') {
    document.getElementById('errorMessage').innerHTML = 'Please select an office';
  } else if (date === '') {
    document.getElementById('errorMessage').innerHTML = 'Please select date';
  } else {
    startLoading();
    setElectionDate(userToken, selectedOfficeID, date, res => {
      if (res.status === 200) {
        successLbl.innerHTML = 'Election date has been set';
      } else {
        errorLbl.innerHTML = res.data.error;
      }
      stopLoading();
    });
  }
};

const createOfficeBtnClicked = () => {
  const userToken = userDetails.token;
  const errorLbl = document.getElementById('errorMessage');
  const successLbl = document.getElementById('successMessage');
  errorLbl.innerHTML = '';
  successLbl.innerHTML = '';

  const uploadBtn = document.getElementById('office-file-upload');
  const officeName = document.getElementById('newOfficeNameLbl').value.toLowerCase();
  const e = document.getElementById('officesTypeSelectSlot');
  const officeType = e.options[e.selectedIndex].value.toLowerCase();

  // Check if the fields are occupied
  try {
    if (officeName === '') {
      errorLbl.innerHTML = 'Please enter office name';
    } else if (officeType === 'select office type...') {
      errorLbl.innerHTML = 'Please select office type';
    } else if (uploadBtn.files.length === 0) {
      errorLbl.innerHTML = 'Please select an image';
    } else {
      // Upload the image to the server
      startLoading();
      uploadImage(uploadBtn.files[0], (success, url) => {
        if (success) {
          // Go ahead and create office
          createOffice(userToken, officeName, officeType, url, res => {
            // Check if it was successful
            if (res.status === 201) {
              successLbl.innerHTML = 'Office successfully created';
            } else {
              errorLbl.innerHTML = res.error;
            }
            stopLoading();
          });
        } else {
          // Display error
          errorLbl.innerHTML = url;
          stopLoading();
        }
      });
    }
  } catch (err) {
    console.log('Error: ', err);
  }
};

const createPartyBtnClicked = () => {
  const userToken = userDetails.token;
  const errorLbl = document.getElementById('errorMessage');
  const successLbl = document.getElementById('successMessage');
  errorLbl.innerHTML = '';
  successLbl.innerHTML = '';

  const uploadBtn = document.getElementById('party-file-upload');
  const partyName = document.getElementById('newPartyNameLbl').value.toLowerCase();
  const partyAddress = document.getElementById('newPartyAddressLbl').value.toLowerCase();

  // Check if the fields are occupied
  try {
    if (partyName === '') {
      errorLbl.innerHTML = 'Please enter party name';
    } else if (partyAddress === '') {
      errorLbl.innerHTML = 'Please enter party address';
    } else if (uploadBtn.files.length === 0) {
      errorLbl.innerHTML = 'Please select an image';
    } else {
      // Upload the image to the server
      startLoading();
      uploadImage(uploadBtn.files[0], (success, url) => {
        if (success) {
          // Go ahead and create office
          createParty(userToken, partyName, partyAddress, url, res => {
            // Check if it was successful
            if (res.status === 201) {
              successLbl.innerHTML = 'Political party successfully created';
            } else {
              errorLbl.innerHTML = res.error;
            }
            stopLoading();
          });
        } else {
          // Display error
          errorLbl.innerHTML = url;
          stopLoading();
        }
      });
    }
  } catch (err) {
    console.log('Error: ', err);
  }
};

const fetchOfficeInterests = () => {
  startLoading();
  const userToken = userDetails.token;
  fetchAllInterests(userToken, interestsRes => {
    const interests = interestsRes.data;
    let cardDesign = '';
    // Fetch the user Details
    for (let ind = 0; ind < interests.length; ind += 1) {
      // eslint-disable-next-line no-loop-func
      fetchUserByID(interests[ind].candidateid, userToken, userRes => {
        const candUserDetails = userRes.data[0];

        // Fetch the name of the office
        fetchOfficeDetailsByID(interests[ind].officeid, userToken, officeRes => {
          const candOfficeDetails = officeRes.data[0];

          // Fetch the name of the party
          fetchPartyDetailsByID(interests[ind].partyid, userToken, partyRes => {
            const candPartyDetails = partyRes.data[0];

            let imgUrl = candUserDetails.passporturl;
            if (imgUrl === 'https://') {
              imgUrl = '../img/person-large.png';
            }

            // Display the details in the card
            cardDesign += `
              <div class="individual-person-container">
                  <div>
                      <img src="${imgUrl}" />
                  </div>
                  <div class="profile-description-text">
                      <label><span class="profile-answers">${candUserDetails.firstname} ${
              candUserDetails.lastname
            }</span></label>
                      <label>Email: <span class="profile-answers">${
                        candUserDetails.email
                      }</span></label>
                      <label>Party: <span class="profile-answers">${
                        candPartyDetails.name
                      }</span></label>
                      <label>Office: <span class="profile-answers">${
                        candOfficeDetails.name
                      }</span></label>
                      <input type="submit" class="add-party-btn" value="Approve" name="${
                        candUserDetails.id
                      } ${candOfficeDetails.id} ${
              candPartyDetails.id
            }" onclick="approveInterest(this.name)" />
                      <input type="submit" class="remove-party-btn" value="Decline" name="${
                        candUserDetails.id
                      } ${candOfficeDetails.id} ${
              candPartyDetails.id
            }" onclick="declineInterest(this.name)" />
                  </div>
              </div>`;

            // Check how many results there are
            if (ind + 1 === interests.length && interests.length % 2 !== 0) {
              cardDesign += `<div class="individual-person-container hidden-div"></div>`;
            }

            // Set the card in the provided slot
            document.getElementById('interestsSlot').innerHTML = cardDesign;
            stopLoading();
          });
        });
      });
    }

    if (interests.length === 0) {
      stopLoading();
    }
    // Display number of votes this user has at the title
    document.getElementById('numberOfInterestsLbl').innerHTML = interests.length;
  });
};

const approveInterest = dets => {
  const userToken = userDetails.token;
  const registrationDetails = dets.split(' ');
  startLoading();
  registerCandidate(
    userToken,
    registrationDetails[0],
    registrationDetails[1],
    registrationDetails[2],
    registrationRes => {
      if (registrationRes.status !== 201) {
        showAlert(registrationRes.error);
        stopLoading();
      } else {
        // Refresh the page
        window.location.reload();
      }
    }
  );
};

const declineInterest = dets => {
  startLoading();
  const userToken = userDetails.token;
  const registrationDetails = dets.split(' ');
  declineCandidateRequest(
    userToken,
    registrationDetails[0],
    registrationDetails[1],
    registrationDetails[2],
    res => {
      window.location.reload();
    }
  );
};

const updatePartyClicked = partyId => {
  startLoading();
  const userToken = userDetails.token;
  const newPartyName = document.getElementById(`party-id-${partyId}`).value;

  updatePartyName(userToken, partyId, newPartyName, updateRes => {
    if (updateRes.status === 200) {
      window.location.reload();
    } else {
      showAlert(updateRes.error);
      stopLoading();
    }
  });
};

const deletePartyClicked = partyId => {
  startLoading();
  const userToken = userDetails.token;
  deleteParty(userToken, partyId, deleteRes => {
    if (deleteRes.status === 200) {
      window.location.reload();
    }
    stopLoading();
  });
};

const deleteOfficeClicked = officeId => {
  const userToken = userDetails.token;
  startLoading();
  deleteOffice(userToken, officeId, deleteRes => {
    if (deleteRes.status === 200) {
      window.location.reload();
    }
    stopLoading();
  });
};

const fetchPoliticalParties = () => {
  const userToken = userDetails.token;
  startLoading();

  fetchAllParties(userToken, res => {
    const { data } = res;
    let cardDesign = '';

    for (let ind = 0; ind < data.length; ind += 1) {
      // Display the details in the card
      cardDesign += `
      <div class="individual-person-container">
        <div>
            <img src="${data[ind].logourl}" />
        </div>
        <div class="profile-description-text">
        <span class="profile-answers"><input type="text" value="${
          data[ind].name
        }" class="dashboard-fields" id="party-id-${data[ind].id}" /></span>
            <label>HQ Address: <span class="profile-answers">${data[ind].hqaddress}</span></label>
            <input type="button" class="add-party-btn" value="Update" name="${
              data[ind].id
            }" onclick="updatePartyClicked(this.name)" />
            <input type="button" class="remove-party-btn" value="Delete" name="${
              data[ind].id
            }" onclick="deletePartyClicked(this.name)" />
                    </div>
                  </div>`;

      // Check how many results there are
      if (ind + 1 === data.length && data.length % 2 !== 0) {
        cardDesign += `<div class="individual-person-container hidden-div"></div>`;
      }

      // Set the card in the provided slot
      document.getElementById('dashboardPoliticalPartiesSlot').innerHTML = cardDesign;
    }
    stopLoading();
    document.getElementById('dasboardNumberOfPartiesLbl').innerHTML = data.length;
  });
};

const fetchGovernmentOffices = () => {
  const userToken = userDetails.token;
  startLoading();
  // Fetch the offices
  fetchAllOffices(userToken, officeRes => {
    const officeData = officeRes.data;
    let cardDesign = '';
    for (let ind = 0; ind < officeData.length; ind += 1) {
      // Display the details in the card
      cardDesign += `
    <div class="individual-person-container">
      <div>
          <img src="${officeData[ind].logourl}" />
      </div>
      <div class="profile-description-text">
          <label><span class="profile-answers">${officeData[ind].name}</span></label>
          <label>Type: <span class="profile-answers">${officeData[ind].type}</span></label>
          <input type="button" class="remove-party-btn" value="Delete" name="${
            officeData[ind].id
          }" onclick="deleteOfficeClicked(this.name)" />
      </div>
    </div>`;

      // Check how many results there are
      if (ind + 1 === officeData.length && officeData.length % 2 !== 0) {
        cardDesign += `<div class="individual-person-container hidden-div"></div>`;
      }

      // Set the card in the provided slot
      document.getElementById('dashboardOfficesSlot').innerHTML = cardDesign;
    }
    stopLoading();
    document.getElementById('numberOfOfficessLbl').innerHTML = officeData.length;
  });
};

dashboardSignoutBtnClicked = () => {
  window.localStorage.removeItem('userDetails');
  window.location.href = '../signin.html';
};
