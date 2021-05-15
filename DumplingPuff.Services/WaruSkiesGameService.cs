using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DumplingPuff.Models;
using DumplingPuff.Models.WaruSkiesGame;
using DumplingPuff.Services.Interfaces;

namespace DumplingPuff.Services
{
    public class WaruSkiesGameService : IWaruSkiesGameService
    {
        private List<GameGroup> _gameGroups;
        private readonly IUserService _userService;

        public WaruSkiesGameService(IUserService userService)
        {
            _gameGroups = new List<GameGroup>();
            _userService = userService;

            // Should always have the main game room
            ValidateMainGameGroup();
        }

        public List<GameGroup> GetGroups()
        {
            return _gameGroups;
        }

        public void AddUser(string groupId, SocialUser user)
        {
            if (user == null)
            {
                return;
            }

            var group = GetGroup(groupId);

            if (!group.Users.Any(u => u.Email.Equals(user.Email, StringComparison.InvariantCultureIgnoreCase)))
            {
                group.Users.Add(user);
            }

            if (!group.ActiveUsersByEmail.Any(activeEmail => activeEmail.Equals(user.Email, StringComparison.InvariantCultureIgnoreCase)))
            {
                group.ActiveUsersByEmail.Add(user.Email);
            }

            if (!group.GameStates.Any(s => s.User.Email.Equals(user.Email, StringComparison.InvariantCultureIgnoreCase)))
            {
                group.GameStates.Add(new GameState { User = user, Progress = 0, DateSent = DateTime.Now });
            }
        }

        public void RemoveUser(string groupId, SocialUser user)
        {
            if (user == null)
            {
                return;
            }

            var chatGroup = GetGroup(groupId);

            if (chatGroup.ActiveUsersByEmail.Any(activeEmail => activeEmail.Equals(user.Email, StringComparison.InvariantCultureIgnoreCase)))
            {
                chatGroup.ActiveUsersByEmail.Remove(user.Email);
            }
        }

        public GameGroup GetGroup(string groupId)
        {
            var group = _gameGroups.FirstOrDefault(g => g.Id.Equals(groupId, StringComparison.InvariantCultureIgnoreCase));

            if (group == null)
            {
                group = new GameGroup(groupId);
                _gameGroups.Add(group);
            }

            return group;
        }

        public void UpdateGameState(string groupId, GameState message)
        {
            if (message.User == null)
            {
                message.User = new SocialUser()
                {
                    Email = "guest@gmail.com",
                    Name = "Guest",
                    FirstName = "Guest",
                    LastName = ""
                };
            }

            var group = GetGroup(groupId);
            var userGameState = group.GameStates.FirstOrDefault(gameState => gameState.User.Email.Equals(message.User.Email, StringComparison.InvariantCultureIgnoreCase));
            if (userGameState == null)
            {
                group.GameStates.Add(message);
            }
            else
            {
                userGameState.Progress = message.Progress;
            }

            AddUser(groupId, message.User);
            var user = _userService.GetByEmail(message.User.Email, message.User.Provider);
            if (user == null)
            {
                _userService.AddOrUpdate(message.User);
            }
        }

        public void UpdateGame(string groupId, int gameUpdateType)
        {
            var updateType = (GameUpdateType)gameUpdateType;

            if (updateType == null)
            {
                return;
            }

            switch (updateType)
            {
                case GameUpdateType.ResetGame:
                    GameUpdateReset(groupId);
                    break;
            }
        }

        public void GameUpdateReset(string groupId)
        {
            var group = GetGroup(groupId);
            foreach(var gameState in group.GameStates)
            {
                gameState.Progress = 0;
            }
        }

        private void ValidateMainGameGroup()
        {
            // Should always have the main chat room
            if (!_gameGroups.Any(g => g.Id.Equals(GameGroup.WaruSkiesGameGroupId, StringComparison.InvariantCultureIgnoreCase)))
            {
                _gameGroups.Add(new GameGroup(GameGroup.WaruSkiesGameGroupId));
            }
        }
    }
}
