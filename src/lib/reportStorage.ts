import type { ReportData } from "@/components/AnalysisReportCard";
import type { DoctorReportData } from "@/components/DoctorReportCard";

const INSTITUTIONAL_KEY = "ars_primera_institutional_reports";
const DOCTOR_KEY = "ars_primera_doctor_reports";

export interface StoredInstitutionalReport {
  id: string;
  rnc: string;
  centerName: string;
  savedAt: string;
  data: ReportData;
}

export interface StoredDoctorReport {
  id: string;
  providerCode: string;
  doctorName: string;
  savedAt: string;
  data: DoctorReportData;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// --- Institutional Reports ---

export function getInstitutionalReports(): StoredInstitutionalReport[] {
  try {
    const raw = localStorage.getItem(INSTITUTIONAL_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveInstitutionalReport(data: ReportData): StoredInstitutionalReport {
  const reports = getInstitutionalReports();
  const existingIndex = data.rnc?.trim()
    ? reports.findIndex((r) => r.rnc === data.rnc.trim())
    : -1;

  const entry: StoredInstitutionalReport = {
    id: existingIndex >= 0 ? reports[existingIndex].id : generateId(),
    rnc: data.rnc?.trim() || "",
    centerName: data.centerName,
    savedAt: new Date().toISOString(),
    data,
  };

  if (existingIndex >= 0) {
    reports[existingIndex] = entry;
  } else {
    reports.unshift(entry);
  }

  localStorage.setItem(INSTITUTIONAL_KEY, JSON.stringify(reports));
  return entry;
}

export function findInstitutionalByRnc(rnc: string): StoredInstitutionalReport | undefined {
  return getInstitutionalReports().find((r) => r.rnc === rnc.trim());
}

export function deleteInstitutionalReport(id: string): void {
  const reports = getInstitutionalReports().filter((r) => r.id !== id);
  localStorage.setItem(INSTITUTIONAL_KEY, JSON.stringify(reports));
}

// --- Doctor Reports ---

export function getDoctorReports(): StoredDoctorReport[] {
  try {
    const raw = localStorage.getItem(DOCTOR_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveDoctorReport(data: DoctorReportData): StoredDoctorReport {
  const reports = getDoctorReports();
  const existingIndex = data.providerCode?.trim()
    ? reports.findIndex((r) => r.providerCode === data.providerCode.trim())
    : -1;

  const entry: StoredDoctorReport = {
    id: existingIndex >= 0 ? reports[existingIndex].id : generateId(),
    providerCode: data.providerCode?.trim() || "",
    doctorName: data.doctorName,
    savedAt: new Date().toISOString(),
    data,
  };

  if (existingIndex >= 0) {
    reports[existingIndex] = entry;
  } else {
    reports.unshift(entry);
  }

  localStorage.setItem(DOCTOR_KEY, JSON.stringify(reports));
  return entry;
}

export function findDoctorByCode(code: string): StoredDoctorReport | undefined {
  return getDoctorReports().find((r) => r.providerCode === code.trim());
}

export function deleteDoctorReport(id: string): void {
  const reports = getDoctorReports().filter((r) => r.id !== id);
  localStorage.setItem(DOCTOR_KEY, JSON.stringify(reports));
}
