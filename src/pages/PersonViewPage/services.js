//Services for adding and removing classes for new header component

export const removePersonClass = () => {
    document.querySelector(".person-detail-top").classList.remove('person-hero-image');
  }

export const addPersonClass = () => {
    document.querySelector(".person-detail-top").classList.add('person-hero-image');
  }

export const removeHiddenHeader = () => {
  document.querySelector(".main-wrapper").parentNode.classList.remove('person-main-wrapper');
}

export const addBodyOverflow = () => {
  document.body.classList.add('body-overflow');
}

export const removeBodyOverflow = () => {
  document.body.classList.remove('body-overflow');
}