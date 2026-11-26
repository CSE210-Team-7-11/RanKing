type LeaderboardEntry = {
    seed: number;
    player: string;
    score: number;
};

const STORAGE_KEY = "ranking-sudoku-leaderboard";
const MS_PER_DAY = 86_400_000;

const usernameInput = document.querySelector<HTMLInputElement>("#username");
const leaderboardBody = document.querySelector<HTMLTableSectionElement>("#leaderboard tbody");

if (!usernameInput || !leaderboardBody) {
    throw new Error("Main page elements are missing");
}

const username = usernameInput;
const tbody = leaderboardBody;

function getDailySeed(): number {
    return Math.floor(Date.now() / MS_PER_DAY);
}

function currentPlayer(): string {
    const name = username.value.trim();
    return name.length > 0 ? name : "Player";
}

function loadEntries(): LeaderboardEntry[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            return [];
        }
        const parsed: unknown = JSON.parse(raw);
        if (!Array.isArray(parsed)) {
            return [];
        }
        return parsed.filter(
            (entry): entry is LeaderboardEntry =>
                typeof entry === "object" &&
                entry !== null &&
                typeof (entry as LeaderboardEntry).seed === "number" &&
                typeof (entry as LeaderboardEntry).player === "string" &&
                typeof (entry as LeaderboardEntry).score === "number",
        );
    } catch {
        return [];
    }
}

function saveEntries(entries: LeaderboardEntry[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function renderLeaderboard(): void {
    const seed = getDailySeed();
    const todays = loadEntries()
        .filter((entry) => entry.seed === seed)
        .sort((a, b) => a.score - b.score);

    tbody.replaceChildren();

    if (todays.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");
        cell.colSpan = 2;
        cell.textContent = "No scores yet today.";
        row.append(cell);
        tbody.append(row);
        return;
    }

    for (const entry of todays) {
        const row = document.createElement("tr");
        const playerCell = document.createElement("td");
        const scoreCell = document.createElement("td");
        playerCell.textContent = entry.player;
        scoreCell.textContent = `${entry.score}s`;
        row.append(playerCell, scoreCell);
        tbody.append(row);
    }
}

function recordScore(seed: number, scoreSeconds: number): void {
    const entries = loadEntries();
    entries.push({
        seed,
        player: currentPlayer(),
        score: scoreSeconds,
    });
    saveEntries(entries);
    renderLeaderboard();
}

window.addEventListener("message", (event: MessageEvent) => {
    if (event.origin !== window.location.origin) {
        return;
    }
    const data = event.data;
    if (
        typeof data !== "object" ||
        data === null ||
        data.type !== "sudoku-solved" ||
        typeof data.seed !== "number" ||
        typeof data.scoreSeconds !== "number"
    ) {
        return;
    }
    recordScore(data.seed, data.scoreSeconds);
});

renderLeaderboard();
