import {
  APPLICATION_STATUSES,
  DATA_ORIGINS,
  EYES,
  getDataOriginLabel,
  getEyeLabel,
  getStatusLabel,
} from '../data/applicationEnums'
import { formatDate } from '../utils/applicationFormatters'
import { AutocompleteField } from './AutocompleteField'

export function CalculationForm({
  form,
  result,
  saving,
  onChange,
  onSubmit,
}) {
  return (
    <form className="applications-panel" onSubmit={onSubmit}>
      <div className="panel-title-row">
        <div>
          <p className="eyebrow">Calculo</p>
          <h2>Proxima fecha</h2>
        </div>
        <button className="icon-button is-primary" type="submit" disabled={saving} title="Calcular">
          <i className="bi bi-calculator" aria-hidden="true" />
        </button>
      </div>
      <div className="compact-grid">
        <label className="app-field">
          <span>Ultima aplicacion</span>
          <input
            required
            name="lastApplicationDate"
            type="date"
            value={form.lastApplicationDate}
            onChange={onChange}
          />
        </label>
        <label className="app-field">
          <span>Semanas</span>
          <input
            required
            max="52"
            min="1"
            name="weeksToNextApplication"
            type="number"
            value={form.weeksToNextApplication}
            onChange={onChange}
          />
        </label>
      </div>
      {result ? (
        <dl className="calculation-result">
          <div>
            <dt>Base</dt>
            <dd>{formatDate(result.baseCalculatedDate)}</dd>
          </div>
          <div>
            <dt>Jueves anterior</dt>
            <dd>{formatDate(result.previousThursdayCalculated)}</dd>
          </div>
          <div>
            <dt>Jueves siguiente</dt>
            <dd>{formatDate(result.nextThursdayCalculated)}</dd>
          </div>
          <div>
            <dt>Seleccionada</dt>
            <dd>{formatDate(result.selectedDate)}</dd>
          </div>
        </dl>
      ) : null}
    </form>
  )
}

