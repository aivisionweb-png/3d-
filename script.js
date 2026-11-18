import * as THREE from "https://esm.sh/three@0.180.0";
import { PointerLockControls } from "https://esm.sh/three@0.180.0/examples/jsm/controls/PointerLockControls.js";

/* ========================================================
   MINDSPACE — WALK & LEARN
   ========================================================= */

const COLORS = {
    ground: 0xb8b09e,
    road: 0xe7dfd1,
    building: 0xf8f4eb,
    roof: 0x817867,
    glass: 0xb8d0cd,
    tree: 0x65715a,
    trunk: 0x7d674f,
    terra: 0xc76b45,
    olive: 0x68725c,
    gold: 0xaa8751,
    dark: 0x20231f,
    locked: 0x9c978c
};

/* =========================================================
   LEARNING ROADMAP
   ========================================================= */

const spaces = [
    {
        id: "fundamentals",
        name: "Programming Fundamentals",
        short: "Fundamentals",
        pos: [-18, 0, -7],
        color: COLORS.olive,
        status: "done",

        intro:
            "Build the base: variables, data types, operators, input and output.",

        lesson:
            "A variable is a named place to store a value. Python lets you bind a name to a value without declaring a fixed type first.",

        concepts: [
            ["Variables", "name → value"],
            ["Data types", "str · int · float · bool"],
            ["Operators", "+ − × ÷"],
            ["I/O", "input() · print()"]
        ]
    },

    {
        id: "control",
        name: "Control Flow",
        short: "Control Flow",
        pos: [-7, 0, -15],
        color: COLORS.olive,
        status: "done",

        intro:
            "Learn to make programs decide and repeat.",

        lesson:
            "Control flow changes which instructions execute. Conditions choose a path; loops repeat a block while a condition or sequence requires it.",

        concepts: [
            ["if / elif", "choose"],
            ["for", "iterate"],
            ["while", "repeat"],
            ["break", "exit loop"]
        ]
    },

    {
        id: "functions",
        name: "Functions Lab",
        short: "Functions",
        pos: [7, 0, -15],
        color: COLORS.terra,
        status: "current",

        intro:
            "Turn repeated logic into reusable building blocks.",

        lesson:
            "A function packages a task behind a name. Parameters provide inputs and return values send results back to the caller.",

        concepts: [
            ["def", "define a function"],
            ["Parameters", "inputs"],
            ["return", "send result"],
            ["scope", "where names live"]
        ]
    },

    {
        id: "data",
        name: "Data Structures Library",
        short: "Data Structures",
        pos: [18, 0, -7],
        color: COLORS.gold,
        status: "locked",

        intro:
            "Organize collections of data so your programs can work with real information.",

        lesson:
            "Lists keep ordered mutable collections, tuples keep ordered immutable collections, dictionaries map keys to values, and sets keep unique values.",

        concepts: [
            ["list", "ordered + mutable"],
            ["tuple", "ordered + immutable"],
            ["dict", "key → value"],
            ["set", "unique values"]
        ]
    },

    {
        id: "projects",
        name: "Project Studio",
        short: "Project Studio",
        pos: [15, 0, 9],
        color: COLORS.terra,
        status: "locked",

        intro:
            "Apply what you know to build something real.",

        lesson:
            "A project combines concepts into a usable outcome. Start small, define the input and output, break the work into functions, then test each piece.",

        concepts: [
            ["Plan", "define outcome"],
            ["Build", "compose concepts"],
            ["Test", "find failures"],
            ["Ship", "make it usable"]
        ]
    },

    {
        id: "ai",
        name: "AI Guide Tower",
        short: "AI Guide",
        pos: [-14, 0, 9],
        color: COLORS.dark,
        status: "open",

        intro:
            "Your contextual tutor. Ask what something means, why you are stuck, or what to learn next.",

        lesson:
            "MINDSPACE AI knows your goal, roadmap position, previous checkpoint results and current learning space.",

        concepts: [
            ["Explain", "adapt to you"],
            ["Diagnose", "find gaps"],
            ["Challenge", "practice"],
            ["Recommend", "next step"]
        ]
    }
];

/* =========================================================
   GLOBAL STATE
   ========================================================= */

let progress = 2;
let currentSpace = null;
let targetSpace = null;
let quizDone = false;

const keys = {
    w: false,
    a: false,
    s: false,
    d: false
};

/* =========================================================
   THREE.JS SCENE
   ========================================================= */

