musicexplorer.studio

## Azure Storage CORS Configuration

To fix "Failed to fetch" errors when uploading files, you need to configure CORS on your Azure Storage account:

### Option 1: Using Azure Portal
1. Go to your Azure Storage account in the Azure Portal
2. Navigate to Settings → Resource sharing (CORS)
3. Add a new CORS rule for Blob service with these settings:
   - **Allowed origins**: `https://musicexplorer.studio,http://localhost:5173,https://*.netlify.app`
   - **Allowed methods**: `GET,POST,PUT,DELETE,HEAD,OPTIONS`
   - **Allowed headers**: `*`
   - **Exposed headers**: `*`
   - **Max age**: `3600`

### Option 2: Using Azure CLI
```bash
az storage cors add \
  --account-name samusicexplorerstudio \
  --services b \
  --methods GET POST PUT DELETE HEAD OPTIONS \
  --origins "https://musicexplorer.studio" "http://localhost:5173" "https://*.netlify.app" \
  --allowed-headers "*" \
  --exposed-headers "*" \
  --max-age 3600
```

### Option 3: Using PowerShell
```powershell
$ctx = New-AzStorageContext -StorageAccountName "samusicexplorerstudio" -SasToken "your-sas-token"
$CorsRules = (@{
    AllowedOrigins=@("https://musicexplorer.studio","http://localhost:5173","https://*.netlify.app");
    AllowedMethods=@("GET","POST","PUT","DELETE","HEAD","OPTIONS");
    MaxAgeInSeconds=3600;
    ExposedHeaders=@("*");
    AllowedHeaders=@("*")})
Set-AzStorageCORSRule -ServiceType Blob -CorsRules $CorsRules -Context $ctx
```