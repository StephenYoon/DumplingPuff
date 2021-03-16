CREATE TABLE [dbo].[ChatMessages] (
    [Id]          INT            IDENTITY (1, 1) NOT NULL,
    [ChatGroupId] INT            NOT NULL,
    [UserId]      INT            NOT NULL,
    [Message]     NVARCHAR (255) NOT NULL,
    [DateSent]    DATETIME       NOT NULL,
    [IsHidden]    BIT            NOT NULL,
    CONSTRAINT [PK_ChatMessages] PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO
CREATE NONCLUSTERED INDEX [NCI_ChatMessages_ChatGroupId]
    ON [dbo].[ChatMessages]([ChatGroupId] ASC)
    INCLUDE([UserId], [Message], [DateSent], [IsHidden]);

