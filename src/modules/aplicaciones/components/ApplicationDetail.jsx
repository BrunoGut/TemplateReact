import { APPLICATION_STATUSES } from "../data/applicationEnums";
import {
  getDataOriginLabel,
  getEyeLabel,
  getStatusLabel,
} from "../data/applicationEnums";
import { formatDate, formatDateTime } from "../utils/applicationFormatters";

export function ApplicationDetail({
  dateEditOpen,
  dateForm,
  detail,
  detailLoading,
  lastByEye,
  saving,
  statusForm,
  onDateChange,
  onDateEditCancel,
  onDateEditStart,
  onDateSubmit,
  onLoadLastByEye,
  onStatusChange,
  onStatusSubmit,
}) {
  return (
    <aside className="detail-stack">
      <section className="applications-panel detail-panel">
        <div className="panel-title-row">
          <div>
            <p className="eyebrow">Detalle</p>
            <h2>Detalle de aplicacion</h2>
          </div>
          <button
            className="icon-button"
            type="button"
            onClick={onLoadLastByEye}
            disabled={saving}
            title="Ultimas por ojo"
          >
            <i className="bi bi-clock-history" aria-hidden="true" />
          </button>
        </div>

        {detailLoading ? (
          <p className="muted-text">Cargando detalle...</p>
        ) : null}
        {!detail && !detailLoading ? (
          <p className="muted-text">Seleccioná una aplicacion del listado.</p>
        ) : null}
        {detail ? (
          <div className="detail-content">
            <div>
              <h3>{detail.patientFullName}</h3>
              <p>
                DNI {detail.patientDni} · HC {detail.patientMedicalRecordNumber}
              </p>
            </div>
            <dl className="detail-list">
              <div className="editable-date-detail">
                <dt>Fecha</dt>
                <dd>
                  <span>{formatDate(detail.applicationDate)}</span>
                  <button
                    className="inline-icon-button"
                    type="button"
                    disabled={saving}
                    onClick={onDateEditStart}
                    title="Modificar fecha"
                  >
                    <i className="bi bi-pencil" aria-hidden="true" />
                  </button>
                </dd>
              </div>
              <div>
                <dt>Droga</dt>
                <dd>{detail.drugName}</dd>
              </div>
              <div>
                <dt>Ojo</dt>
                <dd>{getEyeLabel(detail.eye)}</dd>
              </div>
              <div>
                <dt>Estado</dt>
                <dd>{getStatusLabel(detail.status)}</dd>
              </div>
              <div>
                <dt>Origen</dt>
                <dd>{getDataOriginLabel(detail.dataOrigin)}</dd>
              </div>
              <div>
                <dt>Actualizado</dt>
                <dd>{formatDateTime(detail.updatedAt)}</dd>
              </div>
            </dl>
            {dateEditOpen ? (
              <DateEditForm
                form={dateForm}
                saving={saving}
                onCancel={onDateEditCancel}
                onChange={onDateChange}
                onSubmit={onDateSubmit}
              />
            ) : null}
            {detail.notes ? <p className="notes-box">{detail.notes}</p> : null}
          </div>
        ) : null}
      </section>

      {lastByEye ? <LastByEyePanel lastByEye={lastByEye} /> : null}

      {detail ? (
        <StatusForm
          form={statusForm}
          saving={saving}
          onChange={onStatusChange}
          onSubmit={onStatusSubmit}
        />
      ) : null}
    </aside>
  );
}

function DateEditForm({ form, saving, onCancel, onChange, onSubmit }) {
  return (
    <form className="date-edit-form" onSubmit={onSubmit}>
      <label className="app-field">
        <span>Nueva fecha</span>
        <input
          required
          name="newDate"
          type="date"
          value={form.newDate}
          onChange={onChange}
        />
      </label>
      <label className="app-field">
        <span>Motivo</span>
        <input
          maxLength="500"
          name="changeReason"
          value={form.changeReason}
          onChange={onChange}
        />
      </label>
      <label className="app-field full-field">
        <span>Notas</span>
        <textarea
          maxLength="1000"
          name="notes"
          value={form.notes}
          onChange={onChange}
        />
      </label>
      <div className="date-edit-actions">
        <button
          className="secondary-action"
          type="button"
          disabled={saving}
          onClick={onCancel}
        >
          Cancelar
        </button>
        <button className="primary-action" type="submit" disabled={saving}>
          Confirmar fecha
        </button>
      </div>
    </form>
  );
}

function LastByEyePanel({ lastByEye }) {
  return (
    <section className="applications-panel">
      <div className="panel-title-row">
        <div>
          <p className="eyebrow">Paciente</p>
          <h2>Ultimas por ojo</h2>
        </div>
      </div>
      <div className="last-eye-grid">
        <LastEyeItem title="OD" application={lastByEye.od} />
        <LastEyeItem title="OI" application={lastByEye.oi} />
      </div>
    </section>
  );
}

function LastEyeItem({ title, application }) {
  return (
    <article className="last-eye-item">
      <h3>{title}</h3>
      {application ? (
        <>
          <strong>{formatDate(application.applicationDate)}</strong>
          <span>{application.drugName}</span>
          <span>{getStatusLabel(application.status)}</span>
        </>
      ) : (
        <span>Sin registros</span>
      )}
    </article>
  );
}

function StatusForm({ form, saving, onChange, onSubmit }) {
  return (
    <form className="applications-panel" onSubmit={onSubmit}>
      <div className="panel-title-row">
        <div>
          <p className="eyebrow">Estado</p>
          <h2>Actualizar estado</h2>
        </div>
        <button
          className="icon-button is-primary"
          type="submit"
          disabled={saving}
          title="Guardar"
        >
          <i className="bi bi-check2" aria-hidden="true" />
        </button>
      </div>
      <div className="form-grid">
        <label className="app-field">
          <span>Nuevo estado</span>
          <select
            required
            name="newStatus"
            value={form.newStatus}
            onChange={onChange}
          >
            {APPLICATION_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </label>
        <label className="app-field">
          <span>Nueva fecha</span>
          <input
            name="newDate"
            type="date"
            value={form.newDate}
            onChange={onChange}
          />
        </label>
        <label className="app-field full-field">
          <span>Motivo</span>
          <input
            maxLength="500"
            name="changeReason"
            value={form.changeReason}
            onChange={onChange}
          />
        </label>
        <label className="app-field full-field">
          <span>Notas</span>
          <textarea
            maxLength="1000"
            name="notes"
            value={form.notes}
            onChange={onChange}
          />
        </label>
      </div>
    </form>
  );
}
