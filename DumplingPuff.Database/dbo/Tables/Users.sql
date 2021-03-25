CREATE TABLE [dbo].[Users] (
    [Id]            INT           IDENTITY (1, 1) NOT NULL,
    [Provider]      VARCHAR (50)  NOT NULL,
    [SocialUserId]  VARCHAR (255) NULL,
    [Email]         VARCHAR (255) NOT NULL,
    [Name]          VARCHAR (255) NOT NULL,
    [PhotoUrl]      VARCHAR (255) NULL,
    [FirstName]     VARCHAR (255) NOT NULL,
    [LastName]      VARCHAR (255) NOT NULL,
    [DateCreated]   DATETIME      NULL,
    [DateUpdated]   DATETIME      NULL,
    [DateLastLogin] DATETIME      NULL,
    CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED ([Id] ASC)
);






GO
CREATE UNIQUE NONCLUSTERED INDEX [NCI_Users_Provider_Email]
    ON [dbo].[Users]([Provider] ASC, [Email] ASC);

