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
    setElectionDate(userToken, selectedOfficeID, date, res => {
      if (res.status === 200) {
        successLbl.innerHTML = 'Election date has been set';
      } else {
        errorLbl.innerHTML = res.data.error;
      }
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
  let imgName = '';

  // Check if the fields are occupied
  try {
    if (officeName === '') {
      errorLbl.innerHTML = 'Please enter office name';
    } else if (officeType === 'select office type...') {
      errorLbl.innerHTML = 'Please select office type';
    } else if (uploadBtn.files.length === 0) {
      errorLbl.innerHTML = 'Please select an image';
    } else {
      imgName = uploadBtn.files[0].name.toLowerCase();

      // Upload the image to the server
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
          });
        } else {
          // Display error
          errorLbl.innerHTML = url;
        }
      });
    }
  } catch (err) {
    console.log('Error: ', err);
  }
};

dashboardSignoutBtnClicked = () => {
  window.localStorage.removeItem('userDetails');
  window.location.href = '../signin.html';
};
