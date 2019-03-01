// Get the token of the user
const userDetails = JSON.parse(window.localStorage.getItem('userDetails'));
if (!userDetails) {
  // Return the user to the sign in page
  window.location.href = './signin.html';
}

const fetchPageInterestedOffice = () => {
  const userToken = userDetails.token;
  startLoading();

  // Get the interested offices
  fetchInterestedOffice(userToken, res => {
    // Check if the user has access to this page
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
          }

          cardDesign += `
        <div class="individual-person-container">
          <div>
              <img src="${fullData.logourl}" />
          </div>
          <div class="profile-description-text">
              <label><span class="profile-answers">${fullData.name.charAt(0).toUpperCase() +
                fullData.name.substr(1)}</span></label>
              <label>Candidates: <span class="profile-answers"><a href="office-candidates.html?officeId=${
                fullData.id
              }&officeName=${fullData.name}">${numberOfCandidates} Candidates</a></span></label>
              <label>Date: <span class="profile-answers">${electionDate}</span></label>
          </div>
        </div>`;

          // There can be only one interested office
          cardDesign += `<div class="individual-person-container hidden-div"></div>`;

          // Set the card in the provided slot
          document.getElementById('interestedOfficeSlot').innerHTML = cardDesign;
          stopLoading();
        });
        break;
      }
    }

    if (data.length === 0) {
      stopLoading();
    }
  });
};

