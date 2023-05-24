export function GetFirstMatch(list: number[], target: number): Array<number> {
    const comboCount = Math.pow(2, list.length) - 1;
    const absoluteTarget = Math.abs(target);
    for (let i = 1; i < comboCount + 1; i++)
    {
        let sum = 0;
        let group: number[] = [];
        for (let j = 0; j < list.length; j++)
        {
            var item = list[j];
            if ((i >> j) % 2 != 0)
            {
                var absoluteItem = Math.abs(item);
                if (presign(item) == presign(target) && sum + absoluteItem <= absoluteTarget) {
                    sum += absoluteItem;
                    group.push(item);
                    if (sum == absoluteTarget) 
                        return group;
                }
            }
        }
    }
    return [];
}

function presign(value: number): number {
    return Math.abs(value) / (value == 0 ? 1 : value);
}