export function CreateApplicationForm({
  calculationResult,
  drugLookup,
  form,
  patientLookup,
  referenceLabels,
  saving,
  onChange,
  onCreateDrugSelect,
  onCreatePatientSelect,
  onCalculatedDateSelect,
  onDrugSearch,
  onPatientSearch,
  onSubmit,
}) {
  const canSave = Boolean(calculationResult)

  return (
    <form className="applications-panel" onSubmit={onSubmit}>
      <div className="panel-title-row">
        <div>
          <p className="eyebrow">Registro</p>
          <h2>Alta individual</h2>
        </div>
        {canSave ? (
          <button className="primary-action" type="submit" disabled={saving}>
            Guardar
          </button>
        ) : null}
      </div>
      <div className="form-grid">
        <div className="wide-field">
          <AutocompleteField
            key={`create-patient-${form.patientId}`}
            required
            getOptionMeta={getPatientMeta}
            getOptionTitle={getPatientTitle}
            label="Paciente"
            loading={patientLookup.loading}
            name="patientId"
            options={patientLookup.options}
            placeholder="Nombre, apellido o DNI"
            selectedLabel={referenceLabels.createPatient}
            value={form.patientId}
            onSearch={onPatientSearch}
            onSelect={onCreatePatientSelect}
          />
        </div>
        <div className="wide-field">
          <AutocompleteField
            key={`create-drug-${form.drugId}`}
            required
            getOptionMeta={getDrugMeta}
            getOptionTitle={getDrugTitle}
            label="Droga"
            loading={drugLookup.loading}
            name="drugId"
            options={drugLookup.options}
            placeholder="Nombre de la droga"
            selectedLabel={referenceLabels.createDrug}
            value={form.drugId}
            onSearch={onDrugSearch}
            onSelect={onCreateDrugSelect}
          />
        </div>
        <label className="app-field">
          <span>Ojo</span>
          <select required name="eye" value={form.eye} onChange={onChange}>
            {EYES.map((eye) => (
              <option key={eye.value} value={eye.value}>
                {eye.label}
              </option>
            ))}
          </select>
        </label>
        <label className="app-field">
          <span>Fecha</span>
          <input
            required
            name="applicationDate"
            type="date"
            value={form.applicationDate}
            onChange={onChange}
          />
        </label>
        {calculationResult ? (
          <CalculatedDateOptions
            form={form}
            result={calculationResult}
            onSelect={onCalculatedDateSelect}
          />
        ) : null}
        <label className="app-field">
          <span>Estado</span>
          <select required name="status" value={form.status} onChange={onChange}>
            {APPLICATION_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </label>
        <label className="app-field">
          <span>Origen</span>
          <select required name="dataOrigin" value={form.dataOrigin} onChange={onChange}>
            {DATA_ORIGINS.map((origin) => (
              <option key={origin.value} value={origin.value}>
                {origin.label}
              </option>
            ))}
          </select>
        </label>
        <label className="app-field">
          <span>Semanas</span>
          <input
            max="52"
            min="1"
            name="weeksToNextApplication"
            type="number"
            value={form.weeksToNextApplication}
            onChange={onChange}
          />
        </label>
        <label className="check-field">
          <input
            name="wasManuallyAdjusted"
            type="checkbox"
            checked={form.wasManuallyAdjusted}
            onChange={onChange}
          />
          <span>Ajuste manual</span>
        </label>
        <label className="app-field full-field">
          <span>Notas</span>
          <textarea maxLength="1000" name="notes" value={form.notes} onChange={onChange} />
        </label>
      </div>
    </form>
  )
}

export function CreateApplicationConfirmModal({
  calculationResult,
  form,
  open,
  referenceLabels,
  saving,
  onCancel,
  onConfirm,
}) {
  if (!open) {
    return null
  }

  return (
    <div className="app-modal-backdrop" role="presentation">
      <section
        aria-labelledby="create-application-confirm-title"
        aria-modal="true"
        className="app-modal"
        role="dialog"
      >
        <div className="panel-title-row">
          <div>
            <p className="eyebrow">Confirmacion</p>
            <h2 id="create-application-confirm-title">Registrar aplicacion</h2>
          </div>
          <button
            className="icon-button"
            type="button"
            disabled={saving}
            title="Cerrar"
            onClick={onCancel}
          >
            <i className="bi bi-x-lg" aria-hidden="true" />
          </button>
        </div>

        <p className="modal-copy">
          Revisá los datos antes de confirmar el registro de la aplicación.
        </p>

        <dl className="detail-list">
          <div>
            <dt>Paciente</dt>
            <dd>{referenceLabels.createPatient || '-'}</dd>
          </div>
          <div>
            <dt>Droga</dt>
            <dd>{referenceLabels.createDrug || '-'}</dd>
          </div>
          <div>
            <dt>Ojo</dt>
            <dd>{getEyeLabel(form.eye)}</dd>
          </div>
          <div>
            <dt>Fecha</dt>
            <dd>{formatDate(`${form.applicationDate}T00:00:00`)}</dd>
          </div>
          <div>
            <dt>Estado</dt>
            <dd>{getStatusLabel(form.status)}</dd>
          </div>
          <div>
            <dt>Origen</dt>
            <dd>{getDataOriginLabel(form.dataOrigin)}</dd>
          </div>
          <div>
            <dt>Semanas</dt>
            <dd>{form.weeksToNextApplication || '-'}</dd>
          </div>
          <div>
            <dt>Ajuste</dt>
            <dd>{form.wasManuallyAdjusted ? 'Manual' : 'Calculado'}</dd>
          </div>
        </dl>

        {calculationResult ? (
          <dl className="calculation-result modal-calculation">
            <div>
              <dt>Base</dt>
              <dd>{formatDate(calculationResult.baseCalculatedDate)}</dd>
            </div>
            <div>
              <dt>Jueves anterior</dt>
              <dd>{formatDate(calculationResult.previousThursdayCalculated)}</dd>
            </div>
            <div>
              <dt>Jueves siguiente</dt>
              <dd>{formatDate(calculationResult.nextThursdayCalculated)}</dd>
            </div>
            <div>
              <dt>Seleccionada</dt>
              <dd>{formatDate(`${form.applicationDate}T00:00:00`)}</dd>
            </div>
          </dl>
        ) : null}

        {form.notes ? (
          <div className="notes-box">
            <strong>Notas</strong>
            <p>{form.notes}</p>
          </div>
        ) : null}

        <div className="modal-actions">
          <button className="secondary-action" type="button" disabled={saving} onClick={onCancel}>
            Cancelar
          </button>
          <button className="primary-action" type="button" disabled={saving} onClick={onConfirm}>
            Confirmar
          </button>
        </div>
      </section>
    </div>
  )
}

function CalculatedDateOptions({ form, result, onSelect }) {
  const selectedDate = form.applicationDate
  const dateOptions = [
    {
      key: 'previous',
      label: 'Jueves anterior',
      value: result.previousThursdayCalculated,
    },
    {
      key: 'selected',
      label: 'Sugerida',
      value: result.selectedDate,
    },
    {
      key: 'next',
      label: 'Jueves siguiente',
      value: result.nextThursdayCalculated,
    },
  ].filter((option, index, options) => {
    const inputValue = option.value?.slice(0, 10)
    return (
      inputValue &&
      options.findIndex((item) => item.value?.slice(0, 10) === inputValue) === index
    )
  })

  return (
    <div className="date-choice-field full-field">
      <span>Fecha calculada</span>
      <div className="date-choice-grid">
        {dateOptions.map((option) => {
          const inputValue = option.value.slice(0, 10)
          const isSelected = selectedDate === inputValue

          return (
            <button
              className={`date-choice ${isSelected ? 'is-selected' : ''}`}
              key={option.key}
              type="button"
              onClick={() => onSelect(option.value)}
            >
              <span>{option.label}</span>
              <strong>{formatDate(option.value)}</strong>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function ScheduleForm({
  drugLookup,
  form,
  patientLookup,
  referenceLabels,
  saving,
  onChange,
  onDrugSearch,
  onPatientSearch,
  onScheduleOdDrugSelect,
  onScheduleOiDrugSelect,
  onSchedulePatientSelect,
  onSubmit,
}) {
  return (
    <form className="applications-panel" onSubmit={onSubmit}>
      <div className="panel-title-row">
        <div>
          <p className="eyebrow">Registro</p>
          <h2>Aplicacion por ojo</h2>
        </div>
        <button className="icon-button is-primary" type="submit" disabled={saving} title="Calcular">
          <i className="bi bi-calculator" aria-hidden="true" />
        </button>
      </div>
      <div className="form-grid">
        <div className="full-field">
          <AutocompleteField
            key={`schedule-patient-${form.patientId}`}
            required
            getOptionMeta={getPatientMeta}
            getOptionTitle={getPatientTitle}
            label="Paciente"
            loading={patientLookup.loading}
            name="patientId"
            options={patientLookup.options}
            placeholder="Nombre, apellido o DNI"
            selectedLabel={referenceLabels.schedulePatient}
            value={form.patientId}
            onSearch={onPatientSearch}
            onSelect={onSchedulePatientSelect}
          />
        </div>
        <EyeScheduleFields
          drugLookup={drugLookup}
          eye="OD"
          form={form}
          labelKey="scheduleOdDrug"
          prefix="od"
          referenceLabels={referenceLabels}
          onChange={onChange}
          onDrugSearch={onDrugSearch}
          onDrugSelect={onScheduleOdDrugSelect}
        />
        <EyeScheduleFields
          drugLookup={drugLookup}
          eye="OI"
          form={form}
          labelKey="scheduleOiDrug"
          prefix="oi"
          referenceLabels={referenceLabels}
          onChange={onChange}
          onDrugSearch={onDrugSearch}
          onDrugSelect={onScheduleOiDrugSelect}
        />
        <label className="app-field full-field">
          <span>Notas</span>
          <textarea maxLength="1000" name="notes" value={form.notes} onChange={onChange} />
        </label>
      </div>
    </form>
  )
}

function EyeScheduleFields({
  drugLookup,
  eye,
  form,
  labelKey,
  prefix,
  referenceLabels,
  onChange,
  onDrugSearch,
  onDrugSelect,
}) {
  const enabledName = `${prefix}Enabled`
  const disabled = !form[enabledName]

  return (
    <fieldset className="eye-schedule full-field">
      <legend>
        <label className="check-field">
          <input
            name={enabledName}
            type="checkbox"
            checked={form[enabledName]}
            onChange={onChange}
          />
          <span>{eye}</span>
        </label>
      </legend>
      <div className="compact-grid">
        <AutocompleteField
          key={`${prefix}-drug-${form[`${prefix}DrugId`]}`}
          disabled={disabled}
          required={form[enabledName]}
          getOptionMeta={getDrugMeta}
          getOptionTitle={getDrugTitle}
          label="Droga"
          loading={drugLookup.loading}
          name={`${prefix}DrugId`}
          options={drugLookup.options}
          placeholder="Nombre de la droga"
          selectedLabel={referenceLabels[labelKey]}
          value={form[`${prefix}DrugId`]}
          onSearch={onDrugSearch}
          onSelect={onDrugSelect}
        />
        <label className="app-field">
          <span>Primera fecha</span>
          <input
            required={form[enabledName]}
            disabled={disabled}
            name={`${prefix}FirstApplicationDate`}
            type="date"
            value={form[`${prefix}FirstApplicationDate`]}
            onChange={onChange}
          />
        </label>
        <label className="app-field">
          <span>Semanas</span>
          <input
            required={form[enabledName]}
            disabled={disabled}
            max="52"
            min="1"
            name={`${prefix}WeeksBetweenApplications`}
            type="number"
            value={form[`${prefix}WeeksBetweenApplications`]}
            onChange={onChange}
          />
        </label>
        <label className="app-field">
          <span>Cantidad</span>
          <input
            required={form[enabledName]}
            disabled={disabled}
            max="52"
            min="1"
            name={`${prefix}ApplicationCount`}
            type="number"
            value={form[`${prefix}ApplicationCount`]}
            onChange={onChange}
          />
        </label>
      </div>
    </fieldset>
  )
}

export function SchedulePreviewModal({
  dateEdits,
  open,
  preview,
  saving,
  onCancel,
  onConfirm,
  onDateChange,
}) {
  if (!open || !preview) {
    return null
  }

  const totalApplications = preview.schedules.reduce(
    (total, schedule) => total + schedule.dates.length,
    0,
  )

  return (
    <div className="app-modal-backdrop" role="presentation">
      <section
        aria-labelledby="schedule-preview-title"
        aria-modal="true"
        className="app-modal schedule-preview-modal"
        role="dialog"
      >
        <div className="panel-title-row">
          <div>
            <p className="eyebrow">Confirmacion</p>
            <h2 id="schedule-preview-title">Fechas a generar</h2>
          </div>
          <button
            className="icon-button"
            type="button"
            disabled={saving}
            title="Cerrar"
            onClick={onCancel}
          >
            <i className="bi bi-x-lg" aria-hidden="true" />
          </button>
        </div>

        <dl className="detail-list">
          <div>
            <dt>Paciente</dt>
            <dd>{preview.patientLabel || '-'}</dd>
          </div>
          <div>
            <dt>Aplicaciones</dt>
            <dd>{totalApplications}</dd>
          </div>
          <div>
            <dt>Ojos</dt>
            <dd>{preview.schedules.map((schedule) => getEyeLabel(schedule.eye)).join(', ')}</dd>
          </div>
          <div>
            <dt>Notas</dt>
            <dd>{preview.notes || '-'}</dd>
          </div>
        </dl>

        <div className="schedule-result-list modal-calculation">
          {preview.schedules.map((schedule) => (
            <div className="schedule-result-eye" key={schedule.eye}>
              <h4>{getEyeLabel(schedule.eye)}</h4>
              <dl className="detail-list">
                <div>
                  <dt>Droga</dt>
                  <dd>{schedule.drugLabel || '-'}</dd>
                </div>
                <div>
                  <dt>Intervalo</dt>
                  <dd>{schedule.weeksBetweenApplications} semana(s)</dd>
                </div>
              </dl>
              <div className="schedule-preview-dates">
                {schedule.dates.map((date, index) => {
                  const dateKey = `${schedule.eye}-${index}`

                  return (
                    <label className="app-field" key={dateKey}>
                      <span>Aplicacion {index + 1}</span>
                      <input
                        required
                        type="date"
                        value={dateEdits[dateKey] ?? date}
                        onChange={(event) => onDateChange(dateKey, event.target.value)}
                      />
                    </label>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="modal-actions">
          <button className="secondary-action" type="button" disabled={saving} onClick={onCancel}>
            Cancelar
          </button>
          <button className="primary-action" type="button" disabled={saving} onClick={onConfirm}>
            Confirmar
          </button>
        </div>
      </section>
    </div>
  )
}

function getPatientTitle(patient) {
  return patient.fullName || 'Paciente sin nombre'
}

function getPatientMeta(patient) {
  return `DNI ${patient.dni || '-'} · HC ${patient.medicalRecordNumber || '-'}`
}

function getDrugTitle(drug) {
  return drug.name || 'Droga sin nombre'
}

function getDrugMeta(drug) {
  return drug.isActive ? 'Activa' : 'Inactiva'
}