const fetchPageVotes = () => {
  // Get votes that have been casted by this user
  const userToken = userDetails.token;
  startLoading();
  // Get the interested offices
  fetchVotesForUser(userDetails.user.id, userToken, res => {
    const { dataa } = res;
    let cardDesign = '';
    for (let ind = 0; ind < dataa.length; ind += 1) {
      // Get the candidate's name
      // eslint-disable-next-line no-loop-func
      fetchUserByID(dataa[ind].candidateid, userToken, userDets => {
        // Get name
        const name = `${userDets.data[0].firstname} ${userDets.data[0].lastname}`;
        const officeId = dataa[ind].officeid;
        const partyId = userDets.data[0].partyid;
        const myCandidateId = dataa[ind].candidateid;
        let officeName = '';
        let partyName = '';
        let partyLogo = '';
        let result = 0;
        let resultStyle = 'won';
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
              let winningCandidate;
              let winningCandidateVote = 0;
              for (let rInd = 0; rInd < resultRes.data.length; rInd += 1) {
                if (resultRes.data[rInd].candidateid === myCandidateId) {
                  result = resultRes.data[rInd].count;
                }

                if (resultRes.data[rInd].count > winningCandidateVote) {
                  winningCandidate = resultRes.data[rInd].candidateid;
                  winningCandidateVote = resultRes.data[rInd].count;
                }

                if (winningCandidate === myCandidateId) {
                  resultStyle = 'won';
                  resultString = 'won';
                } else {
                  resultStyle = 'lost';
                  resultString = 'lost';
                }

                // Check if the election is today
                const today = new Date().toDateString();
                const elecDate = new Date(dataa[ind].createdon).toDateString();
                // Check if the election date is today
                if (today === elecDate) {
                  if (resultString === 'won') {
                    resultString = 'wining';
                  } else if (resultString === 'lost') {
                    resultString = 'losing';
                  }
                }
              }
              // Display the details in the card for my candidate
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
                          <label><span class="${resultStyle}-election">${resultString}</span></label>
                      </div>
                  </div>`;

              // Check how many results there are
              if (ind + 1 === dataa.length && dataa.length % 2 !== 0) {
                cardDesign += `<div class="individual-person-container hidden-div"></div>`;
              }

              // Set the card in the provided slot
              document.getElementById('userVotesSlot').innerHTML = cardDesign;
              stopLoading();
            });
          });
        });
      });
    }

    if (dataa.length === 0) {
      stopLoading();
    }
    // Display number of votes this user has at the title
    document.getElementById('numberOfVotesLbl').innerHTML = dataa.length;
  });
};

const fetchPoliticalParties = () => {
  const userToken = userDetails.token;
  startLoading();

  fetchAllParties(userToken, res => {
    const { data } = res;
    let cardDesign = '';

    for (let ind = 0; ind < data.length; ind += 1) {
      let partyBtn = 'add-party-btn';
      let partyText = 'Join Party';
      // Check if this user is a member of this party
      if (userDetails.user.partyid === data[ind].id) {
        partyBtn = 'casted-vote';
        partyText = 'Member';
      }

      // Display the details in the card
      cardDesign += `
      <div class="individual-person-container">
        <div>
            <img src="${data[ind].logourl}" />
        </div>
        <div class="profile-description-text">
            <label><span class="profile-answers">${data[ind].name}</span></label>
            <label>HQ Address: <span class="profile-answers">${data[ind].hqaddress}</span></label>`;

      if (partyText === 'Member') {
        // The container should be a span not a button
        cardDesign += `<span class="${partyBtn}" name="${data[ind].id}">${partyText}</span>
                </div>
              </div>`;
      } else {
        cardDesign += `<input type="submit" class="${partyBtn}" value="${partyText}" name="${
          data[ind].id
        }" onclick="joinParty(this.name)" />
                </div>
              </div>`;
      }

      // Check how many results there are
      if (ind + 1 === data.length && data.length % 2 !== 0) {
        cardDesign += `<div class="individual-person-container hidden-div"></div>`;
      }

      // Set the card in the provided slot
      document.getElementById('politicalPartiesSlot').innerHTML = cardDesign;
    }
    stopLoading();
    document.getElementById('numberOfPartiesLbl').innerHTML = data.length;
  });
};

const joinParty = id => {
  const userToken = userDetails.token;
  startLoading();

  changeUserParty(userToken, id, res => {
    // Update the local storage with new information
    window.localStorage.setItem('userDetails', JSON.stringify(res.data[0]));
    // Refresh the political parties page
    window.location.reload();
  });
};

const extractCandidateInfoFromOffice = (candidates, officeId) => {
  let count = 0;
  let isCandidate = false;
  let electionDate = 'Not set';

  for (let ind = 0; ind < candidates.length; ind += 1) {
    // Check if this candidate is for the current office
    if (candidates[ind].officeid === officeId) {
      // Check if current user is candidate
      if (
        candidates[ind].candidateid === userDetails.user.id &&
        officeId === candidates[ind].officeid
      ) {
        isCandidate = true;
      }

      // Get the election date
      if (candidates[ind].date) {
        electionDate = candidates[ind].date;
      }
      count += 1;
    }
  }

  return { count, isCandidate, electionDate };
};

const checkIfUserExpressedInterest = (interests, officeId) => {
  let isInterested = false;
  for (let ind = 0; ind < interests.length; ind += 1) {
    // Check if current user has expressed interest
    if (
      interests[ind].candidateid === userDetails.user.id &&
      officeId === interests[ind].officeid
    ) {
      isInterested = true;
    }
  }
  return isInterested;
};

const fetchGovernmentOffices = () => {
  const userToken = userDetails.token;
  startLoading();
  fetchInterestedOffice(userToken, res => {
    const candidates = res.data;
    // Fetch all interests
    fetchAllInterests(userToken, interestsRes => {
      const interests = interestsRes.data;
      // Fetch the offices
      fetchAllOffices(userToken, officeRes => {
        const officeData = officeRes.data;
        let alreadyApplied = false;
        let cardDesign = '';

        // Check if user has sent request for any of the offices
        for (let ind = 0; ind < officeData.length; ind += 1) {
          const { isCandidate } = extractCandidateInfoFromOffice(candidates, officeData[ind].id);
          const isInterested = checkIfUserExpressedInterest(interests, officeData[ind].id);

          if (isCandidate || isInterested) {
            alreadyApplied = true;
            break;
          }
        }

        for (let ind = 0; ind < officeData.length; ind += 1) {
          let candidateStatus = '';
          let officeBtn = 'add-party-btn';
          // Extract the candidate information for this candidate
          const { count, isCandidate, electionDate } = extractCandidateInfoFromOffice(
            candidates,
            officeData[ind].id
          );

          const isInterested = checkIfUserExpressedInterest(interests, officeData[ind].id);

          if (isCandidate) {
            candidateStatus = 'Approved candidate';
            officeBtn = 'casted-vote';
          } else if (isInterested) {
            candidateStatus = 'Awaiting approval';
            officeBtn = 'pending-vote';
          } else {
            // Make sure that no to other office has claimed this candidate
            candidateStatus = 'Express Interest';
            officeBtn = 'add-party-btn';
          }
          let electionDateString = new Date(electionDate).toDateString();
          if (electionDate === 'Not set') {
            electionDateString = 'Not set';
          }

          // Display the details in the card
          cardDesign += `
        <div class="individual-person-container">
          <div>
              <img src="${officeData[ind].logourl}" />
          </div>
          <div class="profile-description-text">
              <label><span class="profile-answers">${officeData[ind].name}</span></label>
              <label>Type: <span class="profile-answers">${officeData[ind].type}</span></label>
              <label>Date: <span class="profile-answers">${electionDateString}</span></label>
              <label>Candidates: <span class="profile-answers"><a href="office-candidates.html?officeId=${
                officeData[ind].id
              }&officeName=${officeData[ind].name}">${count} Candidates</a></span></label>`;

          if (candidateStatus === 'Approved candidate' || candidateStatus === 'Awaiting approval') {
            // The container should be a span not a button
            cardDesign += `<span class="${officeBtn}" name="${
              officeData.id
            }">${candidateStatus}</span>
                  </div>
                </div>`;
          } else if (!alreadyApplied) {
            // Make sure that the user has not made a request already
            cardDesign += `<input type="submit" class="${officeBtn}" value="${candidateStatus}" name="${
              officeData[ind].id
            }" onclick="expressInterestBtnClicked(this.name)" />
                    </div>
                  </div>`;
          } else {
            cardDesign += `</div>
                  </div>`;
          }

          // Check how many results there are
          if (ind + 1 === officeData.length && officeData.length % 2 !== 0) {
            cardDesign += `<div class="individual-person-container hidden-div"></div>`;
          }

          // Set the card in the provided slot
          document.getElementById('governmentOfficeSlot').innerHTML = cardDesign;
        }
        stopLoading();
        document.getElementById('numberOfOfficessLbl').innerHTML = officeData.length;
      });
    });
  });
};

