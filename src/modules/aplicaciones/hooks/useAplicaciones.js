import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  calculateNextApplicationDate,
  createApplication,
  createApplicationSchedule,
  getApplicationById,
  getLastApplicationsByEye,
  searchApplications,
  updateApplication,
  updateApplicationDate,
} from "../services/aplicacionesService";
import { searchDrugs, searchPatients } from "../services/referenceDataService";
import {
  emptyToNull,
  numberOrNull,
  toApiDate,
} from "../utils/applicationFormatters";

const initialFilters = {
  dateFrom: "",
  dateTo: "",
  patientId: "",
  dni: "",
  medicalRecordNumber: "",
  drugId: "",
  eye: "",
  status: "",
};

const initialCreateForm = {
  patientId: "",
  drugId: "",
  eye: "1",
  applicationDate: "",
  status: "1",
  dataOrigin: "2",
  weeksToNextApplication: "",
  wasManuallyAdjusted: false,
  notes: "",
};

const initialCalculationForm = {
  lastApplicationDate: "",
  weeksToNextApplication: "4",
};

const initialScheduleForm = {
  patientId: "",
  notes: "",
  odEnabled: true,
  odDrugId: "",
  odFirstApplicationDate: "",
  odWeeksBetweenApplications: "4",
  odApplicationCount: "1",
  oiEnabled: false,
  oiDrugId: "",
  oiFirstApplicationDate: "",
  oiWeeksBetweenApplications: "4",
  oiApplicationCount: "1",
};

const initialStatusForm = {
  newStatus: "2",
  newDate: "",
  changeReason: "",
  notes: "",
};

const initialDateForm = {
  newDate: "",
  changeReason: "",
  notes: "",
};

const initialReferenceLabels = {
  filterPatient: "",
  filterDrug: "",
  createPatient: "",
  createDrug: "",
  schedulePatient: "",
  scheduleOdDrug: "",
  scheduleOiDrug: "",
  editDrug: "",
};

function mapFilters(filters) {
  return {
    ...filters,
    eye: emptyToNull(filters.eye),
    status: emptyToNull(filters.status),
  };
}

function buildApplicationPayload(form, calculationResult) {
  return {
    patientId: form.patientId,
    drugId: form.drugId,
    eye: Number(form.eye),
    applicationDate: toApiDate(form.applicationDate),
    status: Number(form.status),
    dataOrigin: Number(form.dataOrigin),
    weeksToNextApplication: numberOrNull(form.weeksToNextApplication),
    baseCalculatedDate: calculationResult?.baseCalculatedDate ?? null,
    previousThursdayCalculated:
      calculationResult?.previousThursdayCalculated ?? null,
    nextThursdayCalculated: calculationResult?.nextThursdayCalculated ?? null,
    selectedDate:
      calculationResult?.selectedDate ?? toApiDate(form.applicationDate),
    wasManuallyAdjusted: form.wasManuallyAdjusted,
    notes: emptyToNull(form.notes),
  };
}

function addDays(date, days) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

function toDateInput(date) {
  return date.toISOString().slice(0, 10);
}

function getNearestThursday(date) {
  const day = date.getDay();
  const previousDistance = (day + 3) % 7;
  const nextDistance = (11 - day) % 7;

  if (previousDistance === 0) {
    return date;
  }

  return previousDistance <= nextDistance
    ? addDays(date, -previousDistance)
    : addDays(date, nextDistance);
}

function calculateScheduleDates(
  firstApplicationDate,
  weeksBetweenApplications,
  applicationCount,
) {
  if (!firstApplicationDate) {
    return [];
  }

  const firstDate = new Date(`${firstApplicationDate}T00:00:00`);

  return Array.from({ length: Number(applicationCount) }, (_, index) => {
    if (index === 0) {
      return toDateInput(firstDate);
    }

    const baseDate = addDays(
      firstDate,
      Number(weeksBetweenApplications) * 7 * index,
    );
    return toDateInput(getNearestThursday(baseDate));
  });
}

