import React, { useState } from "react"; // import react library
import { useMutation } from "@apollo/client"; // import useMutation hook
import { ADD_USER } from "../utils/mutations"; // import ADD_USER mutation
import { Form, Button, Alert } from "react-bootstrap"; // import bootstrap components
import Auth from "../utils/auth"; // import auth.js

const SignupForm = () => {
  // define SignupForm functional component
  const [createUser, { error }] = useMutation(ADD_USER); // use ADD_USER mutation
  const [userFormData, setUserFormData] = useState({
    // set userFormData state
    username: "", // set username to empty string
    email: "", // set email to empty string
    password: "", // set password to empty string
  });
  const [validated] = useState(false); // set validated state to false
  const [showAlert, setShowAlert] = useState(false); // set showAlert state to false

  const handleInputChange = (event) => {
    // define handleInputChange function accepting event variable
    const { name, value } = event.target; // define name and value variables as event.target
    setUserFormData({ ...userFormData, [name]: value }); // set userFormData state
  };

  const handleFormSubmit = async (event) => {
    // define handleFormSubmit function accepting event variable
    event.preventDefault(); // prevent default event behavior

    const form = event.currentTarget; // define form variable as event.currentTarget
    if (form.checkValidity() === false) {
      // if form.checkValidity() is false
      event.preventDefault(); // prevent default event behavior
      event.stopPropagation(); // stop event propagation
    }

    try {
      const { data } = await createUser({
        // define data variable as createUser() function
        variables: { ...userFormData }, // with userFormData state
      });

      Auth.login(data.addUser.token); // login with data.addUser.token
    } catch (err) {
      // catch error
      console.error("try error", err); // log try error
      console.log("mutation error", error); // log mutation error
      setShowAlert(true); // set showAlert state to true
    }

    setUserFormData({
      // set userFormData state
      username: "", // set username to empty string
      email: "", // set email to empty string
      password: "", // set password to empty string
    });
  };

  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        <Alert
          dismissible
          onClose={() => setShowAlert(false)}
          show={showAlert}
          variant="danger"
        >
          Something went wrong with your signup!
        </Alert>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="username">Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Your username"
            name="username"
            onChange={handleInputChange}
            value={userFormData.username}
            required
          />
          <Form.Control.Feedback type="invalid">
            Username is required!
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="email">Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Your email address"
            name="email"
            onChange={handleInputChange}
            value={userFormData.email}
            required
          />
          <Form.Control.Feedback type="invalid">
            Email is required!
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="password">Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Your password"
            name="password"
            onChange={handleInputChange}
            value={userFormData.password}
            required
          />
          <Form.Control.Feedback type="invalid">
            Password is required!
          </Form.Control.Feedback>
        </Form.Group>
        <Button
          disabled={
            !(
              userFormData.username &&
              userFormData.email &&
              userFormData.password
            )
          }
          type="submit"
          variant="success"
        >
          Submit
        </Button>
      </Form>
    </>
  );
};

export default SignupForm; // export SignupForm