const expressInterestBtnClicked = id => {
  const userToken = userDetails.token;
  startLoading();
  expressInterest(userToken, id, userDetails.user.partyid, res => {
    if (res.status === 400) {
      // User is not a member of a party
      showAlert('You have to join a party before you can contest for any office');
    } else {
      // Refresh the government offices page
      window.location.reload();
    }
  });
};

const officesWithElectionToday = candidates => {
  const offices = [];
  for (let ind = 0; ind < candidates.length; ind += 1) {
    if (!offices.includes(candidates[ind].officeid)) {
      // Set minimum date as today
      const today = new Date().toDateString();
      const elecDate = new Date(candidates[ind].date).toDateString();
      // Check if the election date is today
      if (today === elecDate) {
        offices.push(candidates[ind].officeid);
      }
    }
  }

  return offices;
};

const extractElectionCandidatesFromOffice = (
  candidates,
  officeId,
  resultRes,
  completionHandler
) => {
  const userToken = userDetails.token;
  const officeCand = [];

  let max = 0;
  // Check how many candidates this office has
  for (let ind = 0; ind < candidates.length; ind += 1) {
    if (candidates[ind].officeid === officeId) {
      max += 1;
    }
  }

  for (let ind = 0; ind < candidates.length; ind += 1) {
    // Check if this candidate is for the current office
    if (candidates[ind].officeid === officeId) {
      // Get the user profile info
      // eslint-disable-next-line no-loop-func
      fetchUserByID(candidates[ind].candidateid, userToken, userDets => {
        // Get name
        const name = `${userDets.data[0].firstname} ${userDets.data[0].lastname}`;
        const partyId = candidates[ind].partyid;
        const myCandidateId = candidates[ind].candidateid;
        let partyName = '';
        let partyLogo = '';
        let result = 0;

        // Get the profile image and name of party using partyID
        fetchPartyDetailsByID(partyId, userToken, partyRes => {
          partyName = partyRes.data[0].name;
          partyLogo = partyRes.data[0].logourl;

          // Calculate the result for this candidate
          for (let rInd = 0; rInd < resultRes.data.length; rInd += 1) {
            if (resultRes.data[rInd].candidateid === myCandidateId) {
              result = resultRes.data[rInd].count;
            }
          }

          // Add this user details
          const cand = {
            id: myCandidateId,
            name,
            partyName,
            partyLogo,
            result
          };
          // Append user to the array of candidates
          officeCand.push(cand);

          // Check if this is the last candidate
          if (officeCand.length === max) {
            completionHandler(officeCand);
          }
        });
      });
    }
  }
};

