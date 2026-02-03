import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import logo from "../../assets/logo.png";
import { login, signup } from "../../firebase";
import netflix_spinner from "../../assets/netflix_spinner.gif";

function fakeLogin(email, password) {
  if (email === "demo@netflixclone.dev" && password === "demo123") {
    localStorage.setItem(
      "demoUser",
      JSON.stringify({
        email,
        name: "Demo User",
      }),
    );
    return true;
  }
  return false;
}

const Login = () => {
  const [signState, setSignState] = useState("Sign In");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const user_auth = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      // ✅ FIRST — Try demo login
      if (fakeLogin(email, password)) {
        setLoading(false);
        navigate("/", { replace: true });
        return;
      }

      // ✅ Otherwise use Firebase
      if (signState === "Sign In") {
        await login(email, password);
        navigate("/");
      } else {
        await signup(name, email, password);
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }

    setLoading(false);
  };

  return loading ? (
    <div className="login-spinner">
      <img src={netflix_spinner} alt="" />
    </div>
  ) : (
    <div className="login">
      <img src={logo} className="login-logo" alt="" />
      <div className="login-form">
        <h1>{signState}</h1>
        <form>
          {signState === "Sign Up" ? (
            <input
              value={name}
              onChange={(event) => {
                setName(event.target.value);
              }}
              type="text"
              placeholder="Your Name"
            />
          ) : (
            <></>
          )}
          <input
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
            type="email"
            placeholder="Email"
          />
          <input
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
            type="password"
            placeholder="Password"
          />
          <button onClick={user_auth} type="submit">
            {signState}
          </button>
          <button
            type="button"
            onClick={() => {
              fakeLogin("demo@netflixclone.dev", "demo123");
              navigate("/", { replace: true });
            }}
          >
            Use Demo Account
          </button>

          <div className="form-help">
            <div className="remember">
              <input type="checkbox" />
              <label htmlFor="">Remember Me</label>
            </div>
            <p>Need Help?</p>
          </div>
        </form>
        <div className="form-switch">
          {signState === "Sign In" ? (
            <p>
              New to Netflix?{" "}
              <span
                onClick={() => {
                  setSignState("Sign Up");
                }}
              >
                Sign Up Now
              </span>
            </p>
          ) : (
            <p>
              Already have account?{" "}
              <span
                onClick={() => {
                  setSignState("Sign In");
                }}
              >
                Sign In Now
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
