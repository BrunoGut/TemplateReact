import { ApplicationDetail } from "../components/ApplicationDetail";
import { SchedulePreviewModal } from "../components/ApplicationForms";
import { ApplicationsFilters } from "../components/ApplicationsFilters";
import { ApplicationsTable } from "../components/ApplicationsTable";
import { useAplicaciones } from "../hooks/useAplicaciones";
import { formatDate } from "../utils/applicationFormatters";
import "./AplicacionesPage.css";

export function AplicacionesPage() {
  const aplicaciones = useAplicaciones();
  const periodLabel = getPeriodLabel(
    aplicaciones.filters.dateFrom,
    aplicaciones.filters.dateTo,
  );

  return (
    <div className="applications-page">
      <header className="applications-header">
        <div>
          <p className="eyebrow">Modulo clinico</p>
          <h1>Aplicaciones intravitreas</h1>
        </div>
      </header>

      <div className="stats-strip">
        <ApplicationStat
          icon="bi-clock"
          label="Pendientes"
          value={aplicaciones.stats.pending}
          helper="Aplicaciones"
        />
        <ApplicationStat
          icon="bi-check2-circle"
          label="Aplicadas"
          value={aplicaciones.stats.applied}
          helper="Aplicaciones"
        />
        <ApplicationStat
          icon="bi-calendar2-week"
          label="Reprogramadas"
          value={aplicaciones.stats.rescheduled}
          helper="Aplicaciones"
        />
        <ApplicationStat
          icon="bi-clipboard2-pulse"
          label="Total del periodo"
          value={aplicaciones.stats.total}
          helper={periodLabel}
        />
      </div>

      {aplicaciones.error ? (
        <p className="app-alert is-error">{aplicaciones.error}</p>
      ) : null}
      {aplicaciones.success ? (
        <p className="app-alert is-success">{aplicaciones.success}</p>
      ) : null}

      <div className="applications-layout">
        <div className="main-stack">
          <ApplicationsFilters
            drugLookup={aplicaciones.drugLookup}
            filters={aplicaciones.filters}
            loading={aplicaciones.loading}
            patientLookup={aplicaciones.patientLookup}
            referenceLabels={aplicaciones.referenceLabels}
            onChange={aplicaciones.handleFilterChange}
            onDrugSearch={aplicaciones.handleDrugSearch}
            onFilterDrugSelect={aplicaciones.handleFilterDrugSelect}
            onFilterPatientSelect={aplicaciones.handleFilterPatientSelect}
            onPatientSearch={aplicaciones.handlePatientSearch}
            onRefresh={aplicaciones.loadApplications}
            onReset={aplicaciones.resetFilters}
          />
          <ApplicationsTable
            applications={aplicaciones.applications}
            loading={aplicaciones.loading}
            selectedApplication={aplicaciones.selectedApplication}
            onSelect={aplicaciones.setSelectedApplication}
          />
        </div>

        <ApplicationDetail
          dateEditOpen={aplicaciones.dateEditOpen}
          dateForm={aplicaciones.dateForm}
          detail={aplicaciones.detail}
          detailLoading={aplicaciones.detailLoading}
          drugLookup={aplicaciones.drugLookup}
          editForm={aplicaciones.editForm}
          lastByEye={aplicaciones.lastByEye}
          referenceLabels={aplicaciones.referenceLabels}
          saving={aplicaciones.saving}
          statusForm={aplicaciones.statusForm}
          onDrugSearch={aplicaciones.handleDrugSearch}
          onEditChange={aplicaciones.handleEditChange}
          onEditDrugSelect={aplicaciones.handleEditDrugSelect}
          onEditSubmit={aplicaciones.handleEditSubmit}
          onDateChange={aplicaciones.handleDateChange}
          onDateEditCancel={aplicaciones.handleDateEditCancel}
          onDateEditStart={aplicaciones.handleDateEditStart}
          onDateSubmit={aplicaciones.handleDateSubmit}
          onLoadLastByEye={aplicaciones.handleLoadLastByEye}
          onStatusChange={aplicaciones.handleStatusChange}
          onStatusSubmit={aplicaciones.handleStatusSubmit}
        />
      </div>

      <SchedulePreviewModal
        dateEdits={aplicaciones.schedulePreviewDateEdits}
        open={aplicaciones.schedulePreviewOpen}
        preview={aplicaciones.schedulePreview}
        saving={aplicaciones.saving}
        onCancel={aplicaciones.handleSchedulePreviewCancel}
        onConfirm={aplicaciones.handleSchedulePreviewConfirm}
        onDateChange={aplicaciones.handleSchedulePreviewDateChange}
      />
    </div>
  );
}

function ApplicationStat({ helper, icon, label, value }) {
  return (
    <div className="stat-item">
      <div className="stat-icon" aria-hidden="true">
        <i className={`bi ${icon}`} />
      </div>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{helper}</small>
      </div>
    </div>
  );
}

function getPeriodLabel(dateFrom, dateTo) {
  if (!dateFrom && !dateTo) {
    return "Sin periodo";
  }

  if (dateFrom && dateTo) {
    return `${formatDate(`${dateFrom}T00:00:00`)} - ${formatDate(`${dateTo}T00:00:00`)}`;
  }

  return dateFrom
    ? `Desde ${formatDate(`${dateFrom}T00:00:00`)}`
    : `Hasta ${formatDate(`${dateTo}T00:00:00`)}`;
}