const getOfficesNamesFromID = (officesIDs, userToken, completionHandler) => {
  const officesNames = [];
  let count = 0;
  for (let ind = 0; ind < officesIDs.length; ind += 1) {
    // eslint-disable-next-line no-loop-func
    fetchOfficeDetailsByID(officesIDs[ind], userToken, res => {
      officesNames.push(res.data[0].name);
      if (count === officesIDs.length - 1) {
        completionHandler(officesNames);
      }
      count += 1;
    });
  }
  if (officesIDs.length === 0) {
    completionHandler(officesNames);
  }
};

const castVote = dets => {
  const userToken = userDetails.token;
  const values = dets.split(' ');
  startLoading();

  registerVote(userToken, values[0], values[1], res => {
    if (res.status === 201) {
      window.location.reload();
    } else {
      showAlert(res.error);
    }
  });
};

const checkIfVoteCasted = (officeId, myVotes) => {
  const result = {
    voteCasted: false,
    choice: null
  };
  for (let ind = 0; ind < myVotes.length; ind += 1) {
    if (myVotes[ind].createdby === userDetails.user.id && myVotes[ind].officeid === officeId) {
      // I have casted vote for this office
      result.voteCasted = true;
      result.choice = myVotes[ind].candidateid;
    }
  }
  return result;
};

