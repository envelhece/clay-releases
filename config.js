/*
 * CLAY site — configuração única.
 * Troque DOWNLOAD_URL pelo link real do instalador (GitHub Releases).
 * Todos os botões "Baixar" da página usam este valor.
 * SHA256 / SHA256_FILE são preenchidos por tools/release-integrity.ps1 a cada versão
 * (vazio = o site mostra só o link para checksums.txt).
 */
window.CLAY = {
  DOWNLOAD_URL: "https://github.com/envelhece/clay-releases/releases/latest/download/CLAY-win-Setup.exe",
  VERSION: "1.0.10",
  SHA256: "229ce06e3082c6cad3f0618c20a20587452886c7a49253ba09b22b79948ca2a9",
  SHA256_FILE: "CLAY-win-Setup.exe"
};
