import "./profile.css";
import "../../style/global.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StatProfile } from "../../components/stats/stat_profile";
import { ValidationErrors } from "../../models/auth";
import { ProfileService } from "../../services/profile_service";
import { Store } from "../../services/store";
import { ProfileProps } from "../../models/profile";
import { StatProfileProps } from "../../models/stat";
import { Nav } from "../../components/nav/nav";
import { AvatarModal } from "../../components/avatar/avatar";
import bear from "/images/avatar/bear.png";
import panda from "/images/avatar/panda.png";
import rabbit from "/images/avatar/rabbit.png";

const Profile: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("panda.png");
  const [error, setError] = useState<ValidationErrors | null>(null);
  const _profileService: ProfileService = new ProfileService();
  const [stats, setStats] = useState<Array<StatProfileProps>>([]);
  const _store: Store = new Store("userData");
  const [jwt, setJwt] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // --------------------------- //
  // ---------Getters----------- //
  // --------------------------- //

  const getProfileInfos = () => {
    _profileService.getProfileCurrentUser(jwt).then((datas) => {
      setAvatar(datas.avatar);
      setEmail(datas.email);
      setUsername(datas.pseudo);
    });
  };

  const getStatsUser = () => {
    _profileService.getProfileStats(jwt).then((datas) => {
      setStats(datas);
    });
  };

  useEffect(() => {
    if (jwt.length > 0) {
      getProfileInfos();
      getStatsUser();
    }
  }, [jwt]);

  // ---------------------------- //
  // ---------Sign out----------- //
  // ---------------------------- //

  const Logout = () => {
    _store.clear();
    navigate("/");
  };

  // -------------------------- //
  // ---------Submit----------- //
  // -------------------------- //

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const userData: ProfileProps = {
      pseudo: username,
      email: email,
      avatar: avatar,
    };
    const errors: ValidationErrors = _profileService.validateProfile(userData);
    if (Object.keys(errors).length === 0) {
      try {
        const response = await _profileService.submitProfileEdit(userData, jwt);
        if (response.data) {
          getProfileInfos();
        } else {
          setError({ other: "Invalid credentials" });
        }
      } catch (error: any) {
        setError({ other: "An error occured while trying to update profile" });
      }
    } else {
      setError(errors);
    }
  };

  const handleEditAvatar = (data: string) => {
    setAvatar(data);
    setShowModal(false);
  };
  // -------------------------- //
  // -----------JWT------------ //
  // -------------------------- //

  useEffect(() => {
    const jwt_store = _store.load();
    if (jwt_store) {
      setJwt(jwt_store);
    }
  }, [jwt]);

  return (
    <>
      <Nav />
      <main className="container-profile-view flex-row" role="main">
        <div className="container-profile flex-row">
          <section className="flex-col container-informations">
            <img
              className="avatar"
              src={
                avatar === "bear.png"
                  ? bear
                  : avatar === "rabbit.png"
                  ? rabbit
                  : panda
              }
              alt="user_avatar"
            />
            <button className="edit-avatar" onClick={() => setShowModal(true)}>
              Change avatar
            </button>
            <form className="flex-col form-profile" onSubmit={handleSubmit}>
              <fieldset className="flex-col">
                <label htmlFor="username">Username</label>
                <input
                  style={{
                    borderColor: error?.username
                      ? "var(--error-code)"
                      : "transparent",
                  }}
                  type="text"
                  id="username"
                  value={username}
                  placeholder="Enter a username"
                  onChange={(e) => setUsername(e.target.value)}
                />
                {error?.username && (
                  <p aria-label="username error" className="profile-error">
                    {error.username}
                  </p>
                )}
              </fieldset>
              <fieldset className="flex-col">
                <label htmlFor="email">Email</label>
                <input
                  style={{
                    borderColor: error?.email
                      ? "var(--error-code)"
                      : "transparent",
                  }}
                  id="email"
                  type="email"
                  value={email}
                  placeholder="Enter an email"
                  onChange={(e) => setEmail(e.target.value)}
                />
                {error?.email && (
                  <p aria-label="username error" className="profile-error">
                    {error.email}
                  </p>
                )}
              </fieldset>
              <button onClick={(e) => handleSubmit}>Submit</button>

              {error?.avatar && (
                <p aria-label="username error" className="profile-error">
                  {error.avatar}
                </p>
              )}
              {error?.other && (
                <p aria-label="username error" className="profile-error">
                  {error.other}
                </p>
              )}
            </form>
            <button className="logout" onClick={Logout}>
              Sign out
            </button>
          </section>

          <section className="container-stats ">
            {Object.keys(stats).length > 0 &&
              Object.keys(stats).map((key: any, index: number) => (
                <StatProfile
                  title={key}
                  value={String(stats[key])}
                  key={index}
                />
              ))}
          </section>
        </div>
      </main>
      {showModal && (
        <AvatarModal callback={handleEditAvatar} currentAvatar={avatar} />
      )}
    </>
  );
};

export default Profile;
