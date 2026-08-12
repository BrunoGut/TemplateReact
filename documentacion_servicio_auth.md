# Documentacion del servicio de Auth

Referencia tecnica de los endpoints de autenticacion y acceso disponibles en la API.

Base path sugerido en desarrollo:

```txt
https://localhost:{puerto}
```

Todas las rutas documentadas son relativas a esa base.

## Resumen de endpoints

| Metodo | Ruta | Proposito | Autorizacion |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Iniciar registro de usuario interno | Publico |
| `POST` | `/api/auth/confirm-email` | Confirmar email de usuario interno | Publico |
| `POST` | `/api/auth/login` | Iniciar sesion de usuario interno | Publico |
| `POST` | `/api/patient-access` | Generar token limitado de paciente | Publico |

> Nota: `/api/patient-access` no esta implementado en `AuthService`, sino en `PatientService`, pero forma parte del flujo de autenticacion/acceso del sistema.

## Autorizacion general

Los endpoints de Auth no tienen atributo `[Authorize]`, por lo que actualmente son publicos.

Para consumir endpoints protegidos del sistema con el token emitido por login:

```http
Authorization: Bearer {accessToken}
Content-Type: application/json
```

Roles internos permitidos:

```ts
enum UserRole {
  Admin = 1,
  Doctor = 2
}
```

## JWT de usuarios internos

El endpoint `/api/auth/login` devuelve un JWT para usuarios internos.

Claims incluidos:

| Claim | Valor |
| --- | --- |
| `sub` | `User.Id` |
| `email` | Email del usuario |
| `fullName` | Nombre completo |
| `role` | Rol del usuario (`Admin` o `Doctor`) |
| `jti` | Identificador unico del token |

Configuracion de validacion:

- Issuer: `Jwt:Issuer`
- Audience: `Jwt:Audience`
- Firma: `Jwt:Key` con HMAC SHA-256
- Expiracion: `Jwt:ExpirationHours`, default `12` horas si no esta configurado

La respuesta actual informa `expiresInSeconds: 43200`, equivalente a 12 horas.

## POST /api/auth/register

Inicia el registro de un usuario interno (`Admin` o `Doctor`). Crea el usuario inactivo, genera un codigo de confirmacion de email y envia el codigo por correo.

Autorizacion: publico.

### Body

```json
{
  "fullName": "Nombre Apellido",
  "email": "medico@example.com",
  "password": "password123",
  "role": 2
}
```

### Parametros

| Campo | Tipo | Requerido | Validaciones | Descripcion |
| --- | --- | --- | --- | --- |
| `fullName` | `string` | Si | Maximo 200 caracteres | Nombre completo del usuario interno |
| `email` | `string` | Si | Formato email, maximo 256 caracteres | Email unico del usuario |
| `password` | `string` | Si | Minimo 8 caracteres | Password en texto plano enviada para ser hasheada |
| `role` | `number` | Si | Debe existir en `UserRole` | `1 = Admin`, `2 = Doctor` |

### Respuesta 200

```json
{
  "userId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "email": "medico@example.com",
  "message": "Registro iniciado. Revise su email para confirmar la cuenta."
}
```

### Errores

| Status | Causa | Respuesta |
| --- | --- | --- |
| `400 Bad Request` | Rol invalido | `{ "message": "Rol invalido. Los roles permitidos son Admin y Doctor." }` |
| `400 Bad Request` | Email ya registrado | `{ "message": "Ya existe un usuario registrado con ese email." }` |
| `400 Bad Request` | Error de validacion del modelo | Respuesta automatica de ASP.NET Core con detalle de validaciones |

### Reglas de negocio

- El usuario se crea con `IsActive = false`.
- El usuario se crea con `EmailConfirmed = false`.
- El codigo de confirmacion vence a los 60 minutos.
- El password se guarda hasheado, no en texto plano.
- Al registrarse correctamente se envia un email con el codigo de confirmacion.

## POST /api/auth/confirm-email

Confirma el email de un usuario interno usando el codigo enviado por correo. Si la confirmacion es correcta, activa la cuenta.

Autorizacion: publico.

### Body

```json
{
  "email": "medico@example.com",
  "code": "123456"
}
```

### Parametros

| Campo | Tipo | Requerido | Validaciones | Descripcion |
| --- | --- | --- | --- | --- |
| `email` | `string` | Si | Formato email | Email del usuario a confirmar |
| `code` | `string` | Si | Requerido | Codigo de confirmacion recibido por email |

### Respuesta 200

```json
{
  "message": "Email confirmado correctamente. Ya puede iniciar sesion."
}
```

### Errores

