const dropDownBtn = document.querySelector(".fa-chevron-down");
const continentList = document.querySelector(".dropdown-list");
const countrySearch = document.querySelector(".search-bar input");
const flagCountainer = document.querySelector(".flag-container");
const body = document.querySelector("body");
const themeChange = document.querySelector(".theme");
const mode = document.querySelector(".mode");
const filterContinent = document.querySelectorAll(".region");
const detailsPage = document.getElementById("details_page");
const loader = document.querySelector(".loader");

//------event listeners--------------------

window.location.hash = "#home_page";
window.addEventListener("hashchange", function () {
  if (window.location.hash == "#details_page") {
    document.getElementById("home_page").style.display = "none";
  } else {
    document.getElementById("home_page").style.display = "block";
    detailsPage.innerHTML = "";
  }
});

window.addEventListener("load", function () {
  loadCountries(`https://restcountries.com/v3.1/all`);
});

dropDownBtn.addEventListener("click", function () {
  if (continentList.style.opacity == "0") {
    continentList.style.transform = "scale(1)";
    continentList.style.opacity = "1";
  } else {
    continentList.style.transform = "scale(0)";
    continentList.style.opacity = "0";
  }
});

countrySearch.addEventListener("keyup", function (e) {
  if (countrySearch.value.length > 0) {
    loadCountries(`https://restcountries.com/v3.1/name/${countrySearch.value}`);
  } else loadCountries(`https://restcountries.com/v3.1/all`);
});

filterContinent.forEach((i) =>
  i.addEventListener("click", function (e) {
    continentList.style.transform = "scale(0)";
    continentList.style.opacity = "0";
    document.querySelector(
      ".dropdown-text"
    ).textContent = `${e.target.textContent}`;
    loadCountries(
      `https://restcountries.com/v3.1/region/${e.target.textContent}`
    );
  })
);

themeChange.addEventListener("click", function () {
  if (body.classList.contains("light-theme")) {
    body.classList.remove("light-theme");
    body.classList.add("dark-theme");
    mode.innerHTML = "Light Mode";
    themeChange.children[0].innerHTML = `<img src="./icon-sun.svg" alt="">`;
  } else {
    body.classList.remove("dark-theme");
    body.classList.add("light-theme");
    mode.innerHTML = "Dark Mode";
    themeChange.children[0].innerHTML = `<i class="far fa-moon"></i>`;
  }
});

//----------Asynchronous function and Apis fetchind------------------

async function loadCountries(url) {
  try {
    displayLoader();
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok) {
      flagCountainer.innerHTML = `<div style="color: var(--text-color);
    font-weight: 600;
    padding-left: 10px;
    font-size: 18px;">No such country found in our database.Please check the spelling or try searching for another country.</div>`;
      throw new Error(`${data.message} (${res.status})`);
    }
    hideLoader();
    flagCountainer.innerHTML = "";
    for (let i = 0; i < data.length; i++) displayCountryCard(data[i]);
  } catch (err) {
    hideLoader();
    throw err;
  }
}

async function loadCountryDetails(url) {
  try {
    displayLoader();
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(`${data.message} (${res.status})`);
    }
    hideLoader();
    displayCountryDetails(data[0]);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function loadBorderCountries(border) {
  try {
    displayLoader();
    const res = await fetch(`https://restcountries.com/v3.1/alpha/${border}`);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(`${data.message} (${res.status})`);
    }
    hideLoader();
    return data[0];
  } catch (err) {
    console.log(err);
    throw err;
  }
}

//-------------Functions-----------------
function displayCountryDetails(countryObj) {
  detailsPage.innerHTML = ``;
  detailsPage.innerHTML += ` <div class="back_btn">
  <i class="fas fa-arrow-left"></i>
  Back
</div>
<div class="info_container">
  <img src="${countryObj.flags.svg}" alt="" />
  <div class="country_info">
    <h3>${countryObj.name.official}</h3>
    <div class="country_info_flex">
      <div class="country_info_left">
        <p>Native Name:<span>${
          Object.values(countryObj.name.nativeName)[0].common
        }</span></p>
        <p>Population:<span>${countryObj.population}</span></p>
        <p>Region:<span>${countryObj.region}</span></p>
        <p>Sub-region:<span>${countryObj.subregion}</span></p>
        <p>Capital:<span>${countryObj.capital}</span></p>
      </div>
      <div class="country_info_right">
        <p>Top Level Domian:<span>${countryObj.tld}</span></p>
        <p>Currencies:<span>${
          Object.values(countryObj.currencies)[0].name
        }</span></p>
        <p>Languages:<span>${Object.values(countryObj.languages).join(
          ", "
        )}</span></p>
      </div>
    </div>
    <div class="border-countries">
      <p style="margin-bottom: 0">Border Countries:</p>
    </div>
  </div>
</div>`;
  document.querySelector(".back_btn").addEventListener("click", function () {
    window.location.hash = "#home_page";
  });
  countryObj.borders &&
    countryObj.borders.forEach((border, index) => {
      displayBorderCountries(border, index);
    });
}

function displayCountryCard(obj) {
  flagCountainer.innerHTML += ` <div class="card" id="${obj.name.official}">
  <div class="card-img">
    <img src="${obj.flags.svg}" alt="" />
  </div>
  <div class="card-text">
    <h3>${obj.name.official}</h3>
    <p>Population:<span>${obj.population}</span></p>
    <p>Region:<span>${obj.region}</span></p>
    <p>Capital:<span>${obj.capital}</span></p>
  </div>
</div>`;
  document.querySelectorAll(".card").forEach((i) =>
    i.addEventListener("click", function () {
      window.location.hash = "#details_page";
      loadCountryDetails(`https://restcountries.com/v3.1/name/${i.id}`);
    })
  );
}

async function displayBorderCountries(border, index) {
  let borderCountry = await loadBorderCountries(border);
  let borderDiv = document.createElement("div");
  borderDiv.classList.add("border_btn");
  borderDiv.textContent = borderCountry.name.common;
  document.querySelector(".border-countries").append(borderDiv);
  document
    .querySelectorAll(".border_btn")
    [index].addEventListener("click", function (e) {
      loadCountryDetails(
        `https://restcountries.com/v3.1/name/${e.target.innerHTML}`
      );
    });
}
function displayLoader() {
  loader.style.display = "block";
}
function hideLoader() {
  loader.style.display = "none";
}
