/* =========================================================
   COLLEGE EVENT MANAGEMENT SYSTEM
========================================================= */


/* =========================================================
   DEFAULT EVENTS
========================================================= */

const defaultEvents = [
    {
        id: 1,
        name: "Tech Hackathon 2026",
        date: getFutureDate(5, 10),
        venue: "Innovation Lab",
        club: "Technical",
        completed: false
    },

    {
        id: 2,
        name: "Annual Cultural Fest",
        date: getFutureDate(12, 18),
        venue: "Main Auditorium",
        club: "Cultural",
        completed: false
    },

    {
        id: 3,
        name: "Inter College Cricket",
        date: getFutureDate(20, 9),
        venue: "University Ground",
        club: "Sports",
        completed: false
    },

    {
        id: 4,
        name: "AI & Machine Learning Workshop",
        date: getFutureDate(8, 14),
        venue: "Seminar Hall",
        club: "Academic",
        completed: false
    }
];


/* =========================================================
   GET FUTURE DATE
========================================================= */

function getFutureDate(days, hour) {

    const date = new Date();

    date.setDate(date.getDate() + days);

    date.setHours(hour, 0, 0, 0);

    return date.toISOString();

}


/* =========================================================
   LOCAL STORAGE
========================================================= */

let events = JSON.parse(
    localStorage.getItem("collegeEvents")
) || defaultEvents;


function saveEvents() {

    localStorage.setItem(
        "collegeEvents",
        JSON.stringify(events)
    );

}


/* =========================================================
   SORT STATE
========================================================= */

let nearestFirst = true;


/* =========================================================
   DOM ELEMENTS
========================================================= */

const eventsContainer =
    document.getElementById("eventsContainer");

const emptyState =
    document.getElementById("emptyState");

const eventModal =
    document.getElementById("eventModal");

const eventForm =
    document.getElementById("eventForm");

const searchInput =
    document.getElementById("searchInput");

const clubFilter =
    document.getElementById("clubFilter");

const statusFilter =
    document.getElementById("statusFilter");


/* =========================================================
   OPEN MODAL
========================================================= */

function openModal() {

    eventModal.classList.add("show");

    document.body.style.overflow = "hidden";

    document.getElementById("eventName").focus();

}


/* =========================================================
   CLOSE MODAL
========================================================= */

function closeModal() {

    eventModal.classList.remove("show");

    document.body.style.overflow = "";

    eventForm.reset();

}


/* =========================================================
   CLOSE MODAL WHEN CLICKING OUTSIDE
========================================================= */

eventModal.addEventListener("click", function(event) {

    if (event.target === eventModal) {

        closeModal();

    }

});


/* =========================================================
   ESCAPE KEY
========================================================= */

document.addEventListener("keydown", function(event) {

    if (event.key === "Escape") {

        closeModal();

    }

});


/* =========================================================
   ADD EVENT
========================================================= */

eventForm.addEventListener("submit", function(event) {

    event.preventDefault();


    const name =
        document.getElementById("eventName").value.trim();

    const date =
        document.getElementById("eventDate").value;

    const venue =
        document.getElementById("eventVenue").value.trim();

    const club =
        document.getElementById("eventClub").value;


    if (!name || !date || !venue || !club) {

        showToast(
            "Please fill in all fields."
        );

        return;

    }


    const eventDate = new Date(date);


    if (eventDate <= new Date()) {

        showToast(
            "Please select a future date."
        );

        return;

    }


    const newEvent = {

        id: Date.now(),

        name: name,

        date: eventDate.toISOString(),

        venue: venue,

        club: club,

        completed: false

    };


    events.push(newEvent);

    saveEvents();

    renderEvents();

    closeModal();

    showToast(
        "Event added successfully!"
    );

});


/* =========================================================
   DELETE EVENT
========================================================= */

function deleteEvent(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this event?"
        );


    if (!confirmed) {

        return;

    }


    events =
        events.filter(
            event => event.id !== id
        );


    saveEvents();

    renderEvents();

    showToast(
        "Event deleted."
    );

}


/* =========================================================
   TOGGLE COMPLETED
========================================================= */

function toggleCompleted(id) {

    const event =
        events.find(
            event => event.id === id
        );


    if (!event) {

        return;

    }


    event.completed =
        !event.completed;


    saveEvents();

    renderEvents();


    showToast(
        event.completed
            ? "Event marked as completed."
            : "Event marked as upcoming."
    );

}


/* =========================================================
   CLUB CLASS
========================================================= */

function getClubClass(club) {

    return club
        .toLowerCase()
        .replace(/\s+/g, "-");

}


