function Decode-ASCII85 {
    param([string]$encoded)
    $encoded = $encoded -replace '\s', ''
    $encoded = $encoded -replace '~>$', ''
    $result = [System.Collections.Generic.List[byte]]::new()
    $i = 0
    while ($i -lt $encoded.Length) {
        if ($encoded[$i] -eq 'z') {
            $result.AddRange([byte[]](0,0,0,0))
            $i++
            continue
        }
        $group = $encoded.Substring($i, [Math]::Min(5, $encoded.Length - $i))
        $i += $group.Length
        $val = 0L
        for ($j = 0; $j -lt $group.Length; $j++) {
            $val = $val * 85 + ([int][char]$group[$j] - 33)
        }
        $padding = 5 - $group.Length
        for ($j = 0; $j -lt $padding; $j++) { $val = $val * 85 + 84 }
        $bytes = [byte[]]@(
            [byte](($val -shr 24) -band 0xFF),
            [byte](($val -shr 16) -band 0xFF),
            [byte](($val -shr 8) -band 0xFF),
            [byte]($val -band 0xFF)
        )
        $result.AddRange($bytes[0..([Math]::Max(0, 3-$padding))])
    }
    return $result.ToArray()
}

$rawBytes = [System.IO.File]::ReadAllBytes("Adrash_Build_Specification_v2.pdf")
$rawText = [System.Text.Encoding]::GetEncoding("iso-8859-1").GetString($rawBytes)

$pattern = '(?s)/Filter \[ /ASCII85Decode /FlateDecode \] /Length \d+\s*>>\s*stream\r?\n(.*?)\r?\nendstream'
$matches2 = [regex]::Matches($rawText, $pattern)

Write-Output "Found $($matches2.Count) ASCII85+Flate streams"

$allText = ""
foreach ($m in $matches2) {
    $a85data = $m.Groups[1].Value
    try {
        $decoded = Decode-ASCII85 $a85data
        $ms = New-Object System.IO.MemoryStream($decoded, $false)
        $deflate = New-Object System.IO.Compression.DeflateStream($ms, [System.IO.Compression.CompressionMode]::Decompress)
        $buf = New-Object byte[] 65536
        $sb = New-Object System.Text.StringBuilder
        do {
            $read = $deflate.Read($buf, 0, $buf.Length)
            if ($read -gt 0) { $sb.Append([System.Text.Encoding]::Latin1.GetString($buf, 0, $read)) | Out-Null }
        } while ($read -gt 0)
        $allText += $sb.ToString() + "`n`n"
    } catch { Write-Output "Error: $_" }
}

$allText | Set-Content "decoded_spec.txt"
Write-Output "Done, text length: $($allText.Length)"
