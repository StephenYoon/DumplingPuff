using DumplingPuff.Models;
using DumplingPuff.Models.WaruSkiesGame;
using System.Collections.Generic;

namespace DumplingPuff.Services.Interfaces
{
    public interface IWaruSkiesGameService
    {
        List<GameGroup> GetGroups();
        void UpdateGameState(string groupId, GameState message);
        void UpdateGame(string groupId, int gameUpdateType);
        void AddUser(string groupId, SocialUser user);
        GameGroup GetGroup(string groupId);
        void RemoveUser(string groupId, SocialUser user);
    }
}