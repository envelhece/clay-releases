/*
 * CLAY site — configuração única.
 * Troque DOWNLOAD_URL pelo link real do instalador (GitHub Releases).
 * Todos os botões "Baixar" da página usam este valor.
 * SHA256 / SHA256_FILE são preenchidos por tools/release-integrity.ps1 a cada versão
 * (vazio = o site mostra só o link para checksums.txt).
 */
window.CLAY = {
  DOWNLOAD_URL: "https://github.com/envelhece/clay-releases/releases/latest/download/CLAY-win-Setup.exe",
  VERSION: "1.0.11",
  SHA256: "37f074017ebbcfab2b1d15033cb87f896810e7a75c2395f8e34bd748032740fd",
  SHA256_FILE: "CLAY-win-Setup.exe"
};
