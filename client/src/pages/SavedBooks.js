import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_ME } from "../utils/queries";
import { REMOVE_BOOK } from "../utils/mutations";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import Auth from "../utils/auth";
import { saveBookIds, getSavedBookIds } from "../utils/localStorage";

const SavedBooks = () => {
  const { loading, data } = useQuery(QUERY_ME);
  const [deleteBook, { error }] = useMutation(REMOVE_BOOK);
  const [books, setBooks] = useState([]);
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());

  useEffect(() => {
    if (data) {
      setBooks(data.me.savedBooks);
    }

    return () => saveBookIds(savedBookIds);
  }, [data]);

  const handleDeleteBook = async (bookId) => {
    const headers = {
      headers: {
        Authorization: `Bearer ${Auth.getToken()}`,
      },
    };

    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await deleteBook({ variables: { bookId }, context: headers });
      setBooks(books.filter((book) => book.bookId !== bookId));
      if (savedBookIds.length) {
        setSavedBookIds(
          savedBookIds?.filter((savedBookId) => savedBookId !== bookId)
        );
      }

      if (!data) {
        throw new Error("something went wrong!");
      } else {
        console.log("data", data);
      }
    } catch (err) {
      console.error("try error", err);
      console.log("mutation error", error);
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

export default SavedBooks;
