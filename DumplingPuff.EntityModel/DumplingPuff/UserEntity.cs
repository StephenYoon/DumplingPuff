using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DumplingPuff.EntityModels.DumplingPuff
{
    [Table("Users")]
    public class UserEntity
    {
        [Key]
        public int Id { get; set; }
        public string Provider { get; set; }
        public string SocialProviderId { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public string PhotoUrl { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateUpdated { get; set; }
        public DateTime DateLastLogin { get; set; }
    }
}
