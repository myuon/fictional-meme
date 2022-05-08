const extensions: Record<string, string> = {
  js: "javascript",
  ts: "typescript",
  jsx: "javascript",
  tsx: "typescript",
  mjs: "javascript",
  md: "markdown",
  json: "json",
  yml: "yaml",
  yaml: "yaml",
  html: "html",
  css: "css",
  c: "c",
  cpp: "cpp",
  h: "cpp",
  rb: "ruby",
  py: "python",
  pl: "perl",
  go: "go",
  rs: "rust",
};

// for react-syntax-highlighter
export const detectLanguageFromFileName = (
  fileName: string
): string | undefined => {
  const splitted = fileName.split(".");
  const ext = splitted[splitted.length - 1];

  return extensions?.[ext];
};
