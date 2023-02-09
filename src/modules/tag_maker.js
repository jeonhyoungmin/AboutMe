class TagMaker {
  constructor(tagName, className = '', idName = '') {
    const tag = document.createElement(tagName);
    if (className !== '') {
      tag.className = className;
    }
    if (idName !== '') {
      tag.id = idName;
    }
    return tag;
  }
}

export default TagMaker;
