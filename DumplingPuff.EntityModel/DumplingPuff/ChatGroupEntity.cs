using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace DumplingPuff.EntityModels.DumplingPuff
{
    [Table("ChatGroups")]
    public class ChatGroupEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public int Id { get; set; }
        public string GroupName { get; set; }
    }
}
