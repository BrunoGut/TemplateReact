# Documentacion del modulo de aplicaciones

Modulo encargado de calcular, registrar, modificar, consultar y listar aplicaciones intravitreas de antiangiogenicos.

Ruta base:

```http
/api/injection-applications
```

Todos los endpoints del modulo requieren autenticacion JWT:

```http
Authorization: Bearer {token}
```

Roles autorizados:

- `Admin`
- `Doctor`

## Enums utilizados

### Eye

| Valor | Nombre | Descripcion |
| --- | --- | --- |
| `1` | `OD` | Ojo derecho |
| `2` | `OI` | Ojo izquierdo |

### ApplicationStatus

| Valor | Nombre | Descripcion |
| --- | --- | --- |
| `1` | `Pending` | Aplicacion pendiente |
| `2` | `Applied` | Aplicacion realizada |
| `3` | `Rescheduled` | Aplicacion reprogramada |
| `4` | `Cancelled` | Aplicacion cancelada |
| `5` | `DidNotAttend` | Paciente no asistio |

### DataOrigin

| Valor | Nombre | Descripcion |
| --- | --- | --- |
| `1` | `ManualHistorico` | Carga manual historica |
| `2` | `Sistema` | Generado por el sistema |
| `3` | `ModificadoMedico` | Modificado por medico |
| `4` | `ModificadoAdmin` | Modificado por administrador |

## Reglas generales

- El modulo valida que los valores de `Eye`, `ApplicationStatus` y `DataOrigin` existan en sus respectivos enums.
- Para registrar o editar una aplicacion, el paciente debe existir.
- Para registrar o editar una aplicacion, la droga debe existir y estar activa.
- Cuando un `Doctor` edita una aplicacion completa o su estado, solo puede hacerlo si la aplicacion actual esta en estado `Pending`.
- Un `Admin` puede editar aplicaciones en cualquier estado.
- Las operaciones de registro y modificacion generan trazabilidad.
- En ediciones, el campo `DataOrigin` se recalcula segun el rol:
  - `Admin` => `ModificadoAdmin`
  - `Doctor` => `ModificadoMedico`

## POST /api/injection-applications/calculate

Calcula la proxima fecha de aplicacion a partir de la ultima fecha y una cantidad de semanas. El calculo suma `weeksToNextApplication * 7` dias y ajusta la fecha al jueves mas cercano.

### Body

```json
{
  "lastApplicationDate": "2026-07-01T00:00:00",
  "weeksToNextApplication": 4
}
```

| Campo | Tipo | Requerido | Validaciones | Descripcion |
| --- | --- | --- | --- | --- |
| `lastApplicationDate` | `DateTime` | Si | - | Fecha de la ultima aplicacion |
| `weeksToNextApplication` | `int` | Si | `1` a `52` | Cantidad de semanas hasta la siguiente aplicacion |

### Respuesta 200

```json
{
  "baseCalculatedDate": "2026-07-29T00:00:00",
  "previousThursdayCalculated": "2026-07-23T00:00:00",
  "nextThursdayCalculated": "2026-07-30T00:00:00",
  "selectedDate": "2026-07-30T00:00:00",
  "isBaseAlreadyThursday": false
}
```

### Errores

- `400 Bad Request`: body invalido o semanas fuera de rango.

## POST /api/injection-applications

Registra una nueva aplicacion individual, historica o pendiente calculada.

### Body

```json
{
  "patientId": "11111111-1111-1111-1111-111111111111",
  "drugId": "22222222-2222-2222-2222-222222222222",
  "eye": 1,
  "applicationDate": "2026-07-30T00:00:00",
  "status": 1,
  "dataOrigin": 2,
  "weeksToNextApplication": 4,
  "baseCalculatedDate": "2026-07-29T00:00:00",
  "previousThursdayCalculated": "2026-07-23T00:00:00",
  "nextThursdayCalculated": "2026-07-30T00:00:00",
  "selectedDate": "2026-07-30T00:00:00",
  "wasManuallyAdjusted": false,
  "notes": "Primera aplicacion programada"
}
```

