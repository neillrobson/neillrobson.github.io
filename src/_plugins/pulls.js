const CLASSES = {
  "<<": "wide left",
  ">>": "wide right",
  "<>": "wide",
  "<": "inside left",
  ">": "inside right",
  "|<": "margin left",
  ">|": "margin right",
  "||": "column two",
  "|||": "column three",
};

export default function pulls_plugin(md) {
  function pull(state, startLine, endLine, silent) {
    // ### IDENTIFY ###

    const PULL_REGEX = /\{([<>\|]{1,3})\}/y;

    const start = state.bMarks[startLine] + state.tShift[startLine];
    const max = state.eMarks[startLine];

    PULL_REGEX.lastIndex = start;
    const match = PULL_REGEX.exec(state.src);
    if (!match) return false;

    let pos = PULL_REGEX.lastIndex;
    if (pos > max) return false;

    if (silent) return true;

    // ### PARSE ###

    const oldBMark = state.bMarks[startLine];
    const oldTShift = state.tShift[startLine];
    const oldSCount = state.sCount[startLine];
    const oldLength = state.tokens.length;

    const posAfterPull = pos;
    // Visual indent from start of line to end of marker
    const initial =
      state.sCount[startLine] +
      pos -
      (state.bMarks[startLine] + state.tShift[startLine]);
    // Visual indent from start of line to beginning of content after marker
    let offset = initial;

    while (pos < max) {
      const ch = state.src.charCodeAt(pos);

      if (md.utils?.isSpace(ch)) {
        if (ch === 0x09) {
          offset += 4 - (offset % 4);
        } else {
          offset++;
        }
      } else {
        break;
      }

      pos++;
    }

    state.tShift[startLine] = pos - posAfterPull;
    state.sCount[startLine] = offset - initial;
    state.bMarks[startLine] = posAfterPull;
    state.blkIndent += 4;

    if (state.sCount[startLine] < state.blkIndent) {
      state.sCount[startLine] += state.blkIndent;
    }

    state.md.block.tokenize(state, startLine, endLine);
    state.tokens.splice(oldLength, 0, new state.Token("div_open", "div", 1));
    state.tokens[oldLength].attrSet("class", CLASSES[match[1]]);
    state.tokens.push(new state.Token("div_close", "div", -1));

    state.blkIndent -= 4;
    state.tShift[startLine] = oldTShift;
    state.sCount[startLine] = oldSCount;
    state.bMarks[startLine] = oldBMark;

    return true;
  }

  md.block?.ruler.before("reference", "pull", pull);
}
