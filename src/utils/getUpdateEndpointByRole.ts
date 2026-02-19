import { API_ENDPOINTS } from "@/api/endpoints";

export function getUpdateEndpointByRole(role: string) {
  switch (role) {
    case "ROLE_STUDENT":
      return API_ENDPOINTS.STUDENT.UPDATE;

    case "ROLE_TEACHER":
      return API_ENDPOINTS.TEACHER.UPDATE;

    case "ROLE_ADMIN":
    case "ROLE_SUPER_ADMIN":
      return API_ENDPOINTS.ADMIN.UPDATE_ADMIN;

    case "ROLE_PARENT":
      return API_ENDPOINTS.PARENT.UPDATE;

    default:
      throw new Error("Noma'lum role");
  }
}
