import './style.css'
import { getFirstMatch } from './matcher.ts'
import { ITestCase, ITestResult } from './model.ts';
import { Data } from './data.ts';

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
    Data.createRandomData(10), Data.createRandomData(15),
    Data.createRandomData(20), 
    Data.createRandomData(22), 
    Data.createRandomData(24), 
    Data.createRandomData(26)
  ]

  await runTests(testCases);

}

function firstMatchAsync(test: ITestCase): Promise<ITestResult> {
  return new Promise<ITestResult>((resolve) => {
    const startTime = new Date();  
    const result = getFirstMatch(test.data, test.target);
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

  logResult({ case: test, matches: [], time: 0 });
  setBusy();

  await pause(50);

  const x = await firstMatchAsync(test);

  updateLastLog(x.matches, x.time);

  if (list.length > index + 1) {

    setTimeout( () => runTests(list, index+1), 50);
  
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
  tr.appendChild(newElement("td", Data.formatDecimal(target)));
  tr.appendChild(newElement("td", matches?.join(", "), "datacell"));
  tr.appendChild(newElement("td", time + " ms."));
  outlet?.appendChild(tr);
  tr.scrollIntoView();
}

function updateLastLog(matches: number[], time: number) {
  const outlet = document.querySelector<HTMLElement>('#outlet');
  if (!outlet) return;
  const tr = <HTMLTableRowElement>outlet.lastChild;
  if (!tr) return;
  tr.cells[2].innerText = matches.map(v => Data.formatDecimal(v))?.join(", ");
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
  const outlet = document.querySelector<HTMLElement>('#outlet');
  if (outlet) {
    outlet.innerHTML = "";
  }
}

function setBusy(busy = true) {
  let target = document.querySelector<HTMLElement>('#outlet tr:last-of-type .datacell');
  if (!target) {
    target = document.querySelector<HTMLElement>('#outlet');
  }
  if (busy) {
    target?.classList.add("spinner");
    if (button) button.disabled = true;
    if (spinner) spinner.classList.remove("spinner");
    spinner = target;
  } else {
    if (spinner != null) { 
      target = spinner;
    }
    target?.classList.remove("spinner");
    if (button) button.disabled = false;
  }
}



let spinner: HTMLElement | null = null;
const button = document.querySelector<HTMLButtonElement>('#run');
button?.addEventListener('click', async () => await runAllTests());
