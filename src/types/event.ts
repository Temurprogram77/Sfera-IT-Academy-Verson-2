// Event uchun asosiy interface
export interface IEvent {
  id: number;
  name: string;
  description: string;
  date: string; // "YYYY-MM-DD" formatida
  startTime: string;
  endTime: string;
  color: "QIZIL" | "YASHIL" | "SARIQ"; // Backend dan keladigan rang
  groupNames: string[];
}

// Event yaratish uchun
export interface ICreateEvent {
  name: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  groupIds: number[];
}

// Event yangilash uchun
export interface IUpdateEvent {
  id: number;
  name: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  groupIds: number[];
}

// API javoblari
export interface IEventListResponse {
  success: boolean;
  message: string;
  data: IEvent[];
}

export interface IEventActionResponse {
  success: boolean;
  message: string;
  data: IEvent | null;
}

// Formalar uchun
export interface IEventFormValues {
  name: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  groupIds: number[];
}