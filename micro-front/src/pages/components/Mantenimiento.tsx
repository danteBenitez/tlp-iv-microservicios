import maintenance from "../../assets/img/maintenance.webp";

export function Mantenimiento() {
  return (
    <div className="d-flex justify-content-center align-items-center flex-column">
      <img src={maintenance} style={{ maxWidth: 700, minWidth: 700 }} />
      <h2 className="fs-1 display-2 fw-bold">Servicio en mantenimiento</h2>
      <p className="fs-3">Intente de nuevo más tarde</p>
    </div>
  );
}
