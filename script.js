const campus = document.getElementById("campus");
const scene = document.getElementById("scene");
const avatar = document.getElementById("avatar");

let mode = "orbit";
let drag = false;
let lastX = 0;
let lastY = 0;
let rx = 0;
let ry = 0;

/* =========================
   MODE SWITCH
========================= */

function setMode(btn, selectedMode) {
    document
        .querySelectorAll(".controls button")
        .forEach((button) => button.classList.remove("active"));

    btn.classList.add("active");

    mode = selectedMode;

    if (mode === "walk") {
        toast("Walk mode: click a destination building.");
    } else {
        toast("Orbit mode: drag the campus to look around.");
    }
}

/* =========================
   CAMPUS ORBIT
========================= */

campus.addEventListener("pointerdown", (event) => {
    if (mode !== "orbit") return;

    drag = true;

    lastX = event.clientX;
    lastY = event.clientY;

    campus.setPointerCapture(event.pointerId);
});

campus.addEventListener("pointerup", () => {
    drag = false;
});

campus.addEventListener("pointercancel", () => {
    drag = false;
});

campus.addEventListener("pointermove", (event) => {
    if (!drag || mode !== "orbit") return;

    const dx = event.clientX - lastX;
    const dy = event.clientY - lastY;

    lastX = event.clientX;
    lastY = event.clientY;

    ry += dx * 0.035;
    rx -= dy * 0.025;

    rx = Math.max(-8, Math.min(8, rx));
    ry = Math.max(-13, Math.min(13, ry));

    scene.style.transform = `
        perspective(1100px)
        rotateX(${rx}deg)
        rotateY(${ry}deg)
        scale(1.01)
    `;
});

/* =========================
   RESET CAMPUS
========================= */

function resetCampus() {
    rx = 0;
    ry = 0;

    scene.style.transform = "";

    avatar.style.left = "50%";
    avatar.style.top = "55%";

    toast("Campus view reset.");
}

/* =========================
   BUILDING DATA
========================= */

const buildings = {
    "Programming Fundamentals": {
        description:
            "Variables · Data Types · Operators · Input / Output",
        status: "MASTERED · 86%"
    },

    "Control Flow": {
        description:
            "Conditions · Loops · Error Handling",
        status: "MASTERED · 82%"
    },

    "Functions Lab": {
        description:
            "Parameters · Return values · Scope · Reusable logic",
        status: "CURRENT · 60% MASTERY"
    },

    "Data Structures Library": {
        description:
            "Lists · Tuples · Dictionaries · Sets",
        status: "LOCKED · COMPLETE FUNCTIONS"
    },

    "AI Tutor Tower": {
        description:
            "Contextual explanations · Roadmap chat · Recommendations",
        status: "ALWAYS AVAILABLE"
    },

    "Project Lab": {
        description:
            "Expense Tracker · Quiz App · API Project",
        status: "BUILD · 3 PROJECTS"
    }
};

/* =========================
   OPEN BUILDING
========================= */

function openBuilding(title, description, status) {

    if (mode === "walk") {

        moveAvatarToBuilding(title);

    }

    const modalTitle = document.getElementById("modalTitle");
    const modalDesc = document.getElementById("modalDesc");
    const modal = document.getElementById("modal");

    if (!modalTitle || !modalDesc || !modal) return;

    modalTitle.textContent = title;

    modalDesc.textContent =
        `${description} — ${status}.`;

    modal.classList.add("show");
}

/* =========================
   CLOSE MODAL
========================= */

function closeModal() {

    const modal = document.getElementById("modal");

    if (modal) {
        modal.classList.remove("show");
    }
}

/* =========================
   BUILDING LOCATIONS
========================= */

const buildingPositions = {

    "Programming Fundamentals": {
        left: "15%",
        top: "36%"
    },

    "Control Flow": {
        left: "42%",
        top: "31%"
    },

    "Functions Lab": {
        left: "69%",
        top: "39%"
    },

    "Data Structures Library": {
        left: "25%",
        top: "62%"
    },

    "AI Tutor Tower": {
        left: "73%",
        top: "65%"
    },

    "Project Lab": {
        left: "50%",
        top: "76%"
    }
};

/* =========================
   MOVE AVATAR
========================= */

function moveAvatarToBuilding(name) {

    const position = buildingPositions[name];

    if (!position || !avatar) return;

    avatar.style.left = position.left;
    avatar.style.top = position.top;

    avatar.classList.remove("walk");

    void avatar.offsetWidth;

    avatar.classList.add("walk");
}

/* =========================
   FOCUS BUILDING
========================= */

function focusBuilding(name) {

    toast(`Navigating to ${name}…`);

    moveAvatarToBuilding(name);

    const buildingElements =
        document.querySelectorAll(".building");

    buildingElements.forEach((building) => {
        building.style.filter = "";
        building.style.transform = "";
    });

    const matchingBuilding =
        [...buildingElements].find((building) =>
            building.innerText.includes(
                name.replace(" Lab", "").replace(" Tower", "")
            )
        );

    if (matchingBuilding) {

        matchingBuilding.style.filter =
            "drop-shadow(0 0 18px rgba(198,106,69,.45))";

        matchingBuilding.style.transform =
            "translateY(-10px) scale(1.05)";

        setTimeout(() => {
            matchingBuilding.style.filter = "";
            matchingBuilding.style.transform = "";
        }, 1800);
    }
}

