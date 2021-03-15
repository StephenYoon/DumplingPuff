using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DumplingPuff.DataAccess.Repository.Interfaces;
using DumplingPuff.EntityModels.DumplingPuff;
using DumplingPuff.Models;
using DumplingPuff.Services.Interfaces;

namespace DumplingPuff.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public void AddOrUpdate(SocialUser user)
        {
            var userEntity = new UserEntity
            {
                Id = 0,
                Provider = user.Provider,
                SocialProviderId = user.Id,
                Email = user.Email,
                Name = user.Name,
                PhotoUrl = user.PhotoUrl,
                FirstName = user.FirstName,
                LastName = user.LastName,
                DateCreated = DateTime.Now,
                DateUpdated = DateTime.Now,
                DateLastLogin = DateTime.Now
            };

            var existingUserEntity = _userRepository.GetAll().Where(u => u.Email.Equals(user.Email, StringComparison.InvariantCultureIgnoreCase)).FirstOrDefault();
            if (existingUserEntity == null)
            {
                _userRepository.AddOrUpdate(userEntity);
            }
            else
            {
                existingUserEntity.DateLastLogin = DateTime.Now;
                _userRepository.AddOrUpdate(existingUserEntity);
            }
        }
    }
}
