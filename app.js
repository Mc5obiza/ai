const chatForm = document.querySelector("#chat-form");

if (chatForm) {
  const chatHistory = document.querySelector("#chat-history");
  const questionInput = document.querySelector("#question");
  const chatFeedback = document.querySelector("#chat-feedback");
  const subjectSelect = document.querySelector("#subject");

  document.querySelectorAll(".prompt-chip").forEach((button) => {
    button.addEventListener("click", () => {
      questionInput.value = button.dataset.prompt || "";
      questionInput.focus();
    });
  });

  chatForm.addEventListener("submit", (event) => {
    event.preventDefault();
    chatFeedback.textContent = "This demo isn’t connected to an AI service yet, so your question wasn’t sent.";
  });

  document.querySelector("#new-chat").addEventListener("click", () => {
    chatHistory.replaceChildren();
    questionInput.value = "";
    chatFeedback.textContent = "New chat started. Your questions will stay in this page.";
    subjectSelect.focus();
  });
}

const plannerForm = document.querySelector("#planner-form");

if (plannerForm) {
  const storageKey = "studymate.sessions";
  const sessionList = document.querySelector("#session-list");
  const plannerFeedback = document.querySelector("#planner-feedback");
  const emptySessions = document.querySelector("#empty-sessions");
  const dateInput = document.querySelector("#session-date");
  let storageAvailable = true;
  let sessions = [];

  const showMessage = (message) => {
    plannerFeedback.textContent = message;
  };

  const parseDate = (date) => {
    const [year, month, day] = date.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const formatDate = (date) => {
    const parsed = parseDate(date);
    return {
      day: new Intl.DateTimeFormat(undefined, { weekday: "long" }).format(parsed),
      date: new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(parsed),
    };
  };

  const dateForWeekday = (weekday) => {
    const date = new Date();
    const targetDay = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].indexOf(weekday);
    const difference = (targetDay - date.getDay() + 7) % 7 || 7;
    date.setDate(date.getDate() + difference);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  };

  const durationLabel = (hours) => `${hours} ${Number(hours) === 1 ? "hr" : "hrs"}`;

  const createSessionRow = (session) => {
    const date = formatDate(session.date);
    const row = document.createElement("tr");
    row.dataset.sessionRow = "";
    row.dataset.sessionId = session.id;

    const dayCell = document.createElement("td");
    dayCell.className = "session-day";
    const dayName = document.createElement("strong");
    dayName.textContent = date.day;
    const dateLabel = document.createElement("span");
    dateLabel.textContent = date.date;
    dayCell.append(dayName, dateLabel);

    const subjectCell = document.createElement("td");
    const subject = document.createElement("strong");
    subject.className = "session-subject";
    subject.textContent = session.subject;
    const goal = document.createElement("span");
    goal.className = "session-goal";
    goal.textContent = session.goal;
    subjectCell.append(subject, goal);

    const timeCell = document.createElement("td");
    timeCell.textContent = session.time;
    const durationCell = document.createElement("td");
    durationCell.textContent = durationLabel(session.hours);
    const actionCell = document.createElement("td");
    const removeButton = document.createElement("button");
    removeButton.className = "remove-session";
    removeButton.type = "button";
    removeButton.setAttribute("aria-label", `Remove ${session.subject} study session`);
    removeButton.innerHTML = '<i class="fa fa-trash-o" aria-hidden="true"></i>';
    actionCell.append(removeButton);
    row.append(dayCell, subjectCell, timeCell, durationCell, actionCell);
    return row;
  };

  const renderSessions = () => {
    sessionList.replaceChildren(...sessions.map(createSessionRow));
    emptySessions.hidden = sessions.length > 0;
    document.querySelector("#session-count").textContent = String(sessions.length);
    const totalHours = sessions.reduce((sum, session) => sum + Number(session.hours), 0);
    document.querySelector("#study-hours").textContent = `${totalHours} ${totalHours === 1 ? "hr" : "hrs"}`;
  };

  const saveSessions = () => {
    if (!storageAvailable) {
      showMessage("Your browser blocked local storage. Changes will last only until you leave this page.");
      return;
    }
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(sessions));
      showMessage("Your study plan is saved on this device.");
    } catch {
      storageAvailable = false;
      showMessage("Your browser blocked local storage. Changes will last only until you leave this page.");
    }
  };

  const readSavedSessions = () => {
    let saved;
    try {
      saved = window.localStorage.getItem(storageKey);
    } catch {
      storageAvailable = false;
      showMessage("Your browser blocked local storage. Changes will last only until you leave this page.");
      return null;
    }

    if (!saved) return null;
    try {
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed) || parsed.some((session) =>
        !session || typeof session.id !== "string" ||
        typeof session.subject !== "string" || typeof session.goal !== "string" ||
        typeof session.date !== "string" || typeof session.time !== "string" ||
        !Number.isFinite(Number(session.hours))
      )) {
        throw new Error("Saved study plan has an invalid format.");
      }
      return parsed;
    } catch {
      showMessage("Your saved study plan couldn’t be read. Starter sessions are shown instead.");
      return null;
    }
  };

  const starterSessions = () => Array.from(sessionList.querySelectorAll("[data-session-row]"), (row, index) => {
    const cells = row.querySelectorAll("td");
    const weekday = cells[0].querySelector("strong").textContent;
    return {
      id: `starter-${index}`,
      subject: cells[1].querySelector(".session-subject").textContent,
      goal: cells[1].querySelector(".session-goal").textContent,
      date: dateForWeekday(weekday),
      time: cells[2].textContent,
      hours: Number.parseFloat(cells[3].textContent),
    };
  });

  const today = new Date();
  const todayValue = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  dateInput.min = todayValue;
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  dateInput.value = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, "0")}-${String(tomorrow.getDate()).padStart(2, "0")}`;

  const savedSessions = readSavedSessions();
  sessions = savedSessions || starterSessions();
  sessions.sort((first, second) => `${first.date}T${first.time}`.localeCompare(`${second.date}T${second.time}`));
  renderSessions();
  if (savedSessions === null && storageAvailable) saveSessions();

  plannerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!plannerForm.reportValidity()) return;

    const data = new FormData(plannerForm);
    sessions.push({
      id: window.crypto.randomUUID(),
      subject: String(data.get("subject")).trim(),
      goal: String(data.get("goal")).trim(),
      date: String(data.get("date")),
      time: String(data.get("time")),
      hours: Number(data.get("hours")),
    });
    sessions.sort((first, second) => `${first.date}T${first.time}`.localeCompare(`${second.date}T${second.time}`));
    renderSessions();
    saveSessions();
    plannerForm.reset();
    dateInput.min = todayValue;
    dateInput.value = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, "0")}-${String(tomorrow.getDate()).padStart(2, "0")}`;
    document.querySelector("#session-subject").focus();
  });

  sessionList.addEventListener("click", (event) => {
    const removeButton = event.target.closest(".remove-session");
    if (!removeButton) return;
    const row = removeButton.closest("[data-session-row]");
    sessions = sessions.filter((session) => session.id !== row.dataset.sessionId);
    renderSessions();
    saveSessions();
  });
}
