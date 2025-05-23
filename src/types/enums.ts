

export enum NCStatus {
  Open = "Open",
  OnHold = "On Hold",
  UnderReview = "Under Review",
  InProgress = "In Progress",
  Resolved = "Resolved",
  Completed = "Completed",
  Closed = "Closed",
  Released = "Released",
  Disposed = "Disposed",
  Approved = "Approved",
  Rejected = "Rejected",
  Overdue = "Overdue",
  PendingVerification = "Pending Verification",
  Verified = "Verified"
}

export enum DocumentStatus {
  Draft = "Draft",
  PendingReview = "Pending Review",
  InReview = "In Review",
  Approved = "Approved",
  Published = "Published",
  Archived = "Archived",
  Obsolete = "Obsolete",
  Active = "Active",
  PendingApproval = "Pending Approval",
  Rejected = "Rejected",
  Expired = "Expired"
}

export enum CheckoutStatus {
  Available = "Available",
  CheckedOut = "Checked Out",
  Locked = "Locked"
}

export enum TrainingStatus {
  NotStarted = "Not Started",
  InProgress = "In Progress",
  Completed = "Completed",
  Overdue = "Overdue",
  Cancelled = "Cancelled"
}

export enum TrainingType {
  Onboarding = "Onboarding",
  Compliance = "Compliance",
  Technical = "Technical",
  Safety = "Safety",
  Quality = "Quality",
  Management = "Management",
  Other = "Other"
}

export enum TrainingCategory {
  FoodSafety = "Food_Safety",
  HACCP = "HACCP",
  SQF = "SQF",
  GMP = "GMP",
  Sanitation = "Sanitation",
  Allergen = "Allergen",
  RegulatoryCompliance = "Regulatory_Compliance",
  EquipmentOperation = "Equipment_Operation",
  Other = "Other"
}

// CAPA enums
export enum CAPAStatus {
  Open = "Open",
  InProgress = "In Progress",
  PendingVerification = "Pending Verification",
  Verified = "Verified",
  Closed = "Closed",
  Overdue = "Overdue",
  // Adding the missing status values that are being used in components
  Completed = "Completed",
  Rejected = "Rejected",
  OnHold = "On Hold",
  UnderReview = "Under Review"
}

export enum CAPAPriority {
  Low = "Low",
  Medium = "Medium",
  High = "High",
  Critical = "Critical"
}

export enum CAPASource {
  Audit = "Audit",
  CustomerComplaint = "Customer Complaint",
  InternalReport = "Internal Report",
  NonConformance = "Non Conformance",
  RegulatoryInspection = "Regulatory Inspection",
  SupplierIssue = "Supplier Issue",
  Other = "Other"
}

export enum CAPAEffectivenessRating {
  NotEffective = "Not Effective",
  PartiallyEffective = "Partially Effective",
  Effective = "Effective",
  HighlyEffective = "Highly Effective"
}

// Adding the missing complaint enums
export enum ComplaintCategory {
  ProductQuality = "Product_Quality",
  FoodSafety = "Food_Safety", 
  Packaging = "Packaging",
  ForeignMaterial = "Foreign_Matter", 
  Allergen = "Allergen",
  CustomerService = "Customer_Service",
  Documentation = "Documentation",
  Other = "Other"
}

export enum ComplaintStatus {
  New = "New",
  Under_Investigation = "Under_Investigation",
  Resolved = "Resolved",
  Closed = "Closed",
  Reopened = "Reopened"
}

export enum ComplaintPriority {
  Low = "Low",
  Medium = "Medium",
  High = "High",
  Critical = "Critical"
}