const scene = new THREE.Scene();

scene.background = new THREE.Color(0xdfe5df);

scene.fog = new THREE.Fog(
    0xdfe5df,
    45,
    110
);

/* CAMERA */

const camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    160
);

camera.position.set(
    0,
    2.2,
    22
);

/* RENDERER */

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.shadowMap.enabled = true;

renderer.shadowMap.type =
    THREE.PCFSoftShadowMap;

document.body.appendChild(
    renderer.domElement
);

/* =========================================================
   FIRST PERSON CONTROLS
   ========================================================= */

const controls =
    new PointerLockControls(
        camera,
        document.body
    );

/* =========================================================
   LIGHTING
   ========================================================= */

const hemi =
    new THREE.HemisphereLight(
        0xfff9e9,
        0x7d796e,
        2.3
    );

scene.add(hemi);

const sun =
    new THREE.DirectionalLight(
        0xffe8bd,
        3.2
    );

sun.position.set(
    -25,
    35,
    20
);

sun.castShadow = true;

sun.shadow.mapSize.set(
    2048,
    2048
);

sun.shadow.camera.left = -50;
sun.shadow.camera.right = 50;
sun.shadow.camera.top = 50;
sun.shadow.camera.bottom = -50;

scene.add(sun);

/* =========================================================
   WORLD
   ========================================================= */

const world = new THREE.Group();

scene.add(world);

/* =========================================================
   BASIC BOX HELPER
   ========================================================= */

function box(
    width,
    height,
    depth,
    color,
    x,
    y,
    z,
    options = {}
) {

    const mesh =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                width,
                height,
                depth
            ),

            new THREE.MeshStandardMaterial({
                color,
                roughness:
                    options.roughness ?? 0.82,
                metalness:
                    options.metalness ?? 0
            })
        );

    mesh.position.set(
        x,
        y + height / 2,
        z
    );

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    mesh.userData =
        options.userData || {};

    world.add(mesh);

    return mesh;
}

/* =========================================================
   GROUND
   ========================================================= */

const ground =
    new THREE.Mesh(
        new THREE.PlaneGeometry(
            120,
            100
        ),

        new THREE.MeshStandardMaterial({
            color: COLORS.ground,
            roughness: 1
        })
    );

ground.rotation.x =
    -Math.PI / 2;

ground.receiveShadow = true;

world.add(ground);

/* =========================================================
   ROADS
   ========================================================= */

function road(
    x,
    z,
    width,
    depth
) {

    const r =
        box(
            width,
            0.08,
            depth,
            COLORS.road,
            x,
            0.01,
            z
        );

    r.receiveShadow = true;
}

road(0, 0, 46, 5);
road(0, -10, 5, 28);
road(0, 10, 5, 24);

road(-16, 0, 4, 32);
road(16, 0, 4, 32);

/* =========================================================
   TREES
   ========================================================= */

function tree(x, z, scale = 1) {

    box(
        0.55,
        2.5,
        0.55,
        COLORS.trunk,
        x,
        0,
        z
    );

    const crown =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                2.1 * scale,
                14,
                10
            ),

            new THREE.MeshStandardMaterial({
                color: COLORS.tree,
                roughness: 1
            })
        );

    crown.position.set(
        x,
        3.2 * scale,
        z
    );

    crown.castShadow = true;
    crown.receiveShadow = true;

    world.add(crown);
}

[
    [-27, -20, 1],
    [-25, 17, 0.9],
    [-10, 18, 0.8],
    [10, 18, 0.9],
    [27, 17, 1],
    [-27, 5, 0.8],
    [27, -4, 0.9],
    [-10, -25, 1],
    [11, -25, 0.9]
].forEach(tree);

/* =========================================================
   BUILDINGS
   ========================================================= */

const buildingMeshes = [];
const clickable = [];

