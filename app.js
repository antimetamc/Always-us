const DEFAULT_DATA = {

  yourName: "Nico",

  herName: "Gio",

  relationshipDate: "2026-02-08",

  homeMessage:
    "Ovunque saremo, saremo sempre noi.",

  meetingDate: "",


  memories: [

    {

      title:
        "L'inizio della nostra storia ❤️",

      date:
        "2026-02-08",

      description:
        "Il giorno da cui è iniziato il nostro contatore.",

      photo: ""

    }

  ],


  missingMessages: [

    "Se ti manco, ricordati che anche a distanza c'è qualcuno che pensa a te. ❤️",

    "Chiudi gli occhi per un secondo: immagina che ti stia sorridendo. Ti voglio bene. 💕",

    "La distanza è solo una parte della nostra storia, non la fine della storia. 🌙",

    "Quando mi manchi, apri questo messaggio e ricordati di noi. ❤️"

  ],


  specialMessages: [

    {

      title:
        "Aprimi quando mi manchi 💌",

      text:
        "Anche se sono lontano, non significa che tu sia sola. Conserva questo piccolo messaggio per quei momenti in cui vorresti avermi accanto."

    },

    {

      title:
        "Aprimi quando vuoi sorridere ✨",

      text:
        "Ricordati di quel sorriso che amo vedere. Questa è una piccola parte di me che ti raggiunge anche da lontano."

    },

    {

      title:
        "Aprimi in un giorno difficile 🫂",

      text:
        "Non devi affrontare tutto da sola. Se stai davvero male, parla con una persona di fiducia che possa stare con te."

    }

  ]

};


let data = loadData();

let currentMissingMessage = -1;


/* STORAGE */

function loadData() {

  const saved =
    localStorage.getItem("alwaysUsData");

  if (!saved) {

    return structuredClone(
      DEFAULT_DATA
    );

  }

  try {

    return {

      ...structuredClone(
        DEFAULT_DATA
      ),

      ...JSON.parse(saved)

    };

  } catch {

    return structuredClone(
      DEFAULT_DATA
    );

  }

}


function saveData() {

  localStorage.setItem(
    "alwaysUsData",
    JSON.stringify(data)
  );

}


/* NAVIGATION */

function showPage(pageId) {

  document
    .querySelectorAll(".page")
    .forEach(page => {

      page.classList.remove(
        "active"
      );

    });


  const page =
    document.getElementById(pageId);


  if (page) {

    page.classList.add(
      "active"
    );

  }


  document
    .querySelectorAll(
      ".bottom-nav button"
    )
    .forEach(button => {

      button.classList.toggle(

        "active",

        button.dataset.page ===
        pageId

      );

    });


  if (pageId === "memories") {

    renderMemories();

  }


  if (pageId === "for-you") {

    renderSpecialMessages();

  }


  window.scrollTo({

    top: 0,

    behavior: "smooth"

  });

}


/* HOME */

function updateHome() {

  const names =
    `${data.yourName} ❤️ ${data.herName}`;


  document.getElementById(
    "coupleNames"
  ).textContent = names;


  document.getElementById(
    "headerSubtitle"
  ).textContent = names;


  const date =
    new Date(
      `${data.relationshipDate}T00:00:00`
    );


  document.getElementById(
    "relationshipDate"
  ).textContent =

    date.toLocaleDateString(
      "it-IT",
      {
        day: "numeric",
        month: "long",
        year: "numeric"
      }
    );


  document.getElementById(
    "homeMessage"
  ).textContent =
    data.homeMessage;


  updateRelationshipTimer();

}


/* RELATIONSHIP TIMER */

function calculateRelationship(
  start,
  now
) {

  if (now < start) {

    return {

      years: 0,
      months: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0

    };

  }


  let years =
    now.getFullYear() -
    start.getFullYear();


  let anniversary =
    new Date(start);


  anniversary.setFullYear(
    start.getFullYear() +
    years
  );


  if (anniversary > now) {

    years--;

    anniversary.setFullYear(
      start.getFullYear() +
      years
    );

  }


  let months =
    now.getMonth() -
    anniversary.getMonth();


  if (months < 0) {

    months += 12;

  }


  let monthStart =
    new Date(anniversary);


  monthStart.setMonth(
    monthStart.getMonth() +
    months
  );


  if (monthStart > now) {

    months--;

    monthStart =
      new Date(anniversary);

    monthStart.setMonth(
      monthStart.getMonth() +
      months
    );

  }


  let remaining =
    now.getTime() -
    monthStart.getTime();


  const days =
    Math.floor(
      remaining / 86400000
    );


  remaining %= 86400000;


  const hours =
    Math.floor(
      remaining / 3600000
    );


  remaining %= 3600000;


  const minutes =
    Math.floor(
      remaining / 60000
    );


  remaining %= 60000;


  const seconds =
    Math.floor(
      remaining / 1000
    );


  return {

    years,
    months,
    days,
    hours,
    minutes,
    seconds

  };

}


