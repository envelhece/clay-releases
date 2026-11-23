/*
 * CLAY site — configuração única.
 * Troque DOWNLOAD_URL pelo link real do instalador (GitHub Releases).
 * Todos os botões "Baixar" da página usam este valor.
 * SHA256 / SHA256_FILE são preenchidos por tools/release-integrity.ps1 a cada versão
 * (vazio = o site mostra só o link para checksums.txt).
 */
window.CLAY = {
  DOWNLOAD_URL: "https://github.com/envelhece/clay-releases/releases/latest/download/CLAY-win-Setup.exe",
  VERSION: "1.0.1",
  SHA256: "9473f3f3bf3ab9614f906b18ea5118128d67c6e103abf0b8804c9bb6df0e7e82",
  SHA256_FILE: "CLAY-win-Setup.exe"
};
