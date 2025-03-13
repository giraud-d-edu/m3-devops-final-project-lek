import "./home.css";
import "../../style/global.css";
import { Nav } from "../../components/nav/nav";
import jeune_entrepeneur from "/images/others/jeune-entrepreneur.png";
import faker from "/images/others/faker.png";
import labz from "/images/others/labz.png";

const Home: React.FC = () => {
  return (
    <>
      <Nav />
      <main className="container-home">
        <section className="flex-col container-content">
          <article className="container-header-home flex-col">
            <h1>
              Aym<span>labo</span>
            </h1>
            <div className="flex-row container-entrepreneur">
              <h2>
                Join over 30 million players improving their skills in
                competitive gaming. Aymlabo is the best way to get better at the
                games you love to compete
              </h2>
              <img src={jeune_entrepeneur} />
            </div>
          </article>
          <article className="flex-col container-gamer">
            <h2>Built by gamers for gamers</h2>
            <p>
              As gamers first, we understand there are a lot of games out there
              and they all are a little bit different. Which is why Aymlabo
              offers a comprehensive set of tools to improve your aim,
              regardless of which FPS you play. This includes official Aimlabs
              tasks and playlists that we create for ourselves, but also ones
              created by our thriving community. Dive into specifically designed
              aim training exercises to master the art of flicking, tracking,
              speed, perception, and cognition and track your progress in
              Aimlabs while you rank up in the game you love.
            </p>
          </article>
          <article className=" container-formation">
            <div className="flex-row container-images">
              <img src={faker} className="faker" />
              <img src={labz} className="leS" />
              <span className="filter-formation" />
            </div>
            <div className="flex-col container-informations">
              <h2>Learn from the best of the best</h2>
              <p>
                Whether you choose from over 500+ lessons from over 60+ pros, or
                on-demand 1:1 coaching with the top 1%, you will take your
                gaming expertise to new levels across various game genres.
              </p>
            </div>
          </article>
        </section>
      </main>
    </>
  );
};

export default Home;
