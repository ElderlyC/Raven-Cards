export const enReg = /[a-zA-Z]+/; // excludes jp romaji
export const koReg = /[\uAC00-\uD7AF]+/u; // regex for Korean 한글 (no hanja)
export const jaReg = /[\u3040-\u30FF\u3400-\u4DBF\u4E00-\u9FFF]+/u; // regex for Japanese characters
