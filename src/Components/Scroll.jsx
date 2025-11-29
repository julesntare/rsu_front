import Scrollbar from "smooth-scrollbar";
import { useEffect } from "react";
import OverscrollPlugin from "smooth-scrollbar/plugins/overscroll";

const overscrollOptions = {
  enable: true,
  effect: "glow",
  damping: 0.15,
  maxOverscroll: 150,
  glowColor: "#fff",
  scrollableArea: "body",
};

//   const overscrollOptions = {
//     enable: true,
//     effect: 'glow',
//     damping: 0.1,
//     maxOverscroll: 200,
//     glowColor: '#222a2d',
//   };

const options = {
  damping: 0.07,
  plugins: {
    overscroll: { ...overscrollOptions },
  },
};

const Scroll = ({setShowButton, showButton}) => {
  useEffect(() => {
    Scrollbar.use(OverscrollPlugin);

    Scrollbar.init(document.body, options);

    Scrollbar.get(document.body).addListener((status) => {
      if (status.offset.y > 100) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    });

    return () => {
      if (Scrollbar) Scrollbar.destroy(document.body);
    };
  }, []);

  return null;
};

export default Scroll;
