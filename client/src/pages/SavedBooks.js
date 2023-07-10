import React, { useState, useEffect } from "react"; // import react library
import { useQuery, useMutation } from "@apollo/client"; // import useQuery and useMutation hooks
import { QUERY_ME } from "../utils/queries"; // import QUERY_ME query
import { REMOVE_BOOK } from "../utils/mutations"; // import REMOVE_BOOK mutation
import { Container, Card, Button, Row, Col } from "react-bootstrap"; // import bootstrap components
import Auth from "../utils/auth"; // import auth.js
import { saveBookIds, getSavedBookIds } from "../utils/localStorage"; // import saveBookIds() and getSavedBookIds() from localStorage.js

const SavedBooks = () => { // define SavedBooks functional component
  const { loading, data } = useQuery(QUERY_ME); // use QUERY_ME query
  const [deleteBook, { error }] = useMutation(REMOVE_BOOK); // use REMOVE_BOOK mutation
  const [books, setBooks] = useState([]); // set books state to empty array
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds()); // set savedBookIds state to getSavedBookIds() function

  useEffect(() => { // define useEffect hook
    if (data) { // if data exists
      setBooks(data.me.savedBooks); // set books state to data.me.savedBooks
    }

    return () => saveBookIds(savedBookIds); // return saveBookIds() function with savedBookIds state
  }, [data]); // add data to dependency array

  const handleDeleteBook = async (bookId) => { // define handleDeleteBook function accepting bookId variable
    const headers = { // define headers variable for simplicity
      headers: { // define headers
        Authorization: `Bearer ${Auth.getToken()}`, // set Authorization to Bearer token
      },
    };

    const token = Auth.loggedIn() ? Auth.getToken() : null; // define token variable as Auth.loggedIn() ? Auth.getToken() : null

    if (!token) { // if token does not exist
      return false; // return false
    }

    try {
      await deleteBook({ variables: { bookId }, context: headers }); // define deleteBook variable as deleteBook() function with bookId and headers variables
      setBooks(books.filter((book) => book.bookId !== bookId)); // set books state to books.filter() function with bookId variable
      if (savedBookIds.length) { // if savedBookIds.length
        setSavedBookIds( // set savedBookIds state
          savedBookIds?.filter((savedBookId) => savedBookId !== bookId) // to savedBookIds?.filter() function with savedBookId variable
        );
      }

      if (!data) { // if data does not exist
        throw new Error("something went wrong!"); // throw error
      }
    } catch (err) { // catch error
      console.error("try error", err); // log try error
      console.log("mutation error", error); // log mutation error
    }
  };

  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        {loading ? (
          <h2>LOADING...</h2>
        ) : (
          <>
            <h2 className="pt-5">
              {books.length
                ? `Viewing ${books.length} saved ${
                    books.length === 1 ? "book" : "books"
                  }:`
                : "You have no saved books!"}
            </h2>
            <Row>
              {books.map((book, index) => {
                return (
                  <Col md="4" key={index}>
                    <Card border="dark">
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
                        <Button
                          className="btn-block btn-danger"
                          onClick={() => handleDeleteBook(book.bookId)}
                        >
                          Delete this Book!
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </>
        )}
      </Container>
    </>
  );
};

export default SavedBooks; // export SavedBooks functional component
