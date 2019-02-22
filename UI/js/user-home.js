// Get the token of the user
const userDetails = JSON.parse(window.localStorage.getItem('userDetails'));
if (!userDetails) {
  // Return the user to the sign in page
  window.location.href = './signin.html';
}

const fetchPageInterestedOffice = () => {
  const userToken = userDetails.token;

  // Get the interested offices
  fetchInterestedOffice(userDetails.user.id, userToken, res => {
    // Check if the user has access to this page
    if (res.status === 401) {
      // Invalid token
      window.localStorage.removeItem('userDetails');
      window.location.href = './signin.html';
    } else {
      const { data } = res;
      let cardDesign = '';
      for (let ind = 0; ind < data.length; ind += 1) {
        // Check if this candidate is me
        if (data[ind].candidateid === userDetails.user.id) {
          // Get the full details of the office
          // eslint-disable-next-line no-loop-func
          fetchOfficeDetailsByID(data[ind].officeid, userToken, res => {
            // Create a card for this user
            const fullData = res.data[0];

            // Check if the date is before or after today
            let status = '';
            let statusStyle = '';

            // Get the number of candidates for this office
            let numberOfCandidates = 0;
            for (let ind2 = 0; ind2 < data.length; ind2 += 1) {
              if (data[ind2].officeid === data[ind].officeid) {
                numberOfCandidates += 1;
              }
            }

            // Just for test create column for election date default (not set)
            let electionDate = data[ind].date;
            if (!electionDate) {
              electionDate = 'Not set';
            } else {
              electionDate = new Date(electionDate).toDateString();
              const today = new Date();

              if (today < new Date(electionDate)) {
                status = 'pending';
                statusStyle = 'pending-election';
              } else {
                // TODO check if this user won or lost the election
                status = 'won';
                statusStyle = 'won-election';
              }
            }

            cardDesign += `
          <div class="individual-person-container">
            <div>
                <img src="${fullData.logourl}" />
            </div>
            <div class="profile-description-text">
                <label><span class="profile-answers">${fullData.name.charAt(0).toUpperCase() +
                  fullData.name.substr(1)}</span></label>
                <label>Candidates: <span class="profile-answers"><a href="office-candidates.html">${numberOfCandidates} Candidates</a></span></label>
                <label>Date: <span class="profile-answers">${electionDate}</span></label>
                <label><span class="${statusStyle}">${status}</span></label>
            </div>
          </div>`;

            // Check how many results there are
            if (ind + 1 === data.length && data.length % 2 !== 0) {
              cardDesign += `<div class="individual-person-container hidden-div"></div>`;
            }

            // Set the card in the provided slot
            document.getElementById('interestedOfficeSlot').innerHTML = cardDesign;
          });
        }
      }
    }
  });
};

const fetchPageVotes = () => {
  // Get votes that have been casted by this user
  const userToken = userDetails.token;

  // Get the interested offices
  fetchVotesForUser(userDetails.user.id, userToken, res => {
    const { dataa } = res;
    let cardDesign = '';
    for (let ind = 0; ind < dataa.length; ind += 1) {
      // Get the candidate's name
      // eslint-disable-next-line no-loop-func
      fetchUserByID(dataa[ind].candidateid, userToken, ({ userDets }) => {
        // Get name
        const name = `${userDets.data[0].firstname} ${userDets.data[0].lastname}`;
        const officeId = dataa[ind].officeid;
        const partyId = userDets.data[0].partyid;
        const myCandidateId = dataa[ind].candidateid;
        let officeName = '';
        let partyName = '';
        let partyLogo = '';
        let result = 0;
        let resultString = 'won';

        // Get the office name
        fetchOfficeDetailsByID(officeId, userToken, res => {
          officeName = res.data[0].name;

          // Get the profile image and name of party using partyID
          fetchPartyDetailsByID(partyId, userToken, partyRes => {
            partyName = partyRes.data[0].name;
            partyLogo = partyRes.data[0].logourl;

            // Call the collate result and get the number of votes this candidate got check if it was the highest among other candidates
            collateResult(officeId, userToken, resultRes => {
              for (let rInd = 0; rInd < resultRes.data.length; rInd += 1) {
                if (resultRes.data[rInd].candidateid === myCandidateId) {
                  result = resultRes.data[rInd].count;
                } else {
                  // eslint-disable-next-line no-lonely-if
                  if (result > resultRes.data[rInd].count) {
                    resultString = 'won';
                  } else {
                    resultString = 'lost';
                  }
                }
              }

              // Display the details in the card
              cardDesign += `
              <div class="individual-person-container">
                  <div>
                      <img src="${partyLogo}" />
                  </div>
                  <div class="profile-description-text">
                      <label><span class="profile-answers">${name}</span></label>
                      <label>Party: <span class="profile-answers">${partyName}</span></label>
                      <label>Office: <span class="profile-answers">${officeName}</span></label>
                      <label>Result: <span class="profile-answers">${result}</span> Votes</label>
                      <label><span class="${resultString}-election">${resultString}</span></label>
                  </div>
              </div>`;

              // Check how many results there are
              if (ind + 1 === dataa.length && dataa.length % 2 !== 0) {
                cardDesign += `<div class="individual-person-container hidden-div"></div>`;
              }

              // Set the card in the provided slot
              document.getElementById('userVotesSlot').innerHTML = cardDesign;
            });
          });
        });
      });
    }
    // Display number of votes this user has at the title
    document.getElementById('numberOfVotesLbl').innerHTML = dataa.length;
  });
};

signoutBtnClicked = () => {
  window.localStorage.removeItem('userDetails');
  window.location.href = './signin.html';
};

dashboardSignoutBtnClicked = () => {
  window.localStorage.removeItem('userDetails');
  window.location.href = '../signin.html';
};
