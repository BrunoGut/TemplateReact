import { useMemo } from "react";
import {
  STATUS_BADGE_CLASS_BY_VALUE,
  getEyeLabel,
  getStatusLabel,
} from "../data/applicationEnums";
import { formatDate } from "../utils/applicationFormatters";

export function ApplicationsTable({
  applications,
  loading,
  selectedApplication,
  onSelect,
}) {
  const sortedApplications = useMemo(
    () =>
      [...applications].sort((currentApplication, nextApplication) => {
        const currentTime = new Date(
          currentApplication.applicationDate,
        ).getTime();
        const nextTime = new Date(nextApplication.applicationDate).getTime();

        return (
          (Number.isNaN(nextTime) ? -Infinity : nextTime) -
          (Number.isNaN(currentTime) ? -Infinity : currentTime)
        );
      }),
    [applications],
  );

  return (
    <section className="applications-panel table-panel">
      <div className="panel-title-row">
        <div>
          <p className="eyebrow">Listado</p>
          <div className="title-with-pill">
            <h2>Listado de aplicaciones</h2>
            <span>{applications.length} resultados</span>
          </div>
        </div>
        {loading ? <span className="loading-pill">Cargando</span> : null}
      </div>

      <div className="applications-table-wrap">
        <table className="applications-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Paciente</th>
              <th>DNI</th>
              <th>Droga</th>
              <th>Ojo</th>
              <th>Estado</th>
              <th aria-label="Seleccionar" />
            </tr>
          </thead>
          <tbody>
            {sortedApplications.map((application) => (
              <tr
                key={application.id}
                className={
                  selectedApplication?.id === application.id
                    ? "selected-row"
                    : ""
                }
              >
                <td>{formatDate(application.applicationDate)}</td>
                <td>
                  <strong>{application.patientFullName}</strong>
                  <span>{application.patientMedicalRecordNumber}</span>
                </td>
                <td>{application.patientDni}</td>
                <td>{application.drugName}</td>
                <td>{getEyeLabel(application.eye)}</td>
                <td>
                  <span
                    className={`status-badge ${
                      STATUS_BADGE_CLASS_BY_VALUE[application.status] ?? ""
                    }`}
                  >
                    {getStatusLabel(application.status)}
                  </span>
                </td>
                <td>
                  <button
                    className="icon-button"
                    type="button"
                    onClick={() => onSelect(application)}
                    title="Ver detalle"
                  >
                    <i className="bi bi-arrow-right" aria-hidden="true" />
                  </button>
                </td>
              </tr>
            ))}
            {!loading && sortedApplications.length === 0 ? (
              <tr>
                <td className="empty-cell" colSpan="7">
                  No hay aplicaciones para los filtros seleccionados.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
