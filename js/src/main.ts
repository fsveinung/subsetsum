import './style.css'
import { GetFirstMatch } from './matcher.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Subset sum problem</h1>
    <div class="card">
      <button id="run" type="button">Run test</button>
    </div>
    <p class="read-the-docs">
      Click 'Run test' to run the code and check the console for output
    </p>
    <ul id="outlet">
    </ul>
  </div>
`

const button = document.querySelector<HTMLButtonElement>('#run');
button?.addEventListener('click', runAllTests);

function runAllTests() {

  const testCases = [
    { data: [2, 3, 5], target: 8 },
    { data: [-2, 3, 6, -1, -2, -3, 5], target: -7},
    { data: [0.35, 0.45, 0.60, 0.1, 0.15, 0.20, 1.4, 0.5, 0.3, 0.8, 2.2, 0.1, 0.7, 0.8 ], target: 7 },
    { data: [ 0.35, 0.45, 0.60, 0.1, 0.15, 0.20, 1.4, 0.5, 0.3, 0.8, 2.2, 0.1, 0.7, 0.8, 0.5, 0.15, 0.30, 0.5, 0.7, 0.3, 0.85, 0.95, 1.25, 1.45 ], target: 14 },
    hardCase(25, 9999)
  ]

  testCases.forEach(test => {
    runSingleTest(test.data, test.target);
  });

}

function hardCase(items: number, target: number): { data: number[], target: number } {
  const result: { data: number[], target:  number } = { data: [], target: target };
  for (let i = 0; i <items; i++) {
    result.data.push(i + 1);
  }
  return result;
}

function runSingleTest(data: number[], target: number) {
  logText(`Find match for ${target} in ${data.length} items`);
  const startTime = new Date();  
  const result = GetFirstMatch(data, target);
  const endTime = new Date();
  logText("Time taken:" + (endTime-startTime));
  console.table(result);
}

function logText(comment: string) {
  const outlet = document.querySelector<HTMLButtonElement>('#outlet');
  const el = document.createElement("li");
  el.innerText = comment;
  outlet?.appendChild(el);
}