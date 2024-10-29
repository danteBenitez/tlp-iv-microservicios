import { Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import NavigationBar from './NavigationBar';
import Sidebar from './SideBar';
import Footer from './Footer';
import FixedPlugin from './FixedPlugin';
import routes from './routes';
import defaultImage from '../../assets/img/sidebar-3.jpg';

const MainLayout = () => {
  const [hasImage, setHasImage] = useState(true);
  const [color, setColor] = useState("");
  const [image, setImage] = useState(defaultImage);
  const location = useLocation();
  const [sidebarShow, setSidebarShow] = useState(false);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    if (document.scrollingElement) {
      document.scrollingElement.scrollTop = 0;
    }
  }, [location]);

  const handleSidebarToggle = () => setSidebarShow(true);
  const handleSidebarClose = () => setSidebarShow(false);

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