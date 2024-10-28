import { Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import NavigationBar from './NavigationBar';
import Sidebar from './SideBar';
import Footer from './Footer';
import FixedPlugin from './FixedPlugin';
import routes from './routes';
// import PrivateRoute from '../../routers/PrivateRoutes';
import defaultImage from '../../assets/img/sidebar-3.jpg';

const MainLayout = () => {
  const [hasImage, setHasImage] = useState(true);
  const [color, setColor] = useState("");
  const [image, setImage] = useState(defaultImage);
  // const mainPanel = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const [sidebarShow, setSidebarShow] = useState(false);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    if (document.scrollingElement) {
      document.scrollingElement.scrollTop = 0;
    }
    // if (mainPanel.current) {
    //   mainPanel.current.scrollTop = 0;
    // }
  }, [location]);

  const handleSidebarToggle = () => setSidebarShow(true);
  const handleSidebarClose = () => setSidebarShow(false);

  // interface RouteType {
  //   isPrivate?: any;
  //   layout: string;
  //   path: string;
  //   component: React.FC<{}> | (() => JSX.Element);
  // }

  // const getRoutes = (routes: RouteType[]) => {
  //   return routes.map((prop: RouteType, key) => {
  //     if (prop.layout === "/admin") {
  //       return prop.isPrivate ? (
  //         <Route
  //           path={prop.path}
  //           element={<PrivateRoute component={prop.component} />}
  //           key={key}
  //         />
  //       ) : (
  //         <Route
  //           path={prop.path}
  //           element={<prop.component />}
  //           key={key}
  //         />
  //       );
  //     }
  //     return null;
  //   });
  // };

  return (
    <>
      <Sidebar
        show={sidebarShow}
        handleClose={handleSidebarClose}
        color={color}
        image={hasImage ? image : ""}
        routes={routes}
      />
      <NavigationBar mobileSidebarToggle={handleSidebarToggle} />
      {/* <div className='mx-4' ref={mainPanel}
      style={{ overflowY: 'auto', width: 'auto', height: '100vh', minHeight: '50vh' }}
      >
        <div className="content">
          <Routes>
            {getRoutes(routes)}
          </Routes>
        </div>
      </div> */}
      <div style={{ overflowY: 'auto', width: 'auto', height: '100vh', minHeight: '50vh' }}>
        <Outlet />
      </div>
      <Footer />
      <FixedPlugin
        hasImage={hasImage}
        setHasImage={() => setHasImage(!hasImage)}
        color={color}
        setColor={(color) => setColor(color)}
        image={image}
        setImage={(image) => setImage(image)}
      />
    </>
  );
};

export default MainLayout;