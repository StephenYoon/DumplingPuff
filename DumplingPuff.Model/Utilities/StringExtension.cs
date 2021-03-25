using System;
using System.Collections.Generic;
using System.Text;

namespace DumplingPuff.Models.Utilities
{
    public static class StringExtension
    {
        public static string Truncate(this string value, int maxLength)
        {
            if (string.IsNullOrEmpty(value)) return value;
            return value.Length <= maxLength ? value : value.Substring(0, maxLength);
        }
    }
}
