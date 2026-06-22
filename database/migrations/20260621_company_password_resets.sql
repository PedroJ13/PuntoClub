CREATE TABLE dbo.CompanyPasswordResets (
  id bigint IDENTITY(1,1) NOT NULL CONSTRAINT PK_CompanyPasswordResets PRIMARY KEY,
  company_id bigint NOT NULL,
  company_user_id bigint NOT NULL,
  email nvarchar(254) NOT NULL,
  token_hash varbinary(32) NOT NULL,
  status varchar(20) NOT NULL CONSTRAINT DF_CompanyPasswordResets_status DEFAULT ('pending'),
  expires_at datetime2 NOT NULL,
  sent_at datetime2 NOT NULL CONSTRAINT DF_CompanyPasswordResets_sent_at DEFAULT SYSUTCDATETIME(),
  used_at datetime2 NULL,
  created_by_label nvarchar(120) NULL,
  created_at datetime2 NOT NULL CONSTRAINT DF_CompanyPasswordResets_created_at DEFAULT SYSUTCDATETIME(),
  CONSTRAINT FK_CompanyPasswordResets_company FOREIGN KEY (company_id) REFERENCES dbo.Companies(id),
  CONSTRAINT FK_CompanyPasswordResets_user FOREIGN KEY (company_user_id) REFERENCES dbo.CompanyUsers(id),
  CONSTRAINT CK_CompanyPasswordResets_status CHECK (status IN ('pending', 'used', 'expired', 'revoked'))
);

CREATE UNIQUE INDEX UX_CompanyPasswordResets_token_hash
ON dbo.CompanyPasswordResets(token_hash);

CREATE INDEX IX_CompanyPasswordResets_pending_email
ON dbo.CompanyPasswordResets(email, status, expires_at)
WHERE status = 'pending';
