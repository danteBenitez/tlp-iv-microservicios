import { Dropdown, Button, Form } from "react-bootstrap";
import sideBarImage1 from "../../assets/img/sidebar-1.jpg";
import sideBarImage2 from "../../assets/img/sidebar-2.jpg";
import sideBarImage3 from "../../assets/img/sidebar-3.jpg";
import sideBarImage4 from "../../assets/img/sidebar-4.jpg";
import { FaCog, FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

interface FixedPluginProps {
  hasImage: boolean;
  setHasImage: (hasImage: boolean) => void;
  color: string;
  setColor: (color: string) => void;
  image: string;
  setImage: (image: string) => void;
}

function FixedPlugin({
  hasImage,
  setHasImage,
  color,
  setColor,
  image,
  setImage
}: FixedPluginProps) {
  console.log('image:', image);
  const colors = ["", "black", "blue", "green", "orange", "red", "purple"];

  return (
    <div className="rounded-3 position-fixed z-index-1030 d-flex align-items-center"
      style={{ 
        boxShadow: '0 0 25px 0 rgba(0, 0, 0, 0.9)', 
        right: '20px', 
        transform: 'translateY(-50%)', 
        position: 'fixed',
        zIndex: 1050,
        top: '20%',
      }}
    >
      <Dropdown
        className="w-100">
        <Dropdown.Toggle
          variant="secondary"
          id="dropdown-basic"
        ><FaCog />
        </Dropdown.Toggle>
        <Dropdown.Menu
          className="p-1 custom-dropdown-menu"
          style={{
            width: '50vh',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            flexDirection: 'column',
          }}
        >
          <li className="border rounded-3 px-5 pt-3 d-flex align-content-end justify-content-between">
            <p>Background Image</p>
            <Form.Check
              type="switch"
              checked={hasImage}
              onChange={(e) => setHasImage(e.target.checked)}
            />
          </li>
          <li className="border rounded-3 text-center">
            <p>Filters</p>
            {colors.map((colorOption, index) => (
              <div
                className="d-inline-block align-items-center mb-2"
                key={index}
                id={`colorFilter${index}`}
                onClick={() => setColor(colorOption)}
                style={{
                  width: '20px',
                  height: '20px',
                  margin: '0 5px',
                  border: `3px solid var(--bs-${colorOption})`,
                  borderRadius: '50%',
                  backgroundColor: color === colorOption ? `var(--bs-${colorOption})` : 'transparent',
                  cursor: 'pointer',
                  padding: '1',
                }}
              ></div>
            ))}
          </li>
          <li className="border rounded text-center p-1">Sidebar Images</li>
          <div
            style={{ width: 'auto', height: '100px' }}
            className="d-flex container-fluid h-100 align-items-center mt-3 border border-1 rounded p-1"
          >
            <Button
              style={{ width: '100%', height: '100%' }}
              variant="light"
              className={`p-0 m-1 border-3 ${image === sideBarImage1 ? "active" : ""}`}
              onClick={() => setImage(sideBarImage1)}
            >
              <img src={sideBarImage1} alt="..." className="img-fluid" />
            </Button>
            <Button
              style={{ width: '100%', height: '100%' }}
              variant="light"
              className={`p-0 m-1 ${image === sideBarImage2 ? "active" : ""}`}
              onClick={() => setImage(sideBarImage2)}
            >
              <img src={sideBarImage2} alt="..." className="img-fluid" />
            </Button>
            <Button
              style={{ width: '100%', height: '100%' }}
              variant="light"
              className={`p-0 m-1 ${image === sideBarImage3 ? "active" : ""}`}
              onClick={() => setImage(sideBarImage3)}
            >
              <img src={sideBarImage3} alt="..." className="img-fluid" />
            </Button>
            <Button
              style={{ width: '100%', height: '100%' }}
              variant="light"
              className={`p-0 m-1 ${image === sideBarImage4 ? "active" : ""}`}
              onClick={() => setImage(sideBarImage4)}
            >
              <img src={sideBarImage4} alt="..." className="img-fluid" />
            </Button>
          </div>
          <li className="text-center" id="">
            Thank you for sharing!
          </li>
          <li className="d-flex p-1 mx-5 justify-content-between mb-4">
            <Button
              className="btn-social btn-outline btn-round sharrre"
              id="twitter"
              variant="twitter"
            >
              <FaTwitter />
            </Button>
            <Button
              className="btn-social btn-outline btn-round sharrre"
              id="facebook"
              variant="facebook"
            >
              <FaFacebook />
            </Button>
            <Button
              className="btn-social btn-outline btn-round sharrre"
              id="instagram"
              variant="instagram"
            >
              <FaInstagram />
            </Button>
          </li>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}

export default FixedPlugin;