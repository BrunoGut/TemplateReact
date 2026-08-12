import { APPLICATION_STATUSES, EYES } from "../data/applicationEnums";
import { AutocompleteField } from "./AutocompleteField";

export function ApplicationsFilters({
  drugLookup,
  filters,
  loading,
  patientLookup,
  referenceLabels,
  onChange,
  onDrugSearch,
  onFilterDrugSelect,
  onFilterPatientSelect,
  onPatientSearch,
  onRefresh,
  onReset,
}) {
  function handleSubmit(event) {
    event.preventDefault();
    onRefresh();
  }

  return (
    <form className="applications-panel filters-panel" onSubmit={handleSubmit}>
      <div className="panel-title-row">
        <div>
          <p className="eyebrow">Busqueda</p>
          <h2>Filtros de busqueda</h2>
        </div>
        <div className="panel-actions">
          <button
            className="icon-button"
            type="button"
            onClick={onReset}
            title="Limpiar filtros"
          >
            <i className="bi bi-eraser" aria-hidden="true" />
          </button>
          <button
            className="icon-button is-primary"
            type="submit"
            disabled={loading}
            title="Buscar"
          >
            <i className="bi bi-search" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="filters-grid">
        <label className="app-field">
          <span>Desde</span>
          <input
            name="dateFrom"
            type="date"
            value={filters.dateFrom}
            onChange={onChange}
          />
        </label>
        <label className="app-field">
          <span>Hasta</span>
          <input
            name="dateTo"
            type="date"
            value={filters.dateTo}
            onChange={onChange}
          />
        </label>
        <label className="app-field">
          <span>DNI</span>
          <input
            name="dni"
            value={filters.dni}
            onChange={onChange}
            placeholder="12345678"
          />
        </label>
        <label className="app-field">
          <span>Historia clinica</span>
          <input
            name="medicalRecordNumber"
            value={filters.medicalRecordNumber}
            onChange={onChange}
            placeholder="HC-001"
          />
        </label>
        <div className="wide-field">
          <AutocompleteField
            key={`filter-patient-${filters.patientId}`}
            getOptionMeta={getPatientMeta}
            getOptionTitle={getPatientTitle}
            label="Paciente"
            loading={patientLookup.loading}
            name="patientId"
            options={patientLookup.options}
            placeholder="Nombre, apellido o DNI"
            selectedLabel={referenceLabels.filterPatient}
            value={filters.patientId}
            onSearch={onPatientSearch}
            onSelect={onFilterPatientSelect}
          />
        </div>
        <div className="wide-field">
          <AutocompleteField
            key={`filter-drug-${filters.drugId}`}
            getOptionMeta={getDrugMeta}
            getOptionTitle={getDrugTitle}
            label="Droga"
            loading={drugLookup.loading}
            name="drugId"
            options={drugLookup.options}
            placeholder="Nombre de la droga"
            selectedLabel={referenceLabels.filterDrug}
            value={filters.drugId}
            onSearch={onDrugSearch}
            onSelect={onFilterDrugSelect}
          />
        </div>
        <label className="app-field">
          <span>Ojo</span>
          <select name="eye" value={filters.eye} onChange={onChange}>
            <option value="">Todos</option>
            {EYES.map((eye) => (
              <option key={eye.value} value={eye.value}>
                {eye.label}
              </option>
            ))}
          </select>
        </label>
        <label className="app-field">
          <span>Estado</span>
          <select name="status" value={filters.status} onChange={onChange}>
            <option value="">Todos</option>
            {APPLICATION_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </form>
  );
}

function getPatientTitle(patient) {
  return patient.fullName || "Paciente sin nombre";
}

function getPatientMeta(patient) {
  return `DNI ${patient.dni || "-"} · HC ${patient.medicalRecordNumber || "-"}`;
}

function getDrugTitle(drug) {
  return drug.name || "Droga sin nombre";
}

function getDrugMeta(drug) {
  return drug.isActive ? "Activa" : "Inactiva";
}