function buildSchedulePreview(form, referenceLabels) {
  const enabledSchedules = [
    {
      enabled: form.odEnabled,
      eye: 1,
      drugId: form.odDrugId,
      drugLabel: referenceLabels.scheduleOdDrug,
      firstApplicationDate: form.odFirstApplicationDate,
      weeksBetweenApplications: form.odWeeksBetweenApplications,
      applicationCount: form.odApplicationCount,
    },
    {
      enabled: form.oiEnabled,
      eye: 2,
      drugId: form.oiDrugId,
      drugLabel: referenceLabels.scheduleOiDrug,
      firstApplicationDate: form.oiFirstApplicationDate,
      weeksBetweenApplications: form.oiWeeksBetweenApplications,
      applicationCount: form.oiApplicationCount,
    },
  ].filter((schedule) => schedule.enabled);

  return {
    patientId: form.patientId,
    patientLabel: referenceLabels.schedulePatient,
    notes: form.notes,
    schedules: enabledSchedules.map((schedule) => ({
      ...schedule,
      dates: calculateScheduleDates(
        schedule.firstApplicationDate,
        schedule.weeksBetweenApplications,
        schedule.applicationCount,
      ),
    })),
  };
}

function buildSchedulePayloadFromPreview(preview, dateEdits) {
  return {
    patientId: preview.patientId,
    eyeSchedules: preview.schedules.map((schedule) => ({
      eye: schedule.eye,
      drugId: schedule.drugId,
      firstApplicationDate: toApiDate(
        dateEdits[`${schedule.eye}-0`] ?? schedule.dates[0],
      ),
      weeksBetweenApplications: Number(schedule.weeksBetweenApplications),
      applicationCount: Number(schedule.applicationCount),
    })),
    notes: emptyToNull(preview.notes),
  };
}

function buildUpdatePayload(form, detail) {
  return {
    drugId: form.drugId,
    eye: Number(form.eye),
    applicationDate: toApiDate(form.applicationDate),
    status: Number(form.status),
    weeksToNextApplication: numberOrNull(form.weeksToNextApplication),
    baseCalculatedDate: detail?.baseCalculatedDate ?? null,
    previousThursdayCalculated: detail?.previousThursdayCalculated ?? null,
    nextThursdayCalculated: detail?.nextThursdayCalculated ?? null,
    selectedDate: toApiDate(form.applicationDate),
    wasManuallyAdjusted: form.wasManuallyAdjusted,
    changeReason: emptyToNull(form.changeReason),
    notes: emptyToNull(form.notes),
  };
}

function buildStatusUpdatePayload(form, detail) {
  const fallbackDate = detail?.applicationDate?.slice(0, 10) ?? "";
  const applicationDate = form.newDate || fallbackDate;

  return {
    drugId: detail.drugId,
    eye: Number(detail.eye),
    applicationDate: toApiDate(applicationDate),
    status: Number(form.newStatus),
    weeksToNextApplication: numberOrNull(detail.weeksToNextApplication),
    baseCalculatedDate: detail?.baseCalculatedDate ?? null,
    previousThursdayCalculated: detail?.previousThursdayCalculated ?? null,
    nextThursdayCalculated: detail?.nextThursdayCalculated ?? null,
    selectedDate: toApiDate(applicationDate),
    wasManuallyAdjusted: form.newDate
      ? true
      : Boolean(detail.wasManuallyAdjusted),
    changeReason: emptyToNull(form.changeReason),
    notes: emptyToNull(form.notes),
  };
}

function getPatientLabel(patient) {
  if (!patient) {
    return "";
  }

  return `${patient.fullName} - DNI ${patient.dni}`;
}

function getDrugLabel(drug) {
  return drug?.name ?? "";
}

