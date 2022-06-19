const baseURL = "https://api.nationalize.io/";
const baseRestCountryiesURL = "https://restcountries.com/v3.1/alpha";

const nameInput = document.getElementById("nameInput");
const dataTable = document.getElementById("data-table");
const enteredName = document.getElementById("enteredName");
const noOfCtrys = document.getElementById("noOfCtrys");
const predictBtn = document.getElementById("predictBtn");

const error = document.querySelector(".error-output");
const tableDiv = document.querySelector(".table-container");

//Creating thead and tbody elements
const thead = document.createElement("thead");
const tbody = document.createElement("tbody");

//Function to reset elements for every search
const resetElements = () => {
  enteredName.innerHTML = "";
  noOfCtrys.innerHTML = "";
  dataTable.innerHTML = "";
};

//main function to fetch nationality prediction data
const predictNationality = async (nameInput) => {
  resetElements();
  let tableRows = "";
  try {
    //Get nationality predictions data using nationalie.io api
    const data1 = await fetch(`${baseURL}?name=${nameInput}`);
    const nationalityData = await data1.json();

    //descending sort countries based on probability
    const countriesList = nationalityData.country.sort((ctry1, ctry2) => {
      if (ctry1.probability > ctry2.probability) {
        return -1;
      }
      if (ctry1.probability < ctry2.probability) {
        return 1;
      }
      return 0;
    });

    if (countriesList.length !== 0) {
      nations = countriesList.map((cty) => cty.country_id).join();

      // Get country details from rest countries api (this is to get flag data and country name which is not availbale from nationalize.io api)
      const data2 = await fetch(`${baseRestCountryiesURL}?codes=${nations}`);
      const countryData = await data2.json();

      //set html elements with retreived data
      enteredName.innerText = `Entered Name: ${nameInput[0].toUpperCase()}${nameInput.slice(
        1,
        nameInput.length
      )}`;
      noOfCtrys.innerText = `Total countries predicted: ${countriesList.length}`;
      error.style.display = "none";

      for (let i = 0; i < countriesList.length; i++) {
        for (let j = 0; j < countryData.length; j++) {
          if (countriesList[i].country_id === countryData[j].cca2) {
            let row = `<tr>
          <td>${i + 1}</td>
          <td>
             <div class="country-data">
                  <img src=${countryData[j].flags.svg} alt=${
              countryData[j].cca2
            }>
                  <p>${countryData[j].demonyms.eng.m}</p>
            </div>
                  </td>
            <td>${countriesList[i].probability.toFixed(2)}</td>
        </tr>`;
            tableRows += row;
          }
        }
      }
      //adding column headings into thead
      thead.innerHTML = `<tr>
                        <th>SNo.</th>
                        <th>Nationality</th>
                        <th>Probability</th>
                        </tr>`;
      tbody.innerHTML = tableRows;
      dataTable.appendChild(thead);
      dataTable.appendChild(tbody);
    } else {
      error.style.display = "block";
      error.innerHTML = `<p>No Nationality predicitons found, please try another name</p>`;
    }
  } catch (error) {
    error.style.display = "block";
    error.innerHTML = `<p>${error.message}</p>`;
    // console.log(error.message);
  }
};
predictBtn.addEventListener("click", () => {
  if (nameInput.value.length > 0) {
    error.style.display = "none";
    predictNationality(nameInput.value.toLowerCase());
  } else {
    error.style.display = "block";
    error.innerHTML =
      "<p>Please enter any name to predict, input cannot be blank</p>";
    resetElements();
  }
  nameInput.value = "";
});

// name-nationality-prediction.netlify.app
// https://github.com/neerajgudi95/guvi-hackathon-1
