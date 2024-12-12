import { Link } from "react-router-dom";
import { createRef, useState } from "react";
import { useStateContext } from "../context/ContextProvider.jsx";

export default function Login() {
  const emailRef = createRef();
  const passwordRef = createRef();
  const { setUser, setToken } = useStateContext();
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (ev) => {
    ev.preventDefault();
    setMessage(null); // Clear previous messages
    setLoading(true); // Set loading state

    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      const response = await fetch("https://your-api-url.com/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 422) {
          setMessage(errorData.message || "Invalid credentials.");
        } else {
          setMessage("An error occurred. Please try again.");
        }
        return;
      }

      const data = await response.json();
      setUser(data.user);
      setToken(data.token);
    } catch (error) {
      setMessage("Unable to connect to the server. Please try again later.");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="login-signup-form animated fadeInDown">
      <div className="form">
        <form onSubmit={onSubmit}>
          <h1 className="title">Login into your account</h1>

          {message && <div className="alert"><p>{message}</p></div>}

          <input
            ref={emailRef}
            type="email"
            placeholder="Email"
            required
          />
          <input
            ref={passwordRef}
            type="password"
            placeholder="Password"
            required
          />
          <button
            className="btn btn-block"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <p className="message">
            Not registered? <Link to="/signup">Create an account</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