| Campo | Tipo | Requerido | Validaciones | Descripcion |
| --- | --- | --- | --- | --- |
| `patientId` | `Guid` | Si | Debe existir | Paciente asociado |
| `drugId` | `Guid` | Si | Debe existir y estar activa | Droga aplicada |
| `eye` | `Eye` | Si | Enum valido | Ojo de aplicacion |
| `applicationDate` | `DateTime` | Si | - | Fecha efectiva o programada |
| `status` | `ApplicationStatus` | Si | Enum valido | Estado inicial |
| `dataOrigin` | `DataOrigin` | Si | Enum valido | Origen de la carga |
| `weeksToNextApplication` | `int?` | No | - | Semanas usadas para calcular siguiente fecha |
| `baseCalculatedDate` | `DateTime?` | No | - | Fecha base calculada antes del ajuste |
| `previousThursdayCalculated` | `DateTime?` | No | - | Jueves anterior calculado |
| `nextThursdayCalculated` | `DateTime?` | No | - | Jueves siguiente calculado |
| `selectedDate` | `DateTime?` | No | - | Fecha seleccionada por el calculo o ajuste |
| `wasManuallyAdjusted` | `bool` | No | - | Indica si la fecha fue ajustada manualmente |
| `notes` | `string?` | No | Maximo `1000` caracteres | Observaciones |

### Respuesta 201

Devuelve un `InjectionApplicationResponse`.

```json
{
  "id": "33333333-3333-3333-3333-333333333333",
  "patientId": "11111111-1111-1111-1111-111111111111",
  "patientFullName": "Juan Perez",
  "patientDni": "12345678",
  "patientMedicalRecordNumber": "HC-001",
  "drugId": "22222222-2222-2222-2222-222222222222",
  "drugName": "Aflibercept",
  "eye": 1,
  "applicationDate": "2026-07-30T00:00:00",
  "status": 1,
  "dataOrigin": 2,
  "weeksToNextApplication": 4,
  "baseCalculatedDate": "2026-07-29T00:00:00",
  "previousThursdayCalculated": "2026-07-23T00:00:00",
  "nextThursdayCalculated": "2026-07-30T00:00:00",
  "selectedDate": "2026-07-30T00:00:00",
  "wasManuallyAdjusted": false,
  "notes": "Primera aplicacion programada",
  "createdByUserId": "44444444-4444-4444-4444-444444444444",
  "createdByUserName": "Dra. Ana Gomez",
  "updatedByUserId": null,
  "updatedByUserName": null,
  "createdAt": "2026-07-12T20:00:00Z",
  "updatedAt": "2026-07-12T20:00:00Z"
}
```

### Errores

- `400 Bad Request`: paciente inexistente, droga inexistente, droga inactiva o enum invalido.

## POST /api/injection-applications/schedules

Registra un cronograma de aplicaciones separado por ojo. Genera una o mas aplicaciones pendientes por cada ojo informado.

Cada ojo parte de `lastApplicationDate`. La aplicacion 1 se calcula como `lastApplicationDate + weeksBetweenApplications`; la aplicacion 2 se calcula desde la fecha seleccionada de la aplicacion 1, y asi sucesivamente. Cada fecha se ajusta al jueves mas cercano.

### Body

```json
{
  "patientId": "11111111-1111-1111-1111-111111111111",
  "eyeSchedules": [
    {
      "eye": 1,
      "drugId": "22222222-2222-2222-2222-222222222222",
      "firstApplicationDate": "2026-07-30T00:00:00",
      "weeksBetweenApplications": 4,
      "applicationCount": 3
    },
    {
      "eye": 2,
      "drugId": "55555555-5555-5555-5555-555555555555",
      "firstApplicationDate": "2026-08-06T00:00:00",
      "weeksBetweenApplications": 6,
      "applicationCount": 2
    }
  ],
  "notes": "Cronograma inicial"
}
```

| Campo | Tipo | Requerido | Validaciones | Descripcion |
| --- | --- | --- | --- | --- |
| `patientId` | `Guid` | Si | Debe existir | Paciente asociado |
| `eyeSchedules` | `EyeApplicationScheduleRequest[]` | Si | Minimo `1` item | Cronogramas por ojo |
| `notes` | `string?` | No | Maximo `1000` caracteres | Observaciones comunes |

Campos de `eyeSchedules`:

| Campo | Tipo | Requerido | Validaciones | Descripcion |
| --- | --- | --- | --- | --- |
| `eye` | `Eye` | Si | Enum valido; no puede repetirse dentro del cronograma | Ojo |
| `drugId` | `Guid` | Si | No puede ser `Guid.Empty`; debe existir y estar activa | Droga |
| `firstApplicationDate` | `DateTime` | Si | - | Fecha de la primera aplicacion |
| `weeksBetweenApplications` | `int` | Si | `1` a `52` | Semanas entre aplicaciones |
| `applicationCount` | `int` | Si | `1` a `52` | Cantidad de aplicaciones a crear |