| Status | Causa | Respuesta |
| --- | --- | --- |
| `400 Bad Request` | Usuario inexistente | `{ "message": "Usuario no encontrado." }` |
| `400 Bad Request` | Email ya confirmado | `{ "message": "El email ya fue confirmado." }` |
| `400 Bad Request` | Codigo incorrecto | `{ "message": "Codigo de confirmacion invalido." }` |
| `400 Bad Request` | Codigo vencido | `{ "message": "El codigo de confirmacion ha expirado." }` |
| `400 Bad Request` | Error de validacion del modelo | Respuesta automatica de ASP.NET Core con detalle de validaciones |

### Reglas de negocio

- El email debe existir en la base.
- El email no debe estar confirmado previamente.
- El codigo recibido debe coincidir con `EmailConfirmationCode`.
- `EmailConfirmationCodeExpiresAt` debe ser mayor o igual que la fecha/hora UTC actual.
- Al confirmar:
  - `EmailConfirmed = true`
  - `IsActive = true`
  - `EmailConfirmationCode = null`
  - `EmailConfirmationCodeExpiresAt = null`

## POST /api/auth/login

Inicia sesion como usuario interno (`Admin` o `Doctor`) y devuelve un JWT Bearer.

Autorizacion: publico.

### Body

```json
{
  "email": "medico@example.com",
  "password": "password123"
}
```

### Parametros

| Campo | Tipo | Requerido | Validaciones | Descripcion |
| --- | --- | --- | --- | --- |
| `email` | `string` | Si | Formato email | Email del usuario interno |
| `password` | `string` | Si | Requerido | Password del usuario |

### Respuesta 200

```json
{
  "accessToken": "{jwt}",
  "tokenType": "Bearer",
  "expiresInSeconds": 43200
}
```

### Errores

| Status | Causa | Respuesta |
| --- | --- | --- |
| `401 Unauthorized` | Usuario inexistente | `{ "message": "Credenciales invalidas." }` |
| `401 Unauthorized` | Password incorrecto | `{ "message": "Credenciales invalidas." }` |
| `401 Unauthorized` | Usuario inactivo | `{ "message": "El usuario no esta activo." }` |
| `401 Unauthorized` | Email no confirmado | `{ "message": "Debe confirmar su email antes de iniciar sesion." }` |
| `400 Bad Request` | Error de validacion del modelo | Respuesta automatica de ASP.NET Core con detalle de validaciones |

### Reglas de negocio

- El email debe existir.
- El password debe coincidir con el hash guardado.
- El usuario debe estar activo.
- El email debe estar confirmado.
- Si todo es correcto, se emite un token con rol interno (`Admin` o `Doctor`).

## POST /api/patient-access

Permite que un paciente acceda al portal ingresando DNI y fecha de nacimiento. Devuelve un token Bearer limitado a endpoints protegidos con la policy `PatientAccess`.

Autorizacion: publico.

### Body

```json
{
  "dni": "12345678",
  "dateOfBirth": "1980-05-20"
}
```

### Parametros

| Campo | Tipo | Requerido | Validaciones | Descripcion |
| --- | --- | --- | --- | --- |
| `dni` | `string` | Si | Requerido | DNI del paciente |
| `dateOfBirth` | `DateTime` | Si | Requerido | Fecha de nacimiento del paciente |

### Respuesta 200

```json
{
  "accessToken": "{jwt}",
  "tokenType": "Bearer",
  "expiresInSeconds": 43200,
  "patientId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
}
```

### Errores

| Status | Causa | Respuesta |
| --- | --- | --- |
| `401 Unauthorized` | No existe paciente activo con esos datos | `{ "message": "No se encontro un paciente activo con los datos ingresados." }` |
| `401 Unauthorized` | Paciente inactivo | `{ "message": "El paciente no esta activo en el sistema." }` |
| `400 Bad Request` | Error de validacion del modelo | Respuesta automatica de ASP.NET Core con detalle de validaciones |

### JWT de paciente

Claims incluidos:

| Claim | Valor |
| --- | --- |
| `patientId` | Id del paciente |
| `patientDni` | DNI del paciente |
| `tokenType` | `patient` |
| `jti` | Identificador unico del token |

Este token no usa roles internos. Para endpoints del portal se valida la policy:

```csharp
policy.RequireClaim("tokenType", "patient")
```

## Notas para frontend

- Usar `Content-Type: application/json` en todos los requests.
- No enviar `Authorization` en estos endpoints: actualmente son publicos.
- Guardar el `accessToken` devuelto por login interno para endpoints protegidos de usuarios internos.
- Guardar el `accessToken` devuelto por `/api/patient-access` solo para endpoints del portal paciente.
- No mezclar tokens: el token de paciente no tiene `role`, y el token interno no tiene `tokenType = patient`.

## Archivos fuente relacionados

- `TemplateAPI/Controllers/AuthController.cs`
- `TemplateAPI/Controllers/PatientAccessController.cs`
- `Application/Services/AuthService.cs`
- `Application/Services/PatientService.cs`
- `Application/DTOs/Auth/*`
- `Infrastructure/Services/JwtService.cs`
- `TemplateAPI/Program.cs`