/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(dateString) {

    const date =
        new Date(dateString);


    return date.toLocaleDateString(
        "en-IN",
        {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );

}


/* =========================================================
   FORMAT TIME
========================================================= */

function formatTime(dateString) {

    const date =
        new Date(dateString);


    return date.toLocaleTimeString(
        "en-IN",
        {
            hour: "numeric",
            minute: "2-digit"
        }
    );

}


/* =========================================================
   EVENT STATUS
========================================================= */

function isCompleted(event) {

    return event.completed ||
        new Date(event.date) <= new Date();

}


/* =========================================================
   GET COUNTDOWN
========================================================= */

function getCountdown(dateString) {

    const target =
        new Date(dateString).getTime();

    const now =
        new Date().getTime();

    let difference =
        target - now;


    if (difference <= 0) {

        return null;

    }


    const days =
        Math.floor(
            difference /
            (1000 * 60 * 60 * 24)
        );


    difference %=
        (1000 * 60 * 60 * 24);


    const hours =
        Math.floor(
            difference /
            (1000 * 60 * 60)
        );


    difference %=
        (1000 * 60 * 60);


    const minutes =
        Math.floor(
            difference /
            (1000 * 60)
        );


    difference %=
        (1000 * 60);


    const seconds =
        Math.floor(
            difference /
            1000
        );


    return {

        days,

        hours,

        minutes,

        seconds

    };

}


/* =========================================================
   PAD NUMBER
========================================================= */

function pad(number) {

    return String(number)
        .padStart(2, "0");

}


/* =========================================================
   CREATE EVENT CARD
========================================================= */

function createEventCard(event) {

    const completed =
        isCompleted(event);


    const clubClass =
        getClubClass(event.club);


    let countdownHTML = "";


    if (completed) {

        countdownHTML = `

            <div class="completed-message">

                <i class="fa-solid fa-circle-check"></i>

                Event Completed

            </div>

        `;

    } else {

        const countdown =
            getCountdown(event.date);


        countdownHTML = `

            <div class="countdown">

                <div class="countdown-title">

                    <i class="fa-solid fa-stopwatch"></i>

                    Starts In

                </div>


                <div
                    class="countdown-values"
                    data-countdown="${event.date}"
                >

                    <div class="time-box">

                        <strong class="days">
                            ${pad(countdown.days)}
                        </strong>

                        <span>Days</span>

                    </div>


                    <div class="time-box">

                        <strong class="hours">
                            ${pad(countdown.hours)}
                        </strong>

                        <span>Hours</span>

                    </div>


                    <div class="time-box">

                        <strong class="minutes">
                            ${pad(countdown.minutes)}
                        </strong>

                        <span>Minutes</span>

                    </div>


                    <div class="time-box">

                        <strong class="seconds">
                            ${pad(countdown.seconds)}
                        </strong>

                        <span>Seconds</span>

                    </div>

                </div>

            </div>

        `;

    }


    return `

        <article class="event-card">

            <div class="event-top">

                <span class="
                    club-badge
                    club-${clubClass}
                ">

                    ${escapeHTML(event.club)}

                </span>


                <span class="
                    status-badge
                    ${completed
                        ? "status-completed"
                        : "status-upcoming"}
                ">

                    ${completed
                        ? "Completed"
                        : "Upcoming"}

                </span>

            </div>


            <div class="event-body">

                <h3>
                    ${escapeHTML(event.name)}
                </h3>


                <div class="event-info">

                    <i class="fa-regular fa-calendar"></i>

                    <span>
                        ${formatDate(event.date)}
                    </span>

                </div>


                <div class="event-info">

                    <i class="fa-regular fa-clock"></i>

                    <span>
                        ${formatTime(event.date)}
                    </span>

                </div>


                <div class="event-info">

                    <i class="fa-solid fa-location-dot"></i>

                    <span>
                        ${escapeHTML(event.venue)}
                    </span>

                </div>


                ${countdownHTML}

            </div>


            <div class="event-actions">

                <button
                    class="complete-btn"
                    onclick="toggleCompleted(${event.id})"
                >

                    <i class="
                        fa-solid
                        ${completed
                            ? "fa-rotate-left"
                            : "fa-check"}
                    "></i>

                    ${completed
                        ? "Reopen"
                        : "Complete"}

                </button>


                <button
                    class="delete-btn"
                    onclick="deleteEvent(${event.id})"
                >

                    <i class="fa-solid fa-trash"></i>

                    Delete

                </button>

            </div>

        </article>

    `;

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


/* =========================================================
   RENDER EVENTS
========================================================= */

function renderEvents() {

    const search =
        searchInput.value
            .trim()
            .toLowerCase();


    const club =
        clubFilter.value;


    const status =
        statusFilter.value;


    let filtered =
        [...events];


    /* SEARCH */

    if (search) {

        filtered =
            filtered.filter(event =>

                event.name
                    .toLowerCase()
                    .includes(search)

                ||

                event.venue
                    .toLowerCase()
                    .includes(search)

            );

    }


    /* CLUB FILTER */

    if (club !== "All") {

        filtered =
            filtered.filter(
                event =>
                    event.club === club
            );

    }


    /* STATUS FILTER */

    if (status !== "All") {

        filtered =
            filtered.filter(event => {

                const completed =
                    isCompleted(event);


                return status === "Completed"
                    ? completed
                    : !completed;

            });

    }


    /* AUTO SORT */

    filtered.sort((a, b) => {

        const dateA =
            new Date(a.date).getTime();

        const dateB =
            new Date(b.date).getTime();


        return nearestFirst
            ? dateA - dateB
            : dateB - dateA;

    });


    /* EMPTY STATE */

    if (filtered.length === 0) {

        eventsContainer.innerHTML = "";

        eventsContainer.style.display = "none";

        emptyState.style.display = "block";

    } else {

        eventsContainer.style.display = "grid";

        emptyState.style.display = "none";


        eventsContainer.innerHTML =
            filtered
                .map(createEventCard)
                .join("");

    }


    updateStatistics();

    updateResultText(filtered.length);

}


/* =========================================================
   UPDATE RESULT TEXT
========================================================= */

function updateResultText(count) {

    const total =
        events.length;


    const resultText =
        document.getElementById(
            "resultText"
        );


    if (count === total) {

        resultText.textContent =
            `Showing all ${total} events`;

    } else {

        resultText.textContent =
            `Showing ${count} of ${total} events`;

    }

}


/* =========================================================
   UPDATE STATISTICS
========================================================= */

function updateStatistics() {

    const total =
        events.length;


    const completed =
        events.filter(
            event =>
                isCompleted(event)
        ).length;


    const upcoming =
        total - completed;


    const clubs =
        new Set(
            events.map(
                event => event.club
            )
        );


    document.getElementById(
        "totalEvents"
    ).textContent = total;


    document.getElementById(
        "upcomingEvents"
    ).textContent = upcoming;


    document.getElementById(
        "completedEvents"
    ).textContent = completed;


    document.getElementById(
        "clubCount"
    ).textContent = clubs.size;

}


/* =========================================================
   TOGGLE SORT
========================================================= */

function toggleSort() {

    nearestFirst =
        !nearestFirst;


    document.getElementById(
        "sortText"
    ).textContent =
        nearestFirst
            ? "Nearest First"
            : "Latest First";


    renderEvents();

}


/* =========================================================
   LIVE COUNTDOWN
========================================================= */

function updateCountdowns() {

    const countdownElements =
        document.querySelectorAll(
            "[data-countdown]"
        );


    countdownElements.forEach(element => {

        const date =
            element.dataset.countdown;


        const countdown =
            getCountdown(date);


        if (!countdown) {

            renderEvents();

            return;

        }


        const days =
            element.querySelector(".days");

        const hours =
            element.querySelector(".hours");

        const minutes =
            element.querySelector(".minutes");

        const seconds =
            element.querySelector(".seconds");


        days.textContent =
            pad(countdown.days);


        hours.textContent =
            pad(countdown.hours);


        minutes.textContent =
            pad(countdown.minutes);


        seconds.textContent =
            pad(countdown.seconds);

    });

}


/* =========================================================
   TOAST
========================================================= */

let toastTimer;


function showToast(message) {

    const toast =
        document.getElementById("toast");

    const toastMessage =
        document.getElementById(
            "toastMessage"
        );


    toastMessage.textContent =
        message;


    toast.classList.add("show");


    clearTimeout(toastTimer);


    toastTimer =
        setTimeout(() => {

            toast.classList.remove("show");

        }, 2500);

}


/* =========================================================
   AUTOMATIC STATUS UPDATE
========================================================= */

function updateExpiredEvents() {

    let changed = false;


    events.forEach(event => {

        if (
            !event.completed &&
            new Date(event.date) <= new Date()
        ) {

            changed = true;

        }

    });


    if (changed) {

        saveEvents();

        renderEvents();

    }

}


/* =========================================================
   INITIALIZE
========================================================= */

renderEvents();


/* =========================================================
   LIVE TIMER
========================================================= */

setInterval(
    updateCountdowns,
    1000
);


/* =========================================================
   CHECK EXPIRED EVENTS
========================================================= */

setInterval(
    updateExpiredEvents,
    10000
);