function makeBuilding(space) {

    const [
        x,
        ,
        z
    ] = space.pos;

    const group =
        new THREE.Group();

    group.position.set(
        x,
        0,
        z
    );

    group.userData.space =
        space;

    /* MAIN BUILDING */

    const main =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                8,
                6,
                7
            ),

            new THREE.MeshStandardMaterial({
                color:
                    space.status === "locked"
                        ? COLORS.locked
                        : COLORS.building,

                roughness: 0.78
            })
        );

    main.position.y = 3;

    main.castShadow = true;
    main.receiveShadow = true;

    group.add(main);

    /* ROOF */

    const roof =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                8.5,
                0.55,
                7.5
            ),

            new THREE.MeshStandardMaterial({
                color: space.color,
                roughness: 0.72
            })
        );

    roof.position.y = 6.28;

    roof.castShadow = true;

    group.add(roof);

    /* WINDOWS */

    for (
        let row = 0;
        row < 2;
        row++
    ) {

        for (
            let col = 0;
            col < 4;
            col++
        ) {

            const windowMesh =
                new THREE.Mesh(
                    new THREE.BoxGeometry(
                        1.05,
                        1.15,
                        0.12
                    ),

                    new THREE.MeshStandardMaterial({
                        color:
                            space.status === "locked"
                                ? 0x8e8b82
                                : COLORS.glass,

                        roughness: 0.35,
                        metalness: 0.1
                    })
                );

            windowMesh.position.set(
                -2.7 + col * 1.8,
                2.1 + row * 1.65,
                -3.56
            );

            group.add(
                windowMesh
            );
        }
    }

    /* DOOR */

    const door =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                1.45,
                2.45,
                0.18
            ),

            new THREE.MeshStandardMaterial({
                color:
                    space.status === "locked"
                        ? 0x77736b
                        : space.color,

                roughness: 0.45
            })
        );

    door.position.set(
        0,
        1.22,
        -3.62
    );

    group.add(door);

    /* LABEL */

    const canvas =
        document.createElement("canvas");

    canvas.width = 700;
    canvas.height = 180;

    const ctx =
        canvas.getContext("2d");

    ctx.fillStyle =
        "rgba(255,253,248,.96)";

    ctx.roundRect(
        10,
        10,
        680,
        160,
        22
    );

    ctx.fill();

    ctx.fillStyle =
        "#20231f";

    ctx.font =
        "700 34px Manrope";

    ctx.textAlign =
        "center";

    ctx.fillText(
        space.short,
        350,
        78
    );

    ctx.fillStyle =
        "#77786f";

    ctx.font =
        "500 20px DM Mono";

    ctx.fillText(
        space.status === "locked"
            ? "LOCKED"
            : space.status === "current"
                ? "CURRENT SPACE"
                : "COMPLETED",

        350,
        118
    );

    const label =
        new THREE.Mesh(
            new THREE.PlaneGeometry(
                7,
                1.8
            ),

            new THREE.MeshBasicMaterial({
                map:
                    new THREE.CanvasTexture(
                        canvas
                    ),

                transparent: true,
                depthWrite: false
            })
        );

    label.position.set(
        0,
        8.3,
        0
    );

    label.rotation.y =
        Math.PI;

    group.add(label);

    world.add(group);

    buildingMeshes.push(group);

    clickable.push(
        main,
        door,
        roof
    );

    /* CURRENT SPACE MARKER */

    if (
        space.status ===
        "current"
    ) {

        const ring =
            new THREE.Mesh(
                new THREE.RingGeometry(
                    4.7,
                    5.15,
                    48
                ),

                new THREE.MeshBasicMaterial({
                    color: COLORS.terra,
                    transparent: true,
                    opacity: 0.48,
                    side: THREE.DoubleSide
                })
            );

        ring.rotation.x =
            -Math.PI / 2;

        ring.position.y =
            0.06;

        group.add(ring);

        const beacon =
            new THREE.Mesh(
                new THREE.CylinderGeometry(
                    0.12,
                    0.12,
                    3,
                    12
                ),

                new THREE.MeshBasicMaterial({
                    color: COLORS.terra
                })
            );

        beacon.position.y = 9;

        group.add(beacon);
    }
}

spaces.forEach(
    makeBuilding
);

/* =========================================================
   CENTRAL PLAZA
   ========================================================= */

const plaza =
    new THREE.Mesh(
        new THREE.CylinderGeometry(
            6,
            6,
            0.16,
            48
        ),

        new THREE.MeshStandardMaterial({
            color: 0xd8cebc,
            roughness: 1
        })
    );

plaza.position.set(
    0,
    0.08,
    0
);

plaza.receiveShadow = true;

world.add(plaza);

/* =========================================================
   MINDSPACE CENTRAL TOWER
   ========================================================= */

const pillar =
    new THREE.Mesh(
        new THREE.CylinderGeometry(
            1.5,
            1.8,
            4,
            32
        ),

        new THREE.MeshStandardMaterial({
            color: COLORS.terra,
            roughness: 0.55
        })
    );

pillar.position.set(
    0,
    2,
    0
);

