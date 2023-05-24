<Query Kind="Program" />

void Main()
{
	Test(Item.NewSet( 2, 3 ), target: 4 );
	Test(Item.NewSet( 2, 3, 5 ), target: 8 );
	Test(Item.NewSet( 6, -1, -2, -3, 5, 1 ), target: 7);
	Test(Item.NewSet( -2, 3, 6, -1, -2, -3, 5 ), target: -7);
	Test(Item.NewSet( 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ), target: 10);	
	Test(Item.NewSet( 0.35M, 0.45M, 0.60M, 0.1M, 0.15M, 0.20M, 1.4M, 0.5M, 0.3M, 0.8M, 2.2M, 0.1M, 0.7M, 0.8M), target: 7);
	Test(Item.NewSet( 0.35M, 0.45M, 0.60M, 0.1M, 0.15M, 0.20M, 1.4M, 0.5M, 0.3M, 0.8M, 2.2M, 0.1M, 0.7M, 0.8M, 0.5M, 0.15M, 0.30M, 0.5M, 0.7M, 0.3M, 0.85M, 0.95M, 1.25M, 1.45M), target: 14M);
}

void Test(IReadOnlyList<Item> numbers, decimal target) {

	var complexity = Math.Pow(2, numbers.Count) - 1;
	Console.WriteLine($"{numbers.Count} items = {complexity} combinations");	

	// Find combinations
	IterativeMatcher.GetFirstMatch(numbers, target).Dump();	
}


public static class IterativeMatcher
{

	public static IReadOnlyList<Item> GetFirstMatch(this IReadOnlyList<Item> list, decimal target)
	{
		long comboCount = (long)Math.Pow(2, list.Count) - 1;
		var absoluteTarget = Math.Abs(target);
		for (long i = 1; i < comboCount + 1; i++)
		{
			decimal sum = 0;
			var group = new List<Item>();
			for (int j = 0; j < list.Count; j++)
			{
				var item = list[j];
				if ((i >> j) % 2 != 0)
				{
					var absoluteItem = Math.Abs(item.Amount);
					if (item.Amount.Presign() == target.Presign() && sum + absoluteItem <= absoluteTarget) {
						sum += absoluteItem;
						group.Add(item);
						if (sum == absoluteTarget) 
							return group;
					}
				}
			}
		}
		return null;
	}
	
	public static decimal Presign(this decimal value) {
		return Math.Abs(value) / (value == 0 ? 1 : value);		
	}

}



public class Item
{
	public decimal Amount { get; set; }

	public static IReadOnlyList<Item> NewSet(params decimal[] values)
	{
		return values.Select(v => new Item { Amount = v }).ToList();
	}

}
