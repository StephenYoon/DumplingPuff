CREATE TABLE [dbo].[ChatGroups] (
    [Id]        INT           IDENTITY (1, 1) NOT NULL,
    [GroupName] VARCHAR (255) NULL,
    CONSTRAINT [PK_ChatGroups] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_ChatGroups_ChatGroups] FOREIGN KEY ([Id]) REFERENCES [dbo].[ChatGroups] ([Id])
);


GO
CREATE NONCLUSTERED INDEX [NCI_ChatGroups_GroupName]
    ON [dbo].[ChatGroups]([GroupName] ASC);