### Respuesta 201

```json
{
  "patientId": "11111111-1111-1111-1111-111111111111",
  "totalApplications": 5,
  "schedules": [
    {
      "eye": 1,
      "applications": [
        {
          "id": "33333333-3333-3333-3333-333333333333",
          "patientId": "11111111-1111-1111-1111-111111111111",
          "patientFullName": "Juan Perez",
          "patientDni": "12345678",
          "patientMedicalRecordNumber": "HC-001",
          "drugId": "22222222-2222-2222-2222-222222222222",
          "drugName": "Aflibercept",
          "eye": 1,
          "applicationDate": "2026-07-30T00:00:00",
          "status": 1,
          "dataOrigin": 2,
          "weeksToNextApplication": 4,
          "baseCalculatedDate": null,
          "previousThursdayCalculated": null,
          "nextThursdayCalculated": null,
          "selectedDate": "2026-07-30T00:00:00",
          "wasManuallyAdjusted": false,
          "notes": "Cronograma inicial",
          "createdByUserId": "44444444-4444-4444-4444-444444444444",
          "createdByUserName": "Dra. Ana Gomez",
          "updatedByUserId": null,
          "updatedByUserName": null,
          "createdAt": "2026-07-12T20:00:00Z",
          "updatedAt": "2026-07-12T20:00:00Z"
        }
      ]
    }
  ]
}
```

### Errores

- `400 Bad Request`: paciente inexistente, droga inexistente, droga inactiva, cronograma vacio, ojo repetido, enum invalido, semanas fuera de rango o cantidad fuera de rango.

## PUT /api/injection-applications/{id}

Edita una aplicacion completa.

### Parametros de ruta

| Parametro | Tipo | Requerido | Descripcion |
| --- | --- | --- | --- |
| `id` | `Guid` | Si | Identificador de la aplicacion |

### Body

```json
{
  "drugId": "22222222-2222-2222-2222-222222222222",
  "eye": 1,
  "applicationDate": "2026-08-06T00:00:00",
  "status": 3,
  "weeksToNextApplication": 4,
  "baseCalculatedDate": "2026-08-05T00:00:00",
  "previousThursdayCalculated": "2026-07-30T00:00:00",
  "nextThursdayCalculated": "2026-08-06T00:00:00",
  "selectedDate": "2026-08-06T00:00:00",
  "wasManuallyAdjusted": true,
  "changeReason": "Reprogramacion por disponibilidad",
  "notes": "Nueva fecha acordada con el paciente"
}
```

| Campo | Tipo | Requerido | Validaciones | Descripcion |
| --- | --- | --- | --- | --- |
| `drugId` | `Guid` | Si | Debe existir y estar activa | Nueva droga asociada |
| `eye` | `Eye` | Si | Enum valido | Ojo |
| `applicationDate` | `DateTime` | Si | - | Nueva fecha |
| `status` | `ApplicationStatus` | Si | Enum valido | Nuevo estado |
| `weeksToNextApplication` | `int?` | No | - | Semanas usadas para calcular |
| `baseCalculatedDate` | `DateTime?` | No | - | Fecha base calculada |
| `previousThursdayCalculated` | `DateTime?` | No | - | Jueves anterior calculado |
| `nextThursdayCalculated` | `DateTime?` | No | - | Jueves siguiente calculado |
| `selectedDate` | `DateTime?` | No | - | Fecha seleccionada |
| `wasManuallyAdjusted` | `bool` | No | - | Indica ajuste manual |
| `changeReason` | `string?` | No | Maximo `500` caracteres | Motivo para trazabilidad |
| `notes` | `string?` | No | Maximo `1000` caracteres | Observaciones; si es `null`, conserva las existentes |

### Respuesta 200

Devuelve un `InjectionApplicationResponse`.

### Errores

- `400 Bad Request`: aplicacion inexistente, droga inexistente, droga inactiva o enum invalido.
- `401 Unauthorized`: token invalido o un `Doctor` intenta editar una aplicacion que no esta pendiente.
- `404 Not Found`: documentado en el controlador, aunque actualmente la aplicacion inexistente se devuelve como `400 Bad Request` en esta accion.

