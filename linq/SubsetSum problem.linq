<Query Kind="Program" />

void Main()
{

	RunTest(Generator.CreateTestItems(3));
	
	RunTest(Generator.CreateTestItems(6));

	RunTest(Generator.CreateTestItems(12));
	
	RunTest(Generator.CreateTestItems(20));
	
	RunTest(Generator.CreateTestItems(22));
	
}

void RunTest(TestSet test)
{
	var complexity = Math.Pow(2, test.Items.Count) - 1;
	var msg = $"{complexity:#,##0} combinations";
	var msg2 = $"Looking for {test.Target:#,##0.00} in {test.Items.Count:#,##0} numbers";
	msg.Dump(msg2);

	var sw = new Stopwatch();
	sw.Start();
	var result = IterativeMatcher.GetFirstMatch(test.Items, test.Target);
	sw.Stop();
	var output = string.Join(", ", result.Take(100).Select(r => r.Amount));
	output.Dump($"{sw.Elapsed.Seconds:0.00} sek.");
	Util.RawHtml("<hr>").Dump();
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
					if (item.Amount.sigNum() == target.sigNum() && sum + absoluteItem <= absoluteTarget) {
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
	
	public static decimal sigNum(this decimal value) {
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

public class TestSet {
	public List<Item> Items { get; set; }
	public decimal Target { get; set; }
}

static class Generator {

	public static TestSet CreateTestItems(int numberOfItems)
	{
		var result = new List<Item>();
		decimal sum = 0;
		for (var i = 0; i < numberOfItems; i++)
		{
			var dbl = randomStdNormalDistribution(100, 120000, 5);
			var dec = (decimal)Math.Round(dbl,2);
			result.Add(new Item { Amount = dec });
			sum += dec;
		}
		return new TestSet { Items = result, Target = sum };
	}

	public static double randomStdNormalDistribution(double min, double max, int skew)
	{
		var rnd = new Random();
		double u = 0; 
		double v = 0;
		while (u == 0) u = rnd.NextDouble();
		while (v == 0) v = rnd.NextDouble();

		var num = Math.Sqrt(-2.0 * Math.Log(u)) * Math.Cos(2.0 * Math.PI * v);


		num = num / 10.0 + 0.5; // Translate to 0 -> 1

		if (num > 1 || num < 0)
			num = randomStdNormalDistribution(min, max, skew); // resample between 0 and 1 if out of range


		else
		{
			num = Math.Pow(num, skew); // Skew

		  num = num * (max - min); // Stretch to fill range

		  num += min; // offset to min

		}
		
		return num;

	  }
}
