/**
 * Very lightweight regex-based syntax highlighter for JS / Python snippets.
 * Returns an HTML string — use dangerouslySetInnerHTML.
 */
export function highlight(line) {
  const JS_KEYWORDS =
    /\b(var|let|const|function|return|if|else|for|while|class|new|this|typeof|null|undefined|true|false|import|export|async|await|of|in|do|switch|case|break|continue|throw|try|catch|finally)\b/g;
  const PY_KEYWORDS =
    /\b(def|return|if|else|elif|for|while|class|import|from|True|False|None|and|or|not|in|is|print|range|lambda|pass|yield|with|as|global|nonlocal|raise|del|assert)\b/g;

  return line
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Comments (// or #)
    .replace(
      /(\/\/.*$|#.*$)/g,
      '<span style="color:#546e7a;font-style:italic">$1</span>'
    )
    // Strings
    .replace(
      /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g,
      '<span style="color:#c3e88d">$1</span>'
    )
    // Numbers
    .replace(
      /\b(\d+\.?\d*)\b/g,
      '<span style="color:#f78c6c">$1</span>'
    )
    // JS keywords
    .replace(JS_KEYWORDS, '<span style="color:#c792ea">$1</span>')
    // Python keywords
    .replace(PY_KEYWORDS, '<span style="color:#c792ea">$1</span>');
}
