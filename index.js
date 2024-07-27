window.onload = async function () {
  /**
   * Fetching countries from API and autocomplete.
   */
  const countries = await fetchData();

  const destinationFrom = document.getElementById("from-destination");
  const destinationTo = document.getElementById("to-destination");
  const result = document.getElementById("showResultsFrom");
  const resultTo = document.getElementById("showResultsTo");

  destinationFrom.addEventListener("input", (change) => {
    let input = destinationFrom.value.toLowerCase();
    cleanAutoComplite(result);
    showAutoComplite(countries, input, result, destinationFrom);
  });

  destinationTo.addEventListener("input", (change) => {
    let input = destinationTo.value.toLowerCase();
    cleanAutoComplite(resultTo);
    showAutoComplite(countries, input, resultTo, destinationTo);
  });

  destinationTo.addEventListener("focus", () => {
    result.style.display = "none";
  });

  destinationTo.addEventListener("blur", () => {
    let input = destinationTo.value.toLowerCase();
    countries.forEach((element) => {
      if (element == input) {
        resultTo.style.display = "none";
      }
    });
  });

  /**
   * When return trip is clicked, return options are disabled.
   */

  const returnTrip = document.getElementById("return-trip");
  const oneWayTrip = document.getElementById("one-way");

  returnTrip.addEventListener("click", () => {
    let returnDate = document.getElementById("return");
    returnTrip.value = "checked";
    oneWayTrip.value = "unchecked";
    returnDate.disabled = false;
  });

  oneWayTrip.addEventListener("click", () => {
    let returnDate = document.getElementById("return");
    oneWayTrip.value = "checked";
    returnTrip.value = "unchecked";
    returnDate.disabled = true;
    returnDate.value = 0;
  });

  /**
   * Increasing/ decreasing number of passangers
   */

  const decreasePassanger = document.getElementsByClassName("decreaseBtn");
  const increasePassenger = document.getElementsByClassName("increaseBtn");

  for (let i = 0; i < decreasePassanger.length; i++) {
    decreasePassanger[i].addEventListener("click", () => {
      decreasePassangersNumber(i);
    });
  }

  for (let i = 0; i < increasePassenger.length; i++) {
    increasePassenger[i].addEventListener("click", () => {
      increasePassengersNumber(i);
    });
  }

  /**
   * Presentation of the ticket.
   */
  const searchBtn = document.getElementById("searchBtn");
  searchBtn.addEventListener("click", () => {
    let oneWayTrip = document.getElementById("one-way").value;
    let returnTrip = document.getElementById("return-trip").value;
    let departureDate = document.getElementById("depart").value;
    let returnDate = document.getElementById("return").value;
    let fromDest = document.getElementById("from-destination").value;
    let toDest = document.getElementById("to-destination").value;
    let adultsInput = document.getElementById("adults").value;
    let childrenInput = document.getElementById("children").value;
    let infantsInput = document.getElementById("infants").value;
    let ticket = document.getElementById("ticket");
    let text = "";

    try {
      //One way/Return
      if (oneWayTrip == "checked") {
        text = "Booking for one way ticket ";
      } else if (returnTrip == "checked") {
        text = "Booking for return trip ticket ";
      } else {
        throw new Error("One way/Return trip infromation missing.");
      }

      //Departure/Arrival

      if (oneWayTrip !== "checked") {
        if (departureDate !== undefined && returnDate !== undefined) {
          text += `departing on: ${departureDate} and returning on: ${returnDate}. `;
        } else {
          throw new Error("Missing dates value.");
        }
      } else {
        if (departureDate !== undefined) {
          text += `departing on: ${departureDate}. `;
        } else {
          throw new Error("Missing dates value.");
        }
      }

      // From/To
      if (fromDest !== "" && toDest !== "") {
        text += `Departing from: ${fromDest} travelling to: ${toDest}. `;
      } else {
        throw new Error("Missing destination.");
      }

      //Passengers
      if (adultsInput > 0) {
        text += `Passengers: ${adultsInput} x adults`;
        if (childrenInput > 0) {
          text += `, ${childrenInput} x children `;
        }
        if (infantsInput > 0) {
          text += `and ${infantsInput} x infants.`;
        }
      } else {
        throw new Error("Missing passengers.");
      }

      ticket.style.display = "block";
      let textArea = document.createElement("p");
      textArea.textContent = text;
      ticket.appendChild(textArea);
    } catch (error) {
      console.log(error);
      alert("You have not filled all the requested fileds. PLease try again.");
    }
  });

  /**
   * Hide ticket
   */
  const ticketBtn = document.getElementById("exitTicket");
  ticketBtn.addEventListener("click", () => {
    ticket.style.display = "none";
  });
};

// Functions
async function fetchData() {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    if (!response.ok) {
      throw new Error("Could not fetch resource");
    }
    const data = await response.json();
    let countries = await data.map((country) =>
      country.name.common.toLowerCase()
    );
    return countries;
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

function cleanAutoComplite(result) {
  result.innerHTML = "";
}

function showAutoComplite(countries, input, result, destinationFrom) {
  if (countries == undefined && input == "") {
    return;
  }

  result.style.display = "block";
  let count = 0;

  countries.forEach((element) => {
    let lengthToCheck = element.slice(0, input.length);
    if (lengthToCheck == input) {
      let options = document.createElement("li");
      options.id = `li${count}`;
      count++;
      options.textContent = element;
      result.appendChild(options);

      options.addEventListener("click", function () {
        destinationFrom.value = options.textContent;
        result.style.display = "none";
      });
    }
  });
}

function decreasePassangersNumber(position) {
  let adultsInput = document.getElementById("adults");
  let childrenInput = document.getElementById("children");
  let infantsInput = document.getElementById("infants");

  if (position == 0 && adultsInput.value > 0) {
    adultsInput.value -= 1;
  } else if (position == 1 && childrenInput.value > 0) {
    childrenInput.value -= 1;
  } else if (position == 2 && infantsInput.value > 0) {
    infantsInput.value -= 1;
  }
}

function increasePassengersNumber(position) {
  let adultsInput = document.getElementById("adults");
  let childrenInput = document.getElementById("children");
  let infantsInput = document.getElementById("infants");

  if (position == 0 && adultsInput.value < 10) {
    ++adultsInput.value;
  } else if (position == 1 && childrenInput.value < 10) {
    ++childrenInput.value;
  } else if (position == 2 && infantsInput.value < 10) {
    ++infantsInput.value;
  }
}
