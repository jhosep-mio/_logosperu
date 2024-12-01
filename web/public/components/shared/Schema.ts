import * as Yup from "yup";

export const SchemaForm = Yup.object().shape({
  nombres: Yup.string()
    .required("Este campo es requerido")
    .min(3, "Debe tener como minimo 3 digitos")
    .max(255, "Debe tener menos de 255 caracteres"),
  celular: Yup.string()
    .required("Este campo es requerido")
    .min(9, "Debe tener como minimo 9 digitos")
    .max(255, "Debe tener menos de 255 caracteres"),
  mensaje: Yup.string()
    .required("Este campo es requerido")
    .max(255, "Debe tener menos de 255 caracteres"),
  email: Yup.string()
    .required("Este campo es requerido")
    .email("Introduce un email válido")
    .max(255, "Debe tener menos de 255 caracteres"),
});

export const SchemaBoletin = Yup.object().shape({
  nombre: Yup.string()
    .required("Este campo es requerido")
    .min(3, "Debe tener como minimo 3 digitos")
    .max(255, "Debe tener menos de 255 caracteres"),
  email: Yup.string()
    .required("Este campo es requerido")
    .email("Introduce un email válido")
    .max(255, "Debe tener menos de 255 caracteres"),
});

export const SchemaPago = Yup.object().shape({
  nombres: Yup.string()
    .required("Este campo es requerido")
    .min(3, "Debe tener como minimo 3 digitos")
    .max(20, "Debe tener menos de 20 caracteres"),
  apellidos: Yup.string()
    .required("Este campo es requerido")
    .min(3, "Debe tener como minimo 3 digitos")
    .max(20, "Debe tener menos de 20 caracteres"),
  mensaje: Yup.string()
    .nullable()
    .max(200, "Debe tener menos de 200 caracteres"),
  pais: Yup.string()
    .required("Este campo es requerido")
    .max(20, "Debe tener menos de 20 caracteres"),
  celular: Yup.string()
    .required("Este campo es requerido")
    .min(7, "Debe tener como minimo 7 digitos")
    .max(20, "Debe tener menos de 20 caracteres"),
  email: Yup.string()
    .required("Este campo es requerido")
    .email("Introduce un email válido")
    .max(30, "Debe tener menos de 20 caracteres"),
  conFactura: Yup.string().required("Este campo es requerido"),
  razonSocial: Yup.string()
    .test("is-required-if", "Es requerido", function (value) {
      const { conFactura } = this.parent;
      if (conFactura === "Con factura") {
        return Yup.string().required().isValidSync(value);
      }
      return true;
    })
    .nullable(),
  ruc: Yup.string()
    .test("is-required-if", "Es requerido", function (value) {
      const { conFactura } = this.parent;
      if (conFactura === "Con factura") {
        return Yup.string().required().isValidSync(value);
      }
      return true;
    })
    .nullable(),
});