## PATCH /api/injection-applications/{id}/status

Actualiza solamente el estado de una aplicacion. Si el nuevo estado es `Rescheduled` y se envia `newDate`, tambien actualiza la fecha de aplicacion, `selectedDate` y marca `wasManuallyAdjusted = true`.

### Parametros de ruta

| Parametro | Tipo | Requerido | Descripcion |
| --- | --- | --- | --- |
| `id` | `Guid` | Si | Identificador de la aplicacion |

### Body

```json
{
  "newStatus": 3,
  "newDate": "2026-08-13T00:00:00",
  "changeReason": "Paciente solicita cambio de turno",
  "notes": "Se reprograma para el jueves siguiente"
}
```

| Campo | Tipo | Requerido | Validaciones | Descripcion |
| --- | --- | --- | --- | --- |
| `newStatus` | `ApplicationStatus` | Si | Enum valido | Nuevo estado |
| `newDate` | `DateTime?` | No | - | Nueva fecha cuando corresponde |
| `changeReason` | `string?` | No | Maximo `500` caracteres | Motivo del cambio |
| `notes` | `string?` | No | Maximo `1000` caracteres | Observaciones; si es `null`, conserva las existentes |

### Respuesta 200

Devuelve un `InjectionApplicationResponse`.

### Errores

- `400 Bad Request`: body invalido o enum invalido.
- `401 Unauthorized`: token invalido o un `Doctor` intenta modificar una aplicacion que no esta pendiente.
- `404 Not Found`: aplicacion inexistente.

## GET /api/injection-applications/{id}

Obtiene el detalle de una aplicacion.

### Parametros de ruta

| Parametro | Tipo | Requerido | Descripcion |
| --- | --- | --- | --- |
| `id` | `Guid` | Si | Identificador de la aplicacion |

### Respuesta 200

Devuelve un `InjectionApplicationResponse`.

### Errores

- `404 Not Found`: aplicacion inexistente.

## GET /api/injection-applications

Busca aplicaciones con filtros opcionales.

### Query params

```http
GET /api/injection-applications?dateFrom=2026-07-01&dateTo=2026-07-31&patientId=11111111-1111-1111-1111-111111111111&dni=123&medicalRecordNumber=HC&drugId=22222222-2222-2222-2222-222222222222&eye=1&status=1
```

| Parametro | Tipo | Requerido | Descripcion |
| --- | --- | --- | --- |
| `dateFrom` | `DateTime?` | No | Fecha inicial. Filtra `applicationDate >= dateFrom.Date` |
| `dateTo` | `DateTime?` | No | Fecha final. Incluye todo el dia indicado |
| `patientId` | `Guid?` | No | Filtra por paciente |
| `dni` | `string?` | No | Busca coincidencias parciales en DNI |
| `medicalRecordNumber` | `string?` | No | Busca coincidencias parciales en numero de historia clinica |
| `drugId` | `Guid?` | No | Filtra por droga |
| `eye` | `Eye?` | No | Filtra por ojo |
| `status` | `ApplicationStatus?` | No | Filtra por estado |

La respuesta se ordena por `applicationDate` descendente.

### Respuesta 200

Devuelve una lista de `InjectionApplicationSummaryResponse`.

```json
[
  {
    "id": "33333333-3333-3333-3333-333333333333",
    "patientId": "11111111-1111-1111-1111-111111111111",
    "patientFullName": "Juan Perez",
    "patientDni": "12345678",
    "patientMedicalRecordNumber": "HC-001",
    "drugId": "22222222-2222-2222-2222-222222222222",
    "drugName": "Aflibercept",
    "eye": 1,
    "applicationDate": "2026-07-30T00:00:00",
    "status": 1,
    "dataOrigin": 2,
    "createdAt": "2026-07-12T20:00:00Z"
  }
]
```

## GET /api/injection-applications/patient/{patientId}/last-by-eye

Obtiene la ultima aplicacion registrada para cada ojo de un paciente.

### Parametros de ruta

| Parametro | Tipo | Requerido | Descripcion |
| --- | --- | --- | --- |
| `patientId` | `Guid` | Si | Identificador del paciente |

### Respuesta 200

