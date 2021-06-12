using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DumplingPuff.Models.WaruSkiesGame
{
    public class GameGroup
    {
        public static string WaruSkiesGameGroupId = "waru-skies-game-room";

        public GameGroup(string groupId)
        {
            Id = groupId;
            GameStates = new List<GameState>();
            Users = new List<SocialUser>();
            ActiveUsersByEmail = new List<string>();
        }

        public string Id { get; set; }

        public int CurrentRound { get; set; }

        public bool GameFinished 
        { 
            get
            {
                return GameStates.Any(state => state.Progress >= 10);
            } 
        }

        public List<GameState> GameStates { get; set; }

        public List<SocialUser> Users { get; set; }

        public List<string> ActiveUsersByEmail { get; set; }
    }
}