pillar.castShadow = true;

world.add(pillar);

/* =========================================================
   RAYCASTING
   ========================================================= */

const raycaster =
    new THREE.Raycaster();

const center =
    new THREE.Vector2(0, 0);

/* =========================================================
   FIND BUILDING
   ========================================================= */

function findSpaceFromObject(
    object
) {

    while (object) {

        if (
            object.userData &&
            object.userData.space
        ) {

            return object.userData.space;
        }

        object =
            object.parent;
    }

    return null;
}

/* =========================================================
   MOUSE LOOK / TARGET
   ========================================================= */

document.addEventListener(
    "mousemove",
    () => {

        raycaster.setFromCamera(
            center,
            camera
        );

        const hits =
            raycaster.intersectObjects(
                clickable,
                false
            );

        targetSpace =
            hits.length
                ? findSpaceFromObject(
                    hits[0].object
                )
                : null;

        const hint =
            document.getElementById(
                "reticleHint"
            );

        if (!hint) return;

        if (targetSpace) {

            hint.classList.remove(
                "hidden"
            );

            if (
                targetSpace.status ===
                "locked"
            ) {

                hint.innerHTML =
                    "LOCKED — COMPLETE PREVIOUS SPACE";

            } else {

                hint.innerHTML =
                    "Press <b>E</b> to enter";
            }

        } else {

            hint.classList.add(
                "hidden"
            );
        }
    }
);

/* =========================================================
   INTERACTION
   ========================================================= */

function interact() {

    if (!targetSpace) {

        toast(
            "Look at a learning space first."
        );

        return;
    }

    if (
        targetSpace.status ===
        "locked"
    ) {

        toast(
            "This space is locked. Complete the previous checkpoint first."
        );

        return;
    }

    openSpace(
        targetSpace
    );
}

/* =========================================================
   KEYBOARD
   ========================================================= */

window.addEventListener(
    "keydown",
    (event) => {

        if (
            event.code ===
            "KeyE"
        ) {

            interact();
        }

        if (
            event.code ===
            "KeyM"
        ) {

            toggleMap();
        }

        if (
            event.code ===
            "Escape"
        ) {

            closePanels();

            if (
                controls.isLocked
            ) {

                controls.unlock();
            }
        }
    }
);

/* =========================================================
   START
   ========================================================= */

document.getElementById(
    "startBtn"
).onclick = () => {

    document
        .getElementById(
            "startScreen"
        )
        .classList.add(
            "hidden"
        );

    controls.lock();

    toast(
        "Welcome to MINDSPACE. Walk to the orange Functions Lab."
    );
};

/* =========================================================
   PANEL
   ========================================================= */

function openSpace(
    space
) {

    currentSpace =
        space;

    controls.unlock();

    document.getElementById(
        "panelTitle"
    ).textContent =
        space.name;

    document.getElementById(
        "panelIntro"
    ).textContent =
        space.intro;

    document.getElementById(
        "panelKicker"
    ).textContent =
        space.status === "current"
            ? "CURRENT LEARNING SPACE"
            : "LEARNING SPACE";

    document.getElementById(
        "spacePanel"
    ).classList.remove(
        "hidden"
    );

    document
        .querySelectorAll(
            ".tab"
        )
        .forEach(
            (tab, index) => {

                tab.classList.toggle(
                    "active",
                    index === 0
                );
            }
        );

    renderTab(
        "learn"
    );
}

/* =========================================================
   CLOSE PANELS
   ========================================================= */

function closePanels() {

    document
        .getElementById(
            "spacePanel"
        )
        .classList.add(
            "hidden"
        );

    document
        .getElementById(
            "mapPanel"
        )
        .classList.add(
            "hidden"
        );
}

document.getElementById(
    "closePanel"
).onclick =
    closePanels;

document.getElementById(
    "closeMap"
).onclick =
    closePanels;

/* =========================================================
   TABS
   ========================================================= */

document
    .querySelectorAll(
        ".tab"
    )
    .forEach(
        (tab) => {

            tab.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".tab"
                        )
                        .forEach(
                            (t) =>
                                t.classList.remove(
                                    "active"
                                )
                        );

                    tab.classList.add(
                        "active"
                    );

                    renderTab(
                        tab.dataset.tab
                    );
                }
            );
        }
    );

/* =========================================================
   TAB CONTENT
   ========================================================= */

