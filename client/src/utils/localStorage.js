export const getSavedBookIds = () => {
  // define getSavedBookIds() function
  const savedBookIds = localStorage.getItem("saved_books") // get saved_book ids from localStorage
    ? JSON.parse(localStorage.getItem("saved_books")) // parse JSON string into array
    : []; // if null, return empty array

  return savedBookIds; // return savedBookIds
};

export const saveBookIds = (bookIdArr) => {
  // define saveBookIds() function accepting bookIdArr array
  if (bookIdArr.length) {
    // if bookIdArr array has length
    localStorage.setItem("saved_books", JSON.stringify(bookIdArr)); // save array of ids to localStorage
  } else {
    localStorage.removeItem("saved_books"); // if array is empty, remove saved_book from localStorage
  }
};

export const removeBookId = (bookId) => {
  // define removeBookId() function accepting bookId variable
  const savedBookIds = localStorage.getItem("saved_books") // get saved_book ids from localStorage
    ? JSON.parse(localStorage.getItem("saved_books")) // parse JSON string into array
    : null; // otherwise return null

  if (!savedBookIds) {
    // if no saved_book ids exist in localStorage, return false
    return false; // return false
  }

  const updatedSavedBookIds = savedBookIds?.filter(
    (savedBookId) => savedBookId !== bookId
  ); // filter out bookId to be removed
  localStorage.setItem("saved_books", JSON.stringify(updatedSavedBookIds)); // save updated array of ids to localStorage

  return true; // return true
};