const fetchTodaysVotes = () => {
  const userToken = userDetails.token;
  startLoading();

  // Get all the votes casted by this user
  fetchVotesForUser(userDetails.user.id, userToken, votesRess => {
    const myVotes = votesRess.dataa;

    // Fetch all candidates
    fetchInterestedOffice(userToken, res => {
      const candidates = res.data;

      // Get the offices that have election today
      const electionOffices = officesWithElectionToday(candidates);
      document.getElementById('numberOfElectionsLbll').innerHTML = electionOffices.length;
      let cardDesign = '';
      getOfficesNamesFromID(electionOffices, userToken, officesNames => {
        // Get the results for each office
        for (let ind = 0; ind < electionOffices.length; ind += 1) {
          // Call the collate result and get the number of votes this candidate got
          // eslint-disable-next-line no-loop-func
          collateResult(electionOffices[ind], userToken, votesRes => {
            // Get the candidates for this office
            extractElectionCandidatesFromOffice(
              candidates,
              electionOffices[ind],
              votesRes,
              fullDetails => {
                for (let ind2 = 0; ind2 < fullDetails.length; ind2 += 1) {
                  cardDesign += `<div class="individual-person-container">
                <div>
                    <img src="${fullDetails[ind2].partyLogo}" />
                </div>
                <div class="profile-description-text">
                    <label><span class="profile-answers">${fullDetails[ind2].name}</span></label>
                    <label>Party: <span class="profile-answers">${
                      fullDetails[ind2].partyName
                    }</span></label>
                    <label>Office: <span class="profile-answers">${officesNames[ind]}</span></label>
                    <label>Current votes: <span class="ongoing-election">${
                      fullDetails[ind2].result
                    }</span></label>`;

                  // Check if the user has voted before and if this is the person
                  const { voteCasted, choice } = checkIfVoteCasted(electionOffices[ind], myVotes);

                  if (voteCasted) {
                    // Check if this candidate is the one i voted for
                    if (choice === fullDetails[ind2].id) {
                      // I voted this guy
                      cardDesign += `<label><span class="casted-vote">Vote Casted</span></label>`;
                    }
                  } else {
                    cardDesign += `<input type="button" name="${electionOffices[ind]} ${
                      fullDetails[ind2].id
                    }" class="add-party-btn" value="Cast Vote" onclick="castVote(this.name)" />`;
                  }

                  // Close div tags
                  cardDesign += `</div>
            </div>`;

                  // Check if number of candidates is an even number
                  if (ind2 + 1 === fullDetails.length && fullDetails.length % 2 !== 0) {
                    cardDesign += `<div class="individual-person-container hidden-div"></div>`;
                  }

                  if (ind2 + 1 === fullDetails.length) {
                    // Another Office Election
                    cardDesign += `<div class="individual-person-container hidden-div"></div><div class="individual-person-container hidden-div"></div><div class="individual-person-container hidden-div"></div><div class="individual-person-container hidden-div"></div>`;
                    document.getElementById('electionCandidatesSlot').innerHTML = cardDesign;
                  }
                  document.getElementById('electionCandidatesSlot').innerHTML = cardDesign;
                  stopLoading();
                }
              }
            );
          });
        }
        if (electionOffices.length === 0) {
          stopLoading();
        }
      });
    });
  });
};

const candidatePageFetchOffice = (officeId, officeName) => {
  const userToken = userDetails.token;

  startLoading();

  document.getElementById('officeNameLbl').innerHTML = officeName;

  // Get the candidates for this office
  fetchInterestedOffice(userToken, res => {
    const candidates = res.data;
    const officeCands = [];
    for (let ind = 0; ind < candidates.length; ind += 1) {
      if (candidates[ind].officeid === parseInt(officeId, 10)) {
        officeCands.push(candidates[ind]);
      }
    }

    let cardDesign = '';
    let count = 0;
    for (let ind = 0; ind < officeCands.length; ind += 1) {
      // Get the candidates information
      // eslint-disable-next-line no-loop-func
      fetchUserByID(officeCands[ind].candidateid, userToken, userRes => {
        const candidateFullDetails = userRes.data[0];

        // Fetch the party name
        fetchPartyDetailsByID(officeCands[ind].partyid, userToken, partyRes => {
          const partyDetails = partyRes.data[0];
          // Display the information on the page
          cardDesign += `<div class="individual-person-container">
          <div>
              <img src="${partyDetails.logourl}" />
          </div>
          <div class="profile-description-text">
              <label><span class="profile-answers">${candidateFullDetails.firstname} ${
            candidateFullDetails.lastname
          }</span></label>
              <label>Email: <span class="profile-answers">${
                candidateFullDetails.email
              }</span></label>
              <label>Phone: <span class="profile-answers">${
                candidateFullDetails.phonenumber
              }</span></label>
              <label>Party: <span class="profile-answers">${partyDetails.name}</span></label>
          </div>
      </div>`;

          // Check if number of candidates is an even number
          if (count + 1 === officeCands.length && officeCands.length % 2 !== 0) {
            cardDesign += `<div class="individual-person-container hidden-div"></div>`;
          }

          // Check if t is the last item
          document.getElementById('officeCandidatesSlot').innerHTML = cardDesign;
          stopLoading();
          count += 1;
        });
      });
    }

    if (officeCands.length === 0) {
      stopLoading();
    }
    document.getElementById('numberOfCandidateLbl').innerHTML = officeCands.length;
  });
};

signoutBtnClicked = () => {
  window.localStorage.removeItem('userDetails');
  window.location.href = './signin.html';
};
