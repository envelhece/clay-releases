/*
 * CLAY site — configuração única.
 * Troque DOWNLOAD_URL pelo link real do instalador (GitHub Releases).
 * Todos os botões "Baixar" da página usam este valor.
 * SHA256 / SHA256_FILE são preenchidos por tools/release-integrity.ps1 a cada versão
 * (vazio = o site mostra só o link para checksums.txt).
 */
window.CLAY = {
  DOWNLOAD_URL: "https://github.com/envelhece/clay-releases/releases/latest/download/CLAY-win-Setup.exe",
  VERSION: "1.0.6",
  SHA256: "015bdf368a7402d8499db00969c35e64e6d551beb92be5bcd62914fa490b1981",
  SHA256_FILE: "CLAY-win-Setup.exe"
};