export function useAplicaciones() {
  const [filters, setFilters] = useState(initialFilters);
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [detail, setDetail] = useState(null);
  const [lastByEye, setLastByEye] = useState(null);
  const [createForm, setCreateForm] = useState(initialCreateForm);
  const [calculationForm, setCalculationForm] = useState(
    initialCalculationForm,
  );
  const [calculationResult, setCalculationResult] = useState(null);
  const [createConfirmOpen, setCreateConfirmOpen] = useState(false);
  const [scheduleForm, setScheduleForm] = useState(initialScheduleForm);
  const [scheduleResult, setScheduleResult] = useState(null);
  const [schedulePreview, setSchedulePreview] = useState(null);
  const [schedulePreviewDateEdits, setSchedulePreviewDateEdits] = useState({});
  const [schedulePreviewOpen, setSchedulePreviewOpen] = useState(false);
  const [statusForm, setStatusForm] = useState(initialStatusForm);
  const [dateForm, setDateForm] = useState(initialDateForm);
  const [dateEditOpen, setDateEditOpen] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [referenceLabels, setReferenceLabels] = useState(
    initialReferenceLabels,
  );
  const [patientLookup, setPatientLookup] = useState({
    loading: false,
    options: [],
  });
  const [drugLookup, setDrugLookup] = useState({
    loading: false,
    options: [],
  });
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const lookupTimeouts = useRef({});

  const selectedId = selectedApplication?.id;

  const loadApplications = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await searchApplications(mapFilters(filters));
      setApplications(data);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadApplications();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [loadApplications]);

  const loadDetail = useCallback(async (applicationId) => {
    if (!applicationId) {
      setDetail(null);
      setEditForm(null);
      setDateForm(initialDateForm);
      setDateEditOpen(false);
      return;
    }

    setDetailLoading(true);
    setError("");

    try {
      const data = await getApplicationById(applicationId);
      setDetail(data);
      setEditForm({
        drugId: data.drugId ?? "",
        eye: String(data.eye ?? 1),
        applicationDate: data.applicationDate?.slice(0, 10) ?? "",
        status: String(data.status ?? 1),
        weeksToNextApplication: data.weeksToNextApplication ?? "",
        wasManuallyAdjusted: Boolean(data.wasManuallyAdjusted),
        changeReason: "",
        notes: data.notes ?? "",
      });
      setStatusForm({
        newStatus: String(data.status ?? 1),
        newDate: "",
        changeReason: "",
        notes: "",
      });
      setDateForm({
        newDate: data.applicationDate?.slice(0, 10) ?? "",
        changeReason: "",
        notes: "",
      });
      setDateEditOpen(false);
      setReferenceLabels((currentLabels) => ({
        ...currentLabels,
        editDrug: data.drugName ?? "",
      }));
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setDetailLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadDetail(selectedId);
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [loadDetail, selectedId]);

  function handleFilterChange(event) {
    const { name, value } = event.target;
    setFilters((currentFilters) => ({ ...currentFilters, [name]: value }));
  }

  function resetFilters() {
    setFilters(initialFilters);
    setReferenceLabels((currentLabels) => ({
      ...currentLabels,
      filterPatient: "",
      filterDrug: "",
    }));
  }

  function handleCreateChange(event) {
    const { checked, name, type, value } = event.target;
    setCreateForm((currentForm) => ({
      ...currentForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleCalculatedDateSelect(dateValue) {
    const selectedDate = dateValue?.slice(0, 10) ?? "";
    const backendSelectedDate =
      calculationResult?.selectedDate?.slice(0, 10) ?? "";

    setCreateForm((currentForm) => ({
      ...currentForm,
      applicationDate: selectedDate,
      wasManuallyAdjusted: selectedDate !== backendSelectedDate,
    }));
  }

  function handleCalculationChange(event) {
    const { name, value } = event.target;
    setCalculationForm((currentForm) => ({ ...currentForm, [name]: value }));
  }

  function handleScheduleChange(event) {
    const { checked, name, type, value } = event.target;
    setScheduleForm((currentForm) => ({
      ...currentForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSchedulePreviewDateChange(dateKey, value) {
    setSchedulePreviewDateEdits((currentEdits) => ({
      ...currentEdits,
      [dateKey]: value,
    }));
  }

  function handleSchedulePreviewCancel() {
    if (!saving) {
      setSchedulePreviewOpen(false);
    }
  }

  function handleStatusChange(event) {
    const { name, value } = event.target;
    setStatusForm((currentForm) => ({ ...currentForm, [name]: value }));
  }

  function handleDateChange(event) {
    const { name, value } = event.target;
    setDateForm((currentForm) => ({ ...currentForm, [name]: value }));
  }

  function handleDateEditStart() {
    setDateForm({
      newDate: detail?.applicationDate?.slice(0, 10) ?? "",
      changeReason: "",
      notes: detail?.notes ?? "",
    });
    setDateEditOpen(true);
  }

  function handleDateEditCancel() {
    if (!saving) {
      setDateEditOpen(false);
    }
  }

  function handleEditChange(event) {
    const { checked, name, type, value } = event.target;
    setEditForm((currentForm) => ({
      ...currentForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function queueLookup(lookupKey, term, searchAction, setLookup) {
    window.clearTimeout(lookupTimeouts.current[lookupKey]);

    if (term.trim().length < 2) {
      setLookup({ loading: false, options: [] });
      return;
    }

    setLookup((currentLookup) => ({ ...currentLookup, loading: true }));
    lookupTimeouts.current[lookupKey] = window.setTimeout(async () => {
      try {
        const options = await searchAction(term.trim());
        setLookup({ loading: false, options });
      } catch (lookupError) {
        setLookup({ loading: false, options: [] });
        setError(lookupError.message);
      }
    }, 280);
  }

  function handlePatientSearch(term) {
    queueLookup("patients", term, searchPatients, setPatientLookup);
  }

  function handleDrugSearch(term) {
    queueLookup("drugs", term, searchDrugs, setDrugLookup);
  }

  function setReferenceLabel(labelKey, label) {
    setReferenceLabels((currentLabels) => ({
      ...currentLabels,
      [labelKey]: label,
    }));
  }

  function handleFilterPatientSelect(_name, patient) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      patientId: patient?.id ?? "",
    }));
    setReferenceLabel("filterPatient", getPatientLabel(patient));
  }

  function handleFilterDrugSelect(_name, drug) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      drugId: drug?.id ?? "",
    }));
    setReferenceLabel("filterDrug", getDrugLabel(drug));
  }

  function handleCreatePatientSelect(_name, patient) {
    setCreateForm((currentForm) => ({
      ...currentForm,
      patientId: patient?.id ?? "",
    }));
    setReferenceLabel("createPatient", getPatientLabel(patient));
  }

  function handleCreateDrugSelect(_name, drug) {
    setCreateForm((currentForm) => ({
      ...currentForm,
      drugId: drug?.id ?? "",
    }));
    setReferenceLabel("createDrug", getDrugLabel(drug));
  }

  function handleSchedulePatientSelect(_name, patient) {
    setScheduleForm((currentForm) => ({
      ...currentForm,
      patientId: patient?.id ?? "",
    }));
    setReferenceLabel("schedulePatient", getPatientLabel(patient));
  }

  function handleScheduleOdDrugSelect(_name, drug) {
    setScheduleForm((currentForm) => ({
      ...currentForm,
      odDrugId: drug?.id ?? "",
    }));
    setReferenceLabel("scheduleOdDrug", getDrugLabel(drug));
  }

  function handleScheduleOiDrugSelect(_name, drug) {
    setScheduleForm((currentForm) => ({
      ...currentForm,
      oiDrugId: drug?.id ?? "",
    }));
    setReferenceLabel("scheduleOiDrug", getDrugLabel(drug));
  }

  function handleEditDrugSelect(_name, drug) {
    setEditForm((currentForm) => ({
      ...currentForm,
      drugId: drug?.id ?? "",
    }));
    setReferenceLabel("editDrug", getDrugLabel(drug));
  }

  async function handleCalculate(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const result = await calculateNextApplicationDate({
        lastApplicationDate: toApiDate(calculationForm.lastApplicationDate),
        weeksToNextApplication: Number(calculationForm.weeksToNextApplication),
      });
      setCalculationResult(result);
      setCreateForm((currentForm) => ({
        ...currentForm,
        applicationDate:
          result.selectedDate?.slice(0, 10) ?? currentForm.applicationDate,
        weeksToNextApplication: calculationForm.weeksToNextApplication,
      }));
      setSuccess("Fecha calculada correctamente.");
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleCreateSubmit(event) {
    event.preventDefault();

    if (!calculationResult) {
      setError("Calculá la fecha antes de guardar la aplicación.");
      return;
    }

    setError("");
    setSuccess("");
    setCreateConfirmOpen(true);
  }

  async function handleCreateConfirm() {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const created = await createApplication(
        buildApplicationPayload(createForm, calculationResult),
      );
      setCreateForm(initialCreateForm);
      setCalculationResult(null);
      setCreateConfirmOpen(false);
      setReferenceLabels((currentLabels) => ({
        ...currentLabels,
        createPatient: "",
        createDrug: "",
      }));
      setSelectedApplication(created);
      setSuccess("Aplicacion registrada correctamente.");
      await loadApplications();
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  }

  function handleCreateCancel() {
    if (!saving) {
      setCreateConfirmOpen(false);
    }
  }

  async function handleScheduleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setScheduleResult(null);

    const preview = buildSchedulePreview(scheduleForm, referenceLabels);

    if (preview.schedules.length === 0) {
      setError("Seleccioná al menos un ojo para generar el cálculo.");
      return;
    }

    setSchedulePreview(preview);
    setSchedulePreviewDateEdits(
      Object.fromEntries(
        preview.schedules.flatMap((schedule) =>
          schedule.dates.map((date, index) => [
            `${schedule.eye}-${index}`,
            date,
          ]),
        ),
      ),
    );
    setSchedulePreviewOpen(true);
  }

  async function handleSchedulePreviewConfirm() {
    if (!schedulePreview) {
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const createdSchedule = await createApplicationSchedule(
        buildSchedulePayloadFromPreview(
          schedulePreview,
          schedulePreviewDateEdits,
        ),
      );
      const schedulesWithAdjustedDates = await Promise.all(
        (createdSchedule.schedules ?? []).map(async (createdEyeSchedule) => {
          const applications = await Promise.all(
            (createdEyeSchedule.applications ?? []).map(
              async (application, index) => {
                const editedDate =
                  schedulePreviewDateEdits[
                    `${createdEyeSchedule.eye}-${index}`
                  ];
                const createdDate =
                  application.selectedDate?.slice(0, 10) ??
                  application.applicationDate?.slice(0, 10);

                if (!editedDate || editedDate === createdDate) {
                  return application;
                }

                return updateApplicationDate(application.id, {
                  newDate: toApiDate(editedDate),
                  changeReason: "Ajuste manual previo a la confirmacion",
                });
              },
            ),
          );

          return {
            ...createdEyeSchedule,
            applications,
          };
        }),
      );
      const adjustedSchedule = {
        ...createdSchedule,
        schedules: schedulesWithAdjustedDates,
      };
      const createdApplications = schedulesWithAdjustedDates.flatMap(
        (schedule) => schedule.applications ?? [],
      );

      setScheduleResult(adjustedSchedule);
      setScheduleForm(initialScheduleForm);
      setSchedulePreview(null);
      setSchedulePreviewDateEdits({});
      setSchedulePreviewOpen(false);
      setReferenceLabels((currentLabels) => ({
        ...currentLabels,
        schedulePatient: "",
        scheduleOdDrug: "",
        scheduleOiDrug: "",
      }));
      setSelectedApplication(createdApplications[0] ?? null);
      setSuccess("Aplicacion registrada correctamente.");
      await loadApplications();
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusSubmit(event) {
    event.preventDefault();

    if (!selectedId || !detail) {
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const updated = await updateApplication(
        selectedId,
        buildStatusUpdatePayload(statusForm, detail),
      );
      setSelectedApplication(updated);
      setDetail(updated);
      setEditForm((currentForm) =>
        currentForm
          ? {
              ...currentForm,
              applicationDate:
                updated.applicationDate?.slice(0, 10) ??
                currentForm.applicationDate,
              status: String(updated.status ?? currentForm.status),
              wasManuallyAdjusted: Boolean(updated.wasManuallyAdjusted),
              notes: updated.notes ?? currentForm.notes,
            }
          : currentForm,
      );
      setStatusForm({
        newStatus: String(updated.status ?? 1),
        newDate: "",
        changeReason: "",
        notes: "",
      });
      setSuccess("Estado actualizado correctamente.");
      await loadApplications();
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDateSubmit(event) {
    event.preventDefault();

    if (!selectedId || !dateForm.newDate) {
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const updated = await updateApplicationDate(selectedId, {
        newDate: toApiDate(dateForm.newDate),
        changeReason: emptyToNull(dateForm.changeReason),
        notes: emptyToNull(dateForm.notes),
      });
      setSelectedApplication(updated);
      setDetail(updated);
      setEditForm((currentForm) =>
        currentForm
          ? {
              ...currentForm,
              applicationDate:
                updated.applicationDate?.slice(0, 10) ??
                currentForm.applicationDate,
              wasManuallyAdjusted: Boolean(updated.wasManuallyAdjusted),
              notes: updated.notes ?? currentForm.notes,
            }
          : currentForm,
      );
      setDateForm({
        newDate: updated.applicationDate?.slice(0, 10) ?? "",
        changeReason: "",
        notes: "",
      });
      setDateEditOpen(false);
      setSuccess("Fecha actualizada correctamente.");
      await loadApplications();
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleEditSubmit(event) {
    event.preventDefault();

    if (!selectedId || !editForm) {
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const updated = await updateApplication(
        selectedId,
        buildUpdatePayload(editForm, detail),
      );
      setSelectedApplication(updated);
      setDetail(updated);
      setSuccess("Aplicacion actualizada correctamente.");
      await loadApplications();
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleLoadLastByEye() {
    const patientId =
      filters.patientId || createForm.patientId || scheduleForm.patientId;

    if (!patientId) {
      setError(
        "Ingresá un patientId en filtros, alta individual o cronograma.",
      );
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const data = await getLastApplicationsByEye(patientId);
      setLastByEye(data);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setSaving(false);
    }
  }

  const stats = useMemo(() => {
    const pending = applications.filter((item) => item.status === 1).length;
    const applied = applications.filter((item) => item.status === 2).length;
    const rescheduled = applications.filter((item) => item.status === 3).length;

    return {
      total: applications.length,
      pending,
      applied,
      rescheduled,
    };
  }, [applications]);

  return {
    applications,
    calculationForm,
    calculationResult,
    createConfirmOpen,
    createForm,
    dateEditOpen,
    dateForm,
    detail,
    detailLoading,
    drugLookup,
    editForm,
    error,
    filters,
    lastByEye,
    loading,
    patientLookup,
    referenceLabels,
    saving,
    scheduleForm,
    schedulePreview,
    schedulePreviewDateEdits,
    schedulePreviewOpen,
    scheduleResult,
    selectedApplication,
    stats,
    statusForm,
    success,
    handleCalculate,
    handleCalculationChange,
    handleCalculatedDateSelect,
    handleCreateCancel,
    handleCreateChange,
    handleCreateConfirm,
    handleCreateSubmit,
    handleDateChange,
    handleDateEditCancel,
    handleDateEditStart,
    handleDateSubmit,
    handleCreateDrugSelect,
    handleCreatePatientSelect,
    handleDrugSearch,
    handleEditChange,
    handleEditDrugSelect,
    handleEditSubmit,
    handleFilterChange,
    handleFilterDrugSelect,
    handleFilterPatientSelect,
    handleLoadLastByEye,
    handlePatientSearch,
    handleScheduleChange,
    handleScheduleOdDrugSelect,
    handleScheduleOiDrugSelect,
    handleSchedulePatientSelect,
    handleSchedulePreviewCancel,
    handleSchedulePreviewConfirm,
    handleSchedulePreviewDateChange,
    handleScheduleSubmit,
    handleStatusChange,
    handleStatusSubmit,
    loadApplications,
    resetFilters,
    setSelectedApplication,
  };
}
