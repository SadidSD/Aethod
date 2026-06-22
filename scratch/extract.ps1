Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead("C:\Users\user\Downloads\R1.zip")
$destDir = "C:\Users\user\Desktop\AEETHOD\R1_extracted"
if (!(Test-Path $destDir)) {
    New-Item -ItemType Directory -Path $destDir | Out-Null
}
foreach ($entry in $zip.Entries) {
    $name = $entry.Name
    if ($name.Length -gt 50) {
        $ext = [System.IO.Path]::GetExtension($name)
        $base = $name.Substring(0, 40)
        $name = $base + $ext
    }
    $targetPath = [System.IO.Path]::Combine($destDir, $name)
    [System.IO.Compression.ZipFileExtensions]::ExtractToFile($entry, $targetPath, $true)
}
$zip.Dispose()
Write-Host "Extraction completed successfully!"
