import { generate, getUniqueSolution, isUniqueSolution } from "sudoku-core";

type Board = Array<number | null>;

const boardElement = document.querySelector<HTMLDivElement>("#board");
const statusElement = document.querySelector<HTMLParagraphElement>("#status");
const newGameButton = document.querySelector<HTMLButtonElement>("#new-game");

if (!boardElement || !statusElement || !newGameButton) {
    throw new Error("Sudoku page elements are missing");
}

const board = boardElement;
const status = statusElement;

let puzzle: Board = [];
let solution: number[] = [];
let puzzleNumber = 0;

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

function handleEntry(event: Event): void {
    const input = event.target;
    if (!(input instanceof HTMLInputElement)) {
        return;
    }

    const index = Number(input.dataset.index);
    const digit = /^\d$/.test(input.value) ? Number(input.value) : null;
    input.value = digit === null ? "" : String(digit);
    puzzle[index] = digit;

    if (puzzle.every((cell) => cell !== null) && isUniqueSolution(puzzle)) {
        const solved = getUniqueSolution(puzzle);
        if (solved !== null) {
            status.textContent = "Puzzle complete!";
        }
    } else if (digit !== null && solution[index] !== digit) {
        status.textContent = "That number does not belong there.";
    } else {
        status.textContent = "";
    }
}

function startNewGame(): void {
    const seed = Date.now() + puzzleNumber++;
    try {
        puzzle = generate("L3", { seed });
        const solved = getUniqueSolution(puzzle);
        solution = solved ?? [];
        status.textContent = "";
        renderBoard();
    } catch (error) {
        console.error("Unable to generate a Sudoku puzzle", error);
        status.textContent = "Could not create a puzzle. Try again.";
    }
}

newGameButton.addEventListener("click", startNewGame);
startNewGame();
