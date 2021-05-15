using System;
using System.Collections.Generic;
using System.Text;

namespace DumplingPuff.Models.WaruSkiesGame
{
    public class GameState
    {
        public SocialUser User { get; set; }
        public int Progress { get; set; }
        public int DiceIndex { get; set; }
        public bool TurnCompleted { get; set; }
        public DateTime DateSent { get; set; }
    }
}