function renderTab(
    tab
) {

    if (!currentSpace)
        return;

    const content =
        document.getElementById(
            "tabContent"
        );

    /* LEARN */

    if (
        tab ===
        "learn"
    ) {

        content.innerHTML = `
            <div class="lesson">
                ${currentSpace.lesson}
            </div>

            <div class="concept">
                ${currentSpace.concepts
                    .map(
                        (concept) => `
                            <div>
                                <b>${concept[0]}</b>
                                <span>${concept[1]}</span>
                            </div>
                        `
                    )
                    .join("")}
            </div>

            <button
                class="action"
                id="continueBtn"
            >
                Continue lesson →
            </button>
        `;

        document.getElementById(
            "continueBtn"
        ).onclick = () => {

            toast(
                "Lesson checkpoint reached. Try Practice."
            );
        };
    }

    /* EXPLORE */

    if (
        tab ===
        "explore"
    ) {

        content.innerHTML = `
            <div class="ai">
                <b>SPATIAL OBJECT:</b>
                You are inside
                <strong>
                    ${currentSpace.name}
                </strong>.
                In the full MINDSPACE experience,
                each concept becomes an interactive
                object inside this room.
            </div>

            <div class="concept">
                ${currentSpace.concepts
                    .map(
                        (concept, index) => `
                            <div>
                                <b>
                                    Object ${index + 1}
                                </b>
                                <span>
                                    ${concept[0]}
                                </span>
                            </div>
                        `
                    )
                    .join("")}
            </div>

            <button
                class="action"
                onclick="toast('Interactive concept activated.')"
            >
                Inspect concept →
            </button>
        `;
    }

    /* PRACTICE */

    if (
        tab ===
        "practice"
    ) {

        content.innerHTML = `
            <div class="quiz-q">
                Quick Check:
                What is the main purpose
                of this learning space?
            </div>

            <div class="answers">

                <button
                    class="answer"
                    data-correct="1"
                >
                    Understand the concept
                    and apply it in a small task.
                </button>

                <button
                    class="answer"
                >
                    Skip directly
                    to the final assessment.
                </button>

                <button
                    class="answer"
                >
                    Only memorize definitions.
                </button>

            </div>

            <p
                id="quizFeedback"
                style="
                    color:#77786f;
                    font-size:11px;
                "
            ></p>
        `;

        content
            .querySelectorAll(
                ".answer"
            )
            .forEach(
                (button) => {

                    button.onclick = () => {

                        const correct =
                            button.dataset.correct ===
                            "1";

                        button.classList.add(
                            correct
                                ? "correct"
                                : "wrong"
                        );

                        const feedback =
                            document.getElementById(
                                "quizFeedback"
                            );

                        feedback.textContent =
                            correct
                                ? "Correct. Mastery is based on understanding + practice + application."
                                : "Not quite. MINDSPACE wants you to understand and apply, not just complete.";

                        if (
                            correct &&
                            currentSpace.status ===
                                "current" &&
                            !quizDone
                        ) {

                            quizDone =
                                true;

                            setTimeout(
                                unlockNext,
                                700
                            );
                        }
                    };
                }
            );
    }

    /* AI GUIDE */

    if (
        tab ===
        "ai"
    ) {

        content.innerHTML = `
            <div class="ai">

                <b>MINDSPACE AI:</b>

                You are currently learning

                <strong>
                    ${currentSpace.name}
                </strong>.

                <br><br>

                Based on your roadmap,
                your next meaningful action is
                to understand the concept,
                practice it once,
                then pass the checkpoint.

                <br><br>

                If you get stuck,
                ask me "why?"
                instead of jumping ahead.

            </div>

            <br>

            <button
                class="action"
                onclick="
                    toast(
                        'AI recommendation: finish this checkpoint, then move to Data Structures.'
                    )
                "
            >
                What should I learn next? →
            </button>
        `;
    }
}

/* =========================================================
   UNLOCK NEXT SPACE
   ========================================================= */

function unlockNext() {

    const next =
        spaces.find(
            (space) =>
                space.id ===
                "data"
        );

    if (
        next &&
        next.status ===
            "locked"
    ) {

        next.status =
            "current";

        progress =
            3;

        document.getElementById(
            "progressText"
        ).textContent =
            `${progress} / 6 spaces`;

        document.getElementById(
            "progressBar"
        ).style.width =
            `${Math.round(
                progress / 6 * 100
            )}%`;

        toast(
            "Checkpoint passed. Data Structures Library is now unlocked."
        );

        setTimeout(
            () => {
                window.location.reload();
            },
            1100
        );
    }
}

