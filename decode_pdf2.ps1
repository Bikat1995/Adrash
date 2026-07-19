param([string]$pdfPath, [string]$outPath)

function Decode-ASCII85([byte[]]$inputBytes) {
    $result = New-Object System.Collections.Generic.List[byte]
    $i = 0
    while ($i -lt $inputBytes.Length) {
        # Skip whitespace
        while ($i -lt $inputBytes.Length -and ($inputBytes[$i] -eq 10 -or $inputBytes[$i] -eq 13 -or $inputBytes[$i] -eq 32)) { $i++ }
        if ($i -ge $inputBytes.Length) { break }
        if ($inputBytes[$i] -eq 126 -and $i+1 -lt $inputBytes.Length -and $inputBytes[$i+1] -eq 62) { break } # ~>
        if ($inputBytes[$i] -eq 122) { # z
            $result.AddRange([byte[]](0,0,0,0))
            $i++
            continue
        }
        $group = New-Object byte[] 5
        $glen = 0
        while ($glen -lt 5 -and $i -lt $inputBytes.Length) {
            $b = $inputBytes[$i]
            if ($b -eq 10 -or $b -eq 13 -or $b -eq 32) { $i++; continue }
            if ($b -eq 126) { break }
            $group[$glen++] = $b
            $i++
        }
        if ($glen -eq 0) { break }
        for ($pad = $glen; $pad -lt 5; $pad++) { $group[$pad] = 117 } # 'u' = 84+33
        [long]$val = 0
        for ($j = 0; $j -lt 5; $j++) { $val = $val * 85 + ($group[$j] - 33) }
        $bytes4 = [byte[]]@(
            [byte](($val -shr 24) -band 0xFF),
            [byte](($val -shr 16) -band 0xFF),
            [byte](($val -shr 8) -band 0xFF),
            [byte]($val -band 0xFF)
        )
        $result.AddRange($bytes4[0..($glen-2)])
    }
    return $result.ToArray()
}

$rawBytes = [System.IO.File]::ReadAllBytes($pdfPath)

# Find streams manually by looking for "stream\n" after length declarations
$allText = New-Object System.Text.StringBuilder

$enc = [System.Text.Encoding]::GetEncoding("iso-8859-1")
$fullText = $enc.GetString($rawBytes)

# Find all stream positions
$streamTag = [System.Text.Encoding]::ASCII.GetBytes("stream")
$endstreamTag = [System.Text.Encoding]::ASCII.GetBytes("endstream")

$pos = 0
while ($pos -lt $rawBytes.Length - 10) {
    # Find "stream"
    $found = -1
    for ($j = $pos; $j -lt $rawBytes.Length - 6; $j++) {
        if ($rawBytes[$j] -eq 115 -and $rawBytes[$j+1] -eq 116 -and $rawBytes[$j+2] -eq 114 -and $rawBytes[$j+3] -eq 101 -and $rawBytes[$j+4] -eq 97 -and $rawBytes[$j+5] -eq 109) {
            $found = $j
            break
        }
    }
    if ($found -eq -1) { break }
    
    # Skip "stream\n" or "stream\r\n"
    $dataStart = $found + 6
    if ($dataStart -lt $rawBytes.Length -and $rawBytes[$dataStart] -eq 13) { $dataStart++ }
    if ($dataStart -lt $rawBytes.Length -and $rawBytes[$dataStart] -eq 10) { $dataStart++ }
    
    # Find "endstream"
    $endFound = -1
    for ($j = $dataStart; $j -lt $rawBytes.Length - 9; $j++) {
        if ($rawBytes[$j] -eq 101 -and $rawBytes[$j+1] -eq 110 -and $rawBytes[$j+2] -eq 100 -and $rawBytes[$j+3] -eq 115) {
            $endFound = $j
            break
        }
    }
    if ($endFound -eq -1) { break }
    
    $streamLen = $endFound - $dataStart
    if ($streamLen -gt 0 -and $streamLen -lt 100000) {
        # Check if this stream is ASCII85
        $prevText = $enc.GetString($rawBytes, [Math]::Max(0, $found-200), [Math]::Min(200, $found))
        $isA85 = $prevText -match "ASCII85"
        $isFlat = $prevText -match "FlateDecode"
        $isPlainFlat = ($prevText -match "FlateDecode") -and -not ($prevText -match "ASCII85")
        
        $streamData = $rawBytes[$dataStart..($endFound-2)]
        
        try {
            if ($isA85 -and $isFlat) {
                $decoded85 = Decode-ASCII85 $streamData
                $ms = New-Object System.IO.MemoryStream($decoded85, $false)
                $deflate = New-Object System.IO.Compression.DeflateStream($ms, [System.IO.Compression.CompressionMode]::Decompress)
                $buf = New-Object byte[] 65536
                $sb2 = New-Object System.Text.StringBuilder
                do { $read = $deflate.Read($buf, 0, $buf.Length); if ($read -gt 0) { $sb2.Append($enc.GetString($buf, 0, $read)) | Out-Null } } while ($read -gt 0)
                $allText.AppendLine("=== ASCII85+Flate Stream ===") | Out-Null
                $allText.AppendLine($sb2.ToString()) | Out-Null
            } elseif ($isPlainFlat) {
                $ms = New-Object System.IO.MemoryStream($streamData, $false)
                # Try zlib (skip 2-byte header)
                $ms.ReadByte() | Out-Null; $ms.ReadByte() | Out-Null
                $deflate = New-Object System.IO.Compression.DeflateStream($ms, [System.IO.Compression.CompressionMode]::Decompress)
                $buf = New-Object byte[] 65536
                $sb2 = New-Object System.Text.StringBuilder
                do { $read = $deflate.Read($buf, 0, $buf.Length); if ($read -gt 0) { $sb2.Append($enc.GetString($buf, 0, $read)) | Out-Null } } while ($read -gt 0)
                $allText.AppendLine("=== Flate Stream ===") | Out-Null
                $allText.AppendLine($sb2.ToString()) | Out-Null
            }
        } catch { $allText.AppendLine("Error decoding stream at $found`: $_") | Out-Null }
    }
    $pos = $endFound + 9
}

$allText.ToString() | Set-Content $outPath -Encoding UTF8
Write-Output "Done. Output: $outPath"
