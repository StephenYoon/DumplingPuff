using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DumplingPuff.EntityModels.DumplingPuff
{
    [Table("ChatMessages")]
    public class ChatMessageEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public int Id { get; set; }
        public int ChatGroupId { get; set; }
        public int UserId { get; set; }
        public string Message { get; set; }
        public DateTime DateSent { get; set; }
        public bool IsHidden { get; set; }
    }
}