/* =========================================================
   MAP
   ========================================================= */

function toggleMap() {

    const panel =
        document.getElementById(
            "mapPanel"
        );

    panel.classList.toggle(
        "hidden"
    );

    if (
        !panel.classList.contains(
            "hidden"
        )
    ) {

        controls.unlock();

        const list =
            document.getElementById(
                "mapList"
            );

        list.innerHTML =
            spaces
                .map(
                    (space, index) => {

                        const state =
                            space.status ===
                                "done"
                                ? "done"
                                : space.status ===
                                    "current"
                                    ? "current"
                                    : space.status ===
                                        "open"
                                        ? "done"
                                        : "";

                        const description =
                            space.status ===
                                "locked"
                                ? "Locked"
                                : space.status ===
                                    "current"
                                    ? "Current learning space"
                                    : space.status ===
                                        "done"
                                        ? "Completed"
                                        : "AI support space";

                        return `
                            <div class="map-node">

                                <i
                                    class="dot ${state}"
                                ></i>

                                <div>

                                    <b>
                                        ${index + 1}.
                                        ${space.name}
                                    </b>

                                    <small>
                                        ${description}
                                    </small>

                                </div>

                            </div>
                        `;
                    }
                )
                .join("");
    }
}

/* =========================================================
   TOAST
   ========================================================= */

function toast(
    message
) {

    const element =
        document.getElementById(
            "toast"
        );

    element.textContent =
        message;

    element.style.opacity =
        "1";

    element.style.transform =
        "translateY(0)";

    clearTimeout(
        window.toastTimer
    );

    window.toastTimer =
        setTimeout(
            () => {

                element.style.opacity =
                    "0";

                element.style.transform =
                    "translateY(8px)";

            },
            2600
        );
}

/* =========================================================
   WASD
   ========================================================= */

[
    "KeyW",
    "KeyA",
    "KeyS",
    "KeyD"
].forEach(
    (code) => {

        window.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.code ===
                    code
                ) {

                    keys[
                        code
                            .slice(-1)
                            .toLowerCase()
                    ] = true;
                }
            }
        );

        window.addEventListener(
            "keyup",
            (event) => {

                if (
                    event.code ===
                    code
                ) {

                    keys[
                        code
                            .slice(-1)
                            .toLowerCase()
                    ] = false;
                }
            }
        );
    }
);

/* =========================================================
   MOVEMENT + ANIMATION
   ========================================================= */

const clock =
    new THREE.Clock();

function animate() {

    requestAnimationFrame(
        animate
    );

    const delta =
        Math.min(
            clock.getDelta(),
            0.05
        );

    if (
        controls.isLocked
    ) {

        const speed =
            8 * delta;

        if (keys.w)
            controls.moveForward(
                speed
            );

        if (keys.s)
            controls.moveForward(
                -speed
            );

        if (keys.a)
            controls.moveRight(
                -speed
            );

        if (keys.d)
            controls.moveRight(
                speed
            );

        /* KEEP PLAYER AT EYE HEIGHT */

        camera.position.y =
            2.2;

        /* CAMPUS BOUNDARIES */

        camera.position.x =
            Math.max(
                -36,
                Math.min(
                    36,
                    camera.position.x
                )
            );

        camera.position.z =
            Math.max(
                -34,
                Math.min(
                    30,
                    camera.position.z
                )
            );
    }

    /* CURRENT BUILDING BEACON */

    const currentBuilding =
        buildingMeshes.find(
            (building) =>
                building.userData.space?.status ===
                "current"
        );

    if (
        currentBuilding
    ) {

        const beacon =
            currentBuilding.children.find(
                (child) =>
                    child.geometry?.type ===
                    "CylinderGeometry"
            );

        if (
            beacon
        ) {

            beacon.position.y =
                9 +
                Math.sin(
                    performance.now() *
                    0.003
                ) *
                0.35;
        }
    }

    renderer.render(
        scene,
        camera
    );
}

animate();

/* =========================================================
   RESIZE
   ========================================================= */

window.addEventListener(
    "resize",
    () => {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );
    }
);

/* =========================================================
   INITIAL PROGRESS
   ========================================================= */

document.getElementById(
    "progressText"
).textContent =
    `${progress} / 6 spaces`;

document.getElementById(
    "progressBar"
).style.width =
    `${Math.round(
        progress / 6 * 100
    )}%`;
