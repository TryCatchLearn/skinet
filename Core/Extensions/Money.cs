using System;

namespace Core.Extensions;

public static class Money
{
    public static long ToCents(decimal dollars) => 
        (long)Math.Round(dollars * 100, MidpointRounding.AwayFromZero);

    public static decimal FromCents(long cents) => cents / 100m;

    public static long PercentOfCents(long cents, decimal percent) => 
        (long)Math.Floor(cents * (percent / 100));
}
