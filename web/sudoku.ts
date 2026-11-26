import { generate, getUniqueSolution, isUniqueSolution } from "sudoku-core";

type Board = Array<number | null>;

const MS_PER_DAY = 86_400_000;

const boardElement = document.querySelector<HTMLDivElement>("#board");
const statusElement = document.querySelector<HTMLParagraphElement>("#status");
const newGameButton = document.querySelector<HTMLButtonElement>("#new-game");
const solveButton = document.querySelector<HTMLButtonElement>("#solve");

if (!boardElement || !statusElement || !newGameButton || !solveButton) {
    throw new Error("Sudoku page elements are missing");
}

const board = boardElement;
const status = statusElement;

let puzzle: Board = [];
let solution: number[] = [];
let dailySeed = 0;
let startedAt = 0;
let scored = false;

/** UTC day number — same seed for everyone until the next UTC midnight. */
function getDailySeed(): number {
    return Math.floor(Date.now() / MS_PER_DAY);
}

function renderBoard(): void {
    board.replaceChildren();

    puzzle.forEach((given, index) => {
        const input = document.createElement("input");
        input.className = given === null ? "cell" : "cell given";
        input.type = "text";
        input.inputMode = "numeric";
        input.maxLength = 1;
        input.setAttribute("aria-label", `Row ${Math.floor(index / 9) + 1}, column ${(index % 9) + 1}`);
        input.setAttribute("role", "gridcell");
        input.dataset.index = String(index);

        if (given !== null) {
            input.value = String(given);
            input.readOnly = true;
        } else {
            input.addEventListener("input", handleEntry);
        }

        board.append(input);
    });
}

function elapsedSeconds(): number {
    return Math.max(0, Math.round((Date.now() - startedAt) / 1000));
}

function reportSolve(): void {
    if (scored) {
        return;
    }
    scored = true;
    const scoreSeconds = elapsedSeconds();
    status.textContent = `Puzzle complete in ${scoreSeconds}s!`;
    window.parent.postMessage(
        { type: "sudoku-solved", seed: dailySeed, scoreSeconds },
        window.location.origin,
    );
}

function checkComplete(): void {
    if (!puzzle.every((cell) => cell !== null) || !isUniqueSolution(puzzle)) {
        return;
    }
    const solved = getUniqueSolution(puzzle);
    if (solved !== null) {
        reportSolve();
    }
}

function handleEntry(event: Event): void {
    const input = event.target;
    if (!(input instanceof HTMLInputElement)) {
        return;
    }

    const index = Number(input.dataset.index);
    const digit = /^\d$/.test(input.value) ? Number(input.value) : null;
    input.value = digit === null ? "" : String(digit);
    puzzle[index] = digit;

    if (digit !== null && solution[index] !== digit) {
        status.textContent = "That number does not belong there.";
        return;
    }

    status.textContent = "";
    checkComplete();
}

function fillSolution(): void {
    if (solution.length !== 81 || scored) {
        return;
    }

    puzzle = solution.slice();
    const cells = board.querySelectorAll<HTMLInputElement>("input.cell");
    cells.forEach((input, index) => {
        input.value = String(solution[index]);
        if (!input.readOnly) {
            input.readOnly = true;
        }
    });
    reportSolve();
}

function startNewGame(): void {
    dailySeed = getDailySeed();
    try {
        puzzle = generate("L3", { seed: dailySeed });
        const solved = getUniqueSolution(puzzle);
        solution = solved ?? [];
        startedAt = Date.now();
        scored = false;
        status.textContent = "";
        renderBoard();
    } catch (error) {
        console.error("Unable to generate a Sudoku puzzle", error);
        status.textContent = "Could not create a puzzle. Try again.";
    }
}

newGameButton.addEventListener("click", startNewGame);
solveButton.addEventListener("click", fillSolution);
startNewGame();
