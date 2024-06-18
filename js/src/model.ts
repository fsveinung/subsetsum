
export interface ITestCase {
    data: number[],
    target: number
}
  
export interface ITestResult {
    case: ITestCase;
    matches: number[],
    time: number
}