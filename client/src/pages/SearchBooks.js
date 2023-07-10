import React, { useState, useEffect } from "react"; // import react library
import { useMutation } from "@apollo/client"; // import useMutation hook
import { SAVE_BOOK } from "../utils/mutations"; // import SAVE_BOOK mutation
import { Container, Col, Form, Button, Card, Row } from "react-bootstrap"; // import bootstrap components
import Auth from "../utils/auth"; // import auth.js
import { saveBookIds, getSavedBookIds } from "../utils/localStorage"; // import saveBookIds() and getSavedBookIds() from localStorage.js

const SearchBooks = () => { // define SearchBooks functional component
  const [saveBook, { error }] = useMutation(SAVE_BOOK); // use SAVE_BOOK mutation
  const [searchedBooks, setSearchedBooks] = useState([]); // set searchedBooks state to empty array
  const [searchInput, setSearchInput] = useState(""); // set searchInput state to empty string
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds()); // set savedBookIds state to getSavedBookIds() function

  useEffect(() => { // define useEffect hook
    return () => saveBookIds(savedBookIds); // return saveBookIds() function with savedBookIds state
  });

  const searchGoogleBooks = (query) => { // define searchGoogleBooks function accepting query variable
    return fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`); // return fetch request to google books api
  };

  const handleFormSubmit = async (event) => { // define handleFormSubmit function accepting event variable
    event.preventDefault(); // prevent default event behavior

    if (!searchInput) { // if searchInput is empty
      return false; // return false
    }

    try {
      const response = await searchGoogleBooks(searchInput); // define response variable as searchGoogleBooks() function with searchInput state

      if (!response.ok) { // if response is not ok
        throw new Error("something went wrong!"); // throw error
      }

      const { items } = await response.json(); // define items variable as response.json()

      const bookData = items.map((book) => ({ // define bookData variable and map through items array
        bookId: book.id, // set bookId to book.id
        authors: book.volumeInfo.authors || ["No author to display"], // set authors to book.volumeInfo.authors or "No author to display"
        title: book.volumeInfo.title, // set title to book.volumeInfo.title
        description: book.volumeInfo.description, // set description to book.volumeInfo.description
        image: book.volumeInfo.imageLinks?.thumbnail || "", // set image to book.volumeInfo.imageLinks.thumbnail or empty string
      }));

      setSearchedBooks(bookData); // set searchedBooks state to bookData
      setSearchInput(""); // set searchInput state to empty string
    } catch (err) { // catch error
      console.error(err); // console.error(err)
    }
  };

  const handleSaveBook = async (bookId) => { // define handleSaveBook function accepting bookId variable
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId); // define bookToSave variable as searchedBooks.find() function with bookId variable

    const headers = { // define headers variable for simplicity
      headers: { // define headers
        Authorization: `Bearer ${Auth.getToken()}`, // set Authorization to Bearer token
      },
    };

    const token = Auth.loggedIn() ? Auth.getToken() : null; // define token variable as Auth.loggedIn() ? Auth.getToken() : null

    if (!token) { // if token is null
      return false; // return false
    }

    try {
      const { data } = await saveBook({ // define data variable as saveBook() function
        variables: { // define the mutation variables
          authors: bookToSave.authors, // set authors to bookToSave.authors
          description: bookToSave.description, // set description to bookToSave.description
          title: bookToSave.title, // set title to bookToSave.title
          bookId: bookToSave.bookId, // set bookId to bookToSave.bookId
          image: bookToSave.image, // set image to bookToSave.image
          link: bookToSave.link, // set link to bookToSave.link
        },
        context: headers, // set context to headers
      });

      if (!data) { // if data is null
        throw new Error("something went wrong!"); // throw error
      }

      setSavedBookIds([...savedBookIds, bookToSave.bookId]); // set savedBookIds state to bookToSave.bookId
    } catch (err) { // catch error
      console.error("try error", err); // log try error
      console.log("mutation error", error); // log mutation error
    }
  };

  return (
    <>
      <div className="text-light bg-dark pt-5">
        <Container>
          <h1>Search for Books!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name="searchInput"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type="text"
                  size="lg"
                  placeholder="Search for a book"
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type="submit" variant="success" size="lg">
                  Submit Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>

      <Container>
        <h2 className="pt-5">
          {searchedBooks.length
            ? `Viewing ${searchedBooks.length} results:`
            : "Search for a book to begin"}
        </h2>
        <Row>
          {searchedBooks.map((book, index) => {
            return (
              <Col md="4" key={index}>
                <Card key={book.bookId} border="dark">
                  {book.image ? (
                    <Card.Img
                      src={book.image}
                      alt={`The cover for ${book.title}`}
                      variant="top"
                    />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className="small">Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    {Auth.loggedIn() && (
                      <Button
                        disabled={savedBookIds?.some(
                          (savedBookId) => savedBookId === book.bookId
                        )}
                        className="btn-block btn-info"
                        onClick={() => handleSaveBook(book.bookId)}
                      >
                        {savedBookIds?.some(
                          (savedBookId) => savedBookId === book.bookId
                        )
                          ? "This book has already been saved!"
                          : "Save this Book!"}
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SearchBooks; // export SearchBooks component
