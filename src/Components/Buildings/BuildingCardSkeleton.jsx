import React from "react";
import "./BuildingCardSkeleton.scss";

const BuildingCardSkeleton = () => {
  return (
    <div className="card border building-card skeleton-card m-1 mt-3 p-0 col-12 col-md-4 col-lg-3">
      <div className="skeleton skeleton-image"></div>
      <div className="skeleton skeleton-title mx-auto my-2"></div>
      <div className="skeleton skeleton-description mx-2 my-2"></div>
      <div className="skeleton skeleton-description-short mx-2 mb-2"></div>
      <div className="card-body p-2">
        <div className="w-100 d-flex justify-content-evenly text-dark pb-3">
          <span className="d-flex justify-content-center align-items-center me-2">
            <div className="skeleton skeleton-icon me-3"></div>
            <div className="skeleton skeleton-text"></div>
          </span>
          <span className="d-flex justify-content-center align-items-center me-2">
            <div className="skeleton skeleton-icon me-3"></div>
            <div className="skeleton skeleton-text"></div>
          </span>
        </div>
        <div className="w-100 d-flex flex-column justify-content-evenly text-dark pb-3">
          <div className="skeleton skeleton-label mb-2"></div>
          <div className="skeleton skeleton-near-places"></div>
        </div>
        <div className="py-1 d-flex flex-column justify-content-center btn-box">
          <div className="skeleton skeleton-button mb-2"></div>
          <div className="skeleton skeleton-button"></div>
        </div>
      </div>
    </div>
  );
};

export default BuildingCardSkeleton;
