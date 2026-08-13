const display = document.querySelector("#display");
const expression = document.querySelector("#expression");
let current = "0";
let stored = null;
let operator = null;
let waitingForOperand = false;

function render() {
  display.value = current;
  display.textContent = current;
  expression.textContent = stored !== null && operator ? `${stored} ${operator}` : "Ready when you are";
}

function inputDigit(digit) {
  if (waitingForOperand || current === "Error") {
    current = digit;
    waitingForOperand = false;
  } else {
    current = current === "0" ? digit : current + digit;
  }
  render();
}

function inputDecimal() {
  if (waitingForOperand || current === "Error") {
    current = "0.";
    waitingForOperand = false;
  } else if (!current.includes(".")) {
    current += ".";
  }
  render();
}

function calculate(first, second, selectedOperator) {
  const left = Number(first);
  const right = Number(second);
  if (selectedOperator === "+") return left + right;
  if (selectedOperator === "-") return left - right;
  if (selectedOperator === "*") return left * right;
  if (selectedOperator === "/") return right === 0 ? null : left / right;
  return right;
}

function chooseOperator(nextOperator) {
  if (current === "Error") return;
  if (operator && !waitingForOperand) {
    const result = calculate(stored, current, operator);
    current = result === null ? "Error" : String(Number(result.toFixed(10)));
    stored = current === "Error" ? null : Number(current);
  } else {
    stored = Number(current);
  }
  operator = nextOperator;
  waitingForOperand = true;
  render();
}

function solve() {
  if (!operator || stored === null || current === "Error") return;
  const result = calculate(stored, current, operator);
  expression.textContent = `${stored} ${operator} ${current} =`;
  current = result === null ? "Error" : String(Number(result.toFixed(10)));
  stored = null;
  operator = null;
  waitingForOperand = true;
  display.textContent = current;
}

function clear() {
  current = "0";
  stored = null;
  operator = null;
  waitingForOperand = false;
  render();
}

function toggleSign() {
  if (current !== "0" && current !== "Error") current = current.startsWith("-") ? current.slice(1) : `-${current}`;
  render();
}

function percent() {
  if (current !== "Error") current = String(Number(current) / 100);
  render();
}

document.querySelectorAll(".key").forEach((button) => {
  button.addEventListener("click", () => {
    const { action, value } = button.dataset;
    if (/^\d$/.test(value || "")) inputDigit(value);
    else if (action === "decimal") inputDecimal();
    else if (action === "equals") solve();
    else if (action === "clear") clear();
    else if (action === "sign") toggleSign();
    else if (action === "percent") percent();
    else if (value) chooseOperator(value);
  });
});

document.addEventListener("keydown", (event) => {
  if (/^\d$/.test(event.key)) inputDigit(event.key);
  else if (event.key === ".") inputDecimal();
  else if (["+", "-", "*", "/"].includes(event.key)) chooseOperator(event.key);
  else if (event.key === "Enter" || event.key === "=") solve();
  else if (event.key === "Escape") clear();
  else if (event.key === "%") percent();
  else return;
  event.preventDefault();
});

render();