function updateRelationshipTimer() {

  const start =
    new Date(
      `${data.relationshipDate}T00:00:00`
    );


  const now =
    new Date();


  const result =
    calculateRelationship(
      start,
      now
    );


  document.getElementById(
    "years"
  ).textContent =
    result.years;


  document.getElementById(
    "months"
  ).textContent =
    result.months;


  document.getElementById(
    "days"
  ).textContent =
    result.days;


  document.getElementById(
    "hours"
  ).textContent =
    result.hours;


  document.getElementById(
    "minutes"
  ).textContent =
    result.minutes;


  document.getElementById(
    "seconds"
  ).textContent =
    result.seconds;

}


/* MI MANCHI */

function randomMissingMessage() {

  const messages =
    data.missingMessages;


  if (!messages.length) {
    return;
  }


  let index;


  do {

    index =
      Math.floor(
        Math.random() *
        messages.length
      );

  } while (

    messages.length > 1 &&
    index === currentMissingMessage

  );


  currentMissingMessage =
    index;


  const element =
    document.getElementById(
      "missingMessage"
    );


  element.classList.remove(
    "fade"
  );


  void element.offsetWidth;


  element.textContent =
    messages[index];


  element.classList.add(
    "fade"
  );

}


/* MEMORIES */

function renderMemories() {

  const container =
    document.getElementById(
      "memoryList"
    );


  container.innerHTML = "";


  const sorted =
    [...data.memories].sort(

      (a, b) =>
        new Date(b.date) -
        new Date(a.date)

    );


  sorted.forEach(
    (memory, index) => {

      const card =
        document.createElement(
          "article"
        );


      card.className =
        "memory-card";


      const date =
        new Date(
          `${memory.date}T00:00:00`
        ).toLocaleDateString(

          "it-IT",

          {

            day: "numeric",
            month: "long",
            year: "numeric"

          }

        );


      card.innerHTML = `

        ${
          memory.photo

            ? `

              <img
                src="${escapeAttribute(
                  memory.photo
                )}"
                alt="Foto del ricordo"
              >

            `

            : ""

        }


        <div class="memory-content">

          <span class="memory-date">
            ${date}
          </span>

          <h3>
            ${escapeHTML(
              memory.title
            )}
          </h3>

          <p>
            ${escapeHTML(
              memory.description
            )}
          </p>

          <button
            class="small-btn"
            onclick="deleteMemory(${index})"
          >
            Elimina
          </button>

        </div>

      `;


      container.appendChild(
        card
      );

    }

  );

}


function openMemoryForm() {

  const title =
    prompt(
      "Titolo del ricordo:"
    );


  if (!title) {
    return;
  }


  const date =
    prompt(
      "Data (AAAA-MM-GG):",
      new Date()
        .toISOString()
        .slice(0, 10)
    );


  if (!date) {
    return;
  }


  const description =
    prompt(
      "Descrizione:"
    );


  if (!description) {
    return;
  }


  const photo =
    prompt(
      "URL della foto (opzionale):",
      ""
    );


  data.memories.push({

    title,

    date,

    description,

    photo

  });


  saveData();

  renderMemories();

}


function deleteMemory(index) {

  if (
    !confirm(
      "Vuoi eliminare questo ricordo?"
    )
  ) {

    return;

  }


  data.memories.splice(
    index,
    1
  );


  saveData();

  renderMemories();

}


/* PER TE */

function renderSpecialMessages() {

  const container =
    document.getElementById(
      "specialMessages"
    );


  container.innerHTML = "";


  data.specialMessages
    .forEach(
      (message, index) => {

        const card =
          document.createElement(
            "article"
          );


        card.className =
          "message-card";


        card.innerHTML = `

          <h3>
            ${escapeHTML(
              message.title
            )}
          </h3>

          <p>
            ${escapeHTML(
              message.text
            )}
          </p>

          <button
            class="small-btn"
            onclick="deleteSpecialMessage(
              ${index}
            )"
          >
            Elimina
          </button>

        `;


        container.appendChild(
          card
        );

      }
    );

}


