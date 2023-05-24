import './style.css'
import { GetFirstMatch } from './matcher.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Subset sum problem</h1>
    <div class="card">
      <button id="run" type="button" class="c2a">Run test</button>
    </div>
    <ul id="outlet">
    </ul>
  </div>
`

const button = document.querySelector<HTMLButtonElement>('#run');
button?.addEventListener('click', async () => await runAllTests());

async function runAllTests() {

  clear();

  const testCases: ITestCase[] = [
    { data: [2, 3, 5], target: 8 },
    { data: [-2, 3, 6, -1, -2, -3, 5], target: -7},
    { data: [0.35, 0.45, 0.60, 0.1, 0.15, 0.20, 1.4, 0.5, 0.3, 0.8, 2.2, 0.1, 0.7, 0.8 ], target: 7 },
    { data: [ 0.35, 0.45, 0.60, 0.1, 0.15, 0.20, 1.4, 0.5, 0.3, 0.8, 2.2, 0.1, 0.7, 0.8, 0.5, 0.15, 0.30, 0.5, 0.7, 0.3, 0.85, 0.95, 1.25, 1.45 ], target: 14 },
    hardCase(25, 9999)
  ]

  runNext(testCases);

}


function runNext(list: ITestCase[], index = 0) {
  const test = list[index];
  const p = new Promise<ITestResult>((resolve) => {
    const startTime = new Date();  
    const result = GetFirstMatch(test.data, test.target);
    const endTime = new Date();
    const timeTaken: any = (<any>endTime - <any>startTime);
    resolve({ case: test, matches: result, time: timeTaken });
  });

  p.then( (x: ITestResult) => {
    logResult(x);
    if (list.length > index + 1) {
      setTimeout( () => {
        runNext(list, index+1);
      },50);
    }
  });
}

function logResult(res: ITestResult) {
  logText(`${res.case.data.length} items in ${res.time} time`);
}

function logText(comment: string) {
  const outlet = document.querySelector<HTMLButtonElement>('#outlet');
  const el = document.createElement("li");
  el.innerText = comment;
  outlet?.appendChild(el);
}

function clear() {
  const outlet = document.querySelector<HTMLButtonElement>('#outlet');
  if (outlet) {
    outlet.innerHTML = "";
  }
}

function hardCase(items: number, target: number): ITestCase {
  const result: ITestCase = { data: [], target: target };
  for (let i = 0; i <items; i++) {
    result.data.push(i + 1);
  }
  return result;
}

interface ITestCase {
  data: number[],
  target: number
}

interface ITestResult {
  case: ITestCase;
  matches: number[],
  time: number
}