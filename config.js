/*
 * CLAY site — configuração única.
 * Troque DOWNLOAD_URL pelo link real do instalador (GitHub Releases).
 * Todos os botões "Baixar" da página usam este valor.
 * SHA256 / SHA256_FILE são preenchidos por tools/release-integrity.ps1 a cada versão
 * (vazio = o site mostra só o link para checksums.txt).
 */
window.CLAY = {
  DOWNLOAD_URL: "https://github.com/envelhece/clay-releases/releases/latest/download/CLAY-win-Setup.exe",
  VERSION: "1.0.5",
  SHA256: "08abab57ed63e2c2eef9e4842572034af83b413a354a9379d3af896bc53ba6ab",
  SHA256_FILE: "CLAY-win-Setup.exe"
};
