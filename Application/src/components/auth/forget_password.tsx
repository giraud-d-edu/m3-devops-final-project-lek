import "./sign.css";
import "../../style/global.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { AuthService } from "../../services/auth_service";
import { SigninFormProps, ValidationErrors } from "../../models/auth";
import icon from "/images/icons/icon.png";

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const _authService: AuthService = new AuthService();
  const [error, setError] = useState<ValidationErrors | null>(null);
  const navigate = useNavigate();

  // --------------------------- //
  // -----------Send------------ //
  // --------------------------- //

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (password1 === password2) {
      const userData: SigninFormProps = {
        login: email,
        password: password1,
      };
      const errors: ValidationErrors =
        _authService.validateResetPassword(userData);
      if (Object.keys(errors).length === 0) {
        try {
          const response = await _authService.resetPassword(userData);
          if (response.data) {
            navigate("/signin");
          } else {
            setError({ other: "Invalid credentials" });
          }
        } catch (error: any) {
          setError({
            other: "An error occured while trying to reset password",
          });
        }
      } else {
        setError(errors);
      }
    } else {
      setError({ other: "Passwords do not matchs" });
    }
  };

  return (
    <main className="container-sign flex-row" role="main">
      <section
        className="container-left-section flex-col"
        aria-label="App presentation"
      >
        <div className="flex-row container-logo">
          <img src={icon} />
          <h5>
            Aym<span>Labo</span>
          </h5>
        </div>
        <div className="flex-col container-content">
          <h2>Improve your aim</h2>
          <p>
            By playing to this game you will improve by 5 times your level in
            any shooting game
          </p>
        </div>
        <Link
          aria-label="Switch to signin"
          role="button"
          className="button-sign button-sign-white"
          to={"/"}
          tabIndex={5}
        >
          Sign In
        </Link>
      </section>
      <span className="separation-sign"></span>
      <section
        className="flex-col container-right-section"
        aria-label="SignIn section"
      >
        <div className="flex-col container-header-form ">
          <h1>Reset Password</h1>
          <h2>{"Dont't forget it next time :)"}</h2>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex-col container-form"
          role="form"
          aria-label="Form signin"
        >
          <fieldset className="flex-col">
            <input
              aria-label="Input email"
              tabIndex={0}
              style={{
                borderColor: error?.email ? "var(--error-code)" : "transparent",
              }}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              type="email"
            />
            {error?.email && (
              <p aria-label="email error" className="error-message">
                {error.email}
              </p>
            )}
          </fieldset>
          <fieldset className="flex-col">
            <input
              aria-label="Input password"
              tabIndex={2}
              style={{
                borderColor: error?.password
                  ? "var(--error-code)"
                  : "transparent",
              }}
              onChange={(e) => setPassword1(e.target.value)}
              placeholder="New password"
              type="password"
            />
            {error?.password && (
              <p aria-label="password error" className="error-message">
                {error.password}
              </p>
            )}
          </fieldset>
          <fieldset className="flex-col">
            <input
              aria-label="Input confirm password"
              tabIndex={3}
              style={{
                borderColor: error?.password
                  ? "var(--error-code)"
                  : "transparent",
              }}
              onChange={(e) => setPassword2(e.target.value)}
              placeholder="Confirm new password"
              type="password"
            />
            {error?.password && (
              <p aria-label="password error" className="error-message">
                {error.password}
              </p>
            )}
          </fieldset>

          <button
            tabIndex={4}
            onClick={(e) => handleSubmit}
            role="button"
            aria-label="submit reset form"
            className="button-sign-black button-sign"
          >
            Reset
          </button>
          {error?.other && (
            <p aria-label="others error" className="error-message">
              {error.other}
            </p>
          )}
        </form>
      </section>
    </main>
  );
};

export default ResetPassword;
