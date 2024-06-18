import { ITestCase } from "./model.ts";

export class Data {

    static formatDecimal(dec: number): string {
      const value = Number(dec);
      return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })  
    }

    static createRandomData(items: number): ITestCase {
        const result: ITestCase = { data: [], target: 0 };
        let sum = 0;
        for (let i = 0; i <items; i++) {
            const value = parseFloat((Data.randomStdNormalDistribution(100, 120000, 5)).toFixed(2));
            result.data.push(value);
            sum += value;
        }
        result.target = sum;
        return result;
    }
      
      
    static randomStdNormalDistribution(min: number, max:number, skew: number) {
        let u = 0, v = 0;
        while(u === 0) u = Math.random() //Converting [0,1) to (0,1)
        while(v === 0) v = Math.random()
        let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v )
        
        num = num / 10.0 + 0.5 // Translate to 0 -> 1
        if (num > 1 || num < 0) 
          num = Data.randomStdNormalDistribution(min, max, skew) // resample between 0 and 1 if out of range
        
        else{
          num = Math.pow(num, skew) // Skew
          num *= max - min // Stretch to fill range
          num += min // offset to min
        }
        return num
      }

}