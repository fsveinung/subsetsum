import './style.css'
import { GetFirstMatch } from './matcher.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Subset sum problem</h1>
    <div class="card">
      <button id="run" type="button" class="c2a">Run tests</button>
    </div>
    <table>
      <thead>
        <tr><th>Items<th>Target<th>Matches<th>Time</tr>
      </thead>
      <tbody id="outlet">
      </tbody>
    </table>    
  </div>
`

async function runAllTests() {

  clear();

  const testCases: ITestCase[] = [
    { data: [2, 3, 5], target: 8 },
    { data: [-2, 3, 6, -1, -2, -3, 5], target: -7},
    { data: [0.35, 0.45, 0.60, 0.1, 0.15, 0.20, 1.4, 0.5, 0.3, 0.8, 2.2, 0.1, 0.7, 0.8 ], target: 7 },
    { data: [ 0.35, 0.45, 0.60, 0.1, 0.15, 0.20, 1.4, 0.5, 0.3, 0.8, 2.2, 0.1, 0.7, 0.8, 0.5, 0.15, 0.30, 0.5, 0.7, 0.3, 0.85, 0.95, 1.25, 1.45 ], target: 14 },
    hardCase(25)
  ]

  await runTests(testCases);

}

function firstMatchAsync(test: ITestCase): Promise<ITestResult> {
  return new Promise<ITestResult>((resolve) => {
    const startTime = new Date();  
    const result = GetFirstMatch(test.data, test.target);
    resolve({ case: test, matches: result, time: (<any>(new Date()) - <any>startTime) });
  });  
}

function pause(ms: number): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, ms);
  })
}

async function runTests(list: ITestCase[], index = 0) {
  
  const test = list[index];

  setBusy();
  logResult({ case: test, matches: [], time: 0 });

  await pause(50);

  const x = await firstMatchAsync(test);

  updateLastLog(x.matches, x.time);

  if (list.length > index + 1) {

    await pause(100);
    await runTests(list, index+1);
  
  } else {

    setBusy(false);
  }
  
}

function logResult(res: ITestResult) {
  logRow(res.case.data.length, res.case.target, res.matches, res.time);
}

function logRow(items: number, target: number, matches: number[], time: number) {
  const outlet = document.querySelector<HTMLTableElement>('#outlet');
  const tr = newElement("tr");
  tr.appendChild(newElement("td", items));
  tr.appendChild(newElement("td", target.toFixed(2)));
  tr.appendChild(newElement("td", matches?.join(", "), "datacell"));
  tr.appendChild(newElement("td", time + " ms."));
  outlet?.appendChild(tr);
}

function updateLastLog(matches: number[], time: number) {
  const outlet = document.querySelector<HTMLElement>('#outlet');
  if (!outlet) return;
  const tr = <HTMLTableRowElement>outlet.lastChild;
  if (!tr) return;
  tr.cells[2].innerText = matches?.join(", ");
  tr.cells[3].innerText = time.toFixed(0) + " ms.";
}

function newElement(type: string, text: any = undefined, cls = "" ): HTMLElement {
  const el = document.createElement(type);
  if (text || text === 0) {
    el.innerText = text;
  }
  if (cls) {
    el.classList.add(cls);
  }
  return el;
} 

function clear() {
  const outlet = document.querySelector<HTMLButtonElement>('#outlet');
  if (outlet) {
    outlet.innerHTML = "";
  }
}

function setBusy(busy = true) {
  const outlet = document.querySelector<HTMLButtonElement>('#outlet');
  if (busy) {
    outlet?.classList.add("spinner");
    if (button) button.disabled = true;
  } else {
    outlet?.classList.remove("spinner");
    if (button) button.disabled = false;
  }
}

function hardCase(items: number): ITestCase {
  const result: ITestCase = { data: [], target: 0 };
  let sum = 0;
  for (let i = 0; i <items; i++) {
    const value = parseFloat((Math.random() * 2000000).toFixed(2));
    result.data.push(value);
    sum += value;
  }
  result.target = sum;
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

const button = document.querySelector<HTMLButtonElement>('#run');
button?.addEventListener('click', async () => await runAllTests());