function addSpecialMessage() {

  const title =
    prompt("Titolo:");


  if (!title) {
    return;
  }


  const text =
    prompt("Messaggio:");


  if (!text) {
    return;
  }


  data.specialMessages.push({

    title,

    text

  });


  saveData();

  renderSpecialMessages();

}


function deleteSpecialMessage(
  index
) {

  if (
    !confirm(
      "Vuoi eliminare questo messaggio?"
    )
  ) {

    return;

  }


  data.specialMessages.splice(
    index,
    1
  );


  saveData();

  renderSpecialMessages();

}


/* MEETING */

function updateMeeting() {

  const empty =
    document.getElementById(
      "meetingEmpty"
    );


  const countdown =
    document.getElementById(
      "meetingCountdown"
    );


  const arrived =
    document.getElementById(
      "meetingArrived"
    );


  if (!data.meetingDate) {

    empty.classList.remove(
      "hidden"
    );

    countdown.classList.add(
      "hidden"
    );

    return;

  }


  const target =
    new Date(
      data.meetingDate
    );


  const now =
    new Date();


  const difference =
    target.getTime() -
    now.getTime();


  empty.classList.add(
    "hidden"
  );


  countdown.classList.remove(
    "hidden"
  );


  if (difference <= 0) {

    document.getElementById(
      "meetDays"
    ).textContent = 0;


    document.getElementById(
      "meetHours"
    ).textContent = 0;


    document.getElementById(
      "meetMinutes"
    ).textContent = 0;


    document.getElementById(
      "meetSeconds"
    ).textContent = 0;


    arrived.classList.remove(
      "hidden"
    );


    return;

  }


  arrived.classList.add(
    "hidden"
  );


  let remaining =
    difference;


  const days =
    Math.floor(
      remaining / 86400000
    );


  remaining %= 86400000;


  const hours =
    Math.floor(
      remaining / 3600000
    );


  remaining %= 3600000;


  const minutes =
    Math.floor(
      remaining / 60000
    );


  remaining %= 60000;


  const seconds =
    Math.floor(
      remaining / 1000
    );


  document.getElementById(
    "meetDays"
  ).textContent = days;


  document.getElementById(
    "meetHours"
  ).textContent = hours;


  document.getElementById(
    "meetMinutes"
  ).textContent = minutes;


  document.getElementById(
    "meetSeconds"
  ).textContent = seconds;

}


/* SETTINGS */

function loadSettings() {

  document.getElementById(
    "yourName"
  ).value =
    data.yourName;


  document.getElementById(
    "herName"
  ).value =
    data.herName;


  document.getElementById(
    "relationshipInput"
  ).value =
    data.relationshipDate;


  document.getElementById(
    "homeMessageInput"
  ).value =
    data.homeMessage;


  document.getElementById(
    "meetingInput"
  ).value =
    data.meetingDate;

}


function saveSettings() {

  data.yourName =
    document
      .getElementById(
        "yourName"
      )
      .value
      .trim() ||
    "Nico";


  data.herName =
    document
      .getElementById(
        "herName"
      )
      .value
      .trim() ||
    "Gio";


  data.relationshipDate =
    document
      .getElementById(
        "relationshipInput"
      )
      .value ||
    "2026-02-08";


  data.homeMessage =
    document
      .getElementById(
        "homeMessageInput"
      )
      .value
      .trim() ||
    "Ovunque saremo, saremo sempre noi.";


  data.meetingDate =
    document.getElementById(
      "meetingInput"
    ).value;


  saveData();

  updateHome();

  updateMeeting();


  alert(
    "Modifiche salvate ❤️"
  );


  showPage("home");

}


/* SECURITY */

function escapeHTML(value) {

  return String(value)

    .replaceAll(
      "&",
      "&amp;"
    )

    .replaceAll(
      "<",
      "&lt;"
    )

    .replaceAll(
      ">",
      "&gt;"
    )

    .replaceAll(
      '"',
      "&quot;"
    )

    .replaceAll(
      "'",
      "&#039;"
    );

}


function escapeAttribute(value) {

  return escapeHTML(value);

}


/* SERVICE WORKER */

function registerServiceWorker() {

  if (
    "serviceWorker"
    in navigator
  ) {

    navigator.serviceWorker
      .register("./sw.js")
      .catch(
        error =>
          console.error(
            "Service Worker:",
            error
          )
      );

  }

}


/* INIT */

function init() {

  updateHome();

  loadSettings();

  randomMissingMessage();

  renderMemories();

  renderSpecialMessages();

  updateMeeting();


  setInterval(
    () => {

      updateRelationshipTimer();

      updateMeeting();

    },
    1000
  );


  registerServiceWorker();


  showPage("home");

}


init();