```json
{
  "od": {
    "id": "33333333-3333-3333-3333-333333333333",
    "patientId": "11111111-1111-1111-1111-111111111111",
    "patientFullName": "Juan Perez",
    "patientDni": "12345678",
    "patientMedicalRecordNumber": "HC-001",
    "drugId": "22222222-2222-2222-2222-222222222222",
    "drugName": "Aflibercept",
    "eye": 1,
    "applicationDate": "2026-07-30T00:00:00",
    "status": 1,
    "dataOrigin": 2,
    "createdAt": "2026-07-12T20:00:00Z"
  },
  "oi": null
}
```

Si no existe aplicacion para un ojo, ese campo vuelve `null`.

## Modelos de respuesta

### InjectionApplicationResponse

| Campo | Tipo | Descripcion |
| --- | --- | --- |
| `id` | `Guid` | Identificador de la aplicacion |
| `patientId` | `Guid` | Identificador del paciente |
| `patientFullName` | `string` | Nombre completo del paciente |
| `patientDni` | `string` | DNI del paciente |
| `patientMedicalRecordNumber` | `string` | Numero de historia clinica |
| `drugId` | `Guid` | Identificador de la droga |
| `drugName` | `string` | Nombre de la droga |
| `eye` | `Eye` | Ojo tratado |
| `applicationDate` | `DateTime` | Fecha de aplicacion |
| `status` | `ApplicationStatus` | Estado |
| `dataOrigin` | `DataOrigin` | Origen de datos |
| `weeksToNextApplication` | `int?` | Semanas usadas para calculo |
| `baseCalculatedDate` | `DateTime?` | Fecha base calculada |
| `previousThursdayCalculated` | `DateTime?` | Jueves anterior calculado |
| `nextThursdayCalculated` | `DateTime?` | Jueves siguiente calculado |
| `selectedDate` | `DateTime?` | Fecha seleccionada |
| `wasManuallyAdjusted` | `bool` | Indica ajuste manual |
| `notes` | `string?` | Observaciones |
| `createdByUserId` | `Guid` | Usuario creador |
| `createdByUserName` | `string` | Nombre del usuario creador |
| `updatedByUserId` | `Guid?` | Usuario que actualizo |
| `updatedByUserName` | `string?` | Nombre del usuario que actualizo |
| `createdAt` | `DateTime` | Fecha de creacion |
| `updatedAt` | `DateTime` | Fecha de ultima actualizacion |

### InjectionApplicationSummaryResponse

| Campo | Tipo | Descripcion |
| --- | --- | --- |
| `id` | `Guid` | Identificador de la aplicacion |
| `patientId` | `Guid` | Identificador del paciente |
| `patientFullName` | `string` | Nombre completo del paciente |
| `patientDni` | `string` | DNI del paciente |
| `patientMedicalRecordNumber` | `string` | Numero de historia clinica |
| `drugId` | `Guid` | Identificador de la droga |
| `drugName` | `string` | Nombre de la droga |
| `eye` | `Eye` | Ojo tratado |
| `applicationDate` | `DateTime` | Fecha de aplicacion |
| `status` | `ApplicationStatus` | Estado |
| `dataOrigin` | `DataOrigin` | Origen de datos |
| `createdAt` | `DateTime` | Fecha de creacion |

## PATCH /api/injection-applications/{id}/date

Edita solamente la fecha de una aplicacion calculada. Actualiza `applicationDate`, `selectedDate`, marca `wasManuallyAdjusted = true`, recalcula `dataOrigin` segun el rol y registra trazabilidad conservando el estado actual.

### Parametros de ruta

| Parametro | Tipo | Requerido | Descripcion |
| --- | --- | --- | --- |
| `id` | `Guid` | Si | Identificador de la aplicacion |

### Body

```json
{
  "newDate": "2026-08-13T00:00:00",
  "changeReason": "Ajuste manual de fecha calculada",
  "notes": "Nueva fecha acordada con el paciente"
}
```

| Campo | Tipo | Requerido | Validaciones | Descripcion |
| --- | --- | --- | --- | --- |
| `newDate` | `DateTime` | Si | - | Nueva fecha de aplicacion |
| `changeReason` | `string?` | No | Maximo `500` caracteres | Motivo del cambio |
| `notes` | `string?` | No | Maximo `1000` caracteres | Observaciones; si es `null`, conserva las existentes |

### Respuesta 200

Devuelve un `InjectionApplicationResponse`.

### Errores

- `401 Unauthorized`: token invalido o un `Doctor` intenta modificar una aplicacion que no esta pendiente.
- `404 Not Found`: aplicacion inexistente.