/* =========================
   LEARNING ACTIONS
========================= */

function action(type) {

    const messages = {

        learn:
            "Learning room opened — concept briefing ready.",

        explore:
            "Interactive concept objects activated.",

        practice:
            "Checkpoint opened — mastery will update from your result.",

        build:
            "Project mission started — prerequisites checked.",

        ask:
            'AI Tutor: "I know you are currently in this learning space."',

        next:
            "AI recommends: finish the Functions mini-project before Data Structures."
    };

    closeModal();

    toast(messages[type] || "Action started.");
}

/* =========================
   TOAST NOTIFICATION
========================= */

function toast(message) {

    let toastElement =
        document.getElementById("toast");

    if (!toastElement) {

        toastElement =
            document.createElement("div");

        toastElement.id = "toast";

        toastElement.style.cssText = `
            position: fixed;
            right: 22px;
            bottom: 22px;
            background: #fffdf8;
            border: 1px solid #c8bead;
            border-radius: 11px;
            padding: 13px 16px;
            box-shadow:
                0 15px 40px rgba(40,35,29,.18);
            z-index: 100;
            font: 12px Manrope, sans-serif;
            color: #20231f;
            transition: opacity .3s ease;
        `;

        document.body.appendChild(toastElement);
    }

    toastElement.textContent = message;
    toastElement.style.opacity = "1";

    clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(() => {

        toastElement.style.opacity = "0";

    }, 2400);
}

/* =========================
   BUILDING HOVER EFFECT
========================= */

document.querySelectorAll(".building").forEach((building) => {

    building.addEventListener("mouseenter", () => {

        building.style.zIndex = "20";

        showTooltip(
            building,
            building.querySelector("h3")?.textContent || "Learning Space",
            building.querySelector("p")?.textContent || ""
        );
    });

    building.addEventListener("mouseleave", () => {

        building.style.zIndex = "";

        hideTooltip();
    });
});

/* =========================
   TOOLTIP
========================= */

function showTooltip(building, title, description) {

    const tooltip =
        document.getElementById("tooltip");

    const titleElement =
        document.getElementById("tipTitle");

    const textElement =
        document.getElementById("tipText");

    if (!tooltip || !titleElement || !textElement) return;

    titleElement.textContent = title;
    textElement.textContent = description;

    const campusRect =
        campus.getBoundingClientRect();

    const buildingRect =
        building.getBoundingClientRect();

    let left =
        buildingRect.left -
        campusRect.left +
        buildingRect.width / 2;

    let top =
        buildingRect.top -
        campusRect.top -
        110;

    left = Math.max(15, Math.min(
        campus.clientWidth - 235,
        left - 110
    ));

    top = Math.max(15, top);

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;

    tooltip.classList.add("show");
}

function hideTooltip() {

    const tooltip =
        document.getElementById("tooltip");

    if (tooltip) {
        tooltip.classList.remove("show");
    }
}

/* =========================
   KEYBOARD WALK MODE
========================= */

document.addEventListener("keydown", (event) => {

    if (mode !== "walk" || !avatar) return;

    const step = 2;

    const rect = campus.getBoundingClientRect();

    const currentLeft =
        parseFloat(avatar.style.left) || 50;

    const currentTop =
        parseFloat(avatar.style.top) || 55;

    let newLeft = currentLeft;
    let newTop = currentTop;

    switch (event.key.toLowerCase()) {

        case "w":
        case "arrowup":
            newTop -= step;
            break;

        case "s":
        case "arrowdown":
            newTop += step;
            break;

        case "a":
        case "arrowleft":
            newLeft -= step;
            break;

        case "d":
        case "arrowright":
            newLeft += step;
            break;

        default:
            return;
    }

    newLeft = Math.max(4, Math.min(94, newLeft));
    newTop = Math.max(12, Math.min(88, newTop));

    avatar.style.left = `${newLeft}%`;
    avatar.style.top = `${newTop}%`;

    avatar.classList.remove("walk");

    void avatar.offsetWidth;

    avatar.classList.add("walk");
});

/* =========================
   MODAL OUTSIDE CLICK
========================= */

const modal = document.getElementById("modal");

if (modal) {

    modal.addEventListener("click", (event) => {

        if (event.target === modal) {
            closeModal();
        }

    });
}

/* =========================
   ESCAPE TO CLOSE
========================= */

document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {
        closeModal();
    }

});

/* =========================
   INITIAL STATE
========================= */

window.addEventListener("load", () => {

    if (avatar) {
        avatar.style.left = "50%";
        avatar.style.top = "55%";
    }

    toast(
        "Welcome to MINDSPACE. Your next space is Functions Lab."
    );

});
