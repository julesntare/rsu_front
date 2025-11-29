import React from "react";
import { Link } from "react-router-dom";
import "./Landing.css";
import classRoomSvg from '../../assets/img/classroom.svg';
import roomSearching from '../../assets/img/search-room.svg';
import productComponents from '../../assets/img/product-components.svg';
import startExploring from '../../assets/img/start-exploring.svg';

const Landing = () => {
  return (
    <>
      <header className="masthead">
        <div className="container px-5">
          <div className="row gx-5 align-items-center">
            <div className="col-lg-6">
              <div className="mb-5 mb-lg-0 text-center text-lg-start">
                <h1 className="display-1 lh-1 mb-3">
                  Rooms Space Utilization.
                </h1>
                <p className="lead fw-normal text-muted mb-5">
                We aim at improving CST Rooms better utilization. we want to provide real-time information for each public room at the campus.
                </p>
                <div className="d-flex flex-column flex-lg-row align-items-center">
                  <Link
                    className="btn btn-outline-primary py-3 px-4 rounded-pill"
                    to={{
                      pathname: "/buildings",
                    }}
                  >
                    Start Exploring
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="masthead-device-mockup">
                <img src={classRoomSvg} alt="classroom_svg" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <aside className="text-center bg-gradient-primary-to-secondary">
        <div className="container px-5">
          <div className="row gx-5 justify-content-center">
            <div className="col-xl-8">
              <div className="h2 fs-2 text-white mb-4">
                "An intuitive solution to a common campus' rooms issues that we all face,
                wrapped up in a single platform!"
              </div>
              <img
                src={roomSearching}
                alt="..."
                style={{ height: "5rem" }}
              />
            </div>
          </div>
        </div>
      </aside>

      <section id="features">
        <div className="container px-5">
          <div className="row gx-5 align-items-center">
            <div className="col-lg-8 order-lg-1 mb-5 mb-lg-0">
              <div className="container-fluid px-5">
                <div className="row gx-5">
                  <div className="col-md-6 mb-5">
                    <div className="text-center">
                      <i className="bi-alarm icon-feature text-gradient d-block mb-3"></i>
                      <h3 className="font-alt">GT synchronization</h3>
                      <p className="text-muted mb-0">
                        Able to  synchronize with General Timetable to get real-time information about the rooms.
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6 mb-5">
                    <div className="text-center">
                      <i className="bi-building icon-feature text-gradient d-block mb-3"></i>
                      <h3 className="font-alt">Extent Rooms Information</h3>
                      <p className="text-muted mb-0">
                        Able to get more information about the rooms such as the number of seats, resources, real-time use, bookings, future use and etc.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-5 mb-md-0">
                    <div className="text-center">
                      <i className="bi-view-stacked icon-feature text-gradient d-block mb-3"></i>
                      <h3 className="font-alt">Booking Rooms</h3>
                      <p className="text-muted mb-0">
                        Able to book rooms for future free time use.
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="text-center">
                      <i className="bi-map-fill icon-feature text-gradient d-block mb-3"></i>
                      <h3 className="font-alt">Mapping Campus</h3>
                      <p className="text-muted mb-0">
                        Able to map the campus and get the location of the rooms.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 order-lg-0">
              <div className="features-device-mockup">
                <img src={productComponents} alt="..." />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-light">
        <div className="container px-5">
          <div className="row gx-5 align-items-center justify-content-center justify-content-lg-between">
            <div className="col-12 col-lg-5">
              <h2 className="display-4 lh-1 mb-4">
              Excited?
              <br />
              Start Exploring.
              </h2>
              <p className="lead fw-normal text-muted mb-5 mb-lg-0">
                
            <Link
              className="btn btn-outline-dark py-3 px-4 rounded-pill"
              to={{
                pathname: "/buildings",
              }}
            >
              Start Exploring
            </Link>
              </p>
            </div>
            <div className="col-sm-8 col-md-6">
              <div className="px-5 px-sm-0">
                <img
                  className="img-fluid rounded-circle"
                  src={startExploring}
                  alt="..."
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Landing